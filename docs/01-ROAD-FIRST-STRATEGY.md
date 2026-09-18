# 01 — Road-First Strategy

## Vì sao bỏ area-first?
Các polygon ngập tùy ý:
- khó khớp thực địa,
- khó đọc,
- không trực tiếp hỗ trợ quyết định đi đường,
- dễ tạo cảm giác “vùng màu ngẫu nhiên”.

## Đơn vị chính
`RoadSegment`

Một road có thể chia nhiều segment nếu:
- độ cao thay đổi,
- giao cắt với vùng trũng,
- drainage khác,
- risk score khác đáng kể.

## MVP road set
Chỉ chọn:
- arterial roads,
- collector roads quan trọng,
- đường có traffic lớn,
- đường có lịch sử ngập đáng chú ý nếu có dữ liệu.

Không cần cover toàn bộ đường nhỏ ở V3.

## Map priority
1. HCMC boundary
2. major road network
3. flooded/risky road segments
4. selected road
5. supporting weather/tide overlays

## Routing later
Routing V4 có thể sử dụng `riskCost` của road segment làm additional weight cho route engine.
V3 chỉ cần chuẩn bị data model.
