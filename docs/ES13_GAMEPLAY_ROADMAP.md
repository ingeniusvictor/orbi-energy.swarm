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

Deterministic chain window, affinity diversity, resonance tiers, capped score multiplier, elite/boss weighting, damage/expiry semantics and `OVERDRIVE_READY` producer.

### J1B — Live Resonance Adoption & HUD
Status: **DEPLOYED / FROZEN**  
Canonical: `91564e365d0a2220e4db2999e38372809ec397f3`  
Issue #253 / PR #257

Direct+splash defeats now feed J1A, accepted damage breaks resonance, simulation-time expiry is live, fresh runs reset state and HUD shows chain/resonance/tier/multiplier. No active Overdrive in J1.

Evidence: pre-PR `38285523692`; PR CI `38287053826`; PR Android `38287053915`; main CI `38287238136`; main Android `38287238150`; Pages `38287336600` — GREEN.

---

## J2 — ORBI Overdrive
Status: **ACTIVE PROGRAM**

Goal: turn earned full Resonance into a spectacular temporary mastery state rather than a simple damage buff.

### J2A — Overdrive Pure State Contract
Status: **DEPLOYED / FROZEN**  
Canonical: `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`  
Issue #260 / PR #261

Implemented:
- pure `combatOverdrive.ts` state machine;
- 8 s active duration;
- 4 s post-window re-entry lock;
- activation requires explicit Resonance readiness;
- successful activation emits one-shot `consumeResonance`;
- no stacking/refresh/extension while active;
- exact simulation-time expiry and exact re-entry boundary;
- active/remaining/lock projection;
- reset, invalid-time rejection, immutable transitions;
- no live runtime/HUD, buffs, VFX/audio, scans or tuning.

Evidence:
- pre-PR `38288374752`, job `114942126186` GREEN;
- PR CI `38288795483` GREEN;
- PR Android `38288795462` GREEN;
- main CI `38288929402` GREEN;
- main Android `38288929417` GREEN;
- Pages `38289009730`, build `114944244748`, deploy `114944343151` GREEN.

### J2B — Live Activation & HUD
Status: **NEXT / ACTIVE IMPLEMENTATION TARGET**

Required:
- own a high-frequency J2A state ref inside live game;
- use `timeElapsedRef` simulation time only;
- explicit player activation action when Resonance says READY and J2A says `canActivate`;
- consume Resonance exactly once on successful activation;
- no activation while paused/upgrade modal/photo/lifecycle suspension;
- low-frequency HUD projection: READY / ACTIVE countdown / RECHARGING lock;
- keyboard + pointer/touch-accessible activation path without removing existing controls;
- fresh-run/restart reset;
- pause/photo/lifecycle suspension cannot burn Overdrive time;
- no combat buffs yet;
- no visual/audio spectacle yet;
- no cap/budget/tuning changes.

### J2C — Combat Expression Layer
Status: PLANNED

Add bounded gameplay value only after J2B is stable. Candidate expression:
- modest fire cadence/projectile-energy efficiency boost or affinity-dependent offensive expression;
- high-value targets / bounded score opportunities;
- never unlimited damage amplification;
- never entity-budget bypass;
- preserve fairness and readable threat pressure.

### J2D — Reactive VFX / Audio / Safety
Status: PLANNED

Add Overdrive identity:
- reactive swarm/canvas treatment;
- HUD/audio stingers and tactical mix response;
- accessibility/readability safeguards;
- pause/photo/lifecycle/reset correctness;
- avoid expensive continuous effects on low presets.

### J2E — Integration Certification
Status: PLANNED

Cross-check J1/J2 interaction, long-run behavior, Android, performance, restart/pause/photo/lifecycle, no chain/resonance regressions and exact-SHA deployment.

Do not start J3 until J2 is deployed/frozen unless a dedicated corrective issue requires otherwise.

---

## J3 — Advanced Enemy Formation Director
Status: PLANNED

Tactical route vocabulary: pincers, wedges, X-cross, rings, spirals/corkscrews, serpentine columns, orbit attacks, encirclement, staggered artillery, fake retreats, portal ambushes, convoy assaults and leader/follower formations. Severe routes require readable telegraphs and bounded simultaneous pressure.

## J4 — Tactical Enemy Families
Status: PLANNED

Candidate roles: Shield Phalanx, Reflector Drone, Jammer, Mine Layer, Artillery Carrier, Warp Ambusher, Swarm Leech, Energy Vampire, Formation Breaker, Commander, Repair Drone, Stealth Hunter, Siege Fortress, Parasite Queen, Mirror Drone.

Rule: every family must create a distinct tactical question, not merely different stats.

## J5 — Priority Targets & Chain-Reaction Combat
Status: PLANNED

Command Cores, linked formations, destructible priority nodes, chain-reaction kills and formation collapse after key-target destruction. Reward tactical solutions without bypassing caps.

## J6 — Dynamic Mid-Sector Events
Status: PLANNED

Candidate events: Solar Storm, Quantum Rift, Blackout Surge, Crystal Rush, Dyson Eclipse, Swarm Distress Call, Convoy Defense, Void Hunt, Elite Incursion, Mirror Swarm, Meteor/Debris Field, Singularity Event.

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

Safely combine:
`enemy archetype + evolved trait + formation + biome + mutator + event`

Requirements: deterministic seed reproduction, explicit compatibility rejection, global caps/budgets authoritative, variety from interaction rather than uncontrolled multiplication.

## J15 — Gameplay Integration & Long-Range Balance
Status: PLANNED

Long runs across difficulty bands, telegraph/spawn/recovery fairness, score/resonance/Overdrive economy, boss/event/mode interactions, desktop+Android performance, readability/pacing/replayability and deterministic failure evidence.

Only after ES-13 stabilizes should the full RC manual campaign be repeated.

---

## ES-14 — Living Warfront
Status: FUTURE PROGRAM / NOT YET COMMITTED

Potential: new biomes/sectors, thematic arcs, contracts/missions, codex/discovery, deeper persistent mastery, mode unlocks, daily/weekly challenges, secure leaderboards when justified, evolving warfront between runs.

## Manual RC strategy
Manual blockers remain open: #4 visual/responsive, #5 Infinite play-feel, #202 GAIA physical runtime, #248 Android real-device. Full final evidence is deferred while ES-13 changes gameplay. CI must never fabricate human/device PASS.

## Recovery discipline
Read `PROJECT_CONTINUITY.md`, `IMPLEMENTATION_LEDGER.md`, this roadmap and referenced active Issues/PRs; then verify live `main` before writing anything.