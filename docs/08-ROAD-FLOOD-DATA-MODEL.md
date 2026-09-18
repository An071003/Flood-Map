# 08 — Road Flood Data Model

## Entity
`RoadSegment`

```ts
type RiskLevel = 'safe' | 'watch' | 'warning' | 'severe'
type ConfidenceBand = 'low' | 'medium' | 'high'

interface RoadSegment {
  id: string
  roadId: string
  roadName: string
  district: string

  geometry: GeoJSON.LineString | GeoJSON.MultiLineString
  anchorPoint: [number, number]
  labelPoint: [number, number]

  estimatedDepthCm: number
  riskLevel: RiskLevel

  rain1hMm: number | null
  rain3hMm: number | null
  tideImpactM: number | null
  drainageMinutes: number | null

  confidenceBand: ConfidenceBand
  confidenceScore?: number

  isSimulated: boolean
  reasonTags: string[]

  observedAt?: string
  forecastFor?: string
  updatedAt: string
}
```

## Risk bands
Gợi ý MVP:
- safe: 0–5 cm
- watch: 6–15 cm
- warning: 16–30 cm
- severe: >30 cm

Các threshold này là product heuristic cho demo nếu chưa có calibration thật; phải document rõ.

## Future routing
Có thể thêm:
- `riskCost`
- `passability`
- `vehicleClassPenalty`
nhưng V3 không cần routing engine.
