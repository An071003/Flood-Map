# Flood Map HCMC — Agent & Design Documentation

Bộ tài liệu này là source-of-truth cho agent code dự án Flood Map HCMC.

## Mục tiêu sản phẩm
Hiển thị thời tiết theo khu vực TP.HCM, kết hợp lượng mưa theo thời gian, địa hình/độ trũng, thủy triều, lịch sử ngập và dữ liệu cảm biến (nếu có) để **ước tính nguy cơ ngập**, độ sâu và thời gian rút nước.

## Trải nghiệm chính
- Map 3D toàn màn hình.
- Weather icon nổi trên từng khu vực.
- Water mesh nhô lên ở khu vực ngập.
- Timeline NOW → +24h để xem dự báo.
- Click khu vực để xem mưa, nguy cơ, độ sâu, confidence, lý do và khuyến nghị an toàn.

## Xem prototype
Mở `prototype/index.html` bằng browser. Đây là prototype layout/visual, không phải bản đồ địa lý thật.

## Bắt đầu cho coding agent
Đưa agent lệnh:

```text
Đọc AGENT.md và toàn bộ docs được tham chiếu. Sau đó đọc các skill phù hợp trong .agent/skills/. Hãy triển khai Phase 1 theo đúng prototype và design tokens, không thay đổi visual direction nếu không có lý do rõ ràng. Hoàn tất bằng lint, typecheck, test, build.
```

## Folder chính
```text
AGENT.md
README.md
MASTER-PROMPT.md
.agent/skills/
docs/
prototype/
.github/workflows/
```
