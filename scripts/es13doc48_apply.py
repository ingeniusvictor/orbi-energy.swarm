from pathlib import Path
import re

ROADMAP = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
LEDGER = Path("docs/IMPLEMENTATION_LEDGER.md")
CONTINUITY = Path("docs/PROJECT_CONTINUITY.md")

J8J = "801b09c7ab74db18a3765db4538b8d3b23588062"
J8J_PARENT = "06b879f8a2af66f2dce4c02fa8d1bfe749e213c3"
J8J_TREE = "3a9bd3527833b866a43a60c5e2da3981a217cb45"


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


# ROADMAP — close J8J and activate J8K, preserving J9+ byte-for-byte.
roadmap = ROADMAP.read_text()
j9_marker = "## J9 — Boss & Miniboss Expansion"
j9_tail = roadmap[roadmap.index(j9_marker):]
roadmap = sub_once(
    roadmap,
    r"### ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract\n.*?(?=\n## J9 — Boss & Miniboss Expansion)",
    '''### ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract
Status: **DEPLOYED / FROZEN**
Canonical: `801b09c7ab74db18a3765db4538b8d3b23588062`  
Issue #449 / PR #450

J8J freezes the pure terminal-completion decision required before live Score Attack adoption:
- consumes canonical frozen J8H bootstrap + J8I TIMEBOX overlay facts;
- rebuilds the expected J8I overlay fail-closed for the supplied envelope;
- delegates completion truth only to existing `isRuntimeWaveComplete(...)`;
- incomplete TIMEBOX snapshots fail closed;
- canonical completed `SCORE_ATTACK / INFINITE / TIMEBOX / 60000 ms` projects immutable `END_SCORE_ATTACK_ATTEMPT`;
- explicitly `advanceInfiniteRuntime: false` while preserving nested runtime discriminator `INFINITE`;
- exactly one positive authority: terminal-completion disposition projection;
- no session status/end mutation, Infinite advancement call, runtime-cache/live integration, React/UI/result transition, persistence/archive/record write, timer/clock/cursor or combat/economy/spawn authority.

Exact deployment anchors:
- pre-PR SHA `c8c64c66603bc230a67c818a05fe87c9c6f184bc`, run `38949844968`, certify `117138168359` + Android `117138168740` GREEN;
- clean PR #450 head `8d867f22a2e40f0140fd4b935b2a712b5db1d090`;
- PR CI `38950093548` / `117139004853` GREEN; Android `38950093511` / `117139004731` GREEN;
- canonical `801b09c7ab74db18a3765db4538b8d3b23588062`, parent `06b879f8a2af66f2dce4c02fa8d1bfe749e213c3`, tree `3a9bd3527833b866a43a60c5e2da3981a217cb45`, exact diff three certified files;
- main CI `38950330832` / `117139808091` GREEN; Android `38950330639` / `117139806867` GREEN;
- Pages `38950451599`, build `117140202743` + deploy `117140357609` GREEN.

### ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract
Status: **NEXT CONTRACT TARGET AFTER DOC48 CLOSURE**

Discovery after J8J shows that direct use of the generic runtime projection cache is still unsafe. The generic cache applies Adaptive Invasion before J6/J7 and receives `swarm.length`; Adaptive Invasion changes descriptor id, spawn budget/composition/cadence, pressure and fairness from `liveFollowerCount`, which would violate J8G's fixed versioned recipe and J8I's exact effective-descriptor contract.

J8K must therefore freeze a pure Score Attack-specific projection bundle before any cache or React integration. It must consume a valid J8H envelope, derive the exact J8I TIMEBOX overlay from the canonical base descriptor and keep that J8I descriptor as the effective descriptor. Adaptive Invasion must be explicitly bypassed. Existing J6 Dynamic Event and J7 Bonus Challenge adoption seams may be evaluated only as compatibility checks and must remain null/unchanged for canonical Sector 11 / Wave 1; J8J guarantees the attempt terminates on that wave.

J8K may derive combat pressure, mutator effects, enemy budget and milestone projection only through existing pure authorities using the J8I descriptor. It must return immutable projection metadata suitable for later controlled live/cache adoption, while owning no cache writes, React refs/state, timer/clock, terminal disposition, persistence/archive/record, start/result/HUD, spawn/arena/entity/projectile/cap/budget/FOTON/formation authority. J8J remains the separate terminal-completion authority.
''',
    "roadmap J8J closure/J8K activation",
)
if roadmap[roadmap.index(j9_marker):] != j9_tail:
    raise SystemExit("roadmap J9+ preservation failed")
ROADMAP.write_text(roadmap)

# LEDGER — milestone, DOC lineage, J8J evidence, J8K target.
ledger = LEDGER.read_text()
ledger = replace_once(
    ledger,
    '| ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract | DEPLOYED / FROZEN | `9ccec58c5454e25e33cf58d2b4bf6030424f475d` | #445 | #446 |',
    '| ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract | DEPLOYED / FROZEN | `9ccec58c5454e25e33cf58d2b4bf6030424f475d` | #445 | #446 |\n| ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract | DEPLOYED / FROZEN | `801b09c7ab74db18a3765db4538b8d3b23588062` | #449 | #450 |',
    "ledger J8J milestone row",
)
ledger = replace_once(
    ledger,
    '- DOC47 — J8I closure & J8J Score Attack terminal-completion disposition activation: Issue #447, branch `docs/es-13-j8i-closure-j8j-terminal-completion-disposition`, documentation-only closure in progress from gameplay canonical `9ccec58c5454e25e33cf58d2b4bf6030424f475d`.',
    '- DOC47 — J8I closure & J8J Score Attack terminal-completion disposition activation: `06b879f8a2af66f2dce4c02fa8d1bfe749e213c3` — Issue #447 / PR #448.\n- DOC48 — J8J closure & J8K Score Attack effective-runtime projection isolation activation: Issue #451, branch `docs/es-13-j8j-closure-j8k-runtime-projection-isolation`, documentation-only closure in progress from gameplay canonical `801b09c7ab74db18a3765db4538b8d3b23588062`.',
    "ledger DOC47/DOC48 lineage",
)
ledger = sub_once(
    ledger,
    r"\n## Next planned gameplay\n\n### ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)",
    '''
### J8J — Pure Score Attack Terminal Completion Disposition Contract
- Pure/fail-closed terminal disposition over frozen J8H + J8I facts and existing runtime completion evaluation.
- Completed canonical TIMEBOX projects `END_SCORE_ATTACK_ATTEMPT` and `advanceInfiniteRuntime: false`; nested runtime remains `INFINITE`.
- Pre-PR `c8c64c66603bc230a67c818a05fe87c9c6f184bc`: run `38949844968`, certify `117138168359` + Android `117138168740` GREEN.
- PR #450 head `8d867f22a2e40f0140fd4b935b2a712b5db1d090`: CI `38950093548` / `117139004853` + Android `38950093511` / `117139004731` GREEN.
- Canonical `801b09c7ab74db18a3765db4538b8d3b23588062`, parent `06b879f8a2af66f2dce4c02fa8d1bfe749e213c3`, tree `3a9bd3527833b866a43a60c5e2da3981a217cb45`, exact diff three certified files.
- Main CI `38950330832` / `117139808091`, Android `38950330639` / `117139806867`, Pages `38950451599` build `117140202743` + deploy `117140357609` GREEN.

## Next planned gameplay

### ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract
Status: **NEXT CONTRACT TARGET AFTER DOC48 CLOSURE**.

J8K must consume valid J8H/J8I facts and freeze the effective Score Attack runtime projection bundle before live cache integration. The J8I descriptor stays authoritative; Adaptive Invasion is explicitly bypassed because `liveFollowerCount` would break canonical fixed-recipe comparability; J6/J7 must resolve null/unchanged on the canonical Sector 11 / Wave 1. Existing pure pressure/mutator/budget/milestone projectors may derive bundle facts from J8I only. No cache write, React/start flow, timer, persistence or terminal authority is allowed.''',
    "ledger J8J evidence/J8K next",
)
LEDGER.write_text(ledger)

# CONTINUITY — current canonical, lineage, J8J result/evidence, J8K activation and handoff.
continuity = CONTINUITY.read_text()
continuity = sub_once(
    continuity,
    r"## Current certified gameplay canonical\n\n`9ccec58c5454e25e33cf58d2b4bf6030424f475d`\n\nPhase: \*\*ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #445 — CLOSED / completed\nDelivery: PR #446 — squash merged\n\nSingle parent: `12efb3029cf54581c81bad5a2fc629332f7be6c4` — DOC46 documentation canonical\.\n\nCanonical tree: `48e3f69e1d112ddc4843df7d83515cf752a23b36`\.",
    '''## Current certified gameplay canonical

`801b09c7ab74db18a3765db4538b8d3b23588062`

Phase: **ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract**
Status: **DEPLOYED / FROZEN**
Issue: #449 — CLOSED / completed
Delivery: PR #450 — squash merged

Single parent: `06b879f8a2af66f2dce4c02fa8d1bfe749e213c3` — DOC47 documentation canonical.

Canonical tree: `3a9bd3527833b866a43a60c5e2da3981a217cb45`.''',
    "continuity current canonical",
)
continuity = replace_once(
    continuity,
    '- DOC47 — J8I closure & J8J Score Attack terminal-completion disposition activation: Issue #447, branch `docs/es-13-j8i-closure-j8j-terminal-completion-disposition`, documentation-only closure in progress from gameplay canonical `9ccec58c5454e25e33cf58d2b4bf6030424f475d`.',
    '- DOC47 — J8I closure & J8J Score Attack terminal-completion disposition activation: `06b879f8a2af66f2dce4c02fa8d1bfe749e213c3` — Issue #447 / PR #448.\n- DOC48 — J8J closure & J8K Score Attack effective-runtime projection isolation activation: Issue #451, branch `docs/es-13-j8j-closure-j8k-runtime-projection-isolation`, documentation-only closure in progress from gameplay canonical `801b09c7ab74db18a3765db4538b8d3b23588062`.',
    "continuity DOC47/DOC48 lineage",
)
continuity = sub_once(
    continuity,
    r"\n## Next gameplay phase\n\n### ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract\n.*?(?=\n## Resolved diagnostics)",
    '''
## J8J result
J8J froze the pure terminal-completion disposition needed before live Score Attack adoption. It validates frozen J8H/J8I facts, delegates completion truth to existing `isRuntimeWaveComplete(...)`, and projects `END_SCORE_ATTACK_ATTEMPT` with `advanceInfiniteRuntime: false` only when the canonical 60000 ms TIMEBOX is complete. Nested runtime identity remains `INFINITE`; no session, cache, UI or persistence mutation was added.

## J8J exact evidence
- DOC47 baseline `06b879f8a2af66f2dce4c02fa8d1bfe749e213c3`;
- pre-PR SHA `c8c64c66603bc230a67c818a05fe87c9c6f184bc`, run `38949844968`, certify `117138168359` + Android `117138168740` GREEN;
- final PR #450 head `8d867f22a2e40f0140fd4b935b2a712b5db1d090`;
- PR CI `38950093548` / `117139004853` GREEN;
- PR Android `38950093511` / `117139004731` GREEN including APK build/verify/upload;
- canonical `801b09c7ab74db18a3765db4538b8d3b23588062`, single parent `06b879f8a2af66f2dce4c02fa8d1bfe749e213c3`, tree `3a9bd3527833b866a43a60c5e2da3981a217cb45`, exact diff three certified files;
- main CI `38950330832` / `117139808091` GREEN;
- main Android `38950330639` / `117139806867` GREEN including APK build/verify/upload;
- Pages `38950451599`: build `117140202743` + deploy `117140357609` GREEN.

Issue #449 CLOSED / completed. J8J is **DEPLOYED / FROZEN**.

## Next gameplay phase

### ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract
Status: **NEXT CONTRACT TARGET AFTER DOC48 CLOSURE**

Discovery shows the generic runtime projection cache is not yet a safe Score Attack seam because it always receives `swarm.length` and applies Adaptive Invasion before J6/J7. Adaptive Invasion changes spawn/pressure/fairness from live follower count, conflicting with J8G's fixed versioned recipe and J8I's exact descriptor preservation.

J8K must therefore own only a pure Score Attack projection-composition boundary. It consumes a valid J8H envelope and derives J8I from the exact canonical base descriptor; the J8I descriptor remains the effective descriptor. Adaptive Invasion is explicitly bypassed. Existing J6/J7 seams may only be used as compatibility checks and must remain null/unchanged for canonical Sector 11 / Wave 1. Existing pure combat-pressure, mutator-effect, enemy-budget and milestone projectors may derive bundle facts from that effective descriptor. No runtime cache write, React/start/result/HUD adoption, timer/clock, J8J terminal authority, persistence/archive/record, progression, spawn/arena/entity/cap/FOTON/formation mutation is allowed.
''',
    "continuity J8J closure/J8K activation",
)
continuity = sub_once(
    continuity,
    r"Suggested handoff:\n> Continue ORBI Energy Swarm autonomously\..*?(?=\n\n## Update obligation)",
    '''Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8J gameplay canonical is `801b09c7ab74db18a3765db4538b8d3b23588062`, fully DEPLOYED / FROZEN via Issue #449 / PR #450 with terminal `END_SCORE_ATTACK_ATTEMPT`, `advanceInfiniteRuntime: false`, nested INFINITE preservation and post-main CI/Android/Pages GREEN. Complete DOC48 if still open, then implement J8K as a pure Score Attack effective runtime projection bundle / overlay-isolation contract: derive J8I from canonical J8H, keep J8I descriptor exact, bypass Adaptive Invasion, require J6/J7 null/unchanged on Sector 11 Wave 1, derive existing pressure/mutator/budget/milestone projections only, and do not write cache/React/timer/persistence. Preserve Campaign/Infinite, caps/budgets, FOTON/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.''',
    "continuity handoff",
)
CONTINUITY.write_text(continuity)

# Final preservation assertions.
for required in ("#4", "#5", "#202", "#248"):
    if required not in LEDGER.read_text():
        raise SystemExit(f"ledger blocker missing: {required}")
for required in ("#254", "#283"):
    if required not in CONTINUITY.read_text():
        raise SystemExit(f"continuity diagnostic missing: {required}")
for required in ("## J9 — Boss & Miniboss Expansion", "## J15", "ES-14"):
    if required not in ROADMAP.read_text():
        raise SystemExit(f"roadmap marker missing: {required}")
