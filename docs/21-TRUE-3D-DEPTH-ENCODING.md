# 21 — True 3D Depth Encoding

## Goal
Camera nghiêng phải cho thấy depth difference bằng vertical geometry.

```ts
function getVisualHeight(depthCm: number) {
  return clamp(
    0.08 + depthCm * 0.02,
    0.08,
    1.4
  )
}
```

Đây là visual exaggeration.

## Test segments
- 5 cm
- 15 cm
- 30 cm
- 50 cm

Ở 3D tilt, 4 mức phải phân biệt bằng chiều cao.

Không đủ nếu chỉ:
- đổi color
- đổi line width
- tilt camera

## Animation
- height tween
- opacity/color transition
- kill previous tween khi scrub nhanh
