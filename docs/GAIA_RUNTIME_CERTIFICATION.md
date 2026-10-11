# GAIA Runtime Certification Protocol

Issue: #202  
Protocol phase: ES-12G2  
Purpose: certify GAIA on a real browser/device without weakening ORBI Energy Swarm gameplay density or performance safeguards.

## 1. What this protocol proves

This procedure is for physical/manual evidence that CI cannot manufacture: frame behavior during real gameplay, visual identity, unique GAIA lifecycle and the absence of obvious runtime regressions under heavy waves.

It does **not** replace automated tests. It complements the ES-12G0 runtime contracts and ES-12G1 F3 telemetry already merged into `main`.

F3 `CPU WORK` is game-loop work measured in milliseconds. It is **not** operating-system CPU utilization and must never be reported as a system CPU percentage.

## 2. Canonical engine thresholds

Certification must use the thresholds implemented by `src/game/frameHealthMonitor.ts`:

- Frame-health window: **5000 ms (5 s)**.
- Slow-frame threshold: **24 ms**.
- Critical-frame threshold: **33.4 ms**.
- Health states: **HEALTHY**, **PRESSURED**, **CRITICAL**.
- A window is CRITICAL when p95 frame time reaches 33.4 ms, when at least 20% of samples are critical frames, or when at least 40% are slow frames.
- A non-critical window is PRESSURED when p95 reaches 24 ms or at least 15% of samples are slow frames.
- The adaptive monitor can recommend a lower quality preset after **2 consecutive pressured windows**.

For comparable certification, observe each measured state for at least **3 complete frame-health windows (15 s)**. This is long enough to expose the engine's two-consecutive-window pressure rule while giving one extra window for confirmation.

## 3. Test environment record

Before every capture record:

- Date/time.
- Device model and CPU/GPU if known.
- OS and browser version.
- Display resolution and browser zoom.
- ORBI Energy Swarm `main` SHA / deployed beta revision.
- Selected quality preset.
- Power mode / charger state if relevant.
- Whether other heavy applications are running.

Do not compare runs made with different quality presets, browser zoom, resolution, or materially different system load as though they were equivalent.

## 4. F3 metrics to record

Enable F3 before entering the measured heavy-wave interval. Record or capture all visible fields:

- `FPS`
- `FRAME`
- `CPU WORK`
- `PHYSICS`
- `RENDER`
- `OVERHEAD`
- `PEAK CPU`
- `ENEMIES`
- `PROJECTILES`
- `PARTICLES`
- `SWARM`
- quality preset
- frame health: `HEALTHY`, `PRESSURED`, or `CRITICAL`
- `GAIA`: `DORMANT` or `ACTIVE · L<n>`
- `SYNC`: current unique-energy progress / required count
- `CYCLES`: completed synthesis cycles

Entity counts matter: a lower frame cost achieved only because there are fewer enemies is not evidence that GAIA is cheaper.

## 5. Comparable runtime scenarios

Use the same device, browser, resolution, zoom and quality preset for all scenarios. Prefer captures with similar `ENEMIES`, `PROJECTILES`, `PARTICLES` and `SWARM` pressure.

### A. Baseline — GAIA dormant

1. Start a fresh run and enable F3.
2. Keep GAIA dormant; partial SYNC is acceptable but no complete synthesis cycle.
3. Reach a representative heavy-wave state.
4. Capture at least 15 s (3 complete health windows).
5. Save screenshot/video evidence showing F3 and gameplay together.

### B. GAIA L1 — first synthesis

1. Acquire the eight unique canonical follower energies required around permanent FOTON.
2. Confirm one synthesis event produces exactly one GAIA.
3. Confirm F3 reports `GAIA ACTIVE · L1`, `CYCLES 1`, and the new cycle starts again from the appropriate SYNC progress.
4. Reach pressure comparable to baseline.
5. Capture at least 15 s.

### C. GAIA L2+ — same entity evolves

1. Complete another full unique-energy cycle.
2. Confirm the existing GAIA evolves instead of spawning a second GAIA.
3. Confirm F3 level/cycle telemetry increments.
4. Reach pressure comparable to the previous captures.
5. Capture at least 15 s.

If L2+ cannot be reached naturally in the current test session, record that limitation instead of fabricating evidence.

## 6. Performance interpretation

Use the engine health state as the primary certification signal.

**PASS candidate**
- GAIA does not introduce a sustained CRITICAL state under entity pressure comparable to baseline.
- GAIA does not cause the run to cross into 2 consecutive pressured/critical windows when comparable baseline remains HEALTHY.
- Enemy density is not intentionally reduced to obtain the result.
- Projectile counts remain bounded and no runaway pattern is visible.

**INVESTIGATE / regression candidate**
- Comparable baseline is HEALTHY but GAIA repeatedly reaches the engine's two-consecutive-window pressure condition.
- GAIA creates a sustained CRITICAL interval not explained by materially higher enemy/projectile/particle pressure.
- CPU WORK, PHYSICS or RENDER changes sharply and repeatably after GAIA activation under comparable pressure.
- Entity density unexpectedly drops after GAIA activation.

Do not use a made-up absolute OS CPU percentage as a pass/fail rule. F3 exposes loop timing, not operating-system CPU utilization.

## 7. Visual and gameplay invariant checklist

During the same evidence run confirm all of the following:

- [ ] FOTON remains the real 3D GLB protagonist; it has not been replaced by a 2D sprite.
- [ ] Dyson Halo remains present and behaves as designed.
- [ ] Exactly one GAIA exists after the first complete synthesis cycle.
- [ ] A later complete cycle evolves that same GAIA; it does not spawn a duplicate.
- [ ] GAIA uses the lime synthesis identity (`#a3e635`).
- [ ] Near/mid GAIA presentation shows three Canvas2D orbital planes.
- [ ] Far LOD is visibly simplified instead of retaining full near-detail cost.
- [ ] Enemy density has not been deliberately reduced for GAIA certification.
- [ ] No obvious projectile runaway appears after GAIA activation/evolution.
- [ ] F3 GAIA `ACTIVE`, level, `SYNC`, and `CYCLES` agree with what happened in gameplay.

## 8. Evidence table

Use one row per measured state. Add links to screenshots/video or attach them to #202.

| State | SHA | Device / Browser | Quality | Duration | FPS | FRAME ms | CPU WORK ms | PHYSICS ms | RENDER ms | OVERHEAD ms | PEAK CPU ms | ENEMIES | PROJECTILES | PARTICLES | SWARM | Health windows | GAIA | SYNC | CYCLES | Evidence |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | ---: | --- |
| Baseline |  |  |  | >=15 s |  |  |  |  |  |  |  |  |  |  |  |  | DORMANT |  | 0 |  |
| GAIA L1 |  |  |  | >=15 s |  |  |  |  |  |  |  |  |  |  |  |  | ACTIVE · L1 |  | 1 |  |
| GAIA L2+ |  |  |  | >=15 s |  |  |  |  |  |  |  |  |  |  |  |  | ACTIVE · L2+ |  | >=2 |  |

## 9. Decision record for #202

After collecting evidence, post to #202:

1. Exact deployed SHA tested.
2. Environment record.
3. Completed evidence table.
4. Screenshots/video showing F3 and gameplay.
5. Visual invariant checklist.
6. Conclusion: PASS, INVESTIGATE, or FAIL, with the specific frame-health windows and entity pressure that justify it.

**Do not close #202 until real-device/browser evidence is attached and reviewed.**
