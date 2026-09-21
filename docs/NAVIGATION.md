# Navigation & Routing Specification — Flood Map HCMC

## 1. Search & Geocoding Contract
Search supports:
- Landmarks & POIs (e.g. "Chợ Bến Thành", "Landmark 81")
- Major roads & intersections (e.g. "Ngã tư Hàng Xanh", "Nguyễn Hữu Cảnh")
- House number queries (e.g. "123 Nguyễn Hữu Cảnh")
- Alley queries (e.g. "123/45 Nguyễn Xí", "Hẻm 48 Điện Biên Phủ")
- Diacritic-insensitive Vietnamese typing (e.g. "nguyen huu canh" -> "Nguyễn Hữu Cảnh")
- Geocoded addresses across HCMC via hybrid provider architecture

### Search Precision vs Routing Coverage
A place can be successfully discovered and placed on the map even if it lies beyond the core topological routing network. 
- When an off-network location is selected, the application snaps to the nearest routable network segment and draws a dashed connector line (`dest-connector`).
- If snap distance exceeds 300 m (`unsupported`), auto-routing is halted pending explicit user approval.

## 2. Segment Snapping Algorithm
```text
Given input coordinate P(lng, lat):
1. For each segment S in HCMC_GRAPH_SEGMENTS:
   For each polyline segment [A, B] of S:
     Calculate orthogonal projection P' of P onto line segment AB.
     Compute Haversine distance d(P, P').
2. Select segment S* and point P'* minimizing d.
3. Compute snap status:
   - d <= 25m  → 'exact'
   - d <= 80m  → 'near'
   - d <= 300m → 'far'
   - d > 300m  → 'unsupported'
4. Pick closer terminal node of S* as graph entry/exit node.
```

## 3. Vehicle Routing Profiles
- **Motorbike (`motorbike`)**:
  - Flood sensitivity threshold: >15 cm
  - Severe threshold: >25 cm (engine stall risk)
  - Unknown penalty: 2.0x
- **Car (`car`)**:
  - Flood sensitivity threshold: >25 cm
  - Severe threshold: >40 cm (chassis flooding risk)
  - Unknown penalty: 1.5x

## 4. Route Strategies & Scoring
- **`LEAST_FLOOD`**: Strongly minimizes water depth and high-risk segments, accepting longer physical detours.
- **`BALANCED`**: Optimal compromise between travel duration and flood exposure.
- **`FASTEST`**: Prioritizes lowest travel duration, warning user if flooded segments are crossed.

## 5. Route Visual Hierarchy
1. **Unselected / Background Roads**: Neutral muted gray (`#334155`).
2. **Alternative Routes**: Semi-transparent blue casing with low opacity (0.4).
3. **Selected Route Casing**: High-contrast white/cyan navigation casing (width: 9px) on dedicated top line layer.
4. **Selected Route Flood Segments**: Inner core line (width: 5px) colored by flood depth:
   - <= 10 cm: `#38bdf8` (Cyan / Nhẹ)
   - 11 - 25 cm: `#f59e0b` (Amber / Trung bình)
   - 26 - 45 cm: `#f97316` (Orange / Sâu)
   - > 45 cm: `#ef4444` (Red / Nguy hiểm)
   - UNKNOWN: `#94a3b8` (Dashed gray / Chưa có dữ liệu)
5. **Snap Connectors**: Dashed line (`[2, 3]`) connecting actual origin/destination pins to snapped road points.
