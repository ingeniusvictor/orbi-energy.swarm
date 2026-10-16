from pathlib import Path
import re

ROADMAP = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
LEDGER = Path("docs/IMPLEMENTATION_LEDGER.md")
CONTINUITY = Path("docs/PROJECT_CONTINUITY.md")

J8F = "1ce459780fb543afec8b8bb1828ce946fe6cbcc3"
J8F_PARENT = "2d26c391e056a433893f9d7ca2b6681c5952a181"
J8F_TREE = "59954890fee59e1158dc9bb9779bdd9fbf6c82cf"


def sub_once(text, pattern, replacement, label, flags=re.S):
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one replacement, got {count}")
    return updated


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one marker, got {count}")
    return text.replace(old, new, 1)


# ROADMAP: close J8F and activate J8G without touching J9+.
roadmap = ROADMAP.read_text()
j9_tail = roadmap[roadmap.index("## J9 — Boss & Miniboss Expansion"):]
roadmap = sub_once(
    roadmap,
    r"### ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract\n.*?(?=\n## J9 — Boss & Miniboss Expansion)",
    '''### ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract
Status: **DEPLOYED / FROZEN**
Canonical: `1ce459780fb543afec8b8bb1828ce946fe6cbcc3`  
Issue #432 / PR #433

J8F freezes the pure/fail-closed decision boundary between frozen Score Attack record semantics and a later controlled write:
- canonical `SCORE_ATTACK` only;
- explicit completed `TIMEBOX / 60000 ms` facts only;
- normalization/comparison delegates to frozen J8D `resolveScoreAttackRecordProjection(...)`;
- only `NEW_BEST` projects `eligibleToAdvanceRecord: true`;
- `TIED_BEST` / `BELOW_BEST` remain valid but ineligible;
- invalid identity/completion/score facts fail closed;
- exactly one positive authority: record-commit eligibility;
- no storage/GameStats/global-highScore mutation, `runPersistence`, live session/runtime/timer/UI/archive/reward/economy/spawn authority.

Exact deployment anchors:
- pre-PR SHA `e45e6f8a5d9af5a4d718f9e4fb900dca19a084ba`, run `38925005305`, certify `117054181592` + Android `117054181176` GREEN;
- clean PR #433 head `2338b66ab82c144ac7dcc00eca81eaf5ebbbe766`;
- PR CI `38925256442` / `117055034726` GREEN; Android `38925257401` / `117055039833` GREEN;
- canonical `1ce459780fb543afec8b8bb1828ce946fe6cbcc3`, parent `2d26c391e056a433893f9d7ca2b6681c5952a181`, tree `59954890fee59e1158dc9bb9779bdd9fbf6c82cf`, exact diff three certified files;
- main CI `38925493205` / `117055846575` GREEN; Android `38925492978` / `117055847442` GREEN;
- Pages `38925614881`, build `117056259248` + deploy `117056409385` GREEN.

### ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract
Status: **NEXT CONTRACT TARGET AFTER DOC44 CLOSURE**

Discovery after J8F shows that live Score Attack adoption remains premature because the existing Infinite substrate is deterministic from seed + run context while J8A/J8B/J8C all explicitly leave `selectsSeedPolicy: false`. `createInfiniteSession(seed, context)` and the certified Infinite plan builder already provide the construction authorities; J8G must freeze only the Score Attack recipe inputs needed for reproducible/comparable attempts.

J8G must select a fixed/versioned deterministic Score Attack seed policy, reuse the existing neutral Infinite run context, and prove compatibility with J8B's fresh sector-11/wave-1 substrate and J8C's frozen `60000 ms` TIMEBOX semantics. The implementation may freeze the exact seed literal after code-level discovery.

J8G must remain pure recipe/projection policy only: no StartScreen/ResultScreen/HUD, no live session lifecycle, no timer/clock/pause, no runtime discriminator or descriptor mutation, no persistence/write/archive, no score-formula/reward/economy changes, no spawn/arena/entity/projectile/cap/budget/FOTON/formation authority.
''',
    "roadmap J8F closure/J8G activation",
)
if roadmap[roadmap.index("## J9 — Boss & Miniboss Expansion"):] != j9_tail:
    raise SystemExit("roadmap J9+ preservation failed")
ROADMAP.write_text(roadmap)

# LEDGER: milestone row, DOC43 closure/DOC44 activation, J8F evidence and J8G next.
ledger = LEDGER.read_text()
ledger = replace_once(
    ledger,
    '| ES-13J8E — Dedicated Score Attack Storage-Schema Adoption | DEPLOYED / FROZEN | `5260ffc4e63061646b180d4da419d5d7b794db68` | #428 | #429 |',
    '| ES-13J8E — Dedicated Score Attack Storage-Schema Adoption | DEPLOYED / FROZEN | `5260ffc4e63061646b180d4da419d5d7b794db68` | #428 | #429 |\n| ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract | DEPLOYED / FROZEN | `1ce459780fb543afec8b8bb1828ce946fe6cbcc3` | #432 | #433 |',
    "ledger J8F milestone row",
)
ledger = replace_once(
    ledger,
    '- DOC43 — J8E closure & J8F pure Score Attack record-commit eligibility activation: Issue #430, branch `docs/es-13-j8e-closure-j8f-record-commit-eligibility`, documentation-only closure in progress from gameplay canonical `5260ffc4e63061646b180d4da419d5d7b794db68`.',
    '- DOC43 — J8E closure & J8F pure Score Attack record-commit eligibility activation: `2d26c391e056a433893f9d7ca2b6681c5952a181` — Issue #430 / PR #431.\n- DOC44 — J8F closure & J8G canonical Score Attack run-recipe/seed-policy activation: Issue #434, branch `docs/es-13-j8f-closure-j8g-run-recipe-seed-policy`, documentation-only closure in progress from gameplay canonical `1ce459780fb543afec8b8bb1828ce946fe6cbcc3`.',
    "ledger DOC43/DOC44 lineage",
)
ledger = sub_once(
    ledger,
    r"\n## Next planned gameplay\n\n### ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)",
    '''
### J8F — Pure Score Attack Record-Commit Eligibility Contract
- Validates canonical `SCORE_ATTACK` plus explicit completed `TIMEBOX / 60000 ms` facts.
- Delegates score normalization/comparison to frozen J8D; only `NEW_BEST` is eligible to advance the dedicated record.
- Keeps storage, GameStats/global `highScore`, `runPersistence`, archives, live runtime/session/timer/UI and economy untouched.
- Pre-PR `e45e6f8a5d9af5a4d718f9e4fb900dca19a084ba`: run `38925005305`, certify `117054181592` + Android `117054181176` GREEN.
- PR #433 head `2338b66ab82c144ac7dcc00eca81eaf5ebbbe766`: CI `38925256442` / `117055034726` + Android `38925257401` / `117055039833` GREEN.
- Canonical `1ce459780fb543afec8b8bb1828ce946fe6cbcc3`, parent `2d26c391e056a433893f9d7ca2b6681c5952a181`, tree `59954890fee59e1158dc9bb9779bdd9fbf6c82cf`, exact diff three certified files.
- Main CI `38925493205` / `117055846575`, Android `38925492978` / `117055847442`, Pages `38925614881` build `117056259248` + deploy `117056409385` GREEN.

## Next planned gameplay

### ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract
Status: **NEXT CONTRACT TARGET AFTER DOC44 CLOSURE**.

J8G must freeze reproducible Score Attack recipe inputs before any live session/start flow. It should select one fixed/versioned seed policy, reuse the existing neutral Infinite run context, and prove that the resulting recipe remains compatible with J8B fresh `INFINITE_SESSION` facts and J8C `60000 ms` TIMEBOX semantics. It must not execute or persist a run, mutate runtime descriptors, own timer/UI/score/economy/spawn authorities, or create a third runtime mode.''',
    "ledger J8F evidence/J8G next",
)
LEDGER.write_text(ledger)

# CONTINUITY: current canonical, lineage, J8F result/evidence, J8G activation, handoff.
continuity = CONTINUITY.read_text()
continuity = sub_once(
    continuity,
    r"## Current certified gameplay canonical\n\n`5260ffc4e63061646b180d4da419d5d7b794db68`\n\nPhase: \*\*ES-13J8E — Dedicated Score Attack Storage-Schema Adoption\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #428 — CLOSED / completed\nDelivery: PR #429 — squash merged\n\nSingle parent: `7da459c56ab27d7891cf859db9c1065347cd2736` — DOC42 documentation canonical\.\n\nCanonical tree: `6094ca2b366463179233fb63383d355c03839d4b`\.",
    '''## Current certified gameplay canonical

`1ce459780fb543afec8b8bb1828ce946fe6cbcc3`

Phase: **ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract**
Status: **DEPLOYED / FROZEN**
Issue: #432 — CLOSED / completed
Delivery: PR #433 — squash merged

Single parent: `2d26c391e056a433893f9d7ca2b6681c5952a181` — DOC43 documentation canonical.

Canonical tree: `59954890fee59e1158dc9bb9779bdd9fbf6c82cf`.''',
    "continuity current canonical",
)
continuity = replace_once(
    continuity,
    '- DOC43 — J8E closure & J8F pure Score Attack record-commit eligibility activation: Issue #430, branch `docs/es-13-j8e-closure-j8f-record-commit-eligibility`, documentation-only closure in progress from gameplay canonical `5260ffc4e63061646b180d4da419d5d7b794db68`.',
    '- DOC43 — J8E closure & J8F pure Score Attack record-commit eligibility activation: `2d26c391e056a433893f9d7ca2b6681c5952a181` — Issue #430 / PR #431.\n- DOC44 — J8F closure & J8G canonical Score Attack run-recipe/seed-policy activation: Issue #434, branch `docs/es-13-j8f-closure-j8g-run-recipe-seed-policy`, documentation-only closure in progress from gameplay canonical `1ce459780fb543afec8b8bb1828ce946fe6cbcc3`.',
    "continuity DOC43/DOC44 lineage",
)
continuity = sub_once(
    continuity,
    r"\n## Next gameplay phase\n\n### ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract\n.*?(?=\n## Resolved diagnostics)",
    '''
## J8F result
J8F froze a pure/fail-closed record-commit eligibility projection without adopting Score Attack live. It consumes canonical `SCORE_ATTACK`, explicit completed `TIMEBOX / 60000 ms` facts and frozen J8D record projection semantics. Only `NEW_BEST` is eligible to advance the dedicated record; tied/below-best remain valid but ineligible. Storage/GameStats/global `highScore`, `runPersistence`, archives and live runtime/UI remain untouched.

## J8F exact evidence
- DOC43 baseline `2d26c391e056a433893f9d7ca2b6681c5952a181`;
- pre-PR SHA `e45e6f8a5d9af5a4d718f9e4fb900dca19a084ba`, run `38925005305`, certify `117054181592` + Android `117054181176` GREEN;
- final PR #433 head `2338b66ab82c144ac7dcc00eca81eaf5ebbbe766`;
- PR CI `38925256442` / `117055034726` GREEN;
- PR Android `38925257401` / `117055039833` GREEN including APK build/verify/upload;
- canonical `1ce459780fb543afec8b8bb1828ce946fe6cbcc3`, single parent `2d26c391e056a433893f9d7ca2b6681c5952a181`, tree `59954890fee59e1158dc9bb9779bdd9fbf6c82cf`, exact diff three certified product/test files;
- main CI `38925493205` / `117055846575` GREEN;
- main Android `38925492978` / `117055847442` GREEN including APK build/verify/upload;
- Pages `38925614881`: build `117056259248` + deploy `117056409385` GREEN.

Issue #432 CLOSED / completed. J8F is **DEPLOYED / FROZEN**.

## Next gameplay phase

### ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract
Status: **NEXT CONTRACT TARGET AFTER DOC44 CLOSURE**

Discovery shows the Infinite substrate already constructs deterministic certified plans from `seed + context`, but frozen J8A/J8B/J8C intentionally do not select a Score Attack seed policy. Live execution before freezing reproducible challenge inputs would make record comparison semantically under-specified.

J8G must therefore own only a pure canonical Score Attack run-recipe/seed-policy projection: select one fixed/versioned deterministic seed policy, reuse the existing neutral Infinite context, and prove compatibility with J8B fresh sector-11/wave-1 substrate facts plus J8C `60000 ms` TIMEBOX semantics. The exact seed literal is an implementation-level decision to certify in J8G. No live StartScreen/session lifecycle/timer/runtime-discriminator/descriptor/persistence/archive/UI/score/reward/economy/spawn/arena/entity/cap/FOTON/formation authority is allowed.
''',
    "continuity J8F closure/J8G activation",
)
continuity = sub_once(
    continuity,
    r"Suggested handoff:\n> Continue ORBI Energy Swarm autonomously\..*?(?=\n\n## Update obligation)",
    '''Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8F gameplay canonical is `1ce459780fb543afec8b8bb1828ce946fe6cbcc3`, fully DEPLOYED / FROZEN via Issue #432 / PR #433 with pure Score Attack record-commit eligibility and post-main CI/Android/Pages GREEN. Complete DOC44 if still open, then implement J8G as a pure canonical Score Attack run-recipe/seed-policy contract: fixed/versioned deterministic seed policy + existing neutral Infinite context, prove J8B fresh substrate and J8C 60000 ms compatibility, but do not adopt StartScreen/live session/timer/persistence/UI. Preserve Campaign/Infinite, caps/budgets, FOTON/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.''',
    "continuity handoff",
)
CONTINUITY.write_text(continuity)

# Preservation markers.
for required in ("#4", "#5", "#202", "#248"):
    if required not in LEDGER.read_text() or required not in CONTINUITY.read_text():
        raise SystemExit(f"manual blocker missing: {required}")
for required in ("#254", "#283"):
    if required not in CONTINUITY.read_text():
        raise SystemExit(f"diagnostic missing: {required}")
for required in ("## J9 — Boss & Miniboss Expansion", "## J15", "ES-14"):
    if required not in ROADMAP.read_text():
        raise SystemExit(f"roadmap marker missing: {required}")
