# AGENT-V3.3

## Mission
Hoàn thiện Flood Map HCMC mà không redesign hoặc mở rộng feature.

## Preserve
Không phá:
- road-first architecture
- current basemap
- search persistence
- road selection alignment
- inspector hierarchy
- timeline
- provenance/confidence wording
- 3D depth
- layer controls

## P0 — Boundary
Boundary phải nhìn thấy trên LIVE GitHub Pages, không chỉ tồn tại trong source.

Kiểm tra:
- asset path
- GitHub Pages/Vite base path
- HTTP status
- GeoJSON validity
- MapLibre source/layer
- layer order
- opacity
- minzoom/maxzoom
- deploy/cache

## P0 — Outside mask
Ngoài TP.HCM phải de-emphasized rõ nhưng vẫn giữ context.

## P1 — Mobile
Phải test thật:
- 390×844
- 360×800

Inspector phải là bottom sheet/mobile drawer, không phải desktop sidebar thu nhỏ.

## P1 — Regression
Boundary/mask/mobile fix không được phá search, road anchor, timeline hoặc 3D.

## No feature expansion
Không thêm routing, login, chatbot, charts, crowdsourcing hoặc layer mới ngoài boundary/mask.

## Done
Chỉ DONE khi `docs/V3.3-ACCEPTANCE-CHECKLIST.md` Critical + High đều PASS trên live deployment.
