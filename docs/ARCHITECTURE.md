# Technical Architecture — Flood Map HCMC

## 1. High-Level Architecture Flow

```text
User Input / Search / GPS
         ↓
 Geocoding Service (Hybrid: Local Curated + Nominatim Geocoder)
         ↓
  Normalized SearchPlace
         ↓
  Segment Snapping (Orthogonal point-to-segment projection)
         ↓
   [Unsupported Check: distance > 300m → User Confirmation Gate]
         ↓
   Topological Routing Graph (Nodes + Segments + Directionality)
         ↓
  Flood-Aware Routing Engine (Dijkstra + Cost Penalties)
         ↓
 Multi-Candidate Evaluation (LEAST_FLOOD, BALANCED, FASTEST)
         ↓
     Zustand Application Store
         ↓
 MapStage (MapLibre GL) & UI Shell (Inspector, RoutePlannerPanel, SearchModal)
```

## 2. Core Architectural Subsystems

### A. Geocoding Subsystem (`src/services/geocoding/`)
- **`GeocodingProvider` Contract**: Common interface defining `search(query, options)` and optional `reverse(lng, lat)`.
- **`NominatimGeocodingProvider`**: OpenStreetMap Nominatim provider scoped strictly to the HCMC bounding box (`106.35, 10.37, 107.03, 11.16`). Enforces client-side debounce (250ms), custom user-agent attribution, and error catching.
- **`LocalGeocodingProvider`**: In-memory database of curated landmarks, major streets, and regex-based Vietnamese address/alley heuristics.
- **`HybridGeocodingService`**: Orchestrates local and external providers, normalizes results into standard `SearchPlace`, filters geographic boundaries, ranks by relevance, and deduplicates.

### B. Segment Snapping Subsystem (`src/services/geodata/hcmc-places-database.ts`)
- Replaces naive nearest-node distance with orthogonal projection to line segments across `HCMC_GRAPH_SEGMENTS`.
- Computes true Euclidean distance in meters from input coordinates `(lng, lat)` to the nearest segment point `(snappedLng, snappedLat)`.
- Classifies snap confidence into 4 standard tiers:
  - `exact`: distance $\le 25$ m
  - `near`: distance $\le 80$ m
  - `far`: distance $\le 300$ m
  - `unsupported`: distance $> 300$ m
- When `status === 'unsupported'`, routing execution is blocked until explicit user confirmation.

### C. Routing Engine Subsystem (`src/domain/routing/`)
- **Adjacency & Graph**: Directed adjacency map honoring segment `bidirectional` flags and `roadClass` attributes (`trunk`, `primary`, `secondary`, `tertiary`, `residential`, `service`).
- **Cost Formulation**:
  $$\text{EdgeCost} = \text{baseTravelSeconds} \times (1 + \text{depthPenalty} + \text{unknownPenalty}) \times \text{diversityMultiplier}$$
- **Multi-Candidate Generation**:
  - Corridor 1: Dijkstra with `LEAST_FLOOD` cost profile.
  - Corridor 2: Dijkstra with `BALANCED` cost profile + edge penalties on corridor 1 edges.
  - Corridor 3: Dijkstra with `FASTEST` cost profile + high edge penalties on previous corridors.
- **Candidate Diversity & Omission**: Evaluates overlap ratio. When duplicate corridors occur or vehicles are blocked by severe water, returns explicit omission rationale to the UI.

### D. Map Lifecycle & UI Shell (`src/features/map/MapStage.tsx`)
- **Persistent WebGL Canvas**: The MapLibre map instance remains permanently mounted during session lifetime. Switching between Browse, Road-Selected, and Route-Planning modes modifies layer filters and GeoJSON sources without rebuilding the map.
- **State Snapshot & Restoration**: Opening the route planner captures a `priorMapStateSnapshot` (selected road, active layers, timeline hour); closing the planner completely restores the browse state.
- **Layer Stacking Hierarchy**:
  1. Base raster/vector basemap
  2. HCMC administrative boundary
  3. Neutral road network
  4. Contextual road flood overlay (selected road only in browse mode)
  5. Route alternatives (muted underlay)
  6. Route selection casing (high-contrast boundary)
  7. Route flood & UNKNOWN segments (inner core line)
  8. Origin/Destination markers & off-graph connector lines
