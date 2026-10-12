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
Status: **NEXT ENGINEERING SLICE AFTER DOC11 CLOSURE**

Purpose: expand enemy route vocabulary only where a new pattern creates a distinct tactical question. J3C must build on the certified J3A/J3B authority instead of creating a second route or movement engine.

#### J3C-A — Pure Advanced Route Vocabulary
Recommended first pure set:
- `WEDGE` — center denial; choose a flank or commit through the point;
- `ORBIT` / `RING` — rotating exclusion zone; choose inside/outside lane and timing;
- `SPIRAL` / `CORKSCREW` — moving compression corridor; time entry/escape rather than merely follow a sine lane.

J3C-A constraints:
- pure `enemyFormationRoutes.ts` expansion only;
- caller-owned normalized progress/mirror/member slot/count;
- finite deterministic bounded positions;
- preserve J3A member cap unless a separate proof justifies change;
- explicit route phase/role/telegraph/safe-intent metadata;
- no renderer, audio, storage, RNG, wall clock, RAF, timers, entity/projectile ownership or live selection;
- no runtime adoption, caps, budgets, score/economy/damage/J1/J2/GAIA/FOTON changes;
- each route must state the player decision it introduces and prove it is not redundant with PINCER/X_CROSS/SERPENTINE.

#### J3C-B — Controlled Live Adoption
After J3C-A certification, selectively add certified routes to the existing J3B live director. Preserve:
- one movement authority;
- existing spawn opportunities/capacity;
- no additional enemy scan or entity array;
- explicit Campaign/Infinite eligibility;
- simulation-time ownership and reset/pause safety;
- safe legacy fallback.

#### J3C-C — Stateful Tactical Patterns if justified
Candidate later patterns: convoy/leader-follower, fake retreats, portal ambushes, encirclement, staggered artillery routes. These should not be forced into the simple normalized-route model if they require independent state or telegraph authority. Any richer contract must remain bounded and must not increase entities/projectiles merely to create difficulty.

Admission rule for all J3C work: add a formation only if it creates a distinct tactical question such as lane commitment, center denial, timing a moving gap, choosing inside/outside space, tracking a leader or deciding whether to chase a retreat.

### J3D — Telegraph / Fairness / Integration Certification
Status: PLANNED

Certify:
- severe crossings/encirclement/ambush routes have readable telegraphs;
- pressure remains bounded with recovery space;
- deterministic replay/restart/pause behavior;
- no cap/budget regression;
- no J1/J2 regression;
- desktop + Android performance and exact-SHA deployment evidence.

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