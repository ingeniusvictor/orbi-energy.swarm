from pathlib import Path
import re

CANON = "d6277d4162c23f9b3edbbd69ccac8424b90d99ee"
PARENT = "b283a61b26a8491888ff251d3ee55006b5872806"
TREE = "b214a876b3c5f5945b52adc524965de86da930cb"
BRANCH = "docs/es-13-j8b-closure-j8c-duration"


def replace_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"DOC40 fail-closed: expected exactly one {label} anchor, got {count}")
    return updated

# PROJECT_CONTINUITY.md
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
s = replace_once(
    s,
    r"## Current certified gameplay canonical\n\n`[^`]+`\n\nPhase: \*\*[^\n]+\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #[0-9]+ — CLOSED / completed\nDelivery: PR #[0-9]+ — squash merged\n\nSingle parent: `[^`]+` — DOC[0-9]+ documentation canonical\.\n\nCanonical tree: `[^`]+`\.",
    f"""## Current certified gameplay canonical

`{CANON}`

Phase: **ES-13J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract**
Status: **DEPLOYED / FROZEN**
Issue: #416 — CLOSED / completed
Delivery: PR #417 — squash merged

Single parent: `{PARENT}` — DOC39 documentation canonical.

Canonical tree: `{TREE}`.""",
    "continuity current canonical",
)
s = replace_once(
    s,
    r"- DOC39 — J8A closure & J8B execution-substrate discovery activation: Issue #414, branch `docs/es-13-j8a-closure-j8b-substrate`, documentation-only closure in progress from gameplay canonical `4a78c942a3ebdb509f67185d6799b0724ac27238`\.",
    f"- DOC39 — J8A closure & J8B execution-substrate discovery activation: `{PARENT}` — Issue #414 / PR #415.\n- DOC40 — J8B closure & J8C Score Attack duration/TIMEBOX projection activation: Issue #418, branch `{BRANCH}`, documentation-only closure in progress from gameplay canonical `{CANON}`.",
    "continuity DOC39/DOC40 chronology",
)
next_anchor = "## Next gameplay phase"
j8b = f"""## J8B result
J8B froze the pure execution-substrate/lifecycle compatibility contract required before Score Attack duration, persistence, UI or live adoption.

Certified contract:
- consumes frozen J8A `SCORE_ATTACK` profile rather than duplicating mode identity;
- immutable contract mode `COMPATIBILITY_ONLY`;
- compatible execution substrate `INFINITE_SESSION`;
- compatible runtime progression remains existing `INFINITE`;
- canonical fresh compatibility facts are sector 11, wave 1, zero completed sectors/waves and `ACTIVE`;
- Campaign victory checkpoint is explicitly not required by the substrate compatibility contract;
- existing Infinite advancement and runtime descriptor pipeline are reused rather than copied or replaced;
- Score Attack identity stays outside `RuntimeProgressionState`; no third runtime discriminator is introduced;
- resolver consumes and validates an existing fresh Infinite session and does not create, seed, advance or live-adopt it;
- unsupported ids, advanced sessions and inactive sessions fail closed;
- only positive authority is execution-substrate compatibility.

Final product scope exactly:
- `src/game/scoreAttackExecutionSubstrateContract.ts`;
- `tests/es-13j8b-score-attack-execution-substrate.test.mjs`;
- `tests/gameplay/score-attack-execution-substrate.test.ts`.

## J8B exact evidence
- DOC39 baseline `{PARENT}`;
- pre-PR SHA `e0de848e31b25e5cec7617f5b040ca09be8370a6`, run `38907084776`, certify `116993249057` + Android `116993248957` GREEN;
- final PR #417 head `7df7351b9f07830e5f5a808037c6b98e924ed002`;
- PR CI `38907309802` / `116994022888` GREEN;
- PR Android `38907309276` / `116994021442` GREEN including Build/Verify/Upload APK;
- canonical `{CANON}`, single parent `{PARENT}`, tree `{TREE}`;
- canonical diff exactly three certified product/test files;
- main CI `38907541228` / `116994816999` GREEN;
- main Android `38907541135` / `116994817103` GREEN including Build/Verify/Upload APK;
- Pages `38907624340`: build `116995103030` + deploy `116995284394` GREEN.

Issue #416 CLOSED / completed. J8B is **DEPLOYED / FROZEN**.

"""
if "## J8B result" not in s:
    if next_anchor not in s:
        raise SystemExit("DOC40 fail-closed: next gameplay anchor missing")
    s = s.replace(next_anchor, j8b + next_anchor, 1)
s = replace_once(
    s,
    r"## Next gameplay phase\n\n### ES-13J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract\nStatus: \*\*NEXT DISCOVERY / CONTRACT TARGET AFTER DOC39 CLOSURE\*\*\n.*?(?=\n## Resolved diagnostics)",
    """## Next gameplay phase

### ES-13J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract
Status: **NEXT CONTRACT TARGET AFTER DOC40 CLOSURE**

J8A profile semantics and J8B execution-substrate compatibility are frozen. J8C must remain pure and freeze exactly one Score Attack duration/completion metadata projection without adopting the mode live.

Required contract:
- canonical `SCORE_ATTACK` only;
- exact duration `60000 ms`;
- immutable projection `{ type: "TIMEBOX", durationMs: 60000 }`;
- consume frozen J8A + J8B authorities instead of duplicating them;
- fail closed for unsupported mode ids or incompatible substrate facts;
- `60000 ms` reuses an already-existing normal Campaign TIMEBOX value (Sector 9) and remains independent from J7 Timed Survival's frozen `30000 ms` bonus-challenge authority;
- existing `shouldTickRuntimeTimer(...)` / `isRuntimeWaveComplete(...)` remain the sole live timer/completion execution authorities.

J8C must not mutate a live descriptor, create/tick/reset a timer, construct a live session, select seed/replay policy, change StartScreen/ResultScreen/HUD, add dedicated persistence/high-score/archive semantics, mutate score formula/rewards/economy, change spawn/arena/combat, scan collections, alter caps/budgets, entities/projectiles, FOTON or formations. Dedicated Score Attack persistence remains a later contract; live start/UI adoption remains later still.
""",
    "continuity next J8C",
)
s = replace_once(
    s,
    r"> Continue ORBI Energy Swarm autonomously\..*?Never touch `main` directly or weaken tests\.",
    f"> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8B gameplay canonical is `{CANON}`, fully DEPLOYED / FROZEN via Issue #416 / PR #417 with pure SCORE_ATTACK → INFINITE_SESSION compatibility and post-main CI/Android/Pages GREEN. Complete DOC40 if still open, then implement J8C as a pure exact `60000 ms` TIMEBOX metadata projection consuming frozen J8A/J8B before any Score Attack persistence, UI or live adoption. Reuse existing timer/completion authorities and do not create a third runtime discriminator or mode-specific engine fork. Preserve caps/budgets, Campaign/Infinite isolation, FOTON GLB/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.",
    "continuity handoff",
)
p.write_text(s)

# IMPLEMENTATION_LEDGER.md
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
row = f"| ES-13J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract | DEPLOYED / FROZEN | `{CANON}` | #416 | #417 |"
if row not in s:
    anchor = "| ES-13J8A — Pure Score Attack Mode Profile Contract | DEPLOYED / FROZEN | `4a78c942a3ebdb509f67185d6799b0724ac27238` | #412 | #413 |"
    if anchor not in s:
        raise SystemExit("DOC40 fail-closed: J8A ledger row missing")
    s = s.replace(anchor, anchor + "\n" + row, 1)
s = replace_once(
    s,
    r"- DOC39 — J8A closure & J8B execution-substrate discovery activation: Issue #414, branch `docs/es-13-j8a-closure-j8b-substrate`, in progress from gameplay canonical `4a78c942a3ebdb509f67185d6799b0724ac27238`\.",
    f"- DOC39 — J8A closure & J8B execution-substrate discovery activation: `{PARENT}` — Issue #414 / PR #415.\n- DOC40 — J8B closure & J8C Score Attack duration/TIMEBOX projection activation: Issue #418, branch `{BRANCH}`, in progress from gameplay canonical `{CANON}`.",
    "ledger DOC39/DOC40 chronology",
)
blocker = "## Frozen manual/physical blockers"
j8b_ledger = f"""### J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract
- Consumes frozen J8A `SCORE_ATTACK`; mode `COMPATIBILITY_ONLY`.
- Compatible substrate `INFINITE_SESSION`; runtime progression compatibility remains `INFINITE`.
- Fresh facts sector 11 / wave 1 / zero completed sectors+waves / ACTIVE are required; unsupported, advanced or inactive inputs fail closed.
- Campaign victory checkpoint is not required by the substrate contract; existing Infinite advancement + descriptor pipeline remain authoritative.
- Score Attack stays outside `RuntimeProgressionState`; no third discriminator or live session construction/adoption.
- Only positive authority is execution-substrate compatibility.
- Pre-PR `e0de848e31b25e5cec7617f5b040ca09be8370a6`, run `38907084776`, certify `116993249057` + Android `116993248957` GREEN.
- Final PR #417 head `7df7351b9f07830e5f5a808037c6b98e924ed002`; PR CI `38907309802` / `116994022888` GREEN; PR Android `38907309276` / `116994021442` GREEN.
- Canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`, exact diff three product/test files.
- Main CI `38907541228` / `116994816999` GREEN; Android `38907541135` / `116994817103` GREEN; Pages `38907624340`, build `116995103030` + deploy `116995284394` GREEN.
- No live descriptor/session mutation, timer/clock/pause, seed policy, UI, persistence/storage, score formula/reward/economy, spawn/arena, scan/index, cap/budget, entity/projectile, FOTON or formation authority.

"""
if "### J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract" not in s:
    if blocker not in s:
        raise SystemExit("DOC40 fail-closed: blocker anchor missing")
    s = s.replace(blocker, j8b_ledger + blocker, 1)
s = replace_once(
    s,
    r"## Next planned gameplay\n\n### ES-13J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract\nStatus: \*\*NEXT DISCOVERY / CONTRACT TARGET AFTER DOC39 CLOSURE\*\*\.\n\n.*?(?=\nJ4D\+ additional tactical families remain deferred)",
    """## Next planned gameplay

### ES-13J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract
Status: **NEXT CONTRACT TARGET AFTER DOC40 CLOSURE**.

J8C must consume frozen J8A profile + J8B substrate compatibility and project exact `60000 ms` / `{ type: "TIMEBOX", durationMs: 60000 }` metadata only. It must reuse current runtime completion/timer semantics, fail closed on unsupported/incompatible facts, and remain independent from J7 Timed Survival's `30000 ms` authority. No live descriptor mutation, timer creation/ticking/reset, seed/replay, UI, dedicated persistence/high-score/archive, score formula, rewards/economy, spawn/arena, scans/indexes, caps/budgets, entities/projectiles or formation authority.

""",
    "ledger next J8C",
)
p.write_text(s)

# ES13_GAMEPLAY_ROADMAP.md
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
s = p.read_text()
s = replace_once(
    s,
    r"### ES-13J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract\nStatus: \*\*NEXT DISCOVERY / CONTRACT TARGET AFTER DOC39 CLOSURE\*\*\n\n.*?(?=\n---\n\n## J9)",
    f"""### ES-13J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract
Status: **DEPLOYED / FROZEN**
Canonical: `{CANON}`  
Issue #416 / PR #417

J8B freezes compatibility with the existing execution core without live adoption:
- frozen J8A `SCORE_ATTACK` identity is consumed;
- mode `COMPATIBILITY_ONLY`;
- execution substrate `INFINITE_SESSION`;
- runtime progression compatibility remains existing `INFINITE`;
- canonical fresh facts sector 11 / wave 1 / zero completed sectors+waves / ACTIVE;
- Campaign victory checkpoint is not required by this compatibility contract;
- existing Infinite advancement + descriptor/runtime projection pipeline remain authoritative;
- Score Attack remains outside `RuntimeProgressionState`; no third discriminator;
- no session construction/seed/advance/live adoption;
- only execution-substrate compatibility authority is positive.

Exact deployment anchors:
- pre-PR `e0de848e31b25e5cec7617f5b040ca09be8370a6`, run `38907084776`, certify `116993249057` + Android `116993248957` GREEN;
- final PR #417 head `7df7351b9f07830e5f5a808037c6b98e924ed002`;
- PR CI `38907309802` / `116994022888` GREEN; Android `38907309276` / `116994021442` GREEN;
- canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`;
- main CI `38907541228` / `116994816999` GREEN; Android `38907541135` / `116994817103` GREEN;
- Pages `38907624340`, build `116995103030` + deploy `116995284394` GREEN.

### ES-13J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract
Status: **NEXT CONTRACT TARGET AFTER DOC40 CLOSURE**

J8C must freeze exactly one pure Score Attack completion metadata projection: `60000 ms` with `{ type: "TIMEBOX", durationMs: 60000 }`. It must consume J8A + J8B, fail closed for unsupported/incompatible facts, and leave current timer/completion runtime authority unchanged. `60000 ms` intentionally reuses the existing Sector 9 normal Campaign TIMEBOX value and remains separate from J7 Timed Survival's `30000 ms` bonus-challenge authority.

J8C must not mutate live descriptors, create/tick/reset timers, construct sessions, choose seed/replay policy, change StartScreen/ResultScreen/HUD, add dedicated persistence/high-score/archive, mutate score/reward/economy, change spawn/arena, scans/indexes, caps/budgets, entities/projectiles, FOTON or formations. Dedicated persistence is a later contract; live Score Attack UI/start flow remains later still.

""",
    "roadmap J8B/J8C",
)
p.write_text(s)

print("DOC40 documentation patch applied successfully")
