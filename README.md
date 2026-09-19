# Flood Map HCMC — V4.3 Route QA + Map State Stability

Patch này chỉ xử lý 4 việc:
1. Tạo route fixture có UNKNOWN thật để verify coverage <100%.
2. Thêm legend `Chưa đủ dữ liệu`.
3. Thêm lý do khi chỉ có 1–2 route candidate.
4. Audit/fix route mode có unmount hoặc hide core map hay không.

Run order:
1. AGENT-V4.3.md
2. REVIEW-V4.3-PROMPT.md
3. IMPLEMENT-V4.3-PROMPT.md
4. ROUTE-UNKNOWN-QA-PROMPT.md
5. MAP-STATE-QA-PROMPT.md
6. RELEASE-V4.3-PROMPT.md
