# 10 — CI/CD & Release

## Pull request CI
- install
- lint
- typecheck
- unit tests
- build

## Main branch deploy
Default static option: GitHub Pages.
If backend/serverless secrets are required later, prefer Vercel/Cloudflare/other runtime instead of leaking secrets into frontend.

## Release URL
README should expose the real production URL only after deployment succeeds.

Expected GitHub Pages pattern for this repo:
```text
https://an071003.github.io/Flood-Map-/
```
This is a target URL pattern, not proof that a deployment is already live.

## Release checklist
- build succeeded
- production route works on hard refresh
- assets respect base path `/Flood-Map-/`
- no source map secrets
- mobile smoke test
- weather provider failure handled
- demo badge visible if sample data
