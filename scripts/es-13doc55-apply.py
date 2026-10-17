from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one marker, found {count}: {old[:180]!r}")
    p.write_text(text.replace(old, new, 1))


def replace_between(path: str, start: str, end: str, replacement: str) -> None:
    p = Path(path)
    text = p.read_text()
    if text.count(start) != 1:
        raise SystemExit(f"{path}: start marker count != 1: {start!r}")
    start_index = text.index(start)
    end_index = text.find(end, start_index)
    if end_index < 0:
        raise SystemExit(f"{path}: end marker not found after start: {end!r}")
    p.write_text(text[:start_index] + replacement + text[end_index:])


roadmap = "docs/ES13_GAMEPLAY_ROADMAP.md"
ledger = "docs/IMPLEMENTATION_LEDGER.md"
continuity = "docs/PROJECT_CONTINUITY.md"

j9a_evidence = '''Exact deployment anchors:
- final pre-PR certification SHA `472a18a517c04e2e82c93ef810448eaf34477581`, run `39043701649`, certify `117428112142` + Android `117428293682` GREEN with APK build/verify/upload;
- clean PR #478 head `efb18fb0983e86034ca0e6a59e6b726a2d3b529a`, exact final diff 3 files;
- PR CI #564 `39043937609` / `117428803297` GREEN; Android #127 `39043937582` / `117428803218` GREEN with APK build/verify/upload;
- canonical `171a8104900be17de62d91a765aab59c626b9d21`, parent `abe1ce116f3b92620afa99377008eb38382e56d1`, tree `afb16253b9c88864246b8766b9b7daabe0e485e3`, exact final diff 3 files;
- main CI #565 `39044053175` / `117429143893` GREEN; Android #128 `39044053230` / `117429144497` GREEN with APK build/verify/upload;
- Pages/Web Beta #168 `39044123765`, build `117429345859` + deploy `117429422116` GREEN;
- Issue #477 CLOSED / completed.
'''

j9b_target = '''### ES-13J9B — Pure Blackout Architect Structural-Zone Topology Contract
Status: **NEXT CONTRACT TARGET AFTER DOC55 CLOSURE**

J9B must consume frozen J9A identity and freeze only the bounded structural topology needed before a physical chassis or live encounter can be justified: exactly four immutable cardinal anchors (`NORTH`, `EAST`, `SOUTH`, `WEST`) and one fail-closed core-exposure eligibility projection. Core exposure is ineligible until all four canonical anchors are destroyed and eligible only when all four are destroyed. Duplicate, unknown, missing or padded anchor facts fail closed.

J9B owns no coordinates/rendering, anchor health, damage application, phase count/thresholds, vulnerability duration, `EnemyType`, `BossChassisId`, attacks/cooldowns, spawn/milestone/rematch/runtime adoption, timer/clock, arena mutation, HUD, reward/economy/persistence, entity/projectile collection or scan, cap/budget, FOTON or formation authority. It does not make Blackout Architect live.
'''

# Roadmap: close the hold, record J9A, activate only J9B.
replace_between(
    roadmap,
    "## Post-J8 roadmap hold\n",
    "## J10 — Expert Risk / Reward\n",
    '''## J9 — Boss & Miniboss Expansion
Status: **ACTIVE PROGRAM — J9A DEPLOYED / J9B NEXT**

Blackout Architect, Helios Devourer, Null Choir, Quantum Leviathan, Dyson Breaker, Swarm Sovereign and Singularity Engine remain the long-range J9 vocabulary. New boss work must use phases, destructible zones, affinity/formation pressure, battlefield manipulation and telegraphed vulnerability windows without bypassing existing caps/budgets or certified boss authorities.

### ES-13J9A — Pure Blackout Architect Battlefield-Control Profile Contract
Status: **DEPLOYED / FROZEN**
Canonical: `171a8104900be17de62d91a765aab59c626b9d21`
Issue #477 / PR #478

J9A freezes exactly one pure/fail-closed semantic boss profile:
- `BLACKOUT_ARCHITECT` / `Blackout Architect`;
- family `BATTLEFIELD_CONTROL`;
- profile mode `PROFILE_ONLY`;
- encounter role `SPATIAL_CONTROL_CAPITAL`;
- compatibility vocabulary for multiphase structure, destructible structural zones, affinity pressure, formation pressure, arena-geometry manipulation and telegraphed exposure windows;
- unsupported ids fail closed;
- exactly one positive authority: profile definition.

J9A deliberately leaves unresolved `EnemyType`, `BossChassisId`, health/scaling, phase count/thresholds, structural-zone count/health/geometry, vulnerability duration, attacks/weights/cooldowns, spawn cadence, milestone/rematch/live adoption and arena mutation implementation. It owns no timer/clock, damage, rewards/economy, persistence, HUD, entity/projectile collection, randomness, caps/budgets or FOTON/formation authority. Existing Devourer/Titan/Worm and Campaign/Infinite/Score Attack authorities remain unchanged.

''' + j9a_evidence + '''
''' + j9b_target + '''
''',
)

# Ledger: record J9A canonical and replace the old post-J8 hold with J9 evidence + J9B target.
replace_once(
    ledger,
    "| ES-13J8P — Controlled Public Score Attack Selection & Presentation Adoption | DEPLOYED / FROZEN | `c29df45aebf4a0b3d58038a42b8c539234b42745` | #473 | #474 |\n",
    "| ES-13J8P — Controlled Public Score Attack Selection & Presentation Adoption | DEPLOYED / FROZEN | `c29df45aebf4a0b3d58038a42b8c539234b42745` | #473 | #474 |\n| ES-13J9A — Pure Blackout Architect Battlefield-Control Profile Contract | DEPLOYED / FROZEN | `171a8104900be17de62d91a765aab59c626b9d21` | #477 | #478 |\n",
)
replace_between(
    ledger,
    "## Roadmap hold\n",
    "## Program sequence\n",
    '''### J9A — Pure Blackout Architect Battlefield-Control Profile Contract
- First authorized J9 slice after DOC54; pure/fail-closed profile only.
- Canonical `BLACKOUT_ARCHITECT` / `BATTLEFIELD_CONTROL` / `PROFILE_ONLY` / `SPATIAL_CONTROL_CAPITAL` identity.
- Compatibility vocabulary only: multiphase, structural zones, affinity/formation pressure, arena-geometry manipulation and telegraphed exposure windows.
- Exactly one positive authority: profile definition; all live/chassis/timing/spawn/damage/economy/persistence/HUD/cap/FOTON/formation choices remain unresolved or negative.
- Final pre-PR `472a18a517c04e2e82c93ef810448eaf34477581`: run `39043701649`, certify `117428112142` + Android `117428293682` GREEN.
- PR #478 head `efb18fb0983e86034ca0e6a59e6b726a2d3b529a`: CI #564 `39043937609` / `117428803297` + Android #127 `39043937582` / `117428803218` GREEN.
- Canonical `171a8104900be17de62d91a765aab59c626b9d21`, parent `abe1ce116f3b92620afa99377008eb38382e56d1`, tree `afb16253b9c88864246b8766b9b7daabe0e485e3`, exact diff 3 files.
- Main CI #565 `39044053175` / `117429143893`, Android #128 `39044053230` / `117429144497`, Pages #168 `39044123765` build `117429345859` + deploy `117429422116` GREEN.

## Next planned gameplay

''' + j9b_target + '''
J10–J15 remain **PLANNED / DEFERRED — NOT ACTIVE** while J9 is active. ES-14 remains **FUTURE PROGRAM / NOT YET COMMITTED**. J4D+ and J3C-C remain deferred/not cancelled.

''',
)

# Continuity: make J9A the gameplay canonical and activate J9B.
replace_between(
    continuity,
    "## Current certified gameplay canonical\n",
    "## J4C-C result\n",
    '''## Current certified gameplay canonical

`171a8104900be17de62d91a765aab59c626b9d21`

Phase: **ES-13J9A — Pure Blackout Architect Battlefield-Control Profile Contract**
Status: **DEPLOYED / FROZEN**
Issue: #477 — CLOSED / completed
Delivery: PR #478 — squash merged

Single parent: `abe1ce116f3b92620afa99377008eb38382e56d1` — DOC54 documentation canonical.

Canonical tree: `afb16253b9c88864246b8766b9b7daabe0e485e3`.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13/J9 materially expands gameplay contracts.

''',
)
replace_between(
    continuity,
    "## Roadmap hold after J8\n",
    "## Resolved diagnostics\n",
    '''## J9A result
J9A opened the explicitly authorized J9 Boss & Miniboss Expansion program without adopting a new live boss. It defines `BLACKOUT_ARCHITECT` / `Blackout Architect` as a pure battlefield-control capital-boss profile compatible with multiphase structure, destructible structural zones, affinity/formation pressure, arena-geometry manipulation and telegraphed exposure windows. Unsupported ids fail closed and only profile-definition authority is positive.

J9A intentionally does not select `EnemyType`, `BossChassisId`, health, phase thresholds/count, structural-zone topology/health/geometry, vulnerability duration, attacks/cooldowns, spawn/runtime, timers, arena mutation, damage/economy/persistence/HUD, collections/scans, caps/budgets or FOTON/formation authority. Existing Devourer/Titan/Worm and Campaign/Infinite/Score Attack authorities remain unchanged.

## J9A exact evidence
- DOC54 baseline `abe1ce116f3b92620afa99377008eb38382e56d1`;
- final pre-PR certification SHA `472a18a517c04e2e82c93ef810448eaf34477581`, run `39043701649`, certify `117428112142` + Android `117428293682` GREEN including APK build/verify/upload;
- clean PR #478 head `efb18fb0983e86034ca0e6a59e6b726a2d3b529a`, exact final diff 3 files;
- PR CI #564 `39043937609` / `117428803297` GREEN;
- PR Android #127 `39043937582` / `117428803218` GREEN including APK build/verify/upload;
- canonical `171a8104900be17de62d91a765aab59c626b9d21`, single parent `abe1ce116f3b92620afa99377008eb38382e56d1`, tree `afb16253b9c88864246b8766b9b7daabe0e485e3`, exact final diff 3 files;
- main CI #565 `39044053175` / `117429143893` GREEN;
- main Android #128 `39044053230` / `117429144497` GREEN including APK build/verify/upload;
- Pages/Web Beta #168 `39044123765`: build `117429345859` + deploy `117429422116` GREEN.

Issue #477 CLOSED / completed. J9A is **DEPLOYED / FROZEN**.

## Next gameplay phase

''' + j9b_target + '''
J10–J15 remain planned/deferred and are not active. J3C-C/J4D+ remain deferred/not cancelled. Manual blockers #4/#5/#202/#248 remain open and are not replaced by CI evidence.

''',
)
replace_between(
    continuity,
    "> Continue ORBI Energy Swarm autonomously.",
    "\n\n## Update obligation\n",
    '''> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J9A gameplay canonical is `171a8104900be17de62d91a765aab59c626b9d21`, fully DEPLOYED / FROZEN via Issue #477 / PR #478 with exact pre-PR, PR-head and post-main CI/Android/Pages GREEN. Complete DOC55 if still open, then implement ES-13J9B as the pure Blackout Architect structural-zone topology prerequisite: consume frozen J9A identity; exactly four cardinal structural anchors; core exposure eligibility only after all four canonical anchors are destroyed; fail closed on malformed topology facts; do not select coordinates, health, phases, exposure duration, chassis/EnemyType, attacks, spawn/runtime, timers, damage/economy/persistence/HUD or caps/budgets. Preserve existing Devourer/Titan/Worm, Campaign/Infinite/Score Attack authorities, J3C-C/J4D+ deferrals, manual blockers #4/#5/#202/#248 and FOTON/formations. Follow Issue → exact-base branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.''',
)
