# SEARCH VALIDATION

Test:
- Nguyễn Hữu Cảnh → road
- 123 Nguyễn Hữu Cảnh → exact address nếu có, nếu không phải label approximate/street-level
- Chợ Bến Thành → POI
- Ngã tư Hàng Xanh → intersection/POI
- 123/45 Nguyễn Xí → alley exact nếu có, nếu không phải honest limitation
- nguyen huu canh → vẫn ra kết quả hữu ích
- far/unsupported point → snap distance + limitation

Output bảng: Query | Type | Match quality | Coordinates | Snap distance | Routable? | UX result

FAIL nếu fake exact hoặc silent far snap.
