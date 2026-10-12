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

`5c345672b5365dbcc983403f73da62555489a98f`

Phase: **ES-13J3C-B — Controlled Live Advanced Formation Adoption**  
Status: **DEPLOYED / FROZEN**  
Issue: #306 — CLOSED  
PR: #307 — squash merged

Single parent: `f85e2432934454da191dea9bd0c9da43bbce86ca` — ES-13DOC12 documentation canonical.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J3C-B implementation summary
J3C-B selectively adopted the certified J3C-A advanced routes through the existing J3B live director without changing the game runtime seam.

Final files:
- `src/game/liveEnemyFormationDirector.ts`;
- `tests/gameplay/live-enemy-formation-director.test.ts`;
- `tests/es-13j3c-b-controlled-live-adoption.test.mjs`;
- `tests/es-13j3c-a-advanced-route-vocabulary.test.mjs`.

Certified live plans:
- PINCER → 2 members;
- X_CROSS → 2 members;
- SERPENTINE → 2 live members;
- WEDGE → 3 members;
- ORBIT → 3 members;
- SPIRAL → 2 members.

Certified live guarantees:
- legacy pair routes remain pairs; only WEDGE/ORBIT use the bounded advanced size 3;
- route planning is deterministic and route-aware rather than globally increasing density;
- every formation member consumes an existing ordinary CRAWLER/SPLITTER spawn opportunity;
- no extra/burst spawn event is created;
- a route starts only when current remaining capacity can satisfy its planned member count;
- pending assembly refuses capacity overcommit and expires safely without replacement spawns;
- one active or assembling group remains authoritative at a time;
- advanced-route adoption is independently configurable across Campaign and Infinite;
- existing `enemiesRef.current` plus per-enemy assignment metadata remain authoritative;
- `EnergySwarmGame.tsx`, `types.ts`, player/FOTON formations and global constants were untouched;
- route movement continues through the existing J3B movement seam and simulation time;
- pause/photo behavior, Hydro cancellation, fresh-run/wave/boss reset and legacy fallback remain intact;
- milestones/evolved/random elites/minibosses/bosses remain excluded from this slice;
- no new full-array scan, entity/projectile ownership, cap/budget increase, score/economy/damage/projectile/J1/J2/GAIA/FOTON GLB change.

## J3C-B exact evidence
- pre-PR certified head `2e1c69580443273911358383800f6e324f0ba77f`;
- pre-PR certification run `38317062905`, job `115036102323` — GREEN across repository/gameplay/platform/typecheck/release/dossier/build/readiness/Android/APK/J3C-B scope/adoption guard;
- final clean PR head `eba0d94663c217ee56986f0d7ca86c4d873f08f3`;
- PR CI `38317340298` — GREEN on exact final PR head;
- PR Android `38317340308` — GREEN on exact final PR head;
- squash canonical `5c345672b5365dbcc983403f73da62555489a98f`;
- main CI `38317440415` — GREEN on exact canonical;
- main Android `38317440420` — GREEN on exact canonical;
- Pages `38317520671` — build + deploy GREEN on exact canonical.

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
- J3C-A — Pure Advanced Enemy Formation Vocabulary: `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`;
- J3C-B — Controlled Live Advanced Formation Adoption: `5c345672b5365dbcc983403f73da62555489a98f`.

## Resolved diagnostics
- #254 CLOSED / NOT PLANNED: historical platform failure was not an I5 pause regression; no product merge.
- #283 CLOSED / NOT PLANNED: stale-chat false start; no branch/product work.

## Current administrative work
Issue #308 — `ES-13DOC13 — J3C-B Closure & J3D Certification Activation`  
Branch: `docs/es-13-j3c-b-closure-j3d-activation`  
Baseline gameplay canonical: `5c345672b5365dbcc983403f73da62555489a98f`  
Scope: documentation only.

## Next gameplay phase

### ES-13J3D — Telegraph / Fairness / Integration Certification
Status: **NEXT ENGINEERING TARGET AFTER DOC13 CLOSURE**

Purpose: certify the complete six-route J3 formation system before adding more enemy-formation state or moving to J4.

Certification priorities:
- prove route-specific telegraph metadata exists before severe crossing/compression pressure;
- certify lead-in and recovery timing for both 2- and 3-member live plans;
- prove WEDGE/ORBIT assembly cannot overcommit current capacity or create hidden density;
- certify incomplete assembly, Hydro cancellation, fresh-run/wave/boss reset and pause/photo safety;
- certify deterministic replay boundaries and explicit Campaign/Infinite policy;
- prove no cap/budget/entity/projectile/score/economy/J1/J2 regression;
- prove player/FOTON formation authority remains separate;
- repeat desktop + Android automated certification and exact-SHA deployment evidence.

J3C-C is **DEFERRED / NOT CURRENTLY JUSTIFIED**, not cancelled. Stateful convoy/leader-follower, fake-retreat, portal-ambush, encirclement or staggered-artillery patterns may return only through a dedicated issue that demonstrates a distinct tactical need and bounded extra state.

J3D is certification-first: prefer tests/contracts and make runtime corrections only when evidence demonstrates a fairness or integration defect. Existing manual/physical blockers remain open; CI must not fabricate their PASS.

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