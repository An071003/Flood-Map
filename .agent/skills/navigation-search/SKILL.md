---
name: navigation-search
description: Geocoding abstraction, hybrid search coordination, Vietnamese diacritics normalization, and honest address/alley precision disclosure.
---

# Navigation Search Skill

## Scope
- `GeocodingProvider` contract (`search`, `reverse`).
- Hybrid geocoder architecture: local in-memory DB + external provider (Nominatim OpenStreetMap) bounded to HCMC.
- Vietnamese text normalization: accent stripping, lowercase, prefix trimming (`đường`, `quận`, `phường`).
- Address and alley heuristics with honest match quality (`approximate` for interpolated points, never fake `exact`).
- Deduplication and ranking algorithms.
- Clear search attribution and offline/test resilience.
