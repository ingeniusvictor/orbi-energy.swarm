from pathlib import Path

BASE_SHA = "f868058889b24fecbd97f968e932890248ca2b33"
BASE_TREE = "336ef4e31a59aea1890154f9b853b84e1409711a"
DOC20_SHA = "efe68202b4046c7f4b2df3cae951908b9e012d3b"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def replace_section(text: str, start: str, end: str, body: str, label: str) -> str:
    if text.count(start) != 1:
        raise RuntimeError(f"{label}: start marker count != 1")
    s = text.index(start)
    e = text.index(end, s + len(start))
    return text[:s] + body.rstrip() + "\n\n" + text[e:]


continuity_path = Path("docs/PROJECT_CONTINUITY.md")
continuity = continuity_path.read_text(encoding="utf-8")
continuity = replace_section(
    continuity,
    "## Current certified gameplay canonical",
    "## J4C-C result",
    f"""## Current certified gameplay canonical

`{BASE_SHA}`

Phase: **ES-13J5B — Pure Command-Link Binding Contract**
Status: **DEPLOYED / FROZEN**
Issue: #339 — CLOSED / completed
Delivery: PR #340 — squash merged

Single parent: `{DOC20_SHA}` — DOC20 documentation canonical.

Canonical tree: `{BASE_TREE}`, exactly equal to final PR-head tree.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.""",
    "continuity current canonical",
)

j5b_result = f"""## J5B result
J5B established a pure deterministic Command Link binding over already-existing bounded J3 formation facts without creating live state or a second formation authority.

Certified contract:
- supported group sizes exactly 2 and 3;
- deterministic `coreMemberIndex = 0`, derived from J3's existing member assignment order;
- member 0 resolves to semantic `COMMAND_CORE`; all other valid members resolve to `LINKED_MEMBER`;
- J5A `COMMAND_CORE` identity is referenced type-only rather than duplicated;
- binding mode is `BINDING_ONLY`;
- linked-member indices are bounded metadata `[1]` or `[1,2]` only;
- invalid/empty/padded group ids, unsupported counts and invalid indices fail closed;
- no new `EnemyType`, `Enemy` field or live runtime adoption;
- J3 formation assignment/motion and J5A priority-target identity remain authoritative;
- no spawn, entity/projectile collection, damage, defeat, score, reward, clock, RNG, full-array scan, cap mutation or entity create/remove authority.

Final product scope exactly:
- `src/game/commandLinkBinding.ts`;
- `tests/es-13j5b-command-link-binding.test.mjs`;
- `tests/gameplay/command-link-binding.test.ts`.

## J5B exact evidence
- DOC20 baseline `{DOC20_SHA}`;
- pre-PR SHA `66b6e6276d6229f74476a541c220e203a0f3dc8b`, run `38568941468` / job `115868727522` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact scope guard and Android APK build/verify/upload;
- final PR #340 head `7d59c94bd7fb79ec9b577d47712ebba751488efb`;
- PR CI `38569355540` / `115870150075` GREEN;
- PR Android `38569355236` / `115870147877` GREEN including Build/Verify/Upload APK;
- canonical `{BASE_SHA}`, single parent `{DOC20_SHA}`, tree `{BASE_TREE}` equal to final PR-head tree;
- canonical diff exactly three certified product files;
- main CI `38569599501` / `115870991101` GREEN;
- main Android `38569599482` / `115870990530` GREEN including Build/Verify/Upload APK;
- Pages `38569726643`: build `115871441654` + deploy `115871606433` GREEN.

Issue #339 CLOSED / completed. J5B is **DEPLOYED / FROZEN**.
"""
continuity = replace_once(
    continuity,
    "## ES-13 gameplay canonicals",
    j5b_result + "\n## ES-13 gameplay canonicals",
    "continuity J5B result insertion",
)
continuity = replace_once(
    continuity,
    "- J5A — Pure Priority-Target Contract: `df60f62565a1d3cdf6058d2e1a4049f5870f27b7`.\n",
    "- J5A — Pure Priority-Target Contract: `df60f62565a1d3cdf6058d2e1a4049f5870f27b7`.\n"
    f"- J5B — Pure Command-Link Binding Contract: `{BASE_SHA}`.\n",
    "continuity gameplay canonical list",
)
continuity = replace_once(
    """{}""".format(continuity),
    "- DOC20 — J5A closure & J5B activation: Issue #337, branch `docs/es-13-j5a-closure-j5b-activation`, documentation-only closure in progress from gameplay canonical `df60f62565a1d3cdf6058d2e1a4049f5870f27b7`.\n",
    f"- DOC20 — J5A closure & J5B activation: `{DOC20_SHA}` — Issue #337 / PR #338.\n"
    f"- DOC21 — J5B closure & J5C activation: Issue #341, branch `docs/es-13-j5b-closure-j5c-activation`, documentation-only closure in progress from gameplay canonical `{BASE_SHA}`.\n",
    "continuity docs canonicals",
)
continuity = replace_section(
    continuity,
    "## Next gameplay phase",
    "## Resolved diagnostics",
    """## Next gameplay phase

### ES-13J5C — Live Command-Core Priority Presentation
Status: **NEXT ENGINEERING TARGET AFTER DOC21 CLOSURE**

J5C is the first bounded live adoption of the already-certified J5A/J5B semantics, but presentation only.

Discovery confirms:
- J3 attaches `enemyFormation` directly to active formation members at spawn;
- J3 clears that metadata when Hydro slow cancels formation ownership or when formation motion completes;
- `drawEnemiesList(...)` already iterates every living enemy exactly once;
- therefore J5C can derive current J5B binding on demand inside the existing renderer pass with no new Enemy field, collection, scan or duplicated state.

Required direction:
- pure presentation projection + existing Canvas enemy pass as the only live adapter;
- only active valid J5B bindings with `memberRole === COMMAND_CORE` receive a bounded visual marker;
- linked members receive no cross-entity line or lookup;
- absent/invalid formation data produces no marker;
- marker disappears automatically when J3 clears `enemyFormation`;
- insert presentation after enemy body and before the existing damaged-health bar so enemy telegraphs/body remain authoritative;
- use existing renderer `time` only as presentation input if animation is desired; no owned clock/timer/RNG;
- do not modify `EnergySwarmGame.tsx`, `types.ts`, J3 director, J5A or J5B contracts;
- no damage, defeat, score, reward, spawn, progression, chain reaction, cap or budget change;
- preserve accessibility flash behavior, Siege telegraph, Campaign/Infinite isolation, FOTON GLB and player/FOTON formation ownership.

Actual Command Core defeat effects and chain reactions remain deferred to a later J5 slice after J5C is certified.

J4D+ additional tactical families remain **DEFERRED / NOT CURRENTLY JUSTIFIED**. J3C-C remains deferred, not cancelled.""",
    "continuity next gameplay",
)
continuity = replace_once(
    continuity,
    "`J5B Pure Command-Link Binding Contract → J5C+ Controlled Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "`J5C Live Command-Core Priority Presentation → J5D+ Controlled Command-Core Defeat/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "continuity chronology",
)
continuity = replace_section(
    continuity,
    "Suggested handoff:",
    "## Update obligation",
    f"""Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J5B gameplay canonical is `{BASE_SHA}`, fully DEPLOYED / FROZEN via Issue #339 / PR #340 with exact three-file product scope. Complete DOC21 if still open, then implement J5C Live Command-Core Priority Presentation as presentation-only derivation from active `enemy.enemyFormation` inside the existing enemy render pass; do not add an Enemy field, second scan, combat effect or chain reaction. Keep J4D+ families and J3C-C deferred until prerequisites are proven. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.""",
    "continuity handoff",
)
continuity_path.write_text(continuity, encoding="utf-8")

ledger_path = Path("docs/IMPLEMENTATION_LEDGER.md")
ledger = ledger_path.read_text(encoding="utf-8")
ledger = replace_once(
    ledger,
    "| ES-13J5A — Pure Priority-Target Contract | DEPLOYED / FROZEN | `df60f62565a1d3cdf6058d2e1a4049f5870f27b7` | #335 | #336 |\n",
    "| ES-13J5A — Pure Priority-Target Contract | DEPLOYED / FROZEN | `df60f62565a1d3cdf6058d2e1a4049f5870f27b7` | #335 | #336 |\n"
    f"| ES-13J5B — Pure Command-Link Binding Contract | DEPLOYED / FROZEN | `{BASE_SHA}` | #339 | #340 |\n",
    "ledger completed row",
)
ledger_j5b = f"""### J5B — Pure Command-Link Binding Contract
J5B established deterministic Command Link metadata over current J3 group facts only. Certified sizes are 2/3; member index 0 is the semantic `COMMAND_CORE`, remaining valid members are `LINKED_MEMBER`, and J5A identity remains authoritative through a type-only reference. `BINDING_ONLY` output contains bounded indices rather than live entity ids or effects. Invalid inputs fail closed. No EnemyType/Enemy field/live adoption or J3/J5A mutation was introduced.

Final product diff exactly:
- `src/game/commandLinkBinding.ts`;
- `tests/es-13j5b-command-link-binding.test.mjs`;
- `tests/gameplay/command-link-binding.test.ts`.

Exact evidence:
- baseline `{DOC20_SHA}`;
- pre-PR `66b6e6276d6229f74476a541c220e203a0f3dc8b`, run `38568941468` / job `115868727522` GREEN including exact scope + Android APK;
- final PR #340 head `7d59c94bd7fb79ec9b577d47712ebba751488efb`;
- PR CI `38569355540` / `115870150075` GREEN; Android `38569355236` / `115870147877` GREEN;
- canonical `{BASE_SHA}`, parent `{DOC20_SHA}`, tree `{BASE_TREE}` equal to final PR tree;
- main CI `38569599501` / `115870991101` GREEN; Android `38569599482` / `115870990530` GREEN;
- Pages `38569726643`, build `115871441654` + deploy `115871606433` GREEN.

Issue #339 CLOSED / completed. J5B is **DEPLOYED / FROZEN**.

"""
ledger = replace_once(ledger, "## Documentation canonicals", ledger_j5b + "## Documentation canonicals", "ledger J5B insertion")
ledger = replace_once(
    ledger,
    "- DOC20 — J5A closure & J5B activation: Issue #337, branch `docs/es-13-j5a-closure-j5b-activation`, in progress from gameplay canonical `df60f62565a1d3cdf6058d2e1a4049f5870f27b7`.\n",
    f"- DOC20 — J5A closure & J5B activation: `{DOC20_SHA}` — Issue #337 / PR #338.\n"
    f"- DOC21 — J5B closure & J5C activation: Issue #341, branch `docs/es-13-j5b-closure-j5c-activation`, in progress from gameplay canonical `{BASE_SHA}`.\n",
    "ledger docs canonicals",
)
ledger = replace_section(
    ledger,
    "## Next planned gameplay",
    "J4D+ additional tactical families remain deferred:",
    """## Next planned gameplay

### ES-13J5C — Live Command-Core Priority Presentation
Status: **NEXT ENGINEERING TARGET AFTER DOC21 CLOSURE**.

Use J5B binding only as an on-demand presentation projection from current `enemy.enemyFormation` inside the existing `drawEnemiesList` pass. Only the active `COMMAND_CORE` member receives a bounded visual marker; linked/invalid/no-formation members receive none. Add no Enemy field, second scan/collection, spawn/progression change or combat effect. J3 clearing of `enemyFormation` must automatically remove the marker. Preserve telegraphs, health bars, accessibility and all frozen J1–J4/J5A/J5B authorities.

Actual defeat/chain-reaction behavior remains deferred to a later J5 slice.

""",
    "ledger next gameplay",
)
ledger_path.write_text(ledger, encoding="utf-8")

roadmap_path = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
roadmap = roadmap_path.read_text(encoding="utf-8")
roadmap = replace_section(
    roadmap,
    "### J5B — Pure Command-Link Binding Contract",
    "## J6 — Dynamic Mid-Sector Events",
    f"""### J5B — Pure Command-Link Binding Contract
Status: **DEPLOYED / FROZEN**
Canonical: `{BASE_SHA}`
Issue #339 / PR #340

Certified contract:
- supported bounded J3 group sizes exactly 2 and 3;
- deterministic core index 0 from existing J3 member order;
- member 0 = semantic `COMMAND_CORE`; remaining valid members = `LINKED_MEMBER`;
- J5A identity referenced type-only;
- binding mode `BINDING_ONLY`;
- linked metadata `[1]` or `[1,2]` only;
- invalid group ids/counts/indices fail closed;
- no new EnemyType/Enemy field/live adoption;
- no J3/J5A mutation, damage/defeat/score/reward, collection/scan, clock/RNG or cap authority.

Exact deployment anchors:
- pre-PR `66b6e6276d6229f74476a541c220e203a0f3dc8b`, run `38568941468` / job `115868727522` GREEN including scope guard + Android APK;
- final PR #340 head `7d59c94bd7fb79ec9b577d47712ebba751488efb`;
- PR CI `38569355540` / `115870150075` GREEN; Android `38569355236` / `115870147877` GREEN;
- canonical `{BASE_SHA}`, parent `{DOC20_SHA}`, tree `{BASE_TREE}`;
- main CI `38569599501` / `115870991101` GREEN; Android `38569599482` / `115870990530` GREEN;
- Pages `38569726643`, build `115871441654` + deploy `115871606433` GREEN.

### J5C — Live Command-Core Priority Presentation
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC21 CLOSURE**

Discovery confirms the safest first live adoption is presentation-only:
- active J3 members already carry optional `enemyFormation` metadata;
- J3 clears it on Hydro slow cancellation or route completion;
- `drawEnemiesList` already owns one living-enemy render pass;
- J5C can therefore derive J5B binding on demand without persistent duplicated state.

Design constraints:
- pure presentation projection + existing canvas renderer only;
- only current valid `COMMAND_CORE` role receives a core marker;
- no linked-member line/cross-entity lookup;
- no marker for absent/invalid formation data or linked-member role;
- marker automatically disappears when J3 clears formation metadata;
- render after enemy body and before damaged-health bar;
- renderer `time` may drive bounded animation as input only; no timer/RNG ownership;
- no `EnergySwarmGame.tsx`, `types.ts`, J3, J5A or J5B contract changes;
- no spawn/progression, damage, defeat, score, reward, chain reaction, cap/budget or entity collection changes;
- preserve existing tactical telegraphs, accessibility flash behavior, Campaign/Infinite isolation, FOTON GLB and player/FOTON formations.

Command Core defeat effects / chain reactions remain deferred to J5D+ after J5C certification.""",
    "roadmap J5B/J5C",
)
roadmap_path.write_text(roadmap, encoding="utf-8")

for path in (continuity_path, ledger_path, roadmap_path):
    text = path.read_text(encoding="utf-8")
    if "\r\n" in text:
        raise RuntimeError(f"{path}: CRLF unexpectedly present")
    if not text.endswith("\n"):
        path.write_text(text + "\n", encoding="utf-8")

print("ES-13DOC21 patch applied to exactly three documentation files.")
