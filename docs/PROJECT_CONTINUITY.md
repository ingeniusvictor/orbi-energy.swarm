# ORBI Energy Swarm — Project Continuity

> START HERE after any new chat/session, context loss or handoff.

Repository: `ingeniusvictor/orbi-energy.swarm`  
Last continuity update: 2026-10-15

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

`90f3fc82271654e6d7a7076474ae46efd02775e4`

Phase: **ES-13J5F-A — Pure Optional Command-Link Disruption Pulse Contract**
Status: **DEPLOYED / FROZEN**
Issue: #355 — CLOSED / completed
Delivery: PR #356 — squash merged

Single parent: `a94883c1532ba14e9c81b0a16e923a730aa1275d` — DOC24 documentation canonical.

Canonical tree: `e0226f6da7fb90b54a612b5e42716437b19ca171`.

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

## J5B result
J5B established a pure deterministic Command Link binding over already-existing bounded J3 formation facts without creating live state or a second formation authority.

Certified contract:
- supported group sizes exactly 2 and 3;
- deterministic `coreMemberIndex = 0`, derived from J3's existing member assignment order;
- member 0 resolves to semantic `COMMAND_CORE`; all other valid members resolve to `LINKED_MEMBER`;
- J5A `COMMAND_CORE` identity is referenced type-only rather than duplicated;
- binding mode is `BINDING_ONLY`;
- linked-member indices are bounded metadata `[1]` or `[1,2]` only;
- invalid/empty/padded group ids, unsupported counts and invalid indices fail closed;
- no new `EnemyType`, `Enemy` field or live runtime adoption;
- J3 formation assignment/motion and J5A priority-target identity remain authoritative;
- no spawn, entity/projectile collection, damage, defeat, score, reward, clock, RNG, full-array scan, cap mutation or entity create/remove authority.

Final product scope exactly:
- `src/game/commandLinkBinding.ts`;
- `tests/es-13j5b-command-link-binding.test.mjs`;
- `tests/gameplay/command-link-binding.test.ts`.

## J5B exact evidence
- DOC20 baseline `efe68202b4046c7f4b2df3cae951908b9e012d3b`;
- pre-PR SHA `66b6e6276d6229f74476a541c220e203a0f3dc8b`, run `38568941468` / job `115868727522` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact scope guard and Android APK build/verify/upload;
- final PR #340 head `7d59c94bd7fb79ec9b577d47712ebba751488efb`;
- PR CI `38569355540` / `115870150075` GREEN;
- PR Android `38569355236` / `115870147877` GREEN including Build/Verify/Upload APK;
- canonical `f868058889b24fecbd97f968e932890248ca2b33`, single parent `efe68202b4046c7f4b2df3cae951908b9e012d3b`, tree `336ef4e31a59aea1890154f9b853b84e1409711a` equal to final PR-head tree;
- canonical diff exactly three certified product files;
- main CI `38569599501` / `115870991101` GREEN;
- main Android `38569599482` / `115870990530` GREEN including Build/Verify/Upload APK;
- Pages `38569726643`: build `115871441654` + deploy `115871606433` GREEN.

Issue #339 CLOSED / completed. J5B is **DEPLOYED / FROZEN**.

## J5C result
J5C delivered the first live Command Core adoption as presentation only, reusing current J3/J5B facts without adding entity state or combat authority.

Certified live behavior:
- current active formation facts are projected through J5B on demand inside the existing Canvas enemy pass;
- only a valid current `COMMAND_CORE` receives one bounded static priority ring plus top chevron;
- linked/invalid/no-formation members receive no marker;
- J3 remains authoritative for formation lifetime, so the marker disappears naturally when `enemyFormation` is cleared;
- existing enemy body/telegraphs render before the marker and the damaged-health bar remains after it;
- no text label, linked-member line, cross-entity lookup, second enemy scan or collection;
- no new `EnemyType`, `Enemy` field, runtime state, timer or RNG authority;
- no spawn/progression, damage, defeat, score, reward, economy, cap/budget or chain-reaction effect;
- J3, J4, J5A and J5B contracts remain unchanged.

Final product scope exactly:
- `src/game/EnergySwarmCanvas.tsx`;
- `src/game/liveCommandCorePresentation.ts`;
- `tests/es-13j5c-live-command-core-presentation.test.mjs`;
- `tests/gameplay/live-command-core-presentation.test.ts`.

## J5C exact evidence
- DOC21 baseline `8a1e17b87cdd8508453814454175ef7f0b95c6ce`;
- pre-PR SHA `8b493a1e09c03620df9f5d2785fd8e16d062a062`, run `38573138443` / job `115883247207` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact product-scope guard and Android APK build/verify/upload;
- final PR #344 head `36f4895119d5642624135d5a6af072236faf76d2`;
- PR CI `38573643779` / `115884993730` GREEN;
- PR Android `38573643737` / `115884991853` GREEN including Build/Verify/Upload APK;
- canonical `55d824d2b9cfaf6bb8cd97a032866b1fbcfa92fb`, single parent `8a1e17b87cdd8508453814454175ef7f0b95c6ce`, tree `442611df6707d609c73637da48ef70096feb902d` equal to final PR-head tree;
- canonical diff exactly four certified product files;
- main CI `38573884299` / `115885813621` GREEN;
- main Android `38573884191` / `115885814664` GREEN including Build/Verify/Upload APK;
- Pages `38574014576`: build `115886257262` + deploy `115886451208` GREEN.

Issue #343 CLOSED / completed. J5C is **DEPLOYED / FROZEN**.

## J5D result
J5D established the pure deterministic Command Link break resolution required before any live detach application.

Certified contract:
- consumes only current J5B formation/binding facts;
- requires a valid current `COMMAND_CORE`; linked/invalid facts fail closed;
- reuses J5A `COMMAND_LINK_BROKEN` and verifies source `SIGNAL_ONLY` semantics;
- emits immutable intent `DETACH_LINKED_MEMBERS` with effect mode `INTENT_ONLY`;
- size-2 groups expose bounded linked indices `[1]`; size-3 groups expose `[1,2]`;
- no live enemy ids, entity lookup, array scan, collection or runtime mutation;
- no formation mutation, damage/kill, score/reward/economy, spawn/progression, clock/RNG, cap/budget or entity create/remove authority;
- J3, J5A, J5B and J5C remain unchanged.

Final product scope exactly:
- `src/game/commandLinkBreakResolution.ts`;
- `tests/es-13j5d-command-link-break-resolution.test.mjs`;
- `tests/gameplay/command-link-break-resolution.test.ts`.

## J5D exact evidence
- DOC22 baseline `025bc875a4b3a9dc5d1e690591b6ae0f5af6a6ec`;
- pre-PR SHA `68d5c269f62415605c6265a1acef572f92438fa0`, run `38612549835` / job `116019315964` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact product-scope guard and Android APK build/verify/upload;
- final PR #348 head `8739313a605ccf33ddfdf69ae5e73d04f26f5957`;
- PR CI `38613042191` / `116020992856` GREEN;
- PR Android `38613042036` / `116020992132` GREEN including Build/Verify/Upload APK;
- canonical `99410123a8f20d15a88cd20ada34523ce4497006`, single parent `025bc875a4b3a9dc5d1e690591b6ae0f5af6a6ec`, tree `1240e692acb4622389748c9328b5b88e8563560b` equal to final PR-head tree;
- canonical diff exactly three certified product files;
- main CI `38613516322` / `116022626176` GREEN;
- main Android `38613516479` / `116022628100` GREEN including Build/Verify/Upload APK;
- Pages `38613648878`: build `116023067863` + deploy `116023290302` GREEN.

Issue #347 CLOSED / completed. J5D is **DEPLOYED / FROZEN**.

## J5E result
J5E delivered controlled live Command-Link detach while preserving frozen J5D purity and J3 formation authority.

Certified live behavior:
- valid current Command Core defeat is observed at existing centralized `registerCombatDefeat(...)`;
- one scalar pending break intent only; no queue/map/set/group index;
- capture occurs before, and detach application occurs only inside, the existing enemy traversal;
- matching living linked members require exact `groupId` plus a bounded J5D linked-member index;
- detach clears only `enemy.enemyFormation`; existing movement immediately resumes authority;
- captured intent consumption uses object identity so a newer intent cannot be erased;
- pending intent resets at all J3 director reset boundaries;
- no second enemy scan/collection, entity schema change, damage/kill, score/reward/economy, spawn/progression, clock/RNG, cap/budget or entity create/remove authority.

Final product scope exactly:
- `src/game/EnergySwarmGame.tsx`;
- `src/game/liveCommandLinkBreakApplication.ts`;
- `tests/es-13j5e-live-command-link-break-application.test.mjs`;
- `tests/gameplay/live-command-link-break-application.test.ts`.

## J5E exact evidence
- DOC23 baseline `b317faa1cb3403fe11baaa71e6c072b8a97a3062`;
- pre-PR SHA `868ff46c057ec589a0984a8b24fdd824a63bd903`, run `38680675400` / job `116244260573` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact product-scope guard and Android APK build/verify/upload;
- final PR #352 head `92fcb5930029ca42cc8fb191458397c4610b2f7e`;
- PR CI `38680965872` / `116245194669` GREEN;
- PR Android `38680965875` / `116245194752` GREEN including Build/Verify/Upload APK;
- canonical `6aa63e9643a2521738b3b6afebfb0856f48bd3fd`, single parent `b317faa1cb3403fe11baaa71e6c072b8a97a3062`, tree `b7b65424cbfe1b574a632364e8cf028b1da155fa` equal to final PR-head tree;
- canonical diff exactly four certified product/test files;
- main CI `38681102491` / `116245629498` GREEN;
- main Android `38681102495` / `116245629757` GREEN including Build/Verify/Upload APK;
- Pages `38681179362`: build `116245865182` + deploy `116245989502` GREEN.

Issue #351 CLOSED / completed. J5E is **DEPLOYED / FROZEN**.

## J5F-A result
J5F-A established a pure optional Command-Link disruption-pulse proposal without creating any live combat consequence.

Certified contract:
- consumes frozen J5D break resolution as a type-only prerequisite;
- caller-supplied freshness `CURRENT` / `STALE`; only CURRENT may project;
- exact vocabulary `COMMAND_LINK_DISRUPTION_PULSE` / `PULSE_LINKED_MEMBERS` / `PROPOSAL_ONLY` / `LINKED_MEMBER`;
- target indices remain bounded to `[1]` or `[1,2]`;
- projection and target-index arrays are immutable;
- current-formation and living-target requirements remain metadata only;
- explicit zero-effect facts prohibit damage, kills, score, rewards, projectiles and formation mutation;
- no entity lookup/scan/collection, runtime mutation, clock/RNG, cap/budget or entity create/remove authority;
- no live adoption and no collision with combat-resonance chain semantics.

Final product scope exactly:
- `src/game/commandLinkCombatEffectContract.ts`;
- `tests/es-13j5fa-command-link-combat-effect-contract.test.mjs`;
- `tests/gameplay/command-link-combat-effect-contract.test.ts`.

## J5F-A exact evidence
- DOC24 baseline `a94883c1532ba14e9c81b0a16e923a730aa1275d`;
- pre-PR SHA `074d8f38a24eab6eb3a5adf448cd7fbdee8d57f8`, run `38683045891` / job `116251639676` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact scope guard and Android APK build/verify/upload;
- final PR #356 head `d5afcd198efbefa16eeb4659650db3f0ab7eebc8`;
- PR CI `38683347951` / `116252576394` GREEN;
- PR Android `38683348067` / `116252576749` GREEN including Build/Verify/Upload APK;
- canonical `90f3fc82271654e6d7a7076474ae46efd02775e4`, single parent `a94883c1532ba14e9c81b0a16e923a730aa1275d`, tree `e0226f6da7fb90b54a612b5e42716437b19ca171`;
- canonical diff exactly three certified product/test files;
- main CI `38683470982` / `116252958810` GREEN;
- main Android `38683471108` / `116252959290` GREEN including Build/Verify/Upload APK;
- Pages `38683544584`: build `116253182791` + deploy `116253277337` GREEN.

Issue #355 CLOSED / completed. J5F-A is **DEPLOYED / FROZEN**.

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
- J5B — Pure Command-Link Binding Contract: `f868058889b24fecbd97f968e932890248ca2b33`.
- J5C — Live Command-Core Priority Presentation: `55d824d2b9cfaf6bb8cd97a032866b1fbcfa92fb`.
- J5D — Pure Command-Link Break Resolution Contract: `99410123a8f20d15a88cd20ada34523ce4497006`.
- J5E — Controlled Live Command-Link Detach Application: `6aa63e9643a2521738b3b6afebfb0856f48bd3fd`.
- J5F-A — Pure Optional Command-Link Disruption Pulse Contract: `90f3fc82271654e6d7a7076474ae46efd02775e4`.

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
- DOC20 — J5A closure & J5B activation: `efe68202b4046c7f4b2df3cae951908b9e012d3b` — Issue #337 / PR #338.
- DOC21 — J5B closure & J5C activation: `8a1e17b87cdd8508453814454175ef7f0b95c6ce` — Issue #341 / PR #342.
- DOC22 — J5C closure & J5D activation: `025bc875a4b3a9dc5d1e690591b6ae0f5af6a6ec` — Issue #345 / PR #346.
- DOC23 — J5D closure & J5E activation: `b317faa1cb3403fe11baaa71e6c072b8a97a3062` — Issue #349 / PR #350.
- DOC24 — J5E closure & J5F-A activation: `a94883c1532ba14e9c81b0a16e923a730aa1275d` — Issue #353 / PR #354.
- DOC25 — J5F-A closure & J5F-B target eligibility activation: Issue #357, branch `docs/es-13-j5fa-closure-j5fb-activation`, documentation-only closure in progress from gameplay canonical `90f3fc82271654e6d7a7076474ae46efd02775e4`.

## Next gameplay phase

### ES-13J5F-B — Pure Current Command-Link Pulse Target Eligibility Contract
Status: **NEXT ENGINEERING TARGET AFTER DOC25 CLOSURE**

J5F-A is frozen as proposal-only. J5F-B resolves whether one caller-supplied current formation candidate is eligible for that proposal; it still does not apply an effect.

Required direction:
- pure deterministic helper only; no `EnergySwarmGame.tsx` adoption;
- consume frozen J5F-A projection + current bounded formation facts for one candidate + explicit living state;
- require exact J5F-A proposal vocabulary and current J5B `LINKED_MEMBER` binding;
- require exact group identity match and candidate member index membership in the bounded projection target indices;
- require `isLiving === true`;
- absent/malformed/wrong-group/core/unsupported candidates fail closed;
- return immutable `ELIGIBLE_ONLY` metadata only;
- no live ids, lookup, scan, collection, health mutation, damage/kill/defeat, score/reward/economy, projectile, formation mutation, clock/RNG, cap/budget or entity create/remove authority;
- J5F-C+ remains responsible for any damage magnitude/policy and live application, with independent defeat-attribution and duplicate-reward prevention proof.

J4D+ additional tactical families remain **DEFERRED / NOT CURRENTLY JUSTIFIED**. J3C-C remains deferred, not cancelled.

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
`J5F-B Pure Current Command-Link Pulse Target Eligibility Contract → J5F-C+ separately proven damage policy/live application → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read this file, `IMPLEMENTATION_LEDGER.md`, `ES13_GAMEPLAY_ROADMAP.md`, `TRACEABILITY_POLICY.md` and `ES13_PHASE_CHECKLIST.md`, then active Issues/PRs. Verify live `main` before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J5F-A gameplay canonical is `90f3fc82271654e6d7a7076474ae46efd02775e4`, fully DEPLOYED / FROZEN via Issue #355 / PR #356 with exact three-file product scope and post-main CI/Android/Pages GREEN. Complete DOC25 if still open, then implement J5F-B as a pure current Command-Link pulse target-eligibility contract only: compose frozen J5F-A proposal semantics with one caller-supplied current formation candidate, J5B linked-member binding and explicit living state; return ELIGIBLE_ONLY. No live adoption, health/damage/kill/defeat, reward/score, entity lookup/scan/collection, timer/RNG or cap authority. Any damage policy/live application remains J5F-C+ and requires independent attribution/reward-deduplication proof. Keep J4D+ families and J3C-C deferred until prerequisites are proven. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, final head, pre-PR certification, PR CI/Android, main CI/Android/Pages, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.
