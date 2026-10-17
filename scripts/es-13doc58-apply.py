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

j9d_evidence = '''Exact deployment anchors:
- final pre-PR certification SHA `4b76ecab06d9f6f4821124a691281a985be7878d`, run `39064919895`, certify `117490426242` + Android `117490630927` GREEN with APK build/verify/upload;
- clean PR #490 head `9b830a66685e23f8f5f0d6f5bf1ac1f7dd5a650c`, exact final diff 3 files;
- PR CI #576 `39065137175` / `117491073954` GREEN; Android #133 `39065137241` / `117491074272` GREEN with APK build/verify/upload;
- canonical `4bc4d70b1d54217dcbfca1a4745042dbb8770fe6`, parent `e5c64daa4f3aa84868c5411cdd767e7d0b4ce1f4`, tree `56e1a19d3f1c5b632a23589b6442c70f372e80bc`, exact final diff 3 files;
- main CI #577 `39065273273` / `117491506912` GREEN; Android #134 `39065273265` / `117491507018` GREEN with APK build/verify/upload;
- Pages/Web Beta #174 `39065343745`, build `117491719509` + deploy `117491803289` GREEN;
- Issue #489 CLOSED / completed.
'''

j9e_contract = '''### ES-13J9E — Pure Blackout Architect EnemyType Compatibility Mapping Contract
Status: **NEXT CONTRACT TARGET AFTER DOC58 CLOSURE**

J9E must consume the frozen J9D `SELECTION_ONLY / BINDING_ONLY` projection as its immediate selection authority and freeze only the descriptive executable-type compatibility mapping for the selected chassis. The exact mapping is `BLACKOUT_ARCHITECT / TITAN_CORE -> EnemyType.BOSS_TITAN`, validated against the existing pure `bossChassis.ts` descriptor fact. Existing `infiniteRaidEscalation.ts` independently confirms the same `TITAN_CORE / BOSS_TITAN` pair but contributes no cadence, multiplier, reward, spawn or runtime authority.

J9E must emit immutable `COMPATIBILITY_ONLY` / mapping-only metadata and fail closed on null, malformed, padded or tampered J9D selection facts or canonical descriptor drift. It owns only EnemyType compatibility/mapping authority. It must not spawn or live-adopt Blackout Architect, inherit Titan base/weakpoint health, geometry, damage multipliers, `6000 ms` exposure duration, intro timing, attacks/weights, rewards, raid cadence/multipliers, or acquire milestone/rematch/runtime, timer/clock, arena mutation, HUD, economy/persistence, collection/entity/projectile, randomness, cap/budget, FOTON or formation authority.

'''

replace_once(
    roadmap,
    "Status: **ACTIVE PROGRAM — J9C DEPLOYED / J9D NEXT**",
    "Status: **ACTIVE PROGRAM — J9D DEPLOYED / J9E NEXT**",
)
replace_between(
    roadmap,
    "### ES-13J9D — Pure Blackout Architect Chassis Selection/Binding Contract\n",
    "## J10 — Expert Risk / Reward\n",
    '''### ES-13J9D — Pure Blackout Architect Chassis Selection/Binding Contract
Status: **DEPLOYED / FROZEN**
Canonical: `4bc4d70b1d54217dcbfca1a4745042dbb8770fe6`
Issue #489 / PR #490

J9D freezes only the selected Blackout Architect chassis identity after frozen J9C compatibility:
- consumes only exact frozen J9C `COMPATIBILITY_ONLY` projection facts;
- accepts only `BLACKOUT_ARCHITECT / COMPATIBILITY_ONLY / TITAN_CORE / structuralAnchorCount=4`;
- malformed, missing, padded or tampered input fails closed;
- emits immutable minimal `SELECTION_ONLY / BINDING_ONLY` metadata for `BLACKOUT_ARCHITECT -> TITAN_CORE`;
- exactly one positive composite authority: boss-chassis selection/binding;
- no direct `bossChassis.ts` or `types.ts` read and no duplicated physical compatibility logic;
- no EnemyType, health/geometry/damage, vulnerability duration, attacks, rewards, raid configuration, spawn/runtime, timer, HUD, persistence or cap/budget authority.

''' + j9d_evidence + "\n" + j9e_contract,
)

replace_once(
    ledger,
    "| ES-13J9C — Pure Blackout Architect Chassis Compatibility Contract | DEPLOYED / FROZEN | `370f770171993760a3e11fa0aa95bcaa4318b758` | #485 | #486 |\n",
    "| ES-13J9C — Pure Blackout Architect Chassis Compatibility Contract | DEPLOYED / FROZEN | `370f770171993760a3e11fa0aa95bcaa4318b758` | #485 | #486 |\n| ES-13J9D — Pure Blackout Architect Chassis Selection/Binding Contract | DEPLOYED / FROZEN | `4bc4d70b1d54217dcbfca1a4745042dbb8770fe6` | #489 | #490 |\n",
)
replace_between(
    ledger,
    "## Next planned gameplay\n",
    "## Program sequence\n",
    '''## J9D — Pure Blackout Architect Chassis Selection/Binding Contract
- Consumes frozen J9C compatibility only and binds `BLACKOUT_ARCHITECT -> TITAN_CORE`.
- Exact J9C shape is required; malformed/padded/tampered selection input fails closed.
- Emits only immutable `SELECTION_ONLY / BINDING_ONLY` metadata.
- Does not re-read chassis descriptors, select EnemyType or inherit any Titan live configuration.
- Final pre-PR `4b76ecab06d9f6f4821124a691281a985be7878d`: run `39064919895`, certify `117490426242` + Android `117490630927` GREEN.
- PR #490 head `9b830a66685e23f8f5f0d6f5bf1ac1f7dd5a650c`: CI #576 `39065137175` / `117491073954` + Android #133 `39065137241` / `117491074272` GREEN.
- Canonical `4bc4d70b1d54217dcbfca1a4745042dbb8770fe6`, parent `e5c64daa4f3aa84868c5411cdd767e7d0b4ce1f4`, tree `56e1a19d3f1c5b632a23589b6442c70f372e80bc`, exact diff 3 files.
- Main CI #577 `39065273273` / `117491506912`, Android #134 `39065273265` / `117491507018`, Pages #174 `39065343745` build `117491719509` + deploy `117491803289` GREEN.

## Next planned gameplay

''' + j9e_contract,
)

replace_between(
    continuity,
    "## Current certified gameplay canonical\n",
    "## J4C-C result\n",
    '''## Current certified gameplay canonical

`4bc4d70b1d54217dcbfca1a4745042dbb8770fe6`

Phase: **ES-13J9D — Pure Blackout Architect Chassis Selection/Binding Contract**
Status: **DEPLOYED / FROZEN**
Issue: #489 — CLOSED / completed
Delivery: PR #490 — squash merged

Single parent: `e5c64daa4f3aa84868c5411cdd767e7d0b4ce1f4` — DOC57 documentation canonical.

Canonical tree: `56e1a19d3f1c5b632a23589b6442c70f372e80bc`.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13/J9 materially expands gameplay contracts.

''',
)
replace_between(
    continuity,
    "## Next gameplay phase\n",
    "## Resolved diagnostics\n",
    '''## J9D result
J9D froze only the selected Blackout Architect chassis identity after frozen J9C compatibility. It consumes exact J9C `COMPATIBILITY_ONLY` metadata, validates the canonical `BLACKOUT_ARCHITECT / TITAN_CORE / structuralAnchorCount=4` shape and emits immutable `SELECTION_ONLY / BINDING_ONLY` metadata. Malformed, missing, padded or tampered input fails closed. It grants exactly one positive composite authority: boss-chassis selection/binding, with no direct chassis-descriptor read, EnemyType selection or live runtime authority.

## J9D exact evidence
- DOC57 baseline `e5c64daa4f3aa84868c5411cdd767e7d0b4ce1f4`;
- final pre-PR certification SHA `4b76ecab06d9f6f4821124a691281a985be7878d`, run `39064919895`, certify `117490426242` + Android `117490630927` GREEN including APK build/verify/upload;
- clean PR #490 head `9b830a66685e23f8f5f0d6f5bf1ac1f7dd5a650c`, exact final diff 3 files;
- PR CI #576 `39065137175` / `117491073954` GREEN;
- PR Android #133 `39065137241` / `117491074272` GREEN including APK build/verify/upload;
- canonical `4bc4d70b1d54217dcbfca1a4745042dbb8770fe6`, single parent `e5c64daa4f3aa84868c5411cdd767e7d0b4ce1f4`, tree `56e1a19d3f1c5b632a23589b6442c70f372e80bc`, exact final diff 3 files;
- main CI #577 `39065273273` / `117491506912` GREEN;
- main Android #134 `39065273265` / `117491507018` GREEN including APK build/verify/upload;
- Pages/Web Beta #174 `39065343745`: build `117491719509` + deploy `117491803289` GREEN.

Issue #489 CLOSED / completed. J9D is **DEPLOYED / FROZEN**.

## Next gameplay phase

''' + j9e_contract,
)
replace_between(
    continuity,
    "> Continue ORBI Energy Swarm autonomously.",
    "\n\n## Update obligation\n",
    '''> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J9D gameplay canonical is `4bc4d70b1d54217dcbfca1a4745042dbb8770fe6`, fully DEPLOYED / FROZEN via Issue #489 / PR #490 with exact pre-PR, PR-head and post-main CI/Android/Pages GREEN. Complete DOC58 if still open, then implement ES-13J9E as the pure Blackout Architect EnemyType compatibility mapping prerequisite: consume frozen J9D selection; validate only the existing `TITAN_CORE -> EnemyType.BOSS_TITAN` chassis descriptor fact; emit immutable `COMPATIBILITY_ONLY` mapping metadata; do not inherit Titan health/geometry/damage/6000 ms/attacks/rewards/raid cadence or adopt spawn/runtime/timer/HUD/persistence/cap-budget authority. Preserve existing Infinite Titan raid behavior, Campaign/Infinite/Score Attack authorities, J3C-C/J4D+ deferrals, manual blockers #4/#5/#202/#248, FOTON and formations. Follow Issue → exact-base branch → full gates → PR → exact-SHA post-merge evidence. Never touch main directly or weaken tests.''',
)
