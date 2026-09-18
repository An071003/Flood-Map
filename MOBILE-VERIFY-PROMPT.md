# Mobile Verification

Không suy luận mobile từ CSS. Phải test viewport thật.

## Required
- 390×844
- 360×800

Dùng browser emulation/Playwright nếu có.

## Verify
### Topbar
- không overflow
- search accessible

### Map
- vẫn là hero
- selected road nhìn được

### Bottom sheet
Không dùng desktop right sidebar.

Collapsed:
- road
- depth
- severity
- trend

Expanded:
- rain
- drainage
- tide
- reasons
- vehicle passability
- recommendation
- technical detail

### Timeline
- không overlap sheet
- NOW/+1/+3/+6/+12/+24 usable

### Layer controls
- touch target >=44px
- không chồng search/timeline

### Search
- keyboard không làm result unusable
- query persists sau selection

## Screenshots required
1. 390×844 overview
2. 390×844 selected road
3. 390×844 expanded sheet
4. 360×800 selected road
5. mobile search open

Không ghi PASS nếu chưa test đúng viewport.
