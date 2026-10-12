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

`3c5ece8d8e59bc38de468b4d0d9644953fa6a8be`

Phase: **ES-13J3A — Pure Enemy Formation Route Contract**  
Status: **DEPLOYED / FROZEN**  
Issue: #294 — CLOSED  
PR: #295 — squash merged

Single parent: `40bff2cb7b2d109cb13bf1142c76e0238e1d0d19` — ES-13DOC9 documentation canonical.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J3A implementation summary
J3A introduced a pure deterministic enemy-route projection contract and deliberately did **not** adopt it into the live runtime.

Files:
- `src/game/enemyFormationRoutes.ts`;
- `tests/gameplay/enemy-formation-routes.test.ts`;
- `tests/es-13j3a-enemy-formation-route-contract.test.mjs`.

Certified contract:
- initial enemy route vocabulary: `PINCER`, `X_CROSS`, `SERPENTINE`;
- caller owns `route`, `memberIndex`, `memberCount`, normalized `progress` and deterministic `mirror`;
- output exposes finite bounded normalized position, route phase, member role and explicit telegraph metadata;
- local route-member cap is 8 and does not alter `MAX_ENEMIES` or runtime concurrency;
- normalized route extent is bounded to ±1.25;
- exact route phases are derived from caller progress only: ENTRY, PRESSURE, EXIT, COMPLETE;
- invalid route/count/slot/progress/mirror values fail closed;
- caller inputs remain immutable;
- no import/runtime/entity-array ownership;
- no `Math.random`, wall clock, RAF, timers, storage, audio or network authority;
- no Campaign/Infinite selection inside the pure contract;
- no projectile, score, damage, economy, spawn-budget or concurrency tuning;
- no changes to `EnergySwarmGame.tsx`, `types.ts`, runtime descriptors or wave recipes;
- no changes to J1/J2, GAIA or FOTON GLB;
- `src/game/formations.ts` and `formationCycle.ts` remain the separate **player/FOTON swarm** formation authority and were untouched.

Tactical meaning:
- PINCER asks the player to read converging flanks and escape before closure;
- X_CROSS asks the player to time diagonal crossing lanes;
- SERPENTINE asks the player to track a moving corridor instead of camping a static lane.

## J3A exact evidence
- pre-PR certified head `685d0c498615a35f659cf8f7c8b231c85a8e6e0e`;
- pre-PR certification run `38310490857`, job `115014740153` — GREEN;
- final clean PR head `5e01e4d21bf1cdc185a8755e16006a2ee70ca89c`;
- PR CI `38310847060` — GREEN on exact final PR head;
- PR Android `38310847054` — GREEN on exact final PR head;
- squash canonical `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be`;
- main CI `38310975108` — GREEN on exact canonical;
- main Android `38310975021` — GREEN on exact canonical;
- Pages `38311040652` — build + deploy GREEN on exact canonical.

Temporary J3A certification workflow was branch-only and removed before PR.

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
- J3A — Pure Enemy Formation Route Contract: `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be`.

## Resolved diagnostics
- #254 CLOSED / NOT PLANNED: historical platform failure was not an I5 pause regression; no product merge.
- #283 CLOSED / NOT PLANNED: stale-chat false start; no branch/product work.

## Current administrative work
Issue #296 — `ES-13DOC10 — J3A Closure Ledger & J3B Activation`  
Branch: `docs/es-13-j3a-closure-j3b-activation`  
Baseline gameplay canonical: `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be`  
Scope: documentation only.

## Next gameplay phase

### ES-13J3B — Live Enemy Formation Director Adoption
Status: **ACTIVE / NEXT ENGINEERING TARGET AFTER DOC10 CLOSURE**

Purpose: make a deliberately narrow subset of ordinary enemies consume the certified J3A route projection through existing spawn/movement authority, without creating a parallel runtime or increasing pressure budgets.

Required design before implementation:
- preserve existing `enemiesRef.current` as the single enemy entity array;
- do not add a second full-array scan solely for formations;
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES`, descriptor `maxConcurrentEnemies`, entity arrays and simulation budgets;
- keep Campaign/Infinite adoption explicit and isolated; no silent recipe drift;
- keep boss/miniboss/special systems out of the first live slice unless existing architecture proves they share the exact same safe seam;
- route assignment may be selected at spawn, but after assignment route evolution must be deterministic and caller-owned;
- use simulation time/progress already owned by the game; no wall clock/RAF side authority;
- add only the minimum per-enemy metadata necessary to identify formation route/slot/group/progress origin, or an equally bounded caller-owned mapping if that avoids type pollution;
- formation movement must replace/shape existing movement for opted-in enemies rather than stacking another velocity engine on top;
- route projection is normalized and must be materialized through the current camera/playfield coordinate authority;
- reset/restart/pause must leave no stale formation ownership;
- telegraph metadata from J3A remains data-only in J3B unless a minimal live safety indicator is required for fairness; presentation polish belongs later;
- player/FOTON `formations.ts` and `formationCycle.ts` remain completely separate authorities;
- no J1/J2, GAIA, FOTON GLB, score, economy, damage or projectile tuning changes.

Recommended first adoption slice: one bounded formation group at a time, only among regular enemies, using existing spawn capacity rather than reserving or adding entities. The group should be cancelled/fall back safely if there is insufficient remaining enemy capacity.

## Later J3 slices
- **J3C — Advanced Formation Vocabulary:** expand beyond the certified initial routes only when each new pattern creates a distinct tactical decision;
- **J3D — Telegraph / Fairness / Integration Certification:** certify warnings, recovery space, pause/restart/determinism, long-run safety, performance and exact-SHA deployment.

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
`J3 Advanced Formations → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read this file, `IMPLEMENTATION_LEDGER.md`, `ES13_GAMEPLAY_ROADMAP.md`, then active Issues/PRs. Verify live `main` before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. Read continuity/ledger/roadmap, verify live `main` and active Issues/PRs, then follow Issue → Branch → gates → PR → exact-SHA main/Android/Pages. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, run IDs, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.