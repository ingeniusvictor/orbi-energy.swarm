from pathlib import Path

BASE_SHA = "55d824d2b9cfaf6bb8cd97a032866b1fbcfa92fb"
BASE_TREE = "442611df6707d609c73637da48ef70096feb902d"
DOC21_SHA = "8a1e17b87cdd8508453814454175ef7f0b95c6ce"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def replace_section(text: str, start: str, end: str, body: str, label: str) -> str:
    if text.count(start) != 1:
        raise RuntimeError(f"{label}: start marker count != 1")
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[:start_index] + body.rstrip() + "\n\n" + text[end_index:]


continuity_path = Path("docs/PROJECT_CONTINUITY.md")
continuity = continuity_path.read_text(encoding="utf-8")
continuity = replace_section(
    continuity,
    "## Current certified gameplay canonical",
    "## J4C-C result",
    f"""## Current certified gameplay canonical

`{BASE_SHA}`

Phase: **ES-13J5C — Live Command-Core Priority Presentation**
Status: **DEPLOYED / FROZEN**
Issue: #343 — CLOSED / completed
Delivery: PR #344 — squash merged

Single parent: `{DOC21_SHA}` — DOC21 documentation canonical.

Canonical tree: `{BASE_TREE}`, exactly equal to final PR-head tree.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.""",
    "continuity current canonical",
)

j5c_result = f"""## J5C result
J5C delivered the first live Command Core adoption as presentation only, reusing current J3/J5B facts without adding entity state or combat authority.

Certified live behavior:
- current active formation facts are projected through J5B on demand inside the existing Canvas enemy pass;
- only a valid current `COMMAND_CORE` receives one bounded static priority ring plus top chevron;
- linked/invalid/no-formation members receive no marker;
- J3 remains authoritative for formation lifetime, so the marker disappears naturally when `enemyFormation` is cleared;
- existing enemy body/telegraphs render before the marker and the damaged-health bar remains after it;
- no text label, linked-member line, cross-entity lookup, second enemy scan or collection;
- no new `EnemyType`, `Enemy` field, runtime state, timer or RNG authority;
- no spawn/progression, damage, defeat, score, reward, economy, cap/budget or chain-reaction effect;
- J3, J4, J5A and J5B contracts remain unchanged.

Final product scope exactly:
- `src/game/EnergySwarmCanvas.tsx`;
- `src/game/liveCommandCorePresentation.ts`;
- `tests/es-13j5c-live-command-core-presentation.test.mjs`;
- `tests/gameplay/live-command-core-presentation.test.ts`.

## J5C exact evidence
- DOC21 baseline `{DOC21_SHA}`;
- pre-PR SHA `8b493a1e09c03620df9f5d2785fd8e16d062a062`, run `38573138443` / job `115883247207` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact product-scope guard and Android APK build/verify/upload;
- final PR #344 head `36f4895119d5642624135d5a6af072236faf76d2`;
- PR CI `38573643779` / `115884993730` GREEN;
- PR Android `38573643737` / `115884991853` GREEN including Build/Verify/Upload APK;
- canonical `{BASE_SHA}`, single parent `{DOC21_SHA}`, tree `{BASE_TREE}` equal to final PR-head tree;
- canonical diff exactly four certified product files;
- main CI `38573884299` / `115885813621` GREEN;
- main Android `38573884191` / `115885814664` GREEN including Build/Verify/Upload APK;
- Pages `38574014576`: build `115886257262` + deploy `115886451208` GREEN.

Issue #343 CLOSED / completed. J5C is **DEPLOYED / FROZEN**.
"""
continuity = replace_once(
    continuity,
    "## ES-13 gameplay canonicals",
    j5c_result + "\n## ES-13 gameplay canonicals",
    "continuity J5C result insertion",
)
continuity = replace_once(
    continuity,
    "- J5B — Pure Command-Link Binding Contract: `f868058889b24fecbd97f968e932890248ca2b33`.\n",
    "- J5B — Pure Command-Link Binding Contract: `f868058889b24fecbd97f968e932890248ca2b33`.\n"
    f"- J5C — Live Command-Core Priority Presentation: `{BASE_SHA}`.\n",
    "continuity gameplay canonical list",
)
continuity = replace_once(
    continuity,
    "- DOC21 — J5B closure & J5C activation: Issue #341, branch `docs/es-13-j5b-closure-j5c-activation`, documentation-only closure in progress from gameplay canonical `f868058889b24fecbd97f968e932890248ca2b33`.\n",
    f"- DOC21 — J5B closure & J5C activation: `{DOC21_SHA}` — Issue #341 / PR #342.\n"
    f"- DOC22 — J5C closure & J5D activation: Issue #345, branch `docs/es-13-j5c-closure-j5d-activation`, documentation-only closure in progress from gameplay canonical `{BASE_SHA}`.\n",
    "continuity docs canonicals",
)
continuity = replace_section(
    continuity,
    "## Next gameplay phase",
    "## Resolved diagnostics",
    """## Next gameplay phase

### ES-13J5D — Pure Command-Link Break Resolution Contract
Status: **NEXT ENGINEERING TARGET AFTER DOC22 CLOSURE**

J5D remains pure because post-J5C discovery proved that live defeat routing is centralized but the runtime has no safe durable `groupId → live linked enemy ids` index. A live detach today would require a new collection or an enemy-array scan, neither of which is justified yet.

Required direction:
- consume current J5B formation/binding facts only;
- require a valid current `COMMAND_CORE` binding; linked or invalid members fail closed;
- reuse J5A `COMMAND_LINK_BROKEN` rather than invent another defeat signal;
- project bounded linked member indices `[1]` or `[1,2]` plus intent `DETACH_LINKED_MEMBERS`;
- effect mode is `INTENT_ONLY` and non-mutating;
- output contains no live enemy ids and performs no lookup/scan/collection work;
- no J3/J5A/J5B mutation and no `EnergySwarmGame.tsx` or entity-schema adoption;
- no damage, kill, score, reward, economy, spawn, progression, timer/RNG, cap or budget authority;
- actual live application must wait for a later J5 slice that independently proves a bounded safe lookup/application strategy.

J4D+ additional tactical families remain **DEFERRED / NOT CURRENTLY JUSTIFIED**. J3C-C remains deferred, not cancelled.""",
    "continuity next gameplay",
)
continuity = replace_once(
    continuity,
    "`J5C Live Command-Core Priority Presentation → J5D+ Controlled Command-Core Defeat/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "`J5D Pure Command-Link Break Resolution Contract → J5E+ Controlled Live Command-Link Application/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "continuity chronology",
)
continuity = replace_section(
    continuity,
    "Suggested handoff:",
    "## Update obligation",
    f"""Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J5C gameplay canonical is `{BASE_SHA}`, fully DEPLOYED / FROZEN via Issue #343 / PR #344 with exact four-file product scope. Complete DOC22 if still open, then implement J5D Pure Command-Link Break Resolution Contract only: reuse J5A `COMMAND_LINK_BROKEN` + J5B bounded linked indices, emit `DETACH_LINKED_MEMBERS` as `INTENT_ONLY`, and do not add live enemy lookup, scans, collections, runtime mutation or chain reaction. Keep J4D+ families and J3C-C deferred until prerequisites are proven. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.""",
    "continuity handoff",
)
continuity_path.write_text(continuity, encoding="utf-8")

ledger_path = Path("docs/IMPLEMENTATION_LEDGER.md")
ledger = ledger_path.read_text(encoding="utf-8")
ledger = replace_once(
    ledger,
    "| ES-13J5B — Pure Command-Link Binding Contract | DEPLOYED / FROZEN | `f868058889b24fecbd97f968e932890248ca2b33` | #339 | #340 |\n",
    "| ES-13J5B — Pure Command-Link Binding Contract | DEPLOYED / FROZEN | `f868058889b24fecbd97f968e932890248ca2b33` | #339 | #340 |\n"
    f"| ES-13J5C — Live Command-Core Priority Presentation | DEPLOYED / FROZEN | `{BASE_SHA}` | #343 | #344 |\n",
    "ledger completed row",
)
ledger_j5c = f"""### J5C — Live Command-Core Priority Presentation
J5C adopted Command Core semantics live as presentation only. The existing Canvas enemy pass derives J5B binding from current `enemy.enemyFormation`; only a valid core gets a bounded static ring + chevron. No Enemy field, second scan/collection, cross-entity lookup, combat/progression effect, timer/RNG or chain-reaction authority was added. J3 lifecycle clearing automatically removes the presentation.

Final product diff exactly:
- `src/game/EnergySwarmCanvas.tsx`;
- `src/game/liveCommandCorePresentation.ts`;
- `tests/es-13j5c-live-command-core-presentation.test.mjs`;
- `tests/gameplay/live-command-core-presentation.test.ts`.

Exact evidence:
- baseline `{DOC21_SHA}`;
- pre-PR `8b493a1e09c03620df9f5d2785fd8e16d062a062`, run `38573138443` / job `115883247207` GREEN including exact scope + Android APK;
- final PR #344 head `36f4895119d5642624135d5a6af072236faf76d2`;
- PR CI `38573643779` / `115884993730` GREEN; Android `38573643737` / `115884991853` GREEN;
- canonical `{BASE_SHA}`, parent `{DOC21_SHA}`, tree `{BASE_TREE}` equal to final PR tree;
- main CI `38573884299` / `115885813621` GREEN; Android `38573884191` / `115885814664` GREEN;
- Pages `38574014576`, build `115886257262` + deploy `115886451208` GREEN.

Issue #343 CLOSED / completed. J5C is **DEPLOYED / FROZEN**.

"""
ledger = replace_once(
    ledger,
    "## Documentation canonicals",
    ledger_j5c + "## Documentation canonicals",
    "ledger J5C evidence insertion",
)
ledger = replace_once(
    ledger,
    "- DOC21 — J5B closure & J5C activation: Issue #341, branch `docs/es-13-j5b-closure-j5c-activation`, in progress from gameplay canonical `f868058889b24fecbd97f968e932890248ca2b33`.\n",
    f"- DOC21 — J5B closure & J5C activation: `{DOC21_SHA}` — Issue #341 / PR #342.\n"
    f"- DOC22 — J5C closure & J5D activation: Issue #345, branch `docs/es-13-j5c-closure-j5d-activation`, in progress from gameplay canonical `{BASE_SHA}`.\n",
    "ledger docs canonicals",
)
ledger = replace_section(
    ledger,
    "## Next planned gameplay",
    "J4D+ additional tactical families remain deferred:",
    """## Next planned gameplay

### ES-13J5D — Pure Command-Link Break Resolution Contract
Status: **NEXT ENGINEERING TARGET AFTER DOC22 CLOSURE**.

The direct-hit and splash death paths already converge through existing `registerCombatDefeat(...)`, but there is no safe durable `groupId` lookup for linked live enemies. J5D therefore remains pure: combine J5A defeat semantics with current J5B binding, require `COMMAND_CORE`, return `COMMAND_LINK_BROKEN` + bounded linked indices + `DETACH_LINKED_MEMBERS` as `INTENT_ONLY`, and fail closed otherwise. Add no live ids, scans, collections, runtime mutation, damage/kill/score/reward or timing/cap authority.

A later J5 slice must prove live lookup/application separately before chain-reaction behavior.

""",
    "ledger next gameplay",
)
ledger_path.write_text(ledger, encoding="utf-8")

roadmap_path = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
roadmap = roadmap_path.read_text(encoding="utf-8")
roadmap = replace_section(
    roadmap,
    "### J5C — Live Command-Core Priority Presentation",
    "## J6 — Dynamic Mid-Sector Events",
    f"""### J5C — Live Command-Core Priority Presentation
Status: **DEPLOYED / FROZEN**
Canonical: `{BASE_SHA}`
Issue #343 / PR #344

Certified behavior:
- current active J5B binding is derived on demand from `enemy.enemyFormation` inside the existing Canvas enemy pass;
- only current valid `COMMAND_CORE` gets one bounded static ring + top chevron;
- linked/invalid/no-formation members receive no marker;
- J3 lifecycle clearing automatically removes the marker;
- no text, cross-entity linked line, second enemy scan or collection;
- no new EnemyType/Enemy field/runtime state;
- no spawn/progression, damage, defeat, score, reward, timer/RNG or chain-reaction authority;
- existing enemy body/telegraphs remain before the marker and damaged health bar remains after it.

Exact deployment anchors:
- pre-PR `8b493a1e09c03620df9f5d2785fd8e16d062a062`, run `38573138443` / job `115883247207` GREEN including scope guard + Android APK;
- final PR #344 head `36f4895119d5642624135d5a6af072236faf76d2`;
- PR CI `38573643779` / `115884993730` GREEN; Android `38573643737` / `115884991853` GREEN;
- canonical `{BASE_SHA}`, parent `{DOC21_SHA}`, tree `{BASE_TREE}`;
- main CI `38573884299` / `115885813621` GREEN; Android `38573884191` / `115885814664` GREEN;
- Pages `38574014576`, build `115886257262` + deploy `115886451208` GREEN.

### J5D — Pure Command-Link Break Resolution Contract
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC22 CLOSURE**

Post-J5C discovery found that direct and splash defeats already converge through `registerCombatDefeat(...)`, but the runtime has no safe durable mapping from J3 `groupId` to linked live enemy ids. J5D therefore defines only the bounded semantic resolution required before any live application.

Design constraints:
- pure contract only; no `EnergySwarmGame.tsx` or entity-schema adoption;
- consume current J5B formation/binding facts;
- require a valid `COMMAND_CORE` binding; linked/invalid input returns null;
- reuse J5A `COMMAND_LINK_BROKEN` signal;
- output bounded linked member indices `[1]` or `[1,2]` and intent `DETACH_LINKED_MEMBERS`;
- effect mode `INTENT_ONLY` / non-mutating;
- no live enemy ids, group lookup, enemy scan, collection or entity mutation;
- no damage/kill/score/reward/economy, spawn/progression, clock/RNG or cap/budget authority;
- preserve J3/J5A/J5B/J5C and all J1–J4/FOTON/player authorities.

A later J5E+ slice must independently prove a bounded safe live lookup/application strategy before detach/chain-reaction effects are adopted.""",
    "roadmap J5C/J5D",
)
roadmap_path.write_text(roadmap, encoding="utf-8")

for path in (continuity_path, ledger_path, roadmap_path):
    text = path.read_text(encoding="utf-8")
    if "\r\n" in text:
        raise RuntimeError(f"{path}: CRLF unexpectedly present")
    if not text.endswith("\n"):
        path.write_text(text + "\n", encoding="utf-8")

print("ES-13DOC22 patch applied to exactly three documentation files.")
