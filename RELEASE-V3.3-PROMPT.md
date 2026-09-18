# V3.3 Release Check

Review LIVE:
https://an071003.github.io/Flood-Map/

## Desktop
- 1440×900
- 1280×720

## Mobile
- 390×844
- 360×800

## Critical flow
1. Load live page
2. No API/token errors
3. City overview
4. Boundary visible
5. Outside mask visible
6. Search Nguyễn Hữu Cảnh
7. Select result
8. Query persists
9. Road alignment correct
10. Toggle 3D
11. Depth heights remain distinct
12. Timeline +3h then +24h
13. Switch road
14. Return city overview
15. Mobile bottom sheet works
16. Mobile search works

## Stress
- 10 road switches
- 10 2D/3D toggles
- rapid timeline scrub
- 10 layer toggles

## FAIL if
- boundary only exists in source, not live
- boundary asset 404
- mask hides HCMC
- road offset regression
- desktop sidebar remains on mobile
- duplicate meshes/layers appear
- progressive slowdown appears

Output PASS/FAIL table + blockers.
