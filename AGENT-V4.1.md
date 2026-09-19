# AGENT-V4.1

## Preserve
Không phá:
- road-first flood map
- HCMC boundary/outside mask
- road search/inspector
- timeline
- 3D depth
- layer controls
- route planner A/B

## P0 Vehicle-aware
`motorbike` và `car` phải làm thay đổi:
- segment cost
- route score
- route ranking
- recommendation

Vehicle toggle không được chỉ đổi UI.

## P0 Multiple candidates
Sinh tối đa 3 route thật sự khác:
- LEAST_FLOOD
- BALANCED
- FASTEST

Nếu chỉ có 1 unique route, chỉ hiển thị 1.

## P0 Unknown
Unknown:
```ts
status: 'unknown'
```
Không được fallback thành `0 cm`.

Route phải có:
- unknownSegmentCount
- knownDistanceMeters
- totalDistanceMeters
- dataCoverage

## Safety wording
Dùng:
- Ít rủi ro ngập hơn theo mô hình
- Cần thận trọng
- Không khuyến nghị
- Không đủ dữ liệu

Không dùng cam kết an toàn tuyệt đối.

## Done
Critical + High trong acceptance checklist phải PASS trên live deployment.
