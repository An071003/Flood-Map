# ROUTE UNKNOWN QA

Use QA-only unknown fixture.

PASS if:
- dataCoverage <100%
- unknownSegmentCount >0
- unknownDistanceMeters >0
- maxKnownDepth excludes unknown
- unknown route segment is dashed/neutral
- tooltip says `Chưa đủ dữ liệu`
- legend includes `Chưa đủ dữ liệu`
- unknown receives routing penalty
- unknown != 0 cm
- unknown != safe
- fixture disabled by default in production
