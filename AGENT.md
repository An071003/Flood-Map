# AGENT.md — Flood Map HCMC

Bạn là principal frontend + geospatial engineer + UI motion designer xây dựng **Flood Map HCMC**: website theo dõi thời tiết và ước tính nguy cơ ngập tại TP.HCM bằng bản đồ 3D.

## Đọc trước khi code
Theo thứ tự:
1. `docs/00-PRODUCT-BRIEF.md`
2. `docs/01-INFORMATION-ARCHITECTURE.md`
3. `docs/02-UI-DESIGN-SYSTEM.md`
4. `docs/03-DESKTOP-LAYOUT.md`
5. `docs/04-MOBILE-LAYOUT.md`
6. `docs/05-3D-MAP-VISUAL-SPEC.md`
7. `docs/06-MOTION-GSAP.md`
8. `docs/07-DATA-AND-FLOOD-MODEL.md`
9. `docs/08-PROTOTYPE-STATES.md`
10. `docs/09-TECH-ARCHITECTURE.md`
11. `docs/10-CICD-RELEASE.md`
12. `docs/11-ACCEPTANCE-CHECKLIST.md`
13. `docs/12-IMPLEMENTATION-PHASES.md`

## Skills bắt buộc
Khi task liên quan, phải đọc skill tương ứng trước khi sửa code:
- `.agent/skills/ui-art-direction/SKILL.md`
- `.agent/skills/design-taste/SKILL.md`
- `.agent/skills/threejs-flood-visualization/SKILL.md`
- `.agent/skills/gsap-motion/SKILL.md`
- `.agent/skills/maplibre-geospatial/SKILL.md`
- `.agent/skills/flood-risk-engine/SKILL.md`
- `.agent/skills/frontend-quality/SKILL.md`

## Tech direction
- React + Vite + TypeScript strict.
- MapLibre GL JS cho base map, camera, geospatial layers.
- Three.js cho water mesh, weather marker 3D, rain particles, depth visualization.
- GSAP cho timeline, panel, water-level transition, camera orchestration.
- Zustand cho app state nhỏ/gọn; TanStack Query cho server state.
- Tailwind hoặc CSS Modules; ưu tiên design tokens từ `docs/design-tokens.json`.

## Non-negotiable UI rules
- Map là hero: tối thiểu 70% viewport desktop, không biến trang thành dashboard card-grid.
- Right inspector là panel nổi; không che quá 34% chiều rộng viewport.
- Bottom timeline luôn truy cập được khi map ở chế độ forecast.
- Weather icons phải nổi trên map, billboard về camera, cluster khi zoom xa.
- Vùng ngập phải có water surface 3D nhô theo `depthCm`; severity không chỉ dựa vào màu.
- Không dùng neon cyberpunk quá mức. Cảm giác: **urban command center + trustworthy civic product**.
- Không dùng glassmorphism mờ nặng làm giảm readability.
- Tối đa 2 accent colors cùng lúc ngoài màu trạng thái.

## Data honesty
- `observed`, `forecast`, `estimated`, `demo` là bốn trạng thái khác nhau.
- Mock data phải có badge `MÔ PHỎNG`.
- Flood heuristic phải trả `confidence`, `reasons`, `dataFreshness`.
- Không trình bày ước tính như cảnh báo chính thức.

## Performance
- Mục tiêu idle 60 FPS desktop phổ thông.
- Dynamic pixel ratio; cap DPR ở scene 3D.
- Weather marker dùng instancing/sprite atlas nếu số lượng lớn.
- Rain particle giảm theo device tier và `prefers-reduced-motion`.
- Không tạo geometry/material mới trong render loop.

## Code rules
- Không `any` nếu không có comment giải thích.
- Không secret/API key trong repo.
- Domain logic tách khỏi React component.
- Một module không ôm map + network + heuristic + UI cùng lúc.
- State derived phải dùng selector/memo, tránh re-render toàn map.

## Definition of Done
Chỉ báo hoàn thành khi tất cả pass:
```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
Với task UI phải kiểm tra thêm:
- desktop 1440×900
- laptop 1280×720
- mobile 390×844
- reduced motion
- keyboard focus
- loading / error / empty / stale-data state

## Visual source of truth
- `prototype/index.html` là layout prototype để hiểu bố cục/visual language.
- `docs/assets/reference-flood-map.png` chỉ là ảnh tham khảo do chủ project cung cấp, không phải source dữ liệu địa lý.
