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

Direct+splash defeats feed J1A, accepted damage breaks resonance, simulation-time expiry is live, fresh runs reset state and HUD shows chain/resonance/tier/multiplier.

---

## J2 — ORBI Overdrive
Status: **ACTIVE PROGRAM**

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

Implemented:
- pure `combatOverdriveEffects.ts` projection;
- J2A/J2B remain activation/timing authority;
- inactive damage multiplier exactly `1.0`;
- active player-damage multiplier exactly `1.20`;
- contract ceiling `1.25`;
- deterministic, immutable, non-stacking;
- no score/economy, fire-rate, projectile-count/speed, crit, defense or entity-budget mutation.

Evidence: corrected full pre-PR `38295483032`, job `114965401785`; PR CI `38295901224`; PR Android `38295901194`; main CI `38296053435`; main Android `38296053642`; Pages `38296151229` — GREEN.

#### J2C-B — Live Bounded Damage Adoption
Status: **DEPLOYED / FROZEN**  
Canonical: `7e15ee1e79ee9ae8903891a66b0b1031b0600bca`  
Issue #276 / PR #278

Implemented:
- `projectCombatOverdriveEffects()` adopted only at `shootFromSwarm()` player-projectile damage resolution;
- authoritative signal is `combatOverdriveRef.current.active`;
- base/profile/GAIA/critical damage resolves before Overdrive;
- certified player-damage multiplier applies exactly once before projectile assignment;
- inactive remains neutral and runtime does not duplicate J2C-A tuning literals;
- quantum/mitosis variants retain their existing ratios from adjusted primary damage;
- no timer/state, fire-rate/cooldown, projectile speed/count, score/economy, crit/splash, cap/budget, Campaign/Infinite, FOTON or GAIA change.

Evidence:
- pre-PR cert `38297477355`, job `114971948257` GREEN;
- PR CI `38297915036` GREEN;
- PR Android `38297913596` GREEN;
- main CI `38298120771` GREEN;
- main Android `38298120436` GREEN;
- Pages `38298206493` build + deploy GREEN.

### J2D — Reactive VFX / Audio / Safety
Status: **ACTIVE / NEXT IMPLEMENTATION TARGET**

Goal: give certified Overdrive a strong ORBI identity without altering its gameplay authority or budgets.

Contract direction:
- presentation only; do not change J2A duration/re-entry, J2B activation/consumption or J2C damage tuning;
- consume already-certified Overdrive active/projection state; no second clock/timer;
- bounded activation stinger and active-state canvas/swarm treatment;
- audio must respect mute and user-gesture/autoplay constraints; no mount-time playback;
- pause/photo/lifecycle/reset behavior must remain consistent with simulation-time Overdrive state;
- low-quality/mobile presets must avoid expensive continuous full-screen or entity-heavy effects;
- preserve objective/boss/threat/HUD readability and accessibility;
- preserve all global entity/projectile budgets and Campaign/Infinite isolation;
- no FOTON GLB or GAIA tuning changes;
- add adoption regressions proving presentation uses certified state and contains no duplicate duration/damage tuning.

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