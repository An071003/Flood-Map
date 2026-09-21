---
name: flood-model
description: Hydrological data modeling, forecast timeline interpolation, tide/weather feeds, UNKNOWN data semantics, and confidence bands.
---

# Flood Model Skill

## Scope
- Multi-hourly forecast intervals (0h, 1h, 3h, 6h, 12h, 24h).
- Strict data provenance distinction: observed, forecast, estimated, static, mock.
- UNKNOWN hydrological semantics: missing data $\ne$ 0 cm, penalty calculation, and honest data coverage percentages.
- Hydrological severity tiers:
  - Normal / Không ngập ($\le 5\text{ cm}$)
  - Minor / Ngập nhẹ ($6 - 15\text{ cm}$)
  - Moderate / Ngập vừa ($16 - 30\text{ cm}$)
  - Severe / Ngập sâu ($> 30\text{ cm}$)
- Never promise absolute safety.
