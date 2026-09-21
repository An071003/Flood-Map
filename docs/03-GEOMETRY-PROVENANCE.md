# Geometry Provenance

Each production road segment should record where its geometry came from.

Example:

```ts
geometrySource: 'osm'
sourceWayId: '...'
geometryQuality: 'verified'
```

Avoid anonymous manually guessed coordinates for navigation.

Approximate geometry may be used for non-navigation visualization only when clearly marked.
