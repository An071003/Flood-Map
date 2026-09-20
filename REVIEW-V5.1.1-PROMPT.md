# REVIEW V5.1.1 PROMPT

Không sửa code trước khi audit xong.

Quét toàn bộ source để tìm user-visible strings trong:
- src/components/**
- src/features/**
- src/services/** nếu string được đưa ra UI
- src/domain/** nếu có recommendation/explanation
- src/stores/** nếu có warning/error
- index/meta/title nếu user nhìn thấy

Trả bảng:
| File | String hiện tại | Có hiện UI? | Giữ nguyên/Dịch/Ẩn | String mới |

Bắt buộc tìm:
ENGINE, QA Test, UNKNOWN, fixture, Sedan, SUV, Anchor, ground-truth, Coverage, Route, Loading, Error, Retry, exact, approximate, street-level, POI.

Không thay internal enum/type nếu không cần.

Kết luận:
1. user-visible English strings
2. QA/debug production leaks
3. copy map đề xuất
4. file/module cần sửa
5. regression risk
