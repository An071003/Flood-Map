# MASTER PROMPT — Flood Map HCMC

> **System Identity**: Flood Map HCMC is an urban command center and civic web application for tracking weather conditions and estimating flood risks across Ho Chi Minh City using an interactive 3D map canvas, MapLibre GL, Three.js water surface extrusion, and a deterministic flood risk engine.

---

## 1. Product Vision & Core Mission

### Problem Statement
Residents and commuter populations in Ho Chi Minh City face severe disruption during convective storms and tidal surges. Traditional weather apps report only general rainfall probability ("60% rain"), leaving citizens unaware of:
- Which specific streets and low-lying basins will submerge;
- The estimated water depth in centimeters;
- How long floodwaters will take to recede;
- The level of confidence in the forecast data;
- What safety precautions to take before travelling.

### Core Job-To-Be-Done (JTBD)
> *"Before stepping out, I want a quick, trustworthy 3D map of Ho Chi Minh City to see which areas are flooded or at imminent risk within the next 24 hours."*

---

## 2. Technical Architecture & Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                      REACT APP SHELL                        │
│   TopBar (72px)   │   LayerRail (56px)  │   Legend          │
│   InspectorPanel  │   ForecastTimeline  │   SearchModal     │
├─────────────────────────────────────────────────────────────┤
│                    3D MAP CANVAS LAYER                      │
│   MapLibre GL JS (Basemap, Camera, Vector Polygons)         │
│   Three.js CustomLayer (3D Water Mesh, Rain, Billboards)    │
├─────────────────────────────────────────────────────────────┤
│                      CORE DOMAIN & STATE                    │
│   Flood Risk Engine (Pure Deterministic TypeScript)         │
│   Weather Service (Hourly Scenarios & Open-Meteo Adapter)  │
│   Zustand Store (Layers, Selection, Timeline, Camera)       │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend Core**: React 19 + Vite + TypeScript (strict mode, zero un-annotated `any`).
- **Geospatial Basemap**: MapLibre GL JS (`maplibre-gl`) utilizing high-performance dark raster/vector tiles with HCMC bounding limits (`[106.35, 10.35]` to `[107.05, 11.15]`).
- **3D Graphics & Simulation**: Three.js (`three`) WebGL custom layer synchronized via MapLibre's Mercator coordinate system (`maplibregl.MercatorCoordinate` and `CustomRenderMethodInput.modelViewProjectionMatrix`).
- **Motion & Interpolation**: GSAP (`gsap`) for timeline scrubber transitions, panel reveals, camera flight easing (`power3.inOut`), and water level interpolation.
- **State Management**: Zustand (`zustand`) for responsive, lightweight UI state.
- **Quality Gates**: Vitest, React Testing Library, ESLint 9 (Flat Config), TypeScript strict.

---

## 3. Visual Language & Design Tokens

Adheres strictly to `docs/design-tokens.json`:

| Token | Hex | Role |
|---|---|---|
| `bg.canvas` | `#07111F` | Deep navy base canvas |
| `bg.panel` | `#0B1728` | Floating chrome & inspector panels |
| `bg.panelElevated`| `#102238` | Hovered / elevated cards |
| `border.subtle` | `#213A52` | 1px clean separation borders |
| `text.primary` | `#F4F8FC` | Crisp display and body text |
| `text.secondary`| `#A9BED0` | Subtitles, units, and secondary labels |
| `text.muted` | `#6F8CA3` | Metadata, timestamps, and captions |
| `accent.cyan` | `#39C6FF` | Weather icons, primary focus, interactive state |
| `accent.blue` | `#397BFF` | Timeline controls and forecast indicators |
| `safe` | `#2FD39A` | Safe condition (< 0.30 score, 0–5 cm) |
| `watch` | `#F7C948` | Watch condition (0.30–0.50 score, 5–15 cm) |
| `warning` | `#FF9F43` | Warning condition (0.50–0.72 score, 16–35 cm) |
| `severe` | `#FF5D73` | Severe condition (≥ 0.72 score, > 35 cm) |
| `rain` | `#8B9DFF` | Rain particles and accumulation bars |

### Typography
- **Display & Hero Metrics**: `Space Grotesk`, fallback `Inter`.
- **UI & Body**: `Inter`.

---

## 4. Deterministic Flood Risk & Depth Engine

The domain engine (`src/domain/flood-model/engine.ts`) is 100% deterministic and pure TypeScript:

### Feature Normalization & Formula
```ts
score =
  0.20 * normRainIntensity +
  0.22 * normAcc3h +
  0.10 * normAcc6h +
  0.14 * lowElevationScore +
  0.12 * poorDrainageScore +
  0.10 * historicalFloodScore +
  0.08 * tidePressureScore +
  0.04 * observedSensorSignal;
```

### Depth Extrusion & Clamping
```ts
renderHeight = clamp(0.15 + depthCm * 0.028, 0.15, 2.1);
```

### Confidence Degradation Model
- Base confidence: `0.92`
- Missing tidal data: `-0.12`
- Missing sensor signal: `-0.05`
- Stale data (> 15 min): penalize proportionally up to `-0.25`
- Distant forecast (> 0h): `-0.022 * forecastHour`
- Clamped range: `0.20` to `0.95`

---

## 5. Viewport Layout Specifications

### Desktop (1440 × 900)
- **Top Bar**: Fixed 72px with branding, keyboard search shortcut (`⌘ K`), data freshness badge (`live-dot`), 2D/3D toggle, settings.
- **Layer Rail**: Left-aligned floating pill (56px) for toggling Water, Rain, Weather, Tide, 3D/2D, and Camera reset.
- **Map Canvas**: Dominant hero occupying > 70% viewport.
- **Inspector**: Right floating card (360px) showing Area Name, Weather Condition, Estimated Depth hero number, 2x2 metric grid, Confidence bar, Contributing Reasons, Safety Advice.
- **Timeline**: Bottom floating bar (left: 88px, right: 392px, height: 82px) with scrubber, play/pause ticker, and dynamic forecast notes.

### Mobile (390 × 844)
- **Top Bar**: Compact 64px header.
- **Layer Rail**: Compact horizontal bar at top-left.
- **Inspector**: Responsive bottom sheet (220px peek to 75vh expanded) with drag handle pill.
- **Touch Targets**: Strictly ≥ 44px for accessible interaction.

---

## 6. Definition of Done (DoD)

All builds and PRs must satisfy:
```bash
npm run lint       # ESLint 0 errors, 0 warnings
npm run typecheck  # TypeScript strict compiler passes
npm run test       # Vitest unit & component test suite 100% pass
npm run build      # Vite production bundle build passes
```
