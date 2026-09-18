# AGENT-V3.2.md — Final Polish Overlay

## Mission
Hoàn thiện Flood Map HCMC thành một bản production-ready hơn mà không thay đổi product direction.

## Preserve strictly
Không được phá hoặc redesign:
- road-first architecture
- search behavior
- road selection alignment
- inspector structure hiện tại
- timeline
- data semantics
- basemap hiện tại
- layer controls hiện tại
- visual identity dark/map-first

## V3.2 priorities

### Priority 1 — HCMC boundary
- Render administrative boundary thật.
- Render outside mask.
- Không hand-draw.
- Không làm mất road alignment.
- Không che labels cần thiết.

### Priority 2 — Stronger 3D depth
- Vertical height phải dễ nhìn.
- 7cm vs 37cm phải nhìn ra ngay ở 3D mode.
- Không chỉ rely vào color.
- Không exaggerate tới mức cartoon.

### Priority 3 — Mobile
- Inspector phải thành bottom sheet thật.
- Map vẫn là hero.
- Timeline compact.
- Layer controls mobile-safe.
- Search mobile-safe.

### Priority 4 — Quality
- Performance
- Cleanup
- Accessibility
- Final release QA

## No feature expansion
Nếu task không trực tiếp hỗ trợ 4 priority trên, không làm trong V3.2.

## Definition of done
Tất cả mục Critical và High trong `docs/30-V3.2-ACCEPTANCE-CHECKLIST.md` phải PASS.
