# 26 — HCMC Boundary Spec

## Goal
Người dùng nhìn city overview là hiểu ngay phạm vi dữ liệu TP.HCM.

## Source
Dùng administrative boundary thật.

## Rendering
- outline rõ nhưng nhẹ
- fill gần transparent
- outside mask làm mờ bên ngoài

## Layer order
basemap → mask → boundary → roads → flood overlays → pins/labels

## Acceptance
- boundary thấy rõ ở zoom city overview
- không che road labels
- không lệch road geometry
- không crop sai các phần rìa thành phố
