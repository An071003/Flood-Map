# Flood Map HCMC — V3.3

Pack này chỉ xử lý các phần còn thiếu của bản live hiện tại:
- boundary TP.HCM thật
- outside-city mask
- mobile bottom sheet được test thật ở 390×844 và 360×800
- regression/performance/release QA

Giữ nguyên các phần đã tốt: road-first, search, road alignment, timeline, basemap, data provenance, confidence wording, 3D depth.

## Thứ tự chạy
1. Đọc `AGENT-V3.3.md`
2. Chạy `BOUNDARY-ROOT-CAUSE-PROMPT.md`
3. Chạy `IMPLEMENT-V3.3-PROMPT.md`
4. Chạy `MOBILE-VERIFY-PROMPT.md`
5. Deploy
6. Chạy `RELEASE-V3.3-PROMPT.md`

Không được báo hoàn thành nếu Critical/High trong checklist còn fail.
