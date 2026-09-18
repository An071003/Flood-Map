# 16 — Implementation Phases

## Phase 0 — Audit
- xác định basemap hiện tại
- xác định source/layers
- xác định polygon flood code
- xác định search state
- xác định marker anchoring
- xác định Three integration

Output: audit report, không sửa lớn.

## Phase 1 — Map correctness
- fix API-key/style issue
- add HCMC boundary
- add outside mask
- verify labels
- fix road anchors

Exit criteria: toàn bộ Critical liên quan map đạt.

## Phase 2 — Road-first refactor
- define RoadSegment
- import/create major road dataset
- render road risk layer
- remove/de-emphasize area polygon layer
- update selection

Exit criteria: road là primary entity.

## Phase 3 — Search + Inspector
- persist query
- road-first results
- selected road UX
- inspector hierarchy mới

## Phase 4 — Timeline + data semantics
- observed/forecast/estimated labels
- timeline update state
- trend
- loading/stale/error

## Phase 5 — 3D road flood
- ribbon/extrusion
- depth mapping
- GSAP transitions
- performance cleanup

## Phase 6 — Mobile + accessibility
- bottom sheet
- touch targets
- tooltip
- keyboard
- reduced motion

## Phase 7 — QA
- run `docs/17-TEST-PLAN.md`
- confirm acceptance checklist
