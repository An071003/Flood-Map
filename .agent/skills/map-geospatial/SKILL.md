---
name: map-geospatial
description: Geospatial mapping guidelines using MapLibre GL, layer rendering, coordinate projection, camera control, and bounds fitting for Flood Map HCMC.
---

# Map & Geospatial Skill

## Scope
- MapLibre GL JS lifecycle management in React 19.
- Layer rendering hierarchy and source updates without canvas recreation.
- Boundary enforcement for Ho Chi Minh City (`[106.35, 10.37, 107.03, 11.16]`).
- Vector & GeoJSON styling: neutral browse roads, selected road flood overlay, route casings, muted alternatives, and dashed UNKNOWN segments.
- Point-to-segment coordinate projection and snap line geometry (`dest-connector`).
- Camera bounds fitting with adaptive mobile/desktop padding.
