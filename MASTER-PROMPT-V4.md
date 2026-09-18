# MASTER PROMPT — V4 Route Planner

Implement V4 cho Flood Map HCMC.

User chọn:
- origin
- destination
- vehicle: motorbike/car
- forecast time: NOW/+1/+3/+6/+12/+24

Output tối đa 3 route strategy:
- Least Flood
- Balanced
- Fastest

Mỗi route phải hiển thị:
- ETA
- distance
- max estimated flood depth
- worst segment
- warning/severe count
- data coverage
- unknown segment count
- recommendation state
- explanation

Unknown data rule:
`floodStatus = 'unknown'`, không gán 0 cm.

Motorbike và car phải có penalty profile khác nhau. Threshold chỉ là routing heuristic, không phải safety guarantee.

Selected route trên map dùng route casing + centerline giữ màu flood severity từng segment. Alternative routes giảm opacity.

Preserve toàn bộ V3.3 core.
