import { AreaFlood, FloodSeverity } from '../../types';

export interface FloodModelInput {
  rainRateMmH: number;
  rain1hMm: number;
  rain3hMm: number;
  rain6hMm: number;
  lowElevationScore: number; // 0..1
  poorDrainageScore: number; // 0..1
  historicalFloodScore: number; // 0..1
  tidePressureScore?: number; // 0..1 (optional, undefined if missing)
  observedSensorSignal?: number; // 0..1 (optional)
  freshnessMinutes?: number;
  forecastHour?: number;
}

export const FLOOD_MODEL_WEIGHTS = {
  rainfallIntensity: 0.20,
  accumulation3h: 0.22,
  accumulation6h: 0.10,
  lowElevation: 0.14,
  poorDrainage: 0.12,
  historicalFlood: 0.10,
  tidePressure: 0.08,
  observedSensorSignal: 0.04,
} as const;

export const SEVERITY_THRESHOLDS = {
  safe: 0.30,
  watch: 0.50,
  warning: 0.72,
} as const;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Normalizes rainfall values into 0..1 scale
 */
export function normalizeRainfallIntensity(rateMmH: number): number {
  return clamp(rateMmH / 50, 0, 1);
}

export function normalizeAccumulation3h(accMm: number): number {
  return clamp(accMm / 80, 0, 1);
}

export function normalizeAccumulation6h(accMm: number): number {
  return clamp(accMm / 120, 0, 1);
}

/**
 * Calculates deterministic flood score and details based on input features
 */
export function calculateFloodRisk(input: FloodModelInput): AreaFlood {
  const normRainIntensity = normalizeRainfallIntensity(input.rainRateMmH);
  const normAcc3h = normalizeAccumulation3h(input.rain3hMm);
  const normAcc6h = normalizeAccumulation6h(input.rain6hMm);
  const lowElevation = clamp(input.lowElevationScore, 0, 1);
  const poorDrainage = clamp(input.poorDrainageScore, 0, 1);
  const historical = clamp(input.historicalFloodScore, 0, 1);
  const tide = clamp(input.tidePressureScore ?? 0.25, 0, 1);
  const sensor = clamp(input.observedSensorSignal ?? 0, 0, 1);

  // Compute weighted baseline score
  const score =
    FLOOD_MODEL_WEIGHTS.rainfallIntensity * normRainIntensity +
    FLOOD_MODEL_WEIGHTS.accumulation3h * normAcc3h +
    FLOOD_MODEL_WEIGHTS.accumulation6h * normAcc6h +
    FLOOD_MODEL_WEIGHTS.lowElevation * lowElevation +
    FLOOD_MODEL_WEIGHTS.poorDrainage * poorDrainage +
    FLOOD_MODEL_WEIGHTS.historicalFlood * historical +
    FLOOD_MODEL_WEIGHTS.tidePressure * tide +
    FLOOD_MODEL_WEIGHTS.observedSensorSignal * sensor;

  const roundedScore = Math.round(score * 1000) / 1000;

  // Determine severity
  let severity: FloodSeverity = 'safe';
  if (roundedScore >= SEVERITY_THRESHOLDS.warning) {
    severity = 'severe';
  } else if (roundedScore >= SEVERITY_THRESHOLDS.watch) {
    severity = 'warning';
  } else if (roundedScore >= SEVERITY_THRESHOLDS.safe) {
    severity = 'watch';
  }

  // Calculate estimated depth in cm
  let estimatedDepthCm = 0;
  if (severity === 'safe') {
    estimatedDepthCm = Math.round(roundedScore * 12);
  } else if (severity === 'watch') {
    estimatedDepthCm = Math.round(5 + ((roundedScore - SEVERITY_THRESHOLDS.safe) / (SEVERITY_THRESHOLDS.watch - SEVERITY_THRESHOLDS.safe)) * 10);
  } else if (severity === 'warning') {
    estimatedDepthCm = Math.round(16 + ((roundedScore - SEVERITY_THRESHOLDS.watch) / (SEVERITY_THRESHOLDS.warning - SEVERITY_THRESHOLDS.watch)) * 19);
  } else {
    // severe
    const excess = clamp((roundedScore - SEVERITY_THRESHOLDS.warning) / 0.28, 0, 1);
    estimatedDepthCm = Math.round(36 + excess * 26);
  }

  // Visual extrusion height: clamp(0.15 + depthCm * 0.028, 0.15, 2.1)
  const renderHeight = clamp(0.15 + estimatedDepthCm * 0.028, 0.15, 2.1);

  // Drain duration in minutes
  const drainFactor = 1 + poorDrainage * 0.8;
  const drainMinMinutes = Math.max(10, Math.round(estimatedDepthCm * 2.2 * drainFactor));
  const drainMaxMinutes = Math.max(25, Math.round(estimatedDepthCm * 3.8 * drainFactor));

  // Calculate confidence
  let confidence = 0.92;
  const hasTide = input.tidePressureScore !== undefined;
  if (!hasTide) confidence -= 0.12;
  if (input.observedSensorSignal === undefined) confidence -= 0.05;

  const freshness = input.freshnessMinutes ?? 5;
  if (freshness > 15) {
    confidence -= clamp((freshness - 15) * 0.006, 0, 0.25);
  }

  const forecastH = input.forecastHour ?? 0;
  if (forecastH > 0) {
    confidence -= clamp(forecastH * 0.022, 0, 0.35);
  }
  confidence = clamp(Math.round(confidence * 100) / 100, 0.20, 0.95);

  // Explainability: extract top contributing reasons
  const factors = [
    { text: 'Mưa tích lũy 3 giờ cao', weight: FLOOD_MODEL_WEIGHTS.accumulation3h * normAcc3h, value: normAcc3h },
    { text: 'Khu vực có độ trũng tương đối', weight: FLOOD_MODEL_WEIGHTS.lowElevation * lowElevation, value: lowElevation },
    { text: 'Lịch sử ghi nhận ngập thường xuyên', weight: FLOOD_MODEL_WEIGHTS.historicalFlood * historical, value: historical },
    { text: 'Hệ thống cống thoát nước chậm', weight: FLOOD_MODEL_WEIGHTS.poorDrainage * poorDrainage, value: poorDrainage },
    { text: 'Triều cường dâng cao cản trở dòng chảy', weight: FLOOD_MODEL_WEIGHTS.tidePressure * tide, value: tide },
    { text: 'Cường độ mưa tức thời lớn', weight: FLOOD_MODEL_WEIGHTS.rainfallIntensity * normRainIntensity, value: normRainIntensity },
  ];

  factors.sort((a, b) => b.weight - a.weight);
  const reasons = factors.filter(f => f.value >= 0.30).slice(0, 3).map(f => f.text);
  if (reasons.length === 0) {
    reasons.push('Lượng mưa và triều cường ở mức thấp an toàn');
  }

  // Safety advice
  let advice = 'Lưu thông bình thường. Theo dõi diễn biến thời tiết khi di chuyển.';
  if (severity === 'watch') {
    advice = 'Chú ý giảm tốc độ khi qua các đoạn đường trũng thấp hoặc gần bờ kênh.';
  } else if (severity === 'warning') {
    advice = 'Hạn chế xe gầm thấp nếu mực nước tiếp tục tăng. Cân nhắc lộ trình thay thế.';
  } else if (severity === 'severe') {
    advice = 'Tuyệt đối không lưu thông xe máy/ô tô con qua đoạn ngập sâu. Nguy cơ chết máy cao.';
  }

  return {
    severity,
    score: roundedScore,
    estimatedDepthCm,
    renderHeight: Math.round(renderHeight * 1000) / 1000,
    drainMinMinutes,
    drainMaxMinutes,
    confidence,
    reasons,
    advice,
  };
}
