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

Initial cert `38295319991` failed only because a raw source-purity regex matched a comment. Corrected pre-PR cert `38295483032`, job `114965401785`; head `992612a5315e87813e2e9d4e269a635806753e38`; PR CI `38295901224`; PR Android `38295901194`; main CI `38296053435`; main Android `38296053642`; Pages `38296151229` — GREEN.

### J2C-B — Live Bounded Damage Adoption
`projectCombatOverdriveEffects()` adopted exactly once at centralized player-projectile damage resolution after existing base/profile/GAIA/critical resolution.

Evidence: pre-PR `38297477355`, job `114971948257`; head `02d4296bd288860362eeb0502c387d801a31e45c`; PR CI `38297915036`; PR Android `38297913596`; main CI `38298120771`; main Android `38298120436`; Pages `38298206493` — GREEN.

### J2D-A — Pure Presentation Profile
Pure `combatOverdrivePresentation.ts`: active/remainingRatio/quality in; neutral inactive output; bounded quality profiles; max ring count 3; activation pulse from certified remaining ratio; no second timer or live side effects.

Evidence: pre-PR `38299553187`, job `114978848191`; head `5a70b0d55122ddf95b9af303dd24624f57b2f216`; PR CI `38299974128`; PR Android `38299974261`; main CI `38300161662`; main Android `38300161573`; Pages `38300237659` — GREEN.

### J2D-B — Live Reactive Presentation Adoption
Live runtime now consumes J2D-A projection and adds bounded direct Canvas2D field tint + collective FOTON/swarm halo/rings. No particles/entity arrays/scans were added. A short procedural TACTICAL-lane stinger runs only after successful explicit Overdrive activation and remains mute/user-gesture safe. No new clock/timer authority and no gameplay tuning/cap/budget changes.

Certification chronology:
- first cert `38301784513`, job `114986181271` failed Repository Smoke only because 3 tests were too literal: J2B generic sound prohibition did not yet allow the sanctioned J2D-B stinger, a comment word matched a raw particle regex, and a mount-effect text marker was formatting-fragile. No product commit was produced;
- contracts were made semantic/stricter rather than weakened;
- successful pre-PR cert `38302074362`, job `114987146051` GREEN across repo/gameplay/platform/typecheck/release/dossier/build/readiness/Android/APK/scope/materialization;
- clean PR head `c96954ffabc1c6330bbbe2736b90456537878c10`;
- PR CI `38302405528` GREEN;
- PR Android `38302405569` GREEN;
- canonical `9743890d98b33d365cbc18a048015f3815b144e5`;
- main CI `38302618451` GREEN;
- main Android `38302618447` GREEN;
- Pages `38302704724` GREEN.

## Documentation continuity milestones
- ES-13DOC — #255 / PR #256: persistent roadmap/continuity policy.
- DOC2 — #258 / PR #259: J1B closure + J2 activation; successor `113842b3747827585fa32f90db4c2759828e302c`.
- DOC3 — #262 / PR #263: J2A closure + J2B activation; successor `a485e52542b3d097511789c15f1a7afcb6ba5cb0`.
- DOC4 — #268 / PR #269: J2B closure + J2C activation; successor `681442b08718e53fcf29a90dde94b4bb398c2d9f`.
- DOC5 — #273 / PR #275: J2C-A closure + J2C-B activation; successor `5d80833c71f8fe0c31f58945ed5cabb5f40b85b4`.
- DOC6 — #279 / PR #280: J2C-B closure + J2D activation; successor `efd212c7ea2a93e166d719721680fd5d88df402d`.
- DOC7 — #284 / PR #285: J2D-A closure + J2D-B activation; successor `51fff02e687a2ce88a9c3e727edfb4de2c42f4b6`.
- DOC8 — #288: ACTIVE documentation at this ledger update; baseline gameplay canonical `9743890d98b33d365cbc18a048015f3815b144e5`.

Resolved stale/diagnostic issues: #254 CLOSED NOT_PLANNED; #283 CLOSED NOT_PLANNED; neither produced a product merge.

## Next gameplay phase

### ES-13J2E — Overdrive Integration Certification
Status: NEXT / NOT YET IMPLEMENTED

Target:
- deterministic J1 Resonance → J2 activation → J2C damage → J2D presentation integration regressions;
- exact activation/expiry/re-entry boundaries;
- accepted damage vs Resonance / active Overdrive authority;
- pause/photo/lifecycle simulation-time safety;
- fresh-run reset of Resonance + Overdrive;
- no extra score multiplier, damage stacking or presentation gameplay side effects;
- long deterministic sequences for bounded finite state;
- no tuning change unless a dedicated demonstrated defect requires correction;
- full repo/gameplay/platform/typecheck/release/dossier/build/readiness/Android/scope and exact-SHA PR/main/Pages certification.

After J2E: J3 Advanced Enemy Formation Director.

## Remaining ES-13 chronology
J2E → J3 Advanced Formations → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance.

Post-J15: ES-14 Living Warfront.

## Open manual/physical blockers
#4 visual/responsive, #5 Infinite play-feel, #202 GAIA physical runtime/performance, #248 Android real-device remain OPEN. Full final RC evidence stays deferred while ES-13 changes gameplay.

## Maintenance rule
For every merged gameplay phase record exact canonical, Issue/PR, implementation outcome, pre-PR cert, PR CI/Android, main CI/Android/Pages, unresolved follow-ups and roadmap transition. Never record DEPLOYED merely because a PR merged.