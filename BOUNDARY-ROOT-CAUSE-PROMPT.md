# Boundary Root-Cause Audit

Không sửa code trong bước này.

## 1. Locate
Tìm boundary GeoJSON/API, source id, boundary line/fill layer, outside-mask layer, component/module tạo chúng.

## 2. Validate data
In ra:
- feature count
- geometry type
- bbox
- sample coordinates

Yêu cầu:
- Polygon/MultiPolygon
- WGS84 `[lng, lat]`
- bbox phải nằm quanh TP.HCM

## 3. GitHub Pages path
Site deploy dưới `/Flood-Map/`.

Tìm các path kiểu:
- `fetch('/data/...')`
- `/assets/...`
- absolute-root URL

Kiểm tra request thật có HTTP 200 không.

Ưu tiên:
- import vào bundle
- `new URL(..., import.meta.url)`
- `import.meta.env.BASE_URL`

## 4. MapLibre
Kiểm tra:
- source add sau `map.load`
- source không undefined
- layer tồn tại bằng `map.getLayer`
- visibility không `none`
- opacity > 0
- line width đủ nhìn
- zoom range không chặn city overview
- filter không loại geometry

## 5. Layer order
Xác định thứ tự:
basemap → mask → boundary → roads → flood → pins/labels.

## 6. Deployment
Build production, deploy, hard reload và verify live.

## Output bắt buộc
- Root cause: 1 câu cụ thể
- Evidence: file/component/request/layer state
- Minimal fix

Không trả lời mơ hồ kiểu “có thể do layer”.
