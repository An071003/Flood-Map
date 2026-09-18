# 12 — Timeline and State Model

## Timeline points
- NOW
- +1h
- +3h
- +6h
- +12h
- +24h

## State
```ts
interface TimelineState {
  selectedHour: number
  isPlaying: boolean
  status: 'idle' | 'updating' | 'ready' | 'stale' | 'error'
}
```

## Feedback
Khi update:
- `Đang cập nhật mô hình…`

Success:
- `Cập nhật 14:34`

Stale:
- `Đang dùng dữ liệu gần nhất`

Error:
- `Không thể lấy dữ liệu mới`

## Trend
- rising
- stable
- decreasing

Trend phải dựa trên depth/risk delta giữa time steps, không hard-code label.
