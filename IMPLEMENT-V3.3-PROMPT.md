# Implement V3.3

Chỉ implement sau khi root cause đã rõ.

## Phase 1 — Boundary
Dùng administrative boundary thật của TP.HCM.

Yêu cầu:
- Polygon/MultiPolygon
- WGS84
- validated bbox
- production-safe path cho GitHub Pages

Suggested style:
- line width 1.5–2px
- opacity 0.65–0.85
- fill opacity 0.01–0.04
- màu cyan/blue-gray nhẹ

Trong debug có thể tạm dùng line 4px/opacity 1 để xác nhận layer đang render, sau đó mới hạ style.

## Phase 2 — Outside mask
Trong TP.HCM giữ full emphasis.
Ngoài TP.HCM:
- brightness thấp hơn
- saturation thấp hơn
- dark navy overlay khoảng 0.25–0.40 opacity

Phải xử lý Polygon/MultiPolygon đúng.
Không hand-draw approximate polygon.
Không phủ rectangle làm che cả thành phố.

## Phase 3 — Regression
Test lại:
- search Nguyễn Hữu Cảnh
- query persists
- road highlight đúng
- +3h timeline
- +24h timeline
- switch road
- 2D/3D
- city overview

## Phase 4 — Mobile
Nếu chưa có bottom sheet, implement:
- collapsed: road/depth/severity
- half: rain/drainage/tide/reason
- expanded: vehicle advice/recommendation/technical detail

## Phase 5 — Release
Production build.
Deploy.
Verify live URL.
Không báo done chỉ dựa vào local dev.
