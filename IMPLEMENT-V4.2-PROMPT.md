# IMPLEMENT V4.2

## Phase 1 — Route completeness
Add:
```ts
interface RouteEvaluation {
  totalDistanceMeters: number
  knownDistanceMeters: number
  unknownDistanceMeters: number
  dataCoverage: number
  unknownSegmentCount: number
  maxKnownDepthCm?: number
  worstKnownSegmentId?: string
}
```

Coverage:
```ts
dataCoverage =
  totalDistanceMeters > 0
    ? knownDistanceMeters / totalDistanceMeters
    : 0
```

Không hard-code 100%.

## Phase 2 — Unknown state
Use discriminated union:
```ts
type FloodState =
  | { status: 'known'; estimatedDepthCm: number }
  | { status: 'unknown'; reason?: string }
```

Forbidden:
```ts
estimatedDepthCm ?? 0
```

## Phase 3 — Unknown visualization
Known = severity color + solid.
Unknown = neutral + dashed + tooltip.
Legend thêm `Chưa đủ dữ liệu`.

## Phase 4 — Candidate diversity
Overlap:
```ts
overlapRatio =
  sharedLength /
  Math.min(routeALength, routeBLength)
```

Nếu vượt configurable threshold:
- remove duplicate
- keep better candidate

## Phase 5 — Candidate omission reason
Store:
- duplicate
- vehicle_blocked
- flood_blocked
- disconnected
- no_distinct_alternative

UI text example:
`Chỉ tìm được 2 tuyến khác biệt tại +3h.`

## Phase 6 — Compatibility
Primary:
`Mức phù hợp: CAO / VỪA / THẤP`

Secondary:
`Điểm mô hình: 74/100`

Tooltip:
`Điểm dùng để so sánh tuyến theo mô hình, không phải xác suất an toàn.`

Format giống nhau cho motorbike/car.

## Phase 7 — Mobile
390×844 / 360×800:
- bottom sheet
- no overflow
- route visible
- vehicle/time controls accessible
- candidate cards readable

## Phase 8 — Regression
Re-test boundary/mask, search, inspector, timeline, 3D, vehicle switch, forecast switch.
