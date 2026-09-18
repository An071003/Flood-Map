# AGENT-V3.1.md — Optimization Overlay

## Relationship with V3
File này bổ sung cho `AGENT.md` V3.

Nếu có xung đột, ưu tiên:
1. Correctness
2. V3.1 optimization rules
3. V3 base docs

## Mission
Nâng V3 từ desktop MVP tốt thành bản gần production hơn mà không đổi product direction.

## Preserve
Không phá:
- Road-first architecture
- Major-road focus
- Search persistence
- Correct road anchoring
- Inspector hierarchy
- Timeline interaction
- Dark map-first visual direction

## Required V3.1 fixes

### P0
- `API KEY REQUIRED` phải biến mất hoàn toàn.
- Không được CSS-hide watermark/token error.
- Phải sửa bằng provider/style/config hợp lệ.
- Boundary TP.HCM phải là boundary thật, không vẽ tay gần đúng.

### P1
- UI phân biệt rõ:
  - Observed
  - Forecast
  - Estimated
  - Mock
- Confidence phải nói rõ “tin cậy cái gì”.
- 3D depth phải encode bằng geometry/height thật.
- Mobile phải có bottom sheet thực sự.

### P2
- Performance pass
- Accessibility pass
- Loading/stale/error states
- Final visual polish

## No-new-features rule
Không thêm:
- route recommendation engine
- login
- crowdsourcing
- chatbot
- extra dashboard charts
trong V3.1.

## Definition of done
Tất cả Critical + High trong `docs/24-V3.1-ACCEPTANCE-CHECKLIST.md` phải pass.
