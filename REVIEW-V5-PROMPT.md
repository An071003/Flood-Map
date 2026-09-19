# REVIEW V5 PROMPT

Do not code.

Audit and return:
| Area | Current behavior | File/module | Gap | Severity | Proposed change |

## Map rendering
1. Which layers color flood roads by default?
2. Which pins/labels show in browse mode?
3. Can selected-road flood rendering be isolated?
4. Can route mode hide global flood colors without unmounting map core?

## Selected road
5. How is selected road stored?
6. Does inspector already derive per-road forecast?
7. Can timeline affect only selected-road visualization?

## Route visualization
8. Current route sources/layers?
9. Selected and alternative routes separated?
10. Can selected route use outer casing + inner per-segment severity?
11. Are non-route flood overlays still visible in route mode?

## Search/geocoding
12. Current index: roads only or places too?
13. External geocoder present?
14. Result contains lng/lat?
15. Supports house number/street/ward/district?
16. Supports hẻm/alley query?
17. Current location available?
18. How A/B snaps to route graph?

## Routing coverage
19. What road classes exist?
20. Can result be outside graph?
21. Is snap distance measured?
22. How unsupported destination is communicated?

## Filters
23. Vehicle state?
24. Forecast state?
25. Strategy state?
26. Flood preference?
27. Data-quality preference?

End with exact layer changes, selected-road plan, route visual hierarchy, search architecture gap, snapping plan, phases.
