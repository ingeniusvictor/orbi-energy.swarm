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

## ES-12 evidence anchors

### I4
Main CI `38208264830`, Android `38208264879`, Pages `38208313953` GREEN. Android artifact ID `11728093302`.

### I5
Corrected first-frame suspended render safety, Eclipse TDZ usage and premature unmuted BGM startup. Branch cert `38264942317`; PR CI `38265445991`; PR Android `38265446421`; main CI `38265745892`; main Android `38265745833`; Pages `38265853615` — GREEN.

## ES-13 gameplay ledger

### J1A — Combat Chain & Resonance Core
Pure deterministic core: 2.2 s chain window, affinity diversity, resonance tiers, score projection capped at 2×, elite/boss weighting, bounded damage break, chain cap 999, resonance cap 100.

Evidence: pre-PR `38273358267`; PR CI `38273679009`; PR Android `38273679054`; main CI `38273920992`; main Android `38273919797`; Pages `38274024789` — GREEN.

### J1B — Live Resonance Adoption & HUD
Direct+splash defeat routing, projectile affinity attribution, J1A awarded-score projection, post-invincibility damage break, simulation-time expiry/reset and low-frequency HUD projection.

Evidence: pre-PR `38285523692`, job `114932841692`; PR head `22e2bf380374f2e9933dbec76086855d1ae09a94`; PR CI `38287053826`; PR Android `38287053915`; main CI `38287238136`; main Android `38287238150`; Pages `38287336600` — GREEN.

### J2A — Overdrive Pure State Contract
Pure deterministic 8 s active + 4 s re-entry state contract, explicit readiness, one-shot Resonance consumption signal, simulation-time boundaries, reset and immutable transitions.

Evidence: pre-PR `38288374752`, job `114942126186`; PR CI `38288795483`; PR Android `38288795462`; main CI `38288929402`; main Android `38288929417`; Pages `38289009730` — GREEN.

### J2B — Live Activation & HUD
Ref-owned live Overdrive state, explicit `O` + HUD activation, simulation-time lifecycle, one-shot Resonance consumption, reset and READY/ACTIVE/RECHARGING HUD.

Evidence: pre-PR `38293627094`, job `114959353674`; head `e43a1d3f4f4a7801fb836055cbf23176992dc74b`; PR CI `38294148486`; PR Android `38294148448`; main CI `38294331547`; main Android `38294331726`; Pages `38294411795` — GREEN.

### J2C-A — Pure Bounded Combat Expression
Pure damage projection: inactive `1.0`, active `1.20`, hard ceiling `1.25`, deterministic/non-stacking, no score/economy/fire-rate/projectile-count/speed/crit/defense/budget mutation.

Corrected pre-PR cert `38295483032`, job `114965401785`; head `992612a5315e87813e2e9d4e269a635806753e38`; PR CI `38295901224`; PR Android `38295901194`; main CI `38296053435`; main Android `38296053642`; Pages `38296151229` — GREEN.

### J2C-B — Live Bounded Damage Adoption
`projectCombatOverdriveEffects()` adopted exactly once at centralized player-projectile damage resolution after existing base/profile/GAIA/critical resolution.

Evidence: pre-PR `38297477355`, job `114971948257`; head `02d4296bd288860362eeb0502c387d801a31e45c`; PR CI `38297915036`; PR Android `38297913596`; main CI `38298120771`; main Android `38298120436`; Pages `38298206493` — GREEN.

### J2D-A — Pure Presentation Profile
Pure quality-bounded presentation projection with neutral inactive output, max direct ring count 3, activation pulse from certified remaining ratio and no second timer or side effects.

Evidence: pre-PR `38299553187`, job `114978848191`; head `5a70b0d55122ddf95b9af303dd24624f57b2f216`; PR CI `38299974128`; PR Android `38299974261`; main CI `38300161662`; main Android `38300161573`; Pages `38300237659` — GREEN.

### J2D-B — Live Reactive Presentation Adoption
Live runtime consumes J2D-A projection and adds bounded direct Canvas2D field tint + collective FOTON/swarm halo/rings. No particles/entity arrays/scans were added. Short TACTICAL-lane activation stinger remains user-gesture/mute safe. No timer/gameplay/cap/budget changes.

Evidence: successful pre-PR cert `38302074362`, job `114987146051`; clean PR head `c96954ffabc1c6330bbbe2736b90456537878c10`; PR CI `38302405528`; PR Android `38302405569`; main CI `38302618451`; main Android `38302618447`; Pages `38302704724` — GREEN.

### J2E — Overdrive Integration Certification
Certification-only closure of J1/J2. Final gameplay diff added two tests and changed no runtime source. It certified readiness → activation/consumption → bounded damage/presentation → exact 8 s expiry + 4 s lock, non-stacking activation, damage interaction, fresh-run reset, pause safety, long deterministic bounded sequences and live pure-module adoption.

Evidence: pre-PR head `eba9a30f627875103f53a49e27069eff2a3c3861`; run `38303651696`, job `114992339524`; final PR head `0dcd9b4533976a43f872d6b070607076c6336b48`; PR CI `38308946054`; PR Android `38309446296`; canonical `bf0e6a858e3c96091c002ea623b29eb5c260c6ea`; main CI `38309074528`; main Android `38309218634`; Pages `38309135916` — GREEN.

### J3A — Pure Enemy Formation Route Contract
Added a pure enemy-only route projection authority, separate from player/FOTON `formations.ts`. Initial vocabulary: `PINCER`, `X_CROSS`, `SERPENTINE`; caller supplies route/member slot/count/normalized progress/mirror and receives bounded normalized position plus phase/role/telegraph metadata. Local member cap 8; route extent ±1.25; invalid inputs fail closed. No runtime adoption, entity ownership, RNG/time authority, Campaign/Infinite logic, caps/budgets, projectile tuning, player formations, J1/J2, GAIA or FOTON GLB changes.

Files:
- `src/game/enemyFormationRoutes.ts`;
- `tests/gameplay/enemy-formation-routes.test.ts`;
- `tests/es-13j3a-enemy-formation-route-contract.test.mjs`.

Evidence: pre-PR head `685d0c498615a35f659cf8f7c8b231c85a8e6e0e`; run `38310490857`, job `115014740153`; final PR head `5e01e4d21bf1cdc185a8755e16006a2ee70ca89c`; PR CI `38310847060`; PR Android `38310847054`; canonical `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be`, parent `40bff2cb7b2d109cb13bf1142c76e0238e1d0d19`; main CI `38310975108`; main Android `38310975021`; Pages `38311040652` — GREEN.

### J3B — Live Enemy Formation Director Adoption
Adopted J3A through the existing regular-enemy spawn/movement seam. The live director owns no entity array: one `useRef` state plus optional per-enemy assignment metadata is sufficient. First slice uses ordinary CRAWLER/SPLITTER pairs only, consumes existing spawn opportunities/capacity, and cycles PINCER/X_CROSS/SERPENTINE. Simulation time owns progress; pause/photo is safe. Assigned motion replaces legacy direct slither rather than stacking a second movement engine. Hydro slow cancels assignment. Fresh run, wave start and boss transitions reset ownership. Campaign/Infinite policy is explicit. Player/FOTON formation code remains separate.

Final files:
- `src/game/EnergySwarmGame.tsx`;
- `src/game/liveEnemyFormationDirector.ts`;
- `src/game/types.ts`;
- `tests/gameplay/live-enemy-formation-director.test.ts`;
- `tests/es-13j3b-live-enemy-formation-adoption.test.mjs`.

No extra enemy scan, extra spawn event, global cap/budget increase, score/economy/damage/projectile tuning, J1/J2 change, GAIA change or FOTON GLB change.

Evidence:
- pre-PR certified head `5085ee44e92c2bb5e020d268a0e502606309856a`;
- pre-PR run `38313865225`, job `115025740383` GREEN across repository/gameplay/platform/typecheck/release/dossier/build/readiness/Android/APK/J3B scope guard;
- final PR head `6ff07665f7245b56e9d83c6fcb882f6badbe7f59`;
- PR CI `38314059155` GREEN;
- PR Android `38314059702` GREEN;
- canonical `0fcf08dc59558619da61e1120eef2e957465f9a1`, single parent `b3584ddfef56623a353d6188f8deb5589760eb8e`;
- main CI `38314198181` GREEN;
- main Android `38314198069` GREEN;
- Pages `38314280642` build + deploy GREEN.

Temporary patch/reset/certification workflows were removed before PR. Earlier temporary workflow/guard failures were infrastructure-only; the accepted certification is the fully GREEN run above.

### J3C-A — Pure Advanced Enemy Formation Vocabulary
Expanded the existing pure J3A route projection authority with WEDGE, ORBIT and SPIRAL while preserving PINCER/X_CROSS/SERPENTINE behavior. Max local route members remains 8 and normalized extent remains ±1.25. New routes have explicit minimum counts, roles, telegraphs and safe intents. J3B live selection was intentionally not changed.

Final files:
- `src/game/enemyFormationRoutes.ts`;
- `tests/gameplay/enemy-formation-routes.test.ts`;
- `tests/es-13j3c-a-advanced-route-vocabulary.test.mjs`.

Evidence:
- pre-PR certified head `51a6bb26fd0aabb9400de921ef0351d4deb8afe8`;
- pre-PR run `38315199129`, job `115030050802` GREEN;
- final PR head `71eaccdd4682e53ee13006b7fe1b70f5033e3bc6`;
- PR CI `38315423545` GREEN;
- PR Android `38315423642` GREEN;
- canonical `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`, single parent `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- main CI `38315550962` GREEN;
- main Android `38315550956` GREEN;
- Pages `38315617546` build + deploy GREEN.

No live runtime/director/player-formation/cap/budget/score/economy/damage/projectile/J1/J2/GAIA/FOTON GLB changes. Temporary certification workflow was removed before PR.

## Documentation continuity milestones
- ES-13DOC — #255 / PR #256: persistent roadmap/continuity policy.
- DOC2 — #258 / PR #259: J1B closure + J2 activation; successor `113842b3747827585fa32f90db4c2759828e302c`.
- DOC3 — #262 / PR #263: J2A closure + J2B activation; successor `a485e52542b3d097511789c15f1a7afcb6ba5cb0`.
- DOC4 — #268 / PR #269: J2B closure + J2C activation; successor `681442b08718e53fcf29a90dde94b4bb398c2d9f`.
- DOC5 — #273 / PR #275: J2C-A closure + J2C-B activation; successor `5d80833c71f8fe0c31f58945ed5cabb5f40b85b4`.
- DOC6 — #279 / PR #280: J2C-B closure + J2D activation; successor `efd212c7ea2a93e166d719721680fd5d88df402d`.
- DOC7 — #284 / PR #285: J2D-A closure + J2D-B activation; successor `51fff02e687a2ce88a9c3e727edfb4de2c42f4b6`.
- DOC8 — #288 / PR #289: J2D-B closure + J2E activation; successor `95beb172e845794d03484e446128896a44428996`.
- DOC9 — #292 / PR #293: J2E closure + J3 activation; successor `40bff2cb7b2d109cb13bf1142c76e0238e1d0d19`.
- DOC10 — #296 / PR #297: J3A closure + J3B activation; successor `b3584ddfef56623a353d6188f8deb5589760eb8e`.
- DOC11 — #300 / PR #301: J3B closure + J3C activation; successor `31de2cd5bb89ae3032902c09ace881119c04dfec`.
- DOC12 — #304: ACTIVE documentation closure at this ledger update; baseline J3C-A gameplay canonical `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`; activates J3C-B after merge.

Resolved stale/diagnostic issues: #254 CLOSED NOT_PLANNED; #283 CLOSED NOT_PLANNED; neither produced a product merge.

## Next gameplay phase

### ES-13J3C-B — Controlled Live Adoption
Status: NEXT ENGINEERING TARGET AFTER DOC12 CLOSURE

Adopt certified WEDGE/ORBIT/SPIRAL selectively through the existing J3B live director. Route-aware member counts are required: WEDGE/ORBIT minimum 3, SPIRAL minimum 2. Do not solve this by globally increasing every formation group.

Required boundaries:
- existing regular spawn opportunities/capacity only;
- no extra entity arrays/maps/full-array scans;
- one movement authority;
- deterministic caller-owned assignment/progress;
- simulation-time pause safety;
- explicit Campaign/Infinite eligibility;
- bounded assembly and safe legacy fallback;
- no milestone/boss/evolved adoption unless separately scoped;
- no cap/budget/score/economy/damage/projectile/J1/J2/GAIA/FOTON GLB change.

J3C-C stateful patterns and J3D fairness/integration remain later phases.

## Remaining ES-13 chronology
J3C Advanced Vocabulary → J3D Telegraph/Fairness/Integration → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance.

Post-J15: ES-14 Living Warfront.

## Open manual/physical blockers
#4 visual/responsive, #5 Infinite play-feel, #202 GAIA physical runtime/performance, #248 Android real-device remain OPEN. Full final RC evidence stays deferred while ES-13 changes gameplay.

## Maintenance rule
For every merged gameplay phase record exact canonical, Issue/PR, implementation outcome, pre-PR cert, PR CI/Android, main CI/Android/Pages, unresolved follow-ups and roadmap transition. Never record DEPLOYED merely because a PR merged.