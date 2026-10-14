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

- J1A — Combat Chain & Resonance Core — `feb263957b52839d35a7cb1249762c223ba22595` — Issue #251 / PR #252.
- J1B — Live Resonance Adoption & HUD — `91564e365d0a2220e4db2999e38372809ec397f3` — Issue #253 / PR #257.

J1 established the earned combat-chain/Resonance loop, affinity diversity, bounded score projection, damage break and live HUD/runtime adoption.

---

## J2 — ORBI Overdrive
Status: **DEPLOYED / FROZEN PROGRAM**

- J2A — Pure State Contract — `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7` — Issue #260 / PR #261.
- J2B — Live Activation & HUD — `466242e91fa927bc4d996d09efdbb87f8f572d44` — Issue #264 / PR #267.
- J2C-A — Pure Bounded Combat Expression — `eca68cce510cf506053fd6d9121b501db7cd1f64` — Issue #271 / PR #272.
- J2C-B — Live Bounded Damage Adoption — `7e15ee1e79ee9ae8903891a66b0b1031b0600bca` — Issue #276 / PR #278.
- J2D-A — Pure Presentation Profile — `39f9b33c9a229c7c8d991aecd81ea695510c82a0` — Issue #281 / PR #282.
- J2D-B — Live Reactive Presentation — `9743890d98b33d365cbc18a048015f3815b144e5` — Issue #286 / PR #287.
- J2E — Integration Certification — `bf0e6a858e3c96091c002ea623b29eb5c260c6ea` — Issue #290 / PR #291.

J2E certified one-shot readiness consumption, exact 8 s active + 4 s re-entry lock, bounded damage/presentation, pause safety, reset and deterministic long-sequence integration.

---

## J3 — Advanced Enemy Formation Director
Status: **DEPLOYED / FROZEN PROGRAM**

Architecture boundary: `src/game/formations.ts` and `formationCycle.ts` are the player/FOTON swarm formation authority. J3 remains an enemy-routing authority.

- J3A — Pure Enemy Formation Route Contract — `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be` — Issue #294 / PR #295.
- J3B — Live Enemy Formation Director Adoption — `0fcf08dc59558619da61e1120eef2e957465f9a1` — Issue #298 / PR #299.
- J3C-A — Pure Advanced Route Vocabulary — `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8` — Issue #302 / PR #303.
- J3C-B — Controlled Live Advanced Adoption — `5c345672b5365dbcc983403f73da62555489a98f` — Issue #306 / PR #307.
- J3D — Telegraph/Fairness/Integration Certification — `7273d447bbdcb084499fb121122aac6d34928d41` — Issue #310 / PR #311.

Certified live route sizes remain PINCER 2, X_CROSS 2, SERPENTINE 2, WEDGE 3, ORBIT 3, SPIRAL 2. Existing spawn opportunities/current capacity remain authoritative; simulation time owns route progress; player/FOTON formation ownership stays separate.

J3C-C convoy/leader-follower, fake retreat, portal ambush, encirclement and staggered-artillery patterns remain **DEFERRED / NOT CURRENTLY JUSTIFIED**. They are not cancelled, but require a future dedicated issue proving distinct tactical value and bounded extra state.

---

## J4 — Tactical Enemy Families
Status: **ACTIVE PROGRAM**

Goal: add enemies whose behavior creates a new tactical decision. J4 must not become a catalog of HP/damage reskins or uncontrolled density.

Candidate long-range vocabulary remains: Shield Phalanx, Reflector Drone, Jammer, Mine Layer, Artillery Carrier, Warp Ambusher, Swarm Leech, Energy Vampire, Formation Breaker, Commander, Repair Drone, Stealth Hunter, Siege Fortress, Parasite Queen and Mirror Drone.

### J4A — Pure Tactical Enemy Family Contract
Status: **DEPLOYED / FROZEN**  
Canonical: `0c3f5c668926130f7ac8044cff8b619302949225`  
Issue #314 / PR #315

Architecture discovery showed that the repo already contained six advanced `EnemyType` values with runtime behavior seams but absent from normal Campaign/Infinite enemy composition. J4A therefore reused the existing catalog instead of adding a parallel type system.

Certified first-family mapping:
- `RIFT_HUNTER` → `WARP_AMBUSHER` — timing pressure / `RIFT_LOCK` / dodge after commit;
- `SIEGE_PRISM` → `ARTILLERY_CARRIER` — range control / `SIEGE_VOLLEY` / break artillery envelope;
- `SWARM_REAVER` → `FORMATION_BREAKER` — swarm cohesion pressure / `REAVER_APPROACH` / intercept before disruption;
- `VOID_ANCHOR` → `JAMMER` — control-source pressure / `ANCHOR_FIELD` / exit or destroy source.

J4A properties:
- exactly four immutable 1:1 family ↔ existing type profiles;
- deterministic lookup and fail-closed unsupported types;
- explicit tactical question, telegraph, counterplay, priority and control-pressure metadata;
- shared zero-authority contract: no spawn authority, entity/projectile collections, full-array scans, cap mutation or support-entity creation;
- no live spawn/progression adoption;
- no `EnergySwarmGame.tsx`, `types.ts`, Campaign/Infinite descriptor, stat tuning, cap/budget, J1/J2/GAIA/FOTON GLB or player/FOTON formation change.

`MINE_WEAVER` and `MIRROR_WARDEN` remain intentionally **DEFERRED** from the tactical-family contract because the current runtime does not yet implement the mine/mirror semantics their names promise.

Exact deployment anchors:
- pre-PR head `8bbce75c6bbd6e1fbcb7205ed7bcb80d9121f767`, run `38488019246` / job `115606272019` GREEN;
- final PR head `55a8abe0de9063b3d937ffca2f52ec9ec283309f`;
- PR CI `38488256442` / job `115607044338` GREEN;
- PR Android `38488256429` / job `115607044509` GREEN;
- canonical `0c3f5c668926130f7ac8044cff8b619302949225`;
- main CI `38488402612` / job `115607525382` GREEN;
- main Android `38488402647` / job `115607525424` GREEN;
- Pages `38488489012` build + deploy GREEN.

### J4B — Narrow Live Tactical Enemy Adoption
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC15 CLOSURE**

Purpose: make a deliberately small subset of the J4A certified families actually reachable through live progression while reusing all existing enemy/spawn/capacity/runtime authority.

J4B is not permitted to “turn on all four everywhere”. Before implementation it must inspect the current Campaign/Infinite selection model and choose the smallest mode-isolated adoption that creates meaningful tactical variety without unfair control stacking.

Required J4B decisions:
- which certified families enter the first live slice;
- whether the first slice belongs to Campaign, Infinite, or explicitly different policies for each;
- minimum progression boundary before each family becomes eligible;
- whether hard-control families (`FORMATION_BREAKER`, `JAMMER`) are excluded from the first live slice or given stricter spacing/cooldown rules;
- how tactical types consume **existing** spawn opportunities rather than creating extra enemies;
- how existing `maxConcurrentEnemies`, global `MAX_ENEMIES`, projectile budget and current descriptor capacity remain authoritative;
- how family selection avoids conflicting with Infinite evolved-enemy selection and J3 formation assignment;
- how severe pressure remains telegraphed and how back-to-back hard-control pressure is prevented.

Hard constraints:
- no new `EnemyType` in J4B;
- no parallel enemy array or tactical-family runtime collection;
- no new full-array scan solely for family selection;
- no cap/budget increase;
- no uncontrolled projectile/support spawning;
- no silent score/economy/J1/J2/GAIA changes;
- no FOTON GLB change;
- preserve J3 enemy-formation and player/FOTON formation authority separation;
- `MINE_WEAVER` / `MIRROR_WARDEN` remain outside scope unless a later pure contract first specifies their real mechanics.

### J4C+ — Additional Tactical Families
Status: PLANNED / BOUNDED SLICES ONLY

Add further families only when each creates a demonstrably distinct decision and reuses certified architecture. Offensive, support, mobility and stateful families should be separated when necessary rather than collected into one large PR.

### J4 design gate
Every proposed family must answer:

**“What new decision does this force the player to make?”**

Reject or redesign a family if its only answer is “shoot it longer,” “avoid more bullets,” or “deal with more enemies.”

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
