# IMPLEMENT V4.1

## Phase 1 — Vehicle-aware routing
Route request:
```ts
interface RouteRequest {
  originNodeId: string
  destinationNodeId: string
  vehicle: 'motorbike' | 'car'
  forecastHour: 0 | 1 | 3 | 6 | 12 | 24
}
```

Mọi segment cost nhận `vehicleProfile` + `forecastHour`.

Vehicle change phải:
- invalidate old result
- recompute candidates
- recompute ranking
- update cards
- update recommendation

## Phase 2 — Candidate generation
Dùng:
- Yen k-shortest
hoặc
- routing alternatives
hoặc
- repeated weighted search + diversity penalty

Tối đa 3 candidates.

## Phase 3 — Dedupe
Dedupe theo overlap chiều dài road segment.
Không lặp cùng route dưới 3 nhãn.

## Phase 4 — Strategies
LEAST_FLOOD:
- flood penalty cao
- unknown penalty cao
- ưu tiên coverage

BALANCED:
- cân bằng ETA + flood + unknown

FASTEST:
- ETA ưu tiên
- vẫn phạt/block đoạn quá rủi ro theo profile

## Phase 5 — Unknown transparency
Add:
```ts
interface RouteEvaluation {
  totalDistanceMeters: number
  knownDistanceMeters: number
  dataCoverage: number
  unknownSegmentCount: number
  maxEstimatedDepthCm?: number
  worstKnownSegmentId?: string
}
```

Coverage:
`knownDistanceMeters / totalDistanceMeters`

Unknown segment:
- dashed neutral style
- tooltip `Chưa đủ dữ liệu`
- không tham gia max-depth như 0 cm

## Phase 6 — Route cards
Mỗi card:
- strategy
- ETA
- distance
- max known depth
- data coverage
- unknown count
- worst segment
- recommendation
- why/tradeoff

## Phase 7 — Boundary regression
Khôi phục/verify:
- HCMC boundary
- outside mask
- layer ordering

## Phase 8 — Mobile
Route results trong bottom sheet.

## Phase 9 — QA
Chạy ROUTE-ENGINE-QA-PROMPT.md
