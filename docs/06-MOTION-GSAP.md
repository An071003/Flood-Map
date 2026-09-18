# 06 — Motion & GSAP

## Motion principle
Motion phải giải thích thay đổi dữ liệu, không chỉ trang trí.

## Durations
- micro hover: 120–180ms
- panel open/close: 260–340ms
- timeline state change: 280–450ms
- camera focus: 900–1200ms
- water level interpolation: 650–900ms

## Easing
- UI: `power2.out`
- camera: `power3.inOut`
- water: `sine.inOut`
- avoid elastic/bounce cho dữ liệu cảnh báo.

## Allowed GSAP usage
- Inspector reveal.
- Timeline thumb and labels.
- Weather marker entrance/stagger.
- Water height interpolation.
- Orchestrate camera animation state.

## Không dùng
- Không tween mỗi particle bằng GSAP.
- Không update React state 60 lần/giây bằng GSAP.
- Không dùng animation để che loading dài.

## Timeline transition
Khi kéo từ NOW sang +3h:
1. UI time label update ngay.
2. Request/resolve forecast snapshot.
3. Water heights tween từ snapshot A → B.
4. Weather marker icon/value crossfade.
5. Inspector metric count-up nhẹ nếu không reduced-motion.

## Reduced motion
- water jump/crossfade 150ms.
- camera dùng duration ngắn.
- particle off.
- no autoplay timeline.
