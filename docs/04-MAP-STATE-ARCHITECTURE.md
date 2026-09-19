# Map State Architecture

Preferred ownership:

AppShell
- FloodMapCore
- MapControls
- Timeline
- Inspector
- RoutePlannerOverlay

Map core owns:
- MapLibre instance
- base sources/layers
- flood layers
- road pins
- boundary/mask

Route planner owns:
- route source/layers
- route candidates
- route panel state

Route planner must not cleanup resources it does not own.
