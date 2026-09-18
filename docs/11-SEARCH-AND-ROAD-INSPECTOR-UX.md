# 11 — Search and Road Inspector UX

## Search requirements
- Search target = road first.
- Query không được mất sau submit.
- Query không được mất sau result selection.
- Có clear button.
- Escape đóng suggestion/modal nhưng không xóa query trừ khi user yêu cầu.

## Search result item
- road name
- district
- optional risk badge

## Selection
Sau selection:
1. set selected road
2. fit/zoom
3. highlight line
4. set anchor từ selected geometry
5. update inspector
6. giữ query text

## Inspector hierarchy

### Header
- road name
- district
- `MÔ PHỎNG` nếu cần

### Primary
- `25 CM`
- `CẢNH BÁO`
- `Mức ngập ước tính`

### Key metrics
- Mưa 3h
- Rút nước
- Triều

### Explanation
- Vì sao có nguy cơ?

### Recommendation
- Tránh xe gầm thấp
- Cân nhắc tuyến thay thế

### Expandable detail
- temperature
- wind
- rain 1h
- confidence source
- timestamps
- model inputs
