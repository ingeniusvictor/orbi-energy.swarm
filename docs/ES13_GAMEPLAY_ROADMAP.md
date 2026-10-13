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
9. Every gameplay phase follows Issue → Branch → gates → PR → PR CI/Android GREEN → squash merge → exact-SHA main CI/Android/Pages GREEN.
10. A phase is not administratively closed until continuity + ledger + roadmap are current.

---

## J1 — Combat Chain & Energy Resonance
Status: **DEPLOYED / FROZEN PROGRAM**

### J1A — Combat Chain & Resonance Core
Canonical: `feb263957b52839d35a7cb1249762c223ba22595`  
Issue #251 / PR #252

### J1B — Live Resonance Adoption & HUD
Canonical: `91564e365d0a2220e4db2999e38372809ec397f3`  
Issue #253 / PR #257

J1 established the earned combat-chain/Resonance loop, affinity diversity, bounded score projection, damage break and live HUD/runtime adoption.

---

## J2 — ORBI Overdrive
Status: **DEPLOYED / FROZEN PROGRAM**

Goal: convert earned full Resonance into a temporary mastery state with bounded gameplay value, readable presentation and no uncontrolled amplification.

- J2A — Pure State Contract — `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7` — Issue #260 / PR #261.
- J2B — Live Activation & HUD — `466242e91fa927bc4d996d09efdbb87f8f572d44` — Issue #264 / PR #267.
- J2C-A — Pure Bounded Combat Expression — `eca68cce510cf506053fd6d9121b501db7cd1f64` — Issue #271 / PR #272.
- J2C-B — Live Bounded Damage Adoption — `7e15ee1e79ee9ae8903891a66b0b1031b0600bca` — Issue #276 / PR #278.
- J2D-A — Pure Presentation Profile — `39f9b33c9a229c7c8d991aecd81ea695510c82a0` — Issue #281 / PR #282.
- J2D-B — Live Reactive Presentation — `9743890d98b33d365cbc18a048015f3815b144e5` — Issue #286 / PR #287.
- J2E — Integration Certification — `bf0e6a858e3c96091c002ea623b29eb5c260c6ea` — Issue #290 / PR #291.

J2E certified one-shot readiness consumption, 8 s active + 4 s re-entry lock, bounded damage/presentation, pause safety, fresh-run reset and deterministic long-sequence integration.

---

## J3 — Advanced Enemy Formation Director
Status: **DEPLOYED / FROZEN PROGRAM**

Goal: create spatially tactical enemy movement that forces route/positioning decisions while keeping existing enemy/projectile caps and simulation budgets authoritative.

Architecture boundary: `src/game/formations.ts` and `formationCycle.ts` are the **player/FOTON swarm** formation authority. J3 remains an enemy-routing authority and never merges ownership with those files.

### J3A — Pure Enemy Formation Route Contract
Status: **DEPLOYED / FROZEN**  
Canonical: `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be`  
Issue #294 / PR #295

Introduced pure deterministic PINCER, X_CROSS and SERPENTINE route projection with bounded normalized geometry, roles and telegraphs; no runtime adoption.

### J3B — Live Enemy Formation Director Adoption
Status: **DEPLOYED / FROZEN**  
Canonical: `0fcf08dc59558619da61e1120eef2e957465f9a1`  
Issue #298 / PR #299

Adopted ordinary CRAWLER/SPLITTER pairs through one caller-owned live director, normal spawn opportunities/capacity, simulation-time movement, Hydro cancellation and reset seams. No parallel enemy array/map, extra spawn authority or formation-only full scan.

### J3C-A — Pure Advanced Route Vocabulary
Status: **DEPLOYED / FROZEN**  
Canonical: `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`  
Issue #302 / PR #303

Added WEDGE, ORBIT and SPIRAL with explicit minimum counts, tactical roles, telegraphs and safe intents while preserving the original three routes.

### J3C-B — Controlled Live Advanced Adoption
Status: **DEPLOYED / FROZEN**  
Canonical: `5c345672b5365dbcc983403f73da62555489a98f`  
Issue #306 / PR #307

Live plan sizes remain bounded:
- PINCER 2;
- X_CROSS 2;
- SERPENTINE 2;
- WEDGE 3;
- ORBIT 3;
- SPIRAL 2.

Advanced route adoption is independently configurable for Campaign and Infinite. Existing spawn opportunities/current capacity remain authoritative and pending assembly cannot overcommit.

### J3C-C — Stateful Tactical Patterns if justified
Status: **DEFERRED / NOT CURRENTLY JUSTIFIED**

Convoy/leader-follower, fake retreat, portal ambush, encirclement and staggered-artillery patterns remain future candidates only. Any activation requires a dedicated issue proving a distinct tactical question, explicit bounded state ownership and no entity/projectile budget inflation.

### J3D — Telegraph / Fairness / Integration Certification
Status: **DEPLOYED / FROZEN**  
Canonical: `7273d447bbdcb084499fb121122aac6d34928d41`  
Issue #310 / PR #311

Certification-only closure of the complete six-route J3 system. Final PR changed exactly two tests and zero runtime/gameplay source files.

Certified:
- route-specific telegraph kind, severity, lane count and safe intent for all six routes;
- lead-in progress = 0 before start;
- exact route completion and recovery boundaries;
- finite in-bounds trajectories for all live 2/3-member plans;
- WEDGE/ORBIT capacity safety and pending assembly non-overcommit;
- safe incomplete-assembly expiry;
- one active/assembling formation group;
- explicit Campaign/Infinite base + advanced policy independence;
- excluded milestone/evolved/elite/miniboss/boss paths;
- simulation-time ownership, pause/photo safety, Hydro cancellation and reset seams;
- formation motion replaces rather than stacks legacy movement;
- no second runtime/array/map/full scan/spawn authority;
- player/FOTON formation isolation;
- deterministic bounded long route-plan sequences;
- no cap/budget/score/economy/damage/projectile/J1/J2/GAIA/FOTON GLB regression.

Exact deployment anchors:
- pre-PR `38320496667` / job `115047172319` GREEN;
- final PR head `09d0f355acc2e93487cfa5d641b7c642820abcd6`;
- PR CI `38320727930` GREEN;
- exact-head Android `38486336058` / job `115600790747` GREEN;
- canonical `7273d447bbdcb084499fb121122aac6d34928d41`;
- main CI `38320885204` GREEN;
- exact-canonical Android `38485843331` / job `115599171557` GREEN;
- Pages `38320970197` build + deploy GREEN.

J3 is therefore closed as a deployed/frozen program. More formation complexity must now justify itself against J4+ tactical needs rather than being added for vocabulary size alone.

---

## J4 — Tactical Enemy Families
Status: **NEXT ACTIVE ENGINEERING PROGRAM AFTER DOC14 CLOSURE**

Goal: add enemies whose behavior creates a new tactical decision. J4 must not become a catalog of HP/damage reskins.

Candidate family vocabulary:
- Shield Phalanx — positional protection / flank decision;
- Reflector Drone — firing-angle / timing discipline;
- Jammer — disrupts a bounded player system and creates priority-target pressure;
- Mine Layer — changes safe-space geometry over time without uncontrolled projectile growth;
- Artillery Carrier — telegraphed long-range zone denial;
- Warp Ambusher — readable relocation/ambush timing;
- Swarm Leech — pressure on swarm integrity rather than raw hull damage;
- Energy Vampire — drains a bounded earned resource and creates interrupt priority;
- Formation Breaker — attacks formation cohesion/spacing rather than simply health;
- Commander — bounded support authority that changes nearby enemy behavior;
- Repair Drone — target-priority healing/support with strict limits;
- Stealth Hunter — readable conceal/reveal timing rather than invisible damage;
- Siege Fortress — slow telegraphed area-control anchor;
- Parasite Queen — bounded spawned/support interaction only if budgets prove safe;
- Mirror Drone — reflects/copies a narrow readable player pattern without cloning full systems.

### Recommended decomposition

#### J4A — Pure Tactical Enemy Contract
First engineering slice. Define a deterministic, runtime-independent tactical-enemy vocabulary and projection/decision contract. Prefer a small subset of families whose mechanics can be expressed without new entity ownership.

Required qualities:
- pure TypeScript module;
- caller-owned state/time;
- no React/Canvas/audio/storage/network/RNG/time side effects;
- explicit tactical role and player-facing counterplay metadata;
- bounded outputs;
- no cap/projectile/entity-budget mutation;
- no Campaign/Infinite routing yet unless explicitly required by the pure contract;
- tests prove determinism, immutability, invalid-input fail-closed behavior and tactical distinctness.

#### J4B — Narrow Live Adoption
Adopt only the certified J4A subset through existing enemy runtime seams. One live authority, no parallel enemy collection, no extra full-array scans, no uncontrolled support/spawn/projectile multiplication.

#### J4C+ — Additional Families in bounded slices
Add families only when each creates a demonstrably distinct decision and reuses the certified architecture. Split offensive/support/mobility/stateful families when necessary rather than growing one PR.

### J4 design gate
Every proposed family must answer:

**“What new decision does this force the player to make?”**

Reject or redesign a family if its only answer is “shoot it longer,” “avoid more bullets,” or “deal with more enemies.”

### J4 hard constraints
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES` and simulation budgets unless a dedicated measured issue proves a safe change;
- preserve Campaign/Infinite isolation where scoped;
- no FOTON GLB change without explicit scope;
- no silent score/economy/J1/J2/GAIA changes;
- keep J3 enemy formation and player/FOTON formation ownership separate;
- prefer deterministic pure contracts before live runtime work;
- telegraph every severe denial/ambush/support mechanic;
- use existing spawn opportunities/capacity whenever possible;
- avoid support-chain recursion and unbounded enemy-to-enemy spawning.

---

## J5 — Priority Targets & Chain-Reaction Combat
Status: PLANNED

Command Cores, linked formations, destructible priority nodes, tactical chain reactions and formation collapse after key-target destruction. Reward tactical solutions without bypassing caps.

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

Blackout Architect, Helios Devourer, Null Choir, Quantum Leviathan, Dyson Breaker, Swarm Sovereign and Singularity Engine. Use phases, destructible zones, affinity/formation pressure, battlefield manipulation and telegraphed vulnerability windows.

## J10 — Expert Risk / Reward
Status: PLANNED

Resonance Graze, Quantum Slip, near-miss chains and optional danger-proximity bonuses. Never mandatory for baseline survival.

## J11 — Build & Synergy Expansion
Status: PLANNED

Distinct run identities around Solar, Hydro, Wind, Thermal, Magnetic and Quantum, followed by controlled hybrid synergies.

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
Manual blockers remain open: #4 visual/responsive, #5 Infinite play-feel, #202 GAIA physical runtime, #248 Android real-device. Full final evidence remains deferred while ES-13 changes gameplay. CI must never fabricate human/device PASS.

## Recovery discipline
Read `PROJECT_CONTINUITY.md`, `IMPLEMENTATION_LEDGER.md`, this roadmap, `TRACEABILITY_POLICY.md`, `ES13_PHASE_CHECKLIST.md` and referenced active Issues/PRs; then verify live `main` before writing anything.
