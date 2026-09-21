# Flood Map HCMC — V6 P0 Real Road Geometry Fix

Đây là patch P0 cho bug critical:

> Road/route overlay đang đi xuyên qua lô đất, công trình và không bám theo road centerline thật trên basemap.

## Root cause đã xác định

Hiện tại nhiều road và graph segment dùng `LineString` viết tay, chỉ có vài coordinate rồi nối thẳng.

Ví dụ:
```ts
coordinates: [
  [106.662, 10.797],
  [106.659, 10.801],
  [106.657, 10.806],
  [106.655, 10.812],
]
```

Đây chỉ là polyline minh họa, không phải road geometry thật.

MapLibre render đúng geometry được cung cấp, nên lỗi nằm ở data geometry, không phải renderer.

## P0 Goal

1. Không dùng hand-written road geometry làm navigation geometry.
2. Road overlay phải bám road centerline thật.
3. Routing graph phải dùng cùng geometry với map rendering.
4. Snap phải snap vào real road segment.
5. Selected-road và selected-route không được đi xuyên parcel/building.
6. Có geometry QA để bắt lỗi trước release.

## Run order

1. `AGENT-P0-GEOMETRY.md`
2. `REVIEW-GEOMETRY-PROMPT.md`
3. `IMPLEMENT-REAL-ROAD-GEOMETRY-PROMPT.md`
4. `GEOMETRY-ALIGNMENT-QA-PROMPT.md`
5. `ROUTING-REGRESSION-QA-PROMPT.md`
6. build + deploy
7. `RELEASE-GEOMETRY-PROMPT.md`
