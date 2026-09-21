# ROUTING REGRESSION QA

After replacing geometry, verify routing still works.

## Topology
- A→B path exists where expected
- no impossible jump edges
- no disconnected accidental gaps
- one-way respected where data supports it
- bridges connect correct banks only

## Candidates
- do not invent duplicates
- alternative routes are genuinely distinct
- omission reason still works

## Flood
- selected route segmentation follows real road geometry
- UNKNOWN remains dashed
- UNKNOWN != 0 cm
- coverage excludes unknown distance

## Snapping
- on-road search snaps close to actual road
- off-road search reports distance
- unsupported remains explicit

## V5 UX
- browse roads neutral
- selected road contextual only
- route casing retained
- alternatives muted
- map core remains mounted

## Performance
Real geometries can contain more vertices.

Check:
- load time
- route recompute
- map pan/zoom
- mobile performance

Use sensible preprocessing/simplification only if visual road alignment is preserved.
