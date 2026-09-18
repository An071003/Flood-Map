# 19 — Basemap & Boundary Hardening

## Basemap
### Requirement
Không có token/API error text trong viewport.

### Root-cause
Xác định:
- style URL
- tile provider
- token source
- environment variable
- fallback logic
- attribution requirements

### Forbidden
Không `display:none`, blur, mask hoặc overlay lên watermark/error.

### Valid
- provider configured correctly
hoặc
- replace with compatible basemap/style
- attribution preserved

## Boundary
Dùng administrative boundary thật của TP.HCM.

### Requirements
- geometry validated
- Polygon/MultiPolygon supported
- no hand-drawn approximation
- simplify only with documented tolerance

## Rendering order
1. outside mask
2. HCMC transparent fill
3. HCMC outline
4. roads/labels
5. flood road layers
