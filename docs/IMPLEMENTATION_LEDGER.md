# ORBI Energy Swarm — Implementation Ledger

Persistent chronological record of implemented, deployed and planned work.

Rules:
- completed gameplay entries require exact canonical SHA;
- record Issue/PR and run IDs when available;
- diagnostic hypotheses are never written as completed fixes;
- documentation-only commits may advance repository `main` without changing the last certified gameplay canonical;
- chat history is supplemental, never authoritative.

## Completed canonical milestones

| Phase | Status | Canonical | Issue | PR |
|---|---|---|---:|---:|
| ES-12H12 — Affinity Fusion Director | FROZEN | `e74ee87008f5eb53eca19950f2890d6a114a291b` | #238 | #239 |
| ES-12I1 — Web Distribution / PWA | FROZEN | `c9ab02b10383a666df2b317d2b2e9cd534a90356` | #240 | #241 |
| ES-12I2 — Android Packaging / Capacitor 8 | FROZEN | `57a9d0100a218295032d4898529600df2cd10905` | #242 | #243 |
| ES-12I3 — RC Readiness Gate | FROZEN | `7d6f5b0a54b59d97a7b3883abf53f6035e82518a` | #244 | #245 |
| ES-12I4 — Manual Evidence Dossier | FROZEN | `6cae3eda798cd754a0f47aa7a927fbe59749de30` | #246 | #247 |
| ES-12I5 — First-frame / startup safety | FROZEN | `6901c67eaf369c3b41dba5d60480ad7d173275a7` | #249 | #250 |
| ES-13J1A — Combat Chain & Resonance Core | DEPLOYED / FROZEN | `feb263957b52839d35a7cb1249762c223ba22595` | #251 | #252 |
| ES-13J1B — Live Resonance Adoption & HUD | DEPLOYED / FROZEN | `91564e365d0a2220e4db2999e38372809ec397f3` | #253 | #257 |
| ES-13J2A — Overdrive Pure State Contract | DEPLOYED / FROZEN | `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7` | #260 | #261 |
| ES-13J2B — Live Overdrive Activation & HUD | DEPLOYED / FROZEN | `466242e91fa927bc4d996d09efdbb87f8f572d44` | #264 | #267 |
| ES-13J2C-A — Pure Bounded Combat Expression | DEPLOYED / FROZEN | `eca68cce510cf506053fd6d9121b501db7cd1f64` | #271 | #272 |
| ES-13J2C-B — Live Bounded Damage Adoption | DEPLOYED / FROZEN | `7e15ee1e79ee9ae8903891a66b0b1031b0600bca` | #276 | #278 |
| ES-13J2D-A — Pure Presentation Profile | DEPLOYED / FROZEN | `39f9b33c9a229c7c8d991aecd81ea695510c82a0` | #281 | #282 |
| ES-13J2D-B — Live Reactive Presentation | DEPLOYED / FROZEN | `9743890d98b33d365cbc18a048015f3815b144e5` | #286 | #287 |
| ES-13J2E — Overdrive Integration Certification | DEPLOYED / FROZEN | `bf0e6a858e3c96091c002ea623b29eb5c260c6ea` | #290 | #291 |
| ES-13J3A — Pure Enemy Formation Route Contract | DEPLOYED / FROZEN | `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be` | #294 | #295 |
| ES-13J3B — Live Enemy Formation Director Adoption | DEPLOYED / FROZEN | `0fcf08dc59558619da61e1120eef2e957465f9a1` | #298 | #299 |
| ES-13J3C-A — Pure Advanced Enemy Formation Vocabulary | DEPLOYED / FROZEN | `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8` | #302 | #303 |
| ES-13J3C-B — Controlled Live Advanced Formation Adoption | DEPLOYED / FROZEN | `5c345672b5365dbcc983403f73da62555489a98f` | #306 | #307 |
| ES-13J3D — Formation Telegraph/Fairness/Integration Certification | DEPLOYED / FROZEN | `7273d447bbdcb084499fb121122aac6d34928d41` | #310 | #311 |
| ES-13J4A — Pure Tactical Enemy Family Contract | DEPLOYED / FROZEN | `0c3f5c668926130f7ac8044cff8b619302949225` | #314 | #315 |
| ES-13J4B — Narrow Live Warp Ambusher Adoption | DEPLOYED / FROZEN | `1023cee74d1c32a379bf542551397ae134f43573` | #318 | #319 |
| ES-13J4C-A — Pure Siege Volley Telegraph Contract | DEPLOYED / FROZEN | `4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6` | #322 | #323 |
| ES-13J4C-B — Live Siege Volley Telegraph Integration | DEPLOYED / FROZEN | `2e16ff9a577128ffb06211b612116553928c8cda` | #326 | #327 + #328 |

## Evidence anchors

### ES-12
- I4: main CI `38208264830`, Android `38208264879`, Pages `38208313953` GREEN; Android artifact `11728093302`.
- I5: pre/branch `38264942317`; PR CI `38265445991`; PR Android `38265446421`; main CI `38265745892`; main Android `38265745833`; Pages `38265853615` — GREEN. Corrected first-frame suspended render safety, Eclipse TDZ usage and premature unmuted BGM startup.

### J1 — Combat Chain & Resonance
- J1A `feb263...`: pure 2.2 s chain, affinity diversity, Resonance tiers, score projection capped at 2×, bounded damage break. Pre `38273358267`; PR CI `38273679009`; PR Android `38273679054`; main CI `38273920992`; main Android `38273919797`; Pages `38274024789` — GREEN.
- J1B `91564e...`: centralized direct+splash defeat routing, projectile affinity attribution, damage break, simulation-time expiry/reset and HUD. Pre `38285523692` / job `114932841692`; final head `22e2bf380374f2e9933dbec76086855d1ae09a94`; PR CI `38287053826`; PR Android `38287053915`; main CI `38287238136`; main Android `38287238150`; Pages `38287336600` — GREEN.

### J2 — ORBI Overdrive
- J2A `6adfb7...`: pure 8 s active + 4 s re-entry state contract. Pre `38288374752` / `114942126186`; final head `565b94bf9bf873a9280ef2ca123e3dcbd88d98ad`; PR CI `38288795483`; PR Android `38288795462`; main CI `38288929402`; main Android `38288929417`; Pages `38289009730` — GREEN.
- J2B `466242...`: live `O`/HUD activation, one-shot Resonance consumption and simulation-time lifecycle. Pre `38293627094` / `114959353674`; final head `e43a1d3f4f4a7801fb836055cbf23176992dc74b`; PR CI `38294148486`; PR Android `38294148448`; main CI `38294331547`; main Android `38294331726`; Pages `38294411795` — GREEN.
- J2C-A `eca68c...`: pure active damage 1.20 with hard ceiling 1.25; no fire-rate/projectile/score/economy amplification. Pre `38295483032` / `114965401785`; final head `992612a5315e87813e2e9d4e269a635806753e38`; PR CI `38295901224`; PR Android `38295901194`; main CI `38296053435`; main Android `38296053642`; Pages `38296151229` — GREEN.
- J2C-B `7e15ee...`: bounded damage adopted once at centralized player-projectile damage resolution. Pre `38297477355` / `114971948257`; final head `02d4296bd288860362eeb0502c387d801a31e45c`; PR CI `38297915036`; PR Android `38297913596`; main CI `38298120771`; main Android `38298120436`; Pages `38298206493` — GREEN.
- J2D-A `39f9b3...`: pure bounded presentation profile. Pre `38299553187` / `114978848191`; final head `5a70b0d55122ddf95b9af303dd24624f57b2f216`; PR CI `38299974128`; PR Android `38299974261`; main CI `38300161662`; main Android `38300161573`; Pages `38300237659` — GREEN.
- J2D-B `974389...`: live Canvas2D field tint + collective FOTON/swarm halo/rings; no particles/arrays/scans/timer/gameplay changes. Pre `38302074362` / `114987146051`; final head `c96954ffabc1c6330bbbe2736b90456537878c10`; PR CI `38302405528`; PR Android `38302405569`; main CI `38302618451`; main Android `38302618447`; Pages `38302704724` — GREEN.
- J2E `bf0e6a...`: certification-only closure of complete J1/J2 stack; final diff tests only. Pre head `eba9a30f627875103f53a49e27069eff2a3c3861`, run `38303651696` / `114992339524`; final head `0dcd9b4533976a43f872d6b070607076c6336b48`; PR CI `38308946054`; PR Android `38309446296`; main CI `38309074528`; main Android `38309218634`; Pages `38309135916` — GREEN.

### J3 — Advanced Enemy Formation Director
- J3A `3c5ece...`: pure PINCER/X_CROSS/SERPENTINE route projection, local member cap 8, normalized extent ±1.25. Pre head `685d0c498615a35f659cf8f7c8b231c85a8e6e0e`, run `38310490857` / `115014740153`; final head `5e01e4d21bf1cdc185a8755e16006a2ee70ca89c`; PR CI `38310847060`; PR Android `38310847054`; main CI `38310975108`; main Android `38310975021`; Pages `38311040652` — GREEN.
- J3B `0fcf08...`: live ordinary CRAWLER/SPLITTER pair adoption through one caller-owned director and existing spawn opportunities/capacity. Pre head `5085ee44e92c2bb5e020d268a0e502606309856a`, run `38313865225` / `115025740383`; final head `6ff07665f7245b56e9d83c6fcb882f6badbe7f59`; PR CI `38314059155`; PR Android `38314059702`; main CI `38314198181`; main Android `38314198069`; Pages `38314280642` — GREEN.
- J3C-A `0fd337...`: added pure WEDGE/ORBIT/SPIRAL while preserving existing routes/caps. Pre head `51a6bb26fd0aabb9400de921ef0351d4deb8afe8`, run `38315199129` / `115030050802`; final head `71eaccdd4682e53ee13006b7fe1b70f5033e3bc6`; PR CI `38315423545`; PR Android `38315423642`; main CI `38315550962`; main Android `38315550956`; Pages `38315617546` — GREEN.
- J3C-B `5c3456...`: controlled live WEDGE/ORBIT/SPIRAL adoption, route-aware size 2/3, no overcommit. Pre head `2e1c69580443273911358383800f6e324f0ba77f`, run `38317062905` / `115036102323`; final head `eba0d94663c217ee56986f0d7ca86c4d873f08f3`; PR CI `38317340298`; PR Android `38317340308`; main CI `38317440415`; main Android `38317440420`; Pages `38317520671` — GREEN.
- J3C-C: **DEFERRED / NOT CURRENTLY JUSTIFIED**. Convoy/fake-retreat/portal/encirclement/staggered-artillery require a future dedicated issue proving distinct tactical value and bounded state.
- J3D `7273d...`: certification-only closure of all six routes; final diff exactly two tests, zero runtime changes. First pre-cert failure was an overly rigid static syntax assertion; runtime semantics were already correct and the test was corrected without product change. Corrected pre head `04dc77aef159dfe3ea0b2c635fc8573353140b25`; pre run `38320496667` / `115047172319`; final PR head `09d0f355acc2e93487cfa5d641b7c642820abcd6`; PR CI `38320727930`; exact-head Android `38486336058` / `115600790747`; main CI `38320885204`; exact-canonical Android `38485843331` / `115599171557`; Pages `38320970197` — GREEN.

### J4A — Pure Tactical Enemy Family Contract
J4A reused existing dormant advanced `EnemyType` values instead of creating a parallel catalog. Certified four immutable 1:1 tactical profiles:
- `RIFT_HUNTER` → `WARP_AMBUSHER` (`TIMING`, `RIFT_LOCK`, `DODGE_AFTER_LOCK_COMMIT`);
- `SIEGE_PRISM` → `ARTILLERY_CARRIER` (`RANGE_CONTROL`, `SIEGE_VOLLEY`, `BREAK_ARTILLERY_ENVELOPE`);
- `SWARM_REAVER` → `FORMATION_BREAKER` (`SWARM_COHESION`, `REAVER_APPROACH`, `INTERCEPT_BEFORE_COHESION_BREAK`);
- `VOID_ANCHOR` → `JAMMER` (`CONTROL_SOURCE`, `ANCHOR_FIELD`, `EXIT_OR_DESTROY_CONTROL_SOURCE`).

Shared authority contract explicitly forbids spawn authority, entity/projectile collections, full-array scans, global-cap mutation and support-entity creation. Unsupported/base/boss/deferred types fail closed. `MINE_WEAVER` / `MIRROR_WARDEN` remain deferred because their current runtime does not yet justify mine/mirror semantics.

Final product diff exactly:
- `src/game/tacticalEnemyFamilies.ts`;
- `tests/gameplay/tactical-enemy-families.test.ts`;
- `tests/es-13j4a-tactical-enemy-contract.test.mjs`.

No `EnergySwarmGame.tsx`, `types.ts`, Campaign/Infinite selection, caps/budgets, stat tuning, score/economy/J1/J2/GAIA/FOTON GLB or player/FOTON formation changes.

Exact evidence:
- baseline `998292cd40a3364aa7f22933b6312173956d3baa`;
- pre-PR head `8bbce75c6bbd6e1fbcb7205ed7bcb80d9121f767`, run `38488019246`, job `115606272019` — GREEN including Android/APK/J4A scope guard;
- final PR head `55a8abe0de9063b3d937ffca2f52ec9ec283309f`;
- PR CI `38488256442`, job `115607044338` — GREEN;
- PR Android `38488256429`, job `115607044509` — GREEN including Build/Verify/Upload APK;
- canonical `0c3f5c668926130f7ac8044cff8b619302949225`, single parent `998292cd40a3364aa7f22933b6312173956d3baa`;
- main CI `38488402612`, job `115607525382` — GREEN;
- main Android `38488402647`, job `115607525424` — GREEN including Build/Verify/Upload APK;
- APK artifact `orbi-energy-swarm-debug-0c3f5c668926130f7ac8044cff8b619302949225`, artifact `11860492569`;
- Pages `38488489012` — build + deploy GREEN.

Issue #314 CLOSED / completed. J4A is **DEPLOYED / FROZEN**.

### J4B — Narrow Live Warp Ambusher Adoption
J4B adopted only `RIFT_HUNTER` / `WARP_AMBUSHER`, using one deterministic replacement of an existing Infinite spawn-budget slot. Campaign remained disabled. Eligible Infinite sectors are sparse, non-milestone, non-recovery cadence sectors from 26 onward, final wave only; first reachable sector is 34.

Isolation/fairness: no density/cap/budget increase; no generic elite overlay on the tactical spawn; evolved-enemy authority excludes `RIFT_HUNTER`; J3 formation authority remains CRAWLER/SPLITTER-only; existing `RIFT LOCK` telegraph remains the counterplay cue. Hard-control families and mine/mirror semantics remain deferred.

Final product diff exactly four files: `EnergySwarmGame.tsx` (+10), `runtimeTacticalEnemyAdoption.ts`, and two J4B test files. The first temporary exact-patch workflow failed closed on an indentation-sensitive elite matcher and wrote no partial runtime change; the matcher was corrected before certification.

Exact evidence:
- baseline `096b2c9fe53551664b56baf6e382368f8b4078da`;
- pre-PR head `d758c4a38575002b6a59242f2894fc4e8e235fb0`, run `38489976346`, job `115612611028` — GREEN;
- final PR head `5a29b7af53b9f62b017c54cde7ed87e00c04216b`;
- PR CI `38490183094`, job `115613270626` — GREEN;
- PR Android `38490183041`, job `115613270479` — GREEN including Build/Verify/Upload APK;
- canonical `1023cee74d1c32a379bf542551397ae134f43573`, single parent `096b2c9fe53551664b56baf6e382368f8b4078da`;
- main CI `38490426895`, job `115614058362` — GREEN;
- main Android `38490426903`, job `115614058464` — GREEN including Build/Verify/Upload APK;
- Pages `38490505690`, build `115614310963` + deploy `115614421521` — GREEN.

Issue #318 CLOSED / completed. J4B is **DEPLOYED / FROZEN**.

### J4C-A — Pure Siege Volley Telegraph Contract
J4C-A established the fairness seam before any additional SIEGE progression. The pure state machine locks one finite target at telegraph start, holds a 700 ms simulation-time reaction window, emits one COMMIT edge at/after the exact boundary, remains latched until explicit acknowledgement, and projects `SIEGE_VOLLEY` / `BREAK_ARTILLERY_ENVELOPE` metadata. Invalid target/delta inputs fail closed.

Authority remains zero: no spawn authority, entity/projectile collections, full-array scans, global-cap mutation, support-entity creation or cooldown RNG. J4C-A made no live runtime/renderer/progression changes. This is intentionally prerequisite work because `SIEGE_CATHEDRAL` already spawns up to two `SIEGE_PRISM` supports while current SIEGE firing has no reaction window.

Final product diff exactly three files: `src/game/siegeVolleyTelegraph.ts` plus two J4C-A tests.

Exact evidence:
- baseline `56aca8a129be9310f64bb04a99fb19560b52b2e3`;
- pre-PR head `d4963c8d435996adf39e6df582ba7c15540d3ab9`, run `38492253039`, job `115619974269` — GREEN;
- final PR head `1724dc4fd199e7be50f1110c7606d54bbe2b1543`;
- PR CI `38492465605`, job `115620646548` — GREEN;
- PR Android `38492465573`, job `115620646615` — GREEN including Build/Verify/Upload APK;
- canonical `4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6`, single parent `56aca8a129be9310f64bb04a99fb19560b52b2e3`;
- main CI `38492584499`, job `115621028391` — GREEN;
- main Android `38492584516`, job `115621028451` — GREEN including Build/Verify/Upload APK;
- Pages `38492658345`, build `115621262106` + deploy `115621344438` — GREEN.

Issue #322 CLOSED / completed. J4C-A is **DEPLOYED / FROZEN**.

### J4C-B — Live Siege Volley Telegraph Integration
J4C-B adopted the J4C-A 700 ms target-lock state into every existing `SIEGE_PRISM`, including `SIEGE_CATHEDRAL` support, without expanding normal Campaign/Infinite progression. Locked target is fixed; COMMIT remains latched under cap/budget rejection; ACK/reset occurs only after existing projectile authority creates the volley; three projectiles, speed `4.0`, spread `0.12` and cooldown `150 + Math.random() * 70` remain unchanged.

PR #327 exposed a scope defect: one historical certification file had been adapted in addition to the approved six J4C-B files. #326 was reopened fail-closed. PR #328 restored `tests/runtime-combat-pressure-adoption.test.ts` to pre-J4C-B state and preserved equivalent runtime semantics in allowed `EnergySwarmGame.tsx`. Final `19beb0abf2b17d391834cb6336419ed4ead6819c...2e16ff9a577128ffb06211b612116553928c8cda` diff is exactly the six approved J4C-B files; `siegeVolleyTelegraph.ts` remains untouched.

Exact final evidence:
- remediation pre-PR `b5a768e919b9a75fb71a1a627bc521f74661a13b`, run `38506960989` / job `115666560063` GREEN;
- final PR #328 head `bba0fa7a94cd45084c55149f80714dd1155a5baa`;
- PR CI `38507157523` / `115667172988` GREEN;
- PR Android `38507157492` / `115667172667` GREEN including Build/Verify/Upload APK;
- canonical `2e16ff9a577128ffb06211b612116553928c8cda`, parent `8dec7945338e0152e83536605b18da63879818fe`, tree `8435b068908d82225b5442c8865578c46fedc243`;
- main CI `38507278577` / `115667552196` GREEN;
- main Android `38507278528` / `115667552109` GREEN including Build/Verify/Upload APK;
- Pages `38507354839`, build `115667791913` + deploy `115667881614` GREEN.

Issue #326 CLOSED / completed. J4C-B is **DEPLOYED / FROZEN**.

## Documentation canonicals
- DOC11 `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- DOC12 `f85e2432934454da191dea9bd0c9da43bbce86ca`;
- DOC13 `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- DOC14 — J3D closure & J4 activation: `998292cd40a3364aa7f22933b6312173956d3baa`;
- DOC15 — J4A closure & J4B activation: `096b2c9fe53551664b56baf6e382368f8b4078da` — Issue #316 / PR #317;
- DOC16 — J4B closure & J4C activation: `56aca8a129be9310f64bb04a99fb19560b52b2e3` — Issue #320 / PR #321;
- DOC17 — J4C-A closure & J4C-B activation: `19beb0abf2b17d391834cb6336419ed4ead6819c` — Issue #324 / PR #325;
- DOC18 — J4C-B closure & J4C-C activation: Issue #329, branch `docs/es-13-j4c-b-closure-j4c-c-activation`, in progress from gameplay canonical `2e16ff9a577128ffb06211b612116553928c8cda`.

## Frozen manual/physical blockers
Remain OPEN and deferred while ES-13 materially changes gameplay:
- #4 — visual/responsive certification;
- #5 — Infinite play-feel;
- #202 — GAIA physical runtime/performance;
- #248 — Android real-device certification.

Automated CI never substitutes for required human/device evidence.

## Next planned gameplay

### ES-13J4C-C — Controlled Normal-Progression Siege Adoption
Status: **NEXT ENGINEERING TARGET AFTER DOC18 CLOSURE**.

Broaden `SIEGE_PRISM / ARTILLERY_CARRIER` only through a bounded policy proved from current Campaign/Infinite selection seams. Prefer narrow Infinite-only deterministic replacement; do not add density, caps, budgets, collections or a second director. J4C-B 700 ms target-lock/COMMIT/ACK behavior and `SIEGE_CATHEDRAL` support policy remain frozen. Hard-control families and mine/mirror semantics remain deferred.

## Program sequence
`J4C-C Controlled Siege Progression → J4D+ Additional Tactical Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`
