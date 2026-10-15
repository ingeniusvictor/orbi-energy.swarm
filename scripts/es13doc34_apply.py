from pathlib import Path
import re

CANON = "247d976b6e2cc634cbc5158cdff46ac42b51c5fc"
PARENT = "34168aa3ed192d72ef7100103691dff8cca7e1c9"
TREE = "eb0890fa715fa29dfb4c124b0508bb9cdb0adfc3"


def replace_once(text, old, new, name):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{name}: expected one literal match, got {count}")
    return text.replace(old, new, 1)


def sub_once(text, pattern, repl, name, flags=re.S):
    out, count = re.subn(pattern, repl, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{name}: expected one regex match, got {count}")
    return out


# PROJECT_CONTINUITY
path = Path("docs/PROJECT_CONTINUITY.md")
text = path.read_text()
text = sub_once(
    text,
    r"## Current certified gameplay canonical\n\n.*?Version remains `0\.2\.0-beta\.1`\. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay\.",
    f"""## Current certified gameplay canonical

`{CANON}`

Phase: **ES-13J6B-D — Controlled Live Dynamic Event Adoption**
Status: **DEPLOYED / FROZEN**
Issue: #391 — CLOSED / completed
Delivery: PR #392 — squash merged

Single parent: `{PARENT}` — DOC33 documentation canonical.

Canonical tree: `{TREE}`.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.""",
    "continuity canonical",
)
text = replace_once(
    text,
    "- DOC33 — J6B-C closure & J6B-D controlled live adoption activation: Issue #389, branch `docs/es-13-j6bc-closure-j6bd-activation`, documentation-only closure in progress from gameplay canonical `1ad68edc1fd15ffa15e1cf6aa139d3d97a547623`.",
    "- DOC33 — J6B-C closure & J6B-D controlled live adoption activation: `34168aa3ed192d72ef7100103691dff8cca7e1c9` — Issue #389 / PR #390.\n- DOC34 — J6B-D closure & J7 discovery activation: Issue #393, branch `docs/es-13-j6bd-closure-j7-discovery`, documentation-only closure in progress from gameplay canonical `247d976b6e2cc634cbc5158cdff46ac42b51c5fc`.",
    "continuity DOC33/DOC34",
)
if "## J6B-D result" in text:
    raise SystemExit("continuity already contains J6B-D result")
result = f"""## J6B-D result
J6B-D adopted the frozen J6A → J6B-B → J6B-C dynamic-event chain through one immutable current-wave descriptor overlay in the existing runtime projection cache.

Certified live behavior:
- single adoption seam in `runtimeProjectionBundleCache.ts`, after the existing adaptive-invasion overlay and before existing pressure/mutator/budget/milestone projection;
- Campaign unchanged;
- J6A retains opportunity timing authority, J6B-B deterministic identity selection, and J6B-C compatibility mapping;
- mapped identities append at most one already-existing Infinite mutator to an immutable descriptor copy, deduplicated;
- `SOLAR_STORM → ELECTRICAL_STORM`, `QUANTUM_RIFT → MAGNETIC_DRIFT`, `BLACKOUT_SURGE → REDUCED_VISIBILITY`, `CRYSTAL_RUSH → UNSTABLE_RESOURCE_FIELDS`;
- `DYSON_ECLIPSE` remains explicit `UNMAPPED` / fail-closed and leaves the descriptor unchanged;
- existing `runtimeMutatorEffects.ts`, environmental-field projection and electrical-storm delay/telegraph remain authoritative for live semantics and magnitudes;
- lifecycle is `CURRENT_WAVE_ONLY`; advancing `RuntimeProgressionState` naturally expires the overlay;
- no J6B-D timer, RNG/seed/clock, recipe/session mutation, entity/projectile collection, scan/index, spawn/progression, combat/economy, cap/budget, FOTON GLB or formation authority;
- `EnergySwarmGame.tsx` is unchanged.

Final product scope exactly:
- `src/game/dynamicMidSectorEventRuntimeAdoption.ts`;
- `src/game/runtimeProjectionBundleCache.ts`;
- `tests/es-13j6bd-dynamic-mid-sector-event-runtime-adoption.test.mjs`;
- `tests/gameplay/dynamic-mid-sector-event-runtime-adoption.test.ts`.

## J6B-D exact evidence
- DOC33 baseline `{PARENT}`;
- pre-PR SHA `559c44d3e7aea58e79cce5a0b30d1d28571f8959`, run `38817464641` / job `116705630774` GREEN including Android APK build/verify/upload;
- final PR #392 head `479241ee9604b017ac4d062e80ebe353878aab46`;
- PR CI `38817902374` / `116707069836` GREEN;
- PR Android `38817902279` / `116707067282` GREEN including Build/Verify/Upload APK;
- canonical `{CANON}`, single parent `{PARENT}`, tree `{TREE}`;
- canonical diff exactly four certified product files;
- main CI `38818106840` / `116707736739` GREEN;
- main Android `38818106804` / `116707736723` GREEN including Build/Verify/Upload APK;
- Pages `38818209120`: build `116708074756` + deploy `116708178250` GREEN.

Issue #391 CLOSED / completed. J6B-D is **DEPLOYED / FROZEN**.

"""
text = replace_once(text, "## Next gameplay phase", result + "## Next gameplay phase", "continuity result insert")
text = sub_once(
    text,
    r"## Next gameplay phase\n\n### ES-13J6B-D — Controlled Live Dynamic Event Adoption\n.*?(?=## Resolved diagnostics)",
    """## Next gameplay phase

### ES-13J7 — Bonus Challenge Rounds Discovery
Status: **NEXT ARCHITECTURE / DISCOVERY TARGET AFTER DOC34 CLOSURE**

J7 is activated for discovery only. The roadmap candidate vocabulary remains 20–40 s rhythm breakers such as precision, rescue, collection, evasive corridors, pursuit, affinity puzzles, obstacle navigation, timed survival and survival without firing.

DOC34 does not freeze a first challenge, exact duration/cadence, mode scope, timer/pause authority, spawn/arena behavior, score/reward/economy semantics, HUD contract, success/failure rules or J7 subphase name. Dedicated discovery must inspect current runtime seams and select the smallest justified contract before a gameplay Issue/branch exists.

Required preservation:
- Campaign/Infinite isolation remains unchanged until discovery proves scope;
- existing global caps/budgets, entity/projectile arrays and gameplay authorities remain unchanged;
- no reward/score/economy or timer authority is inferred from the roadmap wording;
- J3C-C, J4D+ and manual blockers remain deferred as recorded.

""",
    "continuity next phase",
)
text = replace_once(
    text,
    "`J6B-D Controlled Live Dynamic Event Adoption → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "`J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "continuity chronology",
)
text = sub_once(
    text,
    r"Suggested handoff:\n> .*?\n\n## Update obligation",
    f"""Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J6B-D gameplay canonical is `{CANON}`, fully DEPLOYED / FROZEN via Issue #391 / PR #392 with post-main CI/Android/Pages GREEN. Complete DOC34 if still open, then perform J7 Bonus Challenge Rounds architecture/discovery before naming or implementing a J7 sub-slice. Do not infer timer, reward, score, spawn, arena, HUD or mode authority from the candidate roadmap vocabulary. Preserve caps/budgets, Campaign/Infinite isolation, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.

## Update obligation""",
    "continuity handoff",
)
for required in ["## Resolved diagnostics", "## Frozen manual/physical blockers", "#4 — visual/responsive certification", "#5 — Infinite play-feel", "#202 — GAIA physical runtime/performance", "#248 — Android real-device certification"]:
    if required not in text:
        raise SystemExit(f"continuity lost required preservation marker: {required}")
path.write_text(text)


# IMPLEMENTATION_LEDGER
path = Path("docs/IMPLEMENTATION_LEDGER.md")
text = path.read_text()
row = "| ES-13J6B-C — Pure Dynamic Event Effect-Mapping Compatibility Contract | DEPLOYED / FROZEN | `1ad68edc1fd15ffa15e1cf6aa139d3d97a547623` | #387 | #388 |"
text = replace_once(
    text,
    row,
    row + f"\n| ES-13J6B-D — Controlled Live Dynamic Event Adoption | DEPLOYED / FROZEN | `{CANON}` | #391 | #392 |",
    "ledger milestone",
)
text = replace_once(
    text,
    "- DOC33 — J6B-C closure & J6B-D controlled live adoption activation: Issue #389, branch `docs/es-13-j6bc-closure-j6bd-activation`, in progress from gameplay canonical `1ad68edc1fd15ffa15e1cf6aa139d3d97a547623`.",
    "- DOC33 — J6B-C closure & J6B-D controlled live adoption activation: `34168aa3ed192d72ef7100103691dff8cca7e1c9` — Issue #389 / PR #390.\n- DOC34 — J6B-D closure & J7 discovery activation: Issue #393, branch `docs/es-13-j6bd-closure-j7-discovery`, in progress from gameplay canonical `247d976b6e2cc634cbc5158cdff46ac42b51c5fc`.",
    "ledger DOC33/DOC34",
)
if "### J6B-D — Controlled Live Dynamic Event Adoption" in text:
    raise SystemExit("ledger already contains J6B-D evidence")
evidence = f"""### J6B-D — Controlled Live Dynamic Event Adoption
- Single immutable current-wave descriptor overlay in `runtimeProjectionBundleCache.ts`; no `EnergySwarmGame.tsx` change.
- Reuses J6A opportunity timing, J6B-B deterministic identity and J6B-C compatibility mapping plus existing Infinite environmental semantics.
- `DYSON_ECLIPSE` remains `UNMAPPED` / fail-closed; no fallback.
- Pre-PR `559c44d3e7aea58e79cce5a0b30d1d28571f8959`, run `38817464641` / job `116705630774` GREEN including Android.
- Final PR #392 head `479241ee9604b017ac4d062e80ebe353878aab46`; PR CI `38817902374` / `116707069836` GREEN; PR Android `38817902279` / `116707067282` GREEN.
- Canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`, exact diff four product files.
- Main CI `38818106840` / `116707736739` GREEN; Android `38818106804` / `116707736723` GREEN; Pages `38818209120`, build `116708074756` + deploy `116708178250` GREEN.
- No new timer/RNG/seed/clock, collections/scans, spawn/progression, combat/economy, cap/budget, FOTON or formation authority.

"""
text = replace_once(text, "## Frozen manual/physical blockers", evidence + "## Frozen manual/physical blockers", "ledger evidence")
text = sub_once(
    text,
    r"## Next planned gameplay\n\n### ES-13J6B-D — Controlled Live Dynamic Event Adoption\n.*?(?=## Program sequence)",
    """## Next planned gameplay

### ES-13J7 — Bonus Challenge Rounds Discovery
Status: **NEXT ARCHITECTURE / DISCOVERY TARGET AFTER DOC34 CLOSURE**.

The existing roadmap candidate set remains: 20–40 s precision, rescue, collection, evasive-corridor, pursuit, affinity-puzzle, obstacle-navigation, timed-survival and survival-without-firing rhythm breakers. Discovery must inspect current gameplay/runtime seams and select the smallest justified first contract. No challenge type, duration/cadence, Campaign/Infinite scope, timer/pause, spawn/arena, score/reward/economy, HUD or success/failure authority is frozen by DOC34, and no J7 subphase name is assigned yet.

J4D+ additional tactical families remain deferred: FORMATION_BREAKER/JAMMER require hard-control spacing/recovery proof; MINE_WEAVER/MIRROR_WARDEN require genuine mine/mirror mechanics. J3C-C remains deferred, not cancelled.

""",
    "ledger next gameplay",
)
text = replace_once(
    text,
    "`J6B-D Controlled Live Dynamic Event Adoption → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`",
    "`J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`",
    "ledger sequence",
)
path.write_text(text)


# ROADMAP — replace only J6B-D block, stopping immediately before existing J7.
path = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
text = path.read_text()
text = sub_once(
    text,
    r"### J6B-D — Controlled Live Dynamic Event Adoption\n.*?(?=## J7 — Bonus Challenge Rounds)",
    f"""### J6B-D — Controlled Live Dynamic Event Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `{CANON}`  
Issue #391 / PR #392

J6B-D adopts the frozen J6A → J6B-B → J6B-C chain through one immutable `CURRENT_WAVE_ONLY` descriptor overlay in the existing runtime projection cache.

Certified boundaries:
- Campaign unchanged;
- single live seam in `runtimeProjectionBundleCache.ts`; `EnergySwarmGame.tsx` unchanged;
- mapped events add at most one already-existing Infinite mutator, deduplicated;
- existing runtime mutator/environment magnitudes, clamps and electrical-storm telegraph remain authoritative;
- `DYSON_ECLIPSE` remains `UNMAPPED` / fail-closed with no descriptor change;
- lifecycle expires naturally when `RuntimeProgressionState` advances;
- no new timer/RNG/seed/clock, recipe/session mutation, collection/scan, spawn/progression, combat/economy, cap/budget, FOTON or formation authority.

Exact deployment anchors:
- pre-PR `559c44d3e7aea58e79cce5a0b30d1d28571f8959`, run `38817464641` / job `116705630774` GREEN including Android APK;
- final PR head `479241ee9604b017ac4d062e80ebe353878aab46`;
- PR CI `38817902374` / `116707069836` GREEN; Android `38817902279` / `116707067282` GREEN;
- canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`;
- main CI `38818106840` / `116707736739` GREEN; Android `38818106804` / `116707736723` GREEN;
- Pages `38818209120`, build `116708074756` + deploy `116708178250` GREEN.

""",
    "roadmap J6B-D block",
)
text = replace_once(
    text,
    "## J7 — Bonus Challenge Rounds\nStatus: PLANNED\n\n20–40 s rhythm breakers: precision, rescue, collection, evasive corridors, pursuit, affinity puzzles, obstacle navigation, timed survival and survival without firing.",
    """## J7 — Bonus Challenge Rounds
Status: **NEXT ARCHITECTURE / DISCOVERY TARGET AFTER DOC34 CLOSURE**

20–40 s rhythm breakers: precision, rescue, collection, evasive corridors, pursuit, affinity puzzles, obstacle navigation, timed survival and survival without firing.

DOC34 activates discovery only. The candidate list above is not a frozen implementation contract. Discovery must decide the first justified challenge and prove its mode scope, lifecycle/pause behavior, success/failure semantics, fairness, UI/telegraph needs, and whether it requires any spawn/arena/score/reward/economy authority. No J7 subphase name is frozen yet.""",
    "roadmap J7 activation",
)
for required in ["## J8 — Additional Game Modes", "## J15 — Gameplay Integration & Long-Range Balance", "## ES-14 — Living Warfront", "## Recovery discipline"]:
    if required not in text:
        raise SystemExit(f"roadmap lost required suffix marker: {required}")
path.write_text(text)
