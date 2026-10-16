from pathlib import Path
import re

ROADMAP = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
LEDGER = Path("docs/IMPLEMENTATION_LEDGER.md")
CONTINUITY = Path("docs/PROJECT_CONTINUITY.md")

J8I = "9ccec58c5454e25e33cf58d2b4bf6030424f475d"
J8I_PARENT = "12efb3029cf54581c81bad5a2fc629332f7be6c4"
J8I_TREE = "48e3f69e1d112ddc4843df7d83515cf752a23b36"


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


# ROADMAP — close J8I and activate J8J while preserving J9+ exactly.
roadmap = ROADMAP.read_text()
j9_marker = "## J9 — Boss & Miniboss Expansion"
j9_tail = roadmap[roadmap.index(j9_marker):]
roadmap = sub_once(
    roadmap,
    r"### ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract\n.*?(?=\n## J9 — Boss & Miniboss Expansion)",
    '''### ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract
Status: **DEPLOYED / FROZEN**
Canonical: `9ccec58c5454e25e33cf58d2b4bf6030424f475d`  
Issue #445 / PR #446

J8I freezes the pure/fail-closed descriptor-completion bridge needed before live Score Attack adoption:
- consumes a valid frozen J8H bootstrap envelope plus its exact canonical current fresh Infinite descriptor;
- rejects absent, mismatched, mutated or already-overlaid facts;
- requires base `BUDGET_AND_CLEAR` completion;
- returns immutable projection metadata and an immutable descriptor copy;
- the only descriptor-semantic change is `completionPolicy -> TIMEBOX / 60000 ms`, reusing frozen J8C/J8H duration facts;
- preserves descriptor identity, runtime source mode, sector/wave/waveCount, display, biome, spawn, modifiers, pressure, rewards, milestone, fairness and source facts exactly;
- outer `SCORE_ATTACK` attribution remains outside `RuntimeProgressionState`;
- exactly one positive authority: descriptor-completion overlay projection;
- no cache/live integration, React/UI/start flow, timer/clock/cursor, session progression, persistence/archive, score/economy or spawn authority.

Exact deployment anchors:
- pre-PR SHA `9fb290186ad56c3c4321eb69c51c37b3c8653ac1`, run `38945640439`, certify `117123936029` + Android `117123936267` GREEN;
- clean PR #446 head `6c07e4e0119c05255f37c0752f8aa4db8f5b2b3a`;
- the initial native PR hook was delayed/missed; closing/reopening the same unchanged PR recovered the native checks without code/base/head changes;
- PR CI `38945992045` / `117125131570` GREEN; Android `38945992000` / `117125131449` GREEN;
- canonical `9ccec58c5454e25e33cf58d2b4bf6030424f475d`, parent `12efb3029cf54581c81bad5a2fc629332f7be6c4`, tree `48e3f69e1d112ddc4843df7d83515cf752a23b36`, exact diff three certified files;
- main CI `38946233419` / `117125924994` GREEN; Android `38946233414` / `117125924762` GREEN;
- Pages `38946322607`, build `117126231280` + deploy `117126371840` GREEN.

### ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract
Status: **NEXT CONTRACT TARGET AFTER DOC47 CLOSURE**

Discovery after J8I shows that a correct `TIMEBOX / 60000 ms` descriptor is still insufficient for live adoption. Existing `isRuntimeWaveComplete(...)` only decides completion, while `EnergySwarmGame` treats every completed nested `INFINITE` runtime as progression and calls `advanceInfiniteRuntimeState(...)`. Because J8H intentionally preserves nested runtime mode `INFINITE`, an unguarded live Score Attack would advance to the next Infinite wave when its 60-second timebox expires instead of ending the attempt.

J8J must freeze only a pure terminal-completion disposition. It must consume a valid J8H bootstrap envelope, a valid J8I completion overlay and a completion snapshot evaluated through existing `isRuntimeWaveComplete(...)` authority. Only canonical matching `SCORE_ATTACK` + exact `TIMEBOX / 60000 ms` + completed facts may project an immutable terminal action such as `END_SCORE_ATTACK_ATTEMPT`, with `advanceInfiniteRuntime: false`. Incomplete, mismatched or unsupported facts fail closed.

J8J must preserve nested runtime discriminator `INFINITE` and must not mutate/end the session, call Infinite advancement, change `EnergySwarmGame`, transition UI/results, integrate cache/live state, write persistence/records, or own timer/clock/cursor, score/economy, spawn/arena/entity/cap/FOTON/formation authority. It decides terminal disposition only; the later live mutation sequence remains unresolved.
''',
    "roadmap J8I closure/J8J activation",
)
if roadmap[roadmap.index(j9_marker):] != j9_tail:
    raise SystemExit("roadmap J9+ preservation failed")
ROADMAP.write_text(roadmap)

# LEDGER — add J8I milestone, close DOC46 lineage, activate DOC47, record evidence.
ledger = LEDGER.read_text()
ledger = replace_once(
    ledger,
    '| ES-13J8H — Pure Score Attack Bootstrap Envelope Contract | DEPLOYED / FROZEN | `8ed798beaa688f73ab8513c0e7ecb9bd112a2824` | #440 | #442 |',
    '| ES-13J8H — Pure Score Attack Bootstrap Envelope Contract | DEPLOYED / FROZEN | `8ed798beaa688f73ab8513c0e7ecb9bd112a2824` | #440 | #442 |\n| ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract | DEPLOYED / FROZEN | `9ccec58c5454e25e33cf58d2b4bf6030424f475d` | #445 | #446 |',
    "ledger J8I milestone row",
)
ledger = replace_once(
    ledger,
    '- DOC46 — J8H closure & J8I Score Attack descriptor-completion overlay activation: Issue #443, branch `docs/es-13-j8h-closure-j8i-descriptor-completion-overlay`, documentation-only closure in progress from gameplay canonical `8ed798beaa688f73ab8513c0e7ecb9bd112a2824`.',
    '- DOC46 — J8H closure & J8I Score Attack descriptor-completion overlay activation: `12efb3029cf54581c81bad5a2fc629332f7be6c4` — Issue #443 / PR #444.\n- DOC47 — J8I closure & J8J Score Attack terminal-completion disposition activation: Issue #447, branch `docs/es-13-j8i-closure-j8j-terminal-completion-disposition`, documentation-only closure in progress from gameplay canonical `9ccec58c5454e25e33cf58d2b4bf6030424f475d`.',
    "ledger DOC46/DOC47 lineage",
)
ledger = sub_once(
    ledger,
    r"\n## Next planned gameplay\n\n### ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)",
    '''
### J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract
- Validates the exact canonical fresh descriptor from frozen J8H and fails closed on mismatched/mutated/already-overlaid facts.
- Requires source `BUDGET_AND_CLEAR` and changes only completion to `TIMEBOX / 60000 ms` while preserving all other descriptor semantics and nested references.
- Keeps `SCORE_ATTACK` outside `RuntimeProgressionState`; cache/live/UI/timer/persistence remain untouched.
- Pre-PR `9fb290186ad56c3c4321eb69c51c37b3c8653ac1`: run `38945640439`, certify `117123936029` + Android `117123936267` GREEN.
- PR #446 head `6c07e4e0119c05255f37c0752f8aa4db8f5b2b3a`: native hook delay recovered by close/reopen with unchanged code/base/head; CI `38945992045` / `117125131570` + Android `38945992000` / `117125131449` GREEN.
- Canonical `9ccec58c5454e25e33cf58d2b4bf6030424f475d`, parent `12efb3029cf54581c81bad5a2fc629332f7be6c4`, tree `48e3f69e1d112ddc4843df7d83515cf752a23b36`, exact diff three certified files.
- Main CI `38946233419` / `117125924994`, Android `38946233414` / `117125924762`, Pages `38946322607` build `117126231280` + deploy `117126371840` GREEN.

## Next planned gameplay

### ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract
Status: **NEXT CONTRACT TARGET AFTER DOC47 CLOSURE**.

J8J must consume valid frozen J8H + J8I facts and delegate completion evaluation to existing `isRuntimeWaveComplete(...)`. Only a completed canonical `SCORE_ATTACK` `TIMEBOX / 60000 ms` attempt may project a terminal action such as `END_SCORE_ATTACK_ATTEMPT` with `advanceInfiniteRuntime: false`; incomplete or mismatched facts fail closed. It must not mutate/end sessions, call Infinite advancement, change the game loop/UI, integrate cache/live state, write persistence, or own timer/clock/cursor.''',
    "ledger J8I evidence/J8J next",
)
LEDGER.write_text(ledger)

# CONTINUITY — advance certified gameplay canonical and next contract.
continuity = CONTINUITY.read_text()
continuity = sub_once(
    continuity,
    r"## Current certified gameplay canonical\n\n`8ed798beaa688f73ab8513c0e7ecb9bd112a2824`\n\nPhase: \*\*ES-13J8H — Pure Score Attack Bootstrap Envelope Contract\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #440 — CLOSED / completed\nDelivery: PR #442 — squash merged\n\nSingle parent: `0557f91982534248765f2a5f7e5a2648f99ba58a` — DOC45 documentation canonical\.\n\nCanonical tree: `cf3b70ab9d6e0afd06dd9c552146934b094356ca`\.",
    '''## Current certified gameplay canonical

`9ccec58c5454e25e33cf58d2b4bf6030424f475d`

Phase: **ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract**
Status: **DEPLOYED / FROZEN**
Issue: #445 — CLOSED / completed
Delivery: PR #446 — squash merged

Single parent: `12efb3029cf54581c81bad5a2fc629332f7be6c4` — DOC46 documentation canonical.

Canonical tree: `48e3f69e1d112ddc4843df7d83515cf752a23b36`.''',
    "continuity current canonical",
)
continuity = replace_once(
    continuity,
    '- DOC46 — J8H closure & J8I Score Attack descriptor-completion overlay activation: Issue #443, branch `docs/es-13-j8h-closure-j8i-descriptor-completion-overlay`, documentation-only closure in progress from gameplay canonical `8ed798beaa688f73ab8513c0e7ecb9bd112a2824`.',
    '- DOC46 — J8H closure & J8I Score Attack descriptor-completion overlay activation: `12efb3029cf54581c81bad5a2fc629332f7be6c4` — Issue #443 / PR #444.\n- DOC47 — J8I closure & J8J Score Attack terminal-completion disposition activation: Issue #447, branch `docs/es-13-j8i-closure-j8j-terminal-completion-disposition`, documentation-only closure in progress from gameplay canonical `9ccec58c5454e25e33cf58d2b4bf6030424f475d`.',
    "continuity DOC46/DOC47 lineage",
)
continuity = sub_once(
    continuity,
    r"\n## Next gameplay phase\n\n### ES-13J8I — Pure Score Attack Runtime Descriptor Completion Overlay Contract\n.*?(?=\n## Resolved diagnostics)",
    '''
## J8I result
J8I froze the pure/fail-closed runtime-descriptor completion overlay required before live Score Attack adoption. It consumes J8H plus the exact canonical fresh Infinite descriptor, rejects altered facts, requires source `BUDGET_AND_CLEAR`, and projects only `TIMEBOX / 60000 ms` while preserving every other descriptor semantic. Score Attack identity remains outside the runtime discriminator; cache/live/UI/timer/persistence remain untouched.

## J8I exact evidence
- DOC46 baseline `12efb3029cf54581c81bad5a2fc629332f7be6c4`;
- pre-PR SHA `9fb290186ad56c3c4321eb69c51c37b3c8653ac1`, run `38945640439`, certify `117123936029` + Android `117123936267` GREEN;
- final PR #446 head `6c07e4e0119c05255f37c0752f8aa4db8f5b2b3a`;
- initial native PR hook was delayed/missed; closing/reopening the same unchanged PR recovered native checks without code/base/head changes;
- PR CI `38945992045` / `117125131570` GREEN;
- PR Android `38945992000` / `117125131449` GREEN including APK build/verify/upload;
- canonical `9ccec58c5454e25e33cf58d2b4bf6030424f475d`, single parent `12efb3029cf54581c81bad5a2fc629332f7be6c4`, tree `48e3f69e1d112ddc4843df7d83515cf752a23b36`, exact diff three certified product/test files;
- main CI `38946233419` / `117125924994` GREEN;
- main Android `38946233414` / `117125924762` GREEN including APK build/verify/upload;
- Pages `38946322607`: build `117126231280` + deploy `117126371840` GREEN.

Issue #445 CLOSED / completed. J8I is **DEPLOYED / FROZEN**.

## Next gameplay phase

### ES-13J8J — Pure Score Attack Terminal Completion Disposition Contract
Status: **NEXT CONTRACT TARGET AFTER DOC47 CLOSURE**

Discovery shows J8I can correctly make the descriptor `TIMEBOX / 60000 ms`, but current live completion handling still treats every completed nested `INFINITE` runtime as progression and calls `advanceInfiniteRuntimeState(...)`. Because J8H intentionally keeps nested runtime mode `INFINITE`, Score Attack requires a separate terminal-disposition decision before live adoption.

J8J must consume J8H + J8I plus a completion snapshot, delegate completion detection to existing `isRuntimeWaveComplete(...)`, and project an immutable terminal disposition only when canonical matching Score Attack TIMEBOX facts are complete. The terminal projection must explicitly prevent Infinite advancement (`advanceInfiniteRuntime: false`) while preserving the nested `INFINITE` discriminator. No session mutation/end call, game-loop/UI/result/cache integration, persistence/record write, timer/clock/cursor, score/economy, spawn/arena/entity/cap/FOTON/formation authority is allowed.
''',
    "continuity J8I closure/J8J activation",
)
continuity = sub_once(
    continuity,
    r"Suggested handoff:\n> Continue ORBI Energy Swarm autonomously\..*?(?=\n\n## Update obligation)",
    '''Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8I gameplay canonical is `9ccec58c5454e25e33cf58d2b4bf6030424f475d`, fully DEPLOYED / FROZEN via Issue #445 / PR #446 with exact fresh-descriptor validation and pure BUDGET_AND_CLEAR → TIMEBOX 60000 overlay, plus post-main CI/Android/Pages GREEN. Complete DOC47 if still open, then implement J8J as a pure terminal-completion disposition contract: consume J8H + J8I + completion snapshot, delegate to existing isRuntimeWaveComplete, project END_SCORE_ATTACK_ATTEMPT with advanceInfiniteRuntime false only when canonical TIMEBOX 60000 facts complete, and do not mutate session/game loop/UI/cache/persistence yet. Preserve Campaign/Infinite, caps/budgets, FOTON/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.''',
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
