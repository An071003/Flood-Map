# Vehicle Routing Spec

Vehicle type phải ảnh hưởng cost engine.

```ts
interface VehicleProfile {
  type: 'motorbike' | 'car'
  depthPenaltyCurve: Array<{minCm:number,maxCm:number|null,penalty:number}>
  unknownPenalty: number
  warningPenalty: number
  severePenalty: number
}
```

Giữ config tập trung, không rải magic number.
Các threshold là heuristic routing, không phải safety guarantee.
