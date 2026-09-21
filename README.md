# Flood Map HCMC — V6 Real Navigation + Documentation Cleanup

Pack này có 2 mục tiêu song song:

1. Nâng dự án từ navigation prototype lên real-navigation foundation.
2. Dọn tài liệu cũ để repo chỉ còn một bộ tài liệu canonical, dễ đọc và dễ bảo trì.

## Ưu tiên V6
- real geocoding layer
- expanded road graph
- exact segment snapping
- route filter contract hoàn chỉnh
- unsupported destination confirmation
- giữ nguyên contextual flood rendering của V5
- không redesign UI lớn

## Documentation goal
Sau cleanup, repo nên chỉ giữ:

```text
README.md
AGENT.md
docs/
  PRODUCT.md
  ARCHITECTURE.md
  DATA-SEMANTICS.md
  NAVIGATION.md
  QA.md
  CHANGELOG.md
```

Các prompt triển khai không cần tồn tại vĩnh viễn trong repo sau khi task hoàn thành.

## Run order
1. AGENT.md
2. REVIEW-AND-INVENTORY-PROMPT.md
3. DOC-CLEANUP-PROMPT.md
4. IMPLEMENT-V6-PROMPT.md
5. V6-QA-PROMPT.md
6. build + deploy
7. RELEASE-PROMPT.md
