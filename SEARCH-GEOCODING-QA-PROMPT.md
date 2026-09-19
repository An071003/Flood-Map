# SEARCH & GEOCODING QA

Test:
1. `Nguyễn Hữu Cảnh` => road
2. `123 Nguyễn Hữu Cảnh` => address if source supports it
3. `Chợ Bến Thành` => POI
4. `Ngã tư Hàng Xanh` => intersection/POI
5. `123/45 Nguyễn Xí` => exact if supported, otherwise explicit approximate/unsupported handling
6. `nguyen huu canh` => normalized search
7. Current location

Verify:
- result type
- label
- coordinates
- ward/district when available
- snap result
- snap distance

FAIL if unsupported address silently becomes unrelated road, alley is falsely exact, or snap distance is hidden.
