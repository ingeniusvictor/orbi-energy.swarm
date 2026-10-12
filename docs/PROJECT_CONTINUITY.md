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

`9743890d98b33d365cbc18a048015f3815b144e5`

Phase: **ES-13J2D-B — Live Reactive Overdrive Presentation Adoption**  
Status: **DEPLOYED / FROZEN**  
Issue: #286 — CLOSED  
PR: #287 — squash merged

Parent: `51fff02e687a2ce88a9c3e727edfb4de2c42f4b6` — ES-13DOC7.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J2D-B implementation summary
- live runtime consumes certified `projectCombatOverdrivePresentation()`;
- presentation derives from authoritative Overdrive state + simulation time + existing quality preset;
- direct bounded Canvas2D field tint and collective FOTON/swarm halo/rings;
- no new particle/entity arrays or entity scans;
- renderer uses certified J2D-A `ringCount` and projection instead of duplicating tuning constants;
- activation stinger is invoked only after successful explicit Overdrive activation;
- stinger uses existing WebAudio engine / TACTICAL lane and respects mute/user-gesture constraints;
- no mount-time/autoplay activation path;
- no new timer/clock/RAF authority;
- pause/photo/lifecycle inherit existing simulation-time Overdrive authority;
- no duration/re-entry/damage/score/fire-rate/projectile-count/speed/crit changes;
- no cap/budget/Campaign/Infinite/FOTON GLB/GAIA tuning changes.

## J2D-B exact evidence
- pre-PR certification `38302074362`, job `114987146051` — GREEN;
- final clean PR head `c96954ffabc1c6330bbbe2736b90456537878c10`;
- PR CI `38302405528` — GREEN;
- PR Android `38302405569` — GREEN;
- squash canonical `9743890d98b33d365cbc18a048015f3815b144e5`;
- main CI `38302618451` — GREEN;
- main Android `38302618447` — GREEN;
- Pages `38302704724` — build + deploy GREEN.

## ES-13 gameplay canonicals
- J1A — Combat Chain & Resonance Core: `feb263957b52839d35a7cb1249762c223ba22595`;
- J1B — Live Combat Resonance Adoption & HUD: `91564e365d0a2220e4db2999e38372809ec397f3`;
- J2A — Overdrive Pure State Contract: `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`;
- J2B — Live Overdrive Activation & HUD: `466242e91fa927bc4d996d09efdbb87f8f572d44`;
- J2C-A — Pure Bounded Overdrive Combat Expression: `eca68cce510cf506053fd6d9121b501db7cd1f64`;
- J2C-B — Live Bounded Overdrive Damage Adoption: `7e15ee1e79ee9ae8903891a66b0b1031b0600bca`;
- J2D-A — Pure Overdrive Presentation Profile: `39f9b33c9a229c7c8d991aecd81ea695510c82a0`;
- J2D-B — Live Reactive Overdrive Presentation: `9743890d98b33d365cbc18a048015f3815b144e5`.

## Resolved diagnostics
- #254 CLOSED / NOT PLANNED: forensic reproduction proved the historical platform failure was not an I5 pause regression; no product merge.
- #283 CLOSED / NOT PLANNED: opened from stale chat state after a UI interruption; no branch/product work.

## Current administrative work
Issue #288 — `ES-13DOC8 — J2D-B Closure Ledger & J2E Activation`  
Branch: `docs/es-13-j2db-closure-j2e-activation`  
Scope: documentation only.

## Next gameplay phase

### ES-13J2E — Overdrive Integration Certification
Status: **NEXT / NOT YET IMPLEMENTED**

Purpose: certify the complete J1/J2 stack before starting J3.

Recommended contract:
- add deterministic integration regressions spanning J1 Resonance → J2 activation → J2C bounded damage → J2D presentation;
- verify full readiness/activation/consumption/expiry/re-entry sequence at exact simulation-time boundaries;
- prove taking accepted damage still breaks Resonance correctly without mutating active Overdrive authority;
- prove pause/photo/lifecycle cannot consume Overdrive time outside simulation time;
- prove fresh run/restart resets both Resonance and Overdrive;
- prove score multiplier remains J1-owned and Overdrive never adds a second score multiplier;
- prove J2C damage remains exactly one bounded multiplier and does not stack;
- prove J2D presentation remains projection-only with no gameplay side effects;
- exercise long deterministic sequences for no NaN/unbounded state;
- no gameplay tuning changes unless a demonstrated defect requires a dedicated correction;
- full repo/gameplay/platform/typecheck/release/dossier/build/readiness + Android + scope guard;
- exact-SHA PR/main/Android/Pages certification.

After J2E is deployed/frozen, proceed to **J3 — Advanced Enemy Formation Director**.

## Frozen manual/physical blockers
Still OPEN and intentionally deferred while ES-13 changes gameplay:
- #4 — visual/responsive certification;
- #5 — Infinite play-feel;
- #202 — GAIA physical runtime/performance;
- #248 — Android real-device certification.

CI is never a substitute for required human/device evidence.

## Mandatory workflow
`Issue → branch from exact live main → implementation/tests → repo/gameplay/platform/typecheck/release/dossier/build/readiness → PR → PR CI GREEN + Android GREEN → squash merge → exact-SHA main CI GREEN + Android GREEN + Pages GREEN`

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
`J2E Integration Certification → J3 Advanced Formations → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read this file, `IMPLEMENTATION_LEDGER.md`, `ES13_GAMEPLAY_ROADMAP.md`, then active Issues/PRs. Verify live `main` before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. Read continuity/ledger/roadmap, verify live `main` and active Issues/PRs, then follow Issue → Branch → gates → PR → exact-SHA main/Android/Pages. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, run IDs, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.