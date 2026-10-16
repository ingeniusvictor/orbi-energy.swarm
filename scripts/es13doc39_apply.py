from pathlib import Path
import re

CANON = "4a78c942a3ebdb509f67185d6799b0724ac27238"
PARENT = "0b7e61820d139327046f02adbef604f65f1909ff"
TREE = "feabb1b5b8beb2923ebd30f0c646a46ab73e990a"
BRANCH = "docs/es-13-j8a-closure-j8b-substrate"


def replace_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"DOC39 fail-closed: expected exactly one {label} anchor, got {count}")
    return updated

# PROJECT_CONTINUITY.md
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
s = replace_once(
    s,
    r"## Current certified gameplay canonical\n\n`[^`]+`\n\nPhase: \*\*[^\n]+\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #[0-9]+ — CLOSED / completed\nDelivery: PR #[0-9]+ — squash merged\n\nSingle parent: `[^`]+` — DOC[0-9]+ documentation canonical\.\n\nCanonical tree: `[^`]+`\.",
    f"""## Current certified gameplay canonical

`{CANON}`

Phase: **ES-13J8A — Pure Score Attack Mode Profile Contract**
Status: **DEPLOYED / FROZEN**
Issue: #412 — CLOSED / completed
Delivery: PR #413 — squash merged

Single parent: `{PARENT}` — DOC38 documentation canonical.

Canonical tree: `{TREE}`.""",
    "continuity current canonical",
)
s = replace_once(
    s,
    r"- DOC38 — J7D/J7 closure & J8 architecture discovery activation: Issue #410, branch `docs/es-13-j7d-j7-closure-j8-discovery`, documentation-only closure in progress from gameplay canonical `9440b31b0c8dca2da0cfe92a5f02cbf7065e6d67`\.",
    f"- DOC38 — J7D/J7 closure & J8 architecture discovery activation: `{PARENT}` — Issue #410 / PR #411.\n- DOC39 — J8A closure & J8B execution-substrate discovery activation: Issue #414, branch `{BRANCH}`, documentation-only closure in progress from gameplay canonical `{CANON}`.",
    "continuity DOC38/DOC39 chronology",
)
next_anchor = "## Next gameplay phase"
j8a = f"""## J8A result
J8A selected Score Attack as the smallest justified first Additional Game Mode contract without adopting a new live mode.

Certified contract:
- exactly one immutable profile: `SCORE_ATTACK` / `Score Attack`;
- family `ARCADE_SCORE_CHASE`;
- mode `PROFILE_ONLY`;
- objective `MAXIMIZE_EXISTING_RUN_SCORE`;
- completion compatibility `TIMEBOX`;
- score-source compatibility `EXISTING_RUN_SCORE`;
- existing centralized run score and TIMEBOX vocabulary are compatibility facts only, not newly owned authorities;
- unsupported/padded/deferred mode ids fail closed;
- only positive authority is semantic profile definition;
- no exact duration, progression substrate, runtime discriminator, start flow, descriptor mutation, score-formula change, rewards/economy, persistence/high-score/archive schema, ResultScreen/HUD, seed/replay or live execution authority;
- no live runtime/UI/storage authority imports J8A.

Final product scope exactly:
- `src/game/scoreAttackModeContract.ts`;
- `tests/es-13j8a-score-attack-mode-contract.test.mjs`;
- `tests/gameplay/score-attack-mode-contract.test.ts`.

## J8A exact evidence
- DOC38 baseline `{PARENT}`;
- pre-PR SHA `69fea866809cba4764414df2a5e4f7bfcc97e895`, run `38902639119`, certify `116978369434` + Android `116978369920` GREEN;
- final PR #413 head `979640051e9568c2b710d68ec77690db69b5a68b`;
- PR CI `38902906173` / `116979264896` GREEN;
- PR Android `38902906158` / `116979264759` GREEN including Build/Verify/Upload APK;
- canonical `{CANON}`, single parent `{PARENT}`, tree `{TREE}`;
- canonical diff exactly three certified product/test files;
- main CI final `38903099548` / `116979916188` GREEN; duplicate exact-SHA CI `38903092522` / `116979892581` also GREEN;
- main Android final `38903099249` / `116979914940` GREEN including Build/Verify/Upload APK;
- Pages `38903209694`: build `116980287001` + deploy `116980431323` GREEN.

Issue #412 CLOSED / completed. J8A is **DEPLOYED / FROZEN**.

"""
if "## J8A result" not in s:
    if next_anchor not in s:
        raise SystemExit("DOC39 fail-closed: next gameplay anchor missing")
    s = s.replace(next_anchor, j8a + next_anchor, 1)
s = replace_once(
    s,
    r"## Next gameplay phase\n\n### ES-13J8 — Additional Game Modes Architecture Discovery\nStatus: \*\*NEXT ARCHITECTURE / DISCOVERY TARGET AFTER DOC38 CLOSURE\*\*\n\nJ7's first end-to-end Bonus Challenge vertical slice is frozen\..*?No scoring rule, duration, rewards/economy, seed policy, persistence schema, runtime state, UI or live behavior is frozen by DOC38\.",
    """## Next gameplay phase

### ES-13J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract
Status: **NEXT DISCOVERY / CONTRACT TARGET AFTER DOC39 CLOSURE**

J8A profile semantics are frozen. J8B must remain pure and prove whether Score Attack can reuse a fresh existing `INFINITE_SESSION` execution substrate without adding a third `RuntimeProgressionState` discriminator or forking the engine.

Required discovery:
- prove compatibility with fresh Infinite session start semantics at sector 11 / wave 1;
- reuse existing `advanceInfiniteSession(...)` progression and `createInfiniteRuntimeState(...)` descriptor pipeline rather than a Score-Attack-specific wave director;
- prove Score Attack compatibility does not require the Campaign victory checkpoint in `beginInfiniteAfterCampaignVictory(...)`;
- keep top-level `SCORE_ATTACK` identity outside the runtime progression discriminator;
- fail closed if the expected Infinite-session compatibility facts are not present.

J8B must not choose exact Score Attack duration, live run timer, seed/replay policy, live session construction, StartScreen/ResultScreen/HUD, dedicated persistence/high-score/archive semantics, score formula changes, rewards/economy, clock/pause, spawn/arena, collections/scans/indexes, caps/budgets, entities/projectiles, FOTON or formations. Live Score Attack start flow remains later.""",
    "continuity next J8B",
)
s = replace_once(
    s,
    r"> Continue ORBI Energy Swarm autonomously\..*?Never touch `main` directly or weaken tests\.",
    f"> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8A gameplay canonical is `{CANON}`, fully DEPLOYED / FROZEN via Issue #412 / PR #413 with one pure SCORE_ATTACK profile and post-main CI/Android/Pages GREEN. Complete DOC39 if still open, then perform J8B pure execution-substrate/lifecycle compatibility discovery before any Score Attack duration, persistence, UI or live adoption. Investigate direct reuse of fresh `INFINITE_SESSION` semantics while keeping `RuntimeProgressionState` as CAMPAIGN | INFINITE and avoiding mode-specific engine forks. Preserve caps/budgets, Campaign/Infinite isolation, FOTON GLB/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.",
    "continuity handoff",
)
p.write_text(s)

# IMPLEMENTATION_LEDGER.md
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
row = f"| ES-13J8A — Pure Score Attack Mode Profile Contract | DEPLOYED / FROZEN | `{CANON}` | #412 | #413 |"
if row not in s:
    anchor = "| ES-13J7D — Controlled Live Timed Survival Adoption | DEPLOYED / FROZEN | `9440b31b0c8dca2da0cfe92a5f02cbf7065e6d67` | #408 | #409 |"
    if anchor not in s:
        raise SystemExit("DOC39 fail-closed: J7D ledger row missing")
    s = s.replace(anchor, anchor + "\n" + row, 1)
s = replace_once(
    s,
    r"- DOC38 — J7D/J7 closure & J8 architecture discovery activation: Issue #410, branch `docs/es-13-j7d-j7-closure-j8-discovery`, in progress from gameplay canonical `9440b31b0c8dca2da0cfe92a5f02cbf7065e6d67`\.",
    f"- DOC38 — J7D/J7 closure & J8 architecture discovery activation: `{PARENT}` — Issue #410 / PR #411.\n- DOC39 — J8A closure & J8B execution-substrate discovery activation: Issue #414, branch `{BRANCH}`, in progress from gameplay canonical `{CANON}`.",
    "ledger DOC38/DOC39 chronology",
)
blocker = "## Frozen manual/physical blockers"
j8a_ledger = f"""### J8A — Pure Score Attack Mode Profile Contract
- Exactly one immutable `SCORE_ATTACK` / `Score Attack` profile, family `ARCADE_SCORE_CHASE`, mode `PROFILE_ONLY`.
- Objective `MAXIMIZE_EXISTING_RUN_SCORE`, completion compatibility `TIMEBOX`, score-source compatibility `EXISTING_RUN_SCORE`.
- Only profile-definition authority is positive; exact duration, progression substrate, runtime discriminator, start flow, persistence/high-score/archive, result presentation, seed/replay, score formula, rewards/economy and live adoption remain unresolved.
- No live runtime/UI/storage file imports J8A.
- Pre-PR `69fea866809cba4764414df2a5e4f7bfcc97e895`, run `38902639119`, certify `116978369434` + Android `116978369920` GREEN.
- Final PR #413 head `979640051e9568c2b710d68ec77690db69b5a68b`; PR CI `38902906173` / `116979264896` GREEN; PR Android `38902906158` / `116979264759` GREEN.
- Canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`, exact diff three product/test files.
- Main CI final `38903099548` / `116979916188` GREEN; duplicate exact-SHA CI `38903092522` / `116979892581` GREEN; Android final `38903099249` / `116979914940` GREEN; Pages `38903209694`, build `116980287001` + deploy `116980431323` GREEN.
- No runtime/progression, timer/clock/pause, spawn/arena, damage/defeat, score mutation/formula, persistence/storage, UI/HUD, RNG/hash/seed, scan/index, cap/budget, entity/projectile, FOTON or formation authority.

"""
if "### J8A — Pure Score Attack Mode Profile Contract" not in s:
    if blocker not in s:
        raise SystemExit("DOC39 fail-closed: blocker anchor missing")
    s = s.replace(blocker, j8a_ledger + blocker, 1)
s = replace_once(
    s,
    r"## Next planned gameplay\n\n### ES-13J8 — Additional Game Modes Architecture Discovery\nStatus: \*\*NEXT ARCHITECTURE / DISCOVERY TARGET AFTER DOC38 CLOSURE\*\*\.\n\nCandidate vocabulary remains.*?DOC38 freezes no concrete mode, scoring rule, duration, rewards/economy, seed policy, persistence schema, runtime state, UI or live behavior\.",
    """## Next planned gameplay

### ES-13J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract
Status: **NEXT DISCOVERY / CONTRACT TARGET AFTER DOC39 CLOSURE**.

J8B must prove whether the frozen J8A Score Attack profile can reuse a fresh existing `INFINITE_SESSION` substrate (sector 11 / wave 1), existing Infinite advancement and the existing runtime descriptor pipeline without adding a `SCORE_ATTACK` runtime discriminator or requiring a Campaign victory checkpoint. J8B remains pure and must not choose exact run duration, timer, seed/replay policy, live start flow, UI, dedicated persistence/high-score/archive semantics, score formula, rewards/economy, spawn/arena, collections/scans/indexes, caps/budgets, entities/projectiles or formation authority.""",
    "ledger next J8B",
)
p.write_text(s)

# ES13_GAMEPLAY_ROADMAP.md
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
s = p.read_text()
s = replace_once(
    s,
    r"## J8 — Additional Game Modes\nStatus: \*\*NEXT ARCHITECTURE / DISCOVERY TARGET AFTER DOC38 CLOSURE\*\*\n\nCandidate vocabulary: Score Attack, Boss Rush, Survival/Last Light, Swarm Trials, Anomaly Runs, Daily Seed, Elite Hunt, Endless Crisis and Perfect Sector\. Reuse one certified engine/core; avoid mode-specific forks\.\n\nDOC38 activates discovery only\. No first J8 mode is frozen\. Architecture discovery must inspect runtime/session/progression/persistence/start-screen/result-screen seams and prove the smallest reusable mode boundary, lifecycle/reset/end semantics, Campaign/Infinite coexistence, persistence/high-score impact, descriptor/progression reuse, UI implications, seed/replay behavior if applicable and Android parity before any implementation slice is named\.",
    f"""## J8 — Additional Game Modes
Status: **ACTIVE PROGRAM**

Candidate vocabulary remains Score Attack, Boss Rush, Survival/Last Light, Swarm Trials, Anomaly Runs, Daily Seed, Elite Hunt, Endless Crisis and Perfect Sector. Reuse one certified engine/core; avoid mode-specific forks.

### J8A — Pure Score Attack Mode Profile Contract
Status: **DEPLOYED / FROZEN**
Canonical: `{CANON}`  
Issue #412 / PR #413

J8A selects Score Attack as the smallest justified first Additional Game Mode contract without live adoption:
- `SCORE_ATTACK` / `Score Attack`;
- family `ARCADE_SCORE_CHASE`;
- mode `PROFILE_ONLY`;
- objective `MAXIMIZE_EXISTING_RUN_SCORE`;
- completion compatibility `TIMEBOX`;
- score-source compatibility `EXISTING_RUN_SCORE`;
- only semantic profile-definition authority is owned;
- exact duration, progression substrate, runtime discriminator, start flow, persistence/high-score/archive, result presentation, seed/replay, score formula, rewards/economy and live adoption remain unresolved.

Exact deployment anchors:
- pre-PR `69fea866809cba4764414df2a5e4f7bfcc97e895`, run `38902639119`, certify `116978369434` + Android `116978369920` GREEN;
- final PR #413 head `979640051e9568c2b710d68ec77690db69b5a68b`;
- PR CI `38902906173` / `116979264896` GREEN; Android `38902906158` / `116979264759` GREEN;
- canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`;
- main CI final `38903099548` / `116979916188` GREEN; Android final `38903099249` / `116979914940` GREEN;
- Pages `38903209694`, build `116980287001` + deploy `116980431323` GREEN.

### J8B — Pure Score Attack Execution-Substrate / Lifecycle Compatibility Contract
Status: **NEXT DISCOVERY / CONTRACT TARGET AFTER DOC39 CLOSURE**

J8B must prove direct compatibility with the existing self-contained `INFINITE_SESSION` execution substrate without creating a mode-specific engine fork. Discovery must verify fresh sector-11/wave-1 semantics, existing Infinite advancement, existing runtime projection compatibility, independence from Campaign victory checkpointing, and preservation of the current `CAMPAIGN | INFINITE` runtime discriminator.

J8B remains pure: no exact Score Attack run duration/timer, live session construction, seed/replay policy, StartScreen/ResultScreen/HUD, dedicated persistence/high-score/archive, score formula, rewards/economy, spawn/arena, collections/scans/indexes, caps/budgets, entities/projectiles, FOTON or formation changes. Other J8 candidate modes remain uncontracted, not cancelled.""",
    "roadmap J8 block",
)
p.write_text(s)

print("DOC39 documentation patch applied successfully")
