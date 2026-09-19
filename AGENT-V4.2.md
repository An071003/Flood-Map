# AGENT-V4.2

## Mission
Hoàn thiện route credibility và explainability.

## Preserve
Không phá:
- vehicle-aware routing
- forecast recalculation
- route geometry
- route candidates hiện tại
- boundary / outside mask
- search / inspector / timeline / 3D

## P0 Unknown
Route evaluation phải có:
- totalDistanceMeters
- knownDistanceMeters
- unknownDistanceMeters
- dataCoverage
- unknownSegmentCount

UNKNOWN không được fallback 0 cm hoặc SAFE.

## P0 Unknown map style
Unknown:
- neutral blue-gray
- dashed
- tooltip `Chưa đủ dữ liệu`

## P1 Candidate explanation
Nếu chỉ còn 1–2 candidate, UI phải giải thích:
- duplicate removed
- vehicle/flood blocked
- no distinct alternative

## P1 Compatibility semantics
Không dùng score như xác suất an toàn.
Primary:
- Cao / Vừa / Thấp / Không khuyến nghị
Secondary:
- Điểm mô hình

## P1 Mobile
Phải test 390×844 và 360×800.
