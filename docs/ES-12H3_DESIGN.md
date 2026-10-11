# ES-12H3 — Endgame Challenge & True Dyson Geometry

Baseline: `9183ac050997ad82a0da6cba1dcec6b172a1dd4f` (ES-12H2 / PR #217).

## Physical playtest findings

- Dyson halo still reads as a single orbit even with a large swarm.
- Formation 2 and formation 5 can push followers outside the intended companion envelope.
- Blackout Devourer now pursues Foton but remains too easy because the player can focus-fire it with little target-priority pressure.
- Desktop battlefield still leaves a small amount of usable vertical room.
- Early Infinite sectors are too easy for a ~30-Orbi swarm.

## Confirmed root causes

1. Dyson descriptors use Euler `rotation.set(x, 0, z)`. With a circular torus and `y = 0`, changing only `z` rotates the ring inside essentially the same tilted plane; the three rings therefore visually collapse into one orbit even when unlocked.
2. Formation 2 (Arrowhead V) and formation 5 (Front Shield) grow linearly with member index, so large swarms can exceed the intended local follower envelope.
3. Devourer passive summons begin only in phase 2 and have low per-type caps; pursuit alone does not force a strong target-priority decision.
4. Early Infinite `MASTERY` disables evolved enemies entirely, while sector-11 aggression/projectile pressure starts close to campaign values.

## Objectives

### True Dyson geometry
- Keep exactly three rings and the existing cyan / emerald / gold progression at 0 / 10 / 20 acquired Orbis.
- Orient each ring from a true 3D plane normal using quaternion/axis-angle math.
- Preserve slow independent spin, red accents, GLB protagonist and constant entity cost.

### Bounded formations
- Replace Formation 2 with a compact five-point **Star Matrix**.
- Replace Formation 5 with a compact four-axis **X-Guard**.
- Keep all member offsets bounded to a local radius suitable for ~30+ followers.
- Preserve the enum keys for save/input compatibility.

### Devourer challenge
- Add a telegraphed **Hunter Wave** attack that deploys a small bounded reinforcement package.
- Begin passive support summons in phase 1 and diversify phase 2/3 support without raising boss HP.
- Hard-cap reinforcement pressure so the boss remains beatable and `MAX_ENEMIES` is never changed.

### Infinite escalation
- Enable evolved enemies from sector 11 at a low bounded frequency.
- Increase evolution concurrency/chance gradually by progression tier.
- Add an evolved Blackout Elite variant with an overdrive charge signature.
- Increase early-Infinite cadence, concurrency and projectile pressure moderately, retaining recovery sectors, telegraph floors and global budgets.
- Prefer new tactical combinations over raw HP inflation.

### Viewport
- Use the remaining desktop width more efficiently on 1600px+ balanced-aspect displays so the 5:3 battlefield consumes slightly more vertical screen space without stretching the logical canvas.

## Hard invariants

- Do not reduce enemy counts.
- Do not change `MAX_ENEMIES` or `MAX_PROJECTILES`.
- Preserve spatial indexes, F3 diagnostics, threat-aware gaze and real Foton GLB gameplay body.
- No new full-enemy per-frame scans.
- No new network/storage path.
- Boss reinforcement logic must remain bounded.
- Infinite scaling must keep fairness telegraph and projectile budgets explicit.

## Verification

- True-plane Dyson geometry tests (distinct normalized plane normals, 0/10/20 unlocks).
- Formation bounds tests for 30, 48 and 64 followers.
- Boss Hunter Wave/summon pressure tests and hard-cap adoption checks.
- Infinite tier evolution/cadence/fairness tests.
- Guarded implementation: repository smoke, gameplay, platform, typecheck and production build.
- Canonical PR CI: smoke, typecheck, release contract, production build.
- Post-merge main CI + GitHub Pages on the exact resulting SHA.
- Manual browser playtest remains mandatory for perceived difficulty and visual readability.