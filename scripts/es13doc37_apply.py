from pathlib import Path
import re

CANON = "1ad86de5155a3e6e73630e5244f7ce7ec107f4af"
PARENT = "af998aa40c1f767727bbe2c999b4c7b3bc872a3c"
TREE = "5025f401e8562cff5097a0592b9c5345ec96f366"


def replace_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"DOC37 fail-closed: expected exactly one {label} anchor, got {count}")
    return updated

# --- PROJECT_CONTINUITY.md ---
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
s = replace_once(
    s,
    r"## Current certified gameplay canonical\n\n`[^`]+`\n\nPhase: \*\*[^\n]+\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #[0-9]+ — CLOSED / completed\nDelivery: PR #[0-9]+ — squash merged\n\nSingle parent: `[^`]+` — DOC[0-9]+ documentation canonical\.\n\nCanonical tree: `[^`]+`\.",
    f"""## Current certified gameplay canonical\n\n`{CANON}`\n\nPhase: **ES-13J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract**\nStatus: **DEPLOYED / FROZEN**\nIssue: #404 — CLOSED / completed\nDelivery: PR #405 — squash merged\n\nSingle parent: `{PARENT}` — DOC36 documentation canonical.\n\nCanonical tree: `{TREE}`.""",
    "continuity current canonical",
)
s = replace_once(
    s,
    r"- DOC36 — J7B closure & J7C duration/TIMEBOX projection activation: Issue #401, branch `docs/es-13-j7b-closure-j7c-activation`, documentation-only closure in progress from gameplay canonical `93af4e999af5e3b3afed7f684706536bdfaedd89`\.",
    "- DOC36 — J7B closure & J7C duration/TIMEBOX projection activation: `af998aa40c1f767727bbe2c999b4c7b3bc872a3c` — Issue #401 / PR #403.\n- DOC37 — J7C closure & J7D controlled live Timed Survival adoption activation: Issue #406, branch `docs/es-13-j7c-closure-j7d-activation`, documentation-only closure in progress from gameplay canonical `1ad86de5155a3e6e73630e5244f7ce7ec107f4af`.",
    "continuity DOC36/DOC37 ledger",
)
next_anchor = "## Next gameplay phase"
j7c_result = """## J7C result
J7C froze the final pure pre-live Timed Survival duration and completion projection contract.

Certified contract:
- consumes frozen J7A `TIMED_SURVIVAL` profile and J7B opportunity authority rather than duplicating them;
- exact duration is `30000 ms`;
- `30000 ms` is exactly the midpoint of J7A's frozen `20000..40000 ms` window and remains below the current minimum normal Campaign TIMEBOX wave (`35000 ms`);
- immutable mode `PROJECTION_ONLY`;
- immutable completion projection `{ type: \"TIMEBOX\", durationMs: 30000 }`;
- unsupported/noneligible J7B facts fail closed through the frozen J7B resolver;
- only positive authority is exact-duration projection + completion metadata projection;
- no live challenge execution, live completion-policy authority, runtime descriptor mutation, timer start/tick/reset, clock/pause, spawn/arena/progression, damage/defeat/score/reward/economy, HUD, RNG/hash, collections/scans/indexes, caps/budgets, entity/projectile, FOTON or formation authority;
- no live runtime authority imports J7C.

Final product scope exactly:
- `src/game/bonusChallengeTimeboxProjection.ts`;
- `tests/es-13j7c-bonus-challenge-timebox-projection.test.mjs`;
- `tests/gameplay/bonus-challenge-timebox-projection.test.ts`.

## J7C exact evidence
- DOC36 baseline `af998aa40c1f767727bbe2c999b4c7b3bc872a3c`;
- pre-PR SHA `7716741ea46d4926672ac13a88e89b1b7ef2fc30`, run `38862130838`, certify job `116846577888` + Android job `116846578106` GREEN;
- final PR #405 head `e553330a434b138bb6dae304a0bffedf442403d3`;
- PR CI `38862303820` / `116847134910` GREEN;
- PR Android `38862303706` / `116847134685` GREEN including Build/Verify/Upload APK;
- canonical `1ad86de5155a3e6e73630e5244f7ce7ec107f4af`, single parent `af998aa40c1f767727bbe2c999b4c7b3bc872a3c`, tree `5025f401e8562cff5097a0592b9c5345ec96f366`;
- canonical diff exactly three certified product/test files;
- main CI `38862461080` / `116847645968` GREEN;
- main Android `38862461028` / `116847645716` GREEN including Build/Verify/Upload APK;
- Pages `38862526063`: build `116847854661` + deploy `116847951677` GREEN.

Issue #404 CLOSED / completed. J7C is **DEPLOYED / FROZEN**.

"""
if j7c_result not in s:
    if next_anchor not in s:
        raise SystemExit("DOC37 fail-closed: continuity next gameplay anchor missing")
    s = s.replace(next_anchor, j7c_result + next_anchor, 1)
s = replace_once(
    s,
    r"## Next gameplay phase\n\n### ES-13J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract\nStatus: \*\*NEXT DISCOVERY / CONTRACT TARGET AFTER DOC36 CLOSURE\*\*\n\nJ7A profile semantics and J7B Infinite opportunity/cadence are frozen\..*?Controlled live Timed Survival adoption remains J7D\+ and requires a separate seam/lifecycle/telegraph certification\.",
    """## Next gameplay phase

### ES-13J7D — Controlled Live Timed Survival Adoption
Status: **NEXT DISCOVERY / LIVE ADOPTION TARGET AFTER DOC37 CLOSURE**

J7A profile, J7B opportunity/cadence and J7C `30000 ms` TIMEBOX projection are frozen. J7D is the first slice allowed to investigate live Timed Survival execution.

Required discovery:
- Infinite only unless separately justified; Campaign remains unchanged;
- consume J7C rather than copy duration/profile/cadence logic;
- prove exactly one smallest existing runtime descriptor seam before mutation;
- adopt only the selected current J7B wave; no inserted wave or second progression/session director;
- preserve unrelated descriptor fields, spawn composition, pressure, enemy budget, mutators, milestone facts, caps/budgets and entity collections;
- reuse existing `TIMEBOX` completion, `waveTimeRemainingRef`, timer tick and pause lifecycle; no second clock/timer/ref/completion authority;
- prove wave-start initialization, expiry/completion, pause, transition/reset and no stale carry-over;
- prove ordering/coexistence with frozen J6 dynamic-event adoption and adaptive descriptor overlays;
- prove bounded attribution/telegraph without creating an independent HUD/timer system;
- no new RNG/hash, collections/scans/indexes, spawn/arena/combat/score/reward/economy authority, caps/budgets, entities/projectiles, FOTON or formations.

DOC37 freezes no exact live file/seam. The dedicated J7D Issue must complete architecture discovery before implementation.""",
    "continuity next J7D section",
)
s = replace_once(
    s,
    r"> Continue ORBI Energy Swarm autonomously\..*?Never touch `main` directly or weaken tests\.",
    "> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J7C gameplay canonical is `1ad86de5155a3e6e73630e5244f7ce7ec107f4af`, fully DEPLOYED / FROZEN via Issue #404 / PR #405 with exact 30000 ms `PROJECTION_ONLY` TIMEBOX metadata and post-main CI/Android/Pages GREEN. Complete DOC37 if still open, then perform J7D architecture/discovery before any live Timed Survival adoption. Reuse J7A/J7B/J7C plus the existing runtime TIMEBOX/timer/pause authority; do not create a second clock, timer or progression director. Preserve J6 coexistence, caps/budgets, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.",
    "continuity handoff",
)
p.write_text(s)

# --- IMPLEMENTATION_LEDGER.md ---
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
row = "| ES-13J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract | DEPLOYED / FROZEN | `1ad86de5155a3e6e73630e5244f7ce7ec107f4af` | #404 | #405 |"
if row not in s:
    anchor = "| ES-13J7B — Pure Timed Survival Opportunity/Cadence Contract | DEPLOYED / FROZEN | `93af4e999af5e3b3afed7f684706536bdfaedd89` | #399 | #400 |"
    if anchor not in s:
        raise SystemExit("DOC37 fail-closed: J7B ledger row missing")
    s = s.replace(anchor, anchor + "\n" + row, 1)
s = replace_once(
    s,
    r"- DOC36 — J7B closure & J7C duration/TIMEBOX projection activation: Issue #401, branch `docs/es-13-j7b-closure-j7c-activation`, in progress from gameplay canonical `93af4e999af5e3b3afed7f684706536bdfaedd89`\.",
    "- DOC36 — J7B closure & J7C duration/TIMEBOX projection activation: `af998aa40c1f767727bbe2c999b4c7b3bc872a3c` — Issue #401 / PR #403.\n- DOC37 — J7C closure & J7D controlled live Timed Survival adoption activation: Issue #406, branch `docs/es-13-j7c-closure-j7d-activation`, in progress from gameplay canonical `1ad86de5155a3e6e73630e5244f7ce7ec107f4af`.",
    "ledger DOC36/DOC37",
)
blocker_anchor = "## Frozen manual/physical blockers"
j7c_ledger = """### J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract
- Exact duration `30000 ms`, mathematically the midpoint of J7A's `20000..40000 ms` window and below minimum normal Campaign TIMEBOX `35000 ms`.
- Pure immutable `PROJECTION_ONLY` result with `{ type: \"TIMEBOX\", durationMs: 30000 }`.
- Reuses J7A profile + J7B opportunity authority; noneligible facts fail closed through J7B.
- Only exact-duration + completion metadata projection authority; no live descriptor/timer/clock/pause/spawn/arena/progression/combat/economy/HUD/RNG/collection/cap/FOTON/formation authority.
- Pre-PR `7716741ea46d4926672ac13a88e89b1b7ef2fc30`, run `38862130838`, certify `116846577888` + Android `116846578106` GREEN.
- Final PR #405 head `e553330a434b138bb6dae304a0bffedf442403d3`; PR CI `38862303820` / `116847134910` GREEN; PR Android `38862303706` / `116847134685` GREEN.
- Canonical `1ad86de5155a3e6e73630e5244f7ce7ec107f4af`, parent `af998aa40c1f767727bbe2c999b4c7b3bc872a3c`, tree `5025f401e8562cff5097a0592b9c5345ec96f366`, exact diff three product/test files.
- Main CI `38862461080` / `116847645968` GREEN; Android `38862461028` / `116847645716` GREEN; Pages `38862526063`, build `116847854661` + deploy `116847951677` GREEN.

"""
if j7c_ledger not in s:
    if blocker_anchor not in s:
        raise SystemExit("DOC37 fail-closed: ledger blocker anchor missing")
    s = s.replace(blocker_anchor, j7c_ledger + blocker_anchor, 1)
s = replace_once(
    s,
    r"## Next planned gameplay\n\n### ES-13J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract\nStatus: \*\*NEXT DISCOVERY / CONTRACT TARGET AFTER DOC36 CLOSURE\*\*\.\n\nJ7C must consume frozen J7A/J7B semantics,.*?Live adoption remains J7D\+\.",
    """## Next planned gameplay

### ES-13J7D — Controlled Live Timed Survival Adoption
Status: **NEXT DISCOVERY / LIVE ADOPTION TARGET AFTER DOC37 CLOSURE**.

J7D must complete architecture discovery before any runtime write. It may adopt only the frozen J7C `TIMEBOX 30000` projection for the current J7B-selected Infinite wave, through one bounded existing descriptor seam. Existing TIMEBOX completion/timer/pause lifecycle must remain authoritative; no second clock/timer/ref/progression director is allowed. It must preserve unrelated descriptor fields, spawn/arena/combat/economy/caps/budgets and prove transition/reset/no-stale behavior plus coexistence/order with J6 and adaptive descriptor overlays. Exact live file/seam is not frozen by DOC37 and requires the dedicated J7D Issue.""",
    "ledger next J7D",
)
p.write_text(s)

# --- ES13_GAMEPLAY_ROADMAP.md ---
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
s = p.read_text()
s = replace_once(
    s,
    r"### J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract\nStatus: \*\*NEXT DISCOVERY / CONTRACT TARGET AFTER DOC36 CLOSURE\*\*\n\nJ7C closes the final pure-contract gap before any live Timed Survival adoption:.*?Live Timed Survival adoption remains J7D\+ and requires a dedicated Issue proving one descriptor seam plus lifecycle/reset/pause and attribution/telegraph behavior\.\n\n## J8 — Additional Game Modes",
    """### J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract
Status: **DEPLOYED / FROZEN**
Canonical: `1ad86de5155a3e6e73630e5244f7ce7ec107f4af`  
Issue #404 / PR #405

Certified J7C contract:
- exact duration `30000 ms`;
- exact midpoint of J7A `20000..40000 ms` and below minimum normal Campaign TIMEBOX `35000 ms`;
- consumes J7A profile + J7B opportunity authority;
- immutable `PROJECTION_ONLY` TIMEBOX metadata `{ type: \"TIMEBOX\", durationMs: 30000 }`;
- noneligible facts fail closed;
- no live descriptor/timer/clock/pause/spawn/arena/progression/combat/economy/HUD/RNG/hash/collection/scan/cap/entity/FOTON/formation authority.

Exact deployment anchors:
- pre-PR `7716741ea46d4926672ac13a88e89b1b7ef2fc30`, run `38862130838`, certify `116846577888` + Android `116846578106` GREEN;
- final PR #405 head `e553330a434b138bb6dae304a0bffedf442403d3`;
- PR CI `38862303820` / `116847134910` GREEN; Android `38862303706` / `116847134685` GREEN;
- canonical `1ad86de5155a3e6e73630e5244f7ce7ec107f4af`, parent `af998aa40c1f767727bbe2c999b4c7b3bc872a3c`, tree `5025f401e8562cff5097a0592b9c5345ec96f366`;
- main CI `38862461080` / `116847645968` GREEN; Android `38862461028` / `116847645716` GREEN;
- Pages `38862526063`, build `116847854661` + deploy `116847951677` GREEN.

### J7D — Controlled Live Timed Survival Adoption
Status: **NEXT DISCOVERY / LIVE ADOPTION TARGET AFTER DOC37 CLOSURE**

J7D is the first J7 slice allowed to investigate live Timed Survival execution:
- Infinite only unless separately justified; Campaign unchanged;
- consume frozen J7C projection and J7B selection, without copied profile/cadence/duration logic;
- prove exactly one smallest existing runtime descriptor seam before mutation;
- adopt only the selected current wave, never insert a new wave;
- preserve unrelated descriptor/spawn/pressure/budget/mutator/milestone facts;
- reuse existing TIMEBOX completion, timer cursor/tick and pause lifecycle with no second clock/timer/ref/completion authority;
- prove initialization, expiry/completion, pause, transition/reset and no stale carry-over;
- prove coexistence/order with J6 dynamic-event and adaptive descriptor overlays;
- bounded attribution/telegraph only; no independent HUD/timer system without separate justification;
- no new RNG/hash, collections/scans/indexes, spawn/arena/combat/score/reward/economy authority, cap/budget changes, entities/projectiles, FOTON or formations.

DOC37 does not freeze the exact runtime file/seam; dedicated J7D architecture discovery must do so.

## J8 — Additional Game Modes""",
    "roadmap J7C/J7D",
)
p.write_text(s)

# Preservation guards across final docs.
combined = "\n".join(Path(x).read_text() for x in [
    "docs/PROJECT_CONTINUITY.md",
    "docs/IMPLEMENTATION_LEDGER.md",
    "docs/ES13_GAMEPLAY_ROADMAP.md",
])
for token in [
    "#4", "#5", "#202", "#248", "#254", "#283",
    "J3C-C", "J4D+", "## J8 — Additional Game Modes",
    "## J15", "ES-14", CANON, "ES-13J7D",
]:
    if token not in combined:
        raise SystemExit(f"DOC37 fail-closed preservation guard missing: {token}")

print("DOC37 apply + preservation guard: PASS")
