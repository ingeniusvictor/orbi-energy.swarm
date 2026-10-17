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
    if text.find(end, end_index + len(end)) >= 0:
        # End markers used here are section headings expected exactly once.
        raise SystemExit(f"{path}: end marker is not unique: {end!r}")
    p.write_text(text[:start_index] + replacement + text[end_index:])


roadmap = "docs/ES13_GAMEPLAY_ROADMAP.md"
ledger = "docs/IMPLEMENTATION_LEDGER.md"
continuity = "docs/PROJECT_CONTINUITY.md"

# Roadmap: close J8P and explicitly hold later programs.
replace_between(
    roadmap,
    "### ES-13J8P — Controlled Public Score Attack Selection & Presentation Adoption\n",
    "## J9 — Boss & Miniboss Expansion\n",
    '''### ES-13J8P — Controlled Public Score Attack Selection & Presentation Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `c29df45aebf4a0b3d58038a42b8c539234b42745`
Issue #473 / PR #474

J8P closes the first public Score Attack vertical slice over frozen J8O:
- Campaign remains the unchanged/default primary public launch path;
- StartScreen exposes Score Attack only as an explicit secondary choice and delegates live start to frozen J8O;
- one low-frequency `CAMPAIGN | SCORE_ATTACK` presentation identity exists only for UI attribution and same-mode restart continuity, outside `RuntimeProgressionState`;
- frozen J8A identity and J8C `TIMEBOX / 60000 ms` are presentation facts only; no second timer/clock/countdown authority was added;
- GameHud replaces Campaign objective vocabulary with bounded Score Attack attribution while the engine timer remains sole timing authority;
- ResultScreen uses the dedicated Score Attack record and does not present global highScore, generic Campaign rewards or generic run archive as Score Attack ownership;
- retry re-enters the frozen J8O start seam; menu exit clears presentation identity;
- J8K/J8L/J8M/J8N remain isolated from direct UI imports and all runtime/scoring/persistence authorities remain frozen.

Repository certification initially exposed three historical pre-J8P static expectations in J8A/J8C/J8O tests. Evidence showed they prohibited the exact bounded UI consumption J8P was created to introduce. Only those tests evolved: J8A permits StartScreen profile reads while runtime/persistence remain neutral; J8C permits Start/HUD/Result duration reads while forbidding UI clock APIs; J8O continues to forbid direct J8K/L/M/N UI imports and keeps the engine coordinator authoritative. No frozen `src/game/scoreAttack*.ts` source changed.

Exact deployment anchors:
- final pre-PR certification SHA `a5e635b8ad50f4e7199e7abaa90e4e6db2c62db7`, run `38997372822`, certify `117292769229` + Android `117292944816` GREEN with APK build/verify/upload;
- clean PR #474 head `ccf22fb9b908ff08442a65bf9eaf6d218ef575b8`, exact final diff 9 files;
- PR CI #560 `38997541403` / `117293282979` GREEN; Android #125 `38997541492` / `117293283152` GREEN with Build/Verify/Upload APK;
- canonical `c29df45aebf4a0b3d58038a42b8c539234b42745`, parent `120fe00a61ad7a84984871ec19ec435be23535a0`, tree `5d9637b8e1df6d565ffffd08cb840b45c102c65c`, exact final diff 9 files;
- main CI #561 `38997649166` / `117293618514` GREEN; Android #126 `38997649158` / `117293618407` GREEN with Build/Verify/Upload APK;
- Pages/Web Beta #166 `38997711279`, build `117293808563` + deploy `117293885541` GREEN;
- Issue #473 CLOSED / completed.

## Post-J8 roadmap hold

J8 Additional Modes is administratively complete through J8P. DOC54 activates **no new gameplay phase**. J9–J15 remain roadmap-level planned/deferred work and require explicit scope plus fresh discovery before any issue/branch/product write. ES-14 remains a future program / not yet committed. J3C-C and J4D+ remain deferred, not cancelled.

''',
)

for title in [
    "J9 — Boss & Miniboss Expansion",
    "J10 — Expert Risk / Reward",
    "J11 — Build & Synergy Expansion",
    "J12 — Rare Events & Secret Encounters",
    "J13 — Score, Rank & Mastery",
    "J14 — Procedural Interaction Matrix",
    "J15 — Gameplay Integration & Long-Range Balance",
]:
    replace_once(
        roadmap,
        f"## {title}\nStatus: PLANNED\n",
        f"## {title}\nStatus: **PLANNED / DEFERRED — NOT ACTIVE**\n",
    )

# Ledger: add canonical row then replace the old next-target section with J8P evidence + hold.
replace_once(
    ledger,
    "| ES-13J8O — Controlled Live Score Attack Engine Lifecycle Adoption | DEPLOYED / FROZEN | `89d1dea159f8478c2e2ccc01f027c2e9041a4542` | #469 | #470 |\n",
    "| ES-13J8O — Controlled Live Score Attack Engine Lifecycle Adoption | DEPLOYED / FROZEN | `89d1dea159f8478c2e2ccc01f027c2e9041a4542` | #469 | #470 |\n| ES-13J8P — Controlled Public Score Attack Selection & Presentation Adoption | DEPLOYED / FROZEN | `c29df45aebf4a0b3d58038a42b8c539234b42745` | #473 | #474 |\n",
)
replace_between(
    ledger,
    "## Next planned gameplay\n",
    "## Program sequence\n",
    '''### J8P — Controlled Public Score Attack Selection & Presentation Adoption
- Public Score Attack selection/presentation over frozen J8O; Campaign remains the unchanged/default primary public launch.
- One low-frequency presentation identity stays outside `RuntimeProgressionState`; no runtime discriminator, second timer/clock or persistence authority was added.
- StartScreen consumes frozen identity/duration/dedicated-best facts; HUD provides mode/objective attribution; ResultScreen uses dedicated Score Attack record semantics and excludes generic Campaign reward/archive/global-highScore ownership.
- Repository smoke initially exposed exactly three obsolete pre-J8P UI-isolation expectations in J8A/J8C/J8O tests; only those expectations evolved, preserving all runtime/timer/persistence boundaries and frozen `src/game/scoreAttack*.ts` source.
- Final pre-PR `a5e635b8ad50f4e7199e7abaa90e4e6db2c62db7`: run `38997372822`, certify `117292769229` + Android `117292944816` GREEN.
- PR #474 head `ccf22fb9b908ff08442a65bf9eaf6d218ef575b8`: CI #560 `38997541403` / `117293282979` + Android #125 `38997541492` / `117293283152` GREEN.
- Canonical `c29df45aebf4a0b3d58038a42b8c539234b42745`, parent `120fe00a61ad7a84984871ec19ec435be23535a0`, tree `5d9637b8e1df6d565ffffd08cb840b45c102c65c`, exact diff 9 files.
- Main CI #561 `38997649166` / `117293618514`, Android #126 `38997649158` / `117293618407`, Pages #166 `38997711279` build `117293808563` + deploy `117293885541` GREEN.

## Roadmap hold

No gameplay target is active after DOC54. J8 is complete through J8P. J9–J15 remain **PLANNED / DEFERRED — NOT ACTIVE** pending explicit authorization and fresh discovery; ES-14 remains **FUTURE PROGRAM / NOT YET COMMITTED**. J4D+ and J3C-C remain deferred/not cancelled.

''',
)

# Continuity: make J8P the current certified gameplay canonical.
replace_once(
    continuity,
    "Last continuity update: 2026-10-16\n",
    "Last continuity update: 2026-10-17\n",
)
replace_between(
    continuity,
    "## Current certified gameplay canonical\n",
    "## J4C-C result\n",
    '''## Current certified gameplay canonical

`c29df45aebf4a0b3d58038a42b8c539234b42745`

Phase: **ES-13J8P — Controlled Public Score Attack Selection & Presentation Adoption**
Status: **DEPLOYED / FROZEN**
Issue: #473 — CLOSED / completed
Delivery: PR #474 — squash merged

Single parent: `120fe00a61ad7a84984871ec19ec435be23535a0` — DOC53 documentation canonical.

Canonical tree: `5d9637b8e1df6d565ffffd08cb840b45c102c65c`.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 roadmap programs remain uncommitted/deferred.

''',
)
replace_between(
    continuity,
    "## Next gameplay phase\n",
    "## Resolved diagnostics\n",
    '''## J8P result
J8P completed the first public Score Attack selection/presentation slice over frozen J8O without creating a parallel engine authority. Campaign remains the default/primary public launch. StartScreen exposes Score Attack as a secondary option, one scalar presentation identity stays outside `RuntimeProgressionState`, HUD presents Score Attack attribution without a second timer, and ResultScreen uses dedicated Score Attack record semantics without claiming global highScore, Campaign rewards or generic run archive ownership. Retry reuses frozen J8O and menu exit clears presentation identity.

Repository smoke initially exposed exactly three historical pre-J8P expectations: J8A forbade StartScreen profile consumption, J8C forbade Start/HUD/Result duration consumption, and J8O expected no public Score Attack UI. The evidence-driven evolution changed only those historical tests. J8A remains runtime/persistence neutral; J8C still owns no clock/timer and UI is explicitly checked for clock APIs; J8O remains the sole engine coordinator and direct J8K/L/M/N UI imports remain forbidden. No frozen `src/game/scoreAttack*.ts` source changed.

## J8P exact evidence
- DOC53 baseline `120fe00a61ad7a84984871ec19ec435be23535a0`;
- final pre-PR certification SHA `a5e635b8ad50f4e7199e7abaa90e4e6db2c62db7`, run `38997372822`, certify `117292769229` + Android `117292944816` GREEN including APK build/verify/upload;
- clean PR #474 head `ccf22fb9b908ff08442a65bf9eaf6d218ef575b8`, exact final diff 9 files;
- PR CI #560 `38997541403` / `117293282979` GREEN;
- PR Android #125 `38997541492` / `117293283152` GREEN including Build/Verify/Upload APK;
- canonical `c29df45aebf4a0b3d58038a42b8c539234b42745`, single parent `120fe00a61ad7a84984871ec19ec435be23535a0`, tree `5d9637b8e1df6d565ffffd08cb840b45c102c65c`, exact final diff 9 files;
- main CI #561 `38997649166` / `117293618514` GREEN;
- main Android #126 `38997649158` / `117293618407` GREEN including Build/Verify/Upload APK;
- Pages/Web Beta #166 `38997711279`: build `117293808563` + deploy `117293885541` GREEN.

Issue #473 CLOSED / completed. J8P is **DEPLOYED / FROZEN**.

## Roadmap hold after J8
No gameplay phase is active after DOC54. J8 Additional Modes is complete through J8P. J9–J15 remain **PLANNED / DEFERRED — NOT ACTIVE** until explicit scope/discovery authorization; ES-14 remains **FUTURE PROGRAM / NOT YET COMMITTED**. J3C-C and J4D+ remain deferred/not cancelled. Manual blockers #4/#5/#202/#248 remain open and are not replaced by CI evidence.

''',
)
replace_between(
    continuity,
    "> Continue ORBI Energy Swarm autonomously.",
    "\n\n## Update obligation\n",
    '''> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8P gameplay canonical is `c29df45aebf4a0b3d58038a42b8c539234b42745`, fully DEPLOYED / FROZEN via Issue #473 / PR #474 with exact pre-PR, PR-head and post-main CI/Android/Pages GREEN. Complete DOC54 if still open. After DOC54, do not activate J9–J15 or ES-14 by sequence/inference: no gameplay target is active until explicit scope plus fresh live discovery authorizes one. Preserve J3C-C/J4D+ deferrals, manual blockers #4/#5/#202/#248, Campaign/Infinite isolation, caps/budgets/entities, FOTON GLB/formations and all frozen J8 authorities. Follow Issue → exact-base branch → full gates → PR → exact-SHA post-merge evidence for any later authorized work. Never touch `main` directly or weaken tests.''',
)
