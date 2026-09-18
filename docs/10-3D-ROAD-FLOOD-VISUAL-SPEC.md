# 10 — 3D Road Flood Visual Spec

## Goal
Người dùng phải nhìn ra sự khác nhau giữa road flood depth.

## Geometry
Không dựng khối địa chất như ảnh minh họa; dùng visual tương tự về nguyên tắc:
- line/ribbon bám road,
- có chiều cao,
- có mức chênh theo depth.

## Height mapping
```ts
renderHeight = clamp(
  0.08 + depthCm * 0.02,
  0.08,
  1.4
)
```

Có thể dùng exaggeration để dễ nhìn. Đây là visual encoding, không phải chiều cao vật lý theo tỷ lệ 1:1.

## Readability targets
- 5 cm: rất thấp
- 15 cm: thấp-vừa
- 30 cm: rõ rệt
- 50 cm: rất rõ

## Materials
- subtle transparency
- minimal ripple
- minimal reflection
- no heavy bloom

## Animation
Khi timeline thay đổi:
- tween height
- tween opacity
- tween color if risk band changes
- 300–600ms
- cancel previous tween before new tween

## Camera
- default: mostly top-down
- 3D mode: tilt mạnh hơn
- selected road vẫn dễ nhận biết

## Performance
- reuse geometry/material where possible
- dispose resources
- avoid one Three renderer per road
- avoid multiple RAF loops
