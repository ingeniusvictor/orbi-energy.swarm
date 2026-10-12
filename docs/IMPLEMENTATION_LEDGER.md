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
| ES-12I1 — Web Distribution Lock & Installable PWA | FROZEN | `c9ab02b10383a666df2b317d2b2e9cd534a90356` | #240 | #241 |
| ES-12I2 — Android Packaging Foundation / Capacitor 8 | FROZEN | `57a9d0100a218295032d4898529600df2cd10905` | #242 | #243 |
| ES-12I3 — RC Readiness Gate & Evidence Ledger | FROZEN | `7d6f5b0a54b59d97a7b3883abf53f6035e82518a` | #244 | #245 |
| ES-12I4 — Manual Certification Evidence Dossier | FROZEN | `6cae3eda798cd754a0f47aa7a927fbe59749de30` | #246 | #247 |
| ES-12I5 — First-frame / startup safety | FROZEN | `6901c67eaf369c3b41dba5d60480ad7d173275a7` | #249 | #250 |
| ES-13J1A — Combat Chain & Resonance Core | DEPLOYED / FROZEN | `feb263957b52839d35a7cb1249762c223ba22595` | #251 | #252 |
| ES-13J1B — Live Combat Resonance Adoption & HUD | DEPLOYED / FROZEN | `91564e365d0a2220e4db2999e38372809ec397f3` | #253 | #257 |
| ES-13J2A — ORBI Overdrive Pure State Contract | DEPLOYED / FROZEN | `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7` | #260 | #261 |
| ES-13J2B — Live Overdrive Activation & HUD | DEPLOYED / FROZEN | `466242e91fa927bc4d996d09efdbb87f8f572d44` | #264 | #267 |
| ES-13J2C-A — Pure Bounded Overdrive Combat Expression | DEPLOYED / FROZEN | `eca68cce510cf506053fd6d9121b501db7cd1f64` | #271 | #272 |
| ES-13J2C-B — Live Bounded Overdrive Damage Adoption | DEPLOYED / FROZEN | `7e15ee1e79ee9ae8903891a66b0b1031b0600bca` | #276 | #278 |
| ES-13J2D-A — Pure Overdrive Presentation Profile | DEPLOYED / FROZEN | `39f9b33c9a229c7c8d991aecd81ea695510c82a0` | #281 | #282 |

## ES-12 evidence anchors

### I4
- main CI `38208264830` GREEN;
- Android `38208264879` GREEN;
- Pages `38208313953` GREEN;
- Android artifact ID `11728093302`.

### I5
Corrected first-frame suspended render safety, Eclipse TDZ usage and premature unmuted BGM startup.
- branch cert `38264942317`;
- PR CI `38265445991`;
- PR Android `38265446421`;
- main CI `38265745892`;
- main Android `38265745833`;
- Pages `38265853615` — all GREEN.

## ES-13 gameplay ledger

### J1A — Combat Chain & Resonance Core
Pure deterministic core: 2.2 s chain window, affinity diversity, resonance tiers, score projection capped at 2×, elite/boss weighting, bounded damage break, chain cap 999, resonance cap 100, no React/audio/storage/entity scans.

Evidence: pre-PR `38273358267`; PR CI `38273679009`; PR Android `38273679054`; main CI `38273920992`; main Android `38273919797`; Pages `38274024789` — GREEN.

### J1B — Live Combat Resonance Adoption & HUD
Direct+splash defeat routing, projectile affinity attribution, J1A awarded-score live projection, post-invincibility damage break, simulation-time chain expiry, fresh-run reset and low-frequency HUD projection.

Evidence: pre-PR `38285523692`, job `114932841692`; PR head `22e2bf380374f2e9933dbec76086855d1ae09a94`; PR CI `38287053826`; PR Android `38287053915`; canonical `91564e365d0a2220e4db2999e38372809ec397f3`; main CI `38287238136`; main Android `38287238150`; Pages `38287336600` — GREEN.

### J2A — ORBI Overdrive Pure State Contract
Pure deterministic `combatOverdrive.ts`: 8 s active duration, 4 s re-entry lock, explicit readiness, one-shot `consumeResonance`, no stacking/refresh, simulation-time expiry/re-entry, reset and immutable transitions. No live adoption/buffs/VFX/audio/entity work.

Evidence: pre-PR `38288374752`, job `114942126186`; PR CI `38288795483`; PR Android `38288795462`; canonical `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`; main CI `38288929402`; main Android `38288929417`; Pages `38289009730` — GREEN.

### J2B — Live Overdrive Activation & HUD
Live J2A timing/state adoption with ref-owned high-frequency state, simulation-time lifecycle, explicit `O` + HUD activation, gameplay guards, one-shot Resonance consumption, fresh-run reset and compact READY/ACTIVE/RECHARGING HUD. No combat benefit/VFX/audio/scans/cap-budget changes.

Evidence: pre-PR `38293627094`, job `114959353674`; clean head `e43a1d3f4f4a7801fb836055cbf23176992dc74b`; PR CI `38294148486`; PR Android `38294148448`; canonical `466242e91fa927bc4d996d09efdbb87f8f572d44`; main CI `38294331547`; main Android `38294331726`; Pages `38294411795` — GREEN.

### J2C-A — Pure Bounded Overdrive Combat Expression
Pure `combatOverdriveEffects.ts` projection: inactive `1.0`, active `1.20`, hard ceiling `1.25`, deterministic/non-stacking, no score/economy/fire-rate/projectile-count/speed/crit/defense/entity-budget mutation.

Certification chronology:
- initial cert `38295319991`, job `114964869404` failed only because a raw `/React/` source-purity regex matched a comment; no product defect;
- corrected pre-PR cert `38295483032`, job `114965401785` GREEN;
- clean head `992612a5315e87813e2e9d4e269a635806753e38`;
- PR CI `38295901224` GREEN;
- PR Android `38295901194` GREEN;
- canonical `eca68cce510cf506053fd6d9121b501db7cd1f64`;
- main CI `38296053435` GREEN;
- main Android `38296053642` GREEN;
- Pages `38296151229` GREEN.

### J2C-B — Live Bounded Overdrive Damage Adoption
Adopted `projectCombatOverdriveEffects()` at the centralized player-projectile damage seam. Existing base/profile/GAIA/critical resolution remains first; certified Overdrive damage multiplier applies exactly once before projectile assignment. No timing/state/fire-rate/projectile-count/speed/score/cap-budget/Campaign/Infinite/FOTON/GAIA change.

Evidence: pre-PR `38297477355`, job `114971948257`; clean head `02d4296bd288860362eeb0502c387d801a31e45c`; PR CI `38297915036`; PR Android `38297913596`; canonical `7e15ee1e79ee9ae8903891a66b0b1031b0600bca`; main CI `38298120771`; main Android `38298120436`; Pages `38298206493` — GREEN.

### J2D-A — Pure Overdrive Presentation Profile Contract
Implemented pure `combatOverdrivePresentation.ts`:
- consumes only certified `active`, `remainingRatio` and `QualityPreset`;
- inactive projection exactly neutral;
- quality-bounded presentation profiles for LOW/MEDIUM/HIGH/ULTRA;
- max direct canvas ring count = 3;
- activation pulse derived only from certified remaining-ratio window, with no independent timer;
- ratios clamp to `[0,1]`, non-finite input fails closed;
- immutable caller input;
- no live renderer/audio adoption;
- no React/DOM/canvas/WebAudio/storage/random/entity scans;
- no J2A timing or J2C damage tuning duplication.

Evidence:
- pre-PR certification `38299553187`, job `114978848191` GREEN;
- clean PR head `5a70b0d55122ddf95b9af303dd24624f57b2f216`;
- PR CI `38299974128` GREEN;
- PR Android `38299974261` GREEN;
- canonical `39f9b33c9a229c7c8d991aecd81ea695510c82a0`;
- main CI `38300161662` GREEN;
- main Android `38300161573` GREEN;
- Pages `38300237659` build + deploy GREEN.

## Documentation continuity milestones
- ES-13DOC — Issue #255 / PR #256: established persistent roadmap/continuity/traceability policy.
- ES-13DOC2 — Issue #258 / PR #259: J1B closure + J2 activation; main successor `113842b3747827585fa32f90db4c2759828e302c`.
- ES-13DOC3 — Issue #262 / PR #263: J2A closure + J2B activation; successor `a485e52542b3d097511789c15f1a7afcb6ba5cb0`.
- ES-13DOC4 — Issue #268 / PR #269: J2B closure + J2C activation; successor `681442b08718e53fcf29a90dde94b4bb398c2d9f`.
- ES-13DOC5 — Issue #273 / PR #275: J2C-A closure + J2C-B activation; successor `5d80833c71f8fe0c31f58945ed5cabb5f40b85b4`.
- ES-13DOC6 — Issue #279 / PR #280: J2C-B closure + J2D activation; successor `efd212c7ea2a93e166d719721680fd5d88df402d`.
- ES-13DOC7 — Issue #284: ACTIVE DOCUMENTATION at this ledger update; baseline gameplay canonical `39f9b33c9a229c7c8d991aecd81ea695510c82a0`.

Issue #283 is CLOSED / NOT PLANNED: opened from stale chat state during UI interruption; produced no branch/merge.

## Next gameplay phase

### ES-13J2D-B — Live Reactive Overdrive Presentation Adoption
Status: NEXT / NOT YET IMPLEMENTED

Target:
- consume certified J2D-A presentation projection in existing canvas/HUD/audio paths;
- no duplicate Overdrive timing/damage/presentation tuning constants;
- bounded activation stinger and active-state visual identity;
- no mount-time or autoplay-unsafe audio;
- respect mute, pause/photo/lifecycle/reset and simulation-time authority;
- low/mobile quality remains bounded; no uncontrolled particle/entity growth;
- preserve HUD/objective/boss/threat readability;
- no Campaign/Infinite/FOTON/GAIA or cap/budget changes.

After J2D-B: J2E Integration Certification, then J3 Advanced Enemy Formation Director.

## Remaining ES-13 chronology
1. J2D-B — Live Reactive VFX/Audio Adoption
2. J2E — Overdrive Integration Certification
3. J3 — Advanced Enemy Formation Director
4. J4 — Tactical Enemy Families
5. J5 — Priority Targets & Chain Reactions
6. J6 — Dynamic Mid-Sector Events
7. J7 — Bonus Challenge Rounds
8. J8 — Additional Game Modes
9. J9 — Boss & Miniboss Expansion
10. J10 — Expert Risk/Reward
11. J11 — Build & Synergy Expansion
12. J12 — Rare Events & Secret Encounters
13. J13 — Score, Rank & Mastery
14. J14 — Procedural Interaction Matrix
15. J15 — Integration & Long-Range Balance Certification

Post-J15: ES-14 — Living Warfront.

## Open manual/physical blockers
Still open and not replaceable by CI: #4 visual/responsive, #5 Infinite play-feel, #202 GAIA physical runtime/performance, #248 Android real-device.

Full final RC evidence remains deferred while ES-13 changes gameplay.

## Maintenance rule
For every merged gameplay phase record exact canonical, Issue/PR, implementation outcome, pre-PR cert, PR CI/Android, main CI/Android/Pages, unresolved follow-ups and roadmap transition. Never record DEPLOYED merely because a PR merged.