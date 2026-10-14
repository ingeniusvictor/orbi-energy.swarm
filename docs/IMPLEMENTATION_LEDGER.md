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

## Documentation canonicals
- DOC11 `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- DOC12 `f85e2432934454da191dea9bd0c9da43bbce86ca`;
- DOC13 `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- DOC14 — J3D closure & J4 activation: `998292cd40a3364aa7f22933b6312173956d3baa`;
- DOC15 — J4A closure & J4B activation: Issue #316, branch `docs/es-13-j4a-closure-j4b-activation`, in progress from gameplay canonical `0c3f5c668926130f7ac8044cff8b619302949225`.

## Frozen manual/physical blockers
Remain OPEN and deferred while ES-13 materially changes gameplay:
- #4 — visual/responsive certification;
- #5 — Infinite play-feel;
- #202 — GAIA physical runtime/performance;
- #248 — Android real-device certification.

Automated CI never substitutes for required human/device evidence.

## Next planned gameplay

### ES-13J4B — Narrow Live Tactical Enemy Adoption
Status: **NEXT ENGINEERING TARGET AFTER DOC15 CLOSURE**.

J4B must activate only the smallest justified subset of J4A families through existing progression/spawn/runtime authority. It must define explicit Campaign/Infinite eligibility, reuse existing enemy array/capacity, avoid a second director/full-array scan, preserve hard-control fairness and keep `MINE_WEAVER`/`MIRROR_WARDEN` deferred until their real mechanics exist.

## Program sequence
`J4B Narrow Live Tactical Adoption → J4C+ Additional Tactical Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`
