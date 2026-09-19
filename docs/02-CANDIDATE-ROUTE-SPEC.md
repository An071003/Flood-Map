# Candidate Route Spec

Return 1–3 unique routes:
- LEAST_FLOOD
- BALANCED
- FASTEST

Dedupe theo shared segment length.

```ts
overlapRatio =
  sharedSegmentLength /
  Math.min(routeALength, routeBLength)
```

Nếu overlap vượt threshold thì coi là duplicate.
Không fake đủ 3 route.
