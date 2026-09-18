# Flood Map HCMC — V4 Route Planner

V4 nâng Flood Map từ **xem nguy cơ ngập theo đường** thành **tìm tuyến đi phù hợp với loại phương tiện và mức ngập**.

## Product statement
Người dùng chọn điểm đi, điểm đến, phương tiện (xe máy / xe hơi) và thời điểm. Hệ thống tạo nhiều tuyến ứng viên rồi xếp hạng theo thời gian di chuyển, mức ngập ước tính, độ tin cậy dữ liệu và độ phủ dữ liệu.

## Route options
- `LEAST_FLOOD` — ưu tiên giảm rủi ro ngập.
- `BALANCED` — cân bằng ngập + thời gian.
- `FASTEST` — ưu tiên thời gian nhưng vẫn áp dụng flood blocking/penalty.

## Vehicle modes
- `motorbike`
- `car`

## Rule quan trọng
Segment chưa đủ dữ liệu phải là `UNKNOWN`, không được tự gán `0 cm`.

Không gọi một tuyến là “an toàn tuyệt đối”. Wording nên là:
- `Ít rủi ro ngập hơn`
- `Không khuyến nghị theo mô hình`
- `Độ phủ dữ liệu tuyến`
- `Có đoạn chưa đủ dữ liệu`

## Chạy với Gemini
1. `AGENT-V4.md`
2. `REVIEW-V4-PROMPT.md`
3. `IMPLEMENT-V4-PROMPT.md`
4. `ROUTE-QA-PROMPT.md`
5. `RELEASE-V4-PROMPT.md`
