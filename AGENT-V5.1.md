# AGENT-V5.1

## Preserve
- browse roads neutral
- selected-road contextual flood rendering
- vehicle/forecast-aware routing
- UNKNOWN + coverage
- boundary/mask, timeline, 3D, map-state stability

## Search truthfulness
Mỗi result phải có `type` và `matchQuality`:
`exact | approximate | street-level | poi`.
Không claim exact nếu provider/data không chứng minh exact.

## Routing truthfulness
Geocoded point != routable point.
Lưu input point, snapped point, snap distance, segment id.
Material snap distance phải hiện cho user.

## Visual hierarchy
- browse: neutral roads
- selected road: chỉ road đó có flood color
- route: selected route mạnh nhất; alternatives muted; inner line theo flood; UNKNOWN dashed

## Done
Critical + High checklist phải PASS.
