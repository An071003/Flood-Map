# 07 — Map Boundary and Labels

## HCMC boundary
Bắt buộc có administrative boundary của TP.HCM.

### Rendering
- fill gần như transparent
- stroke rõ nhưng không lấn map
- outside mask/dimming
- clip flood data về trong phạm vi TP.HCM nếu phù hợp

## Basemap
- Dùng style hợp lệ.
- Không để missing token/API key phá labels.
- Phải có fallback style không cần private token nếu primary style fail.
- Không render text placeholder kiểu `api key required`.

## Roads
- Major roads rõ hơn local roads.
- Flood overlay phải bám theo geometry road.
- Selected road nổi bật hơn flood status nhưng không che basemap hoàn toàn.

## Label anchoring
Label point:
- nên lấy từ midpoint theo chiều dài geometry,
- có thể dùng `line-center`,
- hoặc tính point-on-line.
Không dùng centroid polygon cho road.

## Popup
Popup anchor phải gắn vào clicked/selected coordinate trên line.
Nếu road dài, inspector là nguồn detail chính; map label chỉ cần ngắn.
