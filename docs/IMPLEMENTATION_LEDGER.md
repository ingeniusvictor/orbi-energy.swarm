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

## Key milestone evidence

### ES-12I4
- main CI `38208264830` GREEN;
- Android `38208264879` GREEN;
- Pages `38208313953` GREEN;
- readiness artifact: `orbi-energy-swarm-rc-readiness-6cae3eda798cd754a0f47aa7a927fbe59749de30`;
- Android artifact ID `11728093302`.

### ES-12I5
Corrected:
- first-frame suspended rendering safety;
- Eclipse TDZ risk by using initialized frame mutator projection;
- premature unmuted BGM startup before user gesture.

Evidence:
- branch cert `38264942317` GREEN;
- PR CI `38265445991` GREEN;
- PR Android `38265446421` GREEN;
- main CI `38265745892` GREEN;
- main Android `38265745833` GREEN;
- Pages `38265853615` GREEN.

### ES-13J1A — Combat Chain & Resonance Core
Implemented pure deterministic core:
- 2.2 s bounded chain window;
- affinity-diversity resonance gains;
- tiers `QUIET → SYNCED → HARMONIC → SURGING → OVERDRIVE_READY`;
- combined score projection capped at 2×;
- elite/boss weighting;
- damage break with bounded resonance penalty;
- chain cap 999 and resonance cap 100;
- invalid inputs fail closed;
- no React/audio/storage/entity scans in the core.

Evidence:
- pre-PR cert `38273358267` GREEN;
- PR CI `38273679009` GREEN;
- PR Android `38273679054` GREEN;
- main CI `38273920992` GREEN;
- main Android `38273919797` GREEN;
- Pages `38274024789` GREEN.

### ES-13J1B — Live Combat Resonance Adoption & HUD
Implemented:
- direct and splash player-caused defeats route through `registerCombatDefeat()`;
- projectile affinity passed to J1A when available;
- existing `getEnemyScoreReward(enemy)` remains the base-score authority;
- J1A `awardedScore` controls live score projection;
- milestone/evolved reward multipliers remain preserved;
- accepted damage breaks resonance after invincibility rejection;
- chain expiry uses simulation time and existing low-frequency HUD cadence;
- fresh-run reset;
- HUD exposes chain, resonance %, tier and score multiplier;
- `OVERDRIVE_READY` is presentation-only;
- no new entity scans, cap/budget changes, Campaign/Infinite recipe changes, FOTON/GAIA changes or damage tuning.

Diagnostic chronology:
- initial J1B branch attempts exposed test-contract ambiguity;
- exact forensic reproduction showed two failures only: historical reward-routing tests counted direct `getEnemyScoreReward()` calls in collision paths;
- the tests were strengthened to validate centralized routing plus preserved reward authority;
- Issue #254 (paused-frame hypothesis) was closed NOT PLANNED with no product merge.

Evidence:
- clean pre-PR cert run `38285523692`, job `114932841692` GREEN;
- PR #257 head `22e2bf380374f2e9933dbec76086855d1ae09a94`;
- PR CI `38287053826` GREEN;
- PR Android `38287053915` GREEN;
- squash canonical `91564e365d0a2220e4db2999e38372809ec397f3`;
- main CI `38287238136` GREEN;
- main Android `38287238150` GREEN;
- Pages/Web Beta `38287336600` build + deploy GREEN.

## Documentation continuity milestones

### ES-13DOC — Persistent Gameplay Roadmap & Continuity Ledger
Issue #255 / PR #256.

Established:
- `PROJECT_CONTINUITY.md`;
- `IMPLEMENTATION_LEDGER.md`;
- `ES13_GAMEPLAY_ROADMAP.md`;
- handoff template;
- roadmap status definitions;
- traceability policy;
- phase closure checklist.

Purpose: project continuity must live in Git, not in ChatGPT context length.

### ES-13DOC2 — J1B Closure Ledger & J2 Activation
Issue #258.  
Status: ACTIVE DOCUMENTATION at this ledger update.  
Baseline gameplay canonical: `91564e365d0a2220e4db2999e38372809ec397f3`.

Scope: documentation only; records J1B closure and activates J2 as next gameplay target.

## Next gameplay phase

### ES-13J2 — ORBI Overdrive
Status: NEXT / NOT YET IMPLEMENTED

Target intent:
- explicit earned activation from `OVERDRIVE_READY`;
- bounded duration/re-entry behavior;
- reactive visual/audio layer;
- meaningful but bounded combat advantage;
- high-value target opportunities;
- affinity-aware variation where safe;
- robust reset/pause/photo/lifecycle semantics;
- no uncontrolled entity growth or unlimited damage amplification.

J2 must receive its own Issue and branch from the exact documented live `main` after ES-13DOC2 merges.

## Remaining ES-13 chronology

1. J2 — ORBI Overdrive
2. J3 — Advanced Enemy Formation Director
3. J4 — Tactical Enemy Families
4. J5 — Priority Targets & Chain Reactions
5. J6 — Dynamic Mid-Sector Events
6. J7 — Bonus Challenge Rounds
7. J8 — Additional Game Modes
8. J9 — Boss & Miniboss Expansion
9. J10 — Expert Risk/Reward Mechanics
10. J11 — Build & Synergy Expansion
11. J12 — Rare Events & Secret Encounters
12. J13 — Score, Rank & Mastery
13. J14 — Procedural Interaction Matrix
14. J15 — Integration & Long-Range Balance Certification

Post-J15 direction: ES-14 — Living Warfront.

## Open manual/physical blockers

Still open and not replaceable by CI:
- #4 — visual/responsive certification;
- #5 — Infinite play-feel;
- #202 — GAIA physical runtime/performance;
- #248 — Android real-device manual certification.

Full final RC evidence collection is deferred while ES-13 materially changes gameplay.

## Maintenance rule

For every merged gameplay phase record:
- phase/status;
- exact gameplay canonical;
- Issue/PR;
- implementation outcome;
- pre-PR cert run(s);
- PR CI + Android run IDs;
- main CI + Android + Pages run IDs;
- unresolved follow-ups;
- roadmap status transition.

Never record DEPLOYED merely because a PR merged.