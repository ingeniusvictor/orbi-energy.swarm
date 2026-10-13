# ORBI Energy Swarm — Project Continuity

> START HERE after any new chat/session, context loss or handoff.

Repository: `ingeniusvictor/orbi-energy.swarm`  
Last continuity update: 2026-10-13

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

`7273d447bbdcb084499fb121122aac6d34928d41`

Phase: **ES-13J3D — Enemy Formation Telegraph, Fairness & Integration Certification**  
Status: **DEPLOYED / FROZEN**  
Issue: #310 — CLOSED / completed  
PR: #311 — squash merged

Single parent: `03fbaefc45d065a5815e52cca6a6e67b0471949a` — ES-13DOC13 documentation canonical.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J3D certification result
J3D closed the complete six-route enemy-formation program as a certification-first slice with **zero runtime/gameplay source changes** in the final PR.

Final diff:
- `tests/gameplay/enemy-formation-integration-certification.test.ts`;
- `tests/es-13j3d-formation-integration-certification.test.mjs`.

Certified routes:
- PINCER — 2 live members;
- X_CROSS — 2 live members;
- SERPENTINE — 2 live members;
- WEDGE — 3 live members;
- ORBIT — 3 live members;
- SPIRAL — 2 live members.

Certified guarantees:
- all six routes expose deterministic route-specific telegraph metadata, severity, lane count and safe intent;
- lead-in holds route progress at 0 before start;
- exact duration reaches COMPLETE and recovery blocks immediate chaining until its exact boundary;
- all 2/3-member live trajectories remain finite and inside world margins;
- WEDGE/ORBIT cannot start without capacity for 3;
- pending assembly cannot overcommit remaining capacity and incomplete assembly expires safely;
- only one active/assembling group remains authoritative;
- Campaign/Infinite base eligibility and advanced-route eligibility remain explicitly independent;
- milestone/evolved/random-elite/miniboss/boss exclusions remain intact;
- route progress remains simulation-time owned, preserving pause/photo behavior;
- Hydro cancellation plus fresh-run/wave/boss reset ownership remain intact;
- live formation motion replaces rather than stacks legacy movement;
- no second director, movement engine, entity array/map, formation-only full scan or replacement spawn authority exists;
- player/FOTON `formations.ts` / `formationCycle.ts` remain separate from enemy formations;
- no `MAX_ENEMIES`, `MAX_PROJECTILES`, entity-array, simulation-budget, score, economy, damage, projectile, J1/J2, GAIA or FOTON GLB changes entered J3D;
- deterministic long-sequence route planning remains bounded and reproducible.

## J3D exact evidence
- baseline/docs canonical: `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- pre-PR corrected certified head: `04dc77aef159dfe3ea0b2c635fc8573353140b25`;
- pre-PR certification run `38320496667`, job `115047172319` — GREEN including Android debug APK, APK verification and J3D scope guard;
- final clean PR head: `09d0f355acc2e93487cfa5d641b7c642820abcd6`;
- PR CI `38320727930` — GREEN on exact final PR head;
- manual Android branch run `38486336058`, job `115600790747` — GREEN on exact final PR head, including Build APK, Verify APK and Upload APK;
- branch artifact `orbi-energy-swarm-debug-09d0f355acc2e93487cfa5d641b7c642820abcd6`;
- squash gameplay canonical: `7273d447bbdcb084499fb121122aac6d34928d41`;
- main CI `38320885204` — GREEN on exact canonical;
- manual Android main run `38485843331`, job `115599171557` — GREEN on exact canonical, including Build APK, Verify APK and Upload APK;
- main artifact `orbi-energy-swarm-debug-7273d447bbdcb084499fb121122aac6d34928d41`;
- Pages `38320970197` — build + deploy GREEN on exact canonical.

Temporary certification workflow was branch-only and removed before the final PR diff. The first J3D pre-cert attempt failed only because a static test required an overly rigid source syntax shape; the test was corrected to assert the actual live replacement seam, with no runtime change.

## J3 program status
- J3A — Pure Enemy Formation Route Contract: **DEPLOYED / FROZEN** — `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be`;
- J3B — Live Enemy Formation Director Adoption: **DEPLOYED / FROZEN** — `0fcf08dc59558619da61e1120eef2e957465f9a1`;
- J3C-A — Pure Advanced Enemy Formation Vocabulary: **DEPLOYED / FROZEN** — `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`;
- J3C-B — Controlled Live Advanced Formation Adoption: **DEPLOYED / FROZEN** — `5c345672b5365dbcc983403f73da62555489a98f`;
- J3C-C — stateful tactical patterns: **DEFERRED / NOT CURRENTLY JUSTIFIED**;
- J3D — Telegraph/Fairness/Integration Certification: **DEPLOYED / FROZEN** — `7273d447bbdcb084499fb121122aac6d34928d41`.

J3C-C is not cancelled. Convoy/leader-follower, fake retreat, portal ambush, encirclement or staggered-artillery patterns may return only through a dedicated issue proving a distinct tactical need, explicit bounded state ownership and no cap/budget inflation.

## ES-13 gameplay canonicals
- J1A — Combat Chain & Resonance Core: `feb263957b52839d35a7cb1249762c223ba22595`;
- J1B — Live Combat Resonance Adoption & HUD: `91564e365d0a2220e4db2999e38372809ec397f3`;
- J2A — Overdrive Pure State Contract: `6adfb7cc4785c5238c78821e6e67fdac3c0f4eb7`;
- J2B — Live Overdrive Activation & HUD: `466242e91fa927bc4d996d09efdbb87f8f572d44`;
- J2C-A — Pure Bounded Overdrive Combat Expression: `eca68cce510cf506053fd6d9121b501db7cd1f64`;
- J2C-B — Live Bounded Overdrive Damage Adoption: `7e15ee1e79ee9ae8903891a66b0b1031b0600bca`;
- J2D-A — Pure Overdrive Presentation Profile: `39f9b33c9a229c7c8d991aecd81ea695510c82a0`;
- J2D-B — Live Reactive Overdrive Presentation: `9743890d98b33d365cbc18a048015f3815b144e5`;
- J2E — Overdrive Integration Certification: `bf0e6a858e3c96091c002ea623b29eb5c260c6ea`;
- J3A — Pure Enemy Formation Route Contract: `3c5ece8d8e59bc38de468b4d0d9644953fa6a8be`;
- J3B — Live Enemy Formation Director Adoption: `0fcf08dc59558619da61e1120eef2e957465f9a1`;
- J3C-A — Pure Advanced Enemy Formation Vocabulary: `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`;
- J3C-B — Controlled Live Advanced Formation Adoption: `5c345672b5365dbcc983403f73da62555489a98f`;
- J3D — Formation Telegraph/Fairness/Integration Certification: `7273d447bbdcb084499fb121122aac6d34928d41`.

## Resolved diagnostics
- #254 CLOSED / NOT PLANNED: historical platform failure was not an I5 pause regression; no product merge.
- #283 CLOSED / NOT PLANNED: stale-chat false start; no branch/product work.

## Administrative closure
ES-13DOC14 — J3D Closure & J4 Tactical Enemy Families Activation  
Issue: #312  
Branch: `docs/es-13-j3d-closure-j4-activation`  
Baseline gameplay canonical: `7273d447bbdcb084499fb121122aac6d34928d41`  
Scope: documentation only.

## Next gameplay phase

### ES-13J4 — Tactical Enemy Families
Status: **NEXT ENGINEERING TARGET AFTER DOC14 CLOSURE**

Purpose: add enemy families that create new combat decisions through behavior and interaction, not merely higher HP/damage or uncontrolled entity/projectile growth.

Candidate tactical families:
- Shield Phalanx;
- Reflector Drone;
- Jammer;
- Mine Layer;
- Artillery Carrier;
- Warp Ambusher;
- Swarm Leech;
- Energy Vampire;
- Formation Breaker;
- Commander;
- Repair Drone;
- Stealth Hunter;
- Siege Fortress;
- Parasite Queen;
- Mirror Drone.

J4 must be decomposed into bounded slices. The first slice should establish a pure deterministic tactical-enemy contract before any broad live adoption. Every family must answer: **what new decision does this force the player to make?**

Constraints entering J4:
- preserve existing global caps and simulation budgets;
- no extra full-array scans unless a dedicated measured need is demonstrated;
- no uncontrolled projectile/entity amplification;
- preserve Campaign/Infinite isolation where applicable;
- keep J3 enemy-formation ownership separate from player/FOTON formations;
- do not alter score/economy/J1/J2/GAIA/FOTON GLB unless explicitly scoped;
- favor pure deterministic contracts before live runtime adoption.

## Frozen manual/physical blockers
Still OPEN and intentionally deferred while ES-13 changes gameplay:
- #4 — visual/responsive certification;
- #5 — Infinite play-feel;
- #202 — GAIA physical runtime/performance;
- #248 — Android real-device certification.

CI is never a substitute for required human/device evidence.

## Mandatory workflow
`Issue → branch from exact live main → implementation/tests → repo/gameplay/platform/typecheck/release/dossier/build/readiness → PR → PR CI GREEN + Android GREEN when applicable → squash merge → exact-SHA main CI GREEN + Android GREEN when applicable + Pages GREEN`

Rules:
- never modify `main` directly;
- correction before speed;
- never weaken tests merely to pass;
- remove temporary certification workflows/scripts/diagnostics before final PR diff;
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES`, entity arrays and simulation budgets unless a dedicated demonstrated change requires otherwise;
- preserve Campaign/Infinite isolation where scoped;
- no FOTON GLB change without explicit scope;
- no gameplay phase is declared deployed before exact-SHA required evidence.

## Gameplay chronology
`J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`

Post-J15 direction: **ES-14 — Living Warfront**.

## New-chat recovery
Read this file, `IMPLEMENTATION_LEDGER.md`, `ES13_GAMEPLAY_ROADMAP.md`, `TRACEABILITY_POLICY.md` and `ES13_PHASE_CHECKLIST.md`, then active Issues/PRs. Verify live `main` before any write.

Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. Verify live `main`, read continuity/ledger/roadmap/policy/checklist and active Issues/PRs. J3D gameplay canonical is `7273d447bbdcb084499fb121122aac6d34928d41`, fully deployed/frozen. Complete DOC14 if still open, then begin bounded J4 Tactical Enemy Families work. Follow Issue → Branch → gates → PR → exact-SHA deployment evidence. Never touch `main` directly or weaken tests.

## Update obligation
Every merged gameplay phase must record exact gameplay canonical, Issue/PR, final head, pre-PR certification, PR CI/Android, main CI/Android/Pages, implementation result, unresolved follow-ups and next roadmap phase. A gameplay phase is not administratively closed until these records are current.
