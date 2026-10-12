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

`6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`

Phase: **ES-13J2A — ORBI Overdrive Pure State Contract**  
Status: **DEPLOYED / FROZEN**  
Issue: #260 — CLOSED  
PR: #261 — squash merged

Repository parent at merge:
`113842b3747827585fa32f90db4c2759828e302c`

J2A is exactly one gameplay commit ahead of that parent.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains deferred while ES-13 materially expands gameplay.

## J2A implementation summary

New pure module `src/game/combatOverdrive.ts` defines Overdrive independently from React/runtime:
- 8,000 ms bounded active duration;
- 4,000 ms post-window re-entry lock;
- activation requires explicit `overdriveReady` from certified J1 Resonance;
- successful activation emits one-shot `consumeResonance=true` without mutating J1A/J1B state;
- repeated activation while active cannot stack, refresh or extend;
- expiry is deterministic at `nowMs >= endsAtMs`;
- exact re-entry boundary is deterministic;
- projection exposes active, remaining time/ratio and re-entry lock state;
- reset returns the exact fresh state;
- negative/non-finite simulation time fails closed;
- no wall clock, RAF, React, renderer, audio, storage, random, entity scans, combat buffs or tuning.

J2A deliberately does **not** modify `EnergySwarmGame.tsx`; live adoption belongs to J2B.

## J2A exact evidence
- pre-PR cert `38288374752`, job `114942126186` — GREEN;
- PR #261 head `565b94bf9bf873a9280ef2ca123e3dcbd88d98ad`;
- PR CI `38288795483` — GREEN;
- PR Android `38288795462` — GREEN;
- squash canonical `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`;
- main CI `38288929402` — GREEN;
- main Android `38288929417` — GREEN;
- Pages `38289009730`, build `114944244748` + deploy `114944343151` — GREEN.

## Previous ES-13 gameplay canonicals
- J1A — Combat Chain & Resonance Core: `feb263957b52839d35a7cb1249762c223ba22595`;
- J1B — Live Combat Resonance Adoption & HUD: `91564e365d0a2220e4db2999e38372809ec397f3`.

J1B exact evidence: pre-PR `38285523692`; PR CI `38287053826`; PR Android `38287053915`; main CI `38287238136`; main Android `38287238150`; Pages `38287336600` — all GREEN.

## Resolved diagnostic note
Issue #254 (`ES-12I5R1`) is CLOSED / NOT PLANNED. Forensic reproduction proved J1B's historical platform failures were reward-routing contract assumptions, not a pause/I5 regression. #254 produced no product merge.

## Current administrative work
Issue #262 — `ES-13DOC3 — J2A Closure Ledger & J2B Activation`  
Branch: `docs/es-13-j2a-closure-j2b-activation`  
Scope: documentation only.

A documentation-only merge may advance repository `main` without changing gameplay. Always verify live `main` before creating J2B; the gameplay reference remains the exact canonical above.

## Next gameplay phase

### ES-13J2B — Live Overdrive Activation & HUD
Status: **NEXT / NOT YET IMPLEMENTED**

Required direction:
- adopt J2A state in live `EnergySwarmGame` using `timeElapsedRef` simulation time;
- connect an explicit player activation action only when `overdriveReady && canActivate`;
- consume Resonance exactly once on successful activation;
- expose active/countdown/lock state to the HUD using existing low-frequency cadence;
- reset cleanly on new run/restart;
- pause/photo/lifecycle suspension must not burn Overdrive time;
- no combat buffs yet (J2C);
- no VFX/audio identity yet (J2D);
- preserve global caps/budgets and Campaign/Infinite isolation.

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
`J2B Live Activation/HUD → J2C Combat Expression → J2D Reactive VFX/Audio/Safety → J2E Integration → J3 Advanced Formations → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

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