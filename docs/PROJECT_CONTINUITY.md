# ORBI Energy Swarm — Project Continuity

> START HERE after any new chat/session, context loss or handoff.

Repository: `ingeniusvictor/orbi-energy.swarm`  
Last continuity update: 2026-10-12

## Authority order

When sources disagree, use this order:
1. live GitHub `main` SHA and merged history;
2. exact CI/Android/Pages evidence on that SHA;
3. this file;
4. `docs/IMPLEMENTATION_LEDGER.md`;
5. `docs/ES13_GAMEPLAY_ROADMAP.md`;
6. active GitHub issues/PRs;
7. chat history only as supplemental context.

Never infer deployment/certification from conversation text alone.

## Last certified gameplay canonical

`91564e365d0a2220e4db2999e38372809ec397f3`

Phase: **ES-13J1B — Live Combat Resonance Adoption & HUD**  
Status: **DEPLOYED / FROZEN**  
Issue: #253 — CLOSED  
PR: #257 — squash merged

Parent repository canonical at merge:
`622a75805a2228546737a5cf65a8e3b20f7f9c7d`

The J1B squash is exactly one commit ahead of that parent.

Version remains `0.2.0-beta.1`. Full RC promotion/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J1B implementation summary

J1B connected the pure J1A resonance core to live combat:
- direct and splash player-caused defeats route through one `registerCombatDefeat()` authority;
- projectile affinity is passed when available;
- existing base reward still comes from `getEnemyScoreReward(enemy)`;
- J1A awarded-score projection is authoritative;
- milestone/evolved reward multipliers remain preserved;
- accepted player damage breaks resonance only after the invincibility guard;
- chain expiry uses simulation time, so pause/photo/lifecycle suspension cannot consume the chain window;
- fresh runs/restarts reset resonance;
- HUD shows chain, resonance %, tier and score multiplier on the existing low-frequency cadence;
- `OVERDRIVE_READY` remains presentation only; J2 owns active Overdrive;
- no new entity scans, cap changes, Campaign/Infinite recipe changes, FOTON/GAIA changes or damage tuning.

## J1B exact evidence

- pre-PR certification: run `38285523692`, job `114932841692` — GREEN;
- PR #257 head: `22e2bf380374f2e9933dbec76086855d1ae09a94`;
- PR CI: `38287053826` — GREEN;
- PR Android: `38287053915` — GREEN;
- squash canonical: `91564e365d0a2220e4db2999e38372809ec397f3`;
- main CI: `38287238136` — GREEN;
- main Android: `38287238150` — GREEN;
- Pages/Web Beta: `38287336600` — build + deploy GREEN on the same canonical.

## Resolved diagnostic note

Issue #254 — `ES-12I5R1 — Align paused-frame regression contract with I5` — is CLOSED / NOT PLANNED.

Forensic reproduction proved the J1B platform failures were not pause/I5 regressions. The only failures were two historical reward-routing assertions that counted direct `getEnemyScoreReward()` calls in collision paths. J1B intentionally centralizes those paths through `registerCombatDefeat()`, while preserving `getEnemyScoreReward(enemy)` inside that authority. #254 produced no product merge.

## Current administrative work

Issue #258 — `ES-13DOC2 — J1B Closure Ledger & J2 Activation`  
Branch: `docs/es-13-j1b-closure-j2-activation`  
Scope: documentation only.

This issue updates continuity/ledger/roadmap after J1B and activates the next gameplay target. Because a documentation-only merge changes repository `main` without changing gameplay, always verify live `main` before creating the next gameplay branch; use the **last certified gameplay canonical** above as the product reference.

## Next gameplay phase

### ES-13J2 — ORBI Overdrive
Status: **NEXT / NOT YET IMPLEMENTED**

Intent:
- convert `OVERDRIVE_READY` into an explicit earned temporary mastery state;
- bounded duration and re-entry rules;
- reactive visual/audio feedback;
- high-value combat opportunities;
- affinity-aware behavior where safe;
- clean reset/pause/photo/lifecycle semantics;
- no unlimited damage amplification;
- no uncontrolled entity growth;
- preserve Campaign/Infinite isolation and global budgets.

Do not implement J3+ until J2 is merged/deployed unless a dedicated corrective issue requires otherwise.

## Frozen manual/physical blockers

Still OPEN and intentionally deferred until the ES-13 gameplay set stabilizes:
- #4 — Premium Presentation & Responsive Game View;
- #5 — Infinite play-feel;
- #202 — GAIA physical runtime/performance evidence;
- #248 — Android real-device certification.

CI is never a substitute for required human/device evidence.

## Mandatory engineering workflow

Every gameplay/product phase:

`Issue → branch from exact live main → implementation → repo/gameplay/platform/typecheck/release/dossier/build/readiness gates → PR → PR CI GREEN + Android GREEN → squash merge → exact-SHA main CI GREEN + Android GREEN + Pages GREEN`

Rules:
- never modify `main` directly;
- correction before speed;
- never weaken tests merely to pass;
- temporary certification workflows/scripts must be removed before final PR diff;
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES`, entity arrays and simulation budgets unless a dedicated demonstrated change requires otherwise;
- preserve Campaign isolation where scoped;
- no FOTON GLB change without explicit scope;
- no phase is declared deployed before exact-SHA main + Pages evidence.

## Gameplay chronology

`J2 Overdrive → J3 Advanced Formations → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy Expansion → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Interaction Matrix → J15 Integration/Balance Certification`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery procedure

A new chat must first read:
1. `docs/PROJECT_CONTINUITY.md`
2. `docs/IMPLEMENTATION_LEDGER.md`
3. `docs/ES13_GAMEPLAY_ROADMAP.md`
4. active issues/PRs referenced here

Then verify live `main` SHA before any write.

Suggested handoff:

> Continue ORBI Energy Swarm autonomously. Repository: `ingeniusvictor/orbi-energy.swarm`. Read `docs/PROJECT_CONTINUITY.md`, `docs/IMPLEMENTATION_LEDGER.md`, and `docs/ES13_GAMEPLAY_ROADMAP.md`; verify live `main` and active issues/PRs before modifying anything. Follow Issue → Branch → gates → PR → exact-SHA main/Android/Pages. Never touch `main` directly and never weaken tests.

## Update obligation

At each merged gameplay phase:
- record exact gameplay canonical SHA;
- record Issue/PR and run IDs;
- move completed phase into the ledger;
- advance the roadmap/next phase;
- record unresolved diagnostics accurately;
- remove obsolete temporary instructions.

A gameplay phase is not administratively closed until these records are current.