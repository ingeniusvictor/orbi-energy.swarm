# ES-12I4 — Manual RC Certification Runbook

## Purpose

This runbook governs the human and real-device evidence required before ORBI Energy Swarm may be considered for an explicit Release Candidate promotion.

I4 does not certify the product by itself. It provides a canonical intake format in `release/manual-certification.json` and a fail-closed verifier. The current `0.2.0-beta.1` release remains `BLOCKED` until the three manual blockers are actually reviewed.

## Immutable evidence rule

Every observed result must be tied to the exact candidate being reviewed.

For each blocker that has any criterion changed from `PENDING`, record:

- the exact 40-character Git commit SHA tested;
- an ISO-8601 review timestamp;
- the human reviewer identity or stable reviewer label;
- one or more durable evidence references such as issue comments, screenshots, videos, exported GAIA evidence, analyzer reports or CI artifacts;
- a status for every criterion actually assessed.

Do not copy a PASS from another SHA. Do not infer a human PASS from automated tests. Do not enter placeholder provenance merely to satisfy the verifier.

The verifier accepts truthful `PENDING`, `FAIL` and `INVESTIGATE` states. A blocker becomes `PASS` only when all of its declared criteria are `PASS` and real provenance is present.

## Candidate selection

Use a candidate whose repository revision is known and whose standard certification is already GREEN. For web visual review, use the successful `Web Beta / Pages` deployment associated with that exact candidate SHA. For Android review, use the APK artifact produced by the Android workflow for that exact candidate SHA or another build whose provenance can be demonstrated to be identical.

Release signing and Google Play credentials are not required for this beta certification step and remain external to the repository.

## Blocker 1 — Issue #4 visual/responsive certification

Primary matrix: `docs/VIEWPORT_CERTIFICATION.md`.

Review the rendered candidate in all dossier viewport classes:

1. desktop 1920×1080;
2. laptop 1440×900;
3. short laptop 1366×768;
4. ultrawide 2560×1080;
5. tablet landscape;
6. tablet portrait;
7. Android landscape;
8. Android portrait;
9. compact Android landscape.

For each class, inspect the actual rendered product rather than only DOM/CSS contracts. Confirm that battlefield priority, HUD hierarchy, tactical/logistics decks, boss telemetry, safe areas, touch controls, orientation guidance and scroll behavior remain intentional and usable. Record overlap, clipping, unreadable text, occluded controls, unintended page growth, broken safe areas, distorted battlefield composition or other defects as `FAIL` or `INVESTIGATE`, with evidence references.

Automated viewport tests prove structural behavior only. They are prerequisites, not screenshot-level visual proof.

## Blocker 2 — Issue #5 Infinite Swarm play-feel validation

Use real play sessions of the exact candidate. Cover the progression tiers represented in the dossier and in Issue #5:

- sectors 11–25 — system mastery;
- sectors 26–50 — advanced combinations;
- sectors 51–100 — high pressure;
- sectors 101+ — seeded endless behavior.

Record enough run context to make the observation meaningful: tested SHA, sector range reached, seed/run context when available, control surface and notable mutator/boss conditions.

The human review must explicitly evaluate:

- whether telegraphs, spawning and recovery windows remain understandable and fair;
- whether pressure rises through system combinations rather than only raw-stat inflation;
- whether rematches/mutators remain readable under pressure;
- whether the run remains challenging without becoming arbitrary or visually incomprehensible.

Repository gameplay tests, deterministic large-range simulations and budget guards remain mandatory engineering evidence, but they cannot decide that the game *feels* fair or satisfying. Do not convert automated GREEN into a manual PASS.

## Blocker 3 — ES-11 real-device Android certification

Use one or more real Android devices and an exact-SHA candidate build. Record device model, Android version, display/orientation used, browser or Capacitor/native surface, session duration/context and any relevant quality tier.

Assess the dossier criteria:

- sustained thermal behavior;
- sustained battery behavior;
- browser/system chrome interaction where applicable;
- thumb/hand ergonomics and reachability;
- OEM GPU/driver behavior, including rendering anomalies, crashes or severe cadence degradation;
- GAIA physical runtime review corresponding to Issue #202.

Do not invent universal temperature, battery-drain or FPS thresholds that were not previously certified by the project. Record the actual device conditions, observations and evidence so a reviewer can make a defensible PASS/FAIL/INVESTIGATE decision.

### GAIA evidence reuse

Where performance evidence is relevant, use the existing F4 recorder/analyzer flow documented in:

- `docs/GAIA_RUNTIME_CERTIFICATION.md`;
- `docs/GAIA_EVIDENCE_ANALYZER.md`.

Preserve the captured provenance and analyzer output as evidence references. A GAIA analyzer result such as `READY_FOR_MANUAL_REVIEW` does not replace the human/device decision; it is supporting evidence for it.

## Updating the dossier

Edit only the blocker that was actually reviewed. For any criterion changed away from `PENDING`, supply the real tested SHA, timestamp, reviewer and evidence references for that blocker. Set the blocker status to the deterministic rollup of its criteria:

- any `FAIL` criterion → blocker `FAIL`;
- otherwise any `INVESTIGATE` criterion → blocker `INVESTIGATE`;
- all criteria `PASS` → blocker `PASS`;
- otherwise → blocker `PENDING`.

Then run:

```bash
npm run release:evidence:verify
npm run release:verify
npm run release:readiness
```

A structurally valid incomplete dossier reports `DOSSIER_PENDING`. When every blocker has real evidence and every criterion is `PASS`, the dossier reports `DOSSIER_COMPLETE_FOR_RECONCILIATION`.

That result still does **not** make the product an RC and does not automatically remove `release.manualBlockers`. Reconciliation of completed evidence and any later RC metadata promotion must happen in a separate reviewed repository change.

## Current I4 state

All three blocker entries intentionally begin as `PENDING`. No human/device certification has been claimed by I4 itself.
