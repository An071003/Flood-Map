# Flood Map HCMC — V3.1 Optimization Pack

Bộ này **không thay V3**. Đây là lớp patch tối ưu cho project đã hoàn thành V3.

## Mục tiêu
Giữ nguyên phần V3 đã làm tốt:
- road-first
- major roads
- search persistence
- road selection alignment
- inspector road-first
- timeline 24h
- dark map-first UI

Chỉ sửa các điểm còn yếu:
1. Xóa hoàn toàn `API KEY REQUIRED`.
2. Render boundary TP.HCM thật.
3. Làm rõ Observed / Forecast / Estimated.
4. Giải thích đúng ý nghĩa confidence.
5. Xác minh 3D depth có height thật chứ không chỉ đổi màu.
6. Làm mobile bottom sheet đúng nghĩa.
7. Tối ưu performance, reliability, accessibility.
8. QA/release gate trước khi coi V3.1 hoàn tất.

## Cách dùng
1. Copy pack này vào root repo.
2. Đọc `AGENT-V3.1.md`.
3. Chạy `REVIEW-V3.1-PROMPT.md`.
4. Sau audit, chạy `OPTIMIZE-PROMPT.md`.
5. Cuối cùng chạy `RELEASE-CHECK-PROMPT.md`.

## Rule
**Không rewrite app. Không phá V3. Không thêm feature ngoài scope.**

V3.1 là:
`correctness -> credibility -> mobile -> performance -> polish`
