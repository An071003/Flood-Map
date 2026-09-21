# RELEASE — P0 GEOMETRY

Review LIVE deployment, not only source.

## Required proof

1. Phan Thúc Duyện / Trường Sơn no longer cuts through land.
2. At least 10 representative roads align with basemap.
3. Selected road geometry and route geometry use canonical road network.
4. Snap markers land on real road geometry.
5. Roundabouts/curves are preserved.
6. No straight-line shortcut across parcel/building.
7. River crossing occurs only on valid bridge/tunnel route.
8. UNKNOWN route style preserved.
9. V5 map interaction preserved.
10. Mobile remains usable.

## Repository proof

Search for old hand-written geometry.

Any remaining production hand-written LineString must be:
- justified
- marked approximate
- excluded from authoritative navigation rendering

## Release gate

P0 FAIL if any selected/navigation route visibly leaves the actual road network.
