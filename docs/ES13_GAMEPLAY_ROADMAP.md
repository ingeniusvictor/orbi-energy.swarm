# ES-13 — Arcade Evolution & Dynamic Warfront

Status: ACTIVE PROGRAM  
Repository: `ingeniusvictor/orbi-energy.swarm`  
Baseline canonical at roadmap creation: `feb263957b52839d35a7cb1249762c223ba22595`  

## Purpose

ES-13 turns the technically stable ORBI Energy Swarm foundation into a deeper, more replayable arcade combat game. The design goal is not to copy any specific title, but to adapt proven fixed-shooter / arcade-shooter principles into ORBI's own systems: Energy Swarm, affinities, formations, FOTON, GAIA, Dyson Halo, Blackout, Campaign and Infinite.

This file is the persistent gameplay roadmap. Chat history is supplemental only and must never be the sole source of future implementation intent.

## Core design rules

1. Preserve ORBI identity: all borrowed design principles must be reinterpreted through ORBI systems and lore.
2. Add decisions, not just statistics: new enemies and events must force different player responses rather than merely adding HP/damage.
3. Reward mastery: score, chains, resonance, formation choice, affinity choice, routing and risk/reward should create a high skill ceiling.
4. Preserve accessibility: a new player must still be able to understand the basic game loop without mastering advanced systems.
5. Keep Campaign and Infinite isolated where intended.
6. Do not solve variety by uncontrolled entity growth. Prefer patterns, formations, state, behavior, objectives and modifiers while preserving global caps/budgets.
7. No silent tuning changes. Damage, caps, budgets, FOTON assets and frozen historical systems must only change under explicit scoped work.
8. Every phase follows: Issue → Branch → implementation → gates → PR → PR CI GREEN → squash merge → exact-SHA main CI/Android/Pages verification.
9. A phase is not considered closed until `PROJECT_CONTINUITY.md` and `IMPLEMENTATION_LEDGER.md` are updated.

---

## Chronology

### J1 — Combat Chain & Energy Resonance

#### J1A — Combat Chain & Resonance Core Contract
Status: DEPLOYED / FROZEN  
Canonical: `feb263957b52839d35a7cb1249762c223ba22595`

Implemented as a pure deterministic core:
- bounded defeat-chain window;
- affinity-diversity progression;
- resonance tiers;
- capped score multiplier;
- bounded elite/boss weighting;
- damage/expiry break semantics;
- `OVERDRIVE_READY` state only, with no active Overdrive yet;
- invalid inputs fail closed;
- no DOM, React, audio, storage, timers or entity scans.

#### J1B — Live Combat Resonance Adoption & HUD
Status: ACTIVE / NOT MERGED  
Issue: #253

Planned live adoption:
- register actual player-caused kills, including splash kills;
- derive defeat affinity from the projectile when available;
- route existing enemy score through J1A `awardedScore`;
- apply bounded boss/elite/miniboss resonance weighting;
- break the active chain only on accepted player damage, after invincibility rejection;
- expire presentation using simulation time so pause/photo/lifecycle suspension cannot consume the chain window;
- reset state on every fresh run/restart;
- display chain, resonance, tier/progress and multiplier in the existing HUD cadence;
- no Overdrive activation in this phase;
- no new entity scans or cap changes.

### J2 — ORBI Overdrive
Status: PLANNED

Goal: turn full resonance into a spectacular, temporary mastery state rather than a simple damage buff.

Planned elements:
- explicit player-earned activation;
- bounded duration and cooldown/re-entry rules;
- reactive visual and audio layer;
- high-value target opportunities;
- affinity-aware bonuses/behaviors;
- safe cancellation/reset semantics;
- no unlimited damage amplification;
- compatibility with pause, photo mode, Campaign and Infinite.

### J3 — Advanced Enemy Formation Director
Status: PLANNED

Add tactical route/formation vocabulary such as:
- pincer attacks;
- wedges;
- X-cross routes;
- concentric rings;
- spirals/corkscrews;
- serpentine columns;
- orbit attacks;
- encirclement;
- staggered artillery lines;
- fake retreats;
- portal ambushes;
- convoy assaults;
- leader/follower formations.

Telegraphs must make dangerous patterns readable and fair.

### J4 — Tactical Enemy Families
Status: PLANNED

Candidate archetypes:
- Shield Phalanx;
- Reflector Drone;
- Jammer;
- Mine Layer;
- Artillery Carrier;
- Warp Ambusher;
- Swarm Leech;
- Energy Vampire;
- Formation Breaker;
- Commander;
- Repair Drone;
- Stealth Hunter;
- Siege Fortress;
- Parasite Queen;
- Mirror Drone.

Acceptance rule: every new family must create a distinct tactical question, not only a stat variant.

### J5 — Priority Targets & Chain-Reaction Combat
Status: PLANNED

Introduce tactical weak-point logic:
- Command Cores;
- linked formations;
- destructible priority nodes;
- chain-reaction kills;
- formation collapse when key units are destroyed;
- bounded score/resonance bonuses for solving encounters efficiently.

Goal: sometimes the correct decision is target selection rather than maximum fire rate.

### J6 — Dynamic Mid-Sector Events
Status: PLANNED

Candidate events:
- Solar Storm;
- Quantum Rift;
- Blackout Surge;
- Crystal Rush;
- Dyson Eclipse;
- Swarm Distress Call;
- Convoy Defense;
- Void Hunt;
- Elite Incursion;
- Mirror Swarm;
- Meteor / Debris Field;
- Singularity Event.

Events must be director-compatible, budget-aware and readable before punishment.

### J7 — Bonus Challenge Rounds
Status: PLANNED

Short 20–40 s rhythm breakers:
- precision challenges;
- rescue;
- collection;
- evasive corridors;
- pursuit;
- affinity puzzles;
- obstacle navigation;
- timed survival;
- survival without firing.

These rounds should create pacing variety without invalidating normal progression.

### J8 — Additional Game Modes
Status: PLANNED

Candidate modes:
- Score Attack;
- Boss Rush;
- Survival / Last Light;
- Swarm Trials;
- Anomaly Runs;
- Daily Seed Challenge;
- Elite Hunt;
- Endless Crisis;
- Perfect Sector.

Modes should reuse the certified simulation/core where possible instead of forking the game engine.

### J9 — Boss & Miniboss Expansion
Status: PLANNED

Candidate encounters:
- The Blackout Architect;
- Helios Devourer;
- The Null Choir;
- Quantum Leviathan;
- Dyson Breaker;
- Swarm Sovereign;
- The Singularity Engine.

Boss design targets:
- multiple phases;
- destructible zones where appropriate;
- formation-specific pressure;
- affinity adaptation/counters;
- battlefield manipulation;
- telegraphed vulnerability windows;
- Infinite rematches with compatible mutators.

### J10 — Expert Risk / Reward Mechanics
Status: PLANNED

Candidate mastery mechanics:
- Resonance Graze;
- Quantum Slip;
- near-miss chains;
- optional danger proximity bonuses;
- score/resonance acceleration for expert play.

These mechanics must never be mandatory for baseline survival.

### J11 — Build & Synergy Expansion
Status: PLANNED

Deepen run identity around energy archetypes:
- Solar — direct damage / burst;
- Hydro — control / slow / sustain;
- Wind — speed / chaining / evasion;
- Thermal — damage-over-time / zones;
- Magnetic — projectile/space control;
- Quantum — displacement / crit / probability-style mechanics.

Then add controlled dual/triple synergy combinations such as Solar+Wind, Hydro+Magnetic and Thermal+Quantum.

Goal: two successful runs can feel materially different because of player decisions.

### J12 — Rare Events & Secret Encounters
Status: PLANNED

Ultra-low-frequency discoveries:
- Golden Rift;
- Ancient ORBI Signal;
- Blackout Armada;
- Unknown Energy Signature;
- Titan-class Intruder;
- hidden encounter variants.

Rare events should create surprise and conversation without becoming required progression blockers.

### J13 — Score, Rank & Mastery Layer
Status: PLANNED

Planned systems:
- C / B / A / S / S+ ranks;
- optional sector objectives;
- perfect-sector conditions;
- no-damage / swarm-preservation goals;
- affinity efficiency goals;
- formation mastery;
- time and chain targets;
- mode-specific mastery.

Goal: provide meaningful reasons to replay content beyond survival.

### J14 — Procedural Interaction Matrix
Status: PLANNED

Combine compatible dimensions under explicit safety rules:

`enemy archetype + evolved trait + formation + biome + mutator + event`

Objectives:
- large effective variety without hundreds of bespoke assets;
- compatibility matrix preventing unfair/broken combinations;
- director budgets and global caps remain authoritative;
- deterministic seeded reproduction for debugging and challenges.

### J15 — Gameplay Integration & Long-Range Balance Certification
Status: PLANNED

Final ES-13 integration pass:
- long runs across all difficulty bands;
- telegraph fairness;
- spawn/recovery fairness;
- challenge must not collapse into pure stat scaling;
- score/resonance economy balance;
- boss/event/mode interaction review;
- Android and desktop performance regression;
- visual/readability validation;
- replayability and pacing review;
- deterministic evidence for reproducible failures.

Only after the ES-13 feature set stabilizes should full RC manual certification be repeated on the final candidate.

---

## ES-14 — Living Warfront (post-J15 direction)
Status: FUTURE PROGRAM / NOT YET COMMITTED IMPLEMENTATION

Candidate expansion themes:
- new biomes and sectors;
- thematic campaign/event arcs;
- contracts and missions;
- deeper codex/discovery systems;
- persistent mastery/meta-progression;
- gradual mode unlocks;
- daily/weekly challenges;
- leaderboards only when a secure backend model is justified;
- evolving warfront state between runs.

ES-14 details may change based on lessons from ES-13 and must not pre-empt J1–J15 certification.

---

## Manual RC certification strategy

Current manual blockers (#4 visual, #5 Infinite play-feel, #202 GAIA physical runtime, #248 Android real-device) remain valid but full final certification is intentionally deferred while ES-13 is materially changing gameplay. Evidence must never be fabricated from CI.

The preferred timing is after J15, unless a specific intermediate phase requires targeted human evidence for safety or usability.

---

## Reference discipline for future chats

A new chat/session should read, in order:
1. `docs/PROJECT_CONTINUITY.md`
2. `docs/IMPLEMENTATION_LEDGER.md`
3. this roadmap
4. active GitHub issues/PRs named in `PROJECT_CONTINUITY.md`

If chat memory conflicts with repository state, the repository and exact GitHub SHA/CI evidence win.