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

### J2B — Live Activation & HUD
Status: **DEPLOYED / FROZEN**  
Canonical: `466242e91fa927bc4d996d09efdbb87f8f572d44`  
Issue #264 / PR #267

### J2C-A — Pure Bounded Combat Expression
Status: **DEPLOYED / FROZEN**  
Canonical: `eca68cce510cf506053fd6d9121b501db7cd1f64`  
Issue #271 / PR #272

### J2C-B — Live Bounded Damage Adoption
Status: **DEPLOYED / FROZEN**  
Canonical: `7e15ee1e79ee9ae8903891a66b0b1031b0600bca`  
Issue #276 / PR #278

### J2D-A — Pure Presentation Profile
Status: **DEPLOYED / FROZEN**  
Canonical: `39f9b33c9a229c7c8d991aecd81ea695510c82a0`  
Issue #281 / PR #282

### J2D-B — Live Reactive Presentation
Status: **DEPLOYED / FROZEN**  
Canonical: `9743890d98b33d365cbc18a048015f3815b144e5`  
Issue #286 / PR #287

### J2E — Overdrive Integration Certification
Status: **DEPLOYED / FROZEN**  
Canonical: `bf0e6a858e3c96091c002ea623b29eb5c260c6ea`  
Issue #290 / PR #291

J2E certified exact J1/J2 integration, one-shot readiness consumption, bounded J2C damage, J2D presentation-only behavior, exact 8 s active + 4 s lock timing, pause safety, reset and long deterministic bounded sequences. It changed no runtime source.

Evidence anchors: pre-PR `38303651696` / job `114992339524`; PR CI `38308946054`; PR Android `38309446296`; main CI `38309074528`; main Android `38309218634`; Pages `38309135916` — GREEN.

---

## J3 — Advanced Enemy Formation Director
Status: **ACTIVE PROGRAM**

Goal: create spatially tactical enemy movement that forces route/positioning decisions while keeping existing enemy/projectile caps and simulation budgets authoritative.

Important architecture boundary: `src/game/formations.ts` and `formationCycle.ts` are the **player/FOTON swarm** formation system. J3 is an enemy-routing system and must remain a separate authority.

### J3A — Pure Enemy Formation Route Contract
Status: **DEPLOYED / FROZEN**  
Canonical: `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be`  
Issue #294 / PR #295

Implemented:
- standalone pure module `src/game/enemyFormationRoutes.ts`;
- initial route vocabulary: `PINCER`, `X_CROSS`, `SERPENTINE`;
- caller-owned route/member slot/count/progress/mirror;
- finite bounded normalized positions plus phase/role/telegraph metadata;
- local member cap 8 and normalized route extent ±1.25;
- exact phase projection from caller progress only;
- fail-closed validation and caller immutability;
- no renderer, React, audio, storage, wall clock, RAF, random, network, entity-array or projectile ownership;
- no Campaign/Infinite selection and no live runtime adoption in J3A;
- no global cap/budget, J1/J2, GAIA, FOTON GLB or player-formation changes.

Tactical decisions:
- PINCER → escape converging flanks before closure;
- X_CROSS → time diagonal crossing lanes;
- SERPENTINE → track a moving gap/corridor.

Evidence: pre-PR `38310490857` / job `115014740153`; PR CI `38310847060`; PR Android `38310847054`; main CI `38310975108`; main Android `38310975021`; Pages `38311040652` — GREEN.

### J3B — Live Enemy Formation Director Adoption
Status: **DEPLOYED / FROZEN**  
Canonical: `0fcf08dc59558619da61e1120eef2e957465f9a1`  
Issue #298 / PR #299

Implemented:
- one caller-owned live formation director ref; no parallel enemy array/map;
- optional per-enemy route assignment metadata;
- first live slice limited to ordinary CRAWLER/SPLITTER pairs;
- group size 2 and existing spawn opportunities/capacity only;
- certified route cycle remains PINCER/X_CROSS/SERPENTINE;
- Campaign and Infinite eligibility are explicit and separately configurable;
- milestones/evolved/random elites/minibosses/bosses are excluded from the first slice;
- simulation time owns route progress; pause/photo mode does not advance formations;
- formation motion replaces the legacy direct-slither branch for opted-in enemies and never stacks a parallel movement engine;
- Hydro slow clears route ownership so status control remains effective;
- fresh run, wave start and boss transition reset route/director ownership;
- non-formation enemies retain legacy movement;
- no new full-array formation scan, extra spawn event or entity/projectile budget;
- player/FOTON formations remain a separate untouched authority;
- no score/economy/damage/projectile/J1/J2/GAIA/FOTON GLB tuning changes.

Evidence:
- pre-PR certified head `5085ee44e92c2bb5e020d268a0e502606309856a`;
- pre-PR run `38313865225`, job `115025740383` GREEN;
- final PR head `6ff07665f7245b56e9d83c6fcb882f6badbe7f59`;
- PR CI `38314059155` GREEN;
- PR Android `38314059702` GREEN;
- main CI `38314198181` GREEN;
- main Android `38314198069` GREEN;
- Pages `38314280642` build + deploy GREEN.

Temporary patch/reset/certification workflows were removed before PR. The accepted evidence is the final fully GREEN certification path above.

### J3C — Advanced Tactical Formation Vocabulary
Status: **ACTIVE PROGRAM**

Purpose: expand enemy route vocabulary only where a new pattern creates a distinct tactical question while reusing the certified J3A/J3B authority.

#### J3C-A — Pure Advanced Route Vocabulary
Status: **DEPLOYED / FROZEN**  
Canonical: `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`  
Issue #302 / PR #303

Implemented:
- added `WEDGE`, `ORBIT`, `SPIRAL` to the pure enemy route projection authority;
- preserved `PINCER`, `X_CROSS`, `SERPENTINE` behavior/contracts;
- preserved local route member cap 8 and normalized extent ±1.25;
- WEDGE: center denial / flank choice, minimum 3 members;
- ORBIT: rotating exclusion ring / inside-outside timing, minimum 3 members;
- SPIRAL: rotating compression corridor / timing the gap, minimum 2 members;
- explicit advanced member roles, telegraph kinds/severity/laneCount/safeIntent;
- deterministic bounded geometry across all valid slots/progress/mirrors;
- no imports, side effects, time/RNG authority, live director adoption, Campaign/Infinite selection, entity/projectile ownership or player-formation changes.

Evidence: pre-PR `38315199129` / job `115030050802`; PR CI `38315423545`; PR Android `38315423642`; main CI `38315550962`; main Android `38315550956`; Pages `38315617546` — GREEN.

#### J3C-B — Controlled Live Adoption
Status: **DEPLOYED / FROZEN**  
Canonical: `5c345672b5365dbcc983403f73da62555489a98f`  
Issue #306 / PR #307

Implemented:
- advanced route adoption through the existing J3B director; no second movement/runtime authority;
- deterministic full live cycle PINCER/X_CROSS/SERPENTINE/WEDGE/ORBIT/SPIRAL when advanced routes are enabled;
- legacy routes and SPIRAL use bounded live pairs;
- WEDGE/ORBIT use bounded 3-member plans only;
- ordinary CRAWLER/SPLITTER spawn opportunities assemble members one by one;
- current remaining capacity must satisfy the route plan before start and remaining assembly before each assignment;
- incomplete assembly expires safely without replacement spawns;
- one active or assembling group at a time;
- advanced-route adoption independently configurable for Campaign and Infinite;
- existing simulation-time movement, pause/photo safety, Hydro cancellation and run/wave/boss reset preserved;
- `EnergySwarmGame.tsx`, `types.ts`, constants/caps and player/FOTON formations untouched;
- no new full-array scan, entity/projectile ownership, score/economy/damage/J1/J2/GAIA/FOTON GLB change.

Evidence: pre-PR `38317062905` / job `115036102323`; final head `eba0d94663c217ee56986f0d7ca86c4d873f08f3`; PR CI `38317340298`; PR Android `38317340308`; main CI `38317440415`; main Android `38317440420`; Pages `38317520671` — GREEN.

#### J3C-C — Stateful Tactical Patterns if justified
Status: **DEFERRED / NOT CURRENTLY JUSTIFIED**

Potential convoy/leader-follower, fake-retreat, portal-ambush, encirclement or staggered-artillery patterns remain future candidates. Do not add them merely to expand vocabulary. Any activation requires a dedicated issue proving a distinct tactical question, explicit extra-state ownership, bounded telegraph behavior and no entity/projectile budget inflation.

### J3D — Telegraph / Fairness / Integration Certification
Status: **NEXT ENGINEERING SLICE AFTER DOC13 CLOSURE**

Certification-first goals:
- prove all six routes expose readable route-specific telegraph metadata before severe pressure;
- certify lead-in/recovery windows for both 2- and 3-member plans;
- prove WEDGE/ORBIT assembly cannot overcommit capacity or silently raise density;
- certify incomplete assembly, Hydro cancellation, fresh-run/wave/boss reset and pause/photo safety;
- certify deterministic replay boundaries and explicit Campaign/Infinite policy;
- prove no global cap/budget/entity/projectile/score/economy/J1/J2 regression;
- prove player/FOTON formation authority remains separate;
- repeat desktop + Android automated certification and exact-SHA deployment evidence.

Prefer tests/contracts and make runtime corrections only if certification exposes a demonstrated fairness or integration defect. Existing manual visual/play-feel/physical-device blockers remain open and are not replaced by CI.

---

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
Read `PROJECT_CONTINUITY.md`, `IMPLEMENTATION_LEDGER.md`, this roadmap, `TRACEABILITY_POLICY.md`, `ES13_PHASE_CHECKLIST.md` and referenced active Issues/PRs; then verify live `main` before writing anything.