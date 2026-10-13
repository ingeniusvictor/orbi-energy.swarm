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

## ES-12 evidence anchors

### I4 — Manual Evidence Dossier
Main CI `38208264830`, Android `38208264879`, Pages `38208313953` GREEN. Android artifact ID `11728093302`.

### I5 — First-frame / startup safety
Corrected first-frame suspended render safety, Eclipse TDZ usage and premature unmuted BGM startup. Branch cert `38264942317`; PR CI `38265445991`; PR Android `38265446421`; main CI `38265745892`; main Android `38265745833`; Pages `38265853615` — GREEN.

## ES-13 gameplay ledger

### J1A — Combat Chain & Resonance Core
Pure deterministic core: 2.2 s chain window, affinity diversity, resonance tiers, score projection capped at 2×, elite/boss weighting, bounded damage break, chain cap 999, resonance cap 100.

Evidence: pre-PR `38273358267`; PR CI `38273679009`; PR Android `38273679054`; main CI `38273920992`; main Android `38273919797`; Pages `38274024789` — GREEN.

### J1B — Live Resonance Adoption & HUD
Direct+splash defeat routing, projectile affinity attribution, J1A awarded-score projection, post-invincibility damage break, simulation-time expiry/reset and low-frequency HUD projection.

Evidence: pre-PR `38285523692`, job `114932841692`; final PR head `22e2bf380374f2e9933dbec76086855d1ae09a94`; PR CI `38287053826`; PR Android `38287053915`; main CI `38287238136`; main Android `38287238150`; Pages `38287336600` — GREEN.

### J2A — Overdrive Pure State Contract
Pure deterministic 8 s active + 4 s re-entry state contract, explicit readiness, one-shot Resonance consumption signal, simulation-time boundaries, reset and immutable transitions.

Evidence: pre-PR `38288374752`, job `114942126186`; final PR head `565b94bf9bf873a9280ef2ca123e3dcbd88d98ad`; PR CI `38288795483`; PR Android `38288795462`; main CI `38288929402`; main Android `38288929417`; Pages `38289009730` — GREEN.

### J2B — Live Activation & HUD
Ref-owned live Overdrive state, explicit `O` + HUD activation, simulation-time lifecycle, one-shot Resonance consumption, reset and READY/ACTIVE/RECHARGING HUD.

Evidence: pre-PR `38293627094`, job `114959353674`; final PR head `e43a1d3f4f4a7801fb836055cbf23176992dc74b`; PR CI `38294148486`; PR Android `38294148448`; main CI `38294331547`; main Android `38294331726`; Pages `38294411795` — GREEN.

### J2C-A — Pure Bounded Combat Expression
Pure damage projection: inactive `1.0`, active `1.20`, hard ceiling `1.25`, deterministic/non-stacking, no score/economy/fire-rate/projectile-count/speed/crit/defense/budget mutation.

Evidence: corrected pre-PR `38295483032`, job `114965401785`; final PR head `992612a5315e87813e2e9d4e269a635806753e38`; PR CI `38295901224`; PR Android `38295901194`; main CI `38296053435`; main Android `38296053642`; Pages `38296151229` — GREEN.

### J2C-B — Live Bounded Damage Adoption
`projectCombatOverdriveEffects()` adopted exactly once at centralized player-projectile damage resolution after existing base/profile/GAIA/critical resolution.

Evidence: pre-PR `38297477355`, job `114971948257`; final PR head `02d4296bd288860362eeb0502c387d801a31e45c`; PR CI `38297915036`; PR Android `38297913596`; main CI `38298120771`; main Android `38298120436`; Pages `38298206493` — GREEN.

### J2D-A — Pure Presentation Profile
Pure quality-bounded presentation projection with neutral inactive output, max direct ring count 3, activation pulse from certified remaining ratio and no second timer or side effects.

Evidence: pre-PR `38299553187`, job `114978848191`; final PR head `5a70b0d55122ddf95b9af303dd24624f57b2f216`; PR CI `38299974128`; PR Android `38299974261`; main CI `38300161662`; main Android `38300161573`; Pages `38300237659` — GREEN.

### J2D-B — Live Reactive Presentation Adoption
Live runtime consumes J2D-A projection and adds bounded direct Canvas2D field tint + collective FOTON/swarm halo/rings. No particles/entity arrays/scans were added. Short TACTICAL-lane activation stinger remains user-gesture/mute safe. No timer/gameplay/cap/budget changes.

Evidence: successful pre-PR `38302074362`, job `114987146051`; final PR head `c96954ffabc1c6330bbbe2736b90456537878c10`; PR CI `38302405528`; PR Android `38302405569`; main CI `38302618451`; main Android `38302618447`; Pages `38302704724` — GREEN.

### J2E — Overdrive Integration Certification
Certification-only closure of J1/J2. Final gameplay diff added two tests and changed no runtime source. It certified readiness → activation/consumption → bounded damage/presentation → exact 8 s expiry + 4 s lock, non-stacking activation, damage interaction, fresh-run reset, pause safety, long deterministic bounded sequences and live pure-module adoption.

Evidence: pre-PR head `eba9a30f627875103f53a49e27069eff2a3c3861`; run `38303651696`, job `114992339524`; final PR head `0dcd9b4533976a43f872d6b070607076c6336b48`; PR CI `38308946054`; PR Android `38309446296`; canonical `bf0e6a858e3c96091c002ea623b29eb5c260c6ea`; main CI `38309074528`; main Android `38309218634`; Pages `38309135916` — GREEN.

### J3A — Pure Enemy Formation Route Contract
Added pure enemy-only route projection authority separate from player/FOTON formations. Initial vocabulary: PINCER, X_CROSS, SERPENTINE. Caller supplies route/member/progress/mirror and receives bounded normalized positions plus phase/role/telegraph metadata. Local member cap 8, route extent ±1.25, deterministic and fail-closed.

Evidence: pre-PR head `685d0c498615a35f659cf8f7c8b231c85a8e6e0e`; run `38310490857`, job `115014740153`; final PR head `5e01e4d21bf1cdc185a8755e16006a2ee70ca89c`; PR CI `38310847060`; PR Android `38310847054`; canonical `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be`; main CI `38310975108`; main Android `38310975021`; Pages `38311040652` — GREEN.

### J3B — Live Enemy Formation Director Adoption
Adopted J3A through the existing regular-enemy spawn/movement seam. One caller-owned director ref plus per-enemy optional assignment metadata; ordinary CRAWLER/SPLITTER pairs only; normal spawn opportunities/capacity only; simulation-time progress; Hydro cancellation; run/wave/boss resets; explicit Campaign/Infinite eligibility; no parallel movement engine or formation-only full scan.

Evidence: pre-PR head `5085ee44e92c2bb5e020d268a0e502606309856a`; run `38313865225`, job `115025740383`; final PR head `6ff07665f7245b56e9d83c6fcb882f6badbe7f59`; PR CI `38314059155`; PR Android `38314059702`; canonical `0fcf08dc59558619da61e1120eef2e957465f9a1`; main CI `38314198181`; main Android `38314198069`; Pages `38314280642` — GREEN.

### J3C-A — Pure Advanced Enemy Formation Vocabulary
Expanded the pure route authority with WEDGE, ORBIT and SPIRAL while preserving PINCER/X_CROSS/SERPENTINE, local cap 8 and extent ±1.25. WEDGE/ORBIT require minimum 3; SPIRAL minimum 2. Added explicit tactical roles/telegraphs/safe intents with no live runtime change.

Evidence: pre-PR head `51a6bb26fd0aabb9400de921ef0351d4deb8afe8`; run `38315199129`, job `115030050802`; final PR head `71eaccdd4682e53ee13006b7fe1b70f5033e3bc6`; PR CI `38315423545`; PR Android `38315423642`; canonical `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`; main CI `38315550962`; main Android `38315550956`; Pages `38315617546` — GREEN.

### J3C-B — Controlled Live Advanced Formation Adoption
Adopted WEDGE/ORBIT/SPIRAL through the existing J3B director. PINCER/X_CROSS/SERPENTINE/SPIRAL use 2 live members; WEDGE/ORBIT use 3. Existing spawn opportunities and current remaining capacity remain authoritative. Pending assembly cannot overcommit and expires safely. Advanced adoption is independently configurable for Campaign/Infinite.

Evidence: pre-PR head `2e1c69580443273911358383800f6e324f0ba77f`; run `38317062905`, job `115036102323`; final PR head `eba0d94663c217ee56986f0d7ca86c4d873f08f3`; PR CI `38317340298`; PR Android `38317340308`; canonical `5c345672b5365dbcc983403f73da62555489a98f`; main CI `38317440415`; main Android `38317440420`; Pages `38317520671` — GREEN.

### J3C-C — Stateful Tactical Patterns
Status: **DEFERRED / NOT CURRENTLY JUSTIFIED**.

Convoy/leader-follower, fake retreat, portal ambush, encirclement and staggered-artillery patterns require a future dedicated issue demonstrating a distinct tactical question, bounded extra state and no cap/budget inflation. They were not needed to close J3.

### J3D — Enemy Formation Telegraph, Fairness & Integration Certification
Certification-only closure of the complete six-route J3 formation system. Final PR changed exactly two certification tests and zero runtime/gameplay source files.

Certified:
- route-specific telegraph kind/severity/laneCount/safeIntent for all six routes;
- lead-in progress = 0 before start;
- exact route-duration completion and exact recovery boundary;
- finite in-bounds 2/3-member trajectories;
- WEDGE/ORBIT 3-member capacity safety;
- pending assembly capacity safety and safe expiry;
- one active/assembling group;
- Campaign/Infinite policy independence;
- excluded milestone/evolved/elite/miniboss/boss paths;
- simulation-time ownership, pause/photo safety, Hydro cancellation and reset seams;
- movement replacement rather than stacking;
- no second runtime/array/map/full scan/spawn authority;
- player/FOTON formation isolation;
- deterministic bounded long route-plan sequences;
- no cap/budget/score/economy/damage/projectile/J1/J2/GAIA/FOTON GLB regression.

A first pre-cert attempt failed only because the static test demanded the literal syntax `if (enemy.enemyFormation)`. The live runtime already used `const formationMotion = enemy.enemyFormation ? projectLiveEnemyFormationMotion(...) : null` followed by `if (formationMotion && !formationMotion.complete)`, which correctly replaces legacy movement. The static assertion was corrected to test that semantic seam; runtime remained untouched.

Exact evidence:
- baseline `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- corrected pre-PR head `04dc77aef159dfe3ea0b2c635fc8573353140b25`;
- pre-PR run `38320496667`, job `115047172319` — GREEN including Android/APK/J3D scope guard;
- final PR head `09d0f355acc2e93487cfa5d641b7c642820abcd6`;
- PR CI `38320727930` — GREEN on exact final head;
- manual Android branch run `38486336058`, job `115600790747` — GREEN on exact final head;
- branch APK artifact `orbi-energy-swarm-debug-09d0f355acc2e93487cfa5d641b7c642820abcd6`;
- squash canonical `7273d447bbdcb084499fb121122aac6d34928d41`, single parent `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- main CI `38320885204` — GREEN on exact canonical;
- manual Android main run `38485843331`, job `115599171557` — GREEN on exact canonical;
- main APK artifact `orbi-energy-swarm-debug-7273d447bbdcb084499fb121122aac6d34928d41`;
- Pages `38320970197` — build + deploy GREEN on exact canonical.

Issue #310 is CLOSED / completed. J3D is **DEPLOYED / FROZEN**.

## Documentation canonicals around J3
- DOC11 — J3B activation continuity: `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- DOC12 — J3C-B activation continuity: `f85e2432934454da191dea9bd0c9da43bbce86ca`;
- DOC13 — J3C-B closure & J3D activation: `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- DOC14 — J3D closure & J4 activation: Issue #312, branch `docs/es-13-j3d-closure-j4-activation`, documentation-only closure in progress from gameplay canonical `7273d447bbdcb084499fb121122aac6d34928d41`.

## Resolved diagnostics
- #254 CLOSED / NOT PLANNED: historical platform failure was not an I5 pause regression; no product merge.
- #283 CLOSED / NOT PLANNED: stale-chat false start; no branch/product work.

## Frozen manual/physical blockers
Remain OPEN and deferred while ES-13 materially changes gameplay:
- #4 — visual/responsive certification;
- #5 — Infinite play-feel;
- #202 — GAIA physical runtime/performance;
- #248 — Android real-device certification.

Automated CI never substitutes for required human/device evidence.

## Next planned gameplay

### ES-13J4 — Tactical Enemy Families
Status: **NEXT ENGINEERING TARGET AFTER DOC14 CLOSURE**.

Candidate families: Shield Phalanx, Reflector Drone, Jammer, Mine Layer, Artillery Carrier, Warp Ambusher, Swarm Leech, Energy Vampire, Formation Breaker, Commander, Repair Drone, Stealth Hunter, Siege Fortress, Parasite Queen and Mirror Drone.

J4 must be decomposed into bounded slices. Prefer a pure deterministic contract first, then narrow live adoption. Every family must create a new tactical decision rather than merely raising HP/damage or entity/projectile density.

## Program sequence
`J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`
