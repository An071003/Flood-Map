# 23 — Performance & Reliability

## Three.js
- one render loop/integration path
- dispose geometry/material/texture
- cancel animation
- no orphan scene objects

## GSAP
Kill tweens on:
- selected road change
- rapid timeline scrub
- unmount

## MapLibre
Cleanup:
- listeners
- sources
- layers
- custom layers

Không recreate toàn bộ map khi inspector text đổi.

## Low-end fallback
Giảm:
- particle
- reflection
- ripple
- mesh subdivisions

Luôn giữ:
- road status
- depth label
- timeline

## Data state
`loading | fresh | updating | stale | error`

Stale phải hiện timestamp gần nhất.
