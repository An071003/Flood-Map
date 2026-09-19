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
  profile: VehicleProfile,
  candidateIndex = 0
): RouteCandidate {
  let totalDistanceMeters = 0;
  let rawTravelSeconds = 0;
  let maxDepthCm: number | undefined = undefined;
  let warningCount = 0;
  let severeCount = 0;
  let unknownCount = 0;
  let knownMeters = 0;
  let hasKnownDepth = false;

  let worstSegment: {
    roadName: string;
    depthCm?: number;
    riskLevel: 'safe' | 'watch' | 'warning' | 'severe' | 'unknown';
  } | null = null;

  const allCoordinates: [number, number][] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    totalDistanceMeters += seg.lengthMeters;

    // Vehicle-adjusted base speed
    // Cars move faster on trunk/primary arteries; Motorbikes move more agilely in secondary/tertiary
    let speedFactor = 1.0;
    if (profile.type === 'car') {
      speedFactor = seg.roadClass === 'trunk' ? 0.85 : seg.roadClass === 'primary' ? 0.92 : 1.05;
    } else {
      speedFactor = seg.roadClass === 'trunk' ? 1.05 : seg.roadClass === 'secondary' ? 0.95 : 0.9;
    }
    rawTravelSeconds += Math.round(seg.estimatedTravelSeconds * speedFactor);

    const floodState = seg.floodForecast[hour] || seg.floodForecast[0];

    if (!floodState || floodState.status === 'unknown') {
      unknownCount++;
    } else {
      knownMeters += seg.lengthMeters;
      const depth = floodState.estimatedDepthCm ?? 0;
      hasKnownDepth = true;

      if (maxDepthCm === undefined || depth > maxDepthCm) {
        maxDepthCm = depth;
      }

      if (floodState.riskLevel === 'severe') {
        severeCount++;
      } else if (floodState.riskLevel === 'warning') {
        warningCount++;
      }

      if (!worstSegment || (worstSegment.depthCm !== undefined && depth > worstSegment.depthCm) || worstSegment.depthCm === undefined) {
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
        allCoordinates.push(...coords.slice(1));
      }
    }
  }

  const coveragePercent =
    totalDistanceMeters > 0
      ? Math.round((knownMeters / totalDistanceMeters) * 100)
      : 100;

  // Realistic vehicle-specific delay caused by standing water & traffic crawling
  // Motorbikes must slow down drastically in 15cm+ or risk hydro-locking
  const waterDelay =
    profile.type === 'motorbike'
      ? severeCount * 300 + warningCount * 90
      : severeCount * 220 + warningCount * 45;

  const totalDurationSeconds = rawTravelSeconds + waterDelay;

  // Vehicle Suitability Score (0..100)
  let floodPenalty = 0;
  if (hasKnownDepth && maxDepthCm !== undefined) {
    const impassableDepth = profile.type === 'motorbike' ? 25 : 35;
    floodPenalty = Math.min(50, Math.round((maxDepthCm / impassableDepth) * 45));
  }
  const severeDeduction = severeCount * (profile.type === 'motorbike' ? 35 : 25);
  const warningDeduction = warningCount * (profile.type === 'motorbike' ? 14 : 8);
  const unknownDeduction = unknownCount * 8;
  const timeDeduction = Math.min(20, Math.round(totalDurationSeconds / 180));

  const rawScore = 100 - floodPenalty - severeDeduction - warningDeduction - unknownDeduction - timeDeduction;
  const routeScore = Math.max(15, Math.min(99, Math.round(rawScore)));

  // Recommendation State (Strictly adhere to NO safety guarantee wording)
  let recommendationState: RouteCandidate['recommendationState'] = 'favorable';
  let recommendationText = '';
  let explanation = '';

  const impassableDepth = profile.type === 'motorbike' ? 25 : 35;

  if (coveragePercent < 60 || unknownCount >= 2) {
    recommendationState = 'insufficient_data';
    recommendationText = 'Dữ liệu đo chưa đầy đủ trên một số đoạn. Cần thận trọng quan sát thực địa.';
  } else if ((maxDepthCm !== undefined && maxDepthCm >= impassableDepth) || severeCount > 0) {
    recommendationState = 'not_recommended';
    recommendationText = `Có điểm ngập sâu (~${maxDepthCm ?? 30} cm). Không khuyến nghị ${profile.label.toLowerCase()} lưu thông.`;
  } else if ((maxDepthCm !== undefined && maxDepthCm >= (profile.type === 'motorbike' ? 12 : 20)) || warningCount > 0) {
    recommendationState = 'caution';
    recommendationText = `Mực nước ước tính ~${maxDepthCm ?? 15} cm. Cần thận trọng khi di chuyển qua vùng trũng.`;
  } else {
    recommendationState = 'favorable';
    recommendationText = 'Ít rủi ro ngập hơn theo mô hình trong khung giờ dự báo đã chọn.';
  }

  // Strategy Label & Explanation
  let strategyLabel = '';
  if (strategy === 'LEAST_FLOOD') {
    strategyLabel = 'Ít ngập nhất';
    explanation = worstSegment && worstSegment.depthCm !== undefined && worstSegment.depthCm > 0
      ? `Ưu tiên né tối đa các điểm ngập sâu. Điểm ngập cao nhất: ${worstSegment.roadName} (~${worstSegment.depthCm} cm).`
      : 'Lộ trình cao ráo, đi qua các trục đường chính thoát nước tốt.';
  } else if (strategy === 'BALANCED') {
    strategyLabel = 'Cân bằng';
    explanation = 'Hài hòa giữa thời gian di chuyển và hạn chế tối đa các đoạn ngập nghiêm trọng.';
  } else {
    strategyLabel = 'Nhanh nhất';
    explanation = 'Lộ trình tối ưu theo khoảng cách và tốc độ lưu thông, có thể đi qua một số vùng đọng nước.';
  }

  const evaluation = {
    totalDistanceMeters,
    knownDistanceMeters: knownMeters,
    dataCoverage: coveragePercent,
    unknownSegmentCount: unknownCount,
    maxEstimatedDepthCm: hasKnownDepth ? maxDepthCm : undefined,
    worstKnownSegmentId: worstSegment?.roadName,
  };

  return {
    id: `route-${profile.type}-${strategy.toLowerCase()}-${candidateIndex}`,
    strategy,
    strategyLabel,
    vehicle: profile.type,
    routeScore,
    segments,
    totalDistanceMeters,
    totalDurationSeconds,
    evaluation,
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
