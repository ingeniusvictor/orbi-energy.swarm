from pathlib import Path
import re

ROADMAP = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
LEDGER = Path("docs/IMPLEMENTATION_LEDGER.md")
CONTINUITY = Path("docs/PROJECT_CONTINUITY.md")

J8L = "d41f00a1a87140dba1ddc2d04b207261df862307"
J8L_PARENT = "9d110a10e07da45f51c932d575f0ae3edb9606d4"
J8L_TREE = "20e5f9a1a48a03108d1c5ea140009d56e0b8da29"


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


# ROADMAP — close J8L and activate J8M while preserving J9+ byte-for-byte.
roadmap = ROADMAP.read_text()
j9_marker = "## J9 — Boss & Miniboss Expansion"
j9_tail = roadmap[roadmap.index(j9_marker):]
roadmap = sub_once(
    roadmap,
    r"### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract\n.*?(?=\n## J9 — Boss & Miniboss Expansion)",
    '''### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract
Status: **DEPLOYED / FROZEN**
Canonical: `d41f00a1a87140dba1ddc2d04b207261df862307`  
Issue #457 / PR #458

J8L freezes the pure outer activation carrier required before any live Score Attack start/cache adoption:
- resolves one fresh frozen J8H bootstrap envelope and passes that exact object to J8K;
- preserves explicit outer `modeId: SCORE_ATTACK` while nested runtime remains exactly `INFINITE`;
- exposes exact J8H bootstrap/runtime/session and J8K bundle/effective-descriptor object identity;
- carries canonical Sector 11 / Wave 1 fresh-start facts including zero completed sectors/waves and ACTIVE session status;
- preserves TIMEBOX / 60000 ms and J8K Adaptive Invasion bypass + J6/J7 null compatibility;
- repeated resolutions are canonically equivalent but independently fresh object graphs;
- exactly one positive authority: runtime activation-envelope construction;
- no generic cache/live React/UI/start flow, timer/clock/cursor, J8J execution, persistence/archive/record, score/economy or spawn authority.

One initial pre-certification failure was test-only: the J8L gameplay test incorrectly truncated frozen J8B `canonicalFreshStart` to `{sector,wave}`. The canonical J8B object also contains `sectorsCompleted`, `wavesCompleted`, and `status`. Product code remained unchanged; the test was corrected to the full frozen shape.

Exact deployment anchors:
- initial pre-PR run `38962595762`: scope guard + repo smoke GREEN; gameplay exposed the test-only shape mismatch; Android `117181121364` GREEN;
- corrected isolated gameplay diagnostic `38963366915` / `117183693510` GREEN across all six J8L tests;
- final pre-PR SHA `1c9f9e65b8307d1f73dfc6215c6f77b387cfbf0b`, run `38963464711`, certify `117184022310` + Android `117184023007` GREEN;
- clean PR #458 head `a06c71e7ca72991051e7bcc7752f0f50089e41d4`;
- PR CI `38963705565` / `117184830694` GREEN; Android `38963705688` / `117184831351` GREEN;
- canonical `d41f00a1a87140dba1ddc2d04b207261df862307`, parent `9d110a10e07da45f51c932d575f0ae3edb9606d4`, tree `20e5f9a1a48a03108d1c5ea140009d56e0b8da29`, exact diff three certified files;
- main CI `38963938606` / `117185611390` GREEN; Android `38963938646` / `117185612137` GREEN;
- Pages `38964054007`, build `117186003430` + deploy `117186140619` GREEN.

### ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract
Status: **NEXT CONTRACT TARGET AFTER DOC50 CLOSURE**

Discovery after J8L shows that live adoption is still unsafe at the terminal boundary. J8J owns pure `END_SCORE_ATTACK_ATTEMPT` projection after existing runtime completion policy evaluates the J8I TIMEBOX descriptor; J8F owns dedicated record eligibility from a completed TIMEBOX fact; storage already owns independent `scoreAttackBestScore`; and generic `applyFinalRunCommit()` still updates global `highScore` plus generic telemetry/archive. A live Score Attack finalizer must therefore not improvise a generic final commit or couple the dedicated record back into global high score.

J8M must freeze a pure/fail-closed attempt-finalization plan: consume one valid J8L activation envelope, one existing `RuntimeCompletionSnapshot`, existing dedicated best score, and current candidate run score; delegate terminal completion only to J8J; return null until canonical `END_SCORE_ATTACK_ATTEMPT`; then derive exactly `{ type: "TIMEBOX", durationMs: 60000, completed: true }` and delegate dedicated record comparison/eligibility only to J8F. It may expose immutable terminal disposition, normalized existing/candidate scores, projected dedicated best, record status, and dedicated-record advance eligibility.

J8M must own only finalization-plan composition. It must not write storage/GameStats, call `saveGameStats`/`applyFinalRunCommit`, mutate global `highScore`, write archive, transition ResultScreen/HUD/React, own timer/clock/cursor, advance/end session, or alter score formula/economy/spawn/arena/entities/caps/FOTON/formations.
''',
    "roadmap J8L closure/J8M activation",
)
if roadmap[roadmap.index(j9_marker):] != j9_tail:
    raise SystemExit("roadmap J9+ preservation failed")
ROADMAP.write_text(roadmap)

# LEDGER — add J8L milestone, close DOC49 lineage, add DOC50, record evidence + next target.
ledger = LEDGER.read_text()
ledger = replace_once(
    ledger,
    '| ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract | DEPLOYED / FROZEN | `ac943f609e427618465104f51b8f023620c8bf98` | #453 | #454 |',
    '| ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract | DEPLOYED / FROZEN | `ac943f609e427618465104f51b8f023620c8bf98` | #453 | #454 |\n| ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract | DEPLOYED / FROZEN | `d41f00a1a87140dba1ddc2d04b207261df862307` | #457 | #458 |',
    "ledger J8L milestone row",
)
ledger = replace_once(
    ledger,
    '- DOC49 — J8K closure & J8L Score Attack runtime-activation envelope activation: Issue #455, branch `docs/es-13-j8k-closure-j8l-activation-envelope`, documentation-only closure in progress from gameplay canonical `ac943f609e427618465104f51b8f023620c8bf98`.',
    '- DOC49 — J8K closure & J8L Score Attack runtime-activation envelope activation: `9d110a10e07da45f51c932d575f0ae3edb9606d4` — Issue #455 / PR #456.\n- DOC50 — J8L closure & J8M Score Attack attempt-finalization plan activation: Issue #459, branch `docs/es-13-j8l-closure-j8m-finalization-plan`, documentation-only closure in progress from gameplay canonical `d41f00a1a87140dba1ddc2d04b207261df862307`.',
    "ledger DOC49/DOC50 lineage",
)
ledger = sub_once(
    ledger,
    r"\n## Next planned gameplay\n\n### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)",
    '''
### J8L — Pure Score Attack Runtime Activation Envelope Contract
- Pure outer SCORE_ATTACK activation envelope over the exact same frozen J8H fresh runtime/session and J8K effective descriptor/bundle.
- Nested runtime stays INFINITE; canonical Sector 11 / Wave 1 + TIMEBOX/60000 + J8K isolation facts are preserved by object identity.
- Initial pre-cert `38962595762` exposed only a test truncation of J8B canonicalFreshStart metadata; product code remained unchanged. Corrected isolated diagnostic `38963366915` / `117183693510` GREEN.
- Final pre-PR `1c9f9e65b8307d1f73dfc6215c6f77b387cfbf0b`: run `38963464711`, certify `117184022310` + Android `117184023007` GREEN.
- PR #458 head `a06c71e7ca72991051e7bcc7752f0f50089e41d4`: CI `38963705565` / `117184830694` + Android `38963705688` / `117184831351` GREEN.
- Canonical `d41f00a1a87140dba1ddc2d04b207261df862307`, parent `9d110a10e07da45f51c932d575f0ae3edb9606d4`, tree `20e5f9a1a48a03108d1c5ea140009d56e0b8da29`, exact diff three certified files.
- Main CI `38963938606` / `117185611390`, Android `38963938646` / `117185612137`, Pages `38964054007` build `117186003430` + deploy `117186140619` GREEN.

## Next planned gameplay

### ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract
Status: **NEXT CONTRACT TARGET AFTER DOC50 CLOSURE**.

J8M must compose frozen J8L activation facts with frozen J8J terminal disposition and frozen J8F dedicated-record eligibility. It returns null before canonical terminal completion; after completion it projects the exact completed TIMEBOX/60000 fact and dedicated score-record plan without writing GameStats/storage/global highScore/archive or generic run persistence.''',
    "ledger J8L evidence/J8M next",
)
LEDGER.write_text(ledger)

# CONTINUITY — advance gameplay canonical, close lineage and activate J8M.
continuity = CONTINUITY.read_text()
continuity = sub_once(
    continuity,
    r"## Current certified gameplay canonical\n\n`ac943f609e427618465104f51b8f023620c8bf98`\n\nPhase: \*\*ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #453 — CLOSED / completed\nDelivery: PR #454 — squash merged\n\nSingle parent: `cea92b2304797ac2af597a3416a2b23b17563154` — DOC48 documentation canonical\.\n\nCanonical tree: `648c34b28bb03695aa0288998b8d992638cb489a`\.",
    '''## Current certified gameplay canonical

`d41f00a1a87140dba1ddc2d04b207261df862307`

Phase: **ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract**
Status: **DEPLOYED / FROZEN**
Issue: #457 — CLOSED / completed
Delivery: PR #458 — squash merged

Single parent: `9d110a10e07da45f51c932d575f0ae3edb9606d4` — DOC49 documentation canonical.

Canonical tree: `20e5f9a1a48a03108d1c5ea140009d56e0b8da29`.''',
    "continuity current canonical",
)
continuity = replace_once(
    continuity,
    '- DOC49 — J8K closure & J8L Score Attack runtime-activation envelope activation: Issue #455, branch `docs/es-13-j8k-closure-j8l-activation-envelope`, documentation-only closure in progress from gameplay canonical `ac943f609e427618465104f51b8f023620c8bf98`.',
    '- DOC49 — J8K closure & J8L Score Attack runtime-activation envelope activation: `9d110a10e07da45f51c932d575f0ae3edb9606d4` — Issue #455 / PR #456.\n- DOC50 — J8L closure & J8M Score Attack attempt-finalization plan activation: Issue #459, branch `docs/es-13-j8l-closure-j8m-finalization-plan`, documentation-only closure in progress from gameplay canonical `d41f00a1a87140dba1ddc2d04b207261df862307`.',
    "continuity DOC49/DOC50 lineage",
)
continuity = sub_once(
    continuity,
    r"\n## Next gameplay phase\n\n### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract\n.*?(?=\n## Resolved diagnostics)",
    '''
## J8L result
J8L froze the pure outer Score Attack activation envelope required before live adoption. It resolves one fresh J8H object, resolves J8K from that exact object, preserves outer SCORE_ATTACK while nested runtime remains INFINITE, and exposes exact bootstrap/runtime/session/bundle/effective-descriptor identity with canonical Sector 11 / Wave 1 and TIMEBOX / 60000 facts. It owns no live/cache/UI/timer/terminal/persistence authority.

The only initial RED was test-only: the gameplay test truncated frozen J8B `canonicalFreshStart` metadata. The full canonical object also contains `sectorsCompleted: 0`, `wavesCompleted: 0`, and `status: ACTIVE`; correcting the test required no product-code change.

## J8L exact evidence
- DOC49 baseline `9d110a10e07da45f51c932d575f0ae3edb9606d4`;
- initial pre-PR run `38962595762`: scope guard + repository smoke GREEN; gameplay exposed the test-only assertion mismatch; Android `117181121364` GREEN;
- corrected isolated diagnostic `38963366915` / `117183693510` GREEN across all six J8L gameplay tests;
- final pre-PR SHA `1c9f9e65b8307d1f73dfc6215c6f77b387cfbf0b`, run `38963464711`, certify `117184022310` + Android `117184023007` GREEN;
- final PR #458 head `a06c71e7ca72991051e7bcc7752f0f50089e41d4`;
- PR CI `38963705565` / `117184830694` GREEN;
- PR Android `38963705688` / `117184831351` GREEN including APK build/verify/upload;
- canonical `d41f00a1a87140dba1ddc2d04b207261df862307`, single parent `9d110a10e07da45f51c932d575f0ae3edb9606d4`, tree `20e5f9a1a48a03108d1c5ea140009d56e0b8da29`, exact diff three certified files;
- main CI `38963938606` / `117185611390` GREEN;
- main Android `38963938646` / `117185612137` GREEN including APK build/verify/upload;
- Pages `38964054007`: build `117186003430` + deploy `117186140619` GREEN.

Issue #457 CLOSED / completed. J8L is **DEPLOYED / FROZEN**.

## Next gameplay phase

### ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract
Status: **NEXT CONTRACT TARGET AFTER DOC50 CLOSURE**

Discovery shows that terminal orchestration must remain pure before any live persistence/UI adoption. J8J owns END_SCORE_ATTACK_ATTEMPT after the existing runtime completion policy evaluates the J8I TIMEBOX descriptor; J8F owns dedicated score-record eligibility; `scoreAttackBestScore` is already an independent storage field; and generic `applyFinalRunCommit()` still updates global highScore plus generic telemetry/archive.

J8M must therefore compose one valid J8L activation envelope, an existing RuntimeCompletionSnapshot, existing dedicated best score, and current candidate score. It must return null until J8J resolves terminal completion; then derive exactly `{ type: "TIMEBOX", durationMs: 60000, completed: true }`, delegate dedicated record comparison/eligibility only to J8F, and expose immutable finalization-plan metadata. No storage/GameStats/global-highScore/archive write, generic final commit, ResultScreen/HUD/React transition, timer/clock/cursor, session advance/end, or gameplay mutation is allowed.
''',
    "continuity J8L closure/J8M activation",
)
continuity = sub_once(
    continuity,
    r"Suggested handoff:\n> Continue ORBI Energy Swarm autonomously\..*?(?=\n\n## Update obligation)",
    '''Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8L gameplay canonical is `d41f00a1a87140dba1ddc2d04b207261df862307`, fully DEPLOYED / FROZEN via Issue #457 / PR #458 with pure Score Attack runtime activation envelope, exact J8H/J8K object identity and post-main CI/Android/Pages GREEN. Complete DOC50 if still open, then implement J8M as a pure Score Attack attempt-finalization plan: compose J8L + existing RuntimeCompletionSnapshot + J8J terminal disposition + J8F dedicated-record eligibility; return null before terminal; after terminal project completed TIMEBOX/60000 plus dedicated-record status/eligibility, with no storage/GameStats/global highScore/archive/generic run persistence or UI write. Preserve Campaign/Infinite, caps/budgets, FOTON/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.''',
    "continuity handoff",
)
CONTINUITY.write_text(continuity)

for required in ("## J9 — Boss & Miniboss Expansion", "## J15", "ES-14"):
    if required not in ROADMAP.read_text():
        raise SystemExit(f"roadmap marker missing: {required}")
