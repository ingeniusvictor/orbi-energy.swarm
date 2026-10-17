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

j9c_evidence = '''Exact deployment anchors:
- final pre-PR certification SHA `35f4ff652c16cce0947ce4933ad2a53782bd3282`, run `39063229301`, certify `117485369790` + Android `117485575582` GREEN with APK build/verify/upload;
- clean PR #486 head `6cbf41303a7f3a39456e41b99aa4acda3f2d1319`, exact final diff 3 files;
- PR CI #572 `39063443167` / `117486039223` GREEN; Android #131 `39063443163` / `117486039354` GREEN with APK build/verify/upload;
- canonical `370f770171993760a3e11fa0aa95bcaa4318b758`, parent `cf745bb7b17cd2c2421d3531cf2646dd726774c3`, tree `8e6d7edae749c4ed1a02520ebeb46224e0625c51`, exact final diff 3 files;
- main CI #573 `39063581950` / `117486443399` GREEN; Android #132 `39063581938` / `117486443301` GREEN with APK build/verify/upload;
- Pages/Web Beta #172 `39063646443`, build `117486635370` + deploy `117486721807` GREEN;
- Issue #485 CLOSED / completed.
'''

j9d_contract = '''### ES-13J9D — Pure Blackout Architect Chassis Selection/Binding Contract
Status: **NEXT CONTRACT TARGET AFTER DOC57 CLOSURE**

J9D must consume the frozen J9C `COMPATIBILITY_ONLY` projection as its immediate authority input and freeze only the selected Blackout Architect chassis identity. The exact positive binding is `BLACKOUT_ARCHITECT -> TITAN_CORE`; the result remains pure `SELECTION_ONLY / BINDING_ONLY`, immutable and fail-closed on null, malformed, padded or tampered J9C projections.

J9D owns only boss-chassis selection/binding authority. It must not re-read or duplicate physical chassis compatibility rules, modify J9A/J9B/J9C, select `EnemyType`, inherit the Titan `6000 ms` exposure duration, weakpoint health/geometry/damage, base health, intro timing, attacks/weights, rewards or Infinite raid configuration, spawn/adopt a live boss, or acquire milestone/rematch/runtime, timer/clock, arena mutation, HUD, economy/persistence, collection/entity/projectile, randomness, cap/budget, FOTON or formation authority. Any `EnemyType` or recipe/effect compatibility mapping remains a later separate prerequisite before live adoption.

'''

replace_once(
    roadmap,
    "Status: **ACTIVE PROGRAM — J9B DEPLOYED / J9C NEXT**",
    "Status: **ACTIVE PROGRAM — J9C DEPLOYED / J9D NEXT**",
)
replace_between(
    roadmap,
    "### ES-13J9C — Pure Blackout Architect Chassis Compatibility Contract\n",
    "## J10 — Expert Risk / Reward\n",
    '''### ES-13J9C — Pure Blackout Architect Chassis Compatibility Contract
Status: **DEPLOYED / FROZEN**
Canonical: `370f770171993760a3e11fa0aa95bcaa4318b758`
Issue #485 / PR #486

J9C freezes one pure/fail-closed structural chassis-compatibility result without selecting or adopting a live boss:
- consumes frozen J9A identity, frozen J9B four-anchor topology and existing pure boss-chassis descriptor facts only;
- `TITAN_CORE` is the sole compatible existing candidate;
- exact compatibility requires four weakpoints, `ANCHORED` motion and angular velocity `0`;
- malformed/padded facts, unsupported ids and canonical descriptor drift fail closed;
- returns only immutable `COMPATIBILITY_ONLY` metadata;
- exactly one positive authority: chassis compatibility;
- no boss-chassis selection, `EnemyType`, health/geometry/damage, vulnerability duration, phase, attack, spawn/runtime, timer, arena, HUD, economy/persistence, collections, randomness, cap/budget, FOTON or formation authority.

''' + j9c_evidence + "\n" + j9d_contract,
)

replace_once(
    ledger,
    "| ES-13J9B — Pure Blackout Architect Structural-Zone Topology Contract | DEPLOYED / FROZEN | `18dd628981182740905fa6e05a463c525c699e37` | #481 | #482 |\n",
    "| ES-13J9B — Pure Blackout Architect Structural-Zone Topology Contract | DEPLOYED / FROZEN | `18dd628981182740905fa6e05a463c525c699e37` | #481 | #482 |\n| ES-13J9C — Pure Blackout Architect Chassis Compatibility Contract | DEPLOYED / FROZEN | `370f770171993760a3e11fa0aa95bcaa4318b758` | #485 | #486 |\n",
)
replace_between(
    ledger,
    "## Next planned gameplay\n",
    "## Program sequence\n",
    '''## J9C — Pure Blackout Architect Chassis Compatibility Contract
- Consumes frozen J9A + J9B and existing pure boss-chassis descriptor facts only.
- `TITAN_CORE` is the sole compatible candidate from exact `count=4`, `ANCHORED`, angular velocity `0` facts.
- Malformed/padded input, unsupported ids and descriptor drift fail closed.
- Grants only chassis compatibility; no selection/live adoption or inherited Titan gameplay configuration.
- Final pre-PR `35f4ff652c16cce0947ce4933ad2a53782bd3282`: run `39063229301`, certify `117485369790` + Android `117485575582` GREEN.
- PR #486 head `6cbf41303a7f3a39456e41b99aa4acda3f2d1319`: CI #572 `39063443167` / `117486039223` + Android #131 `39063443163` / `117486039354` GREEN.
- Canonical `370f770171993760a3e11fa0aa95bcaa4318b758`, parent `cf745bb7b17cd2c2421d3531cf2646dd726774c3`, tree `8e6d7edae749c4ed1a02520ebeb46224e0625c51`, exact diff 3 files.
- Main CI #573 `39063581950` / `117486443399`, Android #132 `39063581938` / `117486443301`, Pages #172 `39063646443` build `117486635370` + deploy `117486721807` GREEN.

## Next planned gameplay

''' + j9d_contract,
)

replace_between(
    continuity,
    "## Current certified gameplay canonical\n",
    "## J4C-C result\n",
    '''## Current certified gameplay canonical

`370f770171993760a3e11fa0aa95bcaa4318b758`

Phase: **ES-13J9C — Pure Blackout Architect Chassis Compatibility Contract**
Status: **DEPLOYED / FROZEN**
Issue: #485 — CLOSED / completed
Delivery: PR #486 — squash merged

Single parent: `cf745bb7b17cd2c2421d3531cf2646dd726774c3` — DOC56 documentation canonical.

Canonical tree: `8e6d7edae749c4ed1a02520ebeb46224e0625c51`.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13/J9 materially expands gameplay contracts.

''',
)
replace_between(
    continuity,
    "## Next gameplay phase\n",
    "## Resolved diagnostics\n",
    '''## J9C result
J9C froze the Blackout Architect structural chassis compatibility prerequisite without selecting or adopting a live chassis. It consumes frozen J9A identity, frozen J9B topology and existing pure boss-chassis descriptor facts; only `TITAN_CORE` passes exact four-weakpoint + `ANCHORED` + zero-angular-velocity compatibility. Malformed/padded input, unsupported ids and descriptor drift fail closed. The output is immutable `COMPATIBILITY_ONLY` metadata with exactly one positive authority: chassis compatibility. It owns no chassis selection, `EnemyType`, health/geometry/damage, vulnerability duration, phase, attack, spawn/runtime, timer, HUD, economy/persistence or cap/budget authority.

## J9C exact evidence
- DOC56 baseline `cf745bb7b17cd2c2421d3531cf2646dd726774c3`;
- final pre-PR certification SHA `35f4ff652c16cce0947ce4933ad2a53782bd3282`, run `39063229301`, certify `117485369790` + Android `117485575582` GREEN including APK build/verify/upload;
- clean PR #486 head `6cbf41303a7f3a39456e41b99aa4acda3f2d1319`, exact final diff 3 files;
- PR CI #572 `39063443167` / `117486039223` GREEN;
- PR Android #131 `39063443163` / `117486039354` GREEN including APK build/verify/upload;
- canonical `370f770171993760a3e11fa0aa95bcaa4318b758`, single parent `cf745bb7b17cd2c2421d3531cf2646dd726774c3`, tree `8e6d7edae749c4ed1a02520ebeb46224e0625c51`, exact final diff 3 files;
- main CI #573 `39063581950` / `117486443399` GREEN;
- main Android #132 `39063581938` / `117486443301` GREEN including APK build/verify/upload;
- Pages/Web Beta #172 `39063646443`: build `117486635370` + deploy `117486721807` GREEN.

Issue #485 CLOSED / completed. J9C is **DEPLOYED / FROZEN**.

## Next gameplay phase

''' + j9d_contract,
)
replace_between(
    continuity,
    "> Continue ORBI Energy Swarm autonomously.",
    "\n\n## Update obligation\n",
    '''> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J9C gameplay canonical is `370f770171993760a3e11fa0aa95bcaa4318b758`, fully DEPLOYED / FROZEN via Issue #485 / PR #486 with exact pre-PR, PR-head and post-main CI/Android/Pages GREEN. Complete DOC57 if still open, then implement ES-13J9D as the pure Blackout Architect chassis selection/binding prerequisite: consume only the frozen J9C compatibility projection; bind `BLACKOUT_ARCHITECT -> TITAN_CORE` in immutable `SELECTION_ONLY / BINDING_ONLY` metadata; fail closed on malformed/tampered J9C projections; do not re-read chassis descriptors, select EnemyType, inherit 6000 ms/health/geometry/damage/attacks/rewards, or adopt spawn/runtime/timer/HUD/persistence/cap-budget authority. Preserve existing Infinite Titan raid behavior, Campaign/Infinite/Score Attack authorities, J3C-C/J4D+ deferrals, manual blockers #4/#5/#202/#248, FOTON and formations. Follow Issue → exact-base branch → full gates → PR → exact-SHA post-merge evidence. Never touch main directly or weaken tests.''',
)
