# Skill: Flood Risk Engine

## Trigger
Use when calculating risk, depth, drain duration, confidence or reasons.

## Rules
- Pure deterministic TypeScript.
- Unit test thresholds and missing-data behavior.
- Return explanations.
- Separate observed input from estimated output.
- Confidence must fall when key data is missing/stale.
- Keep weights/config in versioned config, not scattered magic numbers.

## Acceptance
- same input -> same output
- boundary tests for each severity threshold
- stale/no-tide/no-sensor tests
- no LLM call required for risk calculation
