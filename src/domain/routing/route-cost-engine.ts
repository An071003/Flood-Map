import {
  GraphRoadSegment,
  RouteCandidate,
  RouteStrategy,
  VehicleProfile,
} from '../../types';
import { getDepthPenalty } from './vehicle-profiles';

export interface StrategyWeights {
  timeWeight: number;
  floodWeight: number;
  unknownWeight: number;
}

export const STRATEGY_WEIGHTS: Record<RouteStrategy, StrategyWeights> = {
  LEAST_FLOOD: {
    timeWeight: 0.3,
    floodWeight: 1.5,
    unknownWeight: 1.2,
  },
  BALANCED: {
    timeWeight: 0.8,
    floodWeight: 0.8,
    unknownWeight: 0.9,
  },
  FASTEST: {
    timeWeight: 1.2,
    floodWeight: 0.3,
    unknownWeight: 0.5,
  },
};

/**
 * Calculates the traversal cost for an edge/segment given a vehicle profile, forecast hour, and strategy
 */
export function calculateSegmentCost(
  segment: GraphRoadSegment,
  profile: VehicleProfile,
  hour: number,
  strategy: RouteStrategy
): number {
  const weights = STRATEGY_WEIGHTS[strategy];
  const timeCost = segment.estimatedTravelSeconds * weights.timeWeight;

  const floodState = segment.floodForecast[hour] || segment.floodForecast[0];

  if (!floodState || floodState.status === 'unknown') {
    // UNKNOWN Rule: Never assume 0 cm. Apply vehicle unknown penalty.
    const unknownCost = profile.unknownPenalty * weights.unknownWeight;
    return timeCost + unknownCost;
  }

  const depth = floodState.estimatedDepthCm ?? 0;
  const depthPen = getDepthPenalty(depth, profile);

  let riskPen = 0;
  if (floodState.riskLevel === 'severe') {
    riskPen = profile.severePenalty;
  } else if (floodState.riskLevel === 'warning') {
    riskPen = profile.warningPenalty;
  }

  const floodCost = (depthPen + riskPen) * weights.floodWeight;
  return timeCost + floodCost;
}

/**
 * Evaluates a sequence of segments into a full RouteCandidate with complete metrics
 */
export function evaluateRoute(
  segments: GraphRoadSegment[],
  strategy: RouteStrategy,
  hour: number,
  profile: VehicleProfile
): RouteCandidate {
  let totalDistanceMeters = 0;
  let baseTravelSeconds = 0;
  let maxDepthCm = 0;
  let warningCount = 0;
  let severeCount = 0;
  let unknownCount = 0;
  let knownMeters = 0;

  let worstSegment: {
    roadName: string;
    depthCm: number;
    riskLevel: 'safe' | 'watch' | 'warning' | 'severe' | 'unknown';
  } | null = null;

  const allCoordinates: [number, number][] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    totalDistanceMeters += seg.lengthMeters;
    baseTravelSeconds += seg.estimatedTravelSeconds;

    const floodState = seg.floodForecast[hour] || seg.floodForecast[0];

    if (!floodState || floodState.status === 'unknown') {
      unknownCount++;
    } else {
      knownMeters += seg.lengthMeters;
      const depth = floodState.estimatedDepthCm ?? 0;
      if (depth > maxDepthCm) {
        maxDepthCm = depth;
      }

      if (floodState.riskLevel === 'severe') {
        severeCount++;
      } else if (floodState.riskLevel === 'warning') {
        warningCount++;
      }

      if (!worstSegment || depth > worstSegment.depthCm) {
        worstSegment = {
          roadName: seg.roadName,
          depthCm: depth,
          riskLevel: floodState.riskLevel || 'safe',
        };
      }
    }

    // Stitch coordinates continuously
    const coords = seg.geometry.coordinates;
    if (coords.length > 0) {
      if (allCoordinates.length === 0) {
        allCoordinates.push(...coords);
      } else {
        // Skip first point if it connects to previous point
        allCoordinates.push(...coords.slice(1));
      }
    }
  }

  const coveragePercent =
    totalDistanceMeters > 0
      ? Math.round((knownMeters / totalDistanceMeters) * 100)
      : 100;

  // Add realistic delay for water/traffic
  const waterDelay = severeCount * 180 + warningCount * 60;
  const totalDurationSeconds = baseTravelSeconds + waterDelay;

  // Recommendation State (No guarantee wording allowed!)
  let recommendationState: RouteCandidate['recommendationState'] = 'favorable';
  let recommendationText = '';
  let explanation = '';

  const isMotorbike = profile.type === 'motorbike';
  const impassableDepth = isMotorbike ? 25 : 35;

  if (coveragePercent < 65 || unknownCount >= 2) {
    recommendationState = 'insufficient_data';
    recommendationText = 'Dữ liệu đo chưa đầy đủ trên một số đoạn. Khuyến nghị theo dõi thực địa.';
  } else if (maxDepthCm >= impassableDepth || severeCount > 0) {
    recommendationState = 'not_recommended';
    recommendationText = `Có điểm ngập sâu (${maxDepthCm} cm). Không khuyến nghị phương tiện ${profile.label.toLowerCase()} lưu thông.`;
  } else if (maxDepthCm >= 15 || warningCount > 0) {
    recommendationState = 'caution';
    recommendationText = `Mực nước ước tính ${maxDepthCm} cm. Cần thận trọng khi di chuyển qua vùng trũng.`;
  } else {
    recommendationState = 'favorable';
    recommendationText = 'Lộ trình ít nguy cơ ngập nhất trong khung giờ dự báo đã chọn.';
  }

  // Strategy Label & Explanation
  let strategyLabel = '';
  if (strategy === 'LEAST_FLOOD') {
    strategyLabel = 'Ít ngập nhất';
    explanation = worstSegment && worstSegment.depthCm > 0
      ? `Ưu tiên né tối đa các điểm ngập sâu. Điểm ngập cao nhất ghi nhận: ${worstSegment.roadName} (~${worstSegment.depthCm} cm).`
      : 'Tuyến đường cao ráo, đi qua các trục đường chính thoát nước tốt.';
  } else if (strategy === 'BALANCED') {
    strategyLabel = 'Cân bằng';
    explanation = 'Hài hòa giữa thời gian di chuyển và hạn chế tối đa các đoạn ngập nghiêm trọng.';
  } else {
    strategyLabel = 'Nhanh nhất';
    explanation = 'Lộ trình tối ưu theo khoảng cách và tốc độ lưu thông, có thể đi qua vùng nước trũng.';
  }

  return {
    id: `route-${strategy.toLowerCase()}`,
    strategy,
    strategyLabel,
    segments,
    totalDistanceMeters,
    totalDurationSeconds,
    maxDepthCm,
    worstSegment,
    warningCount,
    severeCount,
    unknownCount,
    coveragePercent,
    recommendationState,
    recommendationText,
    explanation,
    geometry: {
      type: 'LineString',
      coordinates: allCoordinates,
    },
  };
}
