# AGENT — P0 Real Road Geometry

## Mission

Fix road geometry credibility before continuing V6 feature expansion.

Current failure:
- overlay line cuts through land/buildings
- route geometry does not follow visible basemap roads
- snapping is mathematically correct against geometry that is itself wrong

## Priority

This is P0.

Pause:
- geocoding expansion
- new route features
- UI polish unrelated to geometry

until real road geometry is established.

## Invariant

For any road/route shown as a navigable path:

```text
rendered geometry ≈ real road centerline
```

It must not:
- cut across buildings
- cut through parcels
- cross rivers except on bridges
- skip roundabouts
- draw straight shortcuts between intersections
- run parallel far away from actual road

## Single Source of Truth

Do not maintain unrelated geometry in:
- `hcmc-roads.ts`
- `hcmc-graph-network.ts`

Target:

```text
REAL ROAD NETWORK
      │
      ├── map road rendering
      ├── monitored-road metadata
      ├── routing graph
      ├── snapping
      └── flood state attachment
```

## Geometry quality

Navigation geometry must be verified.

Optional:
```ts
type GeometryQuality =
  | 'verified'
  | 'approximate'
  | 'invalid'
```

Never render `approximate` geometry as authoritative turn-by-turn/navigation path.

## Preserve

Do not regress:
- V5 browse/selected-road/route modes
- UNKNOWN semantics
- route coverage
- route candidate diversity
- snapping warnings
- mobile UI
- map core persistence
