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

`eca68cce510cf506053fd6d9121b501db7cd1f64`

Phase: **ES-13J2C-A — Pure Bounded Overdrive Combat Expression Contract**  
Status: **DEPLOYED / FROZEN**  
Issue: #271 — CLOSED  
PR: #272 — squash merged

Parent documented `main` at merge:
`681442b08718e53fcf29a90dde94b4bb398c2d9f`

J2C-A is exactly one gameplay commit ahead of that parent.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J2C-A implementation summary
- added pure `src/game/combatOverdriveEffects.ts`;
- J2A/J2B remain the sole Overdrive activation/timing authority;
- input is only the certified Overdrive `active` projection;
- inactive projection is exactly neutral: `playerDamageMultiplier = 1`;
- active projection is exactly `1.20`;
- hard contractual ceiling is `1.25`;
- deterministic, non-stacking and immutable;
- no score/economy, fire-rate, projectile-count, projectile-speed, crit, defense or entity-budget change;
- no clock/RAF/React runtime/render/audio/storage/random/entity-array/simulation-scan dependency;
- no live `EnergySwarmGame.tsx` adoption yet.

The first temporary certification run failed only because a new source-purity test used raw `/React/` and matched the word `React` inside a documentation comment. The product module was not defective. The test was corrected to reject actual React imports/hooks instead of prose, preserving and improving the intended purity guarantee.

## J2C-A exact evidence
- first temporary cert `38295319991`, job `114964869404` — FAIL only on the demonstrated test false positive above;
- corrected full pre-PR cert `38295483032`, job `114965401785` — GREEN;
- final clean PR head `992612a5315e87813e2e9d4e269a635806753e38`;
- PR CI `38295901224` — GREEN;
- PR Android `38295901194` — GREEN;
- squash canonical `eca68cce510cf506053fd6d9121b501db7cd1f64`;
- main CI `38296053435` — GREEN;
- main Android `38296053642` — GREEN;
- Pages `38296151229` — build + deploy GREEN.

## Previous ES-13 gameplay canonicals
- J1A — Combat Chain & Resonance Core: `feb263957b52839d35a7cb1249762c223ba22595`;
- J1B — Live Combat Resonance Adoption & HUD: `91564e365d0a2220e4db2999e38372809ec397f3`;
- J2A — ORBI Overdrive Pure State Contract: `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`;
- J2B — Live Overdrive Activation & HUD: `466242e91fa927bc4d996d09efdbb87f8f572d44`.

## Resolved diagnostic note
Issue #254 (`ES-12I5R1`) is CLOSED / NOT PLANNED. Forensic reproduction proved the historical platform failure was not an I5 pause regression. #254 produced no product merge.

## Current administrative work
Issue #273 — `ES-13DOC5 — J2C-A Closure Ledger & J2C-B Activation`  
Branch: `docs/es-13-j2ca-closure-j2cb-activation`  
Scope: documentation only.

A documentation-only merge may advance repository `main` without changing the gameplay canonical above. Always verify live `main` before creating J2C-B.

## Next gameplay phase

### ES-13J2C-B — Live Bounded Overdrive Damage Adoption
Status: **NEXT / NOT YET IMPLEMENTED**

Recommended contract:
- import and use `projectCombatOverdriveEffects()`; do not duplicate `1.20` in live runtime;
- adopt only at the existing centralized player-projectile damage seam inside `shootFromSwarm()`;
- use the already-certified live Overdrive projection/state as the active signal;
- multiply the existing resolved player projectile damage once by `playerDamageMultiplier`;
- inactive Overdrive must remain bit-for-bit neutral in damage behavior;
- active Overdrive must add only the certified +20% damage expression;
- preserve `MAX_PROJECTILES` and all quantum/mitosis projectile-budget guards;
- do not modify cooldown/fire-rate, projectile speed, score/economy, splash ratios, crit rules, defense, Campaign/Infinite recipes, FOTON or GAIA;
- no new entity-array scans or per-frame React state;
- no VFX/audio identity yet; that remains J2D;
- add adoption tests proving one authoritative multiplier application and absence of duplicate literal tuning.

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
`J2C-B Live Damage Adoption → J2D Reactive VFX/Audio/Safety → J2E Integration → J3 Advanced Formations → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

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