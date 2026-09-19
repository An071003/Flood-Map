# REVIEW V4.2

Không code.

Audit:
1. Missing flood data lưu thế nào?
2. Có unknownSegmentCount chưa?
3. Coverage có hard-code 100% không?
4. Coverage tính theo count hay length?
5. Missing depth có fallback 0/null-safe không?
6. Unknown segment có style riêng chưa?
7. Candidate overlap logic ở đâu?
8. Fastest mất ở +3h vì duplicate, blocked, pruning hay UI filter?
9. Có omission reason code không?
10. Compatibility score nghĩa là gì?
11. Tại sao format motorbike/car chưa thống nhất?
12. Mobile breakpoint / bottom sheet có thật không?
13. Boundary/mask có bị route layer ảnh hưởng không?

Output bắt buộc:
- unknown root cause
- coverage root cause/evidence
- exact cause missing Fastest at +3h
- candidate diversity logic
- compatibility semantics
- mobile gap
- phased fix plan
