# ES-13 — Arcade Evolution & Dynamic Warfront

Status: ACTIVE PROGRAM  
Repository: `ingeniusvictor/orbi-energy.swarm`

## Purpose
Turn the stable technical foundation into a deeper, more replayable arcade combat game. Proven fixed-shooter principles are reinterpreted through ORBI systems: Energy Swarm, affinities, formations, FOTON, GAIA, Dyson Halo, Blackout, Campaign and Infinite.

Authoritative continuity lives in GitHub + `PROJECT_CONTINUITY.md` + `IMPLEMENTATION_LEDGER.md`, not chat history.

## Core design rules
1. Preserve ORBI identity; never copy protected characters/art/assets.
2. Add decisions, not merely HP/damage.
3. Reward mastery through chain, resonance, affinity, formation, routing and risk/reward.
4. Preserve accessibility for new players.
5. Keep Campaign/Infinite isolation where intended.
6. Prefer patterns/state/objectives/behavior over uncontrolled entity growth.
7. Preserve global caps/budgets unless a dedicated issue proves a change is needed.
8. No silent tuning changes.
9. Every product phase follows Issue → Branch → gates → PR → PR CI/Android GREEN → squash merge → exact-SHA main CI/Android/Pages GREEN.
10. A phase is not administratively closed until continuity + ledger + roadmap are current.

---

## J1 — Combat Chain & Energy Resonance

### J1A — Combat Chain & Resonance Core
Status: **DEPLOYED / FROZEN**  
Canonical: `feb263957b52839d35a7cb1249762c223ba22595`

### J1B — Live Resonance Adoption & HUD
Status: **DEPLOYED / FROZEN**  
Canonical: `91564e365d0a2220e4db2999e38372809ec397f3`  
Issue #253 / PR #257

---

## J2 — ORBI Overdrive
Status: **DEPLOYED / FROZEN PROGRAM**

Goal: turn earned full Resonance into a temporary mastery state with bounded gameplay value, strong readability and no uncontrolled amplification.

### J2A — Overdrive Pure State Contract
Status: **DEPLOYED / FROZEN**  
Canonical: `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`  
Issue #260 / PR #261

Pure deterministic 8 s active + 4 s re-entry state contract, explicit readiness, one-shot Resonance consumption signal, simulation-time boundaries, reset and immutable transitions.

### J2B — Live Activation & HUD
Status: **DEPLOYED / FROZEN**  
Canonical: `466242e91fa927bc4d996d09efdbb87f8f572d44`  
Issue #264 / PR #267

Live J2A adoption with ref-owned high-frequency state, simulation-time lifecycle, explicit `O` + HUD activation, gameplay guards, one-shot Resonance consumption, fresh-run reset and compact READY/ACTIVE/RECHARGING HUD.

### J2C — Bounded Overdrive Combat Expression
Status: **DEPLOYED / FROZEN PROGRAM SLICE**

#### J2C-A — Pure Bounded Combat Expression Contract
Status: **DEPLOYED / FROZEN**  
Canonical: `eca68cce510cf506053fd6d9121b501db7cd1f64`  
Issue #271 / PR #272

Inactive player-damage multiplier `1.0`, active `1.20`, hard ceiling `1.25`, deterministic/non-stacking and isolated from score/economy/fire-rate/projectile-count/speed/crit/defense/entity budgets.

#### J2C-B — Live Bounded Damage Adoption
Status: **DEPLOYED / FROZEN**  
Canonical: `7e15ee1e79ee9ae8903891a66b0b1031b0600bca`  
Issue #276 / PR #278

`projectCombatOverdriveEffects()` is adopted exactly once at centralized player-projectile damage resolution while preserving base/profile/GAIA/critical ordering and existing projectile variant ratios.

### J2D — Reactive VFX / Audio / Safety
Status: **DEPLOYED / FROZEN PROGRAM SLICE**

#### J2D-A — Pure Presentation Profile Contract
Status: **DEPLOYED / FROZEN**  
Canonical: `39f9b33c9a229c7c8d991aecd81ea695510c82a0`  
Issue #281 / PR #282

Pure quality-bounded presentation projection with neutral inactive output, maximum direct ring count 3, activation pulse derived from certified remaining ratio and no independent clock/timer.

#### J2D-B — Live Reactive Presentation Adoption
Status: **DEPLOYED / FROZEN**  
Canonical: `9743890d98b33d365cbc18a048015f3815b144e5`  
Issue #286 / PR #287

Implemented:
- live use of certified `projectCombatOverdrivePresentation()`;
- authoritative Overdrive state + simulation time + existing quality preset;
- direct bounded Canvas2D full-field tint and collective FOTON/swarm halo/rings;
- no particle/entity arrays or entity scans;
- short procedural activation stinger only after successful explicit activation;
- existing TACTICAL audio lane, mute-safe and user-gesture bound;
- no mount-time/autoplay activation path;
- no new timer/clock/RAF authority;
- no Overdrive gameplay/timing/damage/score/cap-budget tuning changes.

Evidence:
- pre-PR `38302074362`, job `114987146051` GREEN;
- PR CI `38302405528` GREEN;
- PR Android `38302405569` GREEN;
- main CI `38302618451` GREEN;
- main Android `38302618447` GREEN;
- Pages `38302704724` GREEN.

### J2E — Overdrive Integration Certification
Status: **DEPLOYED / FROZEN**  
Canonical: `bf0e6a858e3c96091c002ea623b29eb5c260c6ea`  
Issue #290 / PR #291

J2E remained tests/certification-only. It introduced no runtime/gameplay tuning changes.

Certified contract:
- deterministic mixed-affinity sequence reaches J1 Resonance readiness and activates J2 exactly once;
- successful activation consumes readiness exactly once;
- J1 score projection remains authoritative and J2 adds no score/economy multiplier;
- J2C applies exactly one bounded player-damage multiplier and cannot stack/refresh;
- J2D remains projection/presentation-only with no gameplay side effects;
- exact 8 s simulation-time expiry and 4 s re-entry lock are preserved;
- repeated activation while active cannot extend duration;
- accepted damage still applies J1 Resonance break without taking ownership of active J2 timing;
- fresh run resets J1 Resonance + J2 Overdrive exactly;
- pause/photo/lifecycle source contracts preserve simulation-time ownership;
- long deterministic sequences remain finite/bounded;
- live J2B/J2C/J2D seams consume certified pure modules without importing duplicated tuning constants.

Evidence:
- pre-PR `38303651696`, job `114992339524` GREEN;
- final PR head `0dcd9b4533976a43f872d6b070607076c6336b48`;
- PR CI `38308946054` GREEN;
- PR Android `38309446296` GREEN on exact final PR head via explicit dispatch because tests-only changes do not match normal Android path filters;
- main CI `38309074528` GREEN;
- main Android `38309218634` GREEN on exact canonical via explicit dispatch for the same tests-only path-filter reason;
- Pages `38309135916` GREEN.

No temporary certification/dispatch workflow was merged into `main`.

---

## J3 — Advanced Enemy Formation Director
Status: **ACTIVE / NEXT IMPLEMENTATION TARGET AFTER DOC9 CLOSURE**

Goal: create spatially tactical enemy movement that forces route/positioning decisions while keeping existing enemy/projectile caps and simulation budgets authoritative.

### Proposed J3 decomposition

#### J3A — Pure Formation Route Contract
Status: **NEXT ENGINEERING SLICE**

Design target:
- deterministic pure formation/route planning with caller-owned state;
- bounded member-slot count; no entity creation or array ownership;
- normalized route/progress semantics that can be evaluated from caller-supplied simulation time/progress;
- explicit formation identity, member role/slot, phase and telegraph metadata;
- pure projection suitable for tests without renderer, React, audio, storage, RAF, wall clock or random authority;
- immutable caller inputs and finite bounded outputs;
- compatibility contract that allows later live adoption without forking Campaign/Infinite logic.

Before implementation, audit existing spawn, formation, movement and route authorities. J3A must extend the smallest existing seam rather than create a parallel movement engine.

#### J3B — Live Formation Director Adoption
Status: PLANNED

Consume J3A through existing spawn/movement authority. Preserve current entity arrays, `MAX_ENEMIES`, `MAX_PROJECTILES`, simulation budgets, Campaign/Infinite isolation and existing boss/special systems. No new full-array scans solely for formation behavior.

#### J3C — Advanced Tactical Formation Vocabulary
Status: PLANNED

Candidate vocabulary: pincers, wedges, X-cross, rings, spirals/corkscrews, serpentine columns, orbit attacks, encirclement, staggered artillery routes, fake retreats, portal ambushes, convoy assaults and leader/follower formations.

Admission rule: a formation is added only if it creates a distinct tactical question such as lane commitment, center denial, timing a gap, choosing a flank, tracking a leader or deciding whether to chase a retreat. Variety must not come from simply raising HP, enemy count or projectile count.

#### J3D — Telegraph / Fairness / Integration Certification
Status: PLANNED

Certify:
- severe crossings/encirclement/ambush routes have readable telegraphs;
- pressure remains bounded with recovery space;
- deterministic replay/restart/pause behavior;
- no cap/budget regression;
- no J1/J2 regression;
- desktop + Android performance and exact-SHA deployment evidence.

Hard constraints across J3:
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES`, existing entity arrays and simulation budgets unless a dedicated demonstrated issue proves a change is required;
- no unnecessary additional entities/projectiles;
- Campaign and Infinite remain isolated where intended;
- no FOTON GLB or GAIA tuning changes;
- no hidden wall-clock/random state where deterministic simulation inputs can own the behavior;
- route telegraphs must preserve player/boss/objective/HUD readability.

## J4 — Tactical Enemy Families
Status: PLANNED

Candidate roles: Shield Phalanx, Reflector Drone, Jammer, Mine Layer, Artillery Carrier, Warp Ambusher, Swarm Leech, Energy Vampire, Formation Breaker, Commander, Repair Drone, Stealth Hunter, Siege Fortress, Parasite Queen, Mirror Drone. Every family must create a distinct tactical question, not merely different stats.

## J5 — Priority Targets & Chain-Reaction Combat
Status: PLANNED

Command Cores, linked formations, destructible priority nodes, chain-reaction kills and formation collapse after key-target destruction. Reward tactical solutions without bypassing caps.

## J6 — Dynamic Mid-Sector Events
Status: PLANNED

Solar Storm, Quantum Rift, Blackout Surge, Crystal Rush, Dyson Eclipse, Swarm Distress Call, Convoy Defense, Void Hunt, Elite Incursion, Mirror Swarm, Meteor/Debris Field and Singularity Event.

## J7 — Bonus Challenge Rounds
Status: PLANNED

20–40 s rhythm breakers: precision, rescue, collection, evasive corridors, pursuit, affinity puzzles, obstacle navigation, timed survival and survival without firing.

## J8 — Additional Game Modes
Status: PLANNED

Score Attack, Boss Rush, Survival/Last Light, Swarm Trials, Anomaly Runs, Daily Seed, Elite Hunt, Endless Crisis and Perfect Sector. Reuse one certified engine/core; avoid mode-specific forks.

## J9 — Boss & Miniboss Expansion
Status: PLANNED

Candidate encounters: Blackout Architect, Helios Devourer, Null Choir, Quantum Leviathan, Dyson Breaker, Swarm Sovereign, Singularity Engine. Use phases, destructible zones, affinity/formation pressure, battlefield manipulation and telegraphed vulnerability windows.

## J10 — Expert Risk / Reward
Status: PLANNED

Resonance Graze, Quantum Slip, near-miss chains and optional danger-proximity bonuses. Never mandatory for baseline survival.

## J11 — Build & Synergy Expansion
Status: PLANNED

Distinct run identities around Solar, Hydro, Wind, Thermal, Magnetic and Quantum, followed by controlled dual/triple synergies.

## J12 — Rare Events & Secret Encounters
Status: PLANNED

Golden Rift, Ancient ORBI Signal, Blackout Armada, Unknown Energy Signature, Titan-class Intruder and hidden variants. Surprise without required progression blockers.

## J13 — Score, Rank & Mastery
Status: PLANNED

C/B/A/S/S+ ranks, optional sector objectives, perfect sectors, no-damage/swarm-preservation targets, affinity efficiency, formation mastery, time/chain goals and mode-specific mastery.

## J14 — Procedural Interaction Matrix
Status: PLANNED

Safely combine `enemy archetype + evolved trait + formation + biome + mutator + event` with deterministic seed reproduction, explicit compatibility rejection and global caps/budgets authoritative.

## J15 — Gameplay Integration & Long-Range Balance
Status: PLANNED

Long runs across difficulty bands, telegraph/spawn/recovery fairness, score/resonance/Overdrive economy, boss/event/mode interactions, desktop+Android performance, readability/pacing/replayability and deterministic failure evidence.

Only after ES-13 stabilizes should the full RC manual campaign be repeated.

---

## ES-14 — Living Warfront
Status: FUTURE PROGRAM / NOT YET COMMITTED

Potential: new biomes/sectors, thematic arcs, contracts/missions, codex/discovery, deeper persistent mastery, mode unlocks, daily/weekly challenges, secure leaderboards when justified and an evolving warfront between runs.

## Manual RC strategy
Manual blockers remain open: #4 visual/responsive, #5 Infinite play-feel, #202 GAIA physical runtime, #248 Android real-device. Full final evidence is deferred while ES-13 changes gameplay. CI must never fabricate human/device PASS.

## Recovery discipline
Read `PROJECT_CONTINUITY.md`, `IMPLEMENTATION_LEDGER.md`, this roadmap and referenced active Issues/PRs; then verify live `main` before writing anything.