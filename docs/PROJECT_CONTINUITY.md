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

`2e16ff9a577128ffb06211b612116553928c8cda`

Phase: **ES-13J4C-B — Live Siege Volley Telegraph Integration**
Status: **DEPLOYED / FROZEN**  
Issue: #326 — CLOSED / completed
Delivery: PR #327 + exact-scope remediation PR #328 — squash merged

Single parent: `8dec7945338e0152e83536605b18da63879818fe` — initial J4C-B merge prior to exact-scope remediation.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J4C-B result
J4C-B adopted the certified J4C-A 700 ms target-lock telegraph into every existing `SIEGE_PRISM`, including `SIEGE_CATHEDRAL` support, without broadening normal Campaign/Infinite progression.

Certified live behavior:
- cooldown readiness starts the 700 ms simulation-time telegraph instead of immediate fire;
- target coordinates lock once at telegraph start and do not track afterward;
- COMMIT remains latched when projectile cap/budget prevents creation;
- ACK occurs only after existing projectile authority actually creates the volley;
- only after ACK is telegraph state cleared and the existing randomized cooldown restored;
- three projectiles, speed `4.0`, spread `0.12` and cooldown `150 + Math.random() * 70` remain unchanged;
- `MAX_ENEMIES`, `MAX_PROJECTILES`, hostile projectile budget, entity arrays and `SIEGE_CATHEDRAL` support policy remain authoritative;
- no second projectile authority, enemy collection/director, full-array family scan or progression expansion was introduced;
- J4C-A `siegeVolleyTelegraph.ts` remains untouched.

PR #327 initially carried one historical certification-file adaptation beyond the approved six-file product scope. Fail-closed audit reopened #326; remediation PR #328 restored `tests/runtime-combat-pressure-adoption.test.ts` to its pre-J4C-B tree state and preserved equivalent runtime semantics inside allowed `EnergySwarmGame.tsx`. Final `19beb0abf2b17d391834cb6336419ed4ead6819c...2e16ff9a577128ffb06211b612116553928c8cda` diff is exactly the six approved J4C-B files.

## J4C-B exact evidence
- DOC17 baseline `19beb0abf2b17d391834cb6336419ed4ead6819c`;
- original J4C-B PR #327 final head `3360e5e8d63bfb6cbc55d2833cd9c6a97460613e`;
- PR #327 CI `38499422999` / `115642582715` GREEN; Android `38499423099` / `115642582029` GREEN;
- initial merge `8dec7945338e0152e83536605b18da63879818fe` was not accepted as final frozen canonical because its permanent diff had seven files;
- remediation pre-PR SHA `b5a768e919b9a75fb71a1a627bc521f74661a13b`, run `38506960989` / job `115666560063` GREEN including Platform, Android/APK and six-file scope guard;
- remediation PR #328 final head `bba0fa7a94cd45084c55149f80714dd1155a5baa`;
- PR #328 CI `38507157523` / `115667172988` GREEN; Android `38507157492` / `115667172667` GREEN including Build/Verify/Upload APK;
- canonical `2e16ff9a577128ffb06211b612116553928c8cda`, parent `8dec7945338e0152e83536605b18da63879818fe`, tree `8435b068908d82225b5442c8865578c46fedc243` equal to final PR head tree;
- main CI `38507278577` / `115667552196` GREEN;
- main Android `38507278528` / `115667552109` GREEN including Build/Verify/Upload APK;
- Pages `38507354839`: build `115667791913` + deploy `115667881614` GREEN.

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
- J4C-B — Live Siege Volley Telegraph Integration: `2e16ff9a577128ffb06211b612116553928c8cda`.

J3C-C stateful formation patterns remain **DEFERRED / NOT CURRENTLY JUSTIFIED**, not cancelled.

## Documentation canonicals
- DOC11: `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- DOC12: `f85e2432934454da191dea9bd0c9da43bbce86ca`;
- DOC13: `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- DOC14 — J3D closure & J4 activation: `998292cd40a3364aa7f22933b6312173956d3baa`;
- DOC15 — J4A closure & J4B activation: `096b2c9fe53551664b56baf6e382368f8b4078da` — Issue #316 / PR #317;
- DOC16 — J4B closure & J4C activation: `56aca8a129be9310f64bb04a99fb19560b52b2e3` — Issue #320 / PR #321;
- DOC17 — J4C-A closure & J4C-B activation: `19beb0abf2b17d391834cb6336419ed4ead6819c` — Issue #324 / PR #325;
- DOC18 — J4C-B closure & J4C-C activation: Issue #329, branch `docs/es-13-j4c-b-closure-j4c-c-activation`, documentation-only closure in progress from gameplay canonical `2e16ff9a577128ffb06211b612116553928c8cda`.

## Next gameplay phase

### ES-13J4C-C — Controlled Normal-Progression Siege Adoption
Status: **NEXT ENGINEERING TARGET AFTER DOC18 CLOSURE**

J4C-C may broaden where the certified `SIEGE_PRISM / ARTILLERY_CARRIER` appears, but must not alter J4C-B firing/fairness behavior. Its gameplay issue must inspect current Campaign/Infinite spawn policy and prove a bounded progression policy before changing selection.

Required direction:
- prefer a narrow Infinite-only candidate unless runtime evidence independently justifies Campaign;
- deterministically replace an existing spawn opportunity/budget rather than add density;
- preserve J4C-B 700 ms target lock, COMMIT latch, projectile-authority ACK and post-ACK cooldown semantics;
- preserve `SIEGE_CATHEDRAL` support composition/count/cooldown;
- preserve caps, projectile budget, entity arrays, projectile count/speed/spread/cooldown;
- no new `EnemyType`, parallel collection/director, family-only full-array scan or independent timer/RNG authority;
- keep evolved-enemy and J3 enemy-formation authorities isolated.

`FORMATION_BREAKER` and `JAMMER` remain deferred pending independent hard-control spacing/recovery proof. `MINE_WEAVER` and `MIRROR_WARDEN` remain deferred until genuine mine/mirror mechanics exist. J3C-C remains deferred, not cancelled.

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
`J4C-C Controlled Siege Progression → J4D+ Additional Tactical Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read this file, `IMPLEMENTATION_LEDGER.md`, `ES13_GAMEPLAY_ROADMAP.md`, `TRACEABILITY_POLICY.md` and `ES13_PHASE_CHECKLIST.md`, then active Issues/PRs. Verify live `main` before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J4C-B gameplay canonical is `2e16ff9a577128ffb06211b612116553928c8cda`, fully DEPLOYED / FROZEN with exact six-file historical scope after PR #328 remediation. Complete DOC18 if still open, then implement J4C-C Controlled Normal-Progression Siege Adoption only after runtime spawn-policy analysis proves a bounded policy. Preserve the certified J4C-B telegraph/projectile semantics and all caps/budgets. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, final head, pre-PR certification, PR CI/Android, main CI/Android/Pages, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.
