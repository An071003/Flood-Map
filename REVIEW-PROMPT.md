# REVIEW AUDIT REPORT — Flood Map HCMC V3

**Date**: 2026-09-18  
**Scope**: Comprehensive audit of current codebase against `AGENT.md`, `docs/`, and V3 Road-First requirements.

---

## 1. Audit Matrix

| # | Requirement | Current Behavior | Relevant File / Component | Severity | Proposed Fix |
|---|---|---|---|---|---|
| 1 | **Basemap / API-Key placeholder** | Uses CARTO dark raster tiles. No API key text, but no fallback if network error occurs. | `src/features/map/MapStage.tsx` | Medium | Add dark base `#07111F` canvas fallback and tile error handling. |
| 2 | **HCMC Administrative Boundary** | Only bounding box clamp is set. No administrative boundary line or mask exists. | `src/features/map/MapStage.tsx`, `src/services/geodata/` | **Critical** | Add official HCMC boundary GeoJSON line and an inverted mask layer to de-emphasize regions outside HCMC. |
| 3 | **Road Geometry as Primary Entity** | Code uses random polygon areas (`HCMC_AREAS`). Major roads are not represented as `LineString`. | `src/services/geodata/hcmc-areas.ts`, `src/types/index.ts` | **Critical** | Introduce `RoadSegment` model with real GeoJSON `LineString` coordinates for major HCMC traffic corridors. |
| 4 | **Random Polygon Flood Layer** | Map renders polygon fills as the primary flood visualization concept. | `src/features/map/MapStage.tsx`, `ThreeFloodLayer.ts` | **Critical** | Deprecate polygon flood fills as primary layer; replace with road flood overlays and 3D road flood ribbons. |
| 5 | **Search Query Persistence** | Search query input is cleared when an item is selected (`setSearchQuery('')`). | `src/components/SearchModal.tsx`, `src/components/TopBar.tsx` | **Critical** | Persist `searchQuery` in store so the searched term remains visible in the search bar after selection. |
| 6 | **Road Selection Alignment** | Selection relies on polygon centroids. Popup/marker can drift from the actual road segment. | `src/features/map/MapStage.tsx` | **Critical** | Anchor popups and selection markers strictly to the road segment's `anchorPoint` / `labelPoint` (midpoint on line). |
| 7 | **3D Flood Depth Readability** | Extrudes large polygon water prisms; road flood depth cannot be differentiated in 3D. | `ThreeFloodLayer.ts` | **High** | Implement 3D road flood ribbons with distinct elevation heights for 5cm, 15cm, 30cm, 50cm via `renderHeight = clamp(0.08 + depthCm * 0.02, 0.08, 1.4)`. |
| 8 | **Timeline Behavior** | Timeline updates area snapshots, but not road-centric data. | `src/features/timeline/ForecastTimeline.tsx`, `weather-service.ts` | **High** | Connect timeline directly to `RoadSegment` states (NOW, +1h, +3h, +6h, +12h, +24h) with smooth depth transitions. |
| 9 | **Inspector Density** | Inspector displays high-density cards with cluttered secondary metrics. | `src/features/inspector/InspectorPanel.tsx` | **High** | Restructure inspector to prioritize road name, district, estimated depth, severity, rain 3h, drainage, tide, and expandable details. |
| 10 | **Data Labeling Honesty** | General badges without explicit distinction between simulated, estimated, and observed. | `src/features/inspector/InspectorPanel.tsx`, `src/types/index.ts` | **High** | Display explicit badges: `MÔ PHỎNG`, `ƯỚC TÍNH`, and `QUAN TRẮC` (only for real sensors). |
| 11 | **Confidence Semantics** | Displays an unexplained percentage (e.g. 74%) without confidence band documentation. | `src/domain/flood-model/engine.ts`, `InspectorPanel.tsx` | **High** | Prioritize `confidenceBand: 'low' | 'medium' | 'high'` with explanatory tooltip defining contributing factors. |
| 12 | **Mobile Bottom Sheet** | Bottom sheet only expands on click, lacks fluid touch swipe gestures. | `src/features/inspector/InspectorPanel.tsx`, `app.css` | **Medium** | Implement touch gesture listeners (`onTouchStart`, `onTouchMove`, `onTouchEnd`) for mobile drawer expansion. |
| 13 | **Accessibility** | Basic keyboard handling without full ARIA semantics on road list and rail buttons. | `TopBar.tsx`, `LayerRail.tsx`, `SearchModal.tsx` | **Medium** | Ensure WCAG AA contrast, accessible labels, focus rings, and `prefers-reduced-motion` compliance. |
| 14 | **Three.js Lifecycle & Camera Matrix** | Camera world matrix not locked; requires explicit identity sync for MapLibre custom layer. | `ThreeFloodLayer.ts` | **High** | Set `camera.matrixAutoUpdate = false`, maintain identity matrices, and dispose GPU buffers cleanly. |
| 15 | **MapLibre Source/Layer Lifecycle** | Layer update re-sets data without feature ID stability. | `MapStage.tsx` | **Medium** | Use stable string IDs for `setFeatureState` to manage hover and selection highlights smoothly. |

---

## 2. Implementation Phases Plan (from `docs/16-IMPLEMENTATION-PHASES.md`)
- **Phase 1 (Map Correctness)**: Basemap fallback, HCMC boundary line + outside dimming mask, road anchor points.
- **Phase 2 (Road-First Data Model)**: `RoadSegment` type, major HCMC road dataset, road line vector layers.
- **Phase 3 (Search + Inspector)**: Search query persistence, road-first search results, streamlined inspector.
- **Phase 4 (Timeline & Semantics)**: Timeline hourly road flood states, `MÔ PHỎNG` / `ƯỚC TÍNH` labeling, confidence bands.
- **Phase 5 (3D Road Flood Ribbon)**: Three.js road ribbon extrusion with depth heights (5/15/30/50 cm).
- **Phase 6 (Mobile & Quality)**: Mobile bottom sheet touch gestures, keyboard accessibility, test suites, DoD validation.
