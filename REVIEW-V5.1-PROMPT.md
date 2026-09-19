# REVIEW V5.1 PROMPT

Không code.

Audit theo bảng: Area | Current behavior | File/module | Gap | Severity | Minimal fix

### Search
1. Search local hay geocoder?
2. Có house number/POI/intersection/alley không?
3. Có Vietnamese normalization không?
4. Có exact vs approximate không?
5. Có debounce/cache không?
6. Result có lng/lat không?

### Snapping
7. Origin/destination map vào graph thế nào?
8. Có nearest segment/node không?
9. Có snap distance không?
10. Có threshold không?
11. Có expose gap cho user không?
12. Route dùng geocoded point hay snapped point?

### Visual
13. Selected route/alternatives có separate layers không?
14. Có casing riêng không?
15. Non-route roads có neutral không?
16. Candidate switching có stale highlight không?

### Filters
17. Vehicle/forecast/strategy/flood threshold/data preference cái nào đi vào engine thật?

### UNKNOWN/Mobile
18. UNKNOWN dashed còn hoạt động không?
19. Mobile 390x844 và 360x800 đã verify chưa?

Kết luận bắt buộc: search precision, alley support, snapping flow, filter dependencies, implementation plan.
