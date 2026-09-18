# MASTER PROMPT — Flood Map HCMC V3

Bạn đang làm việc trên một project React + TypeScript + MapLibre + Three.js + GSAP.

Mục tiêu là refactor project hiện tại từ **flood-by-region** sang **road-centric flood monitoring**.

## Objective

Tạo trải nghiệm mà người dùng có thể:

1. Mở bản đồ TP.HCM.
2. Search một đường lớn.
3. Xem đường đó được highlight chính xác.
4. Xem mức ngập ước tính theo từng đoạn đường.
5. Xem xu hướng 24 giờ.
6. Hiểu vì sao đoạn đường có nguy cơ.
7. Nhìn 3D và phân biệt được 5 cm, 15 cm, 30 cm, 50 cm.
8. Chuẩn bị nền tảng cho route recommendation sau này.

## Mandatory changes

- Fix mọi basemap/style lỗi, đặc biệt text kiểu `api key required`.
- Thêm ranh giới TP.HCM.
- Thêm mask/visual de-emphasis ngoài ranh giới.
- Dùng road geometry làm primary entity.
- MVP chỉ ưu tiên major roads.
- Search roads first.
- Search input không được tự xóa sau selection.
- Road popup/label/anchor phải đúng geometry.
- Bỏ random polygon làm flood concept chính.
- Dùng road overlay + 3D ribbon/extrusion theo depth.
- Phân biệt `Observed`, `Forecast`, `Estimated`.
- Giữ `MÔ PHỎNG` / `Mức ngập ước tính` khi chưa có quan trắc thật.
- Inspector phải bớt density, ưu tiên thông tin ra quyết định.
- Timeline phải update map state và có feedback.
- Mobile dùng bottom sheet.

## RoadSegment minimum model

Mỗi segment cần:

- `id`
- `roadName`
- `district`
- `geometry`
- `anchorPoint`
- `labelPoint`
- `estimatedDepthCm`
- `riskLevel`
- `rain1hMm`
- `rain3hMm`
- `drainageMinutes`
- `tideImpact`
- `confidence`
- `confidenceBand`
- `isSimulated`
- `reasonTags`
- `updatedAt`

## UI hierarchy

### Topbar
- Brand
- City
- Search
- Data freshness

### Left rail
- Road flood
- Rain
- Weather labels
- Tide
- 3D
- Reset

### Map
- HCMC boundary
- major roads
- flood road segments
- selected road
- road labels
- weather markers

### Inspector
1. road name
2. district
3. estimated depth
4. severity
5. rain 3h
6. drainage
7. tide
8. short explanation
9. recommendation
10. expandable details

### Timeline
- NOW
- +1h
- +3h
- +6h
- +12h
- +24h
- play/pause
- rising / stable / decreasing

## Rules for data credibility

- Không invent data source.
- Không gọi heuristic là sensor data.
- Nếu data demo thì ghi rõ demo/simulation.
- `confidence` phải có documentation.
- Nếu chưa có calibration, dùng `confidenceBand: low|medium|high` là chính; percentage chỉ secondary.

## Delivery approach

Thực hiện theo `docs/16-IMPLEMENTATION-PHASES.md`.
Mỗi phase:
1. đọc acceptance tương ứng
2. patch nhỏ
3. test
4. ghi lại files đã thay đổi
5. không chuyển phase nếu Critical còn fail

Đọc `AGENT.md` và toàn bộ docs trước khi code.
