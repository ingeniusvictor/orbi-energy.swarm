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
- low-frequency HUD chain/resonance/tier/multiplier;
- no active Overdrive yet.

Diagnostic note:
- exact reproduction proved two historical reward-routing assertions were stale;
- Issue #254 pause hypothesis was closed NOT PLANNED with no product merge.

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
Implemented new pure module `src/game/combatOverdrive.ts`:
- `OVERDRIVE_DURATION_MS = 8000`;
- `OVERDRIVE_REENTRY_LOCK_MS = 4000`;
- activation requires explicit Resonance readiness;
- successful activation emits one-shot `consumeResonance` signal;
- J1 Resonance core remains untouched;
- repeated activation while active cannot stack/refresh/extend;
- exact simulation-time expiry at `nowMs >= endsAtMs`;
- exact re-entry boundary;
- projection for active/remaining/lock state;
- fresh reset, invalid-time rejection and immutable transitions;
- no live runtime/HUD, combat buffs, VFX/audio, entities/scans, caps/budgets or tuning.

Evidence:
- pre-PR `38288374752`, job `114942126186` GREEN;
- PR #261 head `565b94bf9bf873a9280ef2ca123e3dcbd88d98ad`;
- PR CI `38288795483` GREEN;
- PR Android `38288795462` GREEN;
- canonical `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`;
- main CI `38288929402` GREEN;
- main Android `38288929417` GREEN;
- Pages `38289009730`, build `114944244748`, deploy `114944343151` GREEN.

## Documentation continuity milestones

### ES-13DOC — Persistent Gameplay Roadmap & Continuity Ledger
Issue #255 / PR #256 — established continuity files, handoff template, roadmap status, traceability policy and closure checklist.

### ES-13DOC2 — J1B Closure Ledger & J2 Activation
Issue #258 / PR #259 — CLOSED / MERGED. Documentation-only main successor `113842b3747827585fa32f90db4c2759828e302c`; main CI `38287807460` GREEN; Pages `38287871927` GREEN.

### ES-13DOC3 — J2A Closure Ledger & J2B Activation
Issue #262 — ACTIVE DOCUMENTATION at this ledger update. Baseline gameplay canonical `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`.

## Next gameplay phase

### ES-13J2B — Live Overdrive Activation & HUD
Status: NEXT / NOT YET IMPLEMENTED

Target:
- adopt J2A state into live runtime using simulation time;
- explicit player activation only when certified readiness + J2A permission allow it;
- consume Resonance exactly once on successful activation;
- low-frequency HUD active/countdown/lock projection;
- reset on new run/restart;
- pause/photo/lifecycle must not consume wall-clock time;
- no combat benefit yet (J2C);
- no VFX/audio identity yet (J2D).

## Remaining ES-13 chronology
1. J2B — Live Activation & HUD
2. J2C — Combat Expression Layer
3. J2D — Reactive VFX/Audio & Safety
4. J2E — Overdrive Integration Certification
5. J3 — Advanced Enemy Formation Director
6. J4 — Tactical Enemy Families
7. J5 — Priority Targets & Chain Reactions
8. J6 — Dynamic Mid-Sector Events
9. J7 — Bonus Challenge Rounds
10. J8 — Additional Game Modes
11. J9 — Boss & Miniboss Expansion
12. J10 — Expert Risk/Reward
13. J11 — Build & Synergy Expansion
14. J12 — Rare Events & Secret Encounters
15. J13 — Score, Rank & Mastery
16. J14 — Procedural Interaction Matrix
17. J15 — Integration & Long-Range Balance Certification

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