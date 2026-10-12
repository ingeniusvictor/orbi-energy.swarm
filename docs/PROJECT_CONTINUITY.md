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

`7e15ee1e79ee9ae8903891a66b0b1031b0600bca`

Phase: **ES-13J2C-B — Live Bounded Overdrive Damage Adoption**  
Status: **DEPLOYED / FROZEN**  
Issue: #276 — CLOSED  
PR: #278 — squash merged

Parent documented `main` at merge:
`5d80833c71f8fe0c31f58945ed5cabb5f40b85b4` — ES-13DOC5.

J2C-B is exactly one gameplay commit ahead of that parent.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J2C-B implementation summary
- adopted the certified `projectCombatOverdriveEffects()` projection at the centralized player-projectile damage seam inside `shootFromSwarm()`;
- reads only authoritative high-frequency `combatOverdriveRef.current.active`;
- existing damage ordering remains `base → attack profile → GAIA → critical → Overdrive`;
- applies `playerDamageMultiplier` exactly once before projectile damage assignment;
- all existing projectile variants continue deriving from the adjusted primary damage;
- inactive behavior remains neutral through the J2C-A `1.0` projection;
- active Overdrive uses only the certified J2C-A `1.20x` expression; runtime does not duplicate `1.2` or the `1.25` ceiling;
- no new timer/state, fire-rate/cooldown, projectile speed/count, score/economy, splash/crit, cap/budget, entity-scan, Campaign/Infinite, FOTON or GAIA change.

The J2C-A source safeguard was evolved only where its old phase-boundary assertion became stale: it now requires live runtime to consume the projection helper without importing J2C-A tuning constants. All J2C-A purity/dependency protections remain.

## J2C-B exact evidence
- pre-PR certification `38297477355`, job `114971948257` — GREEN;
- final clean PR head `02d4296bd288860362eeb0502c387d801a31e45c`;
- PR CI `38297915036` — GREEN;
- PR Android `38297913596` — GREEN;
- squash canonical `7e15ee1e79ee9ae8903891a66b0b1031b0600bca`;
- main CI `38298120771` — GREEN;
- main Android `38298120436` — GREEN;
- Pages `38298206493` — build + deploy GREEN.

## Previous ES-13 gameplay canonicals
- J1A — Combat Chain & Resonance Core: `feb263957b52839d35a7cb1249762c223ba22595`;
- J1B — Live Combat Resonance Adoption & HUD: `91564e365d0a2220e4db2999e38372809ec397f3`;
- J2A — ORBI Overdrive Pure State Contract: `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`;
- J2B — Live Overdrive Activation & HUD: `466242e91fa927bc4d996d09efdbb87f8f572d44`;
- J2C-A — Pure Bounded Overdrive Combat Expression: `eca68cce510cf506053fd6d9121b501db7cd1f64`.

## Resolved diagnostic note
Issue #254 (`ES-12I5R1`) is CLOSED / NOT PLANNED. Forensic reproduction proved the historical platform failure was not an I5 pause regression. #254 produced no product merge.

## Current administrative work
Issue #279 — `ES-13DOC6 — J2C-B Closure Ledger & J2D Activation`  
Branch: `docs/es-13-j2cb-closure-j2d-activation`  
Scope: documentation only.

A documentation-only merge may advance repository `main` without changing the gameplay canonical above. Always verify live `main` before creating J2D.

## Next gameplay phase

### ES-13J2D — Reactive Overdrive VFX / Audio / Safety
Status: **NEXT / NOT YET IMPLEMENTED**

Recommended contract:
- presentation only: no new damage, score, cadence, duration, re-entry, cap or budget tuning;
- J2A/J2B remain activation/timing authority and J2C remains combat-expression authority;
- use existing Overdrive active/projection state; do not create a second clock or per-frame React authority;
- add a clear bounded activation stinger and active-state visual identity without continuous heavy particle/entity growth;
- respect audio mute and browser/user-gesture constraints; no mount-time playback;
- pause/photo/lifecycle suspension must not consume or restart presentation state independently of certified simulation time;
- low-quality/mobile presets must avoid expensive full-screen effects; preserve current global caps/budgets;
- HUD/canvas presentation must remain readable and accessible, especially warning/objective/boss layers;
- no Campaign/Infinite recipe, FOTON GLB or GAIA tuning change;
- add source/adoption regressions proving presentation consumes certified state rather than duplicating Overdrive timing/tuning.

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
`J2D Reactive VFX/Audio/Safety → J2E Integration Certification → J3 Advanced Formations → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

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