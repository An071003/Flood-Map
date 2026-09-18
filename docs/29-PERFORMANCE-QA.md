# 29 — Performance QA

## Render lifecycle
- no duplicate RAF
- no duplicate Three scene objects
- no duplicate MapLibre layers
- no stale GSAP tweens

## Stress tests
- 20 rapid timeline scrubs
- 20 road selections
- 20 layer toggles
- 10 2D/3D toggles

Expected:
- no crash
- no duplicated visuals
- no progressive slowdown

## Mobile
Reduce expensive effects if needed.
Never sacrifice road state, depth visibility, timeline usability.
