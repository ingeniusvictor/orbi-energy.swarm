from pathlib import Path
import re

CANON = "de37f4a818b05b09c136617b71cf3620bf4e1e83"
PARENT = "2e4eb93a06e303c42cd8c97a133a176860eb2e38"
TREE = "4bb5318cff768ec4cd5390be0d76daf3b1013b26"
BRANCH = "docs/es-13-j8d-closure-j8e-storage-schema"


def replace_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"DOC42 fail-closed: expected exactly one {label} anchor, got {count}")
    return updated

# PROJECT_CONTINUITY.md
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
s = replace_once(
    s,
    r"## Current certified gameplay canonical\n\n`[^`]+`\n\nPhase: \*\*[^\n]+\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #[0-9]+ — CLOSED / completed\nDelivery: PR #[0-9]+ — squash merged\n\nSingle parent: `[^`]+` — DOC[0-9]+ documentation canonical\.\n\nCanonical tree: `[^`]+`\.",
    f"""## Current certified gameplay canonical

`{CANON}`

Phase: **ES-13J8D — Pure Dedicated Score Attack Record Projection Contract**
Status: **DEPLOYED / FROZEN**
Issue: #424 — CLOSED / completed
Delivery: PR #425 — squash merged

Single parent: `{PARENT}` — DOC41 documentation canonical.

Canonical tree: `{TREE}`.""",
    "continuity current canonical",
)
s = replace_once(
    s,
    r"- DOC41 — J8C closure & J8D dedicated Score Attack record projection activation: Issue #422, branch `docs/es-13-j8c-closure-j8d-record-projection`, documentation-only closure in progress from gameplay canonical `78dfd39af5172499e7d82b8a62385a8e49f0e403`\.",
    f"- DOC41 — J8C closure & J8D dedicated Score Attack record projection activation: `{PARENT}` — Issue #422 / PR #423.\n- DOC42 — J8D closure & J8E dedicated Score Attack storage-schema adoption activation: Issue #426, branch `{BRANCH}`, documentation-only closure in progress from gameplay canonical `{CANON}`.",
    "continuity DOC41/DOC42 chronology",
)
j8d = f"""## J8D result
J8D froze the dedicated Score Attack record/comparator semantics required before any storage or live-run write adoption.

Certified contract:
- canonical mode `SCORE_ATTACK` only;
- record identity `SCORE_ATTACK_BEST_SCORE`;
- projection mode `RECORD_PROJECTION_ONLY`;
- existing/candidate scores must be finite and non-negative or fail closed;
- accepted values use `Math.floor` and clamp to `Number.MAX_SAFE_INTEGER`;
- projected best is the maximum of normalized existing/candidate values;
- deterministic status is `NEW_BEST`, `TIED_BEST` or `BELOW_BEST`;
- frozen J8A identity + J8C `60000 ms` duration are compatibility facts;
- exactly one positive authority: dedicated record projection;
- global `GameStats.highScore`, GameStats schema, storage, persistence, archives, UI and live runtime remain untouched.

Final product scope exactly:
- `src/game/scoreAttackRecordProjection.ts`;
- `tests/es-13j8d-score-attack-record-projection.test.mjs`;
- `tests/gameplay/score-attack-record-projection.test.ts`.

## J8D exact evidence
- DOC41 baseline `{PARENT}`;
- pre-PR SHA `2c282fab13079039bc1302ba6918e53765100197`, run `38912394130`, certify `117011204544` + Android `117011204314` GREEN;
- final PR #425 head `5e91f121cb5f2f66dc6f3dcf5bbd928592103a46`;
- PR CI `38914825464` / `117019490041` GREEN;
- PR Android `38914825953` / `117019492058` GREEN including Build/Verify/Upload APK;
- canonical `{CANON}`, single parent `{PARENT}`, tree `{TREE}`;
- canonical diff exactly three certified product/test files;
- main CI `38915074594` / `117020337717` GREEN;
- main Android `38915074301` / `117020336281` GREEN including Build/Verify/Upload APK;
- Pages `38915180390`: build `117020692263` + deploy `117020841804` GREEN.

Traceability: one accidental empty branch-only file was created after certification cleanup and immediately removed before PR; the final PR/canonical diff remained exactly the three approved J8D files.

Issue #424 CLOSED / completed. J8D is **DEPLOYED / FROZEN**.

"""
if "## J8D result" not in s:
    anchor = "## Next gameplay phase"
    if anchor not in s:
        raise SystemExit("DOC42 fail-closed: continuity next gameplay anchor missing")
    s = s.replace(anchor, j8d + anchor, 1)
s = replace_once(
    s,
    r"## Next gameplay phase\n\n### ES-13J8D — Pure Dedicated Score Attack Record Projection Contract\nStatus: \*\*NEXT CONTRACT TARGET AFTER DOC41 CLOSURE\*\*\n.*?(?=\n## Resolved diagnostics)",
    """## Next gameplay phase

### ES-13J8E — Dedicated Score Attack Storage-Schema Adoption
Status: **NEXT CONTRACT TARGET AFTER DOC42 CLOSURE**

J8D record semantics are frozen. J8E may now reserve one dedicated persisted field without wiring any live run to update it.

Required narrow adoption:
- add `scoreAttackBestScore: number` to `GameStats`;
- `DEFAULT_STATS.scoreAttackBestScore = 0`;
- `loadGameStats()` sanitizes persisted values to a non-negative integer clamped to `Number.MAX_SAFE_INTEGER`;
- missing, negative, non-number or non-finite legacy values normalize to `0`;
- keep the existing `orbi_energy_swarm_stats_v2` key and existing save/reset path; no parallel key/store/migration subsystem;
- preserve global `highScore` exactly and keep it semantically independent from Score Attack;
- consume frozen J8D identity/normalization semantics instead of inventing a second record comparator;
- tests must prove v2 backward compatibility, bounded load behavior and highScore isolation.

J8E must not change `applyCampaignVictoryCheckpoint(...)` or `applyFinalRunCommit(...)`, must not write Score Attack at run completion, must not alter recent-run archive format/outcomes, StartScreen/ResultScreen/HUD, live Score Attack runtime/session/timer/completion, score formula, rewards/economy, spawn/arena, scans/indexes, caps/budgets, entities/projectiles, FOTON or formations. Effective run-completion record writes and live UI/start adoption remain later slices.
""",
    "continuity next J8E",
)
s = replace_once(
    s,
    r"> Continue ORBI Energy Swarm autonomously\..*?Never touch `main` directly or weaken tests\.",
    f"> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8D gameplay canonical is `{CANON}`, fully DEPLOYED / FROZEN via Issue #424 / PR #425 with pure storage-neutral `SCORE_ATTACK_BEST_SCORE` projection and post-main CI/Android/Pages GREEN. Complete DOC42 if still open, then implement J8E as narrow dedicated Score Attack storage-schema adoption: one `scoreAttackBestScore` GameStats field, default 0, bounded legacy-safe load sanitization, same v2 storage key, and no live run-completion write yet. Preserve global highScore, existing run commit functions, archives, UI/runtime, caps/budgets, Campaign/Infinite isolation, FOTON GLB/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.",
    "continuity handoff",
)
p.write_text(s)

# IMPLEMENTATION_LEDGER.md
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
row = f"| ES-13J8D — Pure Dedicated Score Attack Record Projection Contract | DEPLOYED / FROZEN | `{CANON}` | #424 | #425 |"
if row not in s:
    anchor = "| ES-13J8C — Pure Score Attack Exact Duration / TIMEBOX Projection Contract | DEPLOYED / FROZEN | `78dfd39af5172499e7d82b8a62385a8e49f0e403` | #420 | #421 |"
    if anchor not in s:
        raise SystemExit("DOC42 fail-closed: J8C ledger row missing")
    s = s.replace(anchor, anchor + "\n" + row, 1)
s = replace_once(
    s,
    r"- DOC41 — J8C closure & J8D dedicated Score Attack record projection activation: Issue #422, branch `docs/es-13-j8c-closure-j8d-record-projection`, in progress from gameplay canonical `78dfd39af5172499e7d82b8a62385a8e49f0e403`\.",
    f"- DOC41 — J8C closure & J8D dedicated Score Attack record projection activation: `{PARENT}` — Issue #422 / PR #423.\n- DOC42 — J8D closure & J8E dedicated Score Attack storage-schema adoption activation: Issue #426, branch `{BRANCH}`, in progress from gameplay canonical `{CANON}`.",
    "ledger DOC41/DOC42 chronology",
)
j8d_ledger = f"""### J8D — Pure Dedicated Score Attack Record Projection Contract
- Canonical `SCORE_ATTACK` only; dedicated record identity `SCORE_ATTACK_BEST_SCORE`; mode `RECORD_PROJECTION_ONLY`.
- Finite non-negative existing/candidate values only; floor + `Number.MAX_SAFE_INTEGER` clamp; invalid/non-finite fail closed.
- Deterministic `NEW_BEST | TIED_BEST | BELOW_BEST`; projected best is max of normalized values.
- J8A identity + J8C `60000 ms` duration consumed as compatibility facts; exactly one positive authority: dedicated record projection.
- Pre-PR `2c282fab13079039bc1302ba6918e53765100197`, run `38912394130`, certify `117011204544` + Android `117011204314` GREEN.
- Final PR #425 head `5e91f121cb5f2f66dc6f3dcf5bbd928592103a46`; PR CI `38914825464` / `117019490041` GREEN; PR Android `38914825953` / `117019492058` GREEN.
- Canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`, exact diff three product/test files.
- Main CI `38915074594` / `117020337717` GREEN; Android `38915074301` / `117020336281` GREEN; Pages `38915180390`, build `117020692263` + deploy `117020841804` GREEN.
- No GameStats/global highScore, storage/persistence/archive, UI, live runtime/session/timer, score formula, reward/economy, spawn/arena, scan/index, cap/budget, entity/projectile, FOTON or formation authority.
- Traceability: accidental empty branch-only file removed before PR; final/canonical diff unaffected.

"""
if "### J8D — Pure Dedicated Score Attack Record Projection Contract" not in s:
    anchor = "## Frozen manual/physical blockers"
    if anchor not in s:
        raise SystemExit("DOC42 fail-closed: ledger blocker anchor missing")
    s = s.replace(anchor, j8d_ledger + anchor, 1)
s = replace_once(
    s,
    r"## Next planned gameplay\n\n### ES-13J8D — Pure Dedicated Score Attack Record Projection Contract\nStatus: \*\*NEXT CONTRACT TARGET AFTER DOC41 CLOSURE\*\*\.\n\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)",
    """## Next planned gameplay

### ES-13J8E — Dedicated Score Attack Storage-Schema Adoption
Status: **NEXT CONTRACT TARGET AFTER DOC42 CLOSURE**.

J8E is schema/storage adoption only: add `scoreAttackBestScore` to `GameStats`, default it to `0`, sanitize legacy/persisted values to a bounded non-negative integer capped at `Number.MAX_SAFE_INTEGER`, retain the existing v2 storage key/save/reset path, and prove global `highScore` isolation. It must consume J8D semantics and must not change run-commit functions, write the field at run completion, alter archives, UI/HUD, live runtime/session/timer/completion, score formula/rewards/economy, spawn/arena, scans/indexes, caps/budgets, entities/projectiles or formation authority. Effective record-write adoption remains later.
""",
    "ledger next J8E",
)
p.write_text(s)

# ES13_GAMEPLAY_ROADMAP.md
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
s = p.read_text()
s = replace_once(
    s,
    r"### ES-13J8D — Pure Dedicated Score Attack Record Projection Contract\nStatus: \*\*NEXT CONTRACT TARGET AFTER DOC41 CLOSURE\*\*\n\n.*?(?=\n## J9)",
    f"""### ES-13J8D — Pure Dedicated Score Attack Record Projection Contract
Status: **DEPLOYED / FROZEN**
Canonical: `{CANON}`  
Issue #424 / PR #425

J8D freezes the record semantics required before storage or live-write adoption:
- canonical `SCORE_ATTACK` only;
- `SCORE_ATTACK_BEST_SCORE` / `RECORD_PROJECTION_ONLY`;
- finite non-negative existing/candidate values only;
- floor + `Number.MAX_SAFE_INTEGER` clamp;
- projected best = maximum normalized value;
- deterministic `NEW_BEST | TIED_BEST | BELOW_BEST`;
- J8A identity + J8C `60000 ms` duration consumed as compatibility facts;
- exactly one positive authority: dedicated record projection;
- no GameStats/global-highScore, storage/persistence/archive, UI or live runtime adoption.

Exact deployment anchors:
- pre-PR `2c282fab13079039bc1302ba6918e53765100197`, run `38912394130`, certify `117011204544` + Android `117011204314` GREEN;
- final PR #425 head `5e91f121cb5f2f66dc6f3dcf5bbd928592103a46`;
- PR CI `38914825464` / `117019490041` GREEN; Android `38914825953` / `117019492058` GREEN;
- canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`;
- main CI `38915074594` / `117020337717` GREEN; Android `38915074301` / `117020336281` GREEN;
- Pages `38915180390`, build `117020692263` + deploy `117020841804` GREEN.

### ES-13J8E — Dedicated Score Attack Storage-Schema Adoption
Status: **NEXT CONTRACT TARGET AFTER DOC42 CLOSURE**

J8E may reserve one persisted field for frozen J8D semantics without making Score Attack live. Add `scoreAttackBestScore: number` to `GameStats`, default it to `0`, sanitize legacy/persisted values to a non-negative integer capped at `Number.MAX_SAFE_INTEGER`, keep the existing `orbi_energy_swarm_stats_v2` key and existing save/reset path, and prove that global `highScore` remains unchanged and independent.

J8E must not modify campaign/final-run commit functions, write the dedicated record at run completion, alter run-archive format/outcomes, StartScreen/ResultScreen/HUD, live Score Attack runtime/session/timer/completion, score generation/rewards/economy, spawn/arena, scans/indexes, caps/budgets, entities/projectiles, FOTON or formations. Effective run-completion record-write adoption and live UI/start flow remain later slices.

""",
    "roadmap J8D/J8E",
)
p.write_text(s)

print("DOC42 documentation patch applied successfully")
