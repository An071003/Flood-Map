# 25 — V3.1 Implementation Plan

## Phase 1 — Basemap
1. Locate style/provider.
2. Reproduce `API KEY REQUIRED`.
3. Fix provider/config.
4. Verify attribution.
5. Test all viewports.

## Phase 2 — Boundary
1. Load real HCMC boundary.
2. Validate geometry.
3. Add mask.
4. Add outline.
5. Verify roads still align.

## Phase 3 — Data semantics
1. Add data-class metadata.
2. Update labels.
3. Fix confidence wording.
4. Add source tooltip/details.

## Phase 4 — 3D
1. Audit current depth rendering.
2. Implement/test vertical height.
3. Add controlled exaggeration.
4. Add tween cleanup.
5. Screenshot 5/15/30/50 cm test.

## Phase 5 — Mobile
1. Bottom sheet.
2. Compact timeline.
3. Compact layers.
4. Mobile search.
5. Touch/keyboard tests.

## Phase 6 — Performance
1. Profile render loops.
2. Check MapLibre lifecycle.
3. Check Three disposal.
4. Check GSAP.
5. Add degradation.

## Phase 7 — Release QA
Run acceptance checklist and release prompt.
