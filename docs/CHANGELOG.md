# Changelog — Flood Map HCMC

## [V6.0.0] - 2026-09-21
### Added
- **Hybrid Geocoding Service**: Implemented `GeocodingProvider` abstraction with `NominatimGeocodingProvider` (OpenStreetMap scoped to HCMC) and `LocalGeocodingProvider`.
- **Segment-Level Snapping**: True orthogonal point-to-segment projection across all road segment geometries, replacing naive nearest-node calculation.
- **Explicit Unsupported Destination Flow**: Intercepts destinations beyond network threshold (>300m), requiring explicit user confirmation before calculating routes.
- **Complete Route Filter Contract**: Integrated `selectedStrategy` (`LEAST_FLOOD`, `BALANCED`, `FASTEST`) and `preferredMaxDepthCm` into Zustand store and UI controls.
- **Expanded Road Network**: Extended graph connectivity with residential and service road classes across key urban districts.
- **Documentation Consolidation**: Consolidated 100+ versioned documents into canonical root and `docs/` specifications.

### Changed
- **Honest Data Quality Copy**: Updated route preference copy to `Ưu tiên tuyến có độ phủ dữ liệu cao` reflecting ranking behavior without deceptive hard threshold claims.
- **Search Modal UX**: Added geocoding source attribution, real-time loading feedback, and distinct precision badge indicators (`exact`, `approximate`, `street-level`, `poi`).

---

## [V5.1.0] - 2026-09-18
### Added
- **Address & Alley Search Support**: Dynamic parsing for house number and alley patterns (`123/45...`).
- **Snapping Connector Lines**: Dashed lines connecting off-graph origin/destination points to network entry points.
- **Vietnamese UI Copy Polish**: Standardized terminology across all inspector, search, and routing cards.

---

## [V5.0.0] - 2026-09-15
### Added
- **Contextual Flood Rendering**: Global flood overlay disabled by default in Browse mode; flood severity rendered exclusively on user-selected road.
- **Navigation-First User Flow**: Origin/destination routing panel integrated with MapLibre canvas lifecycle.
- **Map State Snapshot & Restore**: Preserves map state across route planner open/close interactions.

---

## [V4.0.0] - 2026-09-10
### Added
- **Topological Graph Routing**: Dijkstra-based route engine supporting Motorbike and Car profiles.
- **Candidate Diversity & Omission Rationale**: Generates distinct physical corridors with explanatory omission notes.
- **UNKNOWN Hydrological Semantics**: Neutral dashed visual encoding and routing penalty for segments lacking flood data.
