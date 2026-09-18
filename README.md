# Flood Map HCMC — Doc Pack V3

Bộ tài liệu V3 chuyển sản phẩm từ **ngập theo vùng/polygon** sang **ngập theo đoạn đường**, ưu tiên các trục đường lớn tại TP.HCM.

## Product statement

> Flood Map HCMC V3 là bản đồ theo dõi **nguy cơ ngập theo đoạn đường lớn** tại TP.HCM, có timeline dự báo 24 giờ, trực quan 3D mức ngập ước tính và làm nền tảng cho tính năng đề xuất lộ trình ít ngập hơn.

## V3 thay đổi gì?

- Không dùng polygon ngẫu nhiên làm đơn vị chính.
- Đơn vị chính là `RoadSegment`.
- Chỉ ưu tiên các đường lớn trong MVP.
- Có ranh giới TP.HCM + mask khu vực ngoài thành phố.
- Search tập trung vào đường.
- Search không tự xóa query sau khi chọn.
- Label/popup phải neo đúng vào geometry đường.
- Mức ngập 3D phải có chênh lệch chiều cao nhìn thấy được.
- Phân biệt rõ `Observed / Forecast / Estimated`.
- Không được hiển thị các placeholder như `api key required`.
- Không được trình bày số liệu mô phỏng như dữ liệu quan trắc thật.

## Cách dùng với Gemini

### Nếu muốn Gemini sửa project hiện tại
1. Copy toàn bộ folder này vào root repo.
2. Yêu cầu Gemini đọc `AGENT.md`.
3. Sau đó dùng `PATCH-PROMPT.md`.

### Nếu muốn Gemini review trước khi sửa
Dùng `REVIEW-PROMPT.md`.

### Nếu muốn Gemini thực hiện cả V3 theo từng phase
Dùng `MASTER-PROMPT.md`.

## Thứ tự đọc bắt buộc cho agent

1. `AGENT.md`
2. `docs/00-PRODUCT-BRIEF.md`
3. `docs/01-ROAD-FIRST-STRATEGY.md`
4. `docs/03-INFORMATION-ARCHITECTURE.md`
5. `docs/04-UI-DESIGN-SYSTEM.md`
6. `docs/07-MAP-BOUNDARY-AND-LABELS.md`
7. `docs/08-ROAD-FLOOD-DATA-MODEL.md`
8. `docs/09-DATA-SOURCES-AND-CONFIDENCE.md`
9. `docs/10-3D-ROAD-FLOOD-VISUAL-SPEC.md`
10. `docs/11-SEARCH-AND-ROAD-INSPECTOR-UX.md`
11. `docs/15-ACCEPTANCE-CHECKLIST.md`
12. `docs/16-IMPLEMENTATION-PHASES.md`

## Nguyên tắc cốt lõi

**Map first. Road first. Estimated means estimated.**

Đừng biến sản phẩm thành dashboard card-grid. Đừng thêm hiệu ứng chỉ để trông “3D”. Mọi layer và animation phải giúp người dùng trả lời nhanh: **đường nào đang/nguy cơ ngập, mức nào, xu hướng ra sao, và nên tránh đoạn nào**.
