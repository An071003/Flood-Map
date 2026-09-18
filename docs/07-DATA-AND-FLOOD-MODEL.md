# 07 — Data & Flood Model

## Data layers
- Weather current/forecast.
- Rain accumulation.
- Tide.
- Elevation / low-lying score.
- Drainage capacity proxy.
- Historical flood score.
- Sensor observation if available.

## Normalized area snapshot
```ts
type DataKind = 'observed' | 'forecast' | 'estimated' | 'demo';

type AreaSnapshot = {
  areaId: string;
  timestamp: string;
  kind: DataKind;
  weather: {
    condition: 'clear'|'cloudy'|'rain'|'heavy_rain'|'storm';
    temperatureC: number;
    rainRateMmH: number;
    rain1hMm: number;
    rain3hMm: number;
    rain6hMm: number;
  };
  flood: {
    severity: 'safe'|'watch'|'warning'|'severe';
    estimatedDepthCm: number;
    drainMinMinutes: number;
    drainMaxMinutes: number;
    confidence: number; // 0..1
    reasons: string[];
  };
  freshnessMinutes: number;
};
```

## MVP heuristic
Tạo normalized features 0..1:
- rainfallIntensity
- accumulation3h
- accumulation6h
- lowElevation
- poorDrainage
- historicalFlood
- tidePressure
- observedSensorSignal

Ví dụ baseline:
```text
score =
  0.20 * rainfallIntensity +
  0.22 * accumulation3h +
  0.10 * accumulation6h +
  0.14 * lowElevation +
  0.12 * poorDrainage +
  0.10 * historicalFlood +
  0.08 * tidePressure +
  0.04 * observedSensorSignal
```
Weights là baseline cần calibration; không trình bày như mô hình khoa học đã xác nhận.

## Severity baseline
- `< 0.30`: safe
- `0.30–0.50`: watch
- `0.50–0.72`: warning
- `>= 0.72`: severe

## Confidence
Confidence giảm nếu:
- thiếu tide;
- weather stale;
- không có elevation/drainage;
- không có sensor;
- đang extrapolate xa hơn +6h.

## Output explanation
Mỗi result phải trả top 2–4 contributing factors để UI hiển thị “Vì sao?”.

## Safety copy
Dùng “ước tính nguy cơ ngập” / “mức ngập ước tính”; không gọi là “cảnh báo chính thức” trừ khi source thực sự là cơ quan có thẩm quyền và UI ghi nguồn rõ.
