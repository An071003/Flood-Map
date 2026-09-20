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

// ---------------------------------------------------------------------------
// V4 Route Planner & Topological Road Network Types (Spec: AGENT-V4.md)
// ---------------------------------------------------------------------------

export interface RoadNode {
  id: string;
  name: string;
  district: string;
  lng: number;
  lat: number;
  isMajorHub?: boolean;
}

export type RoadClass = 'trunk' | 'primary' | 'secondary' | 'tertiary';

export type FloodStatus = 'known' | 'unknown';

export type FloodState =
  | {
      status: 'known';
      estimatedDepthCm: number;
      riskLevel?: RiskLevel;
      confidenceBand?: ConfidenceBand;
      dataCompleteness?: number;
      forecastFor?: string;
    }
  | {
      status: 'unknown';
      reason?: 'missing_forecast' | 'missing_model_input' | 'unsupported_segment' | string;
      riskLevel?: 'unknown';
      confidenceBand?: ConfidenceBand;
      dataCompleteness?: number;
      forecastFor?: string;
    };

export type SegmentFloodState = FloodState;

export interface GraphRoadSegment {
  id: string;
  roadId: string;
  roadName: string;
  district: string;
  roadClass: RoadClass;
  fromNodeId: string;
  toNodeId: string;
  bidirectional: boolean;
  lengthMeters: number;
  estimatedTravelSeconds: number;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  floodForecast: Record<number, SegmentFloodState>;
}

export type VehicleType = 'motorbike' | 'car';

export interface DepthPenaltyBracket {
  minCm: number;
  maxCm: number | null;
  penalty: number;
}

export interface VehicleProfile {
  type: VehicleType;
  label: string;
  unknownPenalty: number;
  warningPenalty: number;
  severePenalty: number;
  depthPenaltyCurve: DepthPenaltyBracket[];
  note: string;
}

export type RouteStrategy = 'LEAST_FLOOD' | 'BALANCED' | 'FASTEST';

export type CandidateOmissionReason =
  | 'duplicate'
  | 'vehicle_blocked'
  | 'flood_blocked'
  | 'disconnected'
  | 'no_distinct_alternative';

export type CompatibilityLevel = 'CAO' | 'VỪA' | 'THẤP' | 'KHÔNG KHUYẾN NGHỊ';

export interface RouteEvaluation {
  totalDistanceMeters: number;
  knownDistanceMeters: number;
  unknownDistanceMeters: number;
  dataCoverage: number; // 0..1 ratio
  unknownSegmentCount: number;
  maxKnownDepthCm?: number;
  maxEstimatedDepthCm?: number; // backwards compatibility alias
  worstKnownSegmentId?: string;
}

export interface RouteCandidate {
  id: string;
  strategy: RouteStrategy;
  strategyLabel: string;
  vehicle: VehicleType;
  routeScore: number; // 0..100 suitability score
  compatibilityLevel: CompatibilityLevel;
  segments: GraphRoadSegment[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  evaluation: RouteEvaluation;
  maxDepthCm?: number;
  worstSegment: {
    roadName: string;
    depthCm?: number;
    riskLevel: RiskLevel | 'unknown';
  } | null;
  warningCount: number;
  severeCount: number;
  unknownCount: number;
  coveragePercent: number; // 0..100
  recommendationState: 'favorable' | 'caution' | 'not_recommended' | 'insufficient_data';
  recommendationText: string;
  explanation: string;
  omissionReason?: CandidateOmissionReason;
  omissionNote?: string;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}

export type AppInteractionMode = 'browse' | 'road-selected' | 'route-planning';

export type SearchPlaceType = 'address' | 'road' | 'alley' | 'poi' | 'intersection';
export type SearchMatchQuality = 'exact' | 'approximate' | 'street-level' | 'poi';

export interface SearchPlace {
  id: string;
  type: SearchPlaceType;
  label: string;
  name?: string;
  secondaryLabel?: string;
  houseNumber?: string;
  street?: string;
  alley?: string;
  ward?: string;
  district?: string;
  lng: number;
  lat: number;
  matchQuality: SearchMatchQuality;
  source?: string;
  linkedRoadId?: string;
  routableSegmentId?: string;
  routableSnapDistanceMeters?: number;
  routableNodeId?: string;
  isOutsideGraph?: boolean;
}

export type RouteSnapStatus = 'exact' | 'near' | 'far' | 'unsupported';

export interface RouteSnapResult {
  inputLng: number;
  inputLat: number;
  snappedLng: number;
  snappedLat: number;
  nodeId: string;
  segmentId: string;
  distanceMeters: number;
  status: RouteSnapStatus;
}

export type FloodModelPreference = 'auto' | 'cautious' | 'standard';
export type DataQualityPreference = 'all' | 'high_coverage_only';

export interface RoutePlanResult {
  candidates: RouteCandidate[];
  omissionReason?: CandidateOmissionReason;
  omissionNote?: string;
  requestedCount?: number;
  displayedCount?: number;
}

export interface RouteRequest {
  originNodeId: string;
  destinationNodeId: string;
  vehicle: VehicleType;
  departureHour: number;
  diversityThreshold?: number;
  qaUnknownFixture?: boolean;
  preferredStrategy?: RouteStrategy;
  floodModelPreference?: FloodModelPreference;
  dataQualityPreference?: DataQualityPreference;
  customMaxDepthCm?: number;
}

