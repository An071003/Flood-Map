# MAP STATE QA

1. Load app.
2. Verify map tiles, boundary, outside mask, search, timeline, layer rail, road pins, inspector, 3D.
3. Open route planner.
4. Verify core map still exists.
5. Select route.
6. Switch vehicle.
7. Switch +3h.
8. Close planner.
9. Verify prior map state restored.
10. Repeat open/close 10 times.

FAIL if:
- map goes blank
- MapLibre recreated unnecessarily
- timeline/search/layers disappear permanently
- road pins fail to return
- inspector corrupts
- duplicate source/layer/listener appears
- Three layer duplicates
