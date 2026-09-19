# RELEASE V4.1

Review LIVE only.

1. Open route planner.
2. Pick A/B.
3. Motorbike.
4. Verify candidates.
5. Switch Car.
6. Verify real recalculation.
7. NOW -> +3h.
8. Verify metrics/score update.
9. Verify Least Flood / Balanced / Fastest when unique routes exist.
10. Inspect unknown route if available.
11. Verify coverage + unknown count.
12. Select each candidate.
13. Check geometry.
14. City overview: boundary + mask.
15. Mobile bottom sheet.
16. Re-test V3 search/timeline/3D.

FAIL if:
- vehicle UI-only
- unknown shown as 0/safe
- duplicate candidates
- coverage absent
- unknown count absent
- route disconnected
- boundary/mask missing
- V3 regression

Output PASS/FAIL table + blockers.
