# Production Debug Policy
Production MUST NOT show:
QA controls, fixture toggles, debug panels, raw enum values, internal IDs, engine version badge trong primary UI.

Allowed only under `import.meta.env.DEV` hoặc explicit QA-only build flag.
QA data OFF mặc định.
