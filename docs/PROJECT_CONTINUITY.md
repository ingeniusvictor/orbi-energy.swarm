# ORBI Energy Swarm — Project Continuity

> START HERE after any new chat/session, context loss or handoff.

Repository: `ingeniusvictor/orbi-energy.swarm`  
Last continuity update: 2026-10-14

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

`0c3f5c668926130f7ac8044cff8b619302949225`

Phase: **ES-13J4A — Pure Tactical Enemy Family Contract**  
Status: **DEPLOYED / FROZEN**  
Issue: #314 — CLOSED / completed  
PR: #315 — squash merged

Single parent: `998292cd40a3364aa7f22933b6312173956d3baa` — ES-13DOC14 documentation canonical.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J4A result
J4A established the first pure deterministic tactical-enemy vocabulary **without live adoption** and without introducing a parallel enemy catalog.

The repository already had six advanced `EnemyType` values. J4A certified only the four whose existing semantics already support a distinct tactical decision:
- `RIFT_HUNTER` → `WARP_AMBUSHER` — timing decision: read the lock/commit and dodge at the correct moment;
- `SIEGE_PRISM` → `ARTILLERY_CARRIER` — range-control decision: close/flank before its firing envelope controls the lane;
- `SWARM_REAVER` → `FORMATION_BREAKER` — priority decision: intercept before close-range disruption reaches swarm cohesion;
- `VOID_ANCHOR` → `JAMMER` — control-source decision: leave the denial radius or destroy the source.

`MINE_WEAVER` and `MIRROR_WARDEN` remain deliberately **DEFERRED** from the certified family contract. Their current runtime behavior does not yet justify claiming true mine-layer or mirror/reflection mechanics.

Final J4A files:
- `src/game/tacticalEnemyFamilies.ts`;
- `tests/gameplay/tactical-enemy-families.test.ts`;
- `tests/es-13j4a-tactical-enemy-contract.test.mjs`.

J4A guarantees:
- exactly four 1:1 family ↔ existing `EnemyType` mappings;
- immutable/frozen profiles and deterministic lookup;
- explicit tactical question, pressure class, telegraph, safe/counterplay intent, priority intent and control-pressure classification;
- unsupported/base/boss/deferred advanced types fail closed;
- no React/Canvas/audio/storage/network/RNG/wall-clock/timer authority;
- no Campaign/Infinite selection or live spawn authority;
- no entity/projectile collection ownership, full-array scan authority, support-entity creation or global-cap mutation;
- no stat multiplier tuning in the family contract;
- no `EnergySwarmGame.tsx`, `types.ts`, Campaign/Infinite descriptor, Android, package, public asset, score/economy/J1/J2/GAIA/FOTON GLB or player/FOTON formation change.

## J4A exact evidence
- baseline/docs canonical: `998292cd40a3364aa7f22933b6312173956d3baa`;
- pre-PR certified head: `8bbce75c6bbd6e1fbcb7205ed7bcb80d9121f767`;
- pre-PR certification run `38488019246`, job `115606272019` — GREEN across repository/gameplay/platform/typecheck/release/dossier/build/readiness/Android/APK/J4A scope guard;
- final clean PR head: `55a8abe0de9063b3d937ffca2f52ec9ec283309f`;
- PR CI `38488256442`, job `115607044338` — GREEN on exact final head;
- PR Android `38488256429`, job `115607044509` — GREEN on exact final head, including Build/Verify/Upload APK;
- squash gameplay canonical: `0c3f5c668926130f7ac8044cff8b619302949225`;
- main CI `38488402612`, job `115607525382` — GREEN on exact canonical;
- main Android `38488402647`, job `115607525424` — GREEN on exact canonical, including Build/Verify/Upload APK;
- main APK artifact `orbi-energy-swarm-debug-0c3f5c668926130f7ac8044cff8b619302949225`, artifact `11860492569`;
- Pages `38488489012` — build + deploy GREEN on exact canonical.

Temporary J4A certification workflow was branch-only and removed before the final PR diff.

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
- J3C-B — Controlled Live Advanced Formation Adoption: `5c345672b5365dbcc983403f73da62555489a98f`;
- J3D — Formation Telegraph/Fairness/Integration Certification: `7273d447bbdcb084499fb121122aac6d34928d41`;
- J4A — Pure Tactical Enemy Family Contract: `0c3f5c668926130f7ac8044cff8b619302949225`.

J3C-C stateful formation patterns remain **DEFERRED / NOT CURRENTLY JUSTIFIED**, not cancelled.

## Documentation canonicals
- DOC11: `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- DOC12: `f85e2432934454da191dea9bd0c9da43bbce86ca`;
- DOC13: `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- DOC14 — J3D closure & J4 activation: `998292cd40a3364aa7f22933b6312173956d3baa`;
- DOC15 — J4A closure & J4B activation: Issue #316, branch `docs/es-13-j4a-closure-j4b-activation`, documentation-only closure in progress from J4A canonical `0c3f5c668926130f7ac8044cff8b619302949225`.

## Next gameplay phase

### ES-13J4B — Narrow Live Tactical Enemy Adoption
Status: **NEXT ENGINEERING TARGET AFTER DOC15 CLOSURE**

Purpose: expose a deliberately bounded subset of the certified J4A tactical families through existing live enemy-selection/spawn/runtime seams without creating a second enemy authority or inflating density.

J4B must be designed from current runtime evidence before implementation. Required boundaries:
- reuse existing `EnemyType` values and their existing runtime behavior seams;
- reuse existing enemy array and standard spawn/capacity authority;
- no parallel enemy collection/director solely for tactical families;
- no new global caps or simulation-budget increase;
- no uncontrolled projectile or support-entity multiplication;
- explicit Campaign/Infinite policy — never silently enable the same tactical pressure in both modes;
- hard-control families (`FORMATION_BREAKER` / `JAMMER`) require especially conservative eligibility and fairness;
- preserve existing Infinite evolved-enemy authority as a separate system;
- preserve J3 enemy-formation ownership and player/FOTON formation ownership separation;
- severe pressure must remain telegraphed and counterable;
- `MINE_WEAVER` / `MIRROR_WARDEN` remain outside J4B unless a later dedicated contract genuinely implements their promised mechanics.

The next issue should choose the smallest live subset and prove what new decision it creates in actual progression before broader family adoption.

## Resolved diagnostics
- #254 CLOSED / NOT PLANNED: historical platform failure was not an I5 pause regression; no product merge.
- #283 CLOSED / NOT PLANNED: stale-chat false start; no branch/product work.

## Frozen manual/physical blockers
Still OPEN and intentionally deferred while ES-13 changes gameplay:
- #4 — visual/responsive certification;
- #5 — Infinite play-feel;
- #202 — GAIA physical runtime/performance;
- #248 — Android real-device certification.

CI is never a substitute for required human/device evidence.

## Mandatory workflow
`Issue → branch from exact live main → implementation/tests → repo/gameplay/platform/typecheck/release/dossier/build/readiness → PR → PR CI GREEN + Android GREEN when applicable → squash merge → exact-SHA main CI GREEN + Android GREEN when applicable + Pages GREEN`

Rules:
- never modify `main` directly;
- correction before speed;
- never weaken tests merely to pass;
- remove temporary certification workflows/scripts/diagnostics before final PR diff;
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES`, entity arrays and simulation budgets unless a dedicated demonstrated change requires otherwise;
- preserve Campaign/Infinite isolation where scoped;
- no FOTON GLB change without explicit scope;
- no gameplay phase is declared deployed before exact-SHA required evidence.

## Gameplay chronology
`J4B Narrow Live Tactical Adoption → J4C+ Additional Tactical Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read this file, `IMPLEMENTATION_LEDGER.md`, `ES13_GAMEPLAY_ROADMAP.md`, `TRACEABILITY_POLICY.md` and `ES13_PHASE_CHECKLIST.md`, then active Issues/PRs. Verify live `main` before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J4A gameplay canonical is `0c3f5c668926130f7ac8044cff8b619302949225`, fully deployed/frozen. Complete DOC15 if still open, then design J4B from the actual live spawn/runtime architecture before changing code. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, final head, pre-PR certification, PR CI/Android, main CI/Android/Pages, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.
