# Skill: GSAP Motion

## Trigger
Use for inspector, timeline, water transitions, camera choreography.

## Rules
- Motion conveys state change.
- Use durations/easing from `docs/06-MOTION-GSAP.md`.
- Kill timelines/tweens on unmount.
- Respect reduced motion.
- Never animate particle instances individually with GSAP.
- Never push 60fps values into React state.

## Acceptance
- no animation race when scrubbing timeline quickly
- selection changes can interrupt previous camera animation safely
- reduced-motion version is usable
