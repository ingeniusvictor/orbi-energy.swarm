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

`df60f62565a1d3cdf6058d2e1a4049f5870f27b7`

Phase: **ES-13J5A — Pure Priority-Target Contract**
Status: **DEPLOYED / FROZEN**
Issue: #335 — CLOSED / completed
Delivery: PR #336 — squash merged

Single parent: `907bce8c494a5c7b9a4965e09dca677d919560f4` — DOC19 documentation canonical.

Canonical tree: `8296313607b688bef5412fcb046341e609852ce4`, exactly equal to final PR-head tree.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J4C-C result
J4C-C adopted the already-certified `ARTILLERY_CARRIER / SIEGE_PRISM` family into bounded normal Infinite progression through the existing tactical replacement seam.

Certified live behavior:
- Campaign remains disabled;
- normal SIEGE adoption begins in Infinite HIGH_PRESSURE progression with minimum sector 51;
- deterministic cadence is `(sector - 52) % 8 === 0`;
- milestone and recovery sectors remain excluded;
- adoption is final-wave-only with a null milestone descriptor;
- exactly one existing spawn-budget ordinal, `Math.floor(enemyBudget / 2)`, is replaced; density does not increase;
- J4B RIFT cadence remains unchanged and is mathematically disjoint from SIEGE cadence;
- first reachable normal SIEGE sectors are 52, 68, 84, 92, 108, 116, 124, 132...;
- sector 100 `SIEGE_CATHEDRAL` remains excluded from normal tactical adoption;
- J4C-B 700 ms target-lock / COMMIT / ACK Siege Volley authority remains unchanged;
- three projectiles, speed `4.0`, spread `0.12`, cooldown `150 + Math.random() * 70`, `MAX_ENEMIES`, `MAX_PROJECTILES`, hostile projectile budget and entity arrays remain unchanged;
- `SIEGE_CATHEDRAL` support remains `SIEGE_PRISM`, max count 2, cooldown 8000 ms;
- evolution, generic elite overlay and J3 formation authorities remain isolated from tactical SIEGE;
- no new `EnemyType`, collection, director, family-only full-array scan, independent timer or RNG authority was introduced.

The first pre-certification exposed one historical J4C-B static assertion that correctly forbade normal SIEGE progression during J4C-B. J4C-C updated that test without weakening the frozen J4C-B boundary: the tactical adoption seam may select SIEGE but remains forbidden from acquiring volley/projectile/cooldown authority.

## J4C-C exact evidence
- DOC18 baseline `72c4359af106d6f955e9932c6c72a836b2922ab8`;
- pre-PR SHA `c6dc7dc48dd8028dd6de1f6f9fae79a2d20b6301`, run `38556345439` / job `115826341912` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact product-scope guard and Android APK build/verify/upload;
- final PR #332 head `e80a54c9823939862beba6a620e4ed363535b61e`;
- PR CI `38556750449` / `115827692257` GREEN;
- PR Android `38556750462` / `115827691810` GREEN including Build/Verify/Upload APK;
- canonical `1131c06db406ca0170d5dad33ecb7f4610a06b96`, single parent `72c4359af106d6f955e9932c6c72a836b2922ab8`, tree `ff27ceedc5460d98fefe373850d1fe20e3272098` equal to final PR head tree;
- canonical diff exactly five certified product files;
- main CI `38556901537` / `115828194301` GREEN;
- main Android `38556901696` / `115828194800` GREEN including Build/Verify/Upload APK;
- Pages `38557000846`: build `115828516452` + deploy `115828677107` GREEN.

Issue #331 CLOSED / completed. J4C-C is **DEPLOYED / FROZEN**.

## J5A result
J5A established the first pure Priority Target contract without creating a new live enemy authority.

Certified contract:
- exactly one immutable semantic profile: `COMMAND_CORE` / `Command Core`;
- tactical intent `FOCUS_CORE_TO_BREAK_LINK` with priority `HIGH`;
- objective `BREAK_COMMAND_LINK`;
- deterministic defeat projection `COMMAND_LINK_BROKEN`;
- effect mode `SIGNAL_ONLY`;
- unsupported profile identifiers fail closed;
- objective explicitly applies no damage, kills no linked targets, awards no score/reward and mutates no formation;
- shared authority contract owns no spawn, entity/projectile collection, damage, defeat, score, reward, formation, clock, RNG, full-array scan, cap mutation or entity creation;
- no new `EnemyType`, no runtime field and no live import/adoption in `EnergySwarmGame.tsx`;
- J3 formation authority, J4 tactical families, FOTON GLB and player/FOTON formations remain isolated.

Final product scope exactly:
- `src/game/priorityTargetContract.ts`;
- `tests/es-13j5a-priority-target-contract.test.mjs`;
- `tests/gameplay/priority-target-contract.test.ts`.

## J5A exact evidence
- DOC19 baseline `907bce8c494a5c7b9a4965e09dca677d919560f4`;
- pre-PR SHA `257cfb8dd7a21a046cf87c2c2af9b501e462f3ad`, run `38559123546` / job `115835528447` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact product-scope guard and Android APK build/verify/upload;
- final PR #336 head `72ea40a2935df0d3bbf7b4db45be5a8647380524`;
- PR CI `38559564286` / `115836993908` GREEN;
- PR Android `38559564155` / `115836993731` GREEN including Build/Verify/Upload APK;
- canonical `df60f62565a1d3cdf6058d2e1a4049f5870f27b7`, single parent `907bce8c494a5c7b9a4965e09dca677d919560f4`, tree `8296313607b688bef5412fcb046341e609852ce4` equal to final PR-head tree;
- canonical diff exactly three certified product files;
- main CI `38559826229` / `115837852423` GREEN;
- main Android `38559826354` / `115837852853` GREEN including Build/Verify/Upload APK;
- Pages `38559959364`: build `115838294773` + deploy `115838455401` GREEN.

Issue #335 CLOSED / completed. J5A is **DEPLOYED / FROZEN**.

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
- J4C-C — Controlled Normal-Progression Siege Adoption: `1131c06db406ca0170d5dad33ecb7f4610a06b96`.
- J5A — Pure Priority-Target Contract: `df60f62565a1d3cdf6058d2e1a4049f5870f27b7`.

J3C-C stateful formation patterns remain **DEFERRED / NOT CURRENTLY JUSTIFIED**, not cancelled.

## Documentation canonicals
- DOC11: `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- DOC12: `f85e2432934454da191dea9bd0c9da43bbce86ca`;
- DOC13: `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- DOC14 — J3D closure & J4 activation: `998292cd40a3364aa7f22933b6312173956d3baa`;
- DOC15 — J4A closure & J4B activation: `096b2c9fe53551664b56baf6e382368f8b4078da` — Issue #316 / PR #317;
- DOC16 — J4B closure & J4C activation: `56aca8a129be9310f64bb04a99fb19560b52b2e3` — Issue #320 / PR #321;
- DOC17 — J4C-A closure & J4C-B activation: `19beb0abf2b17d391834cb6336419ed4ead6819c` — Issue #324 / PR #325;
- DOC18 — J4C-B closure & J4C-C activation: `72c4359af106d6f955e9932c6c72a836b2922ab8` — Issue #329 / PR #330.
- DOC19 — J4C-C closure & J5A activation: `907bce8c494a5c7b9a4965e09dca677d919560f4` — Issue #333 / PR #334.
- DOC20 — J5A closure & J5B activation: Issue #337, branch `docs/es-13-j5a-closure-j5b-activation`, documentation-only closure in progress from gameplay canonical `df60f62565a1d3cdf6058d2e1a4049f5870f27b7`.

## Next gameplay phase

### ES-13J5B — Pure Command-Link Binding Contract
Status: **NEXT ENGINEERING TARGET AFTER DOC20 CLOSURE**

J5B remains pure and zero-live-authority. Discovery after J5A confirmed that every live enemy may already carry the optional J3 `enemyFormation` assignment with bounded `groupId`, `memberIndex` and `memberCount`, while J3 remains the sole formation assignment/motion authority.

Required direction:
- consume already-existing bounded formation facts as data; do not own or mutate J3 director state;
- support only currently certified live group sizes 2 and 3;
- select exactly one deterministic `COMMAND_CORE` member per supported group;
- expose bounded linked-member metadata only;
- invalid/empty group ids, unsupported group sizes and out-of-range member indices fail closed;
- no new `EnemyType`, runtime field, live spawn/progression adoption, collection, scan, timer/RNG or cap authority;
- no damage, death, score, reward or formation mutation;
- preserve J5A `SIGNAL_ONLY` semantics and all J1/J2/J3/J4/FOTON/player authorities;
- actual live binding/adoption and chain-reaction behavior remain for a later J5 slice after J5B certification.

J4D+ additional tactical families remain **DEFERRED / NOT CURRENTLY JUSTIFIED**. `FORMATION_BREAKER` and `JAMMER` still require independent hard-control spacing/recovery proof; `MINE_WEAVER` and `MIRROR_WARDEN` still require genuine mine/mirror mechanics. J3C-C remains deferred, not cancelled.

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
`J5B Pure Command-Link Binding Contract → J5C+ Controlled Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read this file, `IMPLEMENTATION_LEDGER.md`, `ES13_GAMEPLAY_ROADMAP.md`, `TRACEABILITY_POLICY.md` and `ES13_PHASE_CHECKLIST.md`, then active Issues/PRs. Verify live `main` before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J5A gameplay canonical is `df60f62565a1d3cdf6058d2e1a4049f5870f27b7`, fully DEPLOYED / FROZEN via Issue #335 / PR #336 with exact three-file product scope. Complete DOC20 if still open, then implement J5B Pure Command-Link Binding Contract only as a deterministic mapping over existing bounded J3 formation assignments; no live adoption yet. Keep J4D+ families and J3C-C deferred until their prerequisites are proven. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, final head, pre-PR certification, PR CI/Android, main CI/Android/Pages, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.
