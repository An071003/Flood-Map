# 12 — Implementation Phases

## Phase 0 — Foundation
- Vite + React + TS strict.
- Design tokens.
- App shell.
- GitHub Pages base path.
- CI green.

## Phase 1 — Map shell
- MapLibre dark style.
- HCMC camera bounds.
- Layer rail, search shell, legend, timeline shell.
- Responsive mobile layout.

## Phase 2 — Weather layer
- Normalize current + hourly forecast.
- Weather billboard markers.
- Cluster/LOD behavior.
- Freshness and provider error state.

## Phase 3 — Flood visualization
- Area polygons/cells.
- Deterministic risk heuristic.
- Three.js water surface height by depth.
- Depth pins and severity outline.

## Phase 4 — Interaction + motion
- Area selection.
- Inspector.
- GSAP water/camera/panel choreography.
- Timeline forecast transitions.

## Phase 5 — Data hardening
- Tide/elevation/history adapters.
- Confidence calibration.
- Stale/missing-data behavior.
- Replace demo data progressively.

## Phase 6 — Production
- Performance profiling.
- Accessibility pass.
- E2E smoke tests.
- Deploy + release URL.
