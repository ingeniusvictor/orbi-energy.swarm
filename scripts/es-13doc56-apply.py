from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one marker, found {count}: {old[:160]!r}")
    p.write_text(text.replace(old, new, 1))


def replace_between(path: str, start: str, end: str, replacement: str) -> None:
    p = Path(path)
    text = p.read_text()
    if text.count(start) != 1:
        raise SystemExit(f"{path}: start marker count != 1: {start!r}")
    start_index = text.index(start)
    end_index = text.find(end, start_index)
    if end_index < 0:
        raise SystemExit(f"{path}: end marker not found: {end!r}")
    p.write_text(text[:start_index] + replacement + text[end_index:])


roadmap = "docs/ES13_GAMEPLAY_ROADMAP.md"
ledger = "docs/IMPLEMENTATION_LEDGER.md"
continuity = "docs/PROJECT_CONTINUITY.md"

j9b_evidence = '''Exact deployment anchors:
- final pre-PR certification SHA `f26ce4869e77e287fd81ad63bbba1918c5317b66`, run `39055709331`, certify `117463126475` + Android `117463318912` GREEN with APK build/verify/upload;
- clean PR #482 head `9a9aecbd7ecc275673408f5ef4371e20accbc624`, exact final diff 3 files;
- PR CI #568 `39055907357` / `117463703000` GREEN; Android #129 `39055907372` / `117463703013` GREEN with APK build/verify/upload;
- canonical `18dd628981182740905fa6e05a463c525c699e37`, parent `f9b343ee4a8a89bd64a09ac4e291c931dd60309f`, tree `d5ef99a040022dcdd7aaffe1ece027ef5b18d5a7`, exact final diff 3 files;
- main CI #569 `39056014167` / `117464017817` GREEN; Android #130 `39056014168` / `117464017941` GREEN with APK build/verify/upload;
- Pages/Web Beta #170 `39056065279`, build `117464181336` + deploy `117464235678` GREEN;
- Issue #481 CLOSED / completed.
'''

j9c_contract = '''### ES-13J9C — Pure Blackout Architect Chassis Compatibility Contract
Status: **NEXT CONTRACT TARGET AFTER DOC56 CLOSURE**

J9C must consume frozen J9A + J9B facts plus the existing pure boss-chassis descriptors and establish only structural compatibility, not live selection. Existing `TITAN_CORE` is the sole compatible candidate because it supplies exactly four weakpoints with `ANCHORED` motion and zero angular velocity, matching J9B's four fixed structural anchors. Unsupported chassis ids and mismatched/mutated compatibility facts must fail closed.

J9C may expose only a pure compatibility result for `TITAN_CORE`. It must not select/adopt `TITAN_CORE` into Blackout Architect runtime and must not inherit its `6000 ms` exposure duration, weakpoint health/geometry, damage multipliers, `EnemyType`, base health, intro timing, attacks/weights, rewards, Infinite raid cadence/spawn/rematch authority, timer/clock, HUD, economy/persistence, collections/caps/budgets/entities/projectiles, FOTON or formations. Existing Infinite Titan raid behavior remains unchanged and authoritative for its own flow.

'''

replace_between(
    roadmap,
    "### ES-13J9B — Pure Blackout Architect Structural-Zone Topology Contract\n",
    "## J10 — Expert Risk / Reward\n",
    '''### ES-13J9B — Pure Blackout Architect Structural-Zone Topology Contract
Status: **DEPLOYED / FROZEN**
Canonical: `18dd628981182740905fa6e05a463c525c699e37`
Issue #481 / PR #482

J9B freezes the bounded structural prerequisite over J9A without selecting a physical chassis or live encounter:
- exactly four immutable canonical anchors: `NORTH`, `EAST`, `SOUTH`, `WEST`;
- exact four unique `{ anchorId, destroyed }` facts only;
- unknown, duplicate, missing, padded or non-boolean facts fail closed;
- core exposure remains `LOCKED` until all four anchors are destroyed and becomes `ELIGIBLE` only when all four are destroyed;
- exactly two positive authorities: structural-topology definition and pure core-exposure eligibility projection;
- no coordinates/rendering, anchor health, damage, phase/timer, chassis, attacks, spawn/runtime, HUD, economy/persistence, collection/cap/budget/FOTON/formation authority.

''' + j9b_evidence + "\n" + j9c_contract,
)

replace_once(
    ledger,
    "| ES-13J9A — Pure Blackout Architect Battlefield-Control Profile Contract | DEPLOYED / FROZEN | `171a8104900be17de62d91a765aab59c626b9d21` | #477 | #478 |\n",
    "| ES-13J9A — Pure Blackout Architect Battlefield-Control Profile Contract | DEPLOYED / FROZEN | `171a8104900be17de62d91a765aab59c626b9d21` | #477 | #478 |\n| ES-13J9B — Pure Blackout Architect Structural-Zone Topology Contract | DEPLOYED / FROZEN | `18dd628981182740905fa6e05a463c525c699e37` | #481 | #482 |\n",
)
replace_between(
    ledger,
    "## Next planned gameplay\n",
    "## Program sequence\n",
    '''## J9B — Pure Blackout Architect Structural-Zone Topology Contract
- Consumes frozen J9A only; exactly four immutable cardinal anchors `NORTH/EAST/SOUTH/WEST`.
- Exact four unique `{ anchorId, destroyed }` facts; malformed/duplicate/unknown/missing/padded/non-boolean facts fail closed.
- Core exposure is `LOCKED` until all four are destroyed and `ELIGIBLE` only when all four are destroyed.
- No physical chassis, geometry, health/damage, phase/timer, attack, runtime/spawn, HUD, persistence/economy, cap/budget/FOTON/formation authority.
- Final pre-PR `f26ce4869e77e287fd81ad63bbba1918c5317b66`: run `39055709331`, certify `117463126475` + Android `117463318912` GREEN.
- PR #482 head `9a9aecbd7ecc275673408f5ef4371e20accbc624`: CI #568 `39055907357` / `117463703000` + Android #129 `39055907372` / `117463703013` GREEN.
- Canonical `18dd628981182740905fa6e05a463c525c699e37`, parent `f9b343ee4a8a89bd64a09ac4e291c931dd60309f`, tree `d5ef99a040022dcdd7aaffe1ece027ef5b18d5a7`, exact diff 3 files.
- Main CI #569 `39056014167` / `117464017817`, Android #130 `39056014168` / `117464017941`, Pages #170 `39056065279` build `117464181336` + deploy `117464235678` GREEN.

## Next planned gameplay

''' + j9c_contract,
)

replace_between(
    continuity,
    "## Current certified gameplay canonical\n",
    "## J4C-C result\n",
    '''## Current certified gameplay canonical

`18dd628981182740905fa6e05a463c525c699e37`

Phase: **ES-13J9B — Pure Blackout Architect Structural-Zone Topology Contract**
Status: **DEPLOYED / FROZEN**
Issue: #481 — CLOSED / completed
Delivery: PR #482 — squash merged

Single parent: `f9b343ee4a8a89bd64a09ac4e291c931dd60309f` — DOC55 documentation canonical.

Canonical tree: `d5ef99a040022dcdd7aaffe1ece027ef5b18d5a7`.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13/J9 materially expands gameplay contracts.

''',
)
replace_between(
    continuity,
    "## Next gameplay phase\n",
    "## Resolved diagnostics\n",
    '''## J9B result
J9B froze the Blackout Architect structural-zone topology without selecting a physical chassis or live encounter. It consumes frozen J9A only, defines exactly four immutable cardinal anchors (`NORTH`, `EAST`, `SOUTH`, `WEST`), accepts only exact unique `{ anchorId, destroyed }` facts, fails closed on malformed topology input and projects core exposure as `LOCKED` until all four anchors are destroyed and `ELIGIBLE` only when all four are destroyed. It owns no geometry/rendering, health/damage, phase/timer, chassis, attack, spawn/runtime, HUD, economy/persistence or collection/cap/budget authority.

## J9B exact evidence
- DOC55 baseline `f9b343ee4a8a89bd64a09ac4e291c931dd60309f`;
- final pre-PR certification SHA `f26ce4869e77e287fd81ad63bbba1918c5317b66`, run `39055709331`, certify `117463126475` + Android `117463318912` GREEN including APK build/verify/upload;
- clean PR #482 head `9a9aecbd7ecc275673408f5ef4371e20accbc624`, exact final diff 3 files;
- PR CI #568 `39055907357` / `117463703000` GREEN;
- PR Android #129 `39055907372` / `117463703013` GREEN including APK build/verify/upload;
- canonical `18dd628981182740905fa6e05a463c525c699e37`, single parent `f9b343ee4a8a89bd64a09ac4e291c931dd60309f`, tree `d5ef99a040022dcdd7aaffe1ece027ef5b18d5a7`, exact final diff 3 files;
- main CI #569 `39056014167` / `117464017817` GREEN;
- main Android #130 `39056014168` / `117464017941` GREEN including APK build/verify/upload;
- Pages/Web Beta #170 `39056065279`: build `117464181336` + deploy `117464235678` GREEN.

Issue #481 CLOSED / completed. J9B is **DEPLOYED / FROZEN**.

## Next gameplay phase

''' + j9c_contract,
)
replace_between(
    continuity,
    "> Continue ORBI Energy Swarm autonomously.",
    "\n\n## Update obligation\n",
    '''> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J9B gameplay canonical is `18dd628981182740905fa6e05a463c525c699e37`, fully DEPLOYED / FROZEN via Issue #481 / PR #482 with exact pre-PR, PR-head and post-main CI/Android/Pages GREEN. Complete DOC56 if still open, then implement ES-13J9C as the pure Blackout Architect chassis compatibility prerequisite: consume frozen J9A + J9B and existing boss-chassis descriptor facts; establish only `TITAN_CORE` structural compatibility from exact four weakpoints + ANCHORED motion + zero angular velocity; do not live-select/adopt the chassis and do not inherit its 6000 ms exposure timer, geometry/health/damage, EnemyType, attacks, rewards or Infinite raid runtime/spawn authority. Preserve existing Devourer/Titan/Worm live behavior, Campaign/Infinite/Score Attack authorities, J3C-C/J4D+ deferrals, manual blockers #4/#5/#202/#248, caps/budgets/entities, FOTON and formations. Follow Issue → exact-base branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.''',
)
