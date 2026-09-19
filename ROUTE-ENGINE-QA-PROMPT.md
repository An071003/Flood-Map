# ROUTE ENGINE QA

## A Vehicle
Same A/B, same time:
- motorbike
- car

PASS nếu engine chạy lại và scores khác khi route có flood-sensitive segments.

## B Multi-candidate
Chọn A/B có >=2 corridors.
PASS nếu có 2–3 routes khác nhau thật.
FAIL nếu 1 route lặp dưới 3 nhãn.

## C Forecast
NOW / +3h / +12h.
PASS nếu flood metrics + score update.

## D Unknown
Route có unknown:
- coverage <100%
- unknown count >0
- dashed neutral
- không coi unknown = 0 cm

## E No low-risk route
Nếu tất cả route đều warning/severe:
- không invent safe route
- show warning rõ

## F Boundary
City overview:
- boundary visible
- outside mask visible
- route overlay không che

## G Stress
- 20 vehicle toggles
- 20 timeline changes
- 20 candidate switches

PASS nếu không stale card/duplicate layer/progressive slowdown.
