# ES-13 — Arcade Evolution & Dynamic Warfront

Status: ACTIVE PROGRAM  
Repository: `ingeniusvictor/orbi-energy.swarm`

## Purpose

ES-13 turns the stable technical foundation into a deeper, more replayable arcade combat game. Proven fixed-shooter/arcade-shooter principles are reinterpreted through ORBI systems: Energy Swarm, affinities, formations, FOTON, GAIA, Dyson Halo, Blackout, Campaign and Infinite.

Chat history is supplemental only. This roadmap plus `PROJECT_CONTINUITY.md`, `IMPLEMENTATION_LEDGER.md`, exact GitHub history and active Issues/PRs are authoritative.

## Core design rules

1. Preserve ORBI identity; do not copy characters/art/assets from other games.
2. Add decisions, not just HP/damage.
3. Reward mastery through chain, resonance, affinity, formation, routing and risk/reward.
4. Preserve accessibility for new players.
5. Keep Campaign/Infinite isolation where intended.
6. Prefer patterns/state/objectives/behavior over uncontrolled entity growth.
7. Preserve global caps and budgets unless an explicit dedicated issue proves a change is needed.
8. No silent tuning changes.
9. Every product phase follows Issue → Branch → gates → PR → PR CI/Android GREEN → squash merge → exact-SHA main CI/Android/Pages GREEN.
10. A phase is not administratively closed until continuity and ledger are updated.

---

## J1 — Combat Chain & Energy Resonance

### J1A — Combat Chain & Resonance Core Contract
Status: **DEPLOYED / FROZEN**  
Canonical: `feb263957b52839d35a7cb1249762c223ba22595`

Implemented:
- deterministic chain window;
- affinity-diversity progression;
- resonance tiers;
- capped score multiplier;
- elite/boss weighting;
- damage/expiry semantics;
- `OVERDRIVE_READY` state only;
- no React/audio/storage/timers/entity scans in the pure core.

### J1B — Live Combat Resonance Adoption & HUD
Status: **DEPLOYED / FROZEN**  
Canonical: `91564e365d0a2220e4db2999e38372809ec397f3`  
Issue: #253  
PR: #257

Implemented:
- actual direct + splash defeat routing through one combat-defeat authority;
- projectile affinity attribution;
- existing base enemy reward preserved;
- J1A awarded-score projection used live;
- accepted-damage chain break after invincibility guard;
- simulation-time chain expiry;
- fresh-run reset;
- low-frequency HUD chain/resonance/tier/multiplier projection;
- no active Overdrive yet;
- no new entity scans or cap/budget changes.

Exact deployment evidence:
- pre-PR cert `38285523692` GREEN;
- PR CI `38287053826` GREEN;
- PR Android `38287053915` GREEN;
- main CI `38287238136` GREEN;
- main Android `38287238150` GREEN;
- Pages `38287336600` build + deploy GREEN.

---

## J2 — ORBI Overdrive
Status: **NEXT / ACTIVE DESIGN TARGET**

Goal: turn full Resonance into a spectacular, temporary mastery state rather than a simple damage buff.

Planned contract:
- explicit earned activation from `OVERDRIVE_READY`;
- bounded duration;
- deterministic re-entry/cooldown rules;
- reactive visual and audio layer;
- high-value combat opportunities during the state;
- affinity-aware behavior where safe;
- clear activation/expiration/reset feedback;
- pause/photo/lifecycle suspension must not consume unintended time;
- safe reset on run restart/game over;
- no unlimited damage amplification;
- no uncontrolled entity spawning;
- Campaign and Infinite remain compatible;
- existing caps/budgets remain authoritative.

Recommended J2 slices:
1. **J2A — Overdrive State Contract**: pure deterministic activation/duration/re-entry/reset state machine.
2. **J2B — Live Activation & HUD**: connect `OVERDRIVE_READY`, input/action, countdown and presentation state.
3. **J2C — Combat Expression Layer**: bounded combat benefits, affinity-aware expression and score opportunities.
4. **J2D — Reactive VFX/Audio & Safety**: visual/audio identity, pause/photo/lifecycle/reset integration and accessibility.
5. **J2E — Integration Certification**: gameplay/platform/Android/Pages evidence and no regression to J1.

Do not implement J3 until J2 is deployed/frozen unless a corrective issue explicitly requires otherwise.

---

## J3 — Advanced Enemy Formation Director
Status: PLANNED

Add tactical route/formation vocabulary:
- pincer attacks;
- wedges;
- X-cross routes;
- concentric rings;
- spirals/corkscrews;
- serpentine columns;
- orbit attacks;
- encirclement;
- staggered artillery lines;
- fake retreats;
- portal ambushes;
- convoy assaults;
- leader/follower formations.

Dangerous routes require readable telegraphs and bounded simultaneous pressure.

## J4 — Tactical Enemy Families
Status: PLANNED

Candidate archetypes:
- Shield Phalanx;
- Reflector Drone;
- Jammer;
- Mine Layer;
- Artillery Carrier;
- Warp Ambusher;
- Swarm Leech;
- Energy Vampire;
- Formation Breaker;
- Commander;
- Repair Drone;
- Stealth Hunter;
- Siege Fortress;
- Parasite Queen;
- Mirror Drone.

Rule: each family must create a distinct tactical question, not merely different stats.

## J5 — Priority Targets & Chain-Reaction Combat
Status: PLANNED

- Command Cores;
- linked formations;
- destructible priority nodes;
- chain-reaction kills;
- formation collapse after key-unit destruction;
- bounded score/resonance rewards for efficient tactical solutions.

## J6 — Dynamic Mid-Sector Events
Status: PLANNED

Candidate events:
- Solar Storm;
- Quantum Rift;
- Blackout Surge;
- Crystal Rush;
- Dyson Eclipse;
- Swarm Distress Call;
- Convoy Defense;
- Void Hunt;
- Elite Incursion;
- Mirror Swarm;
- Meteor/Debris Field;
- Singularity Event.

Events must be director-compatible, budget-aware and telegraphed before severe punishment.

## J7 — Bonus Challenge Rounds
Status: PLANNED

20–40 s rhythm breakers:
- precision;
- rescue;
- collection;
- evasive corridors;
- pursuit;
- affinity puzzles;
- obstacle navigation;
- timed survival;
- survival without firing.

## J8 — Additional Game Modes
Status: PLANNED

Candidate modes:
- Score Attack;
- Boss Rush;
- Survival / Last Light;
- Swarm Trials;
- Anomaly Runs;
- Daily Seed Challenge;
- Elite Hunt;
- Endless Crisis;
- Perfect Sector.

Reuse the certified engine/core; avoid mode-specific engine forks where possible.

## J9 — Boss & Miniboss Expansion
Status: PLANNED

Candidate encounters:
- The Blackout Architect;
- Helios Devourer;
- The Null Choir;
- Quantum Leviathan;
- Dyson Breaker;
- Swarm Sovereign;
- The Singularity Engine.

Boss targets:
- phases;
- destructible zones where useful;
- affinity/formation pressure;
- battlefield manipulation;
- telegraphed vulnerability windows;
- compatible Infinite rematches/mutators.

## J10 — Expert Risk / Reward
Status: PLANNED

- Resonance Graze;
- Quantum Slip;
- near-miss chains;
- optional danger-proximity bonuses;
- expert score/resonance acceleration.

Never mandatory for baseline survival.

## J11 — Build & Synergy Expansion
Status: PLANNED

Run identities around:
- Solar — burst/direct damage;
- Hydro — control/sustain;
- Wind — speed/chaining/evasion;
- Thermal — DoT/zones;
- Magnetic — projectile/space control;
- Quantum — displacement/crit/probability-like effects.

Then controlled dual/triple synergies such as Solar+Wind, Hydro+Magnetic and Thermal+Quantum.

## J12 — Rare Events & Secret Encounters
Status: PLANNED

- Golden Rift;
- Ancient ORBI Signal;
- Blackout Armada;
- Unknown Energy Signature;
- Titan-class Intruder;
- hidden variants.

Rare events create surprise without becoming required progression blockers.

## J13 — Score, Rank & Mastery
Status: PLANNED

- C / B / A / S / S+ ranks;
- optional sector objectives;
- perfect-sector goals;
- no-damage/swarm-preservation targets;
- affinity efficiency;
- formation mastery;
- time/chain targets;
- mode-specific mastery.

## J14 — Procedural Interaction Matrix
Status: PLANNED

Combine compatible dimensions under explicit safety rules:

`enemy archetype + evolved trait + formation + biome + mutator + event`

Requirements:
- deterministic seed reproduction;
- compatibility matrix to reject unfair combinations;
- global caps/budgets remain authoritative;
- variety comes from interaction, not uncontrolled asset/entity multiplication.

## J15 — Gameplay Integration & Long-Range Balance Certification
Status: PLANNED

Final ES-13 integration:
- long runs across difficulty bands;
- telegraph and spawn/recovery fairness;
- challenge must not collapse into pure stat inflation;
- score/resonance/Overdrive economy balance;
- boss/event/mode interaction review;
- desktop + Android performance regression;
- readability/pacing/replayability validation;
- deterministic evidence for reproducible failures.

Only after ES-13 stabilizes should the full RC manual campaign be repeated.

---

## ES-14 — Living Warfront
Status: FUTURE PROGRAM / NOT YET COMMITTED

Candidate directions:
- new biomes/sectors;
- thematic campaign/event arcs;
- contracts/missions;
- deeper codex/discovery;
- persistent mastery/meta-progression;
- gradual mode unlocks;
- daily/weekly challenges;
- secure leaderboards only when justified;
- evolving warfront state between runs.

---

## Manual RC strategy

Manual blockers remain valid and open:
- #4 visual/responsive;
- #5 Infinite play-feel;
- #202 GAIA physical runtime;
- #248 Android real-device.

Full final evidence collection is deferred while ES-13 changes gameplay. CI must never fabricate human/device PASS.

## Recovery discipline

A new session should read, in order:
1. `docs/PROJECT_CONTINUITY.md`
2. `docs/IMPLEMENTATION_LEDGER.md`
3. this roadmap
4. active Issues/PRs

Then verify live `main` SHA before writing anything.