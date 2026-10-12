# ORBI Energy Swarm — Implementation Ledger

This ledger is the persistent chronological record of what has actually been completed, what is active, and what remains planned.

Rules:
- completed entries must reference an exact canonical SHA;
- where available, record Issue, PR and CI/Pages evidence;
- in-progress work must never be written as completed;
- diagnostic hypotheses must be marked as hypotheses until demonstrated;
- chat history is not an authoritative completion record.

---

## Completed canonical milestones

### ES-12H12 — Affinity Fusion Director
Status: COMPLETED / FROZEN  
Canonical: `e74ee87008f5eb53eca19950f2890d6a114a291b`  
Issue: #238  
PR: #239

Outcome:
- Affinity Fusion Director completed and certified;
- H12 became the frozen baseline for the subsequent distribution/release work.

### ES-12I1 — Web Distribution Lock & Installable PWA
Status: COMPLETED / FROZEN  
Canonical: `c9ab02b10383a666df2b317d2b2e9cd534a90356`  
Issue: #240  
PR: #241

Outcome:
- web distribution lock;
- installable PWA baseline;
- certified deployment chain.

### ES-12I2 — Android Packaging Foundation & Capacitor 8 Pipeline
Status: COMPLETED / FROZEN  
Canonical: `57a9d0100a218295032d4898529600df2cd10905`  
Issue: #242  
PR: #243

Outcome:
- Android packaging foundation;
- Capacitor 8 pipeline;
- repeatable Android CI artifact generation.

### ES-12I3 — Release Candidate Readiness Gate & Evidence Ledger
Status: COMPLETED / FROZEN  
Canonical: `7d6f5b0a54b59d97a7b3883abf53f6035e82518a`  
Issue: #244  
PR: #245

Outcome:
- machine-verifiable RC readiness gate;
- evidence ledger foundation;
- explicit BLOCKED/eligible semantics instead of implicit release promotion.

### ES-12I4 — Manual Certification Evidence Dossier & Intake
Status: COMPLETED / FROZEN  
Canonical: `6cae3eda798cd754a0f47aa7a927fbe59749de30`  
Issue: #246  
PR: #247  
PR head: `f4a833f4304b4e5c693f35eaa6781aa1744d1011`

Post-merge evidence:
- main CI run `38208264830` — GREEN;
- Android run `38208264879` — GREEN;
- Pages/Web Beta run `38208313953` — GREEN;
- canonical readiness artifact: `orbi-energy-swarm-rc-readiness-6cae3eda798cd754a0f47aa7a927fbe59749de30`;
- Android artifact ID `11728093302`.

Outcome:
- `release/manual-certification.json`;
- manual certification verifier;
- manual evidence regression coverage;
- `docs/MANUAL_RC_CERTIFICATION.md`;
- explicit manual blockers for visual, Infinite play-feel and physical Android/GAIA evidence.

### ES-12I5 — First-frame Pause / Photo Mode Render Safety
Status: COMPLETED / FROZEN  
Canonical: `6901c67eaf369c3b41dba5d60480ad7d173275a7`  
Issue: #249  
PR: #250  
Final PR head: `ca3f1e8657380d70d28ecc16e1101b60b7d99c4a`

Key defects corrected:
- first-frame suspended render could leave the battlefield visually blank;
- Eclipse runtime seam used `simulationMutatorEffects` before safe initialization (TDZ risk), changed to the already-initialized frame projection;
- persisted unmuted audio state could try to start BGM before an allowed user gesture.

Safety behavior added:
- exactly one frozen render can materialize when suspension occurs before the first active frame;
- no physics or simulation-time advancement during that frozen render;
- no continuous expensive re-render while suspended;
- audio hydration no longer forces premature playback.

Evidence:
- branch certification run `38264942317` — GREEN;
- PR CI `38265445991` — GREEN;
- PR Android `38265446421` — GREEN;
- main CI `38265745892` — GREEN;
- main Android `38265745833` — GREEN;
- Pages `38265853615` — GREEN on exact canonical.

### ES-13J1A — Combat Chain & Resonance Core Contract
Status: COMPLETED / DEPLOYED / FROZEN  
Canonical/current `main` at this ledger snapshot: `feb263957b52839d35a7cb1249762c223ba22595`  
Issue: #251  
PR: #252

Implemented:
- pure deterministic Combat Chain + Energy Resonance core;
- 2.2 s bounded defeat-chain window;
- affinity switching increases resonance more effectively than repetition;
- one-shot diversity milestones;
- deterministic tiers: QUIET → SYNCED → HARMONIC → SURGING → OVERDRIVE_READY;
- combined chain/resonance score projection capped at 2×;
- bounded elite/boss defeat weighting;
- player damage breaks active chain and removes bounded resonance instead of wiping all progress;
- chain capped at 999, resonance at 100;
- invalid inputs fail closed;
- no live kill/HUD adoption yet in J1A.

Evidence:
- pre-PR certification `38273358267` — GREEN;
- PR CI `38273679009` — GREEN;
- PR Android `38273679054` — GREEN;
- main CI `38273920992` — GREEN;
- main Android `38273919797` — GREEN;
- Pages `38274024789` — GREEN on exact canonical.

---

## Active / not yet merged

### ES-13J1B — Live Combat Resonance Adoption & HUD
Status: ACTIVE / NOT CERTIFIED / NOT MERGED  
Issue: #253  
Branch: `feat/es-13j1b-live-combat-resonance`  
Branch head at snapshot: `11bd8c54ce88283549169b5fe903c27194b2b075`

Target scope:
- connect real enemy defeats and splash kills to J1A;
- score through J1A awarded-score path;
- projectile affinity attribution;
- accepted-damage chain break;
- simulation-time expiry;
- fresh-run reset;
- low-frequency HUD projection;
- no active Overdrive.

Current state:
- initial materialization/test attempt caught source-structure assertion issues before product commit;
- corrected test assertions retained semantic coverage;
- second certification attempt passed Repository Smoke and Gameplay;
- `test:platform` remains unresolved;
- no J1B PR should be opened or merged until the exact platform failure is explained and the full matrix is GREEN.

### ES-12I5R1 — Paused-frame regression diagnostic/corrective track
Status: DIAGNOSTIC / NOT MERGED  
Issue: #254  
Branch: `fix/es-12i5r1-paused-render-contract`  
Branch head at snapshot: `0c50b31331420384412a30880b5d2a36a00c2d75`

Important chronology:
- J1B's broader `test:platform` gate appeared to expose a paused-frame expectation conflicting with certified I5 behavior;
- an isolated correction track was opened rather than weakening tests inside J1B;
- later clean-branch diagnostics showed the apparent generated/static-test hypothesis was not yet proven;
- therefore #254 remains diagnostic, not an approved contract rewrite.

Next action: recover/reproduce the exact J1B `test:platform` failure source before modifying product or regression contracts.

### ES-13DOC — Persistent Gameplay Roadmap & Project Continuity Ledger
Status: ACTIVE DOCUMENTATION  
Issue: #255  
Branch: `docs/es-13-continuity-ledger`

Purpose:
- persist roadmap, exact current state and chronological implementation evidence inside the repository;
- eliminate dependency on chat-length/context retention;
- establish mandatory continuity updates for every future phase.

---

## Planned gameplay chronology

See `docs/ES13_GAMEPLAY_ROADMAP.md` for full acceptance intent.

1. J1B — Live Resonance + HUD
2. J2 — ORBI Overdrive
3. J3 — Advanced Enemy Formation Director
4. J4 — Tactical Enemy Families
5. J5 — Priority Targets & Chain Reactions
6. J6 — Dynamic Mid-Sector Events
7. J7 — Bonus Challenge Rounds
8. J8 — Additional Game Modes
9. J9 — Boss & Miniboss Expansion
10. J10 — Expert Risk/Reward Mechanics
11. J11 — Build & Synergy Expansion
12. J12 — Rare Events & Secret Encounters
13. J13 — Score, Rank & Mastery Layer
14. J14 — Procedural Interaction Matrix
15. J15 — Gameplay Integration & Long-Range Balance Certification

Post-J15 direction: ES-14 — Living Warfront.

---

## Open manual/physical certification blockers

These are not failed engineering tasks; they require real human/device evidence and remain open:
- #4 — Premium Presentation & Responsive Game View;
- #5 — Infinite play-feel;
- #202 — GAIA physical runtime/performance certification;
- #248 — Android real-device manual certification.

Final broad RC evidence collection is deferred while ES-13 materially changes gameplay. Targeted human testing may still be requested earlier when a feature specifically requires it.

---

## Ledger maintenance rule

For every future merged phase, append/update:
- phase name and status;
- exact canonical SHA;
- Issue and PR numbers;
- key implementation outcome;
- pre-PR certification run(s), if used;
- PR CI/Android run IDs;
- main CI/Android/Pages run IDs;
- unresolved follow-ups;
- roadmap status transition.

Never record a phase as deployed solely because a PR merged.