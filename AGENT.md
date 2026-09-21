# AGENT.md — Flood Map HCMC

## Product
Flood Map HCMC là navigation-first flood intelligence app.

User flow:
```text
Tìm địa điểm
→ xem tình trạng ngập
hoặc
→ chọn điểm đi / điểm đến
→ tìm tuyến ít ngập hơn theo phương tiện và thời gian
```

## Core UX invariants
### Browse
- roads neutral
- global flood-road overlay OFF mặc định
- chỉ giữ alert/pin cần thiết

### Selected road
- chỉ road được chọn hiển thị flood severity
- inspector + timeline sync

### Route planning
- non-route roads neutral
- alternatives muted
- selected route có navigation casing riêng
- flood severity nằm trong selected route
- UNKNOWN = dashed neutral

## Data semantics
Không trộn observed / forecast / estimated / static / mock.
Không gọi estimated/model output là sensor measurement.
Không nói an toàn tuyệt đối.

## V6 Mission
1. Real geocoding architecture.
2. Expanded routing graph.
3. Segment-level snapping.
4. Explicit unsupported destination UX.
5. Complete route filter contract.
6. Preserve V5 map interaction.
7. Reduce docs to canonical set.

## Documentation rule
No more version-sprawl docs.
Canonical docs only:
- README.md
- AGENT.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/DATA-SEMANTICS.md
- docs/NAVIGATION.md
- docs/QA.md
- docs/CHANGELOG.md

Nếu old doc có nội dung hữu ích: merge vào canonical doc trước rồi xóa file cũ. Git history là archive.
