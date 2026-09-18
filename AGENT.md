# AGENT.md — Flood Map HCMC V3

## 1. Mission

Refactor Flood Map HCMC từ mô hình **region/polygon-first** sang **road-first flood monitoring**.

Sản phẩm phải giúp người dùng trả lời nhanh:

- Đường tôi sắp đi có nguy cơ ngập không?
- Đoạn nào của con đường đang nguy hiểm hơn?
- Mức ngập ước tính bao nhiêu?
- Rủi ro đang tăng hay giảm trong 1–24 giờ tới?
- Có tuyến đường lớn khác ít rủi ro hơn không?

## 2. Product direction bắt buộc

1. Đơn vị chính là `RoadSegment`, không phải polygon vùng tùy ý.
2. MVP chỉ ưu tiên các trục đường lớn.
3. Chỉ tập trung TP.HCM.
4. Ranh giới TP.HCM phải hiển thị rõ.
5. Khu vực ngoài TP.HCM phải được làm mờ hoặc giảm emphasis.
6. Search ưu tiên đường.
7. Search query phải được giữ lại sau khi search và sau khi chọn kết quả.
8. Road selection phải highlight đúng geometry đã chọn.
9. Popup/label phải neo đúng vào đường, không được lệch vị trí.
10. 3D flood phải thể hiện mức ngập bằng chiều cao nhìn thấy được.
11. Mọi số liệu ngập không phải sensor thật phải ghi rõ `MÔ PHỎNG` hoặc `ƯỚC TÍNH`.
12. Không được hiển thị text lỗi như `api key required`.
13. Map là hero. Inspector/timeline chỉ hỗ trợ map.
14. Không biến UI thành generic analytics dashboard.
15. Không dùng neon/glow quá mức.

## 3. Must-read order

Đọc theo đúng thứ tự trước khi sửa code:

1. `docs/00-PRODUCT-BRIEF.md`
2. `docs/01-ROAD-FIRST-STRATEGY.md`
3. `docs/02-USER-JOURNEYS.md`
4. `docs/03-INFORMATION-ARCHITECTURE.md`
5. `docs/04-UI-DESIGN-SYSTEM.md`
6. `docs/05-DESKTOP-LAYOUT.md`
7. `docs/06-MOBILE-LAYOUT.md`
8. `docs/07-MAP-BOUNDARY-AND-LABELS.md`
9. `docs/08-ROAD-FLOOD-DATA-MODEL.md`
10. `docs/09-DATA-SOURCES-AND-CONFIDENCE.md`
11. `docs/10-3D-ROAD-FLOOD-VISUAL-SPEC.md`
12. `docs/11-SEARCH-AND-ROAD-INSPECTOR-UX.md`
13. `docs/12-TIMELINE-AND-STATE-MODEL.md`
14. `docs/13-TECH-ARCHITECTURE.md`
15. `docs/14-PERFORMANCE-ACCESSIBILITY.md`
16. `docs/15-ACCEPTANCE-CHECKLIST.md`
17. `docs/16-IMPLEMENTATION-PHASES.md`
18. `docs/17-TEST-PLAN.md`

## 4. Không được làm

- Không tiếp tục dùng random polygon để biểu diễn “vùng ngập” làm concept chính.
- Không hard-code label vào vị trí không liên quan đến road geometry.
- Không hiển thị confidence 92% nếu không định nghĩa được 92% nghĩa là gì.
- Không gọi số liệu mô phỏng là “thực tế”.
- Không tạo thêm 20 card chỉ để lấp đầy inspector.
- Không dùng 3D chỉ bằng việc tilt camera.
- Không hy sinh readability vì hiệu ứng.
- Không thay toàn bộ design system nếu không có lý do.
- Không rewrite cả app nếu có thể patch theo phase.
- Không làm routing thông minh trước khi road data model ổn định.

## 5. Ưu tiên triển khai

### P0 — Critical
- Basemap không lỗi API key.
- HCMC boundary đúng.
- Road data đúng geometry.
- Search không mất query.
- Road selection không lệch.
- Không còn polygon ngẫu nhiên làm layer chính.

### P1 — Product core
- Road flood overlay.
- Inspector theo road.
- Timeline cập nhật road state.
- Observed / Forecast / Estimated rõ ràng.

### P2 — 3D
- Extruded/ribbon flood geometry theo road.
- Depth 5/15/30/50 cm nhìn khác nhau.
- GSAP transition khi timeline thay đổi.

### P3 — Quality
- Mobile bottom sheet.
- Loading / stale / error states.
- Accessibility.
- Performance trên máy tầm trung.

## 6. Definition of done

Chỉ xem là hoàn thành V3 khi `docs/15-ACCEPTANCE-CHECKLIST.md` đạt toàn bộ Critical và High.
