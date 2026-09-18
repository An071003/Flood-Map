# IMPLEMENT V4 PROMPT

## Phase 1 — Road network expansion
Ưu tiên trunk/primary/secondary và selected tertiary roads. Không ingest toàn bộ hẻm.

Mỗi segment cần topology, class, directionality, length, travel time.

## Phase 2 — Flood forecast per segment
NOW/+1/+3/+6/+12/+24. Missing => unknown.

## Phase 3 — Vehicle profiles
Motorbike và car dùng configurable penalty curves. Không claim physical guarantee.

## Phase 4 — Graph + routing
Generate multiple candidates, support blocked edges/penalties, tránh duplicate alternatives.

## Phase 5 — Route evaluation
Compute travel time, distance, max depth, cumulative flood score, warning/severe count, unknown count, coverage, confidence summary.

## Phase 6 — Ranking
Return Least Flood / Balanced / Fastest. Nếu chỉ có 1 route unique, không fake 3 route.

## Phase 7 — UI
Inputs: A/B, vehicle, departure time.
Cards: ETA, distance, max flood, coverage, recommendation, explanation.
Map: selected route + alternatives + flood-colored segments.

## Phase 8 — Mobile
Bottom sheet route results.

## Phase 9 — QA
Run test + regression docs.
