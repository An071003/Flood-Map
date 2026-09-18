export type RiskLevel = 'safe' | 'watch' | 'warning' | 'severe';
export type FloodSeverity = RiskLevel;
export type ConfidenceBand = 'low' | 'medium' | 'high';
export type DataKind = 'observed' | 'forecast' | 'estimated' | 'demo';
export type DataClass = 'observed' | 'forecast' | 'estimated' | 'static' | 'mock';
export type DataState = 'loading' | 'fresh' | 'updating' | 'stale' | 'error';
export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'heavy_rain' | 'storm';

export interface MetricValue<T> {
  value: T;
  dataClass: DataClass;
  sourceId: string;
  observedAt?: string;
  forecastFor?: string;
  updatedAt: string;
}

export interface RoadSegmentProperties {
  id: string;
  roadId: string;
  roadName: string;
  district: string;
  anchorPoint: [number, number]; // [lng, lat] for pin/popup
  labelPoint: [number, number]; // [lng, lat] for road text
  estimatedDepthCm: number;
  riskLevel: RiskLevel;
  rain1hMm: number;
  rain3hMm: number;
  tideImpactM: number;
  drainageMinutes: number;
  confidenceBand: ConfidenceBand;
  confidenceScore: number; // 0..1
  isSimulated: boolean;
  reasonTags: string[];
  reasons: string[];
  advice: string;
  updatedAt: string;
  lowElevationScore: number;
  poorDrainageScore: number;
  historicalFloodScore: number;
}

export interface RoadSegment {
  id: string;
  properties: RoadSegmentProperties;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][]; // Array of [lng, lat]
  };
}

export interface RoadFloodSnapshot {
  road: RoadSegment;
  weather: {
    condition: WeatherCondition;
    temperatureC: number;
    rainRateMmH: number;
    windSpeedKmh: number;
    description: string;
  };
}

export interface CitySummary {
  timestamp: string;
  totalMonitoredRoads?: number;
  totalMonitored?: number;
  warningRoadsCount?: number;
  warningCount?: number;
  avgRainMmH: number;
  maxDepthCm: number;
  tideState: 'Đang lên' | 'Đỉnh triều' | 'Đang rút' | 'Bình thường';
  tideLevelM: number;
  freshnessMinutes: number;
  isSimulated?: boolean;
}

export interface TimelineStep {
  hour: number;
  label: string;
  shortLabel: string;
  note: string;
  trend?: 'rising' | 'peak' | 'receding' | 'stable';
}

export interface ActiveLayers {
  roadFlood: boolean;
  rain: boolean;
  weatherLabels: boolean;
  tide: boolean;
  is3D: boolean;
  hcmcBoundary: boolean;
  // Legacy aliases
  flood?: boolean;
  weather?: boolean;
}

// Backward compatibility types for legacy flood engine if needed
export interface AreaFlood {
  severity: FloodSeverity;
  score: number;
  estimatedDepthCm: number;
  renderHeight: number;
  drainMinMinutes: number;
  drainMaxMinutes: number;
  confidence: number;
  reasons: string[];
  advice: string;
}

export interface AreaWeather {
  condition: WeatherCondition;
  temperatureC: number;
  rainRateMmH: number;
  rain1hMm: number;
  rain3hMm: number;
  rain6hMm: number;
  windSpeedKmh: number;
  description: string;
}

export interface FloodAreaStaticInfo {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number];
  polygon: [number, number][];
  lowElevationScore: number;
  poorDrainageScore: number;
  historicalFloodScore: number;
}

export interface AreaSnapshot {
  areaId: string;
  name: string;
  district: string;
  timestamp: string;
  kind: DataKind;
  weather: AreaWeather;
  flood: AreaFlood;
  freshnessMinutes: number;
  coordinates: [number, number];
  polygon: [number, number][];
}
