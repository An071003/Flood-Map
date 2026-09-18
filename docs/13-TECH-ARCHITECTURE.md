# 13 — Tech Architecture

## Suggested modules

```text
src/
  app/
  map/
    MapView.tsx
    mapSources.ts
    mapLayers.ts
    boundary/
    roads/
  flood/
    model/
    selectors/
    timeline/
  weather/
  search/
  inspector/
  stores/
  three/
    RoadFloodLayer.ts
    geometry.ts
    materials.ts
  data/
    sources/
    adapters/
  utils/
```

## State separation
- map viewport state
- selected road
- timeline
- layer toggles
- data status
- user search query

Không để một store thay đổi làm rerender toàn bộ map nếu không cần.

## MapLibre
- source/layer lifecycle rõ
- id stable
- không add duplicate source/layer
- cleanup listeners

## Three.js
- one render integration path
- cleanup geometry/material
- cancel animation/tweens
- avoid leaked event listeners
