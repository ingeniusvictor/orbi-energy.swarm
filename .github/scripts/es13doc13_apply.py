from pathlib import Path


def replace_between(text: str, start: str, end: str, replacement: str, label: str) -> str:
    a = text.find(start)
    if a < 0:
        raise SystemExit(f"{label}: missing start marker")
    b = text.find(end, a)
    if b < 0:
        raise SystemExit(f"{label}: missing end marker")
    return text[:a] + replacement + text[b:]


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f"{label}: missing exact marker")
    return text.replace(old, new, 1)


# PROJECT_CONTINUITY
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
current = """## Current certified gameplay canonical

`5c345672b5365dbcc983403f73da62555489a98f`

Phase: **ES-13J3C-B — Controlled Live Advanced Formation Adoption**  
Status: **DEPLOYED / FROZEN**  
Issue: #306 — CLOSED  
PR: #307 — squash merged

Single parent: `f85e2432934454da191dea9bd0c9da43bbce86ca` — ES-13DOC12 documentation canonical.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J3C-B implementation summary
J3C-B selectively adopted the certified J3C-A advanced routes through the existing J3B live director without changing the game runtime seam.

Final files:
- `src/game/liveEnemyFormationDirector.ts`;
- `tests/gameplay/live-enemy-formation-director.test.ts`;
- `tests/es-13j3c-b-controlled-live-adoption.test.mjs`;
- `tests/es-13j3c-a-advanced-route-vocabulary.test.mjs`.

Certified live plans:
- PINCER → 2 members;
- X_CROSS → 2 members;
- SERPENTINE → 2 live members;
- WEDGE → 3 members;
- ORBIT → 3 members;
- SPIRAL → 2 members.

Certified live guarantees:
- legacy pair routes remain pairs; only WEDGE/ORBIT use the bounded advanced size 3;
- route planning is deterministic and route-aware rather than globally increasing density;
- every formation member consumes an existing ordinary CRAWLER/SPLITTER spawn opportunity;
- no extra/burst spawn event is created;
- a route starts only when current remaining capacity can satisfy its planned member count;
- pending assembly refuses capacity overcommit and expires safely without replacement spawns;
- one active or assembling group remains authoritative at a time;
- advanced-route adoption is independently configurable across Campaign and Infinite;
- existing `enemiesRef.current` plus per-enemy assignment metadata remain authoritative;
- `EnergySwarmGame.tsx`, `types.ts`, player/FOTON formations and global constants were untouched;
- route movement continues through the existing J3B movement seam and simulation time;
- pause/photo behavior, Hydro cancellation, fresh-run/wave/boss reset and legacy fallback remain intact;
- milestones/evolved/random elites/minibosses/bosses remain excluded from this slice;
- no new full-array scan, entity/projectile ownership, cap/budget increase, score/economy/damage/projectile/J1/J2/GAIA/FOTON GLB change.

## J3C-B exact evidence
- pre-PR certified head `2e1c69580443273911358383800f6e324f0ba77f`;
- pre-PR certification run `38317062905`, job `115036102323` — GREEN across repository/gameplay/platform/typecheck/release/dossier/build/readiness/Android/APK/J3C-B scope/adoption guard;
- final clean PR head `eba0d94663c217ee56986f0d7ca86c4d873f08f3`;
- PR CI `38317340298` — GREEN on exact final PR head;
- PR Android `38317340308` — GREEN on exact final PR head;
- squash canonical `5c345672b5365dbcc983403f73da62555489a98f`;
- main CI `38317440415` — GREEN on exact canonical;
- main Android `38317440420` — GREEN on exact canonical;
- Pages `38317520671` — build + deploy GREEN on exact canonical.

Temporary certification workflow was branch-only and removed before the final PR diff.

"""
s = replace_between(s, "## Current certified gameplay canonical", "## J3B implementation summary", current, "continuity current")
s = replace_once(
    s,
    "- J3C-A — Pure Advanced Enemy Formation Vocabulary: `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`.",
    "- J3C-A — Pure Advanced Enemy Formation Vocabulary: `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`;\n- J3C-B — Controlled Live Advanced Formation Adoption: `5c345672b5365dbcc983403f73da62555489a98f`.",
    "continuity canonical list",
)
admin = """## Current administrative work
Issue #308 — `ES-13DOC13 — J3C-B Closure & J3D Certification Activation`  
Branch: `docs/es-13-j3c-b-closure-j3d-activation`  
Baseline gameplay canonical: `5c345672b5365dbcc983403f73da62555489a98f`  
Scope: documentation only.

## Next gameplay phase

### ES-13J3D — Telegraph / Fairness / Integration Certification
Status: **NEXT ENGINEERING TARGET AFTER DOC13 CLOSURE**

Purpose: certify the complete six-route J3 formation system before adding more enemy-formation state or moving to J4.

Certification priorities:
- prove route-specific telegraph metadata exists before severe crossing/compression pressure;
- certify lead-in and recovery timing for both 2- and 3-member live plans;
- prove WEDGE/ORBIT assembly cannot overcommit current capacity or create hidden density;
- certify incomplete assembly, Hydro cancellation, fresh-run/wave/boss reset and pause/photo safety;
- certify deterministic replay boundaries and explicit Campaign/Infinite policy;
- prove no cap/budget/entity/projectile/score/economy/J1/J2 regression;
- prove player/FOTON formation authority remains separate;
- repeat desktop + Android automated certification and exact-SHA deployment evidence.

J3C-C is **DEFERRED / NOT CURRENTLY JUSTIFIED**, not cancelled. Stateful convoy/leader-follower, fake-retreat, portal-ambush, encirclement or staggered-artillery patterns may return only through a dedicated issue that demonstrates a distinct tactical need and bounded extra state.

J3D is certification-first: prefer tests/contracts and make runtime corrections only when evidence demonstrates a fairness or integration defect. Existing manual/physical blockers remain open; CI must not fabricate their PASS.

"""
s = replace_between(s, "## Current administrative work", "## Frozen manual/physical blockers", admin, "continuity admin")
p.write_text(s)


# IMPLEMENTATION_LEDGER
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
anchor = "| ES-13J3C-A — Pure Advanced Enemy Formation Vocabulary | DEPLOYED / FROZEN | `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8` | #302 | #303 |"
row = "| ES-13J3C-B — Controlled Live Advanced Formation Adoption | DEPLOYED / FROZEN | `5c345672b5365dbcc983403f73da62555489a98f` | #306 | #307 |"
if row not in s:
    s = replace_once(s, anchor, anchor + "\n" + row, "ledger canonical row")

section = """### J3C-B — Controlled Live Advanced Formation Adoption
Adopted WEDGE/ORBIT/SPIRAL through the existing J3B live director using route-aware bounded plans. Legacy routes and SPIRAL remain 2-member live groups; WEDGE/ORBIT use 3. Members consume ordinary eligible spawn opportunities one by one and current remaining capacity remains authoritative. No second runtime, extra spawn event, full-array formation scan, cap/budget increase or player-formation contamination was introduced.

Final files:
- `src/game/liveEnemyFormationDirector.ts`;
- `tests/gameplay/live-enemy-formation-director.test.ts`;
- `tests/es-13j3c-b-controlled-live-adoption.test.mjs`;
- `tests/es-13j3c-a-advanced-route-vocabulary.test.mjs`.

Evidence:
- pre-PR certified head `2e1c69580443273911358383800f6e324f0ba77f`;
- pre-PR run `38317062905`, job `115036102323` GREEN;
- final PR head `eba0d94663c217ee56986f0d7ca86c4d873f08f3`;
- PR CI `38317340298` GREEN;
- PR Android `38317340308` GREEN;
- canonical `5c345672b5365dbcc983403f73da62555489a98f`, single parent `f85e2432934454da191dea9bd0c9da43bbce86ca`;
- main CI `38317440415` GREEN;
- main Android `38317440420` GREEN;
- Pages `38317520671` build + deploy GREEN.

Advanced-route Campaign/Infinite controls are explicit and independent. `EnergySwarmGame.tsx`, `types.ts`, constants/caps, player/FOTON formations, score/economy/damage/projectiles, J1/J2, GAIA and FOTON GLB were untouched. Temporary certification workflow was removed before PR.

"""
if "### J3C-B — Controlled Live Advanced Formation Adoption" not in s:
    s = replace_once(s, "## Documentation continuity milestones", section + "## Documentation continuity milestones", "ledger J3C-B section")
s = replace_once(
    s,
    "- DOC12 — #304: ACTIVE documentation closure at this ledger update; baseline J3C-A gameplay canonical `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`; activates J3C-B after merge.",
    "- DOC12 — #304 / PR #305: J3C-A closure + J3C-B activation; successor `f85e2432934454da191dea9bd0c9da43bbce86ca`.\n- DOC13 — #308: ACTIVE documentation closure at this ledger update; baseline J3C-B gameplay canonical `5c345672b5365dbcc983403f73da62555489a98f`; activates J3D after merge.",
    "ledger docs milestones",
)
next_phase = """## Next gameplay phase

### ES-13J3D — Telegraph / Fairness / Integration Certification
Status: NEXT ENGINEERING TARGET AFTER DOC13 CLOSURE

Certification-first closure of the six-route J3 system. Required evidence includes route-specific telegraph metadata, bounded lead-in/recovery timing, 2/3-member density and capacity safety, incomplete-assembly fallback, Hydro/reset/pause safety, deterministic replay/mode policy, no cap/budget/J1/J2 regression, player/FOTON separation, and desktop + Android exact-SHA certification.

J3C-C is DEFERRED / NOT CURRENTLY JUSTIFIED. Stateful convoy/fake-retreat/portal/encirclement/artillery patterns require a later dedicated issue proving a distinct tactical need and bounded extra state; they are not silently folded into J3D.

J3D should prefer tests/contracts. Runtime changes are admitted only for a demonstrated fairness or integration defect. Manual/physical blockers remain open and cannot be auto-certified.

"""
s = replace_between(s, "## Next gameplay phase", "## Remaining ES-13 chronology", next_phase, "ledger next phase")
p.write_text(s)


# ES13_GAMEPLAY_ROADMAP
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
s = p.read_text()
replacement = """#### J3C-B — Controlled Live Adoption
Status: **DEPLOYED / FROZEN**  
Canonical: `5c345672b5365dbcc983403f73da62555489a98f`  
Issue #306 / PR #307

Implemented:
- advanced route adoption through the existing J3B director; no second movement/runtime authority;
- deterministic full live cycle PINCER/X_CROSS/SERPENTINE/WEDGE/ORBIT/SPIRAL when advanced routes are enabled;
- legacy routes and SPIRAL use bounded live pairs;
- WEDGE/ORBIT use bounded 3-member plans only;
- ordinary CRAWLER/SPLITTER spawn opportunities assemble members one by one;
- current remaining capacity must satisfy the route plan before start and remaining assembly before each assignment;
- incomplete assembly expires safely without replacement spawns;
- one active or assembling group at a time;
- advanced-route adoption independently configurable for Campaign and Infinite;
- existing simulation-time movement, pause/photo safety, Hydro cancellation and run/wave/boss reset preserved;
- `EnergySwarmGame.tsx`, `types.ts`, constants/caps and player/FOTON formations untouched;
- no new full-array scan, entity/projectile ownership, score/economy/damage/J1/J2/GAIA/FOTON GLB change.

Evidence: pre-PR `38317062905` / job `115036102323`; final head `eba0d94663c217ee56986f0d7ca86c4d873f08f3`; PR CI `38317340298`; PR Android `38317340308`; main CI `38317440415`; main Android `38317440420`; Pages `38317520671` — GREEN.

#### J3C-C — Stateful Tactical Patterns if justified
Status: **DEFERRED / NOT CURRENTLY JUSTIFIED**

Potential convoy/leader-follower, fake-retreat, portal-ambush, encirclement or staggered-artillery patterns remain future candidates. Do not add them merely to expand vocabulary. Any activation requires a dedicated issue proving a distinct tactical question, explicit extra-state ownership, bounded telegraph behavior and no entity/projectile budget inflation.

### J3D — Telegraph / Fairness / Integration Certification
Status: **NEXT ENGINEERING SLICE AFTER DOC13 CLOSURE**

Certification-first goals:
- prove all six routes expose readable route-specific telegraph metadata before severe pressure;
- certify lead-in/recovery windows for both 2- and 3-member plans;
- prove WEDGE/ORBIT assembly cannot overcommit capacity or silently raise density;
- certify incomplete assembly, Hydro cancellation, fresh-run/wave/boss reset and pause/photo safety;
- certify deterministic replay boundaries and explicit Campaign/Infinite policy;
- prove no global cap/budget/entity/projectile/score/economy/J1/J2 regression;
- prove player/FOTON formation authority remains separate;
- repeat desktop + Android automated certification and exact-SHA deployment evidence.

Prefer tests/contracts and make runtime corrections only if certification exposes a demonstrated fairness or integration defect. Existing manual visual/play-feel/physical-device blockers remain open and are not replaced by CI.

"""
s = replace_between(s, "#### J3C-B — Controlled Live Adoption", "---\n\n## J4 — Tactical Enemy Families", replacement, "roadmap J3C-B/J3D")
p.write_text(s)

print("DOC13 documentation patch applied successfully")
