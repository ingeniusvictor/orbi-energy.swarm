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

## Last certified gameplay canonical

`466242e91fa927bc4d996d09efdbb87f8f572d44`

Phase: **ES-13J2B — Live Overdrive Activation & HUD**  
Status: **DEPLOYED / FROZEN**  
Issue: #264 — CLOSED  
PR: #267 — squash merged

Parent documented `main` at merge:
`a485e52542b3d097511789c15f1a7afcb6ba5cb0`

J2B is exactly one gameplay commit ahead of that parent.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains deferred while ES-13 materially expands gameplay.

## J2B implementation summary
- J2A Overdrive helpers are adopted as the only live state/timing authority;
- high-frequency Overdrive state lives in a ref, while React receives the existing low-frequency HUD projection;
- all active/lock timing uses `timeElapsedRef.current` simulation time;
- activation is explicit only through keyboard `O` or HUD pointer/touch action;
- not-playing, game-over, paused, Photo Mode and upgrade-selection states fail closed;
- current Resonance readiness plus J2A `canActivate` are both required;
- successful activation consumes earned Resonance exactly once while preserving chain/best-chain/affinity sequencing;
- fresh run/restart resets Overdrive;
- HUD exposes `READY`, `ACTIVE Ns`, `RECHARGING Ns` and `CHARGE` with an accessible guarded action;
- no combat buff, VFX/audio, new entity scan, cap/budget or Campaign/Infinite/FOTON/GAIA change was introduced.

Historical J1B/J2A static contracts were evolved after exact repository-smoke diagnostics demonstrated three assumptions that became stale only because J2B legitimately adopted the certified core. Coverage was preserved/strengthened rather than removed.

## J2B exact evidence
- pre-PR certification `38293627094`, job `114959353674` — GREEN;
- final clean PR head `e43a1d3f4f4a7801fb836055cbf23176992dc74b`;
- PR CI `38294148486` — GREEN;
- PR Android `38294148448` — GREEN;
- squash canonical `466242e91fa927bc4d996d09efdbb87f8f572d44`;
- main CI `38294331547` — GREEN;
- main Android `38294331726` — GREEN;
- Pages `38294411795` — build + deploy GREEN.

## Previous ES-13 gameplay canonicals
- J1A — Combat Chain & Resonance Core: `feb263957b52839d35a7cb1249762c223ba22595`;
- J1B — Live Combat Resonance Adoption & HUD: `91564e365d0a2220e4db2999e38372809ec397f3`;
- J2A — ORBI Overdrive Pure State Contract: `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`.

J2A evidence: pre-PR `38288374752`; PR CI `38288795483`; PR Android `38288795462`; main CI `38288929402`; main Android `38288929417`; Pages `38289009730` — all GREEN.

## Resolved diagnostic note
Issue #254 (`ES-12I5R1`) is CLOSED / NOT PLANNED. Forensic reproduction proved the historical platform failure was not an I5 pause regression. #254 produced no product merge.

## Current administrative work
Issue #268 — `ES-13DOC4 — J2B Closure Ledger & J2C Activation`  
Branch: `docs/es-13-j2b-closure-j2c-activation`  
Scope: documentation only.

A documentation-only merge may advance repository `main` without changing the gameplay canonical above. Always verify live `main` before creating J2C.

## Next gameplay phase

### ES-13J2C — Bounded Overdrive Combat Expression
Status: **NEXT / NOT YET IMPLEMENTED**

Recommended direction:
- preserve J2A/J2B as timing/activation authority; do not add a second Overdrive clock;
- define bounded combat-effect projection before live adoption if multiple stats are affected;
- apply benefit only while certified Overdrive state is active;
- prefer modest, readable offensive expression rather than unrestricted damage amplification;
- keep score/economy interaction bounded and explicit;
- no entity-array scans, entity-cap bypass or projectile-budget bypass;
- pause/photo/lifecycle behavior must remain simulation-time correct;
- preserve Campaign/Infinite isolation and all global budgets;
- keep VFX/audio/stinger identity out of J2C; that remains J2D.

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
- remove temporary certification workflows/scripts before final PR diff;
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES`, entity arrays and simulation budgets unless a dedicated demonstrated change requires otherwise;
- preserve Campaign isolation where scoped;
- no FOTON GLB change without explicit scope;
- no phase is declared deployed before exact-SHA main + Pages evidence.

## Gameplay chronology
`J2C Combat Expression → J2D Reactive VFX/Audio/Safety → J2E Integration → J3 Advanced Formations → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read:
1. `docs/PROJECT_CONTINUITY.md`
2. `docs/IMPLEMENTATION_LEDGER.md`
3. `docs/ES13_GAMEPLAY_ROADMAP.md`
4. referenced active Issues/PRs

Then verify live `main` SHA before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. Read continuity/ledger/roadmap, verify live `main` and active Issues/PRs, then follow Issue → Branch → gates → PR → exact-SHA main/Android/Pages. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, run IDs, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.