# Segment Flood State

```ts
type FloodStatus='known'|'unknown'
interface SegmentFloodState {
 status:FloodStatus; estimatedDepthCm?:number; riskLevel?:'safe'|'watch'|'warning'|'severe';
 confidenceBand?:'low'|'medium'|'high'; dataCompleteness?:number; forecastFor:string;
}
```

Unknown never becomes 0 cm. Route coverage = knownLength / totalLength.
