# IMPLEMENT V5.1 PROMPT

## 1. Search model
```ts
type SearchPlaceType = 'address'|'road'|'alley'|'poi'|'intersection'
type SearchMatchQuality = 'exact'|'approximate'|'street-level'|'poi'
interface SearchPlace {
 id:string; type:SearchPlaceType; label:string; secondaryLabel?:string;
 houseNumber?:string; street?:string; alley?:string; ward?:string; district?:string;
 lng:number; lat:number; matchQuality:SearchMatchQuality; source?:string;
}
```

## 2. Vietnamese normalization
Support có/không dấu, prefix đường/quận/phường, debounce query.

## 3. Honest labels
- exact: `123 Nguyễn Hữu Cảnh`
- approximate: `Gần 123 Nguyễn Hữu Cảnh`
- street-level: `Nguyễn Hữu Cảnh · kết quả theo tuyến đường`
- unsupported alley: `Không tìm thấy chính xác số hẻm; hiển thị điểm gần nhất.`

## 4. Snap model
```ts
interface RouteSnapResult {
 inputLng:number; inputLat:number;
 snappedLng:number; snappedLat:number;
 segmentId:string; distanceMeters:number;
 status:'exact'|'near'|'far'|'unsupported'
}
```
Threshold configurable, không rải magic numbers.

## 5. Snap UX
Nếu material gap:
`Tuyến được tính đến điểm hỗ trợ gần nhất, cách vị trí đã chọn 180 m.`
Có thể vẽ dashed connector actual→snapped.

## 6. Search actions
- Xem ngập
- Đi từ đây
- Đi đến đây
Nếu chưa có flood model: nói rõ, không fake.

## 7. Route visual
Alternatives muted/thin; selected route strong casing; inner severity line; UNKNOWN dashed; non-route roads neutral.

## 8. Filters
Vehicle, forecast, strategy, preferred flood threshold, data preference phải đi vào route request/cache key nếu ảnh hưởng scoring.

## 9. UNKNOWN regression
unknown != 0, count/coverage đúng, dashed + legend còn.

## 10. Mobile
390x844 và 360x800: search keyboard, bottom sheet, filters, snap warning, map usability.
