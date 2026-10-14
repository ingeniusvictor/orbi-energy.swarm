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

`4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6`

Phase: **ES-13J4C-A — Pure Siege Volley Telegraph Contract**  
Status: **DEPLOYED / FROZEN**  
Issue: #322 — CLOSED / completed  
PR: #323 — squash merged

Single parent: `56aca8a129be9310f64bb04a99fb19560b52b2e3` — ES-13DOC16 documentation canonical.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J4C-A result
J4C-A solved the fairness contract before broadening `SIEGE_PRISM` progression. The new pure `siegeVolleyTelegraph.ts` state machine has no live runtime authority and defines:
- phases `IDLE → TELEGRAPH → COMMIT`;
- a fixed 700 ms simulation-time reaction window;
- finite target coordinates locked at telegraph start;
- exact-boundary/overshoot commit emitted once only;
- COMMIT latched until explicit acknowledgement;
- projection vocabulary `SIEGE_VOLLEY` + `BREAK_ARTILLERY_ENVELOPE`;
- fail-closed invalid target/delta handling;
- zero spawn/entity/projectile collection, full-array scan, global-cap, support-entity or cooldown-RNG authority.

J4C-A intentionally did **not** touch `EnergySwarmGame.tsx`, `EnergySwarmCanvas.tsx`, `types.ts`, progression/spawn selection, `SIEGE_CATHEDRAL` support composition, projectile count/speed/spread/cooldown, Android/package/docs/assets or global caps.

This matters because `SIEGE_PRISM` is already live as `SIEGE_CATHEDRAL` support (max 2), while its current runtime fires immediately when cooldown expires. J4C-B can now adopt a certified fairness seam into that existing context before any additional normal-progression SIEGE appearance.

## J4C-A exact evidence
- baseline/docs canonical: `56aca8a129be9310f64bb04a99fb19560b52b2e3`;
- pre-PR certified head `d4963c8d435996adf39e6df582ba7c15540d3ab9`, run `38492253039`, job `115619974269` — GREEN including Android/APK/J4C-A scope guard;
- final clean PR head `1724dc4fd199e7be50f1110c7606d54bbe2b1543`;
- PR CI `38492465605`, job `115620646548` — GREEN on exact final head;
- PR Android `38492465573`, job `115620646615` — GREEN on exact final head including Build/Verify/Upload APK;
- squash gameplay canonical `4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6`;
- main CI `38492584499`, job `115621028391` — GREEN on exact canonical;
- main Android `38492584516`, job `115621028451` — GREEN on exact canonical including Build/Verify/Upload APK;
- Pages `38492658345` — build job `115621262106` + deploy job `115621344438`, both GREEN on exact canonical.

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
- J4C-A — Pure Siege Volley Telegraph Contract: `4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6`.

J3C-C stateful formation patterns remain **DEFERRED / NOT CURRENTLY JUSTIFIED**, not cancelled.

## Documentation canonicals
- DOC11: `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- DOC12: `f85e2432934454da191dea9bd0c9da43bbce86ca`;
- DOC13: `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- DOC14 — J3D closure & J4 activation: `998292cd40a3364aa7f22933b6312173956d3baa`;
- DOC15 — J4A closure & J4B activation: `096b2c9fe53551664b56baf6e382368f8b4078da` — Issue #316 / PR #317;
- DOC16 — J4B closure & J4C activation: `56aca8a129be9310f64bb04a99fb19560b52b2e3` — Issue #320 / PR #321;
- DOC17 — J4C-A closure & J4C-B activation: Issue #324, branch `docs/es-13-j4c-a-closure-j4c-b-activation`, documentation-only closure in progress from gameplay canonical `4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6`.

## Next gameplay phase

### ES-13J4C-B — Live Siege Volley Telegraph Integration
Status: **NEXT ENGINEERING TARGET AFTER DOC17 CLOSURE**

Adopt the certified J4C-A contract into existing `SIEGE_PRISM` instances, including `SIEGE_CATHEDRAL` support, without broadening normal Campaign/Infinite SIEGE progression.

Required behavior:
- each live SIEGE owns only its bounded telegraph state; no second enemy collection/director;
- when the existing SIEGE cooldown becomes ready, lock the current finite player position and start the certified 700 ms telegraph instead of firing immediately;
- render a clear world-space visual cue to the locked target and explicit `SIEGE_VOLLEY` readability;
- fire the existing three-projectile SIEGE spread only on the single COMMIT edge through existing `shootFromEnemy` and projectile-budget authority;
- acknowledge/reset exactly once and then resume the existing randomized cooldown;
- no target tracking after lock and no duplicate shot during COMMIT;
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES`, SIEGE projectile count/speed/spread, boss support count/cooldown and all normal progression selection.

J4C-B must explicitly test the `SIEGE_CATHEDRAL` support context. Normal-progression SIEGE adoption remains a later dedicated slice after live fairness is exact-SHA certified. Hard-control families and mine/mirror semantics remain deferred.

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
`J4C-B Live Siege Volley Integration → J4C-C Controlled Siege Progression → J4D+ Additional Tactical Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read this file, `IMPLEMENTATION_LEDGER.md`, `ES13_GAMEPLAY_ROADMAP.md`, `TRACEABILITY_POLICY.md` and `ES13_PHASE_CHECKLIST.md`, then active Issues/PRs. Verify live `main` before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J4C-A gameplay canonical is `4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6`, fully deployed/frozen. Complete DOC17 if still open, then implement J4C-B by integrating the certified 700 ms target-locked Siege Volley into existing SIEGE instances including Siege Cathedral support, without broadening progression. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, final head, pre-PR certification, PR CI/Android, main CI/Android/Pages, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.
