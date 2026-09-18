# 03 — Desktop Layout

## Target viewport
Source layout: **1440 × 900**.

## Grid
```text
┌──────────────────────────────────────────────────────────────────────────────┐
│  TOP BAR 72px                                                               │
│  Brand      Search                                  Updated 14:32   Controls │
├──────────┬───────────────────────────────────────────────────┬───────────────┤
│          │                                                   │               │
│ LAYER    │                                                   │   INSPECTOR   │
│ RAIL     │                 3D MAP CANVAS                     │   360px       │
│ 56px     │                                                   │               │
│          │       ☁  31°               🌧  29°               │ Flood: 28cm   │
│          │                                                   │ Rain 3h: 46mm │
│          │            ~~~~~ 3D WATER ~~~~~                  │ Confidence 74%│
│          │                                                   │               │
├──────────┴───────────────────────────────────────────────────┴───────────────┤
│     FORECAST TIMELINE 84px       NOW ── +3h ── +6h ── +12h ── +24h        │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Exact measurements
- Top bar: 72px.
- Layer rail: width 56px, left margin 16px, top after header + 16px.
- Inspector: width 360px at 1440; max 392px; right 16px.
- Timeline: left 88px, right = inspector width + 32px, bottom 16px; height 72–84px.
- Search: 360–460px.
- Floating legend: bottom 112px, left 88px.

## Hierarchy
1. Map conditions.
2. Selected area's flood depth/risk.
3. Rain + time.
4. Confidence/reasons.
5. Secondary controls.

## Inspector anatomy
```text
[Q. Bình Thạnh] [MÔ PHỎNG]
Nguyễn Hữu Cảnh
Mưa vừa • 29°C

28 cm
NGẬP ƯỚC TÍNH     CẢNH BÁO

Mưa 1h    18 mm
Mưa 3h    46 mm
Rút nước  70–110 phút

Confidence 74%  [███████---]

Vì sao?
• Mưa tích lũy 3h cao
• Vùng trũng
• Lịch sử ngập cao

Khuyến nghị
Tránh xe gầm thấp nếu depth > 20 cm.

Nguồn / cập nhật 14:32
```

## Empty selection
Inspector không chiếm không gian khi chưa chọn khu vực; thay bằng city summary card nhỏ góc phải.
