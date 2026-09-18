# 08 — Prototype States

## State A — City overview / normal
- Most map neutral.
- 5–8 district weather markers.
- City summary: “3 khu vực cần theo dõi”.
- Timeline at NOW.

## State B — Rain building
- Rain icons over affected areas.
- WATCH polygons show light cyan water film.
- Timeline +2h selected.

## State C — Selected warning
- Camera focuses Bình Thạnh.
- Inspector open.
- Water ~28 cm visual height.
- Warning boundary amber.
- “MÔ PHỎNG” badge if using sample data.

## State D — Severe
- Water high but city labels remain readable.
- Severe coral outline.
- Inspector hero number 52 cm.
- Advice promoted, but UI remains calm.

## State E — stale/no data
- Never silently reuse old values.
- Show “Dữ liệu chậm 38 phút”.
- Reduce confidence.
- Weather marker gets stale indicator.

## State F — loading
- Map appears first.
- Skeleton only for panel text.
- Do not blank entire canvas.

## State G — provider error
- Map remains usable with last-known static layers.
- Surface inline error; retry action.
