# 17 — Test Plan

## Functional
### Basemap
- load without broken labels
- fallback style works

### Boundary
- boundary visible
- mask correct at zoom levels

### Search
- type query
- submit
- query remains
- select result
- query remains
- clear button works

### Road selection
- click line
- correct segment selected
- label anchor on line
- inspector matches road

### Timeline
- NOW → +24h
- values update
- animations cancel/restart correctly
- error state visible if fetch fails

### 3D
- compare 5/15/30/50 cm
- no z-fighting severe
- no duplicate RAF
- resources disposed on unmount

## Responsive
- 1440×900
- 1280×720
- 768 tablet
- 390×844
- 360×800

## Accessibility
- tab through controls
- screen-reader labels
- focus visible
- reduced motion
- color-blind readability

## Data credibility
- mock fields explicitly marked
- no unsupported `accuracy` claims
- timestamps visible
