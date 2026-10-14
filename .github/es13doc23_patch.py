from pathlib import Path

BASE_SHA = "99410123a8f20d15a88cd20ada34523ce4497006"
BASE_TREE = "1240e692acb4622389748c9328b5b88e8563560b"
DOC22_SHA = "025bc875a4b3a9dc5d1e690591b6ae0f5af6a6ec"


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


# PROJECT_CONTINUITY.md
continuity_path = Path("docs/PROJECT_CONTINUITY.md")
continuity = continuity_path.read_text(encoding="utf-8")

continuity = replace_section(
    continuity,
    "## Current certified gameplay canonical",
    "## J4C-C result",
    f"""## Current certified gameplay canonical

`{BASE_SHA}`

Phase: **ES-13J5D — Pure Command-Link Break Resolution Contract**
Status: **DEPLOYED / FROZEN**
Issue: #347 — CLOSED / completed
Delivery: PR #348 — squash merged

Single parent: `{DOC22_SHA}` — DOC22 documentation canonical.

Canonical tree: `{BASE_TREE}`, exactly equal to final PR-head tree.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.""",
    "continuity current canonical",
)

j5d_result = f"""## J5D result
J5D established the pure deterministic Command Link break resolution required before any live detach application.

Certified contract:
- consumes only current J5B formation/binding facts;
- requires a valid current `COMMAND_CORE`; linked/invalid facts fail closed;
- reuses J5A `COMMAND_LINK_BROKEN` and verifies source `SIGNAL_ONLY` semantics;
- emits immutable intent `DETACH_LINKED_MEMBERS` with effect mode `INTENT_ONLY`;
- size-2 groups expose bounded linked indices `[1]`; size-3 groups expose `[1,2]`;
- no live enemy ids, entity lookup, array scan, collection or runtime mutation;
- no formation mutation, damage/kill, score/reward/economy, spawn/progression, clock/RNG, cap/budget or entity create/remove authority;
- J3, J5A, J5B and J5C remain unchanged.

Final product scope exactly:
- `src/game/commandLinkBreakResolution.ts`;
- `tests/es-13j5d-command-link-break-resolution.test.mjs`;
- `tests/gameplay/command-link-break-resolution.test.ts`.

## J5D exact evidence
- DOC22 baseline `{DOC22_SHA}`;
- pre-PR SHA `68d5c269f62415605c6265a1acef572f92438fa0`, run `38612549835` / job `116019315964` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact product-scope guard and Android APK build/verify/upload;
- final PR #348 head `8739313a605ccf33ddfdf69ae5e73d04f26f5957`;
- PR CI `38613042191` / `116020992856` GREEN;
- PR Android `38613042036` / `116020992132` GREEN including Build/Verify/Upload APK;
- canonical `{BASE_SHA}`, single parent `{DOC22_SHA}`, tree `{BASE_TREE}` equal to final PR-head tree;
- canonical diff exactly three certified product files;
- main CI `38613516322` / `116022626176` GREEN;
- main Android `38613516479` / `116022628100` GREEN including Build/Verify/Upload APK;
- Pages `38613648878`: build `116023067863` + deploy `116023290302` GREEN.

Issue #347 CLOSED / completed. J5D is **DEPLOYED / FROZEN**.
"""
continuity = replace_once(
    continuity,
    "## ES-13 gameplay canonicals",
    j5d_result + "\n## ES-13 gameplay canonicals",
    "continuity J5D result insertion",
)
continuity = replace_once(
    continuity,
    "- J5C — Live Command-Core Priority Presentation: `55d824d2b9cfaf6bb8cd97a032866b1fbcfa92fb`.\n",
    "- J5C — Live Command-Core Priority Presentation: `55d824d2b9cfaf6bb8cd97a032866b1fbcfa92fb`.\n"
    f"- J5D — Pure Command-Link Break Resolution Contract: `{BASE_SHA}`.\n",
    "continuity gameplay canonical list",
)
continuity = replace_once(
    continuity,
    "- DOC22 — J5C closure & J5D activation: Issue #345, branch `docs/es-13-j5c-closure-j5d-activation`, documentation-only closure in progress from gameplay canonical `55d824d2b9cfaf6bb8cd97a032866b1fbcfa92fb`.\n",
    f"- DOC22 — J5C closure & J5D activation: `{DOC22_SHA}` — Issue #345 / PR #346.\n"
    f"- DOC23 — J5D closure & J5E activation: Issue #349, branch `docs/es-13-j5d-closure-j5e-activation`, documentation-only closure in progress from gameplay canonical `{BASE_SHA}`.\n",
    "continuity docs canonicals",
)
continuity = replace_section(
    continuity,
    "## Next gameplay phase",
    "## Resolved diagnostics",
    """## Next gameplay phase

### ES-13J5E — Controlled Live Command-Link Detach Application
Status: **NEXT ENGINEERING TARGET AFTER DOC23 CLOSURE**

Post-J5D discovery proves a bounded live application without a second enemy scan or group/entity index:
- J3 serializes formation groups with `activeUntilMs`, so two active formation groups cannot legitimately overlap;
- therefore at most one current Command Core / break intent needs to be represented at a time;
- direct and splash deaths already converge through existing `registerCombatDefeat(...)`;
- enemy movement already has one authoritative `enemiesRef.current.forEach(...)` pass;
- J3 already detaches formation ownership by clearing `enemy.enemyFormation` on Hydro slow or route completion.

Required J5E direction:
- add one scalar pending `CommandLinkBreakResolution | null` slot, never a queue/collection;
- `registerCombatDefeat` may store J5D resolution only for a defeated enemy that still carries valid active core formation facts;
- capture the pending intent before the existing enemy logic pass;
- inside that existing pass only, detach living linked members when `groupId` and bounded linked member index match the captured intent;
- detach means only `enemy.enemyFormation = undefined`; legacy movement remains authoritative immediately afterward;
- consume the captured intent once after the pass without erasing a newer intent;
- reset the pending slot everywhere the J3 formation director is reset so stale intent cannot cross run/wave/boss lifecycle boundaries;
- no new Enemy field, second scan, group/entity map, damage/kill, score/reward/economy, spawn/progression, clock/RNG, cap/budget or entity create/remove authority;
- true chain-reaction combat effects remain deferred beyond J5E.

J4D+ additional tactical families remain **DEFERRED / NOT CURRENTLY JUSTIFIED**. J3C-C remains deferred, not cancelled.""",
    "continuity next gameplay",
)
continuity = replace_once(
    continuity,
    "`J5D Pure Command-Link Break Resolution Contract → J5E+ Controlled Live Command-Link Application/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "`J5E Controlled Live Command-Link Detach Application → J5F+ Optional Command-Link Combat Effects → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "continuity chronology",
)
continuity = replace_section(
    continuity,
    "Suggested handoff:",
    "## Update obligation",
    f"""Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J5D gameplay canonical is `{BASE_SHA}`, fully DEPLOYED / FROZEN via Issue #347 / PR #348 with exact three-file product scope. Complete DOC23 if still open, then implement J5E Controlled Live Command-Link Detach Application only: one scalar pending J5D intent slot, capture/consume through the existing enemy loop, detach only `enemy.enemyFormation` for matching linked members, reset with J3 lifecycle, and add no second scan, group/entity index, damage/kill/reward or chain reaction. Keep J4D+ families and J3C-C deferred until prerequisites are proven. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.""",
    "continuity handoff",
)
continuity_path.write_text(continuity, encoding="utf-8")


# IMPLEMENTATION_LEDGER.md
ledger_path = Path("docs/IMPLEMENTATION_LEDGER.md")
ledger = ledger_path.read_text(encoding="utf-8")
ledger = replace_once(
    ledger,
    "| ES-13J5C — Live Command-Core Priority Presentation | DEPLOYED / FROZEN | `55d824d2b9cfaf6bb8cd97a032866b1fbcfa92fb` | #343 | #344 |\n",
    "| ES-13J5C — Live Command-Core Priority Presentation | DEPLOYED / FROZEN | `55d824d2b9cfaf6bb8cd97a032866b1fbcfa92fb` | #343 | #344 |\n"
    f"| ES-13J5D — Pure Command-Link Break Resolution Contract | DEPLOYED / FROZEN | `{BASE_SHA}` | #347 | #348 |\n",
    "ledger completed row",
)
ledger_j5d = f"""### J5D — Pure Command-Link Break Resolution Contract
J5D established the immutable `COMMAND_LINK_BROKEN` → `DETACH_LINKED_MEMBERS` intent contract before any live application. Valid current core facts resolve bounded linked member indices `[1]` or `[1,2]` with `INTENT_ONLY`; linked/invalid input fails closed. The slice owns no live ids, lookup, scan, collection, mutation, combat/economy, timing or cap authority.

Final product diff exactly:
- `src/game/commandLinkBreakResolution.ts`;
- `tests/es-13j5d-command-link-break-resolution.test.mjs`;
- `tests/gameplay/command-link-break-resolution.test.ts`.

Exact evidence:
- baseline `{DOC22_SHA}`;
- pre-PR `68d5c269f62415605c6265a1acef572f92438fa0`, run `38612549835` / job `116019315964` GREEN including exact scope + Android APK;
- final PR #348 head `8739313a605ccf33ddfdf69ae5e73d04f26f5957`;
- PR CI `38613042191` / `116020992856` GREEN; Android `38613042036` / `116020992132` GREEN;
- canonical `{BASE_SHA}`, parent `{DOC22_SHA}`, tree `{BASE_TREE}` equal to final PR tree;
- main CI `38613516322` / `116022626176` GREEN; Android `38613516479` / `116022628100` GREEN;
- Pages `38613648878`, build `116023067863` + deploy `116023290302` GREEN.

Issue #347 CLOSED / completed. J5D is **DEPLOYED / FROZEN**.

"""
ledger = replace_once(
    ledger,
    "## Documentation canonicals",
    ledger_j5d + "## Documentation canonicals",
    "ledger J5D evidence insertion",
)
ledger = replace_once(
    ledger,
    "- DOC22 — J5C closure & J5D activation: Issue #345, branch `docs/es-13-j5c-closure-j5d-activation`, in progress from gameplay canonical `55d824d2b9cfaf6bb8cd97a032866b1fbcfa92fb`.\n",
    f"- DOC22 — J5C closure & J5D activation: `{DOC22_SHA}` — Issue #345 / PR #346.\n"
    f"- DOC23 — J5D closure & J5E activation: Issue #349, branch `docs/es-13-j5d-closure-j5e-activation`, in progress from gameplay canonical `{BASE_SHA}`.\n",
    "ledger docs canonicals",
)
ledger = replace_section(
    ledger,
    "## Next planned gameplay",
    "J4D+ additional tactical families remain deferred:",
    """## Next planned gameplay

### ES-13J5E — Controlled Live Command-Link Detach Application
Status: **NEXT ENGINEERING TARGET AFTER DOC23 CLOSURE**.

J3's `activeUntilMs` serializes live formation groups, so one bounded pending J5D intent slot is sufficient and no group/entity index is needed. Existing direct+splash defeat routing can raise the intent in `registerCombatDefeat`, and the already-existing enemy logic iteration can consume it by clearing only matching linked members' `enemy.enemyFormation`. The pending slot must reset wherever the J3 director resets and must be consumed without erasing a newer intent.

J5E may not add a second enemy scan/collection, Enemy field, damage/kill, score/reward/economy, spawn/progression, timing/RNG, cap/budget or chain-reaction authority. Detached members immediately fall back to existing legacy movement. True combat chain reactions remain deferred beyond J5E.

""",
    "ledger next gameplay",
)
ledger_path.write_text(ledger, encoding="utf-8")


# ES13_GAMEPLAY_ROADMAP.md
roadmap_path = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
roadmap = roadmap_path.read_text(encoding="utf-8")
roadmap = replace_section(
    roadmap,
    "### J5D — Pure Command-Link Break Resolution Contract",
    "## J6 — Dynamic Mid-Sector Events",
    f"""### J5D — Pure Command-Link Break Resolution Contract
Status: **DEPLOYED / FROZEN**
Canonical: `{BASE_SHA}`
Issue #347 / PR #348

Certified behavior:
- composes J5A `COMMAND_LINK_BROKEN` with current J5B binding;
- only valid current `COMMAND_CORE` resolves;
- size-2 linked indices `[1]`; size-3 linked indices `[1,2]`;
- immutable intent `DETACH_LINKED_MEMBERS`, effect mode `INTENT_ONLY`;
- linked/invalid facts fail closed;
- no live enemy ids, lookup, scan, collection, entity/formation mutation, damage/kill, score/reward/economy, timing/RNG or cap/budget authority;
- J3/J5A/J5B/J5C remain unchanged.

Exact deployment anchors:
- pre-PR `68d5c269f62415605c6265a1acef572f92438fa0`, run `38612549835` / job `116019315964` GREEN including scope guard + Android APK;
- final PR #348 head `8739313a605ccf33ddfdf69ae5e73d04f26f5957`;
- PR CI `38613042191` / `116020992856` GREEN; Android `38613042036` / `116020992132` GREEN;
- canonical `{BASE_SHA}`, parent `{DOC22_SHA}`, tree `{BASE_TREE}`;
- main CI `38613516322` / `116022626176` GREEN; Android `38613516479` / `116022628100` GREEN;
- Pages `38613648878`, build `116023067863` + deploy `116023290302` GREEN.

### J5E — Controlled Live Command-Link Detach Application
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC23 CLOSURE**

Post-J5D discovery proves a bounded live seam:
- J3 prevents overlapping active formation groups via `activeUntilMs`;
- one pending break-resolution slot is therefore sufficient;
- direct and splash deaths already converge in `registerCombatDefeat(...)`;
- the enemy logic pass already visits every living enemy once;
- J3 already defines detach semantics as clearing `enemy.enemyFormation`, with legacy movement as fallback.

Design constraints:
- one scalar pending `CommandLinkBreakResolution | null`, never a collection/queue;
- raise only from valid current core defeat through J5D;
- capture before the existing enemy loop and apply only inside that loop;
- same `groupId` + bounded linked-member index required for detach;
- detach only formation ownership (`enemy.enemyFormation = undefined`);
- consume captured intent exactly once without clobbering a newer intent;
- reset pending intent at every J3 director reset boundary;
- no second enemy scan, group/entity index, Enemy field, damage/kill, score/reward/economy, spawn/progression, clock/RNG, caps/budgets or entity create/remove;
- true chain-reaction combat effects remain deferred to J5F+.

""",
    "roadmap J5D/J5E section",
)
roadmap_path.write_text(roadmap, encoding="utf-8")

print("ES-13DOC23 patch applied to exactly three documentation files.")
