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

`bf0e6a858e3c96091c002ea623b29eb5c260c6ea`

Phase: **ES-13J2E — Overdrive Integration Certification**  
Status: **DEPLOYED / FROZEN**  
Issue: #290 — CLOSED  
PR: #291 — squash merged

Single parent: `95beb172e845794d03484e446128896a44428996` — ES-13DOC8 documentation canonical.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J2E implementation / certification summary
- J2E remained certification-only: no runtime/gameplay source changed;
- final gameplay diff added exactly two certification files:
  - `tests/gameplay/overdrive-integration.test.ts`;
  - `tests/es-13j2e-overdrive-integration-adoption.test.mjs`;
- deterministic integration proves mixed-affinity J1 Resonance can reach readiness, activate J2 exactly once and consume readiness once;
- J1 score projection remains the sole score multiplier authority;
- J2C contributes exactly one bounded player-damage multiplier and cannot stack/refresh through repeated activation;
- J2D remains projection/presentation-only and introduces no gameplay authority;
- certified exact J2A timing remains 8 s active + 4 s re-entry lock on simulation time;
- repeated activation while active cannot extend or refresh duration;
- accepted player damage still applies the J1 Resonance break while active J2 timing remains independent;
- fresh-run reset returns both Resonance and Overdrive to exact initial states;
- pause/photo/lifecycle source contracts prove paused branches do not advance Overdrive simulation time;
- long deterministic sequences keep chain/resonance/Overdrive/damage/presentation finite and bounded;
- live adoption contracts prove J2B/J2C/J2D consume their certified pure modules at intended seams without importing/duplicating tuning constants;
- no duration/re-entry/damage/score/fire-rate/projectile-count/speed/crit/cap/budget/Campaign/Infinite/FOTON GLB/GAIA tuning changes.

## J2E exact evidence
- pre-PR certified head `eba9a30f627875103f53a49e27069eff2a3c3861`;
- pre-PR certification run `38303651696`, job `114992339524` — GREEN;
- final clean PR head `0dcd9b4533976a43f872d6b070607076c6336b48`;
- PR CI `38308946054` — GREEN on exact final PR head;
- PR Android `38309446296` — GREEN on exact final PR head; dispatched explicitly because the normal Android pull-request path filter excludes tests-only changes;
- squash canonical `bf0e6a858e3c96091c002ea623b29eb5c260c6ea`;
- main CI `38309074528` — GREEN on exact canonical;
- main Android `38309218634` — GREEN on exact canonical; dispatched explicitly because the normal Android push path filter excludes tests-only changes;
- Pages `38309135916` — build + deploy GREEN on exact canonical.

The temporary dispatch helpers were branch-only and removed after use; no certification workflow was merged into `main`.

## ES-13 gameplay canonicals
- J1A — Combat Chain & Resonance Core: `feb263957b52839d35a7cb1249762c223ba22595`;
- J1B — Live Combat Resonance Adoption & HUD: `91564e365d0a2220e4db2999e38372809ec397f3`;
- J2A — Overdrive Pure State Contract: `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`;
- J2B — Live Overdrive Activation & HUD: `466242e91fa927bc4d996d09efdbb87f8f572d44`;
- J2C-A — Pure Bounded Overdrive Combat Expression: `eca68cce510cf506053fd6d9121b501db7cd1f64`;
- J2C-B — Live Bounded Overdrive Damage Adoption: `7e15ee1e79ee9ae8903891a66b0b1031b0600bca`;
- J2D-A — Pure Overdrive Presentation Profile: `39f9b33c9a229c7c8d991aecd81ea695510c82a0`;
- J2D-B — Live Reactive Overdrive Presentation: `9743890d98b33d365cbc18a048015f3815b144e5`;
- J2E — Overdrive Integration Certification: `bf0e6a858e3c96091c002ea623b29eb5c260c6ea`.

## Resolved diagnostics
- #254 CLOSED / NOT PLANNED: forensic reproduction proved the historical platform failure was not an I5 pause regression; no product merge.
- #283 CLOSED / NOT PLANNED: opened from stale chat state after a UI interruption; no branch/product work.

## Current administrative work
Issue #292 — `ES-13DOC9 — J2E Closure Ledger & J3 Activation`  
Branch: `docs/es-13-j2e-closure-j3-activation`  
Baseline gameplay canonical: `bf0e6a858e3c96091c002ea623b29eb5c260c6ea`  
Scope: documentation only.

## Next gameplay phase

### ES-13J3 — Advanced Enemy Formation Director
Status: **ACTIVE / NEXT ENGINEERING TARGET AFTER DOC9 CLOSURE**

Purpose: create tactical movement/route decisions that make enemy pressure spatially interesting without increasing global entity/projectile budgets.

Recommended decomposition:
- **J3A — Pure Formation Route Contract:** deterministic, caller-owned formation/route plans with bounded member slots, normalized path/progress inputs, explicit telegraph metadata and no renderer/entity ownership;
- **J3B — Live Formation Director Adoption:** consume J3A at existing spawn/movement seams while preserving Campaign/Infinite recipes, `MAX_ENEMIES`, `MAX_PROJECTILES`, entity arrays and simulation budgets;
- **J3C — Advanced Formation Vocabulary:** add selected tactics such as pincers, wedges, X-cross, spirals/corkscrews, serpentine/convoy/orbit/encirclement/fake-retreat/portal routes only when each creates a distinct player decision;
- **J3D — Telegraph / Fairness / Integration Certification:** certify readable warnings, bounded simultaneous pressure, pause/restart/determinism, long-run safety, performance and exact-SHA deployment.

Before implementing J3A, inspect the existing formation/spawn/movement authorities and choose the smallest pure contract that can extend them without parallel state machines or new scans.

Design constraints:
- formation complexity must come from route/state coordination, not more enemies or projectiles;
- severe crossings/encirclement/ambushes require readable telegraphs and recovery space;
- deterministic inputs and reproducible failures are preferred;
- no silent Campaign/Infinite tuning drift;
- no FOTON GLB or GAIA tuning changes;
- no change to J1/J2 contracts unless a demonstrated regression gets its own corrective issue.

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