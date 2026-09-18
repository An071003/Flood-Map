# 04 — Mobile Layout

## Target
390 × 844.

## Layout
- Map full screen.
- Top search compact, 16px margin.
- Layer control chuyển thành button mở bottom sheet.
- Inspector là bottom sheet 42% → 88% height.
- Timeline nằm ngay trên bottom sheet ở collapsed state.
- Không render nhiều weather marker cùng lúc; cluster mạnh hơn desktop.

```text
┌──────────────────────┐
│ [ Flood Map ] [⌕]    │
│                      │
│       3D MAP         │
│  🌧 29°       ☁ 31°  │
│       ~~~~~          │
│      ~ WATER ~       │
│                      │
│ NOW ━━━●━━━━ +6h     │
├──────────────────────┤
│ Bình Thạnh      ━━━  │
│ 28 cm • WARNING      │
│ Rain 3h 46 mm        │
│ Confidence 74%       │
└──────────────────────┘
```

## Mobile constraints
- Disable expensive volumetric effects.
- Tap targets >= 44px.
- Bottom sheet drag handle rõ.
- Back gesture/close inspector không reset camera đột ngột.
