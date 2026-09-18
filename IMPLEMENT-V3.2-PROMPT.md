# IMPLEMENT V3.2 PROMPT

Hãy implement V3.2 trên code hiện tại.

Không rewrite app. Không thêm feature mới. Không redesign phần đã ổn.

## Phase 1 — HCMC Boundary + Outside Mask

### Boundary source
Dùng dữ liệu hành chính thật của TP.HCM.
- hỗ trợ Polygon/MultiPolygon
- validate geometry
- không approximate bằng polygon tự vẽ
- simplify nếu cần nhưng giữ hình dạng hợp lý

### Rendering order
1. basemap
2. outside mask
3. HCMC fill transparent
4. HCMC outline
5. roads
6. flood road overlays
7. labels/pins

### Visual
Boundary:
- subtle cyan/blue-gray
- 1–2px
- opacity vừa phải

Outside:
- giảm brightness
- giảm saturation
- giảm contrast
- vẫn giữ orientation context

### Acceptance
Khi zoom city overview:
- nhìn ngay thấy đâu là TP.HCM
- ngoài TP.HCM bị de-emphasize
- road layer vẫn align đúng

## Phase 2 — Stronger 3D Depth

Hiện 3D đã hoạt động nhưng vertical depth còn subtle.

Dùng mapping mạnh hơn:
```ts
visualHeight = clamp(
  0.12 + depthCm * 0.03,
  0.12,
  1.8
)
```

Target:
- 5–7 cm: thấp
- 15 cm: thấp-vừa
- 25–30 cm: rõ
- 40–50 cm: nổi bật

Không được chỉ đổi color/width/opacity. Phải thay đổi vertical geometry/height thật.

Animation:
- GSAP 300–600ms
- cancel old tween khi scrub nhanh
- không duplicate RAF
- preserve selected-road state

## Phase 3 — Mobile Bottom Sheet

Target:
- 390x844
- 360x800

Mobile:
- map là background chính
- inspector thành bottom sheet
- collapsed: road + depth + severity + trend
- half: rain/drainage/tide/reason
- expanded: recommendation + vehicle passability + technical data + provenance + confidence
- drag handle + snap points
- timeline compact
- layer controls thu gọn
- search mobile-safe
- touch target >=44px

## Phase 4 — Performance + QA

### Three.js
- single render integration
- dispose geometry/material/texture
- no orphan objects
- no duplicate RAF

### GSAP
- kill tweens on road change, timeline change, unmount

### MapLibre
- cleanup listeners
- cleanup custom layers
- no duplicate source/layer IDs

### Mobile performance
Low-end: reduce reflection/ripple/particles while preserving flood readability.

### Accessibility
- aria-label
- visible focus
- color + icon + text
- reduced motion
- keyboard search

Cuối cùng chạy checklist V3.2.
