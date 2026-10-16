from pathlib import Path
import re

ROADMAP = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
LEDGER = Path("docs/IMPLEMENTATION_LEDGER.md")
CONTINUITY = Path("docs/PROJECT_CONTINUITY.md")

J8K = "ac943f609e427618465104f51b8f023620c8bf98"
J8K_PARENT = "cea92b2304797ac2af597a3416a2b23b17563154"
J8K_TREE = "648c34b28bb03695aa0288998b8d992638cb489a"


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


# ROADMAP — close J8K and activate J8L while preserving J9+ byte-for-byte.
roadmap = ROADMAP.read_text()
j9_marker = "## J9 — Boss & Miniboss Expansion"
j9_tail = roadmap[roadmap.index(j9_marker):]
roadmap = sub_once(
    roadmap,
    r"### ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract\n.*?(?=\n## J9 — Boss & Miniboss Expansion)",
    '''### ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract
Status: **DEPLOYED / FROZEN**
Canonical: `ac943f609e427618465104f51b8f023620c8bf98`  
Issue #453 / PR #454

J8K freezes the Score Attack-specific pure runtime projection bundle before any live cache/start-flow integration:
- consumes frozen J8H and derives the exact frozen J8I effective descriptor;
- explicitly bypasses Adaptive Invasion and accepts no live follower-count input;
- checks J6 Dynamic Event and J7 Bonus Challenge adoption only as fail-closed compatibility seams, requiring null adoption and descriptor identity preservation on canonical Sector 11 / Wave 1;
- derives combat pressure, mutator effects, effective enemy budget and milestone only through existing pure projectors from the J8I descriptor;
- preserves canonical recipe/runtime comparability and keeps J8J terminal completion separate;
- exactly one positive authority: Score Attack runtime projection-bundle composition;
- no generic cache, React/UI, timer/clock/cursor, persistence/archive/record, progression/spawn/arena/entity/projectile/cap/budget/FOTON/formation mutation.

Exact deployment anchors:
- pre-PR SHA `8f5f22799af0239877da4df2fab20d26d1469082`, run `38952325860`, certify `117146510883` + Android `117146511249` GREEN;
- clean PR #454 head `083fe70f1c8d4e43dfa114f1564e55ef8e846730`;
- PR CI `38960654252` / `117174564413` GREEN; Android `38960654387` / `117174564610` GREEN;
- canonical `ac943f609e427618465104f51b8f023620c8bf98`, parent `cea92b2304797ac2af597a3416a2b23b17563154`, tree `648c34b28bb03695aa0288998b8d992638cb489a`, exact diff three certified files;
- main CI `38960883456` / `117175332888` GREEN; Android `38960883435` / `117175333148` GREEN;
- Pages `38961007520`, build `117175743388` + deploy `117175888611` GREEN.

### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract
Status: **NEXT CONTRACT TARGET AFTER DOC49 CLOSURE**

Discovery after J8K shows that direct generic-cache/live adoption is still unsafe because `EnergySwarmGame` has no explicit Score Attack live identity. `runtimeProgressionRef` remains intentionally `CAMPAIGN | INFINITE`, `startGame()` still resets to Campaign, and the generic cache accepts only runtime state plus optional follower count. A Score Attack runtime therefore cannot be safely identified from the runtime discriminator alone without undoing J8H's outer identity boundary.

J8L must freeze a pure activation envelope that composes one valid J8H bootstrap envelope with its exact J8K projection bundle while preserving explicit outer `modeId: SCORE_ATTACK`. It must expose the same nested fresh `INFINITE` runtime/session plus effective TIMEBOX/60000 descriptor/bundle as immutable metadata for later controlled start/cache adoption and prove all composed facts refer to the same runtime/session identity.

J8L must not add `SCORE_ATTACK` to `RuntimeProgressionState`; write React state/refs or generic caches; alter StartScreen/ResultScreen/HUD; start/tick/reset timers; advance/end session; execute J8J terminal completion; write persistence/archive/record; or mutate score/economy, spawn/arena, entities/projectiles, caps/budgets, FOTON or formations.
''',
    "roadmap J8K closure/J8L activation",
)
if roadmap[roadmap.index(j9_marker):] != j9_tail:
    raise SystemExit("roadmap J9+ preservation failed")
ROADMAP.write_text(roadmap)

# LEDGER — milestone, DOC lineage, J8K evidence, J8L target.
ledger = LEDGER.read_text()
ledger = replace_once(
    ledger,
    '| ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract | DEPLOYED / FROZEN | `801b09c7ab74db18a3765db4538b8d3b23588062` | #449 | #450 |',
    '| ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract | DEPLOYED / FROZEN | `801b09c7ab74db18a3765db4538b8d3b23588062` | #449 | #450 |\n| ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract | DEPLOYED / FROZEN | `ac943f609e427618465104f51b8f023620c8bf98` | #453 | #454 |',
    "ledger J8K milestone row",
)
ledger = replace_once(
    ledger,
    '- DOC48 — J8J closure & J8K Score Attack effective-runtime projection isolation activation: Issue #451, branch `docs/es-13-j8j-closure-j8k-runtime-projection-isolation`, documentation-only closure in progress from gameplay canonical `801b09c7ab74db18a3765db4538b8d3b23588062`.',
    '- DOC48 — J8J closure & J8K Score Attack effective-runtime projection isolation activation: `cea92b2304797ac2af597a3416a2b23b17563154` — Issue #451 / PR #452.\n- DOC49 — J8K closure & J8L Score Attack runtime-activation envelope activation: Issue #455, branch `docs/es-13-j8k-closure-j8l-activation-envelope`, documentation-only closure in progress from gameplay canonical `ac943f609e427618465104f51b8f023620c8bf98`.',
    "ledger DOC48/DOC49 lineage",
)
ledger = sub_once(
    ledger,
    r"\n## Next planned gameplay\n\n### ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)",
    '''
### J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract
- Pure Score Attack-specific effective runtime projection composition over frozen J8H/J8I facts.
- Adaptive Invasion bypassed; no follower-count input; J6/J7 remain null/unchanged compatibility checks.
- Existing pure pressure/mutator/budget/milestone projectors derive only from the J8I effective descriptor; J8J remains separate.
- Pre-PR `8f5f22799af0239877da4df2fab20d26d1469082`: run `38952325860`, certify `117146510883` + Android `117146511249` GREEN.
- PR #454 head `083fe70f1c8d4e43dfa114f1564e55ef8e846730`: CI `38960654252` / `117174564413` + Android `38960654387` / `117174564610` GREEN.
- Canonical `ac943f609e427618465104f51b8f023620c8bf98`, parent `cea92b2304797ac2af597a3416a2b23b17563154`, tree `648c34b28bb03695aa0288998b8d992638cb489a`, exact diff three certified files.
- Main CI `38960883456` / `117175332888`, Android `38960883435` / `117175333148`, Pages `38961007520` build `117175743388` + deploy `117175888611` GREEN.

## Next planned gameplay

### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract
Status: **NEXT CONTRACT TARGET AFTER DOC49 CLOSURE**.

J8L must compose valid J8H + J8K facts into one immutable outer `SCORE_ATTACK` activation envelope that carries the exact nested fresh INFINITE runtime/session and effective TIMEBOX/60000 projection bundle without changing `RuntimeProgressionState`. It must prove same-object/runtime-session identity and own no React/cache/start-screen/timer/terminal/persistence/gameplay mutation authority.''',
    "ledger J8K evidence/J8L next",
)
LEDGER.write_text(ledger)

# CONTINUITY — current canonical, lineage, result/evidence, J8L activation and handoff.
continuity = CONTINUITY.read_text()
continuity = sub_once(
    continuity,
    r"## Current certified gameplay canonical\n\n`801b09c7ab74db18a3765db4538b8d3b23588062`\n\nPhase: \*\*ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #449 — CLOSED / completed\nDelivery: PR #450 — squash merged\n\nSingle parent: `06b879f8a2af66f2dce4c02fa8d1bfe749e213c3` — DOC47 documentation canonical\.\n\nCanonical tree: `3a9bd3527833b866a43a60c5e2da3981a217cb45`\.",
    '''## Current certified gameplay canonical

`ac943f609e427618465104f51b8f023620c8bf98`

Phase: **ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract**
Status: **DEPLOYED / FROZEN**
Issue: #453 — CLOSED / completed
Delivery: PR #454 — squash merged

Single parent: `cea92b2304797ac2af597a3416a2b23b17563154` — DOC48 documentation canonical.

Canonical tree: `648c34b28bb03695aa0288998b8d992638cb489a`.''',
    "continuity current canonical",
)
continuity = replace_once(
    continuity,
    '- DOC48 — J8J closure & J8K Score Attack effective-runtime projection isolation activation: Issue #451, branch `docs/es-13-j8j-closure-j8k-runtime-projection-isolation`, documentation-only closure in progress from gameplay canonical `801b09c7ab74db18a3765db4538b8d3b23588062`.',
    '- DOC48 — J8J closure & J8K Score Attack effective-runtime projection isolation activation: `cea92b2304797ac2af597a3416a2b23b17563154` — Issue #451 / PR #452.\n- DOC49 — J8K closure & J8L Score Attack runtime-activation envelope activation: Issue #455, branch `docs/es-13-j8k-closure-j8l-activation-envelope`, documentation-only closure in progress from gameplay canonical `ac943f609e427618465104f51b8f023620c8bf98`.',
    "continuity DOC48/DOC49 lineage",
)
continuity = sub_once(
    continuity,
    r"\n## Next gameplay phase\n\n### ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract\n.*?(?=\n## Resolved diagnostics)",
    '''
## J8K result
J8K froze the pure Score Attack-specific effective runtime projection bundle before any live cache/start-flow adoption. It consumes J8H/J8I facts, keeps the J8I descriptor effective, bypasses Adaptive Invasion, requires J6/J7 null/unchanged compatibility, and derives existing pressure/mutator/budget/milestone projections only from that descriptor while leaving J8J separate.

## J8K exact evidence
- DOC48 baseline `cea92b2304797ac2af597a3416a2b23b17563154`;
- pre-PR SHA `8f5f22799af0239877da4df2fab20d26d1469082`, run `38952325860`, certify `117146510883` + Android `117146511249` GREEN;
- final PR #454 head `083fe70f1c8d4e43dfa114f1564e55ef8e846730`;
- PR CI `38960654252` / `117174564413` GREEN;
- PR Android `38960654387` / `117174564610` GREEN including APK build/verify/upload;
- canonical `ac943f609e427618465104f51b8f023620c8bf98`, single parent `cea92b2304797ac2af597a3416a2b23b17563154`, tree `648c34b28bb03695aa0288998b8d992638cb489a`, exact diff three certified files;
- main CI `38960883456` / `117175332888` GREEN;
- main Android `38960883435` / `117175333148` GREEN including APK build/verify/upload;
- Pages `38961007520`: build `117175743388` + deploy `117175888611` GREEN.

Issue #453 CLOSED / completed. J8K is **DEPLOYED / FROZEN**.

## Next gameplay phase

### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract
Status: **NEXT CONTRACT TARGET AFTER DOC49 CLOSURE**

Discovery shows that generic-cache/live adoption remains unsafe because `EnergySwarmGame` currently has no explicit Score Attack live identity. `runtimeProgressionRef` intentionally remains CAMPAIGN/INFINITE, `startGame()` still resets to Campaign, and the generic cache receives only runtime state plus optional follower count. Inferring Score Attack from an INFINITE runtime would violate the outer identity preserved by J8H.

J8L must therefore own only a pure activation-envelope construction boundary: compose one valid J8H bootstrap envelope with its exact J8K projection bundle, preserve outer `SCORE_ATTACK`, expose the same nested fresh INFINITE runtime/session and effective TIMEBOX/60000 descriptor/bundle, and prove all facts refer to the same runtime/session identity. No React/cache/start/result/HUD adoption, timer/clock/cursor, J8J execution, persistence/archive/record, progression, score/economy, spawn/arena/entity/cap/FOTON/formation mutation is allowed.
''',
    "continuity J8K closure/J8L activation",
)
continuity = sub_once(
    continuity,
    r"Suggested handoff:\n> Continue ORBI Energy Swarm autonomously\..*?(?=\n\n## Update obligation)",
    '''Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8K gameplay canonical is `ac943f609e427618465104f51b8f023620c8bf98`, fully DEPLOYED / FROZEN via Issue #453 / PR #454 with pure Score Attack effective runtime projection bundle, Adaptive Invasion bypass, J6/J7 null compatibility and post-main CI/Android/Pages GREEN. Complete DOC49 if still open, then implement J8L as a pure Score Attack runtime activation envelope: compose J8H + exact J8K facts, preserve outer SCORE_ATTACK while nested runtime remains INFINITE, prove same runtime/session identity, and do not adopt React/cache/start flow/timer/J8J/persistence yet. Preserve Campaign/Infinite, caps/budgets, FOTON/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.''',
    "continuity handoff",
)
CONTINUITY.write_text(continuity)

for required in ("## J9 — Boss & Miniboss Expansion", "## J15", "ES-14"):
    if required not in ROADMAP.read_text():
        raise SystemExit(f"roadmap marker missing: {required}")
