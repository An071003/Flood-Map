# AGENT-V4.3

## Preserve
Không phá:
- vehicle-aware routing
- forecast-aware routing
- candidate routes
- route coverage
- compatibility semantics
- boundary/outside mask
- road search
- road inspector
- timeline
- 3D
- layer controls

## P0 UNKNOWN fixture
Phải có test fixture deterministic:
- >=1 unknown segment
- coverage <100%
- unknownSegmentCount >0
- chỉ bật trong test/dev QA mode
- production default OFF

## P0 Unknown legend
Legend phải có `Chưa đủ dữ liệu`.

Unknown segment:
- neutral blue-gray
- dashed
- tooltip rõ nghĩa

## P0 Candidate omission reason
Nếu chỉ có 1–2 candidates, UI phải giải thích lý do.

## P0 Map state stability
Route mode không được:
- unmount map core
- remove timeline/search/layers/pins/inspector ngoài ý muốn
- destroy MapLibre/Three resources không thuộc route planner

Nếu control bị ẩn có chủ đích, state phải được giữ và restore khi thoát route mode.
