from pathlib import Path
import re

CANON = "78dfd39af5172499e7d82b8a62385a8e49f0e403"
PARENT = "51e383f95d6725184616866a46f65fe09d115dd6"
TREE = "19e808817722d7dafd020c35ea1083a3f52e1d2f"
BRANCH = "docs/es-13-j8c-closure-j8d-record-projection"


def replace_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"DOC41 fail-closed: expected exactly one {label} anchor, got {count}")
    return updated

# PROJECT_CONTINUITY.md
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
s = replace_once(
    s,
    r"## Current certified gameplay canonical\n\n`[^`]+`\n\nPhase: \*\*[^\n]+\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #[0-9]+ — CLOSED / completed\nDelivery: PR #[0-9]+ — squash merged\n\nSingle parent: `[^`]+` — DOC[0-9]+ documentation canonical\.\n\nCanonical tree: `[^`]+`\.",
    f"""## Current certified gameplay canonical

`{CANON}`

Phase: **ES-13J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract**
Status: **DEPLOYED / FROZEN**
Issue: #420 — CLOSED / completed
Delivery: PR #421 — squash merged

Single parent: `{PARENT}` — DOC40 documentation canonical.

Canonical tree: `{TREE}`.""",
    "continuity current canonical",
)
s = replace_once(
    s,
    r"- DOC40 — J8B closure & J8C Score Attack duration/TIMEBOX projection activation: Issue #418, branch `docs/es-13-j8b-closure-j8c-duration`, documentation-only closure in progress from gameplay canonical `d6277d4162c23f9b3edbbd69ccac8424b90d99ee`\.",
    f"- DOC40 — J8B closure & J8C Score Attack duration/TIMEBOX projection activation: `{PARENT}` — Issue #418 / PR #419.\n- DOC41 — J8C closure & J8D dedicated Score Attack record projection activation: Issue #422, branch `{BRANCH}`, documentation-only closure in progress from gameplay canonical `{CANON}`.",
    "continuity DOC40/DOC41 chronology",
)
next_anchor = "## Next gameplay phase"
j8c = f"""## J8C result
J8C froze the pure exact-duration/completion metadata required before any Score Attack persistence or live adoption.

Certified contract:
- consumes frozen J8A `SCORE_ATTACK` identity and J8B fresh `INFINITE_SESSION` compatibility;
- immutable projection mode `PROJECTION_ONLY`;
- exact duration `60000 ms`;
- immutable completion metadata `TIMEBOX / 60000 ms`;
- `60000 ms` intentionally reuses the existing normal Campaign wave-9 duration and remains independent from J7 Timed Survival's frozen `30000 ms` authority;
- unsupported ids and incompatible/advanced/inactive substrate facts fail closed;
- the input Infinite session is not mutated;
- exactly two positive authorities: exact-duration projection + completion-metadata projection;
- no live descriptor/session/timer/UI/storage adoption.

Final product scope exactly:
- `src/game/scoreAttackTimeboxProjection.ts`;
- `tests/es-13j8c-score-attack-timebox-projection.test.mjs`;
- `tests/gameplay/score-attack-timebox-projection.test.ts`.

## J8C exact evidence
- DOC40 baseline `{PARENT}`;
- pre-PR SHA `2a92e4b2ef851a3b96d3d8b2111916572ef4f3d2`, run `38909886244`, certify `117002752149` + Android `117002752623` GREEN;
- final PR #421 head `cefbffebbc0e6f67e70632acf3e1b008ccd16fa4`;
- PR CI `38910134577` / `117003581935` GREEN;
- PR Android `38910134565` / `117003581574` GREEN including Build/Verify/Upload APK;
- canonical `{CANON}`, single parent `{PARENT}`, tree `{TREE}`;
- canonical diff exactly three certified product/test files;
- main CI `38910510957` / `117004857754` GREEN;
- main Android `38910510842` / `117004856738` GREEN including Build/Verify/Upload APK;
- Pages `38910628638`: build `117005259913` + deploy `117005436887` GREEN.

Issue #420 CLOSED / completed. J8C is **DEPLOYED / FROZEN**.

"""
if "## J8C result" not in s:
    if next_anchor not in s:
        raise SystemExit("DOC41 fail-closed: next gameplay anchor missing")
    s = s.replace(next_anchor, j8c + next_anchor, 1)
s = replace_once(
    s,
    r"## Next gameplay phase\n\n### ES-13J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract\nStatus: \*\*NEXT CONTRACT TARGET AFTER DOC40 CLOSURE\*\*\n.*?(?=\n## Resolved diagnostics)",
    """## Next gameplay phase

### ES-13J8D — Pure Dedicated Score Attack Record Projection Contract
Status: **NEXT CONTRACT TARGET AFTER DOC41 CLOSURE**

J8A identity, J8B substrate compatibility and J8C `60000 ms` TIMEBOX projection are frozen. J8D must remain pure and storage-neutral so Score Attack cannot contaminate the existing global `GameStats.highScore` path.

Required contract:
- canonical `SCORE_ATTACK` only;
- dedicated record identity `SCORE_ATTACK_BEST_SCORE`;
- projection mode `RECORD_PROJECTION_ONLY`;
- inputs `existingBestScore` and `candidateScore` must be finite, non-negative numbers or fail closed;
- normalize accepted inputs with `Math.floor` and clamp to `Number.MAX_SAFE_INTEGER`;
- `projectedBestScore = max(existingBestScore, candidateScore)` after normalization;
- deterministic result metadata `NEW_BEST | TIED_BEST | BELOW_BEST`;
- consume frozen J8A identity and J8C `60000 ms` duration as compatibility facts;
- explicitly own no global `highScore`, `GameStats`, storage-schema or write authority.

J8D must not add a `GameStats` field, modify `DEFAULT_STATS`/load/save/local-storage key, change `applyFinalRunCommit` or campaign checkpoint behavior, write recent-run archives, alter StartScreen/ResultScreen/HUD, adopt live runtime/session/timer behavior, mutate score generation/rewards/economy, or change spawn/arena, scans/indexes, caps/budgets, entities/projectiles, FOTON or formations. Dedicated storage/schema adoption remains a later slice; live UI/start adoption remains later still.
""",
    "continuity next J8D",
)
s = replace_once(
    s,
    r"> Continue ORBI Energy Swarm autonomously\..*?Never touch `main` directly or weaken tests\.",
    f"> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8C gameplay canonical is `{CANON}`, fully DEPLOYED / FROZEN via Issue #420 / PR #421 with pure SCORE_ATTACK `60000 ms` TIMEBOX projection and post-main CI/Android/Pages GREEN. Complete DOC41 if still open, then implement J8D as a pure storage-neutral dedicated `SCORE_ATTACK_BEST_SCORE` record projection before any GameStats/storage adoption, UI or live Score Attack flow. Preserve the existing global highScore path, caps/budgets, Campaign/Infinite isolation, FOTON GLB/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.",
    "continuity handoff",
)
p.write_text(s)

# IMPLEMENTATION_LEDGER.md
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
row = f"| ES-13J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract | DEPLOYED / FROZEN | `{CANON}` | #420 | #421 |"
if row not in s:
    anchor = "| ES-13J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract | DEPLOYED / FROZEN | `d6277d4162c23f9b3edbbd69ccac8424b90d99ee` | #416 | #417 |"
    if anchor not in s:
        raise SystemExit("DOC41 fail-closed: J8B ledger row missing")
    s = s.replace(anchor, anchor + "\n" + row, 1)
s = replace_once(
    s,
    r"- DOC40 — J8B closure & J8C Score Attack duration/TIMEBOX projection activation: Issue #418, branch `docs/es-13-j8b-closure-j8c-duration`, in progress from gameplay canonical `d6277d4162c23f9b3edbbd69ccac8424b90d99ee`\.",
    f"- DOC40 — J8B closure & J8C Score Attack duration/TIMEBOX projection activation: `{PARENT}` — Issue #418 / PR #419.\n- DOC41 — J8C closure & J8D dedicated Score Attack record projection activation: Issue #422, branch `{BRANCH}`, in progress from gameplay canonical `{CANON}`.",
    "ledger DOC40/DOC41 chronology",
)
blocker = "## Frozen manual/physical blockers"
j8c_ledger = f"""### J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract
- Consumes frozen J8A identity + J8B fresh Infinite substrate compatibility; mode `PROJECTION_ONLY`.
- Exact duration `60000 ms` with immutable TIMEBOX completion metadata.
- Reuses existing normal Campaign wave-9 duration as a compatibility value and remains separate from J7 Timed Survival `30000 ms`.
- Unsupported ids and incompatible/advanced/inactive substrate facts fail closed; input session remains unchanged.
- Exactly two positive authorities: duration projection + completion metadata projection.
- Pre-PR `2a92e4b2ef851a3b96d3d8b2111916572ef4f3d2`, run `38909886244`, certify `117002752149` + Android `117002752623` GREEN.
- Final PR #421 head `cefbffebbc0e6f67e70632acf3e1b008ccd16fa4`; PR CI `38910134577` / `117003581935` GREEN; PR Android `38910134565` / `117003581574` GREEN.
- Canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`, exact diff three product/test files.
- Main CI `38910510957` / `117004857754` GREEN; Android `38910510842` / `117004856738` GREEN; Pages `38910628638`, build `117005259913` + deploy `117005436887` GREEN.
- No live descriptor/session/timer/clock/pause, runtime discriminator/progression, seed policy, UI, persistence/storage, score mutation/formula, reward/economy, spawn/arena, scan/index, cap/budget, entity/projectile, FOTON or formation authority.

"""
if "### J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract" not in s:
    if blocker not in s:
        raise SystemExit("DOC41 fail-closed: blocker anchor missing")
    s = s.replace(blocker, j8c_ledger + blocker, 1)
s = replace_once(
    s,
    r"## Next planned gameplay\n\n### ES-13J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract\nStatus: \*\*NEXT CONTRACT TARGET AFTER DOC40 CLOSURE\*\*\.\n\n.*?(?=\nJ4D\+ additional tactical families remain deferred)",
    """## Next planned gameplay

### ES-13J8D — Pure Dedicated Score Attack Record Projection Contract
Status: **NEXT CONTRACT TARGET AFTER DOC41 CLOSURE**.

J8D must keep persistence semantics pure and storage-neutral before any schema write. It should define dedicated `SCORE_ATTACK_BEST_SCORE` identity, require finite non-negative existing/candidate scores, normalize with floor + `Number.MAX_SAFE_INTEGER` clamp, project the maximum, and expose deterministic `NEW_BEST | TIED_BEST | BELOW_BEST` metadata while consuming frozen J8A identity + J8C `60000 ms` compatibility. It must not modify `GameStats`, global `highScore`, `DEFAULT_STATS`, local storage, run commit functions, archives, UI or live runtime. Dedicated storage adoption remains later.

""",
    "ledger next J8D",
)
p.write_text(s)

# ES13_GAMEPLAY_ROADMAP.md
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
s = p.read_text()
s = replace_once(
    s,
    r"### ES-13J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract\nStatus: \*\*NEXT CONTRACT TARGET AFTER DOC40 CLOSURE\*\*\n\n.*?(?=\n## J9)",
    f"""### ES-13J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract
Status: **DEPLOYED / FROZEN**
Canonical: `{CANON}`  
Issue #420 / PR #421

J8C freezes the pure completion metadata needed before records or live adoption:
- frozen J8A `SCORE_ATTACK` + J8B fresh `INFINITE_SESSION` compatibility are consumed;
- mode `PROJECTION_ONLY`;
- exact duration `60000 ms`;
- immutable TIMEBOX completion metadata at `60000 ms`;
- `60000 ms` reuses existing normal Campaign wave-9 duration and stays separate from J7 Timed Survival `30000 ms`;
- unsupported/incompatible/advanced/inactive facts fail closed;
- exactly duration projection + completion metadata projection are positive authorities;
- no live descriptor/session/timer/UI/storage adoption.

Exact deployment anchors:
- pre-PR `2a92e4b2ef851a3b96d3d8b2111916572ef4f3d2`, run `38909886244`, certify `117002752149` + Android `117002752623` GREEN;
- final PR #421 head `cefbffebbc0e6f67e70632acf3e1b008ccd16fa4`;
- PR CI `38910134577` / `117003581935` GREEN; Android `38910134565` / `117003581574` GREEN;
- canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`;
- main CI `38910510957` / `117004857754` GREEN; Android `38910510842` / `117004856738` GREEN;
- Pages `38910628638`, build `117005259913` + deploy `117005436887` GREEN.

### ES-13J8D — Pure Dedicated Score Attack Record Projection Contract
Status: **NEXT CONTRACT TARGET AFTER DOC41 CLOSURE**

J8D must prevent mode-specific Score Attack records from contaminating the current global `GameStats.highScore` path. It remains pure and storage-neutral: define dedicated `SCORE_ATTACK_BEST_SCORE`, accept only finite non-negative existing/candidate scores, floor and clamp accepted values to `Number.MAX_SAFE_INTEGER`, project the maximum, and expose deterministic `NEW_BEST | TIED_BEST | BELOW_BEST` metadata. Frozen J8A identity and J8C `60000 ms` duration are compatibility facts, not duplicated authorities.

J8D must not add a `GameStats` field, touch `DEFAULT_STATS`/load/save/local-storage schema, change final-run/campaign commit behavior, write archives, change UI/HUD, adopt live Score Attack runtime/session/timer behavior, mutate score generation/rewards/economy, or alter spawn/arena, scans/indexes, caps/budgets, entities/projectiles, FOTON or formations. Dedicated storage/schema adoption remains a later slice; live UI/start flow remains later still.

""",
    "roadmap J8C/J8D",
)
p.write_text(s)

print("DOC41 documentation patch applied successfully")
