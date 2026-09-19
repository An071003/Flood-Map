# REVIEW V4.3

Không code.

Audit:

## UNKNOWN
1. Test fixture/data hiện ở đâu?
2. Có test-only override path cho segment flood state không?
3. Coverage có giảm đúng khi segment unknown không?
4. Unknown rendering branch nằm ở đâu?

## Legend
5. Legend component/config ở đâu?
6. Có thể thêm unknown mà không ảnh hưởng severity colors không?

## Candidate omission
7. Candidate reject reason có tồn tại chưa?
8. Phân biệt được duplicate / vehicle_blocked / flood_blocked / disconnected / no_distinct_alternative chưa?
9. UI có biết requested count vs displayed count không?

## Route mode state
10. Route mode state ở đâu?
11. Có conditional render kiểu `routeMode ? <RoutePlanner/> : <FloodMap/>` không?
12. Component nào unmount khi route planner mở?
13. MapLibre instance có bị recreate không?
14. Three custom layer có bị remove/recreate không?
15. Timeline/search/layer rail bị CSS hide hay unmount?
16. Closing planner có restore state không?
17. Cleanup nào có thể remove resource không thuộc route planner?

Output:
- exact unknown fixture strategy
- legend insertion point
- candidate omission data flow
- route-mode lifecycle
- root cause nếu map core biến mất
- minimal patch plan
