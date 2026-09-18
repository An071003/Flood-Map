# 09 — Data Sources and Confidence

## Mục tiêu
Trả lời rõ câu hỏi: “Dữ liệu và tỷ lệ dự đoán lấy từ đâu?”

## Data classes

### Observed
Dữ liệu đã quan trắc/đo.
Ví dụ:
- weather station
- rain gauge
- sensor
- public authority feed

### Forecast
Dữ liệu dự báo.
Ví dụ:
- rainfall forecast
- weather forecast

### Estimated
Output từ model/heuristic.
Ví dụ:
- estimated flood depth
- estimated drainage time
- road risk score

## Data source registry
Project nên có một config/document:

```ts
interface DataSourceDescriptor {
  id: string
  name: string
  type: 'observed' | 'forecast' | 'estimated' | 'static'
  provider: string
  updateFrequency?: string
  license?: string
  isMock: boolean
}
```

## Confidence

### Không được làm
- Tự tạo `92%` mà không định nghĩa.
- Gọi percentage là “accuracy” nếu chưa validation.

### V3 recommendation
Primary:
- Low
- Medium
- High

Secondary percentage chỉ dùng khi có công thức rõ.

### Heuristic confidence example
Có thể dùng completeness-based confidence cho demo:

- rainfall available: +25
- elevation available: +20
- historical flood sensitivity available: +20
- tide available: +15
- drainage estimate available: +10
- recent observation available: +10

Tổng 0–100 chỉ phản ánh **input completeness**, không phải prediction accuracy.

UI phải ghi đúng nghĩa:
`Độ tin cậy dữ liệu đầu vào`, không phải `Độ chính xác 92%`.

## Documentation requirement
Mọi data source thực tế phải ghi:
- endpoint/provider
- update interval
- license
- failure fallback
- có phải mock không
