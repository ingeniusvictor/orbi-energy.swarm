# ORBI Energy Swarm — Project Continuity

> START HERE after any new chat/session, context loss or handoff.

Repository: `ingeniusvictor/orbi-energy.swarm`  
Last continuity update: 2026-10-12

## Authority order
1. live GitHub `main` + merged history;
2. exact CI/Android/Pages evidence;
3. this file;
4. `docs/IMPLEMENTATION_LEDGER.md`;
5. `docs/ES13_GAMEPLAY_ROADMAP.md`;
6. active Issues/PRs;
7. chat history only as supplemental context.

Never infer deployment/certification from conversation text alone.

## Current certified gameplay canonical

`0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`

Phase: **ES-13J3C-A — Pure Advanced Enemy Formation Vocabulary**  
Status: **DEPLOYED / FROZEN**  
Issue: #302 — CLOSED  
PR: #303 — squash merged

Single parent: `31de2cd5bb89ae3032902c09ace881119c04dfec` — ES-13DOC11 documentation canonical.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J3C-A implementation summary
J3C-A expanded the existing pure enemy route projection authority without changing live runtime adoption.

Final files:
- `src/game/enemyFormationRoutes.ts`;
- `tests/gameplay/enemy-formation-routes.test.ts`;
- `tests/es-13j3c-a-advanced-route-vocabulary.test.mjs`.

Certified pure vocabulary now contains six routes:
- `PINCER`, `X_CROSS`, `SERPENTINE` — J3A preserved;
- `WEDGE` — center denial / choose a flank or commit through the point;
- `ORBIT` — rotating exclusion ring / inside-vs-outside timing;
- `SPIRAL` — rotating compression corridor / time the tightening gap.

Pure-contract guarantees:
- caller owns route/member slot/count/progress/mirror;
- max route members remains 8;
- normalized extent remains ±1.25;
- exact ENTRY/PRESSURE/EXIT/COMPLETE phase boundaries remain caller-progress driven;
- all valid slots/progress/mirrors remain finite, bounded and deterministic;
- WEDGE/ORBIT require at least 3 slots; SPIRAL requires at least 2;
- route-specific roles, telegraph kinds, severity, laneCount and safeIntent are explicit;
- no imports, renderer, React, audio, storage, network, RNG, wall clock, RAF, timers, entity/projectile ownership or Campaign/Infinite selection;
- J3B live `ROUTE_CYCLE` intentionally remained PINCER/X_CROSS/SERPENTINE only;
- no `EnergySwarmGame.tsx`, live director, player/FOTON formations, caps, budgets, score/economy/damage/projectiles, J1/J2, GAIA or FOTON GLB changes.

## J3C-A exact evidence
- pre-PR certified head `51a6bb26fd0aabb9400de921ef0351d4deb8afe8`;
- pre-PR certification run `38315199129`, job `115030050802` — GREEN across repository/gameplay/platform/typecheck/release/dossier/build/readiness/Android/APK/J3C-A purity guard;
- final clean PR head `71eaccdd4682e53ee13006b7fe1b70f5033e3bc6`;
- PR CI `38315423545` — GREEN on exact final PR head;
- PR Android `38315423642` — GREEN on exact final PR head;
- squash canonical `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`;
- main CI `38315550962` — GREEN on exact canonical;
- main Android `38315550956` — GREEN on exact canonical;
- Pages `38315617546` — build + deploy GREEN on exact canonical.

Temporary certification workflow was branch-only and removed before the final PR diff.

## J3B implementation summary
J3B adopted the certified J3A enemy-route contract into the existing live regular-enemy spawn/movement authority without creating a second enemy runtime.

Final files:
- `src/game/EnergySwarmGame.tsx`;
- `src/game/liveEnemyFormationDirector.ts`;
- `src/game/types.ts`;
- `tests/gameplay/live-enemy-formation-director.test.ts`;
- `tests/es-13j3b-live-enemy-formation-adoption.test.mjs`.

Certified live contract:
- initial live routes remain the J3A vocabulary: `PINCER`, `X_CROSS`, `SERPENTINE`;
- first live slice is limited to ordinary `CRAWLER` / `SPLITTER` enemies;
- one caller-owned `enemyFormationDirectorRef` coordinates bounded assignments;
- optional per-enemy `enemyFormation` metadata stores assignment; no parallel enemy array/map exists;
- formation group size is 2, below the J3A local route-member cap 8;
- formation members consume normal spawn opportunities and current remaining capacity; no extra spawn events are created;
- runtime capacity remains `Math.min(MAX_ENEMIES, descriptor.spawn.maxConcurrentEnemies)`;
- route progress uses existing simulation time `timeElapsedRef.current` only;
- pause/photo mode therefore does not advance formation routes;
- opted-in route motion replaces the existing direct-slither branch instead of stacking a second velocity engine;
- non-formation enemies retain legacy movement;
- Hydro slow clears formation ownership so status control remains effective;
- fresh run, wave start and boss transition reset formation-director ownership;
- Campaign and Infinite eligibility are explicit and independently controllable;
- milestones, evolved enemies, random elites, minibosses and bosses do not opt into the first slice;
- no additional full-array enemy scan was introduced solely for formations;
- no wall-clock, RAF, timer or RNG authority exists in the formation director;
- `src/game/formations.ts` / `formationCycle.ts` remain the separate player/FOTON swarm authority and were untouched;
- no changes to `MAX_ENEMIES`, `MAX_PROJECTILES`, projectile budgets, score/economy/damage, J1/J2, GAIA or FOTON GLB.

Tactical meaning remains:
- PINCER → escape converging flanks before closure;
- X_CROSS → time diagonal crossing lanes;
- SERPENTINE → track a moving corridor rather than camp a static lane.

## J3B exact evidence
- pre-PR certified head `5085ee44e92c2bb5e020d268a0e502606309856a`;
- pre-PR certification run `38313865225`, job `115025740383` — GREEN across repository/gameplay/platform/typecheck/release/dossier/build/readiness/Android/APK/J3B scope guard;
- final clean PR head `6ff07665f7245b56e9d83c6fcb882f6badbe7f59`;
- PR CI `38314059155` — GREEN on exact final PR head;
- PR Android `38314059702` — GREEN on exact final PR head;
- squash canonical `0fcf08dc59558619da61e1120eef2e957465f9a1`;
- main CI `38314198181` — GREEN on exact canonical;
- main Android `38314198069` — GREEN on exact canonical;
- Pages `38314280642` — build + deploy GREEN on exact canonical.

Temporary J3B patch/reset/certification workflows were branch-only and removed before the final PR diff. Failed temporary workflow/guard attempts were infrastructure-only and did not produce a product merge; the final accepted evidence is the fully GREEN run above.

## ES-13 gameplay canonicals
- J1A — Combat Chain & Resonance Core: `feb263957b52839d35a7cb1249762c223ba22595`;
- J1B — Live Combat Resonance Adoption & HUD: `91564e365d0a2220e4db2999e38372809ec397f3`;
- J2A — Overdrive Pure State Contract: `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`;
- J2B — Live Overdrive Activation & HUD: `466242e91fa927bc4d996d09efdbb87f8f572d44`;
- J2C-A — Pure Bounded Overdrive Combat Expression: `eca68cce510cf506053fd6d9121b501db7cd1f64`;
- J2C-B — Live Bounded Overdrive Damage Adoption: `7e15ee1e79ee9ae8903891a66b0b1031b0600bca`;
- J2D-A — Pure Overdrive Presentation Profile: `39f9b33c9a229c7c8d991aecd81ea695510c82a0`;
- J2D-B — Live Reactive Overdrive Presentation: `9743890d98b33d365cbc18a048015f3815b144e5`;
- J2E — Overdrive Integration Certification: `bf0e6a858e3c96091c002ea623b29eb5c260c6ea`;
- J3A — Pure Enemy Formation Route Contract: `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be`;
- J3B — Live Enemy Formation Director Adoption: `0fcf08dc59558619da61e1120eef2e957465f9a1`;
- J3C-A — Pure Advanced Enemy Formation Vocabulary: `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`.

## Resolved diagnostics
- #254 CLOSED / NOT PLANNED: historical platform failure was not an I5 pause regression; no product merge.
- #283 CLOSED / NOT PLANNED: stale-chat false start; no branch/product work.

## Current administrative work
Issue #304 — `ES-13DOC12 — J3C-A Closure Ledger & J3C-B Activation`  
Branch: `docs/es-13-j3c-a-closure-j3c-b-activation`  
Baseline gameplay canonical: `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`  
Scope: documentation only.

## Next gameplay phase

### ES-13J3C-B — Controlled Live Adoption
Status: **NEXT ENGINEERING TARGET AFTER DOC12 CLOSURE**

Purpose: selectively expose the certified WEDGE/ORBIT/SPIRAL vocabulary through the existing J3B live director without creating new entity ownership, spawn events, scans or movement authority.

Critical adoption constraints:
- current J3B group size 2 cannot satisfy WEDGE/ORBIT minimum 3;
- group size must be route-aware and bounded rather than globally increased;
- every member consumes an existing regular spawn opportunity and current remaining capacity;
- no route may reserve or spawn more members than available capacity/budget;
- incomplete assembly fails safely back to legacy behavior without stale ownership;
- one live formation group remains active/assembling at a time;
- route selection/group sizing are deterministic after assignment and use simulation time only;
- Campaign and Infinite eligibility remain explicit and independently configurable;
- milestones/evolved/random elites/minibosses/bosses remain excluded unless separately scoped;
- no additional full-array scan or parallel movement engine;
- player/FOTON formation authority stays separate and untouched.

J3C-C remains a later optional slice for stateful convoy/fake-retreat/portal/encirclement patterns. J3D remains Telegraph/Fairness/Integration Certification.

## Frozen manual/physical blockers
Still OPEN and intentionally deferred while ES-13 changes gameplay:
- #4 — visual/responsive certification;
- #5 — Infinite play-feel;
- #202 — GAIA physical runtime/performance;
- #248 — Android real-device certification.

CI is never a substitute for required human/device evidence.

## Mandatory workflow
`Issue → branch from exact live main → implementation/tests → repo/gameplay/platform/typecheck/release/dossier/build/readiness → PR → PR CI GREEN + Android GREEN → squash merge → exact-SHA main CI GREEN + Android GREEN + Pages GREEN`

Rules:
- never modify `main` directly;
- correction before speed;
- never weaken tests merely to pass;
- remove temporary certification workflows/scripts/diagnostics before final PR diff;
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES`, entity arrays and simulation budgets unless a dedicated demonstrated change requires otherwise;
- preserve Campaign/Infinite isolation where scoped;
- no FOTON GLB change without explicit scope;
- no phase is declared deployed before exact-SHA main + Android + Pages evidence.

## Gameplay chronology
`J3C Advanced Vocabulary → J3D Telegraph/Fairness/Integration → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read this file, `IMPLEMENTATION_LEDGER.md`, `ES13_GAMEPLAY_ROADMAP.md`, `TRACEABILITY_POLICY.md` and `ES13_PHASE_CHECKLIST.md`, then active Issues/PRs. Verify live `main` before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. Read continuity/ledger/roadmap/policy/checklist, verify live `main` and active Issues/PRs, then follow Issue → Branch → gates → PR → exact-SHA main/Android/Pages. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, final head, pre-PR certification, PR CI/Android, main CI/Android/Pages, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.