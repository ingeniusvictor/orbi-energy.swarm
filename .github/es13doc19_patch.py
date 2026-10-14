from pathlib import Path

BASE = "1131c06db406ca0170d5dad33ecb7f4610a06b96"
DOCS = {
    "continuity": Path("docs/PROJECT_CONTINUITY.md"),
    "ledger": Path("docs/IMPLEMENTATION_LEDGER.md"),
    "roadmap": Path("docs/ES13_GAMEPLAY_ROADMAP.md"),
}


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def replace_between(text: str, start: str, end: str, new_block: str, label: str) -> str:
    if text.count(start) != 1:
        raise SystemExit(f"{label}: start marker count={text.count(start)}")
    if text.count(end) != 1:
        raise SystemExit(f"{label}: end marker count={text.count(end)}")
    before, rest = text.split(start, 1)
    _, after = rest.split(end, 1)
    return before + new_block.rstrip() + "\n\n" + end + after


continuity = DOCS["continuity"].read_text(encoding="utf-8")
continuity = replace_between(
    continuity,
    "## Current certified gameplay canonical",
    "Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.",
    """## Current certified gameplay canonical

`1131c06db406ca0170d5dad33ecb7f4610a06b96`

Phase: **ES-13J4C-C — Controlled Normal-Progression Siege Adoption**
Status: **DEPLOYED / FROZEN**
Issue: #331 — CLOSED / completed
Delivery: PR #332 — squash merged

Single parent: `72c4359af106d6f955e9932c6c72a836b2922ab8` — DOC18 documentation canonical.

Canonical tree: `ff27ceedc5460d98fefe373850d1fe20e3272098`, exactly equal to final PR-head tree.""",
    "continuity current canonical",
)
continuity = replace_between(
    continuity,
    "## J4C-B result",
    "## ES-13 gameplay canonicals",
    """## J4C-C result
J4C-C adopted the already-certified `ARTILLERY_CARRIER / SIEGE_PRISM` family into bounded normal Infinite progression through the existing tactical replacement seam.

Certified live behavior:
- Campaign remains disabled;
- normal SIEGE adoption begins in Infinite HIGH_PRESSURE progression with minimum sector 51;
- deterministic cadence is `(sector - 52) % 8 === 0`;
- milestone and recovery sectors remain excluded;
- adoption is final-wave-only with a null milestone descriptor;
- exactly one existing spawn-budget ordinal, `Math.floor(enemyBudget / 2)`, is replaced; density does not increase;
- J4B RIFT cadence remains unchanged and is mathematically disjoint from SIEGE cadence;
- first reachable normal SIEGE sectors are 52, 68, 84, 92, 108, 116, 124, 132...;
- sector 100 `SIEGE_CATHEDRAL` remains excluded from normal tactical adoption;
- J4C-B 700 ms target-lock / COMMIT / ACK Siege Volley authority remains unchanged;
- three projectiles, speed `4.0`, spread `0.12`, cooldown `150 + Math.random() * 70`, `MAX_ENEMIES`, `MAX_PROJECTILES`, hostile projectile budget and entity arrays remain unchanged;
- `SIEGE_CATHEDRAL` support remains `SIEGE_PRISM`, max count 2, cooldown 8000 ms;
- evolution, generic elite overlay and J3 formation authorities remain isolated from tactical SIEGE;
- no new `EnemyType`, collection, director, family-only full-array scan, independent timer or RNG authority was introduced.

The first pre-certification exposed one historical J4C-B static assertion that correctly forbade normal SIEGE progression during J4C-B. J4C-C updated that test without weakening the frozen J4C-B boundary: the tactical adoption seam may select SIEGE but remains forbidden from acquiring volley/projectile/cooldown authority.

## J4C-C exact evidence
- DOC18 baseline `72c4359af106d6f955e9932c6c72a836b2922ab8`;
- pre-PR SHA `c6dc7dc48dd8028dd6de1f6f9fae79a2d20b6301`, run `38556345439` / job `115826341912` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact product-scope guard and Android APK build/verify/upload;
- final PR #332 head `e80a54c9823939862beba6a620e4ed363535b61e`;
- PR CI `38556750449` / `115827692257` GREEN;
- PR Android `38556750462` / `115827691810` GREEN including Build/Verify/Upload APK;
- canonical `1131c06db406ca0170d5dad33ecb7f4610a06b96`, single parent `72c4359af106d6f955e9932c6c72a836b2922ab8`, tree `ff27ceedc5460d98fefe373850d1fe20e3272098` equal to final PR head tree;
- canonical diff exactly five certified product files;
- main CI `38556901537` / `115828194301` GREEN;
- main Android `38556901696` / `115828194800` GREEN including Build/Verify/Upload APK;
- Pages `38557000846`: build `115828516452` + deploy `115828677107` GREEN.

Issue #331 CLOSED / completed. J4C-C is **DEPLOYED / FROZEN**.""",
    "continuity J4C-C result",
)
continuity = replace_once(
    continuity,
    "- J4C-B — Live Siege Volley Telegraph Integration: `2e16ff9a577128ffb06211b612116553928c8cda`.\n",
    "- J4C-B — Live Siege Volley Telegraph Integration: `2e16ff9a577128ffb06211b612116553928c8cda`.\n- J4C-C — Controlled Normal-Progression Siege Adoption: `1131c06db406ca0170d5dad33ecb7f4610a06b96`.\n",
    "continuity gameplay canonical list",
)
continuity = replace_once(
    continuity,
    "- DOC18 — J4C-B closure & J4C-C activation: Issue #329, branch `docs/es-13-j4c-b-closure-j4c-c-activation`, documentation-only closure in progress from gameplay canonical `2e16ff9a577128ffb06211b612116553928c8cda`.\n",
    "- DOC18 — J4C-B closure & J4C-C activation: `72c4359af106d6f955e9932c6c72a836b2922ab8` — Issue #329 / PR #330.\n- DOC19 — J4C-C closure & J5A activation: Issue #333, branch `docs/es-13-j4c-c-closure-j5a-activation`, documentation-only closure in progress from gameplay canonical `1131c06db406ca0170d5dad33ecb7f4610a06b96`.\n",
    "continuity documentation canonicals",
)
continuity = replace_between(
    continuity,
    "## Next gameplay phase",
    "## Resolved diagnostics",
    """## Next gameplay phase

### ES-13J5A — Pure Priority-Target Contract
Status: **NEXT ENGINEERING TARGET AFTER DOC19 CLOSURE**

J5A begins the Priority Targets & Chain-Reaction Combat program with a pure, zero-live-authority contract. Read-only discovery found no existing `Commander` / priority-node `EnemyType` and no explicit priority-target runtime authority, so J5A must define semantics before any live spawn or chain-reaction adoption.

Required direction:
- pure contract first; no live spawn/progression adoption in J5A;
- no new `EnemyType` unless dedicated discovery proves existing representation cannot satisfy the contract and the phase explicitly approves it;
- priority targets must force a tactical/objective decision, not merely add HP;
- define bounded target identity, tactical question, vulnerability/objective semantics and fail-closed lookup/projection;
- future chain reactions must route through existing damage/defeat authorities and may not bypass caps or create uncontrolled AoE authority;
- no second entity/projectile collection, uncontrolled full-array scan, independent timer/RNG authority or silent score/economy tuning;
- preserve Campaign/Infinite isolation, J1/J2, J3 enemy formations, frozen J4 family behavior, FOTON GLB and player/FOTON formation ownership.

J4D+ additional tactical families remain **DEFERRED / NOT CURRENTLY JUSTIFIED**. `FORMATION_BREAKER` and `JAMMER` still require independent hard-control spacing/recovery proof; `MINE_WEAVER` and `MIRROR_WARDEN` still require genuine mine/mirror mechanics. J3C-C remains deferred, not cancelled.""",
    "continuity next gameplay",
)
continuity = replace_once(
    continuity,
    "`J4C-C Controlled Siege Progression → J4D+ Additional Tactical Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "`J5A Pure Priority-Target Contract → J5B+ Controlled Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "continuity chronology",
)
old_handoff_start = "Suggested handoff:\n> Continue ORBI Energy Swarm autonomously."
old_handoff_end = "Never touch `main` directly or weaken tests."
if continuity.count(old_handoff_start) != 1 or continuity.count(old_handoff_end) != 1:
    raise SystemExit("continuity handoff markers are not unique")
pre, rest = continuity.split(old_handoff_start, 1)
_, post = rest.split(old_handoff_end, 1)
continuity = pre + """Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J4C-C gameplay canonical is `1131c06db406ca0170d5dad33ecb7f4610a06b96`, fully DEPLOYED / FROZEN via Issue #331 / PR #332 with exact five-file product scope. Complete DOC19 if still open, then implement J5A Pure Priority-Target Contract only after discovery of existing damage/defeat/objective seams. Keep J4D+ families and J3C-C deferred until their prerequisites are proven. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.""" + post
DOCS["continuity"].write_text(continuity, encoding="utf-8")

ledger = DOCS["ledger"].read_text(encoding="utf-8")
ledger = replace_once(
    ledger,
    "| ES-13J4C-B — Live Siege Volley Telegraph Integration | DEPLOYED / FROZEN | `2e16ff9a577128ffb06211b612116553928c8cda` | #326 | #327 + #328 |\n",
    "| ES-13J4C-B — Live Siege Volley Telegraph Integration | DEPLOYED / FROZEN | `2e16ff9a577128ffb06211b612116553928c8cda` | #326 | #327 + #328 |\n| ES-13J4C-C — Controlled Normal-Progression Siege Adoption | DEPLOYED / FROZEN | `1131c06db406ca0170d5dad33ecb7f4610a06b96` | #331 | #332 |\n",
    "ledger milestone row",
)
ledger = replace_once(
    ledger,
    "Issue #326 CLOSED / completed. J4C-B is **DEPLOYED / FROZEN**.\n\n## Documentation canonicals",
    """Issue #326 CLOSED / completed. J4C-B is **DEPLOYED / FROZEN**.

### J4C-C — Controlled Normal-Progression Siege Adoption
J4C-C extended the existing pure tactical replacement seam with the certified `ARTILLERY_CARRIER / SIEGE_PRISM` family while preserving J4B RIFT behavior and all frozen Siege Volley authority boundaries.

Certified policy:
- Campaign disabled; Infinite HIGH_PRESSURE minimum sector 51;
- cadence `(sector - 52) % 8 === 0` with milestone/recovery exclusion and final-wave-only gating;
- exactly one existing budget ordinal replacement at `Math.floor(enemyBudget / 2)`;
- first reachable normal SIEGE sectors 52, 68, 84, 92, 108, 116, 124, 132...;
- RIFT/SIEGE cadence intersection is empty;
- J4C-B target-lock/COMMIT/ACK, projectile count/speed/spread/cooldown and SIEGE_CATHEDRAL support remain unchanged;
- no new type, collection, director, scan, timer/RNG authority, density, cap or budget increase.

Final product diff exactly:
- `src/game/runtimeTacticalEnemyAdoption.ts`;
- `tests/es-13j4b-live-tactical-adoption.test.mjs`;
- `tests/es-13j4c-b-live-siege-volley-integration.test.mjs`;
- `tests/es-13j4c-c-controlled-siege-adoption.test.mjs`;
- `tests/gameplay/runtime-tactical-enemy-adoption.test.ts`.

Exact evidence:
- baseline `72c4359af106d6f955e9932c6c72a836b2922ab8`;
- pre-PR `c6dc7dc48dd8028dd6de1f6f9fae79a2d20b6301`, run `38556345439` / job `115826341912` GREEN including exact scope + Android APK;
- final PR #332 head `e80a54c9823939862beba6a620e4ed363535b61e`;
- PR CI `38556750449` / `115827692257` GREEN; Android `38556750462` / `115827691810` GREEN;
- canonical `1131c06db406ca0170d5dad33ecb7f4610a06b96`, parent `72c4359af106d6f955e9932c6c72a836b2922ab8`, tree `ff27ceedc5460d98fefe373850d1fe20e3272098` equal to final PR-head tree;
- main CI `38556901537` / `115828194301` GREEN;
- main Android `38556901696` / `115828194800` GREEN including Build/Verify/Upload APK;
- Pages `38557000846`, build `115828516452` + deploy `115828677107` GREEN.

Issue #331 CLOSED / completed. J4C-C is **DEPLOYED / FROZEN**.

## Documentation canonicals""",
    "ledger J4C-C evidence",
)
ledger = replace_once(
    ledger,
    "- DOC18 — J4C-B closure & J4C-C activation: Issue #329, branch `docs/es-13-j4c-b-closure-j4c-c-activation`, in progress from gameplay canonical `2e16ff9a577128ffb06211b612116553928c8cda`.\n",
    "- DOC18 — J4C-B closure & J4C-C activation: `72c4359af106d6f955e9932c6c72a836b2922ab8` — Issue #329 / PR #330.\n- DOC19 — J4C-C closure & J5A activation: Issue #333, branch `docs/es-13-j4c-c-closure-j5a-activation`, in progress from gameplay canonical `1131c06db406ca0170d5dad33ecb7f4610a06b96`.\n",
    "ledger doc canonicals",
)
ledger = replace_between(
    ledger,
    "## Next planned gameplay",
    "## Program sequence",
    """## Next planned gameplay

### ES-13J5A — Pure Priority-Target Contract
Status: **NEXT ENGINEERING TARGET AFTER DOC19 CLOSURE**.

Begin J5 with a pure zero-live-authority contract because the current runtime has no explicit Commander/priority-node EnemyType or dedicated priority-target authority. Define bounded tactical/objective semantics first; do not add live spawns, chain reactions or a parallel entity system in J5A. Future effects must route through existing damage/defeat/cap authorities.

J4D+ additional tactical families remain deferred: FORMATION_BREAKER/JAMMER require hard-control spacing/recovery proof; MINE_WEAVER/MIRROR_WARDEN require genuine mine/mirror mechanics. J3C-C remains deferred, not cancelled.""",
    "ledger next gameplay",
)
ledger = replace_once(
    ledger,
    "`J4C-C Controlled Siege Progression → J4D+ Additional Tactical Families → J5 Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`",
    "`J5A Pure Priority-Target Contract → J5B+ Controlled Priority Targets/Chain Reactions → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`",
    "ledger sequence",
)
DOCS["ledger"].write_text(ledger, encoding="utf-8")

roadmap = DOCS["roadmap"].read_text(encoding="utf-8")
roadmap = replace_once(
    roadmap,
    "## J4 — Tactical Enemy Families\nStatus: **ACTIVE PROGRAM**",
    "## J4 — Tactical Enemy Families\nStatus: **DEPLOYED / FROZEN CURRENT JUSTIFIED SCOPE**",
    "roadmap J4 status",
)
roadmap = replace_between(
    roadmap,
    "### J4C-C — Controlled Normal-Progression Siege Adoption",
    "### J4 design gate",
    """### J4C-C — Controlled Normal-Progression Siege Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `1131c06db406ca0170d5dad33ecb7f4610a06b96`
Issue #331 / PR #332

Certified live policy:
- Campaign disabled;
- Infinite HIGH_PRESSURE minimum sector 51;
- deterministic SIEGE cadence `(sector - 52) % 8 === 0`;
- milestone/recovery excluded; final wave only; milestone descriptor null;
- exactly one existing spawn-budget ordinal replaced at `Math.floor(enemyBudget / 2)`;
- no density increase;
- first reachable normal SIEGE sectors 52, 68, 84, 92, 108, 116, 124, 132...;
- J4B RIFT cadence remains exact and disjoint;
- J4C-B 700 ms target-lock/COMMIT/ACK behavior remains exact;
- projectile count 3, speed 4.0, spread 0.12 and cooldown `150 + Math.random() * 70` unchanged;
- `SIEGE_CATHEDRAL` support remains SIEGE_PRISM, max count 2, cooldown 8000 ms;
- caps/budgets/entity arrays, evolution and J3 formation isolation remain authoritative;
- no new EnemyType, collection, director, full-array family scan, independent timer or RNG authority.

Exact deployment anchors:
- pre-PR `c6dc7dc48dd8028dd6de1f6f9fae79a2d20b6301`, run `38556345439` / job `115826341912` GREEN including scope guard + Android APK;
- final PR #332 head `e80a54c9823939862beba6a620e4ed363535b61e`;
- PR CI `38556750449` / `115827692257` GREEN; Android `38556750462` / `115827691810` GREEN;
- canonical `1131c06db406ca0170d5dad33ecb7f4610a06b96`, parent `72c4359af106d6f955e9932c6c72a836b2922ab8`, tree `ff27ceedc5460d98fefe373850d1fe20e3272098`;
- main CI `38556901537` / `115828194301` GREEN; Android `38556901696` / `115828194800` GREEN;
- Pages `38557000846`, build `115828516452` + deploy `115828677107` GREEN.

`FORMATION_BREAKER` and `JAMMER` remain **DEFERRED / NOT CURRENTLY JUSTIFIED** pending independent hard-control spacing/recovery proof. `MINE_WEAVER` / `MIRROR_WARDEN` remain deferred until genuine mine/mirror mechanics exist. No J4D slice is invented merely to keep sequence. J3C-C remains deferred, not cancelled.""",
    "roadmap J4C-C closure",
)
roadmap = replace_between(
    roadmap,
    "## J5 — Priority Targets & Chain-Reaction Combat",
    "## J6 — Dynamic Mid-Sector Events",
    """## J5 — Priority Targets & Chain-Reaction Combat
Status: **ACTIVE PROGRAM**

Goal: Command Cores, linked formations, destructible priority nodes, tactical chain reactions and formation collapse after key-target destruction. Reward tactical solutions without bypassing caps.

### J5A — Pure Priority-Target Contract
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC19 CLOSURE**

Read-only activation discovery found no existing Commander/priority-node EnemyType and no explicit priority-target runtime authority. J5 therefore begins with a pure contract rather than a live spawn or chain-reaction implementation.

Design constraints:
- zero live spawn/progression authority in J5A;
- no new EnemyType unless dedicated discovery proves existing representation cannot satisfy the contract and the phase explicitly approves it;
- priority targets must encode a tactical/objective decision, not an HP-only reskin;
- define bounded identity, tactical question, vulnerability/objective semantics, counterplay and fail-closed lookup/projection;
- future chain-reaction damage/defeat must route through existing authorities and global caps/budgets;
- no parallel entity/projectile collection, uncontrolled AoE/full-array scan, independent timer/RNG authority or silent score/economy tuning;
- preserve Campaign/Infinite isolation, J1/J2, J3 formations, frozen J4 tactical behavior, FOTON GLB and player/FOTON formation ownership.""",
    "roadmap J5 activation",
)
DOCS["roadmap"].write_text(roadmap, encoding="utf-8")

for name, path in DOCS.items():
    text = path.read_text(encoding="utf-8")
    if "1131c06db406ca0170d5dad33ecb7f4610a06b96" not in text:
        raise SystemExit(f"{name}: missing J4C-C canonical")
    if "J5A" not in text:
        raise SystemExit(f"{name}: missing J5A activation")

print("DOC19 guarded patch applied to exactly three documentation targets")
