# Flood Map HCMC

Website theo dõi thời tiết và ước tính nguy cơ ngập tại TP.HCM trên nền bản đồ 3D thời gian thực.

🌐 **Live Demo (GitHub Pages)**: [https://an071003.github.io/Flood-Map/](https://an071003.github.io/Flood-Map/)

---

## Mục tiêu sản phẩm
Hiển thị thời tiết theo khu vực TP.HCM, kết hợp lượng mưa theo thời gian, địa hình/độ trũng, thủy triều, lịch sử ngập và dữ liệu quan trắc để **ước tính nguy cơ ngập**, độ sâu ngập (cm) và thời gian rút nước.

## Trải nghiệm chính
- **Bản đồ 3D tương tác**: MapLibre GL JS + Three.js hiển thị mặt nước ngập nhô theo độ sâu thực tế (`depthCm`).
- **Thời tiết theo khu vực**: Weather billboard markers nổi trên bản đồ, hiển thị nhiệt độ và trạng thái thời tiết.
- **Dòng thời gian dự báo (NOW → +24h)**: Kéo timeline hoặc nhấn Play để xem diễn biến ngập và triều cường.
- **Bảng chi tiết (Inspector)**: Xem chi tiết lượng mưa 1h/3h/6h, mức ngập ước tính, thời gian rút nước, độ tin cậy, phân tích nguyên nhân và khuyến nghị an toàn.
- **Tìm kiếm nhanh**: Tìm kiếm quận, phường, tuyến đường bằng phím tắt `⌘ K` / `Ctrl K`.
- **Hỗ trợ đa thiết bị**: Tương thích hoàn toàn desktop (1440×900) và mobile (390×844 với bottom sheet tiện dụng).

---

## Cài đặt & Khởi chạy

```bash
# Cài đặt dependencies
npm install

# Chạy môi trường phát triển (Dev Server)
npm run dev

# Kiểm tra code chất lượng (Lint, Typecheck, Test)
npm run lint
npm run typecheck
npm run test

# Đóng gói sản phẩm (Production Build)
npm run build
```

---

## Cấu trúc thư mục

```text
├── .agent/skills/         # Kỹ năng định hướng UI, 3D, Motion, Geospatial
├── .github/workflows/     # CI và GitHub Pages deployment workflows
├── docs/                  # Tài liệu kiến trúc, đặc tả UI, tokens, flood model
├── prototype/             # Prototype layout ban đầu
├── src/
│   ├── components/        # UI chrome (TopBar, LayerRail, Legend, SearchModal)
│   ├── domain/            # Thuật toán tính toán nguy cơ ngập (Flood Risk Engine)
│   ├── features/          # Map canvas, Three.js 3D layer, Inspector, Timeline
│   ├── services/          # Dữ liệu địa lý HCMC và thời tiết (Open-Meteo)
│   ├── stores/            # Quản lý trạng thái Zustand
│   └── styles/            # CSS tokens và styles
├── tests/                 # Unit & Component test suite (Vitest + Testing Library)
├── AGENT.md               # Hướng dẫn dành cho AI coding agent
├── MASTER-PROMPT.md       # Master prompt đặc tả toàn diện dự án
└── README.md
```
