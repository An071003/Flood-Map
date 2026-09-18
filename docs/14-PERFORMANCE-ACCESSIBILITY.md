# 14 — Performance & Accessibility

## Performance targets
- desktop interaction smooth
- mobile mid-range usable
- no runaway RAF
- no repeated geometry recreation while scrubbing if avoidable

## Degradation strategy
Low-end device:
- disable ripple/reflection
- reduce particles
- lower 3D resolution
- keep road color/height encoding

## Accessibility
- severity = icon + text + color
- keyboard reachable controls
- visible focus
- aria-label cho icon-only controls
- tooltip cho left rail
- `prefers-reduced-motion`
- adequate contrast

## Search
- keyboard arrows
- Enter select
- Escape close
- Ctrl/Cmd+K platform-aware
