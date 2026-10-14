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

`1023cee74d1c32a379bf542551397ae134f43573`

Phase: **ES-13J4B — Narrow Live Warp Ambusher Adoption**  
Status: **DEPLOYED / FROZEN**  
Issue: #318 — CLOSED / completed  
PR: #319 — squash merged

Single parent: `096b2c9fe53551664b56baf6e382368f8b4078da` — ES-13DOC15 documentation canonical.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J4B result
J4B adopted exactly one certified tactical family into live progression: `RIFT_HUNTER` → `WARP_AMBUSHER`.

Live policy is deliberately sparse and mode-isolated:
- Campaign remains disabled;
- Infinite only, minimum sector 26;
- milestone sectors and recovery sectors are excluded;
- eligibility cadence is `(sector - 10) % 4 === 0`;
- only the final wave of an eligible sector may select it;
- exactly one deterministic existing spawn-budget ordinal is replaced;
- first reachable live tactical sector is 34;
- no enemy, spawn event, timer, collection, cap or budget was added.

Fairness/isolation guarantees:
- the tactical spawn cannot receive the generic random-elite overlay;
- Infinite evolved-enemy selection already excludes `RIFT_HUNTER`;
- J3 live formations remain limited to CRAWLER/SPLITTER, so tactical + formation stacking cannot occur;
- the existing `RIFT LOCK` telegraph precedes the committed dash and preserves counterplay;
- `SIEGE_PRISM`, `SWARM_REAVER`, `VOID_ANCHOR`, `MINE_WEAVER` and `MIRROR_WARDEN` were not activated by J4B.

Final J4B product diff exactly:
- `src/game/EnergySwarmGame.tsx` (+10 lines only);
- `src/game/runtimeTacticalEnemyAdoption.ts`;
- `tests/gameplay/runtime-tactical-enemy-adoption.test.ts`;
- `tests/es-13j4b-live-tactical-adoption.test.mjs`.

## J4B exact evidence
- baseline/docs canonical: `096b2c9fe53551664b56baf6e382368f8b4078da`;
- pre-PR certified head `d758c4a38575002b6a59242f2894fc4e8e235fb0`, run `38489976346`, job `115612611028` — GREEN including Android/APK/J4B scope guard;
- final clean PR head `5a29b7af53b9f62b017c54cde7ed87e00c04216b`;
- PR CI `38490183094`, job `115613270626` — GREEN on exact final head;
- PR Android `38490183041`, job `115613270479` — GREEN on exact final head including Build/Verify/Upload APK;
- squash gameplay canonical `1023cee74d1c32a379bf542551397ae134f43573`;
- main CI `38490426895`, job `115614058362` — GREEN on exact canonical;
- main Android `38490426903`, job `115614058464` — GREEN on exact canonical including Build/Verify/Upload APK;
- Pages `38490505690` — build job `115614310963` + deploy job `115614421521`, both GREEN on exact canonical.

The first temporary J4B runtime-patch attempt failed closed on an indentation-sensitive elite-guard matcher; it made no partial product write. The temporary matcher was corrected, the exact +10-line runtime seam was applied, and all temporary patch/certification workflows were removed before PR #319.

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
- J4B — Narrow Live Warp Ambusher Adoption: `1023cee74d1c32a379bf542551397ae134f43573`.

J3C-C stateful formation patterns remain **DEFERRED / NOT CURRENTLY JUSTIFIED**, not cancelled.

## Documentation canonicals
- DOC11: `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- DOC12: `f85e2432934454da191dea9bd0c9da43bbce86ca`;
- DOC13: `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- DOC14 — J3D closure & J4 activation: `998292cd40a3364aa7f22933b6312173956d3baa`;
- DOC15 — J4A closure & J4B activation: `096b2c9fe53551664b56baf6e382368f8b4078da` — Issue #316 / PR #317;
- DOC16 — J4B closure & J4C activation: Issue #320, branch `docs/es-13-j4b-closure-j4c-activation`, documentation-only closure in progress from J4B canonical `1023cee74d1c32a379bf542551397ae134f43573`.

## Next gameplay phase

### ES-13J4C — Next Bounded Tactical Family Slice
Status: **NEXT ENGINEERING TARGET AFTER DOC16 CLOSURE**

J4C must not simply enable the remaining J4A families. It must inspect live runtime semantics first and choose the smallest next family whose promised telegraph and counterplay are demonstrably real.

Current direction:
- `SIEGE_PRISM` / `ARTILLERY_CARRIER` is the leading candidate only if its runtime first gains or certifies the explicit readable artillery telegraph promised by J4A (`SIEGE_VOLLEY`);
- `SWARM_REAVER` / `FORMATION_BREAKER` and `VOID_ANCHOR` / `JAMMER` remain deferred because they apply harder control pressure and require independent spacing/recovery fairness proof;
- `MINE_WEAVER` / `MIRROR_WARDEN` remain outside the certified J4 family contract until dedicated pure contracts implement genuine mine/mirror semantics;
- no new `EnemyType`, parallel enemy authority, density increase, cap/budget increase or FOTON GLB change is justified by J4C itself.

The first J4C issue must prove the next family creates a distinct player decision and a readable pre-commit cue before any broader live adoption.

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
`J4C Bounded Tactical Family Slice → J4D+ Additional Tactical Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read this file, `IMPLEMENTATION_LEDGER.md`, `ES13_GAMEPLAY_ROADMAP.md`, `TRACEABILITY_POLICY.md` and `ES13_PHASE_CHECKLIST.md`, then active Issues/PRs. Verify live `main` before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J4B gameplay canonical is `1023cee74d1c32a379bf542551397ae134f43573`, fully deployed/frozen. Complete DOC16 if still open, then inspect the actual SIEGE_PRISM/runtime telegraph path before opening J4C. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, final head, pre-PR certification, PR CI/Android, main CI/Android/Pages, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.
