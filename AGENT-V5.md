# AGENT-V5 — Navigation UX

## Mission
Biến Flood Map thành navigation-first application.

## Preserve
Không phá V4.x: vehicle-aware routing, forecast routing, candidate diversity, UNKNOWN semantics, coverage, boundary/mask, timeline, 3D, map-state stability.

## Interaction modes
```ts
type AppInteractionMode = 'browse' | 'road-selected' | 'route-planning'
```

### browse
- roads neutral
- no global flood-road coloring
- optional severe-alert pins
- search available

### road-selected
- only selected road highlighted
- flood severity only on selected road
- inspector + timeline active

### route-planning
- only route candidates emphasized
- selected route has route casing + flood-colored inner segments
- alternatives muted
- non-route roads neutral

## Rules
1. Global flood-road overlay default OFF.
2. Route identity and flood severity use separate visual channels.
3. Search coverage != routing coverage.
4. Address/hẻm may be searchable but not necessarily flood-modeled/routable.
5. Never fake alley flood prediction.
6. Search result types: address, road, alley, poi, intersection.
7. Flood threshold is a model preference, not a safety guarantee.
