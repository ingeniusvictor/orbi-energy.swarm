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
Status: **ACTIVE — FINAL CERTIFICATION SLICE**

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
Status: **ACTIVE / NEXT IMPLEMENTATION TARGET**

Purpose: prove the complete J1/J2 stack behaves as one bounded system before introducing J3.

Certification contract:
- deterministic pure integration test that earns Resonance through mixed affinities, reaches readiness, activates Overdrive, consumes readiness once, applies certified J2C damage and J2D presentation, expires at the exact 8 s boundary and respects 4 s re-entry lock;
- prove repeated activation cannot stack/refresh duration or damage;
- prove J1 score multiplier remains authoritative and Overdrive does not add score/economy multipliers;
- prove accepted player damage still performs J1 Resonance break while active Overdrive state remains governed only by J2A;
- prove pause/photo/lifecycle safety through simulation-time invariants and source adoption contracts;
- prove fresh run/restart resets both Resonance and Overdrive;
- long deterministic sequence with finite/bounded chain/resonance/Overdrive/damage/presentation values;
- source contract proving J2B/J2C/J2D each consume their certified pure modules exactly once at their intended seams;
- no gameplay tuning change unless certification exposes a demonstrated defect, in which case open a dedicated correction issue;
- full repo/gameplay/platform/typecheck/release/dossier/build/readiness + Android + scope guard;
- PR CI + Android, squash merge, exact-SHA main CI + Android + Pages.

J2E should preferably be **tests/certification only**. Do not modify runtime merely to make the certification pass.

Do not start J3 until J2E is deployed/frozen.

---

## J3 — Advanced Enemy Formation Director
Status: PLANNED / NEXT AFTER J2E

Tactical route vocabulary: pincers, wedges, X-cross, rings, spirals/corkscrews, serpentine columns, orbit attacks, encirclement, staggered artillery, fake retreats, portal ambushes, convoy assaults and leader/follower formations. Severe routes require readable telegraphs and bounded simultaneous pressure.

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