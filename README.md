# Flood Map HCMC — V3.2 Final Polish Pack

V3.2 là vòng hoàn thiện cuối cho core Flood Map hiện tại.

## Giữ nguyên
- Road-first
- Major roads
- Search persistence
- Correct road anchoring
- Inspector hiện tại
- Timeline 24h
- Data provenance
- Confidence wording
- Vehicle passability
- Basemap hiện tại

## Chỉ tối ưu 4 nhóm
1. HCMC boundary + outside mask
2. 3D depth differentiation
3. Mobile bottom sheet
4. Performance + release QA

## Không làm trong V3.2
- Routing engine
- Login
- AI chatbot
- Crowdsourcing
- Analytics dashboard
- Thêm layer mới
- Redesign toàn bộ UI

## Cách chạy với Gemini
1. Đọc `AGENT-V3.2.md`
2. Chạy `REVIEW-V3.2-PROMPT.md`
3. Sau audit, chạy `IMPLEMENT-V3.2-PROMPT.md`
4. Chạy `RELEASE-V3.2-PROMPT.md`

Không coi V3.2 hoàn tất nếu bất kỳ Critical/High nào trong checklist còn fail.
