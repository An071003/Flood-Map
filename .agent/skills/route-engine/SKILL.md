---
name: route-engine
description: Topological routing graph, Dijkstra multi-corridor candidate generation, vehicle profiles, cost models, and segment snapping.
---

# Route Engine Skill

## Scope
- Topological graph network (`RoadNode` + `GraphRoadSegment`).
- Segment-level orthogonal snapping with exact/near/far/unsupported thresholding.
- Unsupported destination gating (>300m requires explicit user confirmation).
- Vehicle-aware cost modeling:
  - Motorbike: high depth penalty >15cm, critical >25cm.
  - Car: higher tolerance up to 25cm, critical >40cm.
- Strategy support: `LEAST_FLOOD`, `BALANCED`, `FASTEST`.
- Candidate diversity scoring, corridor overlap penalties, and honest candidate omission explanations.
