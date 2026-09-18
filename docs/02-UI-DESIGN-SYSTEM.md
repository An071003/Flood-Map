# 02 — UI Design System

## Art direction
**Urban weather intelligence** — dark map, clean civic UI, blue water, restrained status colors.

Không làm kiểu game HUD quá sci-fi. UI phải tạo cảm giác dữ liệu đáng tin, rõ ràng và có chiều sâu.

## Color palette
| Token | Hex | Usage |
|---|---|---|
| `bg.canvas` | `#07111F` | app/map chrome |
| `bg.panel` | `#0B1728` | floating panels |
| `bg.panelElevated` | `#102238` | selected/hovered surface |
| `border.subtle` | `#213A52` | separator/border |
| `text.primary` | `#F4F8FC` | main text |
| `text.secondary` | `#A9BED0` | secondary text |
| `text.muted` | `#6F8CA3` | metadata |
| `accent.cyan` | `#39C6FF` | weather/water focus |
| `accent.blue` | `#397BFF` | forecast/current control |
| `safe` | `#2FD39A` | no/low flood risk |
| `watch` | `#F7C948` | watch |
| `warning` | `#FF9F43` | warning |
| `severe` | `#FF5D73` | severe |
| `rain` | `#8B9DFF` | rainfall chart/particle |

## Water depth visual scale
Độ sâu **không chỉ encode bằng màu**. Kết hợp extrusion/height + opacity + label.

| Depth | Visual |
|---|---|
| 0–5 cm | cyan tint, gần phẳng |
| 5–15 cm | water surface thấp |
| 15–30 cm | rõ height + animated edge |
| 30–50 cm | deeper blue + stronger rim |
| >50 cm | severe outline + depth label |

## Typography
- Display / large number: `Space Grotesk`, fallback `Inter`.
- UI text: `Inter`.
- Không dùng monospace trừ timestamp/raw value/debug.

### Scale
- 12: metadata
- 14: controls/body compact
- 16: body
- 18: panel title
- 24: section/area title
- 32: metric hero
- 48: major depth/rain hero khi cần

## Radius
- 8px controls nhỏ
- 12px cards
- 16px inspector panel
- pill chỉ dành cho badge/chip; không biến mọi component thành pill.

## Elevation
Panel dùng shadow mềm + border 1px. Blur nền tối đa 12px và chỉ khi map vẫn đọc được.

## Spacing
4 / 8 / 12 / 16 / 24 / 32 / 48.

## Iconography
- Lucide cho UI controls.
- Weather icon dùng set thống nhất, có day/night variants.
- Weather marker trên map: icon + temperature, không nhét quá nhiều text.

## Accessibility
- Text contrast tối thiểu WCAG AA.
- Status luôn kèm text/icon, không dựa màu duy nhất.
- Focus ring dùng cyan 2px.
- Reduced motion phải tắt rain particle mạnh và timeline autoplay.
