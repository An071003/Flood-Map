# RELEASE CHECK PROMPT

Không sửa feature mới.

Kiểm tra V3.1 như release candidate.

## Test viewports
- 1440x900
- 1280x720
- 768x1024
- 390x844
- 360x800

## Test flows
1. Load app.
2. Confirm no `API KEY REQUIRED`.
3. Confirm HCMC boundary visible.
4. Search Nguyễn Hữu Cảnh.
5. Select road.
6. Confirm query persists.
7. Confirm road highlight alignment.
8. Move timeline NOW -> +3h -> +24h.
9. Confirm values and 3D height update.
10. Toggle 3D repeatedly.
11. Rapid timeline scrub.
12. Open technical details.
13. Test mobile bottom sheet.
14. Simulate data failure if possible.
15. Test keyboard navigation.
16. Test reduced motion.

## Release gate
FAIL nếu:
- broken basemap text appears
- boundary missing
- road marker offset
- estimated data looks observed
- mobile inspector blocks map unusably
- timeline breaks selection
- duplicate Three/MapLibre rendering appears

Output:
- PASS/FAIL per acceptance item
- screenshots nếu tooling cho phép
- exact remaining blockers
