# REVIEW V3.1 PROMPT

Hãy audit code hiện tại của Flood Map HCMC V3 trước khi sửa.

Không thay đổi code trong bước này.

Tạo bảng:

| Requirement | Current implementation | File/component | Status | Severity | Fix proposal |
|---|---|---|---|---|---|

Bắt buộc kiểm tra:
1. Vì sao basemap vẫn hiện `API KEY REQUIRED`.
2. Provider/style nào đang tạo watermark đó.
3. Có thiếu token/config hay dùng style không phù hợp.
4. Boundary TP.HCM hiện có hay chưa.
5. Boundary source có phải administrative boundary thật không.
6. Outside-mask có đúng geometry không.
7. Observed/Forecast/Estimated hiện model hóa ra sao.
8. Confidence 85% được tính từ đâu.
9. Có calibration/validation không.
10. 3D depth dùng geometry height hay chỉ color.
11. Mapping `depthCm -> renderHeight` nằm ở đâu.
12. Mobile breakpoint hiện tại.
13. Inspector mobile có phải bottom sheet thật không.
14. Search modal mobile.
15. Timeline mobile.
16. Three.js render loop, disposal.
17. GSAP tween cleanup.
18. MapLibre source/layer/listener cleanup.
19. Error/loading/stale-data states.
20. Accessibility icon controls.

Sau audit, lập plan:
- Phase 1 Basemap + Boundary
- Phase 2 Data semantics + Confidence
- Phase 3 True 3D depth
- Phase 4 Mobile UX
- Phase 5 Performance + A11y
- Phase 6 Release QA

Không rewrite app.
