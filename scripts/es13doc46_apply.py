from pathlib import Path
import re

ROADMAP = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
LEDGER = Path("docs/IMPLEMENTATION_LEDGER.md")
CONTINUITY = Path("docs/PROJECT_CONTINUITY.md")

J8H = "8ed798beaa688f73ab8513c0e7ecb9bd112a2824"
J8H_PARENT = "0557f91982534248765f2a5f7e5a2648f99ba58a"
J8H_TREE = "cf3b70ab9d6e0afd06dd9c552146934b094356ca"


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


# ROADMAP — close J8H and activate J8I, preserving J9+ byte-for-byte.
roadmap = ROADMAP.read_text()
j9_marker = "## J9 — Boss & Miniboss Expansion"
j9_tail = roadmap[roadmap.index(j9_marker):]
roadmap = sub_once(
    roadmap,
    r"### ES-13J8H — Pure Score Attack Bootstrap Envelope Contract\n.*?(?=\n## J9 — Boss & Miniboss Expansion)",
    '''### ES-13J8H — Pure Score Attack Bootstrap Envelope Contract
Status: **DEPLOYED / FROZEN**
Canonical: `8ed798beaa688f73ab8513c0e7ecb9bd112a2824`  
Issue #440 / PR #442

J8H freezes the pure bootstrap boundary between canonical Score Attack recipe facts and a later controlled live runtime adoption:
- consumes frozen J8G `resolveScoreAttackCanonicalRunRecipe(...)` only;
- constructs one fresh Infinite session through existing `createInfiniteSession(seed, context)`;
- validates frozen J8B fresh-substrate compatibility and J8C `TIMEBOX / 60000 ms` compatibility;
- constructs runtime only through existing `createInfiniteRuntimeState(session)`;
- preserves canonical outer `modeId: SCORE_ATTACK` while nested runtime progression remains exactly `INFINITE`;
- session exists only as `runtimeProgression.session`; no duplicate live/session authority;
- repeated calls produce equivalent canonical facts but independently fresh runtime/session objects;
- exactly one positive authority: bootstrap-envelope construction;
- no React/UI, timer ticking, session advancement/end, descriptor mutation, persistence/archive, score/economy or spawn authority.

Exact deployment anchors:
- pre-PR SHA `09ce57d304018d74aa3b19d5689463c2a48910e7`, run `38929746848`, certify `117070383670` + Android `117070383889` GREEN;
- clean PR #442 head `914d6a86d4bb3f87630fdb9366cd35db6b9e83ae`;
- PR CI `38943441225` / `117116516840` GREEN; Android `38943441011` / `117116514885` GREEN;
- canonical `8ed798beaa688f73ab8513c0e7ecb9bd112a2824`, parent `0557f91982534248765f2a5f7e5a2648f99ba58a`, tree `cf3b70ab9d6e0afd06dd9c552146934b094356ca`, exact diff three certified files;
- main CI `38943657919` / `117117249622` GREEN; Android `38943658003` / `117117250045` GREEN;
- Pages `38943771427`, build `117117654170` + deploy `117117807868` GREEN.

### ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract
Status: **NEXT CONTRACT TARGET AFTER DOC46 CLOSURE**

Discovery after J8H shows that direct live adoption is still unsafe: the J8H runtime is intentionally `INFINITE`, whose base descriptor remains `BUDGET_AND_CLEAR`, while the existing live timer decrements only for effective `TIMEBOX` descriptors. J8H carries J8C's `TIMEBOX / 60000 ms` facts but intentionally owns no descriptor mutation.

J8I must therefore freeze a pure/fail-closed descriptor completion overlay before any StartScreen/start-flow or runtime-cache integration. It must consume a valid J8H envelope plus its corresponding current fresh Infinite descriptor, require `BUDGET_AND_CLEAR`, and return an immutable descriptor copy whose only gameplay-semantic change is `completionPolicy: { type: "TIMEBOX", durationMs: 60000 }`. Score Attack attribution must remain outside `RuntimeProgressionState`.

J8I must preserve sector/wave, biome, spawn, modifiers, pressure, rewards, milestone, fairness and source seed/recipe/wave facts exactly; reuse J8C duration and the existing timer/completion authorities; and own no clock/timer/cursor, React/UI, cache/live adoption, progression, persistence/archive, score/reward/economy, spawn/arena/entity/projectile/cap/budget/FOTON/formation authority.
''',
    "roadmap J8H closure/J8I activation",
)
if roadmap[roadmap.index(j9_marker):] != j9_tail:
    raise SystemExit("roadmap J9+ preservation failed")
ROADMAP.write_text(roadmap)

# LEDGER — milestone, DOC lineage, J8H evidence, J8I target.
ledger = LEDGER.read_text()
ledger = replace_once(
    ledger,
    '| ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract | DEPLOYED / FROZEN | `55a31de7ad7989e3daaead8311aa08d3927096f7` | #436 | #437 |',
    '| ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract | DEPLOYED / FROZEN | `55a31de7ad7989e3daaead8311aa08d3927096f7` | #436 | #437 |\n| ES-13J8H — Pure Score Attack Bootstrap Envelope Contract | DEPLOYED / FROZEN | `8ed798beaa688f73ab8513c0e7ecb9bd112a2824` | #440 | #442 |',
    "ledger J8H milestone row",
)
ledger = replace_once(
    ledger,
    '- DOC45 — J8G closure & J8H Score Attack bootstrap-envelope activation: Issue #438, branch `docs/es-13-j8g-closure-j8h-bootstrap-envelope`, documentation-only closure in progress from gameplay canonical `55a31de7ad7989e3daaead8311aa08d3927096f7`.',
    '- DOC45 — J8G closure & J8H Score Attack bootstrap-envelope activation: `0557f91982534248765f2a5f7e5a2648f99ba58a` — Issue #438 / PR #439.\n- DOC46 — J8H closure & J8I Score Attack descriptor-completion overlay activation: Issue #443, branch `docs/es-13-j8h-closure-j8i-descriptor-completion-overlay`, documentation-only closure in progress from gameplay canonical `8ed798beaa688f73ab8513c0e7ecb9bd112a2824`.',
    "ledger DOC45/DOC46 lineage",
)
ledger = sub_once(
    ledger,
    r"\n## Next planned gameplay\n\n### ES-13J8H — Pure Score Attack Bootstrap Envelope Contract\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)",
    '''
### J8H — Pure Score Attack Bootstrap Envelope Contract
- Pure outer `SCORE_ATTACK` bootstrap envelope over existing fresh Infinite session/runtime construction.
- Nested runtime remains exactly `INFINITE`; no third runtime discriminator.
- Reuses frozen J8G recipe, J8B substrate and J8C `TIMEBOX / 60000 ms` facts; session is not duplicated outside `runtimeProgression.session`.
- Pre-PR `09ce57d304018d74aa3b19d5689463c2a48910e7`: run `38929746848`, certify `117070383670` + Android `117070383889` GREEN.
- PR #442 head `914d6a86d4bb3f87630fdb9366cd35db6b9e83ae`: CI `38943441225` / `117116516840` + Android `38943441011` / `117116514885` GREEN.
- Canonical `8ed798beaa688f73ab8513c0e7ecb9bd112a2824`, parent `0557f91982534248765f2a5f7e5a2648f99ba58a`, tree `cf3b70ab9d6e0afd06dd9c552146934b094356ca`, exact diff three certified files.
- Main CI `38943657919` / `117117249622`, Android `38943658003` / `117117250045`, Pages `38943771427` build `117117654170` + deploy `117117807868` GREEN.

## Next planned gameplay

### ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract
Status: **NEXT CONTRACT TARGET AFTER DOC46 CLOSURE**.

J8I must consume a valid J8H bootstrap envelope plus the corresponding fresh Infinite descriptor, fail closed unless the descriptor is exact/current and `BUDGET_AND_CLEAR`, and return an immutable descriptor copy changing only completion to `TIMEBOX / 60000 ms`. It must preserve all spawn/pressure/reward/fairness/source semantics and own no timer/clock/cursor, cache/live integration, React/UI, persistence/archive or economy authority.''',
    "ledger J8H evidence/J8I next",
)
LEDGER.write_text(ledger)

# CONTINUITY — current canonical, lineage, J8H result/evidence, J8I activation and handoff.
continuity = CONTINUITY.read_text()
continuity = sub_once(
    continuity,
    r"## Current certified gameplay canonical\n\n`55a31de7ad7989e3daaead8311aa08d3927096f7`\n\nPhase: \*\*ES-13J8G — Pure Score Attack Canonical Run Recipe / Seed Policy Contract\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #436 — CLOSED / completed\nDelivery: PR #437 — squash merged\n\nSingle parent: `2e07ea501c36728bdc369a66dfecb64f6d8e5e01` — DOC44 documentation canonical\.\n\nCanonical tree: `67e0b9da68544d0f4c134e37f08d1a84df1df264`\.",
    '''## Current certified gameplay canonical

`8ed798beaa688f73ab8513c0e7ecb9bd112a2824`

Phase: **ES-13J8H — Pure Score Attack Bootstrap Envelope Contract**
Status: **DEPLOYED / FROZEN**
Issue: #440 — CLOSED / completed
Delivery: PR #442 — squash merged

Single parent: `0557f91982534248765f2a5f7e5a2648f99ba58a` — DOC45 documentation canonical.

Canonical tree: `cf3b70ab9d6e0afd06dd9c552146934b094356ca`.''',
    "continuity current canonical",
)
continuity = replace_once(
    continuity,
    '- DOC45 — J8G closure & J8H Score Attack bootstrap-envelope activation: Issue #438, branch `docs/es-13-j8g-closure-j8h-bootstrap-envelope`, documentation-only closure in progress from gameplay canonical `55a31de7ad7989e3daaead8311aa08d3927096f7`.',
    '- DOC45 — J8G closure & J8H Score Attack bootstrap-envelope activation: `0557f91982534248765f2a5f7e5a2648f99ba58a` — Issue #438 / PR #439.\n- DOC46 — J8H closure & J8I Score Attack descriptor-completion overlay activation: Issue #443, branch `docs/es-13-j8h-closure-j8i-descriptor-completion-overlay`, documentation-only closure in progress from gameplay canonical `8ed798beaa688f73ab8513c0e7ecb9bd112a2824`.',
    "continuity DOC45/DOC46 lineage",
)
continuity = sub_once(
    continuity,
    r"\n## Next gameplay phase\n\n### ES-13J8H — Pure Score Attack Bootstrap Envelope Contract\n.*?(?=\n## Resolved diagnostics)",
    '''
## J8H result
J8H froze the pure bootstrap envelope required before live Score Attack adoption. It consumes J8G, constructs fresh Infinite session/runtime objects through existing authorities, preserves outer `SCORE_ATTACK` identity, retains nested runtime mode `INFINITE`, and carries J8C `TIMEBOX / 60000 ms` facts without creating a third runtime discriminator or adopting React/UI/timer/persistence authority.

## J8H exact evidence
- DOC45 baseline `0557f91982534248765f2a5f7e5a2648f99ba58a`;
- pre-PR SHA `09ce57d304018d74aa3b19d5689463c2a48910e7`, run `38929746848`, certify `117070383670` + Android `117070383889` GREEN;
- final PR #442 head `914d6a86d4bb3f87630fdb9366cd35db6b9e83ae`;
- PR CI `38943441225` / `117116516840` GREEN;
- PR Android `38943441011` / `117116514885` GREEN including APK build/verify/upload;
- canonical `8ed798beaa688f73ab8513c0e7ecb9bd112a2824`, single parent `0557f91982534248765f2a5f7e5a2648f99ba58a`, tree `cf3b70ab9d6e0afd06dd9c552146934b094356ca`, exact diff three certified files;
- main CI `38943657919` / `117117249622` GREEN;
- main Android `38943658003` / `117117250045` GREEN including APK build/verify/upload;
- Pages `38943771427`: build `117117654170` + deploy `117117807868` GREEN.

Issue #440 CLOSED / completed. J8H is **DEPLOYED / FROZEN**.

## Next gameplay phase

### ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract
Status: **NEXT CONTRACT TARGET AFTER DOC46 CLOSURE**

Discovery shows the J8H runtime correctly remains `INFINITE`, but the corresponding base Infinite descriptor is still `BUDGET_AND_CLEAR`. The live game timer only decrements for effective `TIMEBOX` descriptors, so wiring J8H directly into `startGame()` before a completion overlay would violate frozen J8C 60000 ms semantics.

J8I must therefore own only a pure descriptor-completion overlay boundary. It must consume J8H and its exact current fresh Infinite descriptor, require `BUDGET_AND_CLEAR`, and project an immutable descriptor copy with `TIMEBOX / 60000 ms` while preserving every other runtime descriptor fact. Score Attack attribution stays outside `RuntimeProgressionState`. No runtime cache/live integration, React/UI/start flow, timer/clock/cursor, session progression, persistence/archive, score/economy, spawn/arena/entity/cap/FOTON/formation authority is allowed.
''',
    "continuity J8H closure/J8I activation",
)
continuity = sub_once(
    continuity,
    r"Suggested handoff:\n> Continue ORBI Energy Swarm autonomously\..*?(?=\n\n## Update obligation)",
    '''Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8H gameplay canonical is `8ed798beaa688f73ab8513c0e7ecb9bd112a2824`, fully DEPLOYED / FROZEN via Issue #440 / PR #442 with pure Score Attack bootstrap envelope, outer SCORE_ATTACK identity, nested INFINITE runtime and post-main CI/Android/Pages GREEN. Complete DOC46 if still open, then implement J8I as a pure Score Attack runtime-descriptor completion overlay: consume J8H + exact fresh Infinite descriptor, require BUDGET_AND_CLEAR, project only TIMEBOX 60000 while preserving all other descriptor facts, and do not adopt cache/UI/start flow/timer/persistence yet. Preserve Campaign/Infinite, caps/budgets, FOTON/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.''',
    "continuity handoff",
)
CONTINUITY.write_text(continuity)

# Preservation markers.
for required in ("#4", "#5", "#202", "#248"):
    if required not in LEDGER.read_text():
        raise SystemExit(f"ledger blocker missing: {required}")
for required in ("#254", "#283"):
    if required not in CONTINUITY.read_text():
        raise SystemExit(f"continuity diagnostic missing: {required}")
for required in ("## J9 — Boss & Miniboss Expansion", "## J15", "ES-14"):
    if required not in ROADMAP.read_text():
        raise SystemExit(f"roadmap marker missing: {required}")
