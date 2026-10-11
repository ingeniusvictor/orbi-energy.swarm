# ES-12H4 — Survival Doctrine & Adaptive Invasion

## Why H4 exists

Physical playtesting after ES-12H3 exposed a systemic balance failure: once the live swarm grows into the mid-30s, autonomous firepower can erase most pressure before FOTON needs to reposition. A survival game must not allow power growth to remove the survival decision.

H4 fixes both curves at once:

1. **Swarm power becomes earned veterancy**, capped permanently at 30 followers.
2. **Infinite pressure becomes adaptive and compositional**, not merely larger HP values.
3. **Stationary play becomes unsafe** through telegraphed anti-idle roles and survival events.
4. **Threat readability remains mandatory**: hard control and projectile pressure stay budgeted.

## Swarm Doctrine

FOTON is the command body and does not occupy a follower slot. Every autonomous combat follower does: canonical energies, GAIA and fusion-class units.

### Founding phase — 10

The run starts with a live-follower capacity of ten. A slot is reserved for GAIA until synthesis so base recruits/fusions cannot accidentally create an eleventh follower when GAIA awakens. The first ten actual follower IDs are the Founding Ten.

### Veteran phase — 10 → 20

Each distinct member of the Founding Ten that reaches level 5 grants one permanent run slot. Therefore capacity progresses 10, 11, 12 ... 20. Promotion credit is monotonic: death never revokes a slot already earned.

### Elite phase — 20 → 30

Capacity remains 20 until ten distinct followers have reached level 10. The tenth level-10 promotion unlocks slot 21. The eleventh unlocks slot 22, and so on until the nineteenth unlocks slot 30. Thirty is absolute.

`quantum_core` no longer owns capacity progression. It remains useful for propulsion/follow responsiveness only.

## Adaptive Invasion

Infinite mode evaluates a bounded pressure projection from sector, wave and live swarm power. The projection may increase:

- concurrent attacker pressure, never above global `MAX_ENEMIES`;
- spawn cadence;
- attack cadence;
- projectile density, never above global `MAX_PROJECTILES`;
- tactical archetype variety;
- one special event at a time.

It does not introduce unbounded schedulers or network/storage paths.

## New hostile roles

### Rift Hunter

Predictive interceptor. It marks FOTON, commits to a readable vector, then dashes through the projected location. Purpose: punish idling and repetitive lateral motion.

### Siege Prism

Long-range artillery. It paints a lane before firing a piercing shot. Purpose: force route planning rather than passive orbiting.

### Swarm Reaver

Fast formation-breaker. A close pass causes a short disruption/cohesion penalty. Purpose: make priority targeting and formation changes matter.

### Void Anchor

Slow control unit. It creates a bounded local suppression/gravity field. Purpose: remove permanent safe zones without creating unavoidable global control.

### Mine Weaver

Trap layer. It places finite, expiring hostile projectiles/mines along likely escape paths and obeys the existing projectile budget.

### Mirror Warden

Directional defender. Its frontal window is inefficient to attack, rewarding movement/flanking rather than raw automatic DPS.

## Special events

Only one H4 event may be active per wave projection. Extreme events are interleaved with deterministic recovery windows.

- **Invasion Surge:** brief density/cadence spike.
- **Blackout Hunt:** reduced information plus interceptors.
- **Crossfire Protocol:** opposing artillery lanes.
- **Minefield Drift:** mobile route-denial pattern.
- **Predator Lock:** priority attackers focus FOTON.
- **Last Stand:** timed high-pressure survival sequence.
- **Recovery Window:** explicit pressure reduction after extreme combinations.

## Boss progression

H4 establishes a boss family instead of endlessly reusing one stat-scaled target:

- **Blackout Devourer Ascendant:** lane denial + Hunter Waves.
- **Null Architect:** area-control encounter built around Void Anchors.
- **Rift Matriarch:** predictive movement, dash chains and decoys.
- **Siege Cathedral:** artillery geometry and safe-lane reading.

Bosses should enter as milestone encounters over subsequent H4 increments; H4 infrastructure must support distinct identities without replacing the existing campaign Devourer.

## Fixed-shooter design principles

H4 uses genre-level lessons from Space Invaders/Galaga descendants without copying protected art, names, layouts or exact patterns: readable formations, changing attack routes, special challenge rounds, escalating chains/intensity, survival intervals, risk/reward and bosses that test positioning rather than only damage output.

## Performance/fairness contract

- FOTON remains GLB gameplay protagonist.
- Dyson Halo and threat gaze remain intact.
- `MAX_ENEMIES` and `MAX_PROJECTILES` remain hard ceilings.
- Spatial indexes and F3 remain canonical.
- No new full-enemy hot-loop scan for H4 mechanics.
- Severe attacks require visible telegraphs.
- Hard-control overlap remains capped at two sources.
- Recovery windows remain part of generated difficulty.
- Automated tests certify bounds and deterministic policy; only browser playtesting can certify that the result *feels* challenging and fair.
