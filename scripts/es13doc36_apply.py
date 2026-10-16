from pathlib import Path
import re

CANON = "93af4e999af5e3b3afed7f684706536bdfaedd89"
PARENT = "bd4c5c7061337aec3c857f548e086516bbea04e0"
TREE = "75698c115814e371173ad3e16adc6dff6e6dba22"


def replace_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"DOC36 fail-closed: expected exactly one {label} anchor, got {count}")
    return updated

# --- PROJECT_CONTINUITY.md ---
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
s = replace_once(
    s,
    r"## Current certified gameplay canonical\n\n`[^`]+`\n\nPhase: \*\*[^\n]+\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #[0-9]+ — CLOSED / completed\nDelivery: PR #[0-9]+ — squash merged\n\nSingle parent: `[^`]+` — DOC[0-9]+ documentation canonical\.\n\nCanonical tree: `[^`]+`\.",
    f"""## Current certified gameplay canonical\n\n`{CANON}`\n\nPhase: **ES-13J7B — Pure Timed Survival Opportunity/Cadence Contract**\nStatus: **DEPLOYED / FROZEN**\nIssue: #399 — CLOSED / completed\nDelivery: PR #400 — squash merged\n\nSingle parent: `{PARENT}` — DOC35 documentation canonical.\n\nCanonical tree: `{TREE}`.""",
    "continuity current canonical",
)
s = replace_once(
    s,
    r"- DOC35 — J7A closure & J7B opportunity/cadence discovery activation: Issue #397, branch `docs/es-13-j7a-closure-j7b-activation`, documentation-only closure in progress from gameplay canonical `8a5244e770c360d13b8218599ba3f49bbaa03b46`\.",
    "- DOC35 — J7A closure & J7B opportunity/cadence discovery activation: `bd4c5c7061337aec3c857f548e086516bbea04e0` — Issue #397 / PR #398.\n- DOC36 — J7B closure & J7C duration/TIMEBOX projection activation: Issue #401, branch `docs/es-13-j7b-closure-j7c-activation`, documentation-only closure in progress from gameplay canonical `93af4e999af5e3b3afed7f684706536bdfaedd89`.",
    "continuity DOC35/DOC36 ledger",
)
next_anchor = "## Next gameplay phase"
j7b_result = """## J7B result
J7B froze deterministic Infinite-only Timed Survival opportunity eligibility without live adoption.

Certified contract:
- challenge identity remains frozen J7A `TIMED_SURVIVAL`;
- source mode is `INFINITE` only;
- minimum sector `33` with sparse cadence `(sector - 33) % 10 === 0`;
- first eligible sectors `33, 43, 53, 63, ...`;
- waveCount is bounded to `4..7`;
- no inserted wave: only an existing interior wave slot is selected;
- selected slot is wave 2 unless frozen J6 owns wave 2, then wave 3;
- J6 collision knowledge is delegated to `resolveDynamicMidSectorEventOpportunity(...)`; J7B copies no J6 hash/RNG;
- first/final waves, milestone and recovery fail closed;
- canonical non-empty trimmed seed/recipe identity is required;
- mode remains `OPPORTUNITY_ONLY`;
- no live descriptor mutation, exact duration, timer/clock/pause, spawn/arena, progression, combat, score/reward/economy, HUD, RNG/hash, collection/scan/index, cap/budget, entity/projectile, FOTON or formation authority.

Final product scope exactly:
- `src/game/bonusChallengeOpportunity.ts`;
- `tests/es-13j7b-bonus-challenge-opportunity.test.mjs`;
- `tests/gameplay/bonus-challenge-opportunity.test.ts`.

## J7B exact evidence
- DOC35 baseline `bd4c5c7061337aec3c857f548e086516bbea04e0`;
- pre-PR SHA `7757b9c780f5af4cf17f3ededc50363b1adab4ae`, run `38851031270`, certify job `116812048577` + Android job `116812367521` GREEN;
- final PR #400 head `0265df56ef6ebda8a887926ac810087af1432336`;
- PR CI `38851299136` / `116812860905` GREEN;
- PR Android `38851299196` / `116812860926` GREEN;
- canonical `93af4e999af5e3b3afed7f684706536bdfaedd89`, single parent `bd4c5c7061337aec3c857f548e086516bbea04e0`, tree `75698c115814e371173ad3e16adc6dff6e6dba22`;
- canonical diff exactly three certified product/test files;
- main CI `38851462985` / `116813368003` GREEN;
- main Android `38851462903` / `116813367709` GREEN including Build/Verify/Upload APK;
- Pages `38851545491`: build `116813624422` + deploy `116813744666` GREEN.

Issue #399 CLOSED / completed. J7B is **DEPLOYED / FROZEN**.

"""
if j7b_result not in s:
    if next_anchor not in s:
        raise SystemExit("DOC36 fail-closed: continuity next gameplay anchor missing")
    s = s.replace(next_anchor, j7b_result + next_anchor, 1)
s = replace_once(
    s,
    r"## Next gameplay phase\n\n### ES-13J7B — Pure Bonus Challenge Opportunity/Cadence Contract\nStatus: \*\*NEXT DISCOVERY / CONTRACT TARGET AFTER DOC35 CLOSURE\*\*\n\nJ7B must decide when and where.*?J7B remains pure: no runtime descriptor mutation, timer start/tick, spawn/arena change, score/reward/economy, HUD, RNG/clock, collection/scan/index, cap/budget or entity authority\.",
    """## Next gameplay phase

### ES-13J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract
Status: **NEXT DISCOVERY / CONTRACT TARGET AFTER DOC36 CLOSURE**

J7A profile semantics and J7B Infinite opportunity/cadence are frozen. J7C must remain pure and close the remaining pre-live authority gap: exact duration plus immutable TIMEBOX projection metadata.

Required discovery:
- consume J7A/J7B authorities rather than duplicate profile or cadence logic;
- choose one deterministic exact duration inside `20000..40000 ms` and justify it without RNG/clock authority;
- investigate `30000 ms` as the leading candidate because it is the exact midpoint of J7A's window and remains shorter than the minimum normal Campaign TIMEBOX wave (`35000 ms`), but DOC36 does not freeze that value;
- project `TIMEBOX` intent/metadata only; do not mutate a live descriptor;
- rely on existing `runtimeCompletionPolicy` and `EnergySwarmGame` timer/pause path for future execution;
- fail closed for noncanonical/noneligible J7B facts;
- no live runtime import/adoption, timer ticking, clock/pause authority, spawn/arena, progression, combat, score/reward/economy, HUD, RNG/hash, collections/scans/indexes, caps/budgets, entities/projectiles, FOTON or formations.

Controlled live Timed Survival adoption remains J7D+ and requires a separate seam/lifecycle/telegraph certification.""",
    "continuity next J7C section",
)
s = replace_once(
    s,
    r"> Continue ORBI Energy Swarm autonomously\..*?Never touch `main` directly or weaken tests\.",
    "> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J7B gameplay canonical is `93af4e999af5e3b3afed7f684706536bdfaedd89`, fully DEPLOYED / FROZEN via Issue #399 / PR #400 with Infinite-only sparse Timed Survival opportunity cadence and post-main CI/Android/Pages GREEN. Complete DOC36 if still open, then perform J7C pure duration/TIMEBOX projection discovery before any live Bonus Challenge adoption. Reuse J7A/J7B and the existing runtime TIMEBOX/timer/pause authority; do not create a second clock or mutate live descriptors in J7C. Preserve caps/budgets, J6 coexistence, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.",
    "continuity handoff",
)
p.write_text(s)

# --- IMPLEMENTATION_LEDGER.md ---
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
row = "| ES-13J7B — Pure Timed Survival Opportunity/Cadence Contract | DEPLOYED / FROZEN | `93af4e999af5e3b3afed7f684706536bdfaedd89` | #399 | #400 |"
if row not in s:
    anchor = "| ES-13J7A — Pure Timed Survival Bonus Challenge Profile Contract | DEPLOYED / FROZEN | `8a5244e770c360d13b8218599ba3f49bbaa03b46` | #395 | #396 |"
    if anchor not in s:
        raise SystemExit("DOC36 fail-closed: J7A ledger row missing")
    s = s.replace(anchor, anchor + "\n" + row, 1)
s = replace_once(
    s,
    r"- DOC35 — J7A closure & J7B opportunity/cadence discovery activation: Issue #397, branch `docs/es-13-j7a-closure-j7b-activation`, in progress from gameplay canonical `8a5244e770c360d13b8218599ba3f49bbaa03b46`\.",
    "- DOC35 — J7A closure & J7B opportunity/cadence discovery activation: `bd4c5c7061337aec3c857f548e086516bbea04e0` — Issue #397 / PR #398.\n- DOC36 — J7B closure & J7C duration/TIMEBOX projection activation: Issue #401, branch `docs/es-13-j7b-closure-j7c-activation`, in progress from gameplay canonical `93af4e999af5e3b3afed7f684706536bdfaedd89`.",
    "ledger DOC35/DOC36",
)
blocker_anchor = "## Frozen manual/physical blockers"
j7b_ledger = """### J7B — Pure Timed Survival Opportunity/Cadence Contract
- Infinite-only, sector >= 33, exact cadence `(sector - 33) % 10 === 0`.
- Uses only existing interior slots; wave 2 unless frozen J6 owns wave 2, then wave 3; no inserted wave and no copied J6 hash/RNG.
- First/final, milestone and recovery fail closed; waveCount `4..7`; mode remains `OPPORTUNITY_ONLY`.
- Pre-PR `7757b9c780f5af4cf17f3ededc50363b1adab4ae`, run `38851031270`, certify `116812048577` + Android `116812367521` GREEN.
- Final PR #400 head `0265df56ef6ebda8a887926ac810087af1432336`; PR CI `38851299136` / `116812860905` GREEN; PR Android `38851299196` / `116812860926` GREEN.
- Canonical `93af4e999af5e3b3afed7f684706536bdfaedd89`, parent `bd4c5c7061337aec3c857f548e086516bbea04e0`, tree `75698c115814e371173ad3e16adc6dff6e6dba22`, exact diff three product/test files.
- Main CI `38851462985` / `116813368003` GREEN; Android `38851462903` / `116813367709` GREEN; Pages `38851545491`, build `116813624422` + deploy `116813744666` GREEN.
- No live execution, exact duration, descriptor/completion mutation, timer/clock/pause, spawn/arena, progression, combat/economy, HUD, RNG/hash, scans/indexes, cap/budget, entity/projectile or formation authority.

"""
if j7b_ledger not in s:
    if blocker_anchor not in s:
        raise SystemExit("DOC36 fail-closed: ledger blocker anchor missing")
    s = s.replace(blocker_anchor, j7b_ledger + blocker_anchor, 1)
s = replace_once(
    s,
    r"## Next planned gameplay\n\n### ES-13J7B — Pure Bonus Challenge Opportunity/Cadence Contract\nStatus: \*\*NEXT DISCOVERY / CONTRACT TARGET AFTER DOC35 CLOSURE\*\*\.\n\nJ7A has selected only.*?No exact duration, descriptor mutation, live timer, spawn/arena, reward/economy, HUD, RNG/clock, collections/scans or cap/budget authority is allowed in J7B\.",
    """## Next planned gameplay

### ES-13J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract
Status: **NEXT DISCOVERY / CONTRACT TARGET AFTER DOC36 CLOSURE**.

J7C must consume frozen J7A/J7B semantics, choose and justify one deterministic exact duration inside `20000..40000 ms`, and emit immutable TIMEBOX projection metadata only. `30000 ms` is the leading discovery candidate because it is the exact midpoint of the frozen window and below the minimum normal Campaign TIMEBOX duration (`35000 ms`), but DOC36 does not freeze it. Existing runtime completion/timer/pause authority remains authoritative. No live descriptor mutation, timer/clock/pause authority, spawn/arena, progression, combat/economy, HUD, RNG/hash, collection/scan/index, cap/budget, entity/projectile or formation authority is allowed in J7C. Live adoption remains J7D+.""",
    "ledger next J7C",
)
p.write_text(s)

# --- ES13_GAMEPLAY_ROADMAP.md ---
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
s = p.read_text()
s = replace_once(
    s,
    r"### J7B — Pure Bonus Challenge Opportunity/Cadence Contract\nStatus: \*\*NEXT DISCOVERY / CONTRACT TARGET AFTER DOC35 CLOSURE\*\*\n\nJ7B must establish deterministic eligibility before any Timed Survival live adoption\..*?J7B remains pure: no descriptor mutation, exact duration, timer start/tick, spawn/arena composition, score/reward/economy, HUD, RNG/clock, collection/scan/index, caps/budgets, entities/projectiles, FOTON or formation changes\.\n\n## J8 — Additional Game Modes",
    """### J7B — Pure Bonus Challenge Opportunity/Cadence Contract
Status: **DEPLOYED / FROZEN**
Canonical: `93af4e999af5e3b3afed7f684706536bdfaedd89`  
Issue #399 / PR #400

Certified J7B opportunity policy:
- Infinite only;
- sector >= 33 and cadence `(sector - 33) % 10 === 0`;
- waveCount `4..7`;
- uses an existing interior slot only: wave 2 unless frozen J6 owns wave 2, then wave 3;
- no inserted wave, no copied J6 hash/RNG;
- first/final, milestone and recovery fail closed;
- challenge remains J7A `TIMED_SURVIVAL`;
- `OPPORTUNITY_ONLY` with no live execution, exact duration, descriptor mutation, timer/clock/pause, spawn/arena, progression, combat/economy, HUD, RNG/hash, scans/indexes, caps/budgets, entities/projectiles, FOTON or formation authority.

Exact deployment anchors:
- pre-PR `7757b9c780f5af4cf17f3ededc50363b1adab4ae`, run `38851031270`, certify `116812048577` + Android `116812367521` GREEN;
- final PR #400 head `0265df56ef6ebda8a887926ac810087af1432336`;
- PR CI `38851299136` / `116812860905` GREEN; Android `38851299196` / `116812860926` GREEN;
- canonical `93af4e999af5e3b3afed7f684706536bdfaedd89`, parent `bd4c5c7061337aec3c857f548e086516bbea04e0`, tree `75698c115814e371173ad3e16adc6dff6e6dba22`;
- main CI `38851462985` / `116813368003` GREEN; Android `38851462903` / `116813367709` GREEN;
- Pages `38851545491`, build `116813624422` + deploy `116813744666` GREEN.

### J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract
Status: **NEXT DISCOVERY / CONTRACT TARGET AFTER DOC36 CLOSURE**

J7C closes the final pure-contract gap before any live Timed Survival adoption:
- consume frozen J7A profile + J7B opportunity authority rather than duplicate them;
- choose one deterministic exact duration inside the frozen `20000..40000 ms` window;
- investigate `30000 ms` as the leading candidate because it is the exact midpoint of the window and shorter than the minimum normal Campaign TIMEBOX wave (`35000 ms`), without DOC36 freezing the value;
- emit immutable TIMEBOX projection metadata only;
- existing `runtimeCompletionPolicy` and game-loop TIMEBOX timer/pause path remain the future live execution authority;
- fail closed on noncanonical/noneligible facts;
- no live runtime import, descriptor mutation, timer/clock/pause authority, spawn/arena, progression, combat, score/reward/economy, HUD, RNG/hash, collections/scans/indexes, caps/budgets, entities/projectiles, FOTON or formations.

Live Timed Survival adoption remains J7D+ and requires a dedicated Issue proving one descriptor seam plus lifecycle/reset/pause and attribution/telegraph behavior.

## J8 — Additional Game Modes""",
    "roadmap J7B/J7C",
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
    "## J15", "ES-14", "93af4e999af5e3b3afed7f684706536bdfaedd89",
    "ES-13J7C",
]:
    if token not in combined:
        raise SystemExit(f"DOC36 fail-closed preservation guard missing: {token}")

print("DOC36 apply + preservation guard: PASS")
