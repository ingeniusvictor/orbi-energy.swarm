from pathlib import Path
import re

ROADMAP = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
LEDGER = Path("docs/IMPLEMENTATION_LEDGER.md")
CONTINUITY = Path("docs/PROJECT_CONTINUITY.md")

J8G = "55a31de7ad7989e3daaead8311aa08d3927096f7"
DOC44 = "2e07ea501c36728bdc369a66dfecb64f6d8e5e01"
J8G_TREE = "67e0b9da68544d0f4c134e37f08d1a84df1df264"


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


# ROADMAP — close J8G and activate J8H while preserving J9+ byte-for-byte.
roadmap = ROADMAP.read_text()
j9_tail = roadmap[roadmap.index("## J9 — Boss & Miniboss Expansion"):]
roadmap = sub_once(
    roadmap,
    r"### ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract\n.*?(?=\n## J9 — Boss & Miniboss Expansion)",
    '''### ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract
Status: **DEPLOYED / FROZEN**
Canonical: `55a31de7ad7989e3daaead8311aa08d3927096f7`  
Issue #436 / PR #437

J8G freezes reproducible Score Attack challenge inputs before any live start/session/persistence adoption:
- recipe version `1`;
- fixed/versioned seed `orbi-score-attack-v1`;
- existing authoritative `NEUTRAL_INFINITE_RUN_CONTEXT`, exposed through a frozen copy;
- transient internal proof session only, created through existing Infinite authority and never returned/advanced/persisted/adopted live;
- deterministic compatibility with J8B fresh sector-11/wave-1 `INFINITE_SESSION` facts and J8C `TIMEBOX / 60000 ms` facts;
- exactly one positive authority: canonical run-recipe/seed-policy selection;
- no runtime/UI/persistence/archive/score/reward/economy/spawn/arena/entity/cap/FOTON/formation authority.

Exact deployment anchors:
- pre-PR SHA `96d8eff6dbdc91f5800e154a5d6309a48bed3802`, run `38927391978`, certify `117062322683` + Android `117062322404` GREEN;
- clean PR #437 head `87b9bbe63ca5d8d07016713f58ef42e1ddd86a23`;
- PR CI `38927641423` / `117063169406` GREEN; Android `38927641413` / `117063169539` GREEN;
- canonical `55a31de7ad7989e3daaead8311aa08d3927096f7`, parent `2e07ea501c36728bdc369a66dfecb64f6d8e5e01`, tree `67e0b9da68544d0f4c134e37f08d1a84df1df264`, exact diff three certified files;
- main CI `38927850983` / `117063891102` GREEN; Android `38927850891` / `117063891169` GREEN;
- Pages `38927967468`, build `117064302340` + deploy `117064549189` GREEN.

### ES-13J8H — Pure Score Attack Bootstrap Envelope Contract
Status: **NEXT CONTRACT TARGET AFTER DOC45 CLOSURE**

Discovery after J8G shows that live UI adoption is still premature: `EnergySwarmGame.startGame()` initializes Campaign directly and `RuntimeProgressionState` intentionally contains only `CAMPAIGN | INFINITE`. A Score Attack bootstrap must therefore preserve canonical `SCORE_ATTACK` identity outside the existing runtime discriminator while reusing existing Infinite construction authorities.

J8H must consume the frozen J8G recipe, construct one fresh Infinite session through existing `createInfiniteSession(seed, context)`, construct its runtime through existing `createInfiniteRuntimeState(session)`, preserve outer `modeId: SCORE_ATTACK`, and carry frozen J8C `TIMEBOX / 60000 ms` facts. Runtime progression must remain intentionally `INFINITE`; no third runtime discriminator is allowed.

J8H must remain bootstrap/projection only: no React state/ref adoption, StartScreen/ResultScreen/HUD, timer ticking, wave advancement, descriptor mutation, persistence/storage/archive/write, score/reward/economy, spawn/arena/entity/projectile/cap/budget/FOTON/formation authority.
''',
    "roadmap J8G closure/J8H activation",
)
if roadmap[roadmap.index("## J9 — Boss & Miniboss Expansion"):] != j9_tail:
    raise SystemExit("roadmap J9+ preservation failed")
ROADMAP.write_text(roadmap)

# LEDGER — milestone, DOC44 closure/DOC45 activation, evidence + next.
ledger = LEDGER.read_text()
ledger = replace_once(
    ledger,
    '| ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract | DEPLOYED / FROZEN | `1ce459780fb543afec8b8bb1828ce946fe6cbcc3` | #432 | #433 |',
    '| ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract | DEPLOYED / FROZEN | `1ce459780fb543afec8b8bb1828ce946fe6cbcc3` | #432 | #433 |\n| ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract | DEPLOYED / FROZEN | `55a31de7ad7989e3daaead8311aa08d3927096f7` | #436 | #437 |',
    "ledger J8G milestone row",
)
ledger = replace_once(
    ledger,
    '- DOC44 — J8F closure & J8G canonical Score Attack run-recipe/seed-policy activation: Issue #434, branch `docs/es-13-j8f-closure-j8g-run-recipe-seed-policy`, documentation-only closure in progress from gameplay canonical `1ce459780fb543afec8b8bb1828ce946fe6cbcc3`.',
    '- DOC44 — J8F closure & J8G canonical Score Attack run-recipe/seed-policy activation: `2e07ea501c36728bdc369a66dfecb64f6d8e5e01` — Issue #434 / PR #435.\n- DOC45 — J8G closure & J8H Score Attack bootstrap-envelope activation: Issue #438, branch `docs/es-13-j8g-closure-j8h-bootstrap-envelope`, documentation-only closure in progress from gameplay canonical `55a31de7ad7989e3daaead8311aa08d3927096f7`.',
    "ledger DOC44/DOC45 lineage",
)
ledger = sub_once(
    ledger,
    r"\n## Next planned gameplay\n\n### ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)",
    '''
### J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract
- Recipe version `1`, fixed/versioned seed `orbi-score-attack-v1`, existing neutral Infinite context.
- Internal transient proof session validates frozen J8B fresh-substrate and J8C `60000 ms` TIMEBOX compatibility but never escapes or becomes live.
- Exactly one positive authority: canonical run-recipe/seed-policy selection; runtime/UI/persistence/economy remain untouched.
- Pre-PR `96d8eff6dbdc91f5800e154a5d6309a48bed3802`: run `38927391978`, certify `117062322683` + Android `117062322404` GREEN.
- PR #437 head `87b9bbe63ca5d8d07016713f58ef42e1ddd86a23`: CI `38927641423` / `117063169406` + Android `38927641413` / `117063169539` GREEN.
- Canonical `55a31de7ad7989e3daaead8311aa08d3927096f7`, parent `2e07ea501c36728bdc369a66dfecb64f6d8e5e01`, tree `67e0b9da68544d0f4c134e37f08d1a84df1df264`, exact diff three certified files.
- Main CI `38927850983` / `117063891102`, Android `38927850891` / `117063891169`, Pages `38927967468` build `117064302340` + deploy `117064549189` GREEN.

## Next planned gameplay

### ES-13J8H — Pure Score Attack Bootstrap Envelope Contract
Status: **NEXT CONTRACT TARGET AFTER DOC45 CLOSURE**.

J8H must consume J8G and construct a fresh Infinite session/runtime through existing authorities while preserving canonical `SCORE_ATTACK` identity in an outer bootstrap envelope. Runtime progression remains `INFINITE`; J8C `TIMEBOX / 60000 ms` facts remain authoritative. No third runtime discriminator, React/live adoption, timer, persistence, archive, score/economy or spawn authority.''',
    "ledger J8G evidence/J8H next",
)
LEDGER.write_text(ledger)

# CONTINUITY — current canonical + lineage + J8G evidence/J8H next + handoff.
continuity = CONTINUITY.read_text()
continuity = sub_once(
    continuity,
    r"## Current certified gameplay canonical\n\n`1ce459780fb543afec8b8bb1828ce946fe6cbcc3`\n\nPhase: \*\*ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #432 — CLOSED / completed\nDelivery: PR #433 — squash merged\n\nSingle parent: `2d26c391e056a433893f9d7ca2b6681c5952a181` — DOC43 documentation canonical\.\n\nCanonical tree: `59954890fee59e1158dc9bb9779bdd9fbf6c82cf`\.",
    '''## Current certified gameplay canonical

`55a31de7ad7989e3daaead8311aa08d3927096f7`

Phase: **ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract**
Status: **DEPLOYED / FROZEN**
Issue: #436 — CLOSED / completed
Delivery: PR #437 — squash merged

Single parent: `2e07ea501c36728bdc369a66dfecb64f6d8e5e01` — DOC44 documentation canonical.

Canonical tree: `67e0b9da68544d0f4c134e37f08d1a84df1df264`.''',
    "continuity current canonical",
)
continuity = replace_once(
    continuity,
    '- DOC44 — J8F closure & J8G canonical Score Attack run-recipe/seed-policy activation: Issue #434, branch `docs/es-13-j8f-closure-j8g-run-recipe-seed-policy`, documentation-only closure in progress from gameplay canonical `1ce459780fb543afec8b8bb1828ce946fe6cbcc3`.',
    '- DOC44 — J8F closure & J8G canonical Score Attack run-recipe/seed-policy activation: `2e07ea501c36728bdc369a66dfecb64f6d8e5e01` — Issue #434 / PR #435.\n- DOC45 — J8G closure & J8H Score Attack bootstrap-envelope activation: Issue #438, branch `docs/es-13-j8g-closure-j8h-bootstrap-envelope`, documentation-only closure in progress from gameplay canonical `55a31de7ad7989e3daaead8311aa08d3927096f7`.',
    "continuity DOC44/DOC45 lineage",
)
continuity = sub_once(
    continuity,
    r"\n## Next gameplay phase\n\n### ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract\n.*?(?=\n## Resolved diagnostics)",
    '''
## J8G result
J8G froze reproducible Score Attack challenge inputs without making Score Attack live: recipe version `1`, fixed seed `orbi-score-attack-v1`, frozen copy of the existing neutral Infinite context, and an internal transient proof session that validates J8B fresh substrate + J8C `TIMEBOX / 60000 ms`. The proof session never escapes, advances, persists or becomes live.

## J8G exact evidence
- DOC44 baseline `2e07ea501c36728bdc369a66dfecb64f6d8e5e01`;
- pre-PR SHA `96d8eff6dbdc91f5800e154a5d6309a48bed3802`, run `38927391978`, certify `117062322683` + Android `117062322404` GREEN;
- final PR #437 head `87b9bbe63ca5d8d07016713f58ef42e1ddd86a23`;
- PR CI `38927641423` / `117063169406` GREEN;
- PR Android `38927641413` / `117063169539` GREEN including APK build/verify/upload;
- canonical `55a31de7ad7989e3daaead8311aa08d3927096f7`, single parent `2e07ea501c36728bdc369a66dfecb64f6d8e5e01`, tree `67e0b9da68544d0f4c134e37f08d1a84df1df264`, exact diff three certified product/test files;
- main CI `38927850983` / `117063891102` GREEN;
- main Android `38927850891` / `117063891169` GREEN including APK build/verify/upload;
- Pages `38927967468`: build `117064302340` + deploy `117064549189` GREEN.

Issue #436 CLOSED / completed. J8G is **DEPLOYED / FROZEN**.

## Next gameplay phase

### ES-13J8H — Pure Score Attack Bootstrap Envelope Contract
Status: **NEXT CONTRACT TARGET AFTER DOC45 CLOSURE**

Discovery is explicit: `EnergySwarmGame.startGame()` currently resets to Campaign, while `RuntimeProgressionState` intentionally discriminates only `CAMPAIGN | INFINITE`. A Score Attack start projected only as runtime `INFINITE` would lose canonical `SCORE_ATTACK` identity before later finalization/persistence can distinguish it.

J8H must therefore own only a pure bootstrap-envelope construction boundary: consume J8G, construct fresh Infinite session/runtime through existing authorities, preserve outer `modeId: SCORE_ATTACK`, retain runtime progression mode `INFINITE`, and carry frozen J8C `TIMEBOX / 60000 ms` facts. It must not add a third runtime discriminator or adopt the envelope into React refs/state, StartScreen/ResultScreen/HUD, timer, persistence/archive/write, score/economy, spawn/arena/entity/cap/FOTON/formation systems.
''',
    "continuity J8G closure/J8H activation",
)
continuity = sub_once(
    continuity,
    r"Suggested handoff:\n> Continue ORBI Energy Swarm autonomously\..*?(?=\n\n## Update obligation)",
    '''Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8G gameplay canonical is `55a31de7ad7989e3daaead8311aa08d3927096f7`, fully DEPLOYED / FROZEN via Issue #436 / PR #437 with recipe v1, fixed seed `orbi-score-attack-v1`, neutral Infinite context and post-main CI/Android/Pages GREEN. Complete DOC45 if still open, then implement J8H as a pure Score Attack bootstrap envelope: consume J8G, build fresh Infinite session/runtime through existing authorities, preserve outer `SCORE_ATTACK` identity while runtime remains `INFINITE`, carry J8C 60000 ms facts, but do not adopt React/UI/timer/persistence. Preserve Campaign/Infinite, caps/budgets, FOTON/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.''',
    "continuity handoff",
)
CONTINUITY.write_text(continuity)

for required in ("#4", "#5", "#202", "#248"):
    if required not in LEDGER.read_text() or required not in CONTINUITY.read_text():
        raise SystemExit(f"manual blocker missing: {required}")
for required in ("#254", "#283"):
    if required not in CONTINUITY.read_text():
        raise SystemExit(f"diagnostic missing: {required}")
for required in ("## J9 — Boss & Miniboss Expansion", "## J15", "ES-14"):
    if required not in ROADMAP.read_text():
        raise SystemExit(f"roadmap marker missing: {required}")
