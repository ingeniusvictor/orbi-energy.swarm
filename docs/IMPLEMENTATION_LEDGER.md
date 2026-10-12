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
Pure deterministic core:
- 2.2 s chain window;
- affinity diversity gains;
- tiers `QUIET → SYNCED → HARMONIC → SURGING → OVERDRIVE_READY`;
- score projection capped at 2×;
- elite/boss weighting;
- bounded damage break;
- chain cap 999 / resonance cap 100;
- no React/audio/storage/entity scans.

Evidence:
- pre-PR `38273358267`;
- PR CI `38273679009`;
- PR Android `38273679054`;
- main CI `38273920992`;
- main Android `38273919797`;
- Pages `38274024789` — GREEN.

### J1B — Live Combat Resonance Adoption & HUD
Implemented:
- direct+splash defeat routing through `registerCombatDefeat()`;
- projectile affinity attribution;
- `getEnemyScoreReward(enemy)` retained as base reward authority;
- J1A awarded-score live projection;
- damage break post-invincibility guard;
- simulation-time chain expiry;
- fresh-run reset;
- low-frequency HUD chain/resonance/tier/multiplier.

Evidence:
- pre-PR `38285523692`, job `114932841692`;
- PR #257 head `22e2bf380374f2e9933dbec76086855d1ae09a94`;
- PR CI `38287053826`;
- PR Android `38287053915`;
- canonical `91564e365d0a2220e4db2999e38372809ec397f3`;
- main CI `38287238136`;
- main Android `38287238150`;
- Pages `38287336600` — GREEN.

### J2A — ORBI Overdrive Pure State Contract
Implemented `src/game/combatOverdrive.ts`:
- 8 s active duration;
- 4 s post-window re-entry lock;
- explicit Resonance readiness;
- one-shot `consumeResonance` signal;
- no stacking/refresh/extension;
- deterministic simulation-time expiry/re-entry boundary;
- reset, invalid-time rejection and immutable transitions;
- no runtime/HUD/buffs/VFX/audio/entity work.

Evidence:
- pre-PR `38288374752`, job `114942126186` GREEN;
- PR CI `38288795483` GREEN;
- PR Android `38288795462` GREEN;
- canonical `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`;
- main CI `38288929402` GREEN;
- main Android `38288929417` GREEN;
- Pages `38289009730` GREEN.

### J2B — Live Overdrive Activation & HUD
Implemented:
- live adoption of J2A state/timing helpers with no duplicate clock;
- high-frequency Overdrive state in a ref;
- low-frequency HUD projection on existing cadence;
- simulation-time activation/expiry/re-entry;
- explicit `O` hotkey + HUD pointer/touch action;
- guards for not-playing, game-over, pause, Photo Mode and upgrade selection;
- readiness rechecked from J1 Resonance plus J2A `canActivate`;
- successful activation consumes Resonance once while preserving chain/best-chain/affinity state;
- fresh-run/restart reset;
- compact `READY / ACTIVE / RECHARGING / CHARGE` HUD states;
- no buff, VFX/audio, scans, cap/budget, Campaign/Infinite, FOTON or GAIA change.

Regression-contract chronology:
- repository-smoke diagnostics showed exactly three historical assertions became stale after legitimate live adoption;
- J1B publication coverage was tightened to only reset + HUD cadence + accepted activation consumption;
- J1B remains readiness-only;
- J2A remains timing/state authority, and live code is prohibited from importing/duplicating duration/re-entry constants.

Evidence:
- pre-PR `38293627094`, job `114959353674` GREEN;
- clean PR head `e43a1d3f4f4a7801fb836055cbf23176992dc74b`;
- PR CI `38294148486` GREEN;
- PR Android `38294148448` GREEN;
- canonical `466242e91fa927bc4d996d09efdbb87f8f572d44`;
- main CI `38294331547` GREEN;
- main Android `38294331726` GREEN;
- Pages `38294411795` build + deploy GREEN.

## Documentation continuity milestones

### ES-13DOC — Persistent Gameplay Roadmap & Continuity Ledger
Issue #255 / PR #256 — established repository-native continuity, roadmap, traceability and closure rules.

### ES-13DOC2 — J1B Closure Ledger & J2 Activation
Issue #258 / PR #259 — documentation-only main successor `113842b3747827585fa32f90db4c2759828e302c`; main CI `38287807460` GREEN; Pages `38287871927` GREEN.

### ES-13DOC3 — J2A Closure Ledger & J2B Activation
Issue #262 / PR #263 — CLOSED / MERGED. Documentation-only main successor `a485e52542b3d097511789c15f1a7afcb6ba5cb0`.

### ES-13DOC4 — J2B Closure Ledger & J2C Activation
Issue #268 — ACTIVE DOCUMENTATION at this ledger update. Baseline gameplay canonical `466242e91fa927bc4d996d09efdbb87f8f572d44`.

## Next gameplay phase

### ES-13J2C — Bounded Overdrive Combat Expression
Status: NEXT / NOT YET IMPLEMENTED

Target:
- preserve J2A/J2B as authoritative activation/timing state;
- define bounded combat-effect projection with no second timer;
- apply benefit only during certified active Overdrive;
- prefer modest offensive expression over unrestricted amplification;
- keep score/economy effects bounded and explicit if introduced;
- no entity scans or cap/projectile-budget bypass;
- preserve pause/photo/lifecycle simulation-time behavior;
- no VFX/audio identity yet (J2D).

## Remaining ES-13 chronology
1. J2C — Bounded Combat Expression
2. J2D — Reactive VFX/Audio & Safety
3. J2E — Overdrive Integration Certification
4. J3 — Advanced Enemy Formation Director
5. J4 — Tactical Enemy Families
6. J5 — Priority Targets & Chain Reactions
7. J6 — Dynamic Mid-Sector Events
8. J7 — Bonus Challenge Rounds
9. J8 — Additional Game Modes
10. J9 — Boss & Miniboss Expansion
11. J10 — Expert Risk/Reward
12. J11 — Build & Synergy Expansion
13. J12 — Rare Events & Secret Encounters
14. J13 — Score, Rank & Mastery
15. J14 — Procedural Interaction Matrix
16. J15 — Integration & Long-Range Balance Certification

Post-J15: ES-14 — Living Warfront.

## Open manual/physical blockers
Still open and not replaceable by CI:
- #4 visual/responsive;
- #5 Infinite play-feel;
- #202 GAIA physical runtime/performance;
- #248 Android real-device.

Full final RC evidence remains deferred while ES-13 changes gameplay.

## Maintenance rule
For every merged gameplay phase record exact canonical, Issue/PR, implementation outcome, pre-PR cert, PR CI/Android, main CI/Android/Pages, unresolved follow-ups and roadmap transition. Never record DEPLOYED merely because a PR merged.