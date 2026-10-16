from pathlib import Path
import re

ROADMAP = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
LEDGER = Path("docs/IMPLEMENTATION_LEDGER.md")
CONTINUITY = Path("docs/PROJECT_CONTINUITY.md")

J8N = "d0e9af1c3c8f94524187f7d8ee48c975e2bd9f3e"
J8N_PARENT = "41da66dac942accb714899f189fce86dc24d1d79"
J8N_TREE = "cb8587b7a3c584a4516e0e5f49be9129e11d9d6f"


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


# ROADMAP — close J8N, activate engine-only J8O and preserve J9+ byte-for-byte.
roadmap = ROADMAP.read_text()
j9_marker = "## J9 — Boss & Miniboss Expansion"
if j9_marker not in roadmap:
    raise SystemExit("roadmap J9 marker missing")
j9_tail = roadmap[roadmap.index(j9_marker):]
roadmap = sub_once(
    roadmap,
    r"### ES-13J8N — Pure Dedicated Score Attack Stats-Commit Application Contract\n.*?(?=\n## J9 — Boss & Miniboss Expansion)",
    '''### ES-13J8N — Pure Dedicated Score Attack Stats-Commit Application Contract
Status: **DEPLOYED / FROZEN**
Canonical: `d0e9af1c3c8f94524187f7d8ee48c975e2bd9f3e`  
Issue #465 / PR #466

J8N freezes the dedicated Score Attack GameStats application boundary required before live integration:
- consumes one valid frozen J8M finalization plan plus existing GameStats;
- stale `scoreAttackBestScore` facts fail closed;
- NEW_BEST changes only `scoreAttackBestScore`;
- TIED_BEST / BELOW_BEST produce exact semantic no-ops;
- global `highScore`, generic run persistence/archive/counters, Campaign/Infinite records and every unrelated GameStats field remain isolated;
- no storage I/O, React/UI, runtime/session/timer or gameplay authority.

J8N certification caught and corrected one real no-op normalization bug before PR. Final anchors:
- initial pre-PR run `38969412380` exposed the issue before PR;
- isolated diagnostic v2 `38969724953` / `117204857053` passed all five properties after correction;
- final pre-PR SHA `71a00a5f756c9dd865932763d8e92c96536facbe`, run `38969868757`, certify `117205320392` + Android `117205320719` GREEN;
- clean PR #466 head `fdb3575add29d632ffc020cbfadee7615fae6496`;
- PR CI `38970083272` / `117206023607` GREEN; Android `38970083435` / `117206024349` GREEN;
- canonical `d0e9af1c3c8f94524187f7d8ee48c975e2bd9f3e`, parent `41da66dac942accb714899f189fce86dc24d1d79`, tree `cb8587b7a3c584a4516e0e5f49be9129e11d9d6f`, exact diff three certified files;
- main CI `38970263772` / `117206620329` GREEN; Android `38970263775` / `117206620338` GREEN;
- Pages `38970380507`, build `117207004493` + deploy `117207154206` GREEN.

### ES-13J8O — Controlled Live Score Attack Engine Lifecycle Adoption
Status: **NEXT CONTRACT TARGET AFTER DOC52 CLOSURE**

J8K→J8N completed the pure prerequisite chain before live adoption. J8L now supplies exact SCORE_ATTACK activation identity, fresh nested INFINITE runtime/session and an effective TIMEBOX / 60000 ms descriptor with generic cache/adaptive/dynamic/bonus adoption bypassed. J8M + J8N provide a terminal dedicated-record path without generic `applyFinalRunCommit(...)` semantics.

J8O must therefore adopt only the engine lifecycle core, not public UI. The existing engine start path may accept an internal mode with Campaign unchanged as default; SCORE_ATTACK must install the frozen J8L runtime plus one scalar activation-envelope ref. While active, descriptor/projection reads must use frozen J8L/J8K facts rather than the generic runtime projection cache. The existing timer remains authoritative and is initialized from TIMEBOX / 60000 ms. On terminal completion, J8O must intercept before generic Infinite advancement, compose J8M from the exact active envelope + completion snapshot + dedicated best + live candidate score, apply J8N, persist only a changed dedicated record through the existing `updateStatsAndSave(...)` seam, clear Score Attack activation identity and never advance Infinite progression.

J8O is **engine-only**: StartScreen remains Campaign-only with no public Score Attack button; ResultScreen/HUD/presentation stay deferred to the following slice. No new runtime discriminator, cache, timer/clock, score formula, reward/economy, generic highScore/archive/counter, spawn/arena/cap/budget/entity/projectile/FOTON/formation authority is allowed.
''',
    "roadmap J8N closure/J8O activation",
)
if roadmap[roadmap.index(j9_marker):] != j9_tail:
    raise SystemExit("roadmap J9+ preservation failed")
ROADMAP.write_text(roadmap)

# LEDGER — add J8N milestone and replace next target with exact evidence + J8O.
ledger = LEDGER.read_text()
ledger = replace_once(
    ledger,
    '| ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract | DEPLOYED / FROZEN | `9ec6a76bf34057881326530af9581e0eca1a0c74` | #461 | #462 |',
    '| ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract | DEPLOYED / FROZEN | `9ec6a76bf34057881326530af9581e0eca1a0c74` | #461 | #462 |\n| ES-13J8N — Pure Dedicated Score Attack Stats-Commit Application Contract | DEPLOYED / FROZEN | `d0e9af1c3c8f94524187f7d8ee48c975e2bd9f3e` | #465 | #466 |',
    "ledger J8N milestone row",
)
ledger = sub_once(
    ledger,
    r"\n## Next planned gameplay\n\n### ES-13J8N — Pure Dedicated Score Attack Stats-Commit Application Contract\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)",
    '''
### J8N — Pure Dedicated Score Attack Stats-Commit Application Contract
- Dedicated GameStats application over frozen J8M only; no storage I/O or generic run persistence.
- Stale dedicated-best facts fail closed; NEW_BEST changes only `scoreAttackBestScore`; TIED/BELOW are exact no-ops.
- Initial pre-PR `38969412380` caught the no-op normalization bug before PR; isolated diagnostic v2 `38969724953` / `117204857053` passed after correction.
- Final pre-PR `71a00a5f756c9dd865932763d8e92c96536facbe`: run `38969868757`, certify `117205320392` + Android `117205320719` GREEN.
- PR #466 head `fdb3575add29d632ffc020cbfadee7615fae6496`: CI `38970083272` / `117206023607` + Android `38970083435` / `117206024349` GREEN.
- Canonical `d0e9af1c3c8f94524187f7d8ee48c975e2bd9f3e`, parent `41da66dac942accb714899f189fce86dc24d1d79`, tree `cb8587b7a3c584a4516e0e5f49be9129e11d9d6f`, exact diff three certified files.
- Main CI `38970263772` / `117206620329`, Android `38970263775` / `117206620338`, Pages `38970380507` build `117207004493` + deploy `117207154206` GREEN.

## Next planned gameplay

### ES-13J8O — Controlled Live Score Attack Engine Lifecycle Adoption
Status: **NEXT CONTRACT TARGET AFTER DOC52 CLOSURE**.

J8O is the first controlled live slice after the pure J8K→J8N prerequisite chain. It must adopt J8L/J8M/J8N only inside the engine lifecycle: internal-mode start with Campaign unchanged by default, one scalar active Score Attack envelope, effective descriptor from frozen J8L/J8K, existing TIMEBOX timer only, terminal interception before generic Infinite advancement, dedicated-record persistence only through existing `updateStatsAndSave(...)` when J8N changes the record, and full activation cleanup on terminal/reset boundaries. StartScreen/ResultScreen/HUD remain out of scope and Score Attack is not publicly selectable yet.''',
    "ledger J8N evidence/J8O next",
)
LEDGER.write_text(ledger)

# CONTINUITY — current canonical J8N, exact evidence, J8O next and corrected handoff.
continuity = CONTINUITY.read_text()
continuity = sub_once(
    continuity,
    r"## Current certified gameplay canonical\n\n`9ec6a76bf34057881326530af9581e0eca1a0c74`\n\nPhase: \*\*ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #461 — CLOSED / completed\nDelivery: PR #462 — squash merged\n\nSingle parent: `25fed78cc7a6855a015d10538246490c914d6818` — DOC50 documentation canonical\.\n\nCanonical tree: `3fd28427b2997aaae3a5ea4b20bc4c1bfbd8e644`\.",
    '''## Current certified gameplay canonical

`d0e9af1c3c8f94524187f7d8ee48c975e2bd9f3e`

Phase: **ES-13J8N — Pure Dedicated Score Attack Stats-Commit Application Contract**
Status: **DEPLOYED / FROZEN**
Issue: #465 — CLOSED / completed
Delivery: PR #466 — squash merged

Single parent: `41da66dac942accb714899f189fce86dc24d1d79` — DOC51 documentation canonical.

Canonical tree: `cb8587b7a3c584a4516e0e5f49be9129e11d9d6f`.''',
    "continuity current J8N canonical",
)
continuity = sub_once(
    continuity,
    r"\n## Next gameplay phase\n\n### ES-13J8N — Pure Dedicated Score Attack Stats-Commit Application Contract\n.*?(?=\n## Resolved diagnostics)",
    '''
## J8N result
J8N froze the dedicated Score Attack GameStats application boundary over J8M. It fails closed on stale dedicated-best facts; NEW_BEST changes only `scoreAttackBestScore`; tied/below outcomes preserve stats semantically unchanged. Global highScore, generic persistence/archive/run counters, Campaign/Infinite records and unrelated settings remain isolated. J8N owns no storage, React/UI or runtime authority.

## J8N exact evidence
- DOC51 baseline `41da66dac942accb714899f189fce86dc24d1d79`;
- initial pre-PR run `38969412380` exposed a real no-op normalization bug before PR;
- isolated diagnostic v2 `38969724953` / `117204857053` passed all five properties after correction;
- final pre-PR SHA `71a00a5f756c9dd865932763d8e92c96536facbe`, run `38969868757`, certify `117205320392` + Android `117205320719` GREEN;
- final PR #466 head `fdb3575add29d632ffc020cbfadee7615fae6496`;
- PR CI `38970083272` / `117206023607` GREEN;
- PR Android `38970083435` / `117206024349` GREEN including APK build/verify/upload;
- canonical `d0e9af1c3c8f94524187f7d8ee48c975e2bd9f3e`, single parent `41da66dac942accb714899f189fce86dc24d1d79`, tree `cb8587b7a3c584a4516e0e5f49be9129e11d9d6f`, exact diff three certified files;
- main CI `38970263772` / `117206620329` GREEN;
- main Android `38970263775` / `117206620338` GREEN including APK build/verify/upload;
- Pages `38970380507`: build `117207004493` + deploy `117207154206` GREEN.

Issue #465 CLOSED / completed. J8N is **DEPLOYED / FROZEN**.

## Next gameplay phase

### ES-13J8O — Controlled Live Score Attack Engine Lifecycle Adoption
Status: **NEXT CONTRACT TARGET AFTER DOC52 CLOSURE**

The pure prerequisite chain is now complete. J8O must adopt Score Attack only inside `EnergySwarmGame` lifecycle seams: Campaign remains the default start path; one scalar J8L activation envelope identifies an internal Score Attack attempt; effective runtime descriptor/projection comes from frozen J8L/J8K rather than the generic cache; the existing TIMEBOX timer uses 60000 ms; terminal completion is intercepted before Infinite advancement; J8M composes finalization facts and J8N applies the dedicated record; storage is updated only through the existing `updateStatsAndSave(...)` seam when the record actually changes. The activation ref is cleared at reset/terminal boundaries.

This phase remains engine-only. StartScreen stays Campaign-only with no Score Attack button, and ResultScreen/HUD/presentation remain deferred. No new runtime discriminator/cache/timer, generic highScore/archive/counter semantics, score formula/economy, spawn/arena/cap/budget/entity/projectile/FOTON/formation authority may be introduced.
''',
    "continuity J8N closure/J8O activation",
)
continuity = sub_once(
    continuity,
    r"Suggested handoff:\n> Continue ORBI Energy Swarm autonomously\..*?(?=\n\n## Update obligation)",
    '''Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8N gameplay canonical is `d0e9af1c3c8f94524187f7d8ee48c975e2bd9f3e`, fully DEPLOYED / FROZEN via Issue #465 / PR #466; dedicated Score Attack stats application is frozen with stale-plan fail-closed semantics and post-main CI/Android/Pages GREEN. Complete DOC52 if still open, then implement J8O as the first controlled live Score Attack engine-lifecycle adoption: internal-mode start with Campaign unchanged by default, install exact J8L runtime/envelope, source effective descriptor from J8L/J8K, reuse the existing 60000 ms TIMEBOX timer, intercept terminal completion before Infinite advancement, compose J8M, apply J8N and persist only changed dedicated record through `updateStatsAndSave(...)`. Keep StartScreen/ResultScreen/HUD out of scope and no public Score Attack button yet. Preserve Campaign/Infinite, caps/budgets, FOTON/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.''',
    "continuity recovery handoff",
)
CONTINUITY.write_text(continuity)

# Final preservation assertions.
for path in (ROADMAP, LEDGER, CONTINUITY):
    text = path.read_text()
    for required in ("#4", "#5", "#202", "#248"):
        if required not in text and path != ROADMAP:
            raise SystemExit(f"{path}: blocker marker missing {required}")
for required in ("## J9 — Boss & Miniboss Expansion", "## J15", "ES-14"):
    if required not in ROADMAP.read_text():
        raise SystemExit(f"roadmap marker missing: {required}")
for required in ("#254", "#283"):
    if required not in CONTINUITY.read_text():
        raise SystemExit(f"continuity diagnostic marker missing: {required}")
