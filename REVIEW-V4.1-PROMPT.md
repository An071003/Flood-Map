# REVIEW V4.1

Không sửa code.

Audit và trả bảng:
| Requirement | Current behavior | File/module | Root cause | Severity | Minimal fix |

Kiểm tra:
1. Vehicle state lưu ở đâu?
2. Vehicle có đi vào scoring không?
3. Vehicle change có invalidate/recompute route không?
4. Có memo/cache thiếu dependency `vehicle` không?
5. Motorbike/car penalty curve có khác thật không?
6. Routing algorithm hiện tại là gì?
7. Vì sao chỉ trả một route?
8. Có k-shortest / alternative routes chưa?
9. Có candidate dedupe chưa?
10. Missing flood data được biểu diễn thế nào?
11. Có chỗ fallback missing depth thành 0/null-safe không?
12. Coverage tính theo segment-count hay route length?
13. Forecast hour có đi vào candidate score không?
14. Boundary/outside mask có bị route layer che không?
15. Route UI hiện assume single candidate ở đâu?

Kết luận bắt buộc:
- root cause vehicle bug
- root cause single-route
- exact unknown-data behavior
- boundary/mask regression cause
- implementation plan theo phase
