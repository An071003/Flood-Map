# IMPLEMENT — REAL ROAD GEOMETRY

Implement after geometry review.

## Phase 1 — Introduce canonical road network

Create a single canonical network representation.

Example:

```ts
interface CanonicalRoadSegment {
  id: string

  source:
    | 'osm'
    | 'verified_geojson'
    | 'other_verified_source'

  sourceWayId?: string

  roadName?: string

  roadClass:
    | 'trunk'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'residential'
    | 'service'

  fromNodeId: string
  toNodeId: string

  oneWay: boolean
  access?: string

  geometry: GeoJSON.LineString

  lengthMeters: number
  estimatedTravelSeconds?: number

  geometryQuality: 'verified' | 'approximate'
}
```

## Phase 2 — Use real centerline geometry

Do NOT manually add waypoint guesses.

Use a real road-network source suitable for the project.

Requirements:
- preserve source attribution/license
- geometry must follow actual road centerline
- retain enough vertices to follow curves/roundabouts/ramps
- do not simplify so aggressively that roads cut through parcels

If using OSM-derived geometry:
- keep way/node topology
- preserve highway class
- preserve one-way where available
- preserve bridge/tunnel where useful

## Phase 3 — Segment at real topology boundaries

Do not model an entire corridor as one synthetic straight segment.

Split at:
- intersections
- routing junctions
- road-class/access changes
- one-way changes
- bridge/ramp topology where required

Each routing edge uses the actual geometry between its graph nodes.

## Phase 4 — Retire duplicate geometry

Refactor so `hcmc-roads.ts` does not independently own hand-written road geometry.

Monitored roads should reference canonical segments.

Example:

```ts
interface MonitoredRoad {
  id: string
  roadName: string
  segmentIds: string[]

  estimatedDepthCm: number
  riskLevel: RiskLevel
  ...
}
```

Selected road geometry is derived by merging/referencing canonical segment geometry.

## Phase 5 — Routing uses same source

`GraphRoadSegment.geometry` must come from canonical network.

Do not maintain a second hand-authored route geometry.

Rule:

```text
Map geometry === routing geometry
```

up to intentional styling only.

## Phase 6 — Real segment snapping

Project search/GPS point onto canonical segment geometry.

```ts
RouteSnapResult {
  inputLng
  inputLat

  snappedLng
  snappedLat

  segmentId
  distanceMeters
  status
}
```

Do not snap against approximate/synthetic road geometry.

## Phase 7 — Flood state attachment

Attach flood state to canonical segment IDs.

Example:

```ts
Record<segmentId, SegmentFloodState>
```

Unknown data remains UNKNOWN.

Do not use road geometry as flood truth.

## Phase 8 — Temporary fallback

Until a road geometry is verified:

Option A:
- do not render it as navigation route

Option B:
- render only marker + inspector

Do not show an approximate line that cuts across land as if it were authoritative.

## Phase 9 — Map rendering

Preserve V5 visual hierarchy:
- browse neutral
- selected road only highlighted
- alternatives muted
- selected route casing
- flood severity inner line
- unknown dashed

Only geometry source changes.

## Phase 10 — Remove obsolete hand-written geometry

After canonical geometry works:
- remove duplicated hand-written LineStrings
- update imports
- update canonical docs
- do not keep old geometry as hidden fallback unless explicitly marked non-production
