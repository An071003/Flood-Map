# 09 — Technical Architecture

## Suggested source tree
```text
src/
  app/
  components/
  features/
    map/
    weather/
    flood/
    timeline/
    inspector/
  domain/
    flood-model/
    weather/
  services/
    weather/
    geodata/
  stores/
  styles/
  types/
```

## Responsibility split
### MapLibre
- basemap
- camera
- labels
- district/ward vector layers
- hit testing where appropriate

### Three.js
- flood water mesh
- weather 3D/sprite markers
- rain particles
- selected-area highlight effects that require 3D

### React
- top bar
- layer rail
- inspector
- legend
- timeline
- loading/error states

### Domain model
Pure TypeScript functions. No DOM, no Three.js, no React.

## State
- Query cache: TanStack Query.
- UI selection/layers/timeline: Zustand.
- Three.js internal frame state stays outside React when possible.

## API adapter rule
Provider-specific shape ends at service adapter. UI/domain only receive normalized contracts.
