# GEOMETRY ALIGNMENT QA

This QA is mandatory.

## Manual visual alignment

Test at zoom 14–17:

1. Nguyễn Hữu Cảnh
2. Điện Biên Phủ
3. Quốc Hương
4. Phan Thúc Duyện
5. Trường Sơn / Hoàng Văn Thụ corridor
6. Mai Chí Thọ
7. Nguyễn Hữu Thọ
8. Trần Xuân Soạn
9. Huỳnh Tấn Phát
10. Lê Duẩn

For each:

PASS only if rendered line follows visible basemap road centerline.

FAIL if:
- cuts through building
- cuts through parcel
- crosses non-road land
- misses roundabout
- crosses canal/river without bridge
- shortcuts a curve
- runs materially parallel to road
- connects two nodes by straight line while real road bends

## Screenshot evidence

Capture:
- selected-road state
- selected-route state
- high-zoom alignment

## Automated geometry heuristics

Add QA utilities where useful.

Flag suspicious segments:

```ts
if (
  lengthMeters > LONG_SEGMENT_THRESHOLD &&
  geometry.coordinates.length <= LOW_VERTEX_THRESHOLD
) {
  flag('SUSPICIOUS_GEOMETRY')
}
```

Also check:
- endpoint continuity
- invalid coordinates
- zero-length segments
- unrealistic length-vs-shape
- disconnected topology
- duplicate segment IDs

Do not use vertex count as the only correctness criterion.

## Geometry provenance

Every production navigation segment should have:
- source/provenance
- geometry quality

FAIL if production route uses unknown provenance hand-written geometry.
