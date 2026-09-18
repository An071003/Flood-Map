# PATCH PROMPT — Sửa project hiện tại theo V3

Hãy patch project Flood Map HCMC hiện tại. Không build lại từ đầu nếu không cần thiết.

## Critical fixes

1. Sửa lỗi map hiện chữ `api key required` hoặc placeholder tương tự.
2. Bổ sung HCMC administrative boundary.
3. Làm mờ khu vực ngoài boundary.
4. Search input phải giữ text sau search/selection.
5. Fix selected road marker/label/popup đang lệch.
6. Thay region/polygon-first bằng road-segment-first.
7. Chỉ hiển thị/ưu tiên các major roads trong MVP.
8. Không còn random polygons làm biểu diễn ngập chính.

## Road flood UI

- Highlight đoạn đường có nguy cơ.
- Dùng color + width + 3D height.
- Mức 5 / 15 / 30 / 50 cm phải nhìn khác nhau.
- Selected road có outline/glow nhẹ nhưng không neon.
- Label neo đúng đoạn đường.

## Inspector

Giảm information density.
Ưu tiên:
- tên đường
- district
- estimated depth
- severity
- rain 3h
- drainage
- tide
- short reason
- recommendation

Thông tin secondary để vào expandable details.

## Credibility

- `MÔ PHỎNG` và `Mức ngập ước tính` phải rõ.
- Không gọi forecast/heuristic là dữ liệu đo thực tế.
- Document nguồn data thực tế đang dùng.
- Nếu một biến đang mock, ghi mock trong code/data docs.

## Timeline

- NOW, +1h, +3h, +6h, +12h, +24h
- update road depth smoothly
- show loading/updating feedback
- show stale/error fallback

## Mobile

- map fullscreen
- search compact
- inspector = bottom sheet
- timeline compact

Làm theo `AGENT.md` và `docs/15-ACCEPTANCE-CHECKLIST.md`.
