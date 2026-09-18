import { ConfidenceBand, RiskLevel, RoadSegment } from '../../types';

export interface RoadFloodCalculationInput {
  baseElevationScore: number; // 0..1
  poorDrainageScore: number; // 0..1
  historicalFloodScore: number; // 0..1
  rainRateMmH: number;
  rain3hMm: number;
  tideImpactM: number;
  forecastHour?: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Visual height mapping for 3D road flood ribbon from IMPLEMENT-V3.2-PROMPT.md & docs/27-3D-DEPTH-POLISH.md
 * visualHeight = clamp(0.12 + depthCm * 0.03, 0.12, 1.8)
 * 5–7 cm: low (0.27 - 0.33)
 * 15 cm: low-mid (0.57)
 * 25–30 cm: distinct (0.87 - 1.02)
 * 37+ cm: prominent (1.23 - 1.80)
 */
export function calculate3DHeight(depthCm: number): number {
  return clamp(0.12 + depthCm * 0.03, 0.12, 1.8);
}

export function determineRiskLevel(depthCm: number): RiskLevel {
  if (depthCm <= 5) return 'safe';
  if (depthCm <= 15) return 'watch';
  if (depthCm <= 30) return 'warning';
  return 'severe';
}

export function determineConfidenceBand(
  forecastHour: number,
  hasSensor = false
): { band: ConfidenceBand; score: number } {
  let score = 0.88;
  if (!hasSensor) score -= 0.06;
  if (forecastHour > 0) {
    score -= clamp(forecastHour * 0.02, 0, 0.35);
  }

  const rounded = Math.round(score * 100) / 100;
  if (rounded >= 0.8) return { band: 'high', score: rounded };
  if (rounded >= 0.65) return { band: 'medium', score: rounded };
  return { band: 'low', score: rounded };
}

export function calculateRoadSegmentState(
  road: RoadSegment,
  rainRateMmH: number,
  rain3hMm: number,
  tideLevelM: number,
  forecastHour = 0
): RoadSegment {
  const p = road.properties;

  // Normalized features
  const normRainRate = clamp(rainRateMmH / 45, 0, 1);
  const normRain3h = clamp(rain3hMm / 75, 0, 1);
  const normTide = clamp(tideLevelM / 1.0, 0, 1);

  // Deterministic road flood score
  const score =
    0.28 * normRain3h +
    0.2 * normRainRate +
    0.2 * p.lowElevationScore +
    0.16 * p.poorDrainageScore +
    0.1 * p.historicalFloodScore +
    0.06 * normTide;

  // Depth in cm based on risk curve
  let depthCm = 0;
  if (score < 0.28) {
    depthCm = Math.round(score * 14);
  } else if (score < 0.48) {
    depthCm = Math.round(5 + ((score - 0.28) / 0.2) * 10);
  } else if (score < 0.7) {
    depthCm = Math.round(16 + ((score - 0.48) / 0.22) * 14);
  } else {
    const excess = clamp((score - 0.7) / 0.3, 0, 1);
    depthCm = Math.round(31 + excess * 24);
  }

  const riskLevel = determineRiskLevel(depthCm);
  const { band, score: confScore } = determineConfidenceBand(forecastHour);

  // Drain duration
  const drainFactor = 1 + p.poorDrainageScore * 0.9;
  const drainageMinutes = Math.max(15, Math.round(depthCm * 3.2 * drainFactor));

  // Dynamic advice
  let advice = p.advice;
  if (riskLevel === 'safe') {
    advice = 'Tuyến đường lưu thông bình thường, mặt đường khô ráo.';
  } else if (riskLevel === 'watch') {
    advice = 'Đoạn đường có nước đọng nông. Xe hai bánh giảm tốc độ, chú ý lề đường.';
  } else if (riskLevel === 'warning') {
    advice = 'Nước ngập 16–30 cm. Xe gầm thấp hạn chế di chuyển, nên chọn trục đường thay thế.';
  } else if (riskLevel === 'severe') {
    advice = 'Nguy cơ ngập sâu > 30 cm gây chết máy hàng loạt. Tuyệt đối không cố vượt qua.';
  }

  return {
    ...road,
    properties: {
      ...p,
      estimatedDepthCm: depthCm,
      riskLevel,
      rain1hMm: Math.round(rainRateMmH * 10) / 10,
      rain3hMm: Math.round(rain3hMm * 10) / 10,
      tideImpactM: Math.round(tideLevelM * 100) / 100,
      drainageMinutes,
      confidenceBand: band,
      confidenceScore: confScore,
      advice,
      isSimulated: true,
      updatedAt: '14:32',
    },
  };
}
