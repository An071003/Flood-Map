# MASTER PROMPT — V5 Navigation UX

Build V5 on top of stable V4.x.

## Default map
- clean dark basemap
- neutral roads
- no global flood-colored roads
- boundary/mask retained
- optional severe alert pins

## Selected road
- selected-road casing
- flood severity only on selected road
- inspector: depth, forecast, rain, drainage, tide, confidence, vehicle suitability, causes

## Route mode
- selected route = strong casing + segment flood colors
- alternatives = muted
- unknown = dashed neutral
- non-route roads = neutral

## Search
Single search box supports:
- house number + street
- road name
- alley/hẻm
- POI
- intersection
- current location

Result actions:
- Xem ngập
- Đi từ đây
- Đi đến đây

## Routing coverage
If an address is outside supported graph:
- snap to nearest supported segment
- expose snap distance
- explain limitation
- never pretend exact routing/flood coverage

## Filters
- motorbike / car
- NOW/+1/+3/+6/+12/+24
- Least Flood / Balanced / Fastest
- preferred flood threshold
- prefer high coverage / strict known-only
