# ES-12I3 — Release Candidate Readiness

ES-12I3 completes the release-engineering mechanism used to decide whether ORBI Energy Swarm may be promoted from beta to an RC. It does **not** promote the product by itself.

## Canonical I3 policy

Run:

```bash
npm run release:verify
npm run release:readiness
```

`release:readiness` evaluates only committed release metadata and returns a machine-readable decision:

- `BLOCKED` — one or more manual or release-engineering blockers remain.
- `ELIGIBLE_FOR_PROMOTION` — blockers are clear, but the current prerelease metadata has not been explicitly promoted.
- `RC` — the channel is explicitly `rc`, `releaseCandidateEligible=true`, and blockers are zero.
- `STABLE` — stable metadata is explicit, eligible, and blocker-free.

A truthful `BLOCKED` decision exits successfully. Invalid or contradictory metadata fails closed with a non-zero exit code.

## Current beta decision

`0.2.0-beta.1` remains `BLOCKED`. The current manual obligations are:

1. Issue #4 — human visual/responsive certification.
2. Issue #5 — Infinite Swarm difficulty/play-feel validation.
3. ES-11 — real-device Android thermal, sustained battery, browser chrome, ergonomics and OEM GPU/driver validation.

These obligations are intentionally separate from `pendingReleaseEngineering`. I3 completes the readiness machinery while leaving the human/device evidence unresolved.

## CI evidence

The main repository workflow runs readiness only after repository tests, typecheck, release-contract verification and the production build succeed. It writes `release-readiness.json` using the exact GitHub commit SHA and uploads the file as:

`orbi-energy-swarm-rc-readiness-<sha>`

This artifact is evidence of the decision for that exact candidate tree; it is not signing evidence and contains no secrets.

## Promotion rule

RC promotion must be a separate, explicit repository change after all blockers are legitimately cleared. The promotion change must update the prerelease SemVer, release channel and eligibility together, then pass the full repository, Android, and deployment certification flow. No script in I3 mutates release metadata automatically.

Android signing keys, keystore passwords and Google Play credentials remain external to the repository.
