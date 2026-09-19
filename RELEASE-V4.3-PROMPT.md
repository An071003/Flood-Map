# RELEASE V4.3

## Production live
- core map renders
- open route planner
- map remains stable
- close planner
- controls/state restore
- candidate omission message works
- unknown legend exists

## QA environment
- enable unknown fixture
- coverage <100%
- unknown count >0
- dashed unknown segment
- tooltip works
- disable fixture
- no QA fake data leaks into production path

FAIL if:
- route mode unmounts core map
- unknown shown as safe/0cm
- fixture leaks into production
- omitted candidate unexplained
- controls fail to restore
