# ROUTE QA PROMPT

Test deterministic scenarios:
A. Same A/B, motorbike vs car: ranking/cost phải thay đổi nếu profile khác.
B. Same A/B, NOW vs +3h vs +12h: forecast phải ảnh hưởng route.
C. Unknown segment: coverage <100%, unknown count >0, không coi 0 cm.
D. Severe segment: Least Flood tránh nếu có alternative hợp lệ.
E. No viable alternative: không invent safe route, phải cảnh báo.
F. Low coverage: route phải hiển thị low-confidence/insufficient-data.

Regression V3.3: road search, inspector, timeline, 3D, boundary/mask, mobile flood mode.
