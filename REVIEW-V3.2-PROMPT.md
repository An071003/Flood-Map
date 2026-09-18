# REVIEW V3.2 PROMPT

Audit code hiện tại trước khi sửa. Không code trong bước này.

Tạo bảng:
| Requirement | Current behavior | File/component | PASS/PARTIAL/FAIL | Severity | Fix |
|---|---|---|---|---|---|

## Boundary
1. Có boundary source chưa?
2. Source là dữ liệu hành chính thật hay placeholder?
3. Polygon hay MultiPolygon?
4. Có outside-mask chưa?
5. Layer order hiện tại là gì?
6. Mask có thể che label/road không?

## 3D
7. `depthCm -> height` đang map ở file nào?
8. Height có thực sự thay geometry Z không?
9. 7cm vs 37cm chênh bao nhiêu về visual height?
10. Color đang carry bao nhiêu thông tin so với height?
11. Có z-fighting không?
12. Có duplicate RAF/render loop không?

## Mobile
13. Breakpoint hiện tại?
14. Inspector có thật sự là bottom sheet không?
15. Bottom sheet có snap states không?
16. Timeline mobile có bị quá cao không?
17. Layer controls có touch-safe không?
18. Search có bị keyboard che không?

## Performance
19. Three geometry/material disposal?
20. GSAP cleanup?
21. MapLibre listener/source/layer cleanup?
22. Rapid timeline scrub có tạo duplicate animation?
23. Mobile có degrade expensive effects không?

Sau audit, lập kế hoạch theo 4 phase:
- Boundary
- 3D
- Mobile
- Performance + QA
