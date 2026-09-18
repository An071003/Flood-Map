# 20 — Data Provenance & Confidence

## Model

```ts
type DataClass =
  | 'observed'
  | 'forecast'
  | 'estimated'
  | 'static'
  | 'mock'

interface MetricValue<T> {
  value: T
  dataClass: DataClass
  sourceId: string
  observedAt?: string
  forecastFor?: string
  updatedAt: string
}
```

## UI semantics
- `QUAN TRẮC`: measurement thật.
- `DỰ BÁO`: future forecast.
- `ƯỚC TÍNH`: model/heuristic output.
- `MÔ PHỎNG`: demo/synthetic value.

## Confidence
Không dùng `Accuracy 85%` nếu chưa có ground-truth validation.

Preferred:
- Tin cậy thấp
- Tin cậy trung bình
- Tin cậy cao

Nếu 85% là input completeness, label đúng bản chất:
`Độ đầy đủ dữ liệu: 85%`.

Tooltip:
`Mức tin cậy phản ánh chất lượng/độ đầy đủ dữ liệu đầu vào, không đồng nghĩa dự đoán chính xác 85%.`
