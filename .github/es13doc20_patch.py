from pathlib import Path

BASE_SHA = "df60f62565a1d3cdf6058d2e1a4049f5870f27b7"
J5A_TREE = "8296313607b688bef5412fcb046341e609852ce4"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def replace_section(text: str, start: str, end: str, body: str, label: str) -> str:
    if text.count(start) != 1:
        raise RuntimeError(f"{label}: start marker count != 1")
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    if text.find(end, end_index + len(end)) != -1:
        raise RuntimeError(f"{label}: end marker is not unique after start")
    return text[:start_index] + body.rstrip() + "\n\n" + text[end_index:]


continuity_path = Path("docs/PROJECT_CONTINUITY.md")
continuity = continuity_path.read_text(encoding="utf-8")

continuity = replace_section(
    continuity,
    "## Current certified gameplay canonical",
    "## J4C-C result",
    f"""## Current certified gameplay canonical

`{BASE_SHA}`

Phase: **ES-13J5A — Pure Priority-Target Contract**
Status: **DEPLOYED / FROZEN**
Issue: #335 — CLOSED / completed
Delivery: PR #336 — squash merged

Single parent: `907bce8c494a5c7b9a4965e09dca677d919560f4` — DOC19 documentation canonical.

Canonical tree: `{J5A_TREE}`, exactly equal to final PR-head tree.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.""",
    "continuity current canonical",
)

j5a_result = f"""## J5A result
J5A established the first pure Priority Target contract without creating a new live enemy authority.

Certified contract:
- exactly one immutable semantic profile: `COMMAND_CORE` / `Command Core`;
- tactical intent `FOCUS_CORE_TO_BREAK_LINK` with priority `HIGH`;
- objective `BREAK_COMMAND_LINK`;
- deterministic defeat projection `COMMAND_LINK_BROKEN`;
- effect mode `SIGNAL_ONLY`;
- unsupported profile identifiers fail closed;
- objective explicitly applies no damage, kills no linked targets, awards no score/reward and mutates no formation;
- shared authority contract owns no spawn, entity/projectile collection, damage, defeat, score, reward, formation, clock, RNG, full-array scan, cap mutation or entity creation;
- no new `EnemyType`, no runtime field and no live import/adoption in `EnergySwarmGame.tsx`;
- J3 formation authority, J4 tactical families, FOTON GLB and player/FOTON formations remain isolated.

Final product scope exactly:
- `src/game/priorityTargetContract.ts`;
- `tests/es-13j5a-priority-target-contract.test.mjs`;
- `tests/gameplay/priority-target-contract.test.ts`.

## J5A exact evidence
- DOC19 baseline `907bce8c494a5c7b9a4965e09dca677d919560f4`;
- pre-PR SHA `257cfb8dd7a21a046cf87c2c2af9b501e462f3ad`, run `38559123546` / job `115835528447` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact product-scope guard and Android APK build/verify/upload;
- final PR #336 head `72ea40a2935df0d3bbf7b4db45be5a8647380524`;
- PR CI `38559564286` / `115836993908` GREEN;
- PR Android `38559564155` / `115836993731` GREEN including Build/Verify/Upload APK;
- canonical `{BASE_SHA}`, single parent `907bce8c494a5c7b9a4965e09dca677d919560f4`, tree `{J5A_TREE}` equal to final PR-head tree;
- canonical diff exactly three certified product files;
- main CI `38559826229` / `115837852423` GREEN;
- main Android `38559826354` / `115837852853` GREEN including Build/Verify/Upload APK;
- Pages `38559959364`: build `115838294773` + deploy `115838455401` GREEN.

Issue #335 CLOSED / completed. J5A is **DEPLOYED / FROZEN**.
"""
continuity = replace_once(
    continuity,
    "## ES-13 gameplay canonicals",
    j5a_result + "\n## ES-13 gameplay canonicals",
    "continuity J5A result insertion",
)

continuity = replace_once(
    continuity,
    "- J4C-C — Controlled Normal-Progression Siege Adoption: `1131c06db406ca0170d5dad33ecb7f4610a06b96`.\n",
    "- J4C-C — Controlled Normal-Progression Siege Adoption: `1131c06db406ca0170d5dad33ecb7f4610a06b96`.\n"
    f"- J5A — Pure Priority-Target Contract: `{BASE_SHA}`.\n",
    "continuity gameplay canonical list",
)

continuity = replace_once(
    continuity,
    "- DOC19 — J4C-C closure & J5A activation: Issue #333, branch `docs/es-13-j4c-c-closure-j5a-activation`, documentation-only closure in progress from gameplay canonical `1131c06db406ca0170d5dad33ecb7f4610a06b96`.\n",
    "- DOC19 — J4C-C closure & J5A activation: `907bce8c494a5c7b9a4965e09dca677d919560f4` — Issue #333 / PR #334.\n"
    f"- DOC20 — J5A closure & J5B activation: Issue #337, branch `docs/es-13-j5a-closure-j5b-activation`, documentation-only closure in progress from gameplay canonical `{BASE_SHA}`.\n",
    "continuity documentation canonicals",
)

continuity = replace_section(
    continuity,
    "## Next gameplay phase",
    "## Resolved diagnostics",
    """## Next gameplay phase

### ES-13J5B — Pure Command-Link Binding Contract
Status: **NEXT ENGINEERING TARGET AFTER DOC20 CLOSURE**

J5B remains pure and zero-live-authority. Discovery after J5A confirmed that every live enemy may already carry the optional J3 `enemyFormation` assignment with bounded `groupId`, `memberIndex` and `memberCount`, while J3 remains the sole formation assignment/motion authority.

Required direction:
- consume already-existing bounded formation facts as data; do not own or mutate J3 director state;
- support only currently certified live group sizes 2 and 3;
- select exactly one deterministic `COMMAND_CORE` member per supported group;
- expose bounded linked-member metadata only;
- invalid/empty group ids, unsupported group sizes and out-of-range member indices fail closed;
- no new `EnemyType`, runtime field, live spawn/progression adoption, collection, scan, timer/RNG or cap authority;
- no damage, death, score, reward or formation mutation;
- preserve J5A `SIGNAL_ONLY` semantics and all J1/J2/J3/J4/FOTON/player authorities;
- actual live binding/adoption and chain-reaction behavior remain for a later J5 slice after J5B certification.

J4D+ additional tactical families remain **DEFERRED / NOT CURRENTLY JUSTIFIED**. `FORMATION_BREAKER` and `JAMMER` still require independent hard-control spacing/recovery proof; `MINE_WEAVER` and `MIRROR_WARDEN` still require genuine mine/mirror mechanics. J3C-C remains deferred, not cancelled.""",
    "continuity next gameplay",
)

continuity = replace_once(
    continuity,
    "`J5A Pure Priority-Target Contract → J5B+ Controlled Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "`J5B Pure Command-Link Binding Contract → J5C+ Controlled Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "continuity chronology",
)

continuity = replace_section(
    continuity,
    "Suggested handoff:",
    "## Update obligation",
    f"""Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J5A gameplay canonical is `{BASE_SHA}`, fully DEPLOYED / FROZEN via Issue #335 / PR #336 with exact three-file product scope. Complete DOC20 if still open, then implement J5B Pure Command-Link Binding Contract only as a deterministic mapping over existing bounded J3 formation assignments; no live adoption yet. Keep J4D+ families and J3C-C deferred until their prerequisites are proven. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.""",
    "continuity handoff",
)
continuity_path.write_text(continuity, encoding="utf-8")

ledger_path = Path("docs/IMPLEMENTATION_LEDGER.md")
ledger = ledger_path.read_text(encoding="utf-8")
ledger = replace_once(
    ledger,
    "| ES-13J4C-C — Controlled Normal-Progression Siege Adoption | DEPLOYED / FROZEN | `1131c06db406ca0170d5dad33ecb7f4610a06b96` | #331 | #332 |\n",
    "| ES-13J4C-C — Controlled Normal-Progression Siege Adoption | DEPLOYED / FROZEN | `1131c06db406ca0170d5dad33ecb7f4610a06b96` | #331 | #332 |\n"
    f"| ES-13J5A — Pure Priority-Target Contract | DEPLOYED / FROZEN | `{BASE_SHA}` | #335 | #336 |\n",
    "ledger completed row",
)

ledger_j5a = f"""### J5A — Pure Priority-Target Contract
J5A established one immutable semantic `COMMAND_CORE` profile with tactical intent `FOCUS_CORE_TO_BREAK_LINK`, objective `BREAK_COMMAND_LINK`, defeat signal `COMMAND_LINK_BROKEN` and `SIGNAL_ONLY` effect mode. Unsupported profiles fail closed. The contract explicitly owns no spawn/entity/projectile collection, damage, defeat, score, reward, formation, clock, RNG, scan, cap mutation or entity-creation authority. No new `EnemyType` or live runtime adoption was introduced.

Final product diff exactly:
- `src/game/priorityTargetContract.ts`;
- `tests/es-13j5a-priority-target-contract.test.mjs`;
- `tests/gameplay/priority-target-contract.test.ts`.

Exact evidence:
- baseline `907bce8c494a5c7b9a4965e09dca677d919560f4`;
- pre-PR `257cfb8dd7a21a046cf87c2c2af9b501e462f3ad`, run `38559123546` / job `115835528447` GREEN including exact scope + Android APK;
- final PR #336 head `72ea40a2935df0d3bbf7b4db45be5a8647380524`;
- PR CI `38559564286` / `115836993908` GREEN; Android `38559564155` / `115836993731` GREEN;
- canonical `{BASE_SHA}`, parent `907bce8c494a5c7b9a4965e09dca677d919560f4`, tree `{J5A_TREE}` equal to final PR tree;
- main CI `38559826229` / `115837852423` GREEN; Android `38559826354` / `115837852853` GREEN;
- Pages `38559959364`, build `115838294773` + deploy `115838455401` GREEN.

Issue #335 CLOSED / completed. J5A is **DEPLOYED / FROZEN**.

"""
ledger = replace_once(
    ledger,
    "## Documentation canonicals",
    ledger_j5a + "## Documentation canonicals",
    "ledger J5A evidence insertion",
)
ledger = replace_once(
    ledger,
    "- DOC19 — J4C-C closure & J5A activation: Issue #333, branch `docs/es-13-j4c-c-closure-j5a-activation`, in progress from gameplay canonical `1131c06db406ca0170d5dad33ecb7f4610a06b96`.\n",
    "- DOC19 — J4C-C closure & J5A activation: `907bce8c494a5c7b9a4965e09dca677d919560f4` — Issue #333 / PR #334.\n"
    f"- DOC20 — J5A closure & J5B activation: Issue #337, branch `docs/es-13-j5a-closure-j5b-activation`, in progress from gameplay canonical `{BASE_SHA}`.\n",
    "ledger documentation canonicals",
)
ledger = replace_once(
    ledger,
    """## Next planned gameplay

### ES-13J5A — Pure Priority-Target Contract
Status: **NEXT ENGINEERING TARGET AFTER DOC19 CLOSURE**.

Begin J5 with a pure zero-live-authority contract because the current runtime has no explicit Commander/priority-node EnemyType or dedicated priority-target authority. Define bounded tactical/objective semantics first; do not add live spawns, chain reactions or a parallel entity system in J5A. Future effects must route through existing damage/defeat/cap authorities.

J4D+ additional tactical families remain deferred: FORMATION_BREAKER/JAMMER require hard-control spacing/recovery proof; MINE_WEAVER/MIRROR_WARDEN require genuine mine/mirror mechanics. J3C-C remains deferred, not cancelled.""",
    """## Next planned gameplay

### ES-13J5B — Pure Command-Link Binding Contract
Status: **NEXT ENGINEERING TARGET AFTER DOC20 CLOSURE**.

Use existing J3 `enemyFormation` facts as bounded input only. J5B must deterministically identify exactly one semantic `COMMAND_CORE` member and linked members for certified group sizes 2/3, fail closed on invalid group data, and output metadata only. It must not add an EnemyType/runtime field, mutate J3 formation state, adopt live spawns, apply damage/death/score/reward effects, scan live arrays, or own clocks/RNG/caps.

J4D+ additional tactical families remain deferred: FORMATION_BREAKER/JAMMER require hard-control spacing/recovery proof; MINE_WEAVER/MIRROR_WARDEN require genuine mine/mirror mechanics. J3C-C remains deferred, not cancelled.""",
    "ledger next gameplay",
)
ledger_path.write_text(ledger, encoding="utf-8")

roadmap_path = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
roadmap = roadmap_path.read_text(encoding="utf-8")
roadmap = replace_section(
    roadmap,
    "### J5A — Pure Priority-Target Contract",
    "## J6 — Dynamic Mid-Sector Events",
    f"""### J5A — Pure Priority-Target Contract
Status: **DEPLOYED / FROZEN**
Canonical: `{BASE_SHA}`
Issue #335 / PR #336

Certified contract:
- exactly one immutable semantic profile: `COMMAND_CORE` / `Command Core`;
- tactical decision `FOCUS_CORE_TO_BREAK_LINK`, priority `HIGH`;
- objective `BREAK_COMMAND_LINK`;
- deterministic defeat signal `COMMAND_LINK_BROKEN`;
- `SIGNAL_ONLY` effect mode;
- unsupported profile IDs fail closed;
- no damage, linked-target kill, score, reward or formation mutation;
- zero spawn/entity/projectile collection, damage, defeat, score, reward, formation, clock, RNG, full-array scan, cap-mutation or entity-creation authority;
- no new `EnemyType`, runtime field or live adoption.

Exact deployment anchors:
- pre-PR `257cfb8dd7a21a046cf87c2c2af9b501e462f3ad`, run `38559123546` / job `115835528447` GREEN including scope guard + Android APK;
- final PR #336 head `72ea40a2935df0d3bbf7b4db45be5a8647380524`;
- PR CI `38559564286` / `115836993908` GREEN; Android `38559564155` / `115836993731` GREEN;
- canonical `{BASE_SHA}`, parent `907bce8c494a5c7b9a4965e09dca677d919560f4`, tree `{J5A_TREE}`;
- main CI `38559826229` / `115837852423` GREEN; Android `38559826354` / `115837852853` GREEN;
- Pages `38559959364`, build `115838294773` + deploy `115838455401` GREEN.

### J5B — Pure Command-Link Binding Contract
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC20 CLOSURE**

Discovery after J5A confirmed that existing enemies already expose optional J3 `enemyFormation` assignment metadata (`groupId`, `memberIndex`, `memberCount`, route/mirror/timing/anchor facts). J5B will reuse those bounded facts as pure input rather than introduce a Commander type or second formation authority.

Design constraints:
- pure contract only; no live adoption in J5B;
- support only certified live group sizes 2 and 3;
- exactly one deterministic `COMMAND_CORE` member per supported group;
- linked-member output is bounded metadata only;
- empty/invalid group IDs, unsupported sizes and out-of-range indices fail closed;
- do not mutate or own J3 director/formation state;
- no new `EnemyType`, `Enemy` field, collection, entity scan, clock/RNG or cap authority;
- no damage, defeat, score, reward or formation mutation;
- preserve J5A `SIGNAL_ONLY` semantics;
- preserve Campaign/Infinite isolation, J1/J2, frozen J3/J4 behavior, FOTON GLB and player/FOTON formation ownership;
- live Command Core binding and chain-reaction effects remain deferred to a later J5 slice after this pure contract is certified.""",
    "roadmap J5A/J5B",
)
roadmap_path.write_text(roadmap, encoding="utf-8")

for path in (continuity_path, ledger_path, roadmap_path):
    text = path.read_text(encoding="utf-8")
    if "\r\n" in text:
        raise RuntimeError(f"{path}: CRLF unexpectedly present")
    if not text.endswith("\n"):
        path.write_text(text + "\n", encoding="utf-8")

print("ES-13DOC20 patch applied to exactly three documentation files.")
