# 05 — 3D Map Visual Spec

## Rendering stack
MapLibre giữ camera/base map. Three.js render overlay/custom layer synchronized với map camera.

## Map style
- Dark neutral basemap.
- Roads/labels vẫn đủ đọc dưới water overlay.
- Buildings extrusion chỉ bật ở zoom phù hợp; desaturate để water/weather nổi bật.

## Weather marker
Visual:
```text
   🌧
  29°
 12mm/h
```
- Billboard toward camera.
- Marker hover: +8% scale.
- Selected: soft cyan halo.
- Scale by zoom; clamp.
- At zoom-out: district cluster only.

## Flood water geometry
Mỗi polygon/cell có:
- base geometry aligned to ground;
- water top surface;
- optional side skirt khi extrusion rõ;
- depth label ở centroid.

### Render-height mapping
Không dùng 1cm dữ liệu = 1cm world tuyệt đối. Dùng visual exaggeration có clamp:
```ts
renderHeight = clamp(0.15 + depthCm * 0.028, 0.15, 2.1)
```
Sau này tune theo map scale, nhưng label luôn hiển thị cm thật.

## Water material
- Transparent physically-inspired material nhẹ.
- Opacity 0.42–0.68 theo severity.
- Fresnel/rim subtle.
- Wave normal/noise rất nhẹ; tránh “biển” giữa thành phố.
- Không refraction nặng ở mobile.

## Severity visual language
- SAFE: không water mesh hoặc surface rất mỏng.
- WATCH: low cyan surface.
- WARNING: higher surface + amber boundary pulse chậm.
- SEVERE: high surface + coral alert outline; không nhấp nháy nhanh.

## Rain particles
- Chỉ local quanh camera/selected area.
- Không mô phỏng toàn thành phố bằng hàng trăm nghìn particles.
- Density từ rainRate; capped.
- Reduced-motion: replace bằng subtle screen-space streak/none.

## Camera presets
- City overview: pitch 45°, bearing -18°.
- District focus: pitch 55°, smooth fly 900–1200ms.
- Close inspection: pitch max 62° để tránh mất context.

## Occlusion rule
Weather marker không bị water che; depth label đặt cao hơn surface. UI overlay luôn ở DOM layer trên canvas.
