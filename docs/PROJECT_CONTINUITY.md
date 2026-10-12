# ORBI Energy Swarm — Project Continuity

> START HERE after any new chat/session, context loss or handoff.

Repository: `ingeniusvictor/orbi-energy.swarm`  
Last continuity update: 2026-10-12

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

`39f9b33c9a229c7c8d991aecd81ea695510c82a0`

Phase: **ES-13J2D-A — Pure Overdrive Presentation Profile Contract**  
Status: **DEPLOYED / FROZEN**  
Issue: #281 — CLOSED  
PR: #282 — squash merged

Parent: `efd212c7ea2a93e166d719721680fd5d88df402d` — ES-13DOC6.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J2D-A implementation summary
- added pure `src/game/combatOverdrivePresentation.ts` projection;
- consumes only certified Overdrive `active`, `remainingRatio` and existing `QualityPreset`;
- inactive projection is exactly neutral;
- LOW/MEDIUM/HIGH/ULTRA scale bounded presentation intensity;
- maximum direct canvas ring count is 3;
- activation pulse derives only from the certified remaining-ratio window and owns no timer/clock;
- finite ratios clamp to `[0,1]`; non-finite ratios fail closed;
- no runtime/render/audio adoption yet;
- no React/DOM/canvas/WebAudio/storage/random/entity scans;
- no J2A timing or J2C damage tuning duplication;
- no cap/budget/Campaign/Infinite/FOTON/GAIA changes.

## J2D-A exact evidence
- pre-PR certification `38299553187`, job `114978848191` — GREEN;
- final clean PR head `5a70b0d55122ddf95b9af303dd24624f57b2f216`;
- PR CI `38299974128` — GREEN;
- PR Android `38299974261` — GREEN;
- squash canonical `39f9b33c9a229c7c8d991aecd81ea695510c82a0`;
- main CI `38300161662` — GREEN;
- main Android `38300161573` — GREEN;
- Pages `38300237659` — build + deploy GREEN.

## ES-13 gameplay canonicals
- J1A — Combat Chain & Resonance Core: `feb263957b52839d35a7cb1249762c223ba22595`;
- J1B — Live Combat Resonance Adoption & HUD: `91564e365d0a2220e4db2999e38372809ec397f3`;
- J2A — Overdrive Pure State Contract: `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`;
- J2B — Live Overdrive Activation & HUD: `466242e91fa927bc4d996d09efdbb87f8f572d44`;
- J2C-A — Pure Bounded Overdrive Combat Expression: `eca68cce510cf506053fd6d9121b501db7cd1f64`;
- J2C-B — Live Bounded Overdrive Damage Adoption: `7e15ee1e79ee9ae8903891a66b0b1031b0600bca`;
- J2D-A — Pure Overdrive Presentation Profile: `39f9b33c9a229c7c8d991aecd81ea695510c82a0`.

## Resolved diagnostic note
Issue #254 (`ES-12I5R1`) is CLOSED / NOT PLANNED. Forensic reproduction proved the historical platform failure was not an I5 pause regression. #254 produced no product merge.

Issue #283 is also CLOSED / NOT PLANNED: it was opened from stale chat state after a UI interruption and created no branch/product work.

## Current administrative work
Issue #284 — `ES-13DOC7 — J2D-A Closure Ledger & J2D-B Activation`  
Branch: `docs/es-13-j2da-closure-j2db-activation`  
Scope: documentation only.

## Next gameplay phase

### ES-13J2D-B — Live Reactive Overdrive Presentation Adoption
Status: **NEXT / NOT YET IMPLEMENTED**

Recommended contract:
- adopt the certified J2D-A presentation projection into the existing canvas/HUD/audio paths only;
- no new gameplay multiplier, score, duration, re-entry, cadence, cap or budget tuning;
- J2A/J2B remain activation/timing authority; J2C remains combat-expression authority; J2D-A remains presentation-profile authority;
- no second clock/timer and no per-frame React authority;
- bounded activation stinger and active-state identity with no uncontrolled particle/entity growth;
- audio must respect mute and browser/user-gesture constraints; no mount-time playback;
- pause/photo/lifecycle/reset must follow certified simulation-time Overdrive state;
- LOW/mobile presets must avoid expensive continuous full-screen effects;
- preserve objective/boss/threat/HUD readability and accessibility;
- no Campaign/Infinite recipe, FOTON GLB or GAIA tuning change;
- add adoption regressions proving live presentation consumes J2D-A projection instead of duplicating its constants.

After J2D-B: **J2E — Overdrive Integration Certification**. Do not start J3 until J2 is fully deployed/frozen unless a dedicated corrective issue requires otherwise.

## Frozen manual/physical blockers
Still OPEN and intentionally deferred while ES-13 changes gameplay:
- #4 — visual/responsive certification;
- #5 — Infinite play-feel;
- #202 — GAIA physical runtime/performance;
- #248 — Android real-device certification.

CI is never a substitute for required human/device evidence.

## Mandatory workflow
`Issue → branch from exact live main → implementation → repo/gameplay/platform/typecheck/release/dossier/build/readiness → PR → PR CI GREEN + Android GREEN → squash merge → exact-SHA main CI GREEN + Android GREEN + Pages GREEN`

Rules:
- never modify `main` directly;
- correction before speed;
- never weaken tests merely to pass;
- remove temporary certification workflows/scripts/diagnostics before final PR diff;
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES`, entity arrays and simulation budgets unless a dedicated demonstrated change requires otherwise;
- preserve Campaign isolation where scoped;
- no FOTON GLB change without explicit scope;
- no phase is declared deployed before exact-SHA main + Pages evidence.

## Gameplay chronology
`J2D-B Live VFX/Audio Adoption → J2E Integration Certification → J3 Advanced Formations → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read this file, `IMPLEMENTATION_LEDGER.md`, `ES13_GAMEPLAY_ROADMAP.md`, then active Issues/PRs. Verify live `main` before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. Read continuity/ledger/roadmap, verify live `main` and active Issues/PRs, then follow Issue → Branch → gates → PR → exact-SHA main/Android/Pages. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, run IDs, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.