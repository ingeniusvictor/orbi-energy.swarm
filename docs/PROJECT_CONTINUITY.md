# ORBI Energy Swarm — Project Continuity

> START HERE after a new chat/session, handoff, context loss or long interruption.

Last continuity update: 2026-10-12  
Repository: `ingeniusvictor/orbi-energy.swarm`

## Authority order

When sources disagree, use this order:
1. exact repository `main` SHA and merged GitHub history;
2. current CI/Actions evidence on that SHA;
3. this continuity file;
4. `IMPLEMENTATION_LEDGER.md`;
5. `ES13_GAMEPLAY_ROADMAP.md`;
6. active GitHub issues/PRs;
7. chat history only as supplemental context.

Never infer deployment/certification from conversation text alone.

---

## Canonical state

Current canonical `main` at this continuity snapshot:

`feb263957b52839d35a7cb1249762c223ba22595`

Phase represented by canonical: **ES-13J1A — Combat Chain & Resonance Core Contract**.

Parent canonical:

`6901c67eaf369c3b41dba5d60480ad7d173275a7` — ES-12I5.

Version remains `0.2.0-beta.1`.

RC promotion remains intentionally blocked/deferred while ES-13 gameplay expansion is active.

---

## Active gameplay work

### ES-13J1B — Live Combat Resonance Adoption & HUD

Issue: #253  
Branch: `feat/es-13j1b-live-combat-resonance`  
Current branch head at this snapshot:

`11bd8c54ce88283549169b5fe903c27194b2b075`

Status: **ACTIVE / NOT CERTIFIED / NOT MERGED**.

Intended J1B behavior:
- wire actual player-caused enemy defeats into the J1A resonance core;
- include splash kills;
- derive affinity from projectile when available;
- route existing base score through J1A `awardedScore`;
- break chain only on accepted player damage after invincibility rejection;
- use simulation time for chain expiry;
- reset resonance on new/restarted run;
- project chain/resonance/tier/multiplier through existing low-frequency HUD cadence;
- no active Overdrive yet;
- no new entity scans or cap changes.

Current certification history:
- first branch attempt revealed test issues before product materialization;
- second attempt passed Repository Smoke and Gameplay;
- `test:platform` exposed unresolved discrepancies;
- J1B must remain unmerged until those discrepancies are explained and the full gate matrix is GREEN.

### Diagnostic/corrective track — ES-12I5R1

Issue: #254  
Branch: `fix/es-12i5r1-paused-render-contract`  
Current branch head at this snapshot:

`0c50b31331420384412a30880b5d2a36a00c2d75`

Status: **DIAGNOSTIC / NOT MERGED**.

Important: an early hypothesis suggested a stale paused-frame regression contract. Subsequent clean-branch diagnostics weakened that hypothesis. Do **not** merge a contract rewrite merely because #254 exists. The exact `test:platform` failure source from J1B must be demonstrated first.

Current recommended action:
1. reproduce/read the exact J1B `test:platform` failure from run `38275273518`, job `114899076008`;
2. identify the exact assertions and their source;
3. separate harness/test-source problems from real J1B product violations;
4. correct only demonstrated causes;
5. rerun full J1B certification from zero;
6. do not open/merge J1B PR until all gates are GREEN.

---

## Documentation continuity work

Issue: #255 — ES-13DOC — Persistent Gameplay Roadmap & Project Continuity Ledger  
Branch: `docs/es-13-continuity-ledger`

Purpose: make repository state independent of ChatGPT conversation limits.

This documentation branch must not alter gameplay, tuning, release state, caps or CI behavior.

---

## Frozen/manual blockers intentionally not being closed now

The following remain open until real human/device evidence exists:
- #4 — visual/responsive certification;
- #5 — Infinite play-feel certification;
- #202 — GAIA physical runtime/performance evidence;
- #248 — Android real-device certification.

Full final RC manual certification is intentionally deferred while ES-13 materially changes gameplay. CI must never be used as a substitute for these human/device observations.

---

## Mandatory engineering workflow

Every product phase:

`Issue → Branch from exact canonical → implementation → gates → PR → PR CI GREEN → squash merge → main CI GREEN → Android GREEN → Pages GREEN on exact canonical SHA`

Rules:
- never modify `main` directly;
- correction before speed;
- never weaken a test merely to make a gate pass;
- no phase is deployed until exact-SHA main/Pages evidence exists;
- preserve Campaign isolation where scoped;
- preserve global caps/budgets unless a dedicated issue proves a required change;
- temporary certification workflows must be removed before final PR diff;
- hardware/manual evidence stays separate from automated CI.

---

## Gameplay program after J1B

See `docs/ES13_GAMEPLAY_ROADMAP.md` for full detail.

Planned order:

`J1B → J2 Overdrive → J3 Advanced Formations → J4 Tactical Enemy Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Risk/Reward → J11 Build/Synergy Expansion → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Interaction Matrix → J15 Integration/Balance Certification`

Do not skip directly to a later phase while an earlier phase has unresolved safety/certification work unless a dedicated corrective issue explicitly requires it.

---

## New-chat recovery procedure

When starting a fresh ChatGPT thread, provide the repository name and ask it to read these three files plus active issues #253, #254 and any newer active issue referenced here:

1. `docs/PROJECT_CONTINUITY.md`
2. `docs/IMPLEMENTATION_LEDGER.md`
3. `docs/ES13_GAMEPLAY_ROADMAP.md`

Then require it to verify current `main` SHA before taking action.

Suggested handoff statement:

> Continue ORBI Energy Swarm autonomously. Repository: `ingeniusvictor/orbi-energy.swarm`. Read `docs/PROJECT_CONTINUITY.md`, `docs/IMPLEMENTATION_LEDGER.md`, and `docs/ES13_GAMEPLAY_ROADMAP.md`, then verify current `main` and all active issues/PRs before modifying anything. Follow Issue → Branch → gates → PR → exact-SHA main/Android/Pages. Never touch `main` directly and never weaken tests.

---

## Update obligation

At the end of every merged phase:
- replace the canonical SHA above;
- move the completed phase into `IMPLEMENTATION_LEDGER.md` with issue/PR/CI evidence;
- advance the Active Work section to the next phase;
- update roadmap statuses;
- record any new blockers/diagnostic branches;
- remove obsolete temporary instructions.

A phase is not considered administratively closed until this continuity record is current.