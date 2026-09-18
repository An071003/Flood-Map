# Skill: MapLibre Geospatial

## Trigger
Use for map setup, layers, boundaries, camera, hit testing, geo coordinates.

## Rules
- Keep raw provider geometry separate from display-state data.
- Use district/ward simplification and zoom-dependent visibility.
- Do not load full-resolution city polygons when not needed.
- Preserve label readability.
- Use stable feature IDs for selected state.
- Base path and asset URLs must work on GitHub Pages.

## Acceptance
- hard refresh works in production base path
- camera focus is deterministic
- layer toggles don't reconstruct whole map
