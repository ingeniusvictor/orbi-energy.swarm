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
- new standalone pure module `src/game/enemyFormationRoutes.ts`;
- initial route vocabulary: `PINCER`, `X_CROSS`, `SERPENTINE`;
- caller-owned `route`, member slot/count, normalized progress and mirror;
- finite bounded normalized route positions with phase/role/telegraph/safe-intent metadata;
- local member cap 8 and route extent ±1.25;
- exact phase projection from caller progress only;
- fail-closed validation for unknown route, invalid count/slot/progress/mirror;
- caller input immutability;
- no renderer, React, audio, storage, wall clock, RAF, random, network, entity-array or projectile ownership;
- no Campaign/Infinite selection inside the pure contract;
- no runtime adoption yet;
- no changes to global caps, simulation budgets, J1/J2, GAIA, FOTON GLB or player-swarm formations.

Tactical decisions already encoded:
- PINCER → escape converging flanks before closure;
- X_CROSS → time diagonal crossing lanes;
- SERPENTINE → track a moving gap/corridor.

Evidence:
- pre-PR certified head `685d0c498615a35f659cf8f7c8b231c85a8e6e0e`;
- pre-PR run `38310490857`, job `115014740153` GREEN;
- final PR head `5e01e4d21bf1cdc185a8755e16006a2ee70ca89c`;
- PR CI `38310847060` GREEN;
- PR Android `38310847054` GREEN;
- main CI `38310975108` GREEN;
- main Android `38310975021` GREEN;
- Pages `38311040652` GREEN.

Temporary certification workflow was removed before PR and was never merged.

### J3B — Live Enemy Formation Director Adoption
Status: **ACTIVE / NEXT ENGINEERING SLICE AFTER DOC10 CLOSURE**

Purpose: adopt J3A into the live enemy runtime through the smallest safe spawn/movement seam without creating a parallel entity or movement engine.

Required live-adoption constraints:
- `enemiesRef.current` remains the single enemy entity array;
- no extra full-array scan solely for formation behavior;
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES`, descriptor `maxConcurrentEnemies`, entity arrays and simulation budgets;
- a formation group consumes existing spawn capacity rather than adding reserved entities;
- first live slice targets ordinary enemies only; bosses/minibosses/special systems remain out unless a demonstrated shared seam makes them safe;
- explicit Campaign/Infinite eligibility and no silent wave/recipe drift;
- once assigned, route evolution is deterministic and based on caller-owned simulation progress;
- no wall-clock or secondary RAF/timer authority;
- normalized J3A coordinates are materialized through the current playfield/camera coordinate authority;
- movement must be shaped/replaced for opted-in enemies rather than applied as a second velocity stack;
- safe fallback if remaining enemy capacity is insufficient to form a valid group;
- reset/restart/pause cannot leave stale route/group ownership;
- use the minimum per-enemy metadata required to identify group, route, slot and progress origin, or an equally bounded caller-owned map if that is architecturally cleaner;
- no score/economy/damage/projectile/J1/J2/GAIA/FOTON GLB changes;
- player/FOTON formation code remains untouched.

Recommended narrow first slice:
- at most one live formation group at a time;
- bounded regular-enemy group size within the existing J3A max of 8 and actual remaining runtime capacity;
- deterministic route assignment after an existing spawn opportunity chooses formation eligibility;
- start with the three certified J3A routes only;
- no presentation-polish expansion beyond what is minimally necessary for route fairness.

Tests for J3B must prove:
- no cap/concurrency regression;
- no duplicate entity ownership;
- correct opt-in/opt-out fallback;
- deterministic movement given the same assignment/progress;
- reset/restart cleanup;
- pause does not advance route progress;
- ordinary non-formation enemies retain existing movement behavior;
- Campaign and Infinite remain independently controllable;
- J1/J2 behavior is unchanged.

### J3C — Advanced Tactical Formation Vocabulary
Status: PLANNED

Candidate vocabulary after J3B stabilizes: wedges, rings, spirals/corkscrews, convoy attacks, orbit attacks, encirclement, staggered artillery routes, fake retreats, portal ambushes and leader/follower formations.

Admission rule: add a formation only if it creates a distinct tactical question such as lane commitment, center denial, timing a gap, choosing a flank, tracking a leader or deciding whether to chase a retreat. Variety must not come from simply raising HP, enemy count or projectile count.

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
Read `PROJECT_CONTINUITY.md`, `IMPLEMENTATION_LEDGER.md`, this roadmap and referenced active Issues/PRs; then verify live `main` before writing anything.