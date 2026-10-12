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

Evidence: pre-PR `38285523692`; PR CI `38287053826`; PR Android `38287053915`; main CI `38287238136`; main Android `38287238150`; Pages `38287336600` — GREEN.

---

## J2 — ORBI Overdrive
Status: **ACTIVE PROGRAM**

Goal: turn earned full Resonance into a temporary mastery state with bounded gameplay value, strong readability and no uncontrolled amplification.

### J2A — Overdrive Pure State Contract
Status: **DEPLOYED / FROZEN**  
Canonical: `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`  
Issue #260 / PR #261

Implemented pure state/timing contract:
- 8 s active duration;
- 4 s post-window re-entry lock;
- explicit Resonance readiness;
- one-shot `consumeResonance`;
- no stacking/refresh/extension;
- deterministic simulation-time expiry/re-entry;
- reset, invalid-time rejection and immutable transitions;
- no live runtime/HUD/buffs/VFX/audio/scans/tuning.

Evidence: pre-PR `38288374752`; PR CI `38288795483`; PR Android `38288795462`; main CI `38288929402`; main Android `38288929417`; Pages `38289009730` — GREEN.

### J2B — Live Activation & HUD
Status: **DEPLOYED / FROZEN**  
Canonical: `466242e91fa927bc4d996d09efdbb87f8f572d44`  
Issue #264 / PR #267

Implemented:
- high-frequency J2A state ref in live runtime;
- `timeElapsedRef` simulation time only;
- explicit activation via `O` and HUD action;
- guarded failure when not playing/game-over/paused/Photo Mode/upgrade modal;
- current Resonance readiness + J2A `canActivate` required;
- one-shot Resonance consumption after accepted activation while preserving chain state;
- fresh-run/restart reset;
- low-frequency `READY / ACTIVE / RECHARGING / CHARGE` HUD projection;
- no combat benefit, VFX/audio, scans, cap/budget or mode tuning.

Evidence:
- pre-PR `38293627094`, job `114959353674` GREEN;
- PR CI `38294148486` GREEN;
- PR Android `38294148448` GREEN;
- main CI `38294331547` GREEN;
- main Android `38294331726` GREEN;
- Pages `38294411795` build + deploy GREEN.

### J2C — Bounded Overdrive Combat Expression
Status: **NEXT / ACTIVE IMPLEMENTATION TARGET**

Design intent:
- keep J2A/J2B activation and time state authoritative;
- define combat-effect projection independently from React/render/audio;
- apply effects only while Overdrive is active;
- keep every multiplier explicitly bounded and non-stacking;
- do not create a second duration/re-entry clock;
- do not add entity scans or bypass projectile/entity budgets;
- no automatic activation;
- preserve Campaign/Infinite isolation and pause/photo/lifecycle correctness;
- prefer a modest offensive expression over raw unlimited damage;
- keep score/economy effects bounded and explicit if introduced;
- leave spectacle, VFX and audio stingers for J2D.

Recommended implementation split if more than one combat statistic is affected:
1. **J2C-A — pure combat-expression projection contract**;
2. **J2C-B — live adoption** using existing engine seams only.

This split is preferred because it preserves the successful J1A/J1B and J2A/J2B architecture: pure deterministic contract first, live adoption second.

### J2D — Reactive VFX / Audio / Safety
Status: PLANNED

Add Overdrive identity only after combat expression is stable:
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