# ES-02 — Gameplay Behavior Baseline

This document freezes the player-visible and system-level behavior of the recovered playable prototype before architectural refactors.

The purpose is **not** to declare every current behavior ideal. It distinguishes:

- behavior that must be preserved unless a task explicitly changes it;
- known implementation risks;
- known quirks/bugs that may be corrected later through focused changes.

## 1. Runtime state model

The prototype currently uses two state layers:

### React state — UI-visible state

Examples include:

- playing / paused / game-over / victory;
- score, shield, Nano Credits and swarm size;
- current wave name/number and break countdown;
- active biome and formation;
- audio mute state;
- persistent stats and permanent upgrades;
- mid-run upgrade selection UI;
- boss HUD values and presentation overlays;
- side-panel collapse state and threat-intel overlays.

### Refs — high-frequency simulation state

The real-time loop keeps mutable values in refs to avoid rendering on every frame:

- player/pointer positions;
- keyboard and pointer input;
- swarm members;
- enemies;
- projectiles;
- resources;
- particles;
- current wave timers/budgets;
- boss AI, attacks, shield nodes, phases and telemetry;
- camera position;
- hit-stop, disruption, formation cooldown and effects.

This dual-layer model is intentional prototype behavior. Future extraction should preserve the frame-loop/UI separation.

## 2. Run lifecycle

### Boot

On mount the game:

1. loads persistent stats from `localStorage`;
2. restores permanent upgrade levels from serialized `gameMemories`;
3. restores high score and audio state;
4. posts the initial LUX-8 companion greeting.

### Start/restart

A new run currently:

- initializes audio;
- clears pause/game-over/victory;
- centers Foton at `WORLD_WIDTH / 2, WORLD_HEIGHT / 2`;
- restores shield to base maximum plus permanent shield upgrade;
- resets score and fusion energy;
- clears swarm/enemies/projectiles/resources/particles;
- sets Sector 1;
- begins with a 2.5-second preparation break;
- resets run upgrades and grants one reroll;
- resets boss telemetry/state;
- restores persistent Nano Credit balance;
- recruits the initial Orbi member;
- starts in Solar Fields and Defensive Ring;
- begins exploration BGM;
- starts the `requestAnimationFrame` game loop.

Restart after loss calls the same start path.

## 3. Current campaign contract

The recovered prototype contains exactly **10 handcrafted sectors**.

- Sector 1 starts after the initial 2.5-second preparation break.
- Normal completed sectors transition into an 8-second intermission.
- Intermission restores part of Foton shield.
- Environmental hazards are cleared between sectors.
- Mid-run upgrade selection is offered after completed Sectors **2, 4, 6 and 8**.
- Biomes rotate through the six-biome rotation as sectors advance.
- Sector 10 is the Blackout Devourer encounter.
- Starting Sector 10 spawns the boss instead of starting normal high-intensity progression.

### Important current clamp

`getWaveConfig()` clamps requested wave numbers into the range 1–10.

Therefore, in the current prototype:

- wave 0 resolves to Sector 1;
- wave 11, 100 or any larger number resolves to Sector 10.

This is certified as **current behavior only**. ES-07 is explicitly authorized to replace this clamp with the infinite progression engine.

## 4. Formations

The original six formation identities are:

1. `LINE` — Defensive Ring
2. `CIRCLE` — Arrowhead V
3. `DELTA` — Dynamic Spiral
4. `SHIELD` — Energy Halo
5. `V_SHAPE` — Front Shield
6. `SCATTERED` — Float Walkers

Formation change behavior includes:

- a base 1.5-second cooldown;
- `formation_synchronizer` can reduce that cooldown;
- cooldown never falls below 500 ms;
- change triggers visual/audio/system feedback.

The enum identifiers look older than the current display names. They are compatibility identifiers and must not be casually renamed.

## 5. Input contract

### Keyboard

- `Enter`: start from menu
- WASD / Arrow keys: movement
- `1`–`6`: switch formations
- `P` or `Escape`: pause/unpause
- `M`: mute
- `R`: restart during normal play
- `Space`: skip boss intro when active

During upgrade selection:

- `1`, `2`, `3`: select a choice
- `R`: reroll
- other gameplay input is blocked

### Pointer/touch

The canvas supports Pointer Events and converts CSS coordinates to the logical game coordinate system.

The current mobile shell also exposes a four-direction D-pad below the canvas. This D-pad is certified as existing behavior but **not** as the final Android UX.

## 6. Boss contract

Blackout Devourer is the Sector 10 campaign climax.

Current canonical boss definition includes:

- 1500 max HP;
- three phases;
- phase thresholds at 70% and 35% HP;
- intro sequence;
- attack definitions with telegraphs/cooldowns;
- phase-specific summon rules;
- shield-node/core-exposure mechanics;
- boss telemetry persisted to the player profile.

A victory ends the run and persists victory/boss records.

## 7. Persistence contract

Storage key:

`orbi_energy_swarm_stats_v2`

Persistent data currently includes:

- high score;
- best sector;
- best swarm size;
- run/victory totals;
- enemy/resource totals;
- current Nano Credit balance;
- permanent upgrade levels serialized via `gameMemories`;
- accessibility/display preferences;
- threat discovery;
- boss attempts/victories/codex/telemetry.

`loadGameStats()` merges stored data over `DEFAULT_STATS` and repairs important array fields when legacy/corrupt shapes are encountered.

Malformed JSON falls back to default stats instead of crashing the game.

## 8. Mid-run upgrades

The current upgrade pool contains 14 definitions across offense, defense, swarm, tactical and fusion categories.

Normal choice generation:

- removes upgrades already at max stacks;
- removes affinity-specific upgrades when the matching affinity is absent;
- returns up to three distinct choices;
- attempts to avoid presenting three choices from the same category.

### Known quirk: depleted-pool backfill

If fewer than three choices remain after normal filtering, the final emergency backfill iterates the full upgrade catalog and does not re-check `maxStacks`.

This can theoretically re-offer a maxed upgrade in an extreme depleted-pool state.

ES-02 records this as a known bug candidate. It is **not** part of the desired long-term behavior.

## 9. Known implementation risks

These are not automatically player-visible bugs, but they should guide later extraction.

### Direct React state mutation on run start

`startGame()` directly writes:

- `stats.totalEnemiesDestroyed = 0`
- `stats.totalResourcesCollected = 0`

This mutates an existing React state object and should eventually be replaced with explicit run-local telemetry/state.

### Large orchestration module

`EnergySwarmGame.tsx` owns UI orchestration, input, wave progression, persistence coordination, spawning, combat, boss AI and rendering coordination.

It must be decomposed incrementally behind tests; wholesale replacement is prohibited.

## 10. Safe extraction seams

The following modules are already comparatively isolated and are suitable anchors for regression tests:

- `formations.ts`
- `biomes.ts`
- `waveDirector.ts`
- `upgrades.ts`
- `storage.ts`
- `quality.ts`
- i18n dictionaries

Recommended future extraction order from the monolith:

1. run lifecycle/state machine;
2. wave progression controller;
3. input controller;
4. boss controller;
5. telemetry/persistence coordinator;
6. responsive shell/presentation orchestration.

## 11. Preservation rule

Refactors must preserve this baseline unless an ES-* task explicitly changes a mechanic.

A cleaner architecture is not sufficient justification for changing:

- movement feel;
- formation geometry;
- firing cadence;
- upgrade timing;
- sector pacing;
- boss telegraphs;
- resource collection;
- progression persistence;
- input semantics.

Intentional gameplay evolution must be separately named, reviewed and tested.
