# 11 — Acceptance Checklist

## Visual
- [ ] Map is dominant, not boxed into small card.
- [ ] Design tokens match spec.
- [ ] Weather icons visually float over areas.
- [ ] Flooded areas have real 3D height difference.
- [ ] Inspector hierarchy is readable in 3 seconds.
- [ ] Timeline is always discoverable.

## Functional
- [ ] Toggle weather/flood layers independently.
- [ ] Select area from map and search.
- [ ] Scrub timeline without UI freeze.
- [ ] Flood model returns confidence + reasons.
- [ ] Stale/error/demo states are explicit.

## Performance
- [ ] No per-frame React state churn.
- [ ] No geometry/material creation in render loop.
- [ ] Mobile effect tier reduced.

## Quality
- [ ] lint
- [ ] typecheck
- [ ] test
- [ ] build
- [ ] keyboard basics
- [ ] reduced motion
- [ ] no secret committed
