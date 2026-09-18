# 27 — 3D Depth Polish

## Problem
Hiện depth variation có nhưng vertical difference chưa đủ rõ.

## Required visual test
Identify/create roads near:
- 7 cm
- 15 cm
- 25 cm
- 37+ cm

Ở 3D tilt:
- 7 và 37 cm phải phân biệt ngay bằng height
- không cần đọc label mới biết khác nhau

## Mapping
```ts
height = clamp(
  0.12 + depthCm * 0.03,
  0.12,
  1.8
)
```

## Preserve
- severity color
- road selection highlight
- readable map labels

## Avoid
- excessive extrusion
- cartoon towers
- heavy glow
