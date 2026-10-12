from pathlib import Path


def replace_between(text: str, start: str, end: str, replacement: str, label: str) -> str:
    a = text.find(start)
    if a < 0:
        raise SystemExit(f"{label}: missing start marker")
    b = text.find(end, a)
    if b < 0:
        raise SystemExit(f"{label}: missing end marker")
    return text[:a] + replacement + text[b:]


# PROJECT_CONTINUITY
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
current = """## Current certified gameplay canonical

`0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`

Phase: **ES-13J3C-A — Pure Advanced Enemy Formation Vocabulary**  
Status: **DEPLOYED / FROZEN**  
Issue: #302 — CLOSED  
PR: #303 — squash merged

Single parent: `31de2cd5bb89ae3032902c09ace881119c04dfec` — ES-13DOC11 documentation canonical.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J3C-A implementation summary
J3C-A expanded the existing pure enemy route projection authority without changing live runtime adoption.

Final files:
- `src/game/enemyFormationRoutes.ts`;
- `tests/gameplay/enemy-formation-routes.test.ts`;
- `tests/es-13j3c-a-advanced-route-vocabulary.test.mjs`.

Certified pure vocabulary now contains six routes:
- `PINCER`, `X_CROSS`, `SERPENTINE` — J3A preserved;
- `WEDGE` — center denial / choose a flank or commit through the point;
- `ORBIT` — rotating exclusion ring / inside-vs-outside timing;
- `SPIRAL` — rotating compression corridor / time the tightening gap.

Pure-contract guarantees:
- caller owns route/member slot/count/progress/mirror;
- max route members remains 8;
- normalized extent remains ±1.25;
- exact ENTRY/PRESSURE/EXIT/COMPLETE phase boundaries remain caller-progress driven;
- all valid slots/progress/mirrors remain finite, bounded and deterministic;
- WEDGE/ORBIT require at least 3 slots; SPIRAL requires at least 2;
- route-specific roles, telegraph kinds, severity, laneCount and safeIntent are explicit;
- no imports, renderer, React, audio, storage, network, RNG, wall clock, RAF, timers, entity/projectile ownership or Campaign/Infinite selection;
- J3B live `ROUTE_CYCLE` intentionally remained PINCER/X_CROSS/SERPENTINE only;
- no `EnergySwarmGame.tsx`, live director, player/FOTON formations, caps, budgets, score/economy/damage/projectiles, J1/J2, GAIA or FOTON GLB changes.

## J3C-A exact evidence
- pre-PR certified head `51a6bb26fd0aabb9400de921ef0351d4deb8afe8`;
- pre-PR certification run `38315199129`, job `115030050802` — GREEN across repository/gameplay/platform/typecheck/release/dossier/build/readiness/Android/APK/J3C-A purity guard;
- final clean PR head `71eaccdd4682e53ee13006b7fe1b70f5033e3bc6`;
- PR CI `38315423545` — GREEN on exact final PR head;
- PR Android `38315423642` — GREEN on exact final PR head;
- squash canonical `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`;
- main CI `38315550962` — GREEN on exact canonical;
- main Android `38315550956` — GREEN on exact canonical;
- Pages `38315617546` — build + deploy GREEN on exact canonical.

Temporary certification workflow was branch-only and removed before the final PR diff.

"""
s = replace_between(s, "## Current certified gameplay canonical", "## J3B implementation summary", current, "continuity current phase")
s = s.replace(
    "- J3B — Live Enemy Formation Director Adoption: `0fcf08dc59558619da61e1120eef2e957465f9a1`.\n",
    "- J3B — Live Enemy Formation Director Adoption: `0fcf08dc59558619da61e1120eef2e957465f9a1`;\n- J3C-A — Pure Advanced Enemy Formation Vocabulary: `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`.\n",
    1,
)
admin = """## Current administrative work
Issue #304 — `ES-13DOC12 — J3C-A Closure Ledger & J3C-B Activation`  
Branch: `docs/es-13-j3c-a-closure-j3c-b-activation`  
Baseline gameplay canonical: `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`  
Scope: documentation only.

## Next gameplay phase

### ES-13J3C-B — Controlled Live Adoption
Status: **NEXT ENGINEERING TARGET AFTER DOC12 CLOSURE**

Purpose: selectively expose the certified WEDGE/ORBIT/SPIRAL vocabulary through the existing J3B live director without creating new entity ownership, spawn events, scans or movement authority.

Critical adoption constraints:
- current J3B group size 2 cannot satisfy WEDGE/ORBIT minimum 3;
- group size must be route-aware and bounded rather than globally increased;
- every member consumes an existing regular spawn opportunity and current remaining capacity;
- no route may reserve or spawn more members than available capacity/budget;
- incomplete assembly fails safely back to legacy behavior without stale ownership;
- one live formation group remains active/assembling at a time;
- route selection/group sizing are deterministic after assignment and use simulation time only;
- Campaign and Infinite eligibility remain explicit and independently configurable;
- milestones/evolved/random elites/minibosses/bosses remain excluded unless separately scoped;
- no additional full-array scan or parallel movement engine;
- player/FOTON formation authority stays separate and untouched.

J3C-C remains a later optional slice for stateful convoy/fake-retreat/portal/encirclement patterns. J3D remains Telegraph/Fairness/Integration Certification.

"""
s = replace_between(s, "## Current administrative work", "## Frozen manual/physical blockers", admin, "continuity admin/next")
p.write_text(s)

# IMPLEMENTATION_LEDGER
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
row = "| ES-13J3C-A — Pure Advanced Enemy Formation Vocabulary | DEPLOYED / FROZEN | `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8` | #302 | #303 |"
anchor = "| ES-13J3B — Live Enemy Formation Director Adoption | DEPLOYED / FROZEN | `0fcf08dc59558619da61e1120eef2e957465f9a1` | #298 | #299 |"
if row not in s:
    if anchor not in s:
        raise SystemExit("ledger table anchor missing")
    s = s.replace(anchor, anchor + "\n" + row, 1)
section = """### J3C-A — Pure Advanced Enemy Formation Vocabulary
Expanded the existing pure J3A route projection authority with WEDGE, ORBIT and SPIRAL while preserving PINCER/X_CROSS/SERPENTINE behavior. Max local route members remains 8 and normalized extent remains ±1.25. New routes have explicit minimum counts, roles, telegraphs and safe intents. J3B live selection was intentionally not changed.

Final files:
- `src/game/enemyFormationRoutes.ts`;
- `tests/gameplay/enemy-formation-routes.test.ts`;
- `tests/es-13j3c-a-advanced-route-vocabulary.test.mjs`.

Evidence:
- pre-PR certified head `51a6bb26fd0aabb9400de921ef0351d4deb8afe8`;
- pre-PR run `38315199129`, job `115030050802` GREEN;
- final PR head `71eaccdd4682e53ee13006b7fe1b70f5033e3bc6`;
- PR CI `38315423545` GREEN;
- PR Android `38315423642` GREEN;
- canonical `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`, single parent `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- main CI `38315550962` GREEN;
- main Android `38315550956` GREEN;
- Pages `38315617546` build + deploy GREEN.

No live runtime/director/player-formation/cap/budget/score/economy/damage/projectile/J1/J2/GAIA/FOTON GLB changes. Temporary certification workflow was removed before PR.

"""
marker = "## Documentation continuity milestones"
if section not in s:
    if marker not in s:
        raise SystemExit("ledger documentation marker missing")
    s = s.replace(marker, section + marker, 1)
s = s.replace(
    "- DOC11 — #300: ACTIVE documentation closure at this ledger update; baseline J3B gameplay canonical `0fcf08dc59558619da61e1120eef2e957465f9a1`; activates J3C after merge.",
    "- DOC11 — #300 / PR #301: J3B closure + J3C activation; successor `31de2cd5bb89ae3032902c09ace881119c04dfec`.\n- DOC12 — #304: ACTIVE documentation closure at this ledger update; baseline J3C-A gameplay canonical `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`; activates J3C-B after merge.",
    1,
)
next_section = """## Next gameplay phase

### ES-13J3C-B — Controlled Live Adoption
Status: NEXT ENGINEERING TARGET AFTER DOC12 CLOSURE

Adopt certified WEDGE/ORBIT/SPIRAL selectively through the existing J3B live director. Route-aware member counts are required: WEDGE/ORBIT minimum 3, SPIRAL minimum 2. Do not solve this by globally increasing every formation group.

Required boundaries:
- existing regular spawn opportunities/capacity only;
- no extra entity arrays/maps/full-array scans;
- one movement authority;
- deterministic caller-owned assignment/progress;
- simulation-time pause safety;
- explicit Campaign/Infinite eligibility;
- bounded assembly and safe legacy fallback;
- no milestone/boss/evolved adoption unless separately scoped;
- no cap/budget/score/economy/damage/projectile/J1/J2/GAIA/FOTON GLB change.

J3C-C stateful patterns and J3D fairness/integration remain later phases.

"""
s = replace_between(s, "## Next gameplay phase", "## Remaining ES-13 chronology", next_section, "ledger next phase")
p.write_text(s)

# ROADMAP
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
s = p.read_text()
j3c = """### J3C — Advanced Tactical Formation Vocabulary
Status: **ACTIVE PROGRAM**

Purpose: expand enemy route vocabulary only where a new pattern creates a distinct tactical question while reusing the certified J3A/J3B authority.

#### J3C-A — Pure Advanced Route Vocabulary
Status: **DEPLOYED / FROZEN**  
Canonical: `0fd337e3a0efe96fd52d5f5686e3f110e1b361d8`  
Issue #302 / PR #303

Implemented:
- added `WEDGE`, `ORBIT`, `SPIRAL` to the pure enemy route projection authority;
- preserved `PINCER`, `X_CROSS`, `SERPENTINE` behavior/contracts;
- preserved local route member cap 8 and normalized extent ±1.25;
- WEDGE: center denial / flank choice, minimum 3 members;
- ORBIT: rotating exclusion ring / inside-outside timing, minimum 3 members;
- SPIRAL: rotating compression corridor / timing the gap, minimum 2 members;
- explicit advanced member roles, telegraph kinds/severity/laneCount/safeIntent;
- deterministic bounded geometry across all valid slots/progress/mirrors;
- no imports, side effects, time/RNG authority, live director adoption, Campaign/Infinite selection, entity/projectile ownership or player-formation changes.

Evidence: pre-PR `38315199129` / job `115030050802`; PR CI `38315423545`; PR Android `38315423642`; main CI `38315550962`; main Android `38315550956`; Pages `38315617546` — GREEN.

#### J3C-B — Controlled Live Adoption
Status: **NEXT ENGINEERING SLICE AFTER DOC12 CLOSURE**

Goal: expose the advanced pure routes through the existing J3B live director without increasing combat budgets or creating parallel ownership.

Critical design point: the J3B live group size 2 cannot satisfy WEDGE/ORBIT minimum 3. J3C-B must therefore make planning route-aware rather than increasing all formations globally.

Required contract:
- route plan determines required group size within existing local max 8;
- formation members consume ordinary spawn opportunities one by one; no burst/extra spawns;
- start a route only when current remaining capacity can satisfy its required group size;
- pending assembly is bounded and fails safely if it cannot complete;
- one active/assembling formation group at a time;
- deterministic route cycle/selection after assignment;
- existing `enemiesRef.current` and per-enemy assignment metadata remain authoritative;
- route motion continues to replace the legacy movement branch, never stack;
- simulation time owns progression; pause/photo/reset safety preserved;
- explicit independent Campaign/Infinite eligibility;
- milestones/evolved/random elites/minibosses/bosses excluded unless separately scoped;
- no new full-array scan, entity/projectile cap change, score/economy/damage/J1/J2/GAIA/FOTON change.

#### J3C-C — Stateful Tactical Patterns if justified
Status: PLANNED

Candidate later patterns: convoy/leader-follower, fake retreats, portal ambushes, encirclement, staggered artillery routes. Isolate any extra state/telegraph authority rather than hiding it inside the simple normalized-route model.

Admission rule: every pattern must create a distinct player decision rather than merely more density.

"""
s = replace_between(s, "### J3C — Advanced Tactical Formation Vocabulary", "### J3D — Telegraph / Fairness / Integration Certification", j3c, "roadmap J3C")
p.write_text(s)
