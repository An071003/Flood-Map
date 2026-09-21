# QA & Verification Matrix — Flood Map HCMC

## 1. Acceptance Verification Matrix

| Area | Test Case | Expected Behavior |
| :--- | :--- | :--- |
| **Search** | Query "Nguyễn Hữu Cảnh", "123 Nguyễn Hữu Cảnh", "Chợ Bến Thành" | Returns matching POIs and dynamic address entries with correct district and type. |
| **Search** | Diacritic-free query: "nguyen huu canh", "hang xanh" | Accurately matches accented counterparts with identical ranking. |
| **Search** | House number & alley queries: "123/45 Nguyễn Xí", "Hẻm 48..." | Identified as `alley` or `address` with `approximate` match quality and honest secondary disclosure. |
| **Search** | Location outside static database | Fetched via hybrid geocoder, tagged with source attribution, filtered to HCMC bounding box. |
| **Snapping** | Point on road ($d \le 25\text{ m}$) | Snap status: `exact`, zero or minimal offset connector. |
| **Snapping** | Point off road ($25\text{ m} < d \le 80\text{ m}$) | Snap status: `near`, displays dashed connector line to road centerline. |
| **Snapping** | Remote point ($80\text{ m} < d \le 300\text{ m}$) | Snap status: `far`, shows clear approach distance advisory banner. |
| **Snapping** | Point beyond network ($d > 300\text{ m}$) | Snap status: `unsupported`, **halts auto-routing**, shows confirmation modal with [Định tuyến đến điểm gần nhất] and [Chọn vị trí khác]. |
| **Filters** | Vehicle switch: Motorbike $\leftrightarrow$ Car | Recomputes routes; motorbike routes avoid >15cm flood, car routes allow up to 25cm. |
| **Filters** | Strategy change: `LEAST_FLOOD`, `BALANCED`, `FASTEST` | Selected route candidate highlights appropriate corridor matching chosen strategy. |
| **Filters** | Max depth limit: $\le 10\text{ cm}$, $\le 20\text{ cm}$, etc. | Prunes or heavily penalizes segments exceeding the custom depth tolerance. |
| **Filters** | Data quality toggle | Re-ranks candidates favoring routes with highest data coverage percentage. |
| **Visual Invariants** | Browse mode | Roads remain neutral; no global flood rainbow overlay by default. |
| **Visual Invariants** | Road selected mode | Only the selected road shows flood severity; Inspector panel opens with timeline sync. |
| **Visual Invariants** | Route planning mode | Non-route roads neutral; secondary alternatives muted; selected route has high-contrast casing; UNKNOWN segments dashed. |
| **State Retention** | Open/close Route Planner 10 times | Map instance remains mounted; prior selected road, layers, and timeline hour restore exactly. |
| **Mobile Viewport** | 390x844 (iOS) & 360x800 (Android) | Touch handle cycles bottom sheet between collapsed, half, and expanded; map padding adjusts cleanly. |

## 2. Production Hygiene Checklist
- [ ] No debug toggles, mock overrides, or test badges visible in production UI.
- [ ] TypeScript passes with zero errors (`tsc --noEmit`).
- [ ] ESLint passes cleanly (`npm run lint`).
- [ ] All unit tests pass (`npm test`).
- [ ] Documentation reduced strictly to canonical set (`README.md`, `AGENT.md`, `docs/*.md`).
