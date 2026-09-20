# IMPLEMENT V5.1.1 PROMPT

## 1. Remove production QA/debug UI
Dùng:
```tsx
{import.meta.env.DEV && <UnknownQaToggle />}
```
Production không được thấy `QA Test`, `UNKNOWN fixture`, `V4.2 ENGINE` hay raw enum.

## 2. Route Planner copy
- V4.2 ENGINE -> bỏ khỏi UI hoặc `Bộ định tuyến`
- UNKNOWN -> `Chưa đủ dữ liệu`
- Coverage -> `Độ phủ dữ liệu`
- LEAST_FLOOD -> `Ít ngập nhất`
- BALANCED -> `Cân bằng`
- FASTEST -> `Nhanh nhất`

## 3. Inspector copy
- Sedan (gầm thấp) -> `Ô tô gầm thấp`
- SUV / Xe tải -> `Xe gầm cao / Xe tải`
- Tọa độ neo (Anchor) -> `Tọa độ điểm neo`
- ground-truth -> `dữ liệu đối chứng thực địa`

Disclaimer:
`Đây là mô hình ước tính và chưa được hiệu chuẩn đầy đủ bằng dữ liệu đo ngập thực tế.`

## 4. Search copy
- exact -> Chính xác
- approximate -> Ước lượng
- street-level -> Theo tuyến đường
- poi -> Địa điểm

Không hiện raw enum.

## 5. Snap/geolocation copy
Use:
- Điểm được chọn
- Điểm vào mạng đường
- Khoảng cách tới mạng đường
- Tuyến được tính đến điểm hỗ trợ gần nhất

Avoid user-facing: snap, routable, unsupported.

## 6. Loading/error states
- Loading -> Đang tải...
- Updating -> Đang cập nhật...
- Stale -> Dữ liệu có thể đã cũ
- Error -> Không thể tải dữ liệu
- Retry -> Thử lại

## 7. ARIA
Việt hóa screen-reader labels:
- Close inspector -> Đóng bảng thông tin
- Route planner -> Bảng định tuyến
- Search places -> Tìm địa chỉ và địa điểm

## 8. Keep accepted exceptions
OpenStreetMap, OpenFreeMap, OpenMapTiles, GPS, ESC, Ctrl, Cmd, km/m/cm/mm/mm-h.
