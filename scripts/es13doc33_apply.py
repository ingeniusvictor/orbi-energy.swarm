from pathlib import Path
import re

CANON = "1ad68edc1fd15ffa15e1cf6aa139d3d97a547623"
PARENT = "007f1c6744300d47d9e1f43f9cb943e74d70379d"
TREE = "4fad16370a449e88810a5a4742ba2e9d1c969f17"


def sub_once(text, pattern, repl, name, flags=re.S):
    out, n = re.subn(pattern, repl, text, count=1, flags=flags)
    if n != 1:
        raise SystemExit(f"{name}: expected one match, got {n}")
    return out


def replace_once(text, old, new, name):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{name}: expected one literal match, got {n}")
    return text.replace(old, new, 1)


# PROJECT_CONTINUITY
p = Path("docs/PROJECT_CONTINUITY.md")
t = p.read_text()
t = sub_once(
    t,
    r"## Current certified gameplay canonical\n\n.*?Version remains `0\.2\.0-beta\.1`\. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay\.",
    f"""## Current certified gameplay canonical

`{CANON}`

Phase: **ES-13J6B-C — Pure Dynamic Event Effect-Mapping Compatibility Contract**
Status: **DEPLOYED / FROZEN**
Issue: #387 — CLOSED / completed
Delivery: PR #388 — squash merged

Single parent: `{PARENT}` — DOC32 documentation canonical.

Canonical tree: `{TREE}`.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.""",
    "continuity current canonical",
)
t = replace_once(
    t,
    "- DOC32 — J6B-B closure & J6B-C contract-first effect-mapping activation: Issue #385, branch `docs/es-13-j6bb-closure-j6bc-activation`, documentation-only closure in progress from gameplay canonical `dcd39a173da7635bf85db6844dc86aeca6c1f38c`.",
    "- DOC32 — J6B-B closure & J6B-C contract-first effect-mapping activation: `007f1c6744300d47d9e1f43f9cb943e74d70379d` — Issue #385 / PR #386.\n- DOC33 — J6B-C closure & J6B-D controlled live adoption activation: Issue #389, branch `docs/es-13-j6bc-closure-j6bd-activation`, documentation-only closure in progress from gameplay canonical `1ad68edc1fd15ffa15e1cf6aa139d3d97a547623`.",
    "continuity DOC32/DOC33",
)
if "## J6B-C result" in t:
    raise SystemExit("continuity already contains J6B-C result")
j6bc_result = f"""## J6B-C result
J6B-C froze a pure compatibility-only mapping from the deterministic J6B-B event identity selection onto already-existing Infinite mutator semantics. It does not apply live effects, project runtime magnitudes or create fallback semantics.

Frozen compatibility table:
- `SOLAR_STORM` → `ELECTRICAL_STORM`;
- `QUANTUM_RIFT` → `MAGNETIC_DRIFT`;
- `BLACKOUT_SURGE` → `REDUCED_VISIBILITY`;
- `CRYSTAL_RUSH` → `UNSTABLE_RESOURCE_FIELDS`;
- `DYSON_ECLIPSE` → explicit `UNMAPPED` / fail-closed.

Certified boundaries:
- consumes only a valid current J6B-B `SELECTION_ONLY` projection;
- immutable `COMPATIBILITY_ONLY` metadata only;
- existing `runtimeMutatorEffects.ts`, `runtimeEnvironmentalFields.ts` and Infinite recipe/director authorities remain authoritative;
- no `EnergySwarmGame.tsx` adoption, runtime/environment mutation, effect magnitude duplication, RNG/clock/seed/recipe authority, spawn/progression, collections, combat/economy, scans/lookups, cap/budget changes, entity mutation, FOTON or formation changes.

Final product scope exactly:
- `src/game/dynamicMidSectorEventEffectMapping.ts`;
- `tests/es-13j6bc-dynamic-mid-sector-event-effect-mapping.test.mjs`;
- `tests/gameplay/dynamic-mid-sector-event-effect-mapping.test.ts`.

## J6B-C exact evidence
- DOC32 baseline `{PARENT}`;
- pre-PR SHA `b4ab4fa7afa46061d92eec42befd9bdc023cbbb1`, run `38811558582` / job `116685777412` GREEN including Android APK build/verify/upload;
- final PR #388 head `b19e97adfead5dd5734f8bc19614af29ec474e37`;
- PR CI `38811968442` / `116687154525` GREEN;
- PR Android `38811968545` / `116687155789` GREEN including Build/Verify/Upload APK;
- canonical `{CANON}`, single parent `{PARENT}`, tree `{TREE}`;
- canonical diff exactly three certified product files;
- main CI `38814014351` / `116694041805` GREEN;
- main Android `38814014266` / `116694040113` GREEN including Build/Verify/Upload APK;
- Pages `38814144837`: build `116694455490` + deploy `116694621071` GREEN.

Issue #387 CLOSED / completed. J6B-C is **DEPLOYED / FROZEN**.

"""
t = replace_once(t, "## Next gameplay phase", j6bc_result + "## Next gameplay phase", "continuity J6B-C result insert")
t = sub_once(
    t,
    r"## Next gameplay phase\n\n### ES-13J6B-C — Pure Dynamic Event Effect-Mapping Compatibility Contract\n.*?(?=## Gameplay chronology)",
    """## Next gameplay phase

### ES-13J6B-D — Controlled Live Dynamic Event Adoption
Status: **NEXT ENGINEERING TARGET AFTER DOC33 CLOSURE**

J6A opportunity timing, J6B-A identity vocabulary, J6B-B deterministic selection and J6B-C compatibility mapping are frozen. J6B-D is the first slice allowed to investigate controlled live adoption.

Required direction:
- discovery-first: identify one existing live environmental seam and prove exact ownership before mutation;
- Infinite only unless a dedicated Issue proves otherwise; Campaign remains isolated;
- only the four J6B-C `MAPPED` identities may be considered; `DYSON_ECLIPSE` remains `UNMAPPED` and must fail closed;
- reuse existing `runtimeMutatorEffects.ts` / environmental-field semantics and magnitudes; no second environmental director and no copied tuning;
- preserve J6A opportunity cadence and J6B-B deterministic identity selection; no new RNG, seed, timer or clock authority;
- prove lifecycle, duration/expiry, pause behavior, reset boundaries, fairness/telegraph and attribution before live behavior can be frozen;
- no new entity/projectile collection, spawn/progression authority, damage/defeat/score/reward/economy authority, scan/index, cap/budget change, entity creation/removal, FOTON GLB or formation change unless separately justified;
- exact adoption seam is not frozen by DOC33 and requires a dedicated J6B-D Issue.

""",
    "continuity next phase",
)
t = replace_once(
    t,
    "`J6B-C Pure Dynamic Event Effect-Mapping Compatibility Contract → J6B-D+ Controlled Live Event Adoption → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "`J6B-D Controlled Live Dynamic Event Adoption → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "continuity chronology",
)
t = sub_once(
    t,
    r"Suggested handoff:\n> .*?\n\n## Update obligation",
    f"""Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J6B-C gameplay canonical is `{CANON}`, fully DEPLOYED / FROZEN via Issue #387 / PR #388 with pure `COMPATIBILITY_ONLY` mappings and post-main CI/Android/Pages GREEN. Complete DOC33 if still open, then perform J6B-D architecture/discovery before any controlled live adoption. Reuse only frozen J6A/J6B-A/J6B-B/J6B-C facts and existing Infinite runtime environmental authority; keep `DYSON_ECLIPSE` fail-closed/unmapped. Prove lifecycle, fairness/telegraph, attribution, pause/reset behavior and exact adoption seam before writing live code. Keep J3C-C, J4D+ and manual blockers deferred. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.

## Update obligation""",
    "continuity handoff",
)
p.write_text(t)

# IMPLEMENTATION_LEDGER
p = Path("docs/IMPLEMENTATION_LEDGER.md")
t = p.read_text()
row = "| ES-13J6B-B — Pure Deterministic Dynamic Event Identity Selection Contract | DEPLOYED / FROZEN | `dcd39a173da7635bf85db6844dc86aeca6c1f38c` | #383 | #384 |"
t = replace_once(
    t,
    row,
    row + f"\n| ES-13J6B-C — Pure Dynamic Event Effect-Mapping Compatibility Contract | DEPLOYED / FROZEN | `{CANON}` | #387 | #388 |",
    "ledger milestone row",
)
t = replace_once(
    t,
    "- DOC32 — J6B-B closure & J6B-C contract-first effect-mapping activation: Issue #385, branch `docs/es-13-j6bb-closure-j6bc-activation`, in progress from gameplay canonical `dcd39a173da7635bf85db6844dc86aeca6c1f38c`.",
    "- DOC32 — J6B-B closure & J6B-C contract-first effect-mapping activation: `007f1c6744300d47d9e1f43f9cb943e74d70379d` — Issue #385 / PR #386.\n- DOC33 — J6B-C closure & J6B-D controlled live adoption activation: Issue #389, branch `docs/es-13-j6bc-closure-j6bd-activation`, in progress from gameplay canonical `1ad68edc1fd15ffa15e1cf6aa139d3d97a547623`.",
    "ledger DOC32/DOC33",
)
if "### J6B-C — Pure Dynamic Event Effect-Mapping Compatibility Contract" in t:
    raise SystemExit("ledger already contains J6B-C evidence")
evidence = f"""### J6B-C — Pure Dynamic Event Effect-Mapping Compatibility Contract
- Frozen mappings: `SOLAR_STORM → ELECTRICAL_STORM`, `QUANTUM_RIFT → MAGNETIC_DRIFT`, `BLACKOUT_SURGE → REDUCED_VISIBILITY`, `CRYSTAL_RUSH → UNSTABLE_RESOURCE_FIELDS`; `DYSON_ECLIPSE → UNMAPPED` fail-closed.
- Pre-PR `b4ab4fa7afa46061d92eec42befd9bdc023cbbb1`, run `38811558582` / job `116685777412` GREEN including Android.
- Final PR #388 head `b19e97adfead5dd5734f8bc19614af29ec474e37`; PR CI `38811968442` / `116687154525` GREEN; PR Android `38811968545` / `116687155789` GREEN.
- Canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`, exact diff three product files.
- Main CI `38814014351` / `116694041805` GREEN; Android `38814014266` / `116694040113` GREEN; Pages `38814144837`, build `116694455490` + deploy `116694621071` GREEN.
- No live adoption or runtime magnitude ownership; existing Infinite environmental authorities remain authoritative.

"""
t = replace_once(t, "## Frozen manual/physical blockers", evidence + "## Frozen manual/physical blockers", "ledger evidence insert")
t = sub_once(
    t,
    r"## Next planned gameplay\n\n### ES-13J6B-C — Pure Dynamic Event Effect-Mapping Compatibility Contract\n.*?(?=## Program sequence)",
    """## Next planned gameplay

### ES-13J6B-D — Controlled Live Dynamic Event Adoption
Status: **NEXT ENGINEERING TARGET AFTER DOC33 CLOSURE**.

J6B-D must perform architecture/discovery before any runtime write. It may consider only the four frozen J6B-C mapped identities and must leave `DYSON_ECLIPSE` unmapped/fail-closed. Existing Infinite mutator/environment projection remains authoritative for effect magnitudes and clamps. The dedicated J6B-D Issue must prove one controlled live adoption seam plus lifecycle, expiry/reset/pause behavior, fairness/telegraph and attribution without creating a parallel environmental director, RNG/clock/seed authority, collections, scan/index, cap/budget, spawn/progression or duplicate combat/economy authority.

J4D+ additional tactical families remain deferred: FORMATION_BREAKER/JAMMER require hard-control spacing/recovery proof; MINE_WEAVER/MIRROR_WARDEN require genuine mine/mirror mechanics. J3C-C remains deferred, not cancelled.

""",
    "ledger next planned gameplay",
)
t = replace_once(
    t,
    "`J6B-C Pure Dynamic Event Effect-Mapping Compatibility Contract → J6B-D+ Controlled Live Event Adoption → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`",
    "`J6B-D Controlled Live Dynamic Event Adoption → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`",
    "ledger sequence",
)
p.write_text(t)

# ROADMAP — the J6B-C section is currently the tail and becomes frozen J6B-C + next J6B-D.
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
t = p.read_text()
marker = "### J6B-C — Pure Dynamic Event Effect-Mapping Compatibility Contract"
idx = t.find(marker)
if idx < 0 or t.find(marker, idx + 1) >= 0:
    raise SystemExit("roadmap J6B-C marker missing or duplicated")
replacement = f"""### J6B-C — Pure Dynamic Event Effect-Mapping Compatibility Contract
Status: **DEPLOYED / FROZEN**
Canonical: `{CANON}`  
Issue #387 / PR #388

J6B-C freezes compatibility metadata only between the deterministic J6B-B selection and existing Infinite mutator semantics:
- `SOLAR_STORM` → `ELECTRICAL_STORM`;
- `QUANTUM_RIFT` → `MAGNETIC_DRIFT`;
- `BLACKOUT_SURGE` → `REDUCED_VISIBILITY`;
- `CRYSTAL_RUSH` → `UNSTABLE_RESOURCE_FIELDS`;
- `DYSON_ECLIPSE` → explicit `UNMAPPED` / fail-closed.

Certified boundaries:
- valid current J6B-B `SELECTION_ONLY` input only;
- immutable `COMPATIBILITY_ONLY` result;
- no live effect application or environment/runtime mutation;
- no duplicated effect magnitudes or clamps;
- no `EnergySwarmGame.tsx`, spawn/progression, collection, combat/economy, entity lookup/scan, timer/RNG/seed/recipe, cap/budget or entity create/remove/mutate authority;
- existing `runtimeMutatorEffects.ts`, `runtimeEnvironmentalFields.ts` and Infinite recipe/director remain authoritative.

Exact deployment anchors:
- pre-PR `b4ab4fa7afa46061d92eec42befd9bdc023cbbb1`, run `38811558582` / job `116685777412` GREEN including Android APK;
- final PR head `b19e97adfead5dd5734f8bc19614af29ec474e37`;
- PR CI `38811968442` / `116687154525` GREEN; Android `38811968545` / `116687155789` GREEN;
- canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`;
- main CI `38814014351` / `116694041805` GREEN; Android `38814014266` / `116694040113` GREEN;
- Pages `38814144837`, build `116694455490` + deploy `116694621071` GREEN.

### J6B-D — Controlled Live Dynamic Event Adoption
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC33 CLOSURE**

Required discovery direction:
- locate and prove one existing live environmental adoption seam before any mutation;
- Infinite only unless separately justified; preserve Campaign isolation;
- only J6B-C `MAPPED` identities may be adopted; `DYSON_ECLIPSE` remains `UNMAPPED` and fail-closed;
- reuse current mutator/environment effect magnitudes and clamps; no second environmental director or copied tuning;
- preserve J6A opportunity cadence and J6B-B deterministic identity selection; no new RNG, seed, clock or timer authority;
- prove event lifecycle/duration, expiry, pause, reset boundaries, fairness/telegraph and attribution;
- no new collection, full-array scan/index, entity creation/removal, spawn/progression, combat/economy authority, cap/budget changes, FOTON GLB or formation changes without separate justification;
- exact live seam and lifecycle remain unfrozen until the dedicated J6B-D Issue completes discovery.
"""
p.write_text(t[:idx] + replacement)
