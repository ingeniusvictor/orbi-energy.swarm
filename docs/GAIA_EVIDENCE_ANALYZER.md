# GAIA Evidence Analyzer

Analyzer issue: #210  
Build provenance issue: #212  
Umbrella certification: #202  
Phases: ES-12G4 / ES-12G5

## Purpose

The analyzer processes the three local JSON captures produced by the F4 evidence recorder:

1. Baseline with GAIA dormant.
2. GAIA L1 after the first synthesis cycle.
3. GAIA L2+ after a later cycle evolves the same entity.

It validates the evidence format, summarizes F3 metrics, verifies that the scenarios, browser environment and deployed build provenance are comparable, and calculates deterministic deltas against the baseline.

It does **not** replace the final physical/browser review required by `docs/GAIA_RUNTIME_CERTIFICATION.md`.

## Timing integrity

F4 may be pressed in the middle of an existing 500 ms F3 diagnostics window. To prevent a pre-start fragment from entering the certification interval, the recorder discards the first diagnostics snapshot after F4 starts recording. The following 30 retained snapshots therefore represent 30 complete post-alignment 500 ms diagnostics windows.

A complete capture still must report at least 15,000 ms duration.

## Build provenance

Every browser-generated evidence file now includes two additive runtime metadata fields:

```json
{
  "runtime": {
    "buildSha": "<40-character canonical Git SHA>",
    "productVersion": "0.2.0-beta.1"
  }
}
```

For GitHub Pages, `ORBI_BUILD_SHA` is injected at build time from the exact `github.event.workflow_run.head_sha` revision that the Pages workflow checks out. The product version is injected from npm package metadata while Vite runs under `npm run build`.

Local development intentionally falls back to `local-development` and `0.0.0-local`. Those values are useful for debugging but are **not valid certification provenance**.

The certification wrapper requires all three physical captures to contain a canonical 40-character SHA, a non-local product version, and exactly matching SHA/version values. A missing or local provenance value produces `INVALID`; a cross-capture SHA/version mismatch produces `ENVIRONMENT_MISMATCH`.

The provenance values are compile-time constants. Reading them when F4 creates metadata does not add a fetch, storage lookup, timer or gameplay scan.

## Run the analyzer

```bash
npm run evidence:analyze -- baseline.json gaia-l1.json gaia-l2plus.json
```

The command reads only local files and writes a JSON report to stdout. It performs no upload or network request.

Input order is intentional. Passing a GAIA capture in the baseline position is treated as invalid evidence rather than silently reclassifying it.

## What the report validates

For every capture:

- schema version 1;
- complete evidence flag;
- exactly 30 retained snapshots;
- 500 ms target sample interval;
- at least 15,000 ms total duration;
- finite non-negative diagnostics values;
- one stable quality preset throughout the capture;
- expected GAIA lifecycle state for the declared scenario;
- canonical build SHA and non-local product version.

Across all three captures it checks:

- quality preset;
- viewport width and height;
- device pixel ratio;
- browser user agent;
- deployed page origin/path;
- build SHA;
- product version.

The report includes mean, median, minimum, maximum and p95 for FPS, frame time, loop CPU work, physics, render, overhead, peak CPU and entity-pressure counts. It also reports baseline deltas for GAIA L1 and GAIA L2+.

## Canonical engine thresholds

The report imports the thresholds directly from `src/game/frameHealthMonitor.ts` instead of duplicating them:

- frame-health window: 5000 ms;
- slow frame: 24 ms;
- critical frame: 33.4 ms;
- lower-quality recommendation threshold: 2 consecutive pressured windows.

The evidence snapshots preserve the engine-reported `HEALTHY`, `PRESSURED` or `CRITICAL` status.

## Critical limitation: no fabricated 5 s windows

The recorder samples F3 every 500 ms, but the JSON does not contain exact start/end boundaries for each internal 5 s frame-health window. The analyzer therefore **must not reconstruct or claim exact health windows from groups of ten snapshots**.

Every report sets:

```json
"manualWindowReviewRequired": true
```

Final #202 certification still requires the real gameplay evidence, visual invariant review and the frame-health interpretation defined in `GAIA_RUNTIME_CERTIFICATION.md`.

## Triage states

- `INVALID`: malformed, partial, short, scenario-inconsistent or non-canonical provenance evidence.
- `ENVIRONMENT_MISMATCH`: the three captures were not produced under a comparable browser/display/quality/build environment.
- `INVESTIGATE`: GAIA evidence contains more observed `CRITICAL` health snapshots than the baseline.
- `READY_FOR_MANUAL_REVIEW`: evidence is structurally valid, provenance-matched and comparable, with no analyzer-level regression trigger. This is **not** an automatic PASS.

Only the manual certification decision in #202 may conclude PASS, INVESTIGATE or FAIL for the real runtime.
