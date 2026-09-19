# IMPLEMENT V4.3

## Phase 1 — QA UNKNOWN fixture
Tạo test-only scenario:
```ts
const qaUnknownRouteScenario = {
  id: 'qa-unknown-route',
  overrides: {
    'segment-x': { status: 'unknown', reason: 'qa_fixture' }
  }
}
```

Yêu cầu:
- production OFF mặc định
- route đi qua >=1 unknown
- expected coverage <100%

Ví dụ:
`Độ phủ dữ liệu: 82%`
`Chưa đo: 2 đoạn`

## Phase 2 — Unknown map style
Unknown:
- neutral blue-gray
- dashed
- opacity thấp hơn known
- tooltip `Chưa đủ dữ liệu ngập cho đoạn này`
- không dùng safe green

## Phase 3 — Legend
Thêm:
`- - -  Chưa đủ dữ liệu`

Legend:
- An toàn
- Theo dõi
- Cảnh báo
- Nghiêm trọng
- Chưa đủ dữ liệu

## Phase 4 — Candidate omission reason
Add:
```ts
type CandidateOmissionReason =
  | 'duplicate'
  | 'vehicle_blocked'
  | 'flood_blocked'
  | 'disconnected'
  | 'no_distinct_alternative'
```

UI mapping:
- duplicate -> `Không có tuyến khác đủ khác biệt để hiển thị.`
- vehicle_blocked -> `Một tuyến bị loại do không phù hợp với phương tiện đã chọn.`
- flood_blocked -> `Một tuyến bị loại do mức ngập dự báo quá cao.`
- disconnected -> `Không tìm được kết nối hợp lệ cho một phương án.`
- no_distinct_alternative -> `Chỉ tìm được N tuyến khác biệt tại thời điểm này.`

## Phase 5 — Map state stability
Preferred:
```tsx
<AppShell>
  <FloodMapCore />
  <TopBar />
  <LayerRail />
  <Timeline />
  <RoutePlannerOverlay open={routeMode} />
</AppShell>
```

Avoid:
```tsx
return routeMode ? <RoutePlannerOnly /> : <FloodMapOnly />
```

Requirements:
- MapLibre instance stays mounted
- Three flood layer stays mounted
- route overlay is additive
- closing planner restores selected road/time/layer state
- route planner only cleans resources it owns

## Phase 6 — Regression
Open/close route planner 10 times.
No duplicate layer/source/listener.
No missing controls.
