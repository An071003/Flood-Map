# 00 — Product Brief

## Tên sản phẩm
**Flood Map HCMC**

## Problem
Người dân cần biết không chỉ “hôm nay có mưa hay không” mà còn:
- khu vực nào có nguy cơ ngập;
- ngập khoảng bao nhiêu cm;
- có thể kéo dài bao lâu;
- dữ liệu đó đáng tin ở mức nào;
- nên làm gì trước khi di chuyển.

## Core job-to-be-done
> “Trước khi ra đường, tôi muốn nhìn nhanh trên bản đồ TP.HCM để biết nơi nào đang mưa/ngập hoặc có nguy cơ ngập trong vài giờ tới.”

## Primary users
- Người đi làm/đi học bằng xe máy, ô tô.
- Điều phối vận hành/giao hàng.
- Người theo dõi tình hình mưa/ngập theo khu vực.

## MVP
1. Map 3D TP.HCM.
2. Weather per area.
3. Rain accumulation 1h/3h/6h.
4. Flood risk + depth estimate + drain duration.
5. Timeline NOW → +24h.
6. Selected-area inspector.
7. Source/freshness/confidence.
8. Responsive mobile.

## Không làm trong MVP
- Không tuyên bố là hệ thống cảnh báo thiên tai chính thức.
- Không route navigation tự động qua đường ngập nếu chưa có road-level data đáng tin cậy.
- Không dùng AI LLM để “đoán” depth nếu thiếu input; heuristic phải deterministic và kiểm thử được.
