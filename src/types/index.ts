export type DataKind = 'observed' | 'forecast' | 'estimated' | 'demo';

export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'heavy_rain' | 'storm';

export type FloodSeverity = 'safe' | 'watch' | 'warning' | 'severe';

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

export interface AreaFlood {
  severity: FloodSeverity;
  score: number; // 0..1
  estimatedDepthCm: number;
  renderHeight: number; // clamped visual 3D extrusion height
  drainMinMinutes: number;
  drainMaxMinutes: number;
  confidence: number; // 0..1
  reasons: string[];
  advice: string;
}

export interface FloodAreaStaticInfo {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number]; // [lng, lat] centroid
  polygon: [number, number][]; // [lng, lat] coordinates
  lowElevationScore: number; // 0..1 (1 = lowest elevation)
  poorDrainageScore: number; // 0..1 (1 = severely bottlenecked drainage)
  historicalFloodScore: number; // 0..1 (1 = chronic flooding history)
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

export interface CitySummary {
  timestamp: string;
  totalMonitored: number;
  warningCount: number;
  avgRainMmH: number;
  maxDepthCm: number;
  tideState: 'Đang lên' | 'Đỉnh triều' | 'Đang rút' | 'Bình thường';
  tideLevelM: number;
  freshnessMinutes: number;
}

export interface TimelineStep {
  hour: number;
  label: string;
  shortLabel: string;
  note: string;
}

export interface ActiveLayers {
  flood: boolean;
  rain: boolean;
  weather: boolean;
  tide: boolean;
  is3D: boolean;
}
