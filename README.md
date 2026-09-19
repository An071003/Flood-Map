# Flood Map HCMC — V5 Navigation UX

V5 đổi product interaction từ flood-dashboard sang navigation-first flood assistant.

## Mục tiêu
1. Map mặc định sạch, không tô màu ngập trên toàn bộ road.
2. Chỉ khi chọn đường mới hiện dự đoán/evaluation của đường đó.
3. Khi định tuyến, chỉ route candidates được nhấn mạnh; selected route hiển thị flood theo segment.
4. Search hỗ trợ road / address / số nhà / hẻm / POI / intersection / current location.
5. Route filters gồm vehicle / forecast / strategy / flood preference / data quality.

## Run order
1. `AGENT-V5.md`
2. `REVIEW-V5-PROMPT.md`
3. `IMPLEMENT-V5-PROMPT.md`
4. `SEARCH-GEOCODING-QA-PROMPT.md`
5. `NAVIGATION-VISUAL-QA-PROMPT.md`
6. `RELEASE-V5-PROMPT.md`
