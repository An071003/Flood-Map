# OPTIMIZE PROMPT — Flood Map HCMC V3.1

Hãy tối ưu project hiện tại theo V3.1.

## Điều kiện
- Không đổi road-first architecture.
- Không rewrite toàn bộ app.
- Không thêm feature ngoài scope.
- Preserve UI/UX đang hoạt động tốt.

## Phase 1 — Basemap + Boundary

### API watermark
Sửa nguyên nhân gốc của `API KEY REQUIRED`.

Không được:
- che watermark bằng CSS
- blur/crop map
- overlay div lên chữ lỗi

Phải:
- xác định provider/style đang yêu cầu key
- dùng cấu hình hợp lệ
HOẶC
- đổi sang basemap/style hợp lệ theo license
- giữ attribution bắt buộc

### HCMC boundary
- Dùng administrative boundary thật.
- Render outline.
- Render outside mask.
- Validate geometry.
- Không dùng polygon vẽ tay approximate.

## Phase 2 — Data semantics

Mọi metric phải có source class:
- `observed`
- `forecast`
- `estimated`
- `static`
- `mock`

UI phải thể hiện tối thiểu:
- Quan trắc
- Dự báo
- Ước tính
- Mô phỏng nếu là mock

Không để `estimatedDepthCm` trông như sensor reading.

## Confidence
Nếu 85% chỉ là input completeness:
- đổi label thành `Độ tin cậy dữ liệu đầu vào`
hoặc
- `Mức đầy đủ dữ liệu`

Nếu là model confidence:
- document công thức
- document calibration/validation
- nếu không có validation, không gọi là accuracy

## Phase 3 — True 3D depth

Xác minh 3D road flood dùng vertical geometry/height thật.

Target:
- 5 cm: thấp
- 15 cm: nhận ra
- 30 cm: rõ
- 50 cm: nổi bật

Dùng visual exaggeration có kiểm soát.
Height là visual encoding, không phải địa hình 1:1.

Animation:
- GSAP 300–600ms
- cancel old tween khi scrub nhanh
- không tạo duplicate RAF

## Phase 4 — Mobile

Target:
- 390x844
- 360x800

Mobile:
- map là background chính
- inspector thành bottom sheet
- collapsed: road + depth + severity
- expanded: rain/drainage/tide/reason/recommendation
- layer controls thu gọn
- timeline compact
- search phù hợp mobile
- touch target >=44px

## Phase 5 — Reliability & quality

Thêm:
- loading
- updating
- stale
- error
- fallback data timestamp

A11y:
- aria-label
- keyboard
- focus visible
- icon + text + color
- prefers-reduced-motion

Performance:
- dispose Three resources
- cleanup GSAP
- cleanup MapLibre listeners
- tránh duplicate layers/sources
- giảm expensive effects trên low-end

## Phase 6 — Final QA
Chạy `docs/24-V3.1-ACCEPTANCE-CHECKLIST.md`.
Không coi hoàn tất nếu Critical hoặc High còn fail.

Cuối cùng report:
1. files changed
2. bugs fixed
3. remaining known issues
4. performance notes
5. data semantics notes
