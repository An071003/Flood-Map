# RELEASE V3.2 PROMPT

Kiểm tra release candidate cuối. Không thêm feature.

## Test viewports
- 1440x900
- 1280x720
- 768x1024
- 390x844
- 360x800

## Critical flows
1. Load map.
2. City overview.
3. Confirm HCMC boundary visible.
4. Confirm outside mask visible.
5. Search Nguyễn Hữu Cảnh.
6. Select road.
7. Search query persists.
8. Toggle 3D.
9. Compare shallow and deep road.
10. Jump timeline +3h.
11. Rapid scrub timeline.
12. Switch selected road repeatedly.
13. Test mobile bottom sheet.
14. Open/close search on mobile.
15. Toggle layers repeatedly.
16. Enable reduced motion if possible.

## Fail release if
- no visible HCMC boundary
- outside mask missing
- road alignment regresses
- 3D depth still mainly color-only
- mobile inspector blocks map
- duplicate render/tween appears
- timeline selection breaks
- controls inaccessible on mobile

Output:
- PASS/FAIL
- remaining blockers
- files changed
- known limitations
