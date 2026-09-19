# IMPLEMENT V5 PROMPT

## Phase 1 — Interaction mode
```ts
type AppInteractionMode = 'browse' | 'road-selected' | 'route-planning'
```
Transitions: initial→browse; select road→road-selected; route action→route-planning; clear→browse.

## Phase 2 — Browse cleanup
- global flood-road layer OFF by default
- neutral road network
- keep boundary/mask/weather
- optional severe-alert pins only
- prefer visibility/paint changes, do not destroy map sources

## Phase 3 — Selected road
- selected-road casing
- flood segmentation only for selected road
- selected-only depth pins
- inspector shows current/future depth, rain, drainage, tide, confidence, vehicle suitability, reasons
- other roads neutral

## Phase 4 — Route visual hierarchy
Selected route:
- strong cyan/light casing for navigation identity
- inner segment line colored by flood severity
- unknown dashed neutral
Alternatives:
- muted gray/blue, lower opacity
Non-route roads neutral.

## Phase 5 — Search model
```ts
interface SearchPlace {
  id: string
  type: 'address'|'road'|'alley'|'poi'|'intersection'
  label: string
  houseNumber?: string
  street?: string
  alley?: string
  ward?: string
  district?: string
  lng: number
  lat: number
  routableSegmentId?: string
  routableSnapDistanceMeters?: number
}
```
Placeholder: `Tìm địa chỉ, số nhà, hẻm, địa điểm...`
Actions: Xem ngập / Đi từ đây / Đi đến đây.

## Phase 6 — Address/alley snapping
Search result location != route graph point.
If direct segment exists, use it. Otherwise snap to nearest supported segment and compute distance.
If gap is material, warn:
`Điểm đến nằm ngoài mạng đường được hỗ trợ. Tuyến được tính đến điểm gần nhất, cách đích 180 m.`
Never silently pretend exact routing.

## Phase 7 — Current location
Add `Vị trí của tôi` using browser geolocation, then same snapping rules. Permission denied => graceful fallback.

## Phase 8 — Route filters
Vehicle: motorbike/car.
Forecast: NOW/+1/+3/+6/+12/+24.
Strategy: Least Flood/Balanced/Fastest.
Flood preference: Auto by vehicle/custom; label `Ngưỡng ưu tiên của mô hình`.
Data quality: prefer high coverage / strict known-only.

## Phase 9 — Mobile
Full-width search + route bottom sheet + expandable filters. Map remains primary.

## Phase 10 — Regression
Preserve V4 route engine, UNKNOWN, coverage, boundary/mask, timeline, 3D, map-state stability.
