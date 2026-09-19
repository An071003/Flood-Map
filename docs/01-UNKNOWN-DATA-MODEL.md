# Unknown Data Model

```ts
type FloodState =
  | {
      status: 'known'
      estimatedDepthCm: number
      confidenceBand: 'low' | 'medium' | 'high'
    }
  | {
      status: 'unknown'
      reason?: 'missing_forecast' | 'missing_model_input' | 'unsupported_segment'
    }
```

Invariants:
- unknown has no fake depth
- unknown lowers coverage
- unknown increments count
- unknown gets routing penalty
- unknown never uses safe color
