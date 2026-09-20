# AGENT-V5.1.1

## Mission
Việt hóa toàn bộ UI user-facing mà không thay đổi logic search, route, flood engine.

## Preserve
Không phá search V5.1, snapping, route engine, UNKNOWN semantics, selected-road UX, selected-route visual, timeline, 3D, boundary/mask và mobile bottom sheet.

## User-facing Vietnamese
Mọi text user nhìn thấy phải là tiếng Việt, ngoại trừ:
- OpenStreetMap / OpenFreeMap / OpenMapTiles
- GPS
- ESC / Ctrl / Cmd
- km / m / cm / mm / mm/h
- SUV nếu thực sự cần giữ thuật ngữ phổ biến

## No QA/debug in production
Production không được hiện:
- QA Test
- UNKNOWN fixture
- debug toggle
- engine version badge
- internal enum
- internal source id

QA controls chỉ render khi `import.meta.env.DEV` hoặc explicit QA flag mặc định OFF.

## Wording bắt buộc
Use:
- Chưa đủ dữ liệu
- Độ phủ dữ liệu
- Mức phù hợp
- Điểm mô hình
- Dự báo ngập
- Ước tính
- Mô phỏng
- Điểm neo
- Dữ liệu đối chứng thực địa

Avoid user-facing:
UNKNOWN, coverage, route, engine, ground-truth, anchor, debug, fixture.
