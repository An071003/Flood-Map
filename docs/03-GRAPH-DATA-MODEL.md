# Graph Data Model

```ts
interface RoadNode { id:string; lng:number; lat:number }
interface RoadSegment {
 id:string; roadId:string; roadName:string;
 roadClass:'trunk'|'primary'|'secondary'|'tertiary';
 fromNodeId:string; toNodeId:string; bidirectional:boolean;
 geometry:GeoJSON.LineString; lengthMeters:number; estimatedTravelSeconds:number;
 floodForecast:Record<0|1|3|6|12|24, SegmentFloodState>;
}
```

Geometry connectivity and graph connectivity must agree.
