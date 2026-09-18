# Skill: Three.js Flood Visualization

## Trigger
Use when building flood surface, water depth, weather marker scene or rain effects.

## Rules
- Synchronize Three camera with MapLibre; one source of truth for geographic camera.
- Reuse geometry/materials.
- Dispose GPU resources when layer removed.
- Depth visualization must encode height, not color only.
- Tween water height outside React render loop.
- Use capped DPR and device tiers.
- Keep labels/roads readable under water.

## Acceptance
- distinct 5cm vs 30cm vs 50cm visual levels
- no z-fighting
- no material allocation each frame
- mobile fallback works
