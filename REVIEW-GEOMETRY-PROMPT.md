# REVIEW GEOMETRY PROMPT

Do not code yet.

Audit all geometry sources.

## Files

Inspect at minimum:
- `src/services/geodata/hcmc-roads.ts`
- `src/services/geodata/hcmc-graph-network.ts`
- `src/services/geodata/hcmc-places-database.ts`
- `src/features/map/MapStage.tsx`
- route engine
- snapping utilities
- any GeoJSON / OSM / static road files

## A. Identify synthetic geometry

For every road/segment report:

| ID | Road | Source file | Coord count | Length | Geometry origin | Quality |
|---|---|---|---:|---:|---|---|

Quality:
- VERIFIED_REAL
- APPROXIMATE
- HAND_WRITTEN
- UNKNOWN

Flag suspicious:
- multi-km road with only 2–4 coordinate points
- straight chord between distant intersections
- geometry that cannot explain actual road bends
- duplicated road geometry in multiple files

## B. Rendering chain

Trace:

```text
Road data
→ GeoJSON source
→ MapLibre layer
```

Confirm whether renderer modifies coordinates.

Expected:
renderer should not be blamed if it receives wrong geometry.

## C. Routing chain

Trace:

```text
graph segment
→ route candidate
→ candidate.geometry / candidate.segments
→ selected route GeoJSON
→ MapLibre
```

Identify where geometry is produced.

## D. Snapping

Verify:
- node snapping
- segment projection
- whether snapping projects onto synthetic geometry

## E. Duplication

Find roads represented separately in:
- monitored road dataset
- routing graph
- search database

Report mismatched geometry.

## F. Final review output

Provide:
1. root cause
2. affected modules
3. exact migration plan
4. safe temporary fallback
5. files to retire or refactor

Do not implement until this review is complete.
