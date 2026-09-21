# Product Specification — Flood Map HCMC

## 1. Product Vision
Flood Map HCMC is a **navigation-first flood intelligence web application** for Ho Chi Minh City. It enables residents and commuters to understand street-level flood risks, select viable routes tailored to their vehicle and departure timeline, and avoid floodwaters before they get trapped.

### Primary User Flow
```text
1. Search Location / Use GPS
   ↓
2. View Road-Level Flood Status & Forecast
   OR
3. Set Origin (A) & Destination (B)
   ↓
4. Compare Evaluated Route Candidates (Vehicle-appropriate & Flood-aware)
   ↓
5. Inspect High-Risk Segments & Decision Details
```

## 2. Core Interaction Modes

### A. Browse Mode (Default)
- **Neutral Road Base**: Road lines remain neutral/muted by default.
- **Global Flood Overlay OFF**: The global rainbow flood overlay is strictly OFF by default to eliminate visual fatigue and focus attention on navigation.
- **Minimal Critical Alerts**: Only severe city alerts or selected markers are highlighted.

### B. Road Selected Mode
- **Contextual Flood Inspection**: Only the user-selected road displays its flood severity, forecast timeline (0h to 24h), and hydrological context.
- **Synchronized Timeline**: Moving the forecast slider updates the selected road's flood depth, drain time, and risk level in the Inspector panel.

### C. Route Planning Mode
- **Route Visual Separation**:
  - Non-route roads remain neutral.
  - Secondary/alternative candidates are rendered in muted tones.
  - The actively selected route candidate receives prominent high-contrast navigation casing.
  - Flood severity is rendered only on the inner core segments of the selected route.
  - `UNKNOWN` segments are clearly rendered with dashed neutral lines.
- **Snap Connections**: When origin or destination lies outside the immediate network (e.g. alleys or off-graph POIs), a dashed connector line visually connects the actual pin to the nearest network entry point.
- **Unsupported Destinations**: If a destination is beyond the supported network threshold (>300m), auto-routing is halted and requires explicit confirmation.

## 3. Scope & Supported Coverage
- **Urban Centers & High-Density Corridors**: District 1, District 3, District 4, District 7, Bình Thạnh, Phú Nhuận, and TP. Thủ Đức (Thảo Điền, An Phú, Thủ Thiêm).
- **Vehicles**: Motorbike (sensitive to flood >15cm) and Car (tolerant up to 25cm).
- **Strategies**: Least Flooded (`LEAST_FLOOD`), Balanced (`BALANCED`), and Fastest (`FASTEST`).

## 4. Explicit Non-Goals & Invariants
- **No Absolute Safety Guarantees**: The application provides risk-minimized guidance; it never guarantees absolute safety.
- **Strict Data Distinction**: Estimates and numerical models must never be portrayed as physical sensor measurements.
- **No Deceptive Precision**: Never claim house-number or parcel-level accuracy unless explicitly verified by the geocoding provider.
- **Honest Data Coverage**: When flood data is missing or incomplete, the system labels segments as `UNKNOWN` rather than assuming 0 cm depth.
