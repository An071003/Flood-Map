# AGENT-V4.md — Route Planner

## Mission
Xây V4 trên nền V3.3 ổn định: tìm nhiều tuyến giữa A và B, đánh giá theo ngập, hỗ trợ xe máy/xe hơi và forecast hour.

## Preserve V3.3
Không regression:
- road-first flood map
- HCMC boundary + outside mask
- basemap
- search persistence
- selected-road alignment
- timeline
- 3D depth
- data provenance/confidence
- mobile bottom sheet

## Primary entities
- RoadNode
- RoadSegment
- RoadGraph
- VehicleProfile
- RouteRequest
- RouteCandidate
- RouteEvaluation
- SegmentFloodState

## Mandatory principles
1. Route chạy trên road graph thật.
2. Route = chuỗi RoadSegment.
3. Flood cost tính từng segment.
4. UNKNOWN không được coi SAFE.
5. Vehicle profile phải ảnh hưởng cost/ranking.
6. Có Least Flood / Balanced / Fastest.
7. Hiển thị ETA, distance, max depth, warning/severe count, coverage, unknown count.
8. Route phải explainable.
9. Không dùng wording bảo đảm an toàn.
10. Không bật routing toàn thành phố nếu coverage chưa đủ.

## Implementation order
Audit → expand roads → graph → vehicle profiles → flood cost → candidates → ranking → UI → mobile → QA → release.
