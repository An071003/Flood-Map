# 01 — Information Architecture

## Screen chính: Map Command View
Không chia nhiều page ở MVP. Tất cả task chính ở một màn hình map.

### Layer 1 — Global chrome
- Brand `Flood Map HCMC`
- Search khu vực/đường
- Data freshness
- Current/forecast mode
- Settings

### Layer 2 — Map controls
- Rain
- Flood risk
- Water depth
- Weather icons
- Tide
- 2D / 3D
- Locate / reset camera

### Layer 3 — Map canvas
- HCMC map
- District/ward boundaries theo zoom
- Weather marker
- Flood water mesh
- Rain animation khi phù hợp

### Layer 4 — Selected-area inspector
- Tên khu vực
- Current weather
- Rain 1h/3h/6h
- Flood state + depth
- Expected drain time
- Confidence
- Reasons
- Advice
- Source + updated time

### Layer 5 — Forecast timeline
- NOW
- +1h, +2h, +3h, +6h, +12h, +24h
- Play/pause animation

## User flow
```text
Open app
  ↓
See city-wide weather/flood overview
  ↓
Search or click area
  ↓
Camera focuses area
  ↓
Inspector opens
  ↓
Scrub timeline
  ↓
Water/weather animate to forecast time
  ↓
User compares risk before moving
```
