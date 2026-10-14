from pathlib import Path
import re

CANON = "2e16ff9a577128ffb06211b612116553928c8cda"
DOC17 = "19beb0abf2b17d391834cb6336419ed4ead6819c"


def sub_once(text, pattern, replacement, label, flags=0):
    out, n = re.subn(pattern, replacement, text, count=1, flags=flags)
    if n != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {n}")
    return out


# PROJECT_CONTINUITY.md
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
project_head = f"""## Current certified gameplay canonical

`{CANON}`

Phase: **ES-13J4C-B — Live Siege Volley Telegraph Integration**  
Status: **DEPLOYED / FROZEN**  
Issue: #326 — CLOSED / completed  
Delivery: PR #327 + exact-scope remediation PR #328 — squash merged

Single parent: `8dec7945338e0152e83536605b18da63879818fe` — initial J4C-B merge prior to exact-scope remediation.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J4C-B result
J4C-B adopted the certified J4C-A 700 ms target-lock telegraph into every existing `SIEGE_PRISM`, including `SIEGE_CATHEDRAL` support, without broadening normal Campaign/Infinite progression.

Certified live behavior:
- cooldown readiness starts the 700 ms simulation-time telegraph instead of immediate fire;
- target coordinates lock once at telegraph start and do not track afterward;
- COMMIT remains latched when projectile cap/budget prevents creation;
- ACK occurs only after existing projectile authority actually creates the volley;
- only after ACK is telegraph state cleared and the existing randomized cooldown restored;
- three projectiles, speed `4.0`, spread `0.12` and cooldown `150 + Math.random() * 70` remain unchanged;
- `MAX_ENEMIES`, `MAX_PROJECTILES`, hostile projectile budget, entity arrays and `SIEGE_CATHEDRAL` support policy remain authoritative;
- no second projectile authority, enemy collection/director, full-array family scan or progression expansion was introduced;
- J4C-A `siegeVolleyTelegraph.ts` remains untouched.

PR #327 initially carried one historical certification-file adaptation beyond the approved six-file product scope. Fail-closed audit reopened #326; remediation PR #328 restored `tests/runtime-combat-pressure-adoption.test.ts` to its pre-J4C-B tree state and preserved equivalent runtime semantics inside allowed `EnergySwarmGame.tsx`. Final `{DOC17}...{CANON}` diff is exactly the six approved J4C-B files.

## J4C-B exact evidence
- DOC17 baseline `{DOC17}`;
- original J4C-B PR #327 final head `3360e5e8d63bfb6cbc55d2833cd9c6a97460613e`;
- PR #327 CI `38499422999` / `115642582715` GREEN; Android `38499423099` / `115642582029` GREEN;
- initial merge `8dec7945338e0152e83536605b18da63879818fe` was not accepted as final frozen canonical because its permanent diff had seven files;
- remediation pre-PR SHA `b5a768e919b9a75fb71a1a627bc521f74661a13b`, run `38506960989` / job `115666560063` GREEN including Platform, Android/APK and six-file scope guard;
- remediation PR #328 final head `bba0fa7a94cd45084c55149f80714dd1155a5baa`;
- PR #328 CI `38507157523` / `115667172988` GREEN; Android `38507157492` / `115667172667` GREEN including Build/Verify/Upload APK;
- canonical `{CANON}`, parent `8dec7945338e0152e83536605b18da63879818fe`, tree `8435b068908d82225b5442c8865578c46fedc243` equal to final PR head tree;
- main CI `38507278577` / `115667552196` GREEN;
- main Android `38507278528` / `115667552109` GREEN including Build/Verify/Upload APK;
- Pages `38507354839`: build `115667791913` + deploy `115667881614` GREEN.

"""
s = sub_once(s, r"## Current certified gameplay canonical\n.*?(?=## ES-13 gameplay canonicals)", project_head, "project canonical block", re.S)
s = sub_once(s, r"(- J4C-A — Pure Siege Volley Telegraph Contract: `4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6`\.\n)", r"\1- J4C-B — Live Siege Volley Telegraph Integration: `2e16ff9a577128ffb06211b612116553928c8cda`.\n", "project canonical list")
s = sub_once(s, r"- DOC17 — J4C-A closure & J4C-B activation:.*\n", f"- DOC17 — J4C-A closure & J4C-B activation: `{DOC17}` — Issue #324 / PR #325;\n- DOC18 — J4C-B closure & J4C-C activation: Issue #329, branch `docs/es-13-j4c-b-closure-j4c-c-activation`, documentation-only closure in progress from gameplay canonical `{CANON}`.\n", "project docs list")
next_project = """## Next gameplay phase

### ES-13J4C-C — Controlled Normal-Progression Siege Adoption
Status: **NEXT ENGINEERING TARGET AFTER DOC18 CLOSURE**

J4C-C may broaden where the certified `SIEGE_PRISM / ARTILLERY_CARRIER` appears, but must not alter J4C-B firing/fairness behavior. Its gameplay issue must inspect current Campaign/Infinite spawn policy and prove a bounded progression policy before changing selection.

Required direction:
- prefer a narrow Infinite-only candidate unless runtime evidence independently justifies Campaign;
- deterministically replace an existing spawn opportunity/budget rather than add density;
- preserve J4C-B 700 ms target lock, COMMIT latch, projectile-authority ACK and post-ACK cooldown semantics;
- preserve `SIEGE_CATHEDRAL` support composition/count/cooldown;
- preserve caps, projectile budget, entity arrays, projectile count/speed/spread/cooldown;
- no new `EnemyType`, parallel collection/director, family-only full-array scan or independent timer/RNG authority;
- keep evolved-enemy and J3 enemy-formation authorities isolated.

`FORMATION_BREAKER` and `JAMMER` remain deferred pending independent hard-control spacing/recovery proof. `MINE_WEAVER` and `MIRROR_WARDEN` remain deferred until genuine mine/mirror mechanics exist. J3C-C remains deferred, not cancelled.

"""
s = sub_once(s, r"## Next gameplay phase\n.*?(?=## Resolved diagnostics)", next_project, "project next gameplay", re.S)
s = sub_once(s, r"`J4C-B Live Siege Volley Integration → J4C-C Controlled Siege Progression →", "`J4C-C Controlled Siege Progression →", "project chronology")
s = sub_once(s, r"> Continue ORBI Energy Swarm autonomously\..*", f"> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J4C-B gameplay canonical is `{CANON}`, fully DEPLOYED / FROZEN with exact six-file historical scope after PR #328 remediation. Complete DOC18 if still open, then implement J4C-C Controlled Normal-Progression Siege Adoption only after runtime spawn-policy analysis proves a bounded policy. Preserve the certified J4C-B telegraph/projectile semantics and all caps/budgets. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.", "project handoff")
p.write_text(s)


# IMPLEMENTATION_LEDGER.md
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
row = "| ES-13J4C-A — Pure Siege Volley Telegraph Contract | DEPLOYED / FROZEN | `4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6` | #322 | #323 |\n"
if s.count(row) != 1:
    raise SystemExit(f"ledger J4C-A row expected once, found {s.count(row)}")
s = s.replace(row, row + f"| ES-13J4C-B — Live Siege Volley Telegraph Integration | DEPLOYED / FROZEN | `{CANON}` | #326 | #327 + #328 |\n", 1)
j4cb = f"""### J4C-B — Live Siege Volley Telegraph Integration
J4C-B adopted the J4C-A 700 ms target-lock state into every existing `SIEGE_PRISM`, including `SIEGE_CATHEDRAL` support, without expanding normal Campaign/Infinite progression. Locked target is fixed; COMMIT remains latched under cap/budget rejection; ACK/reset occurs only after existing projectile authority creates the volley; three projectiles, speed `4.0`, spread `0.12` and cooldown `150 + Math.random() * 70` remain unchanged.

PR #327 exposed a scope defect: one historical certification file had been adapted in addition to the approved six J4C-B files. #326 was reopened fail-closed. PR #328 restored `tests/runtime-combat-pressure-adoption.test.ts` to pre-J4C-B state and preserved equivalent runtime semantics in allowed `EnergySwarmGame.tsx`. Final `{DOC17}...{CANON}` diff is exactly the six approved J4C-B files; `siegeVolleyTelegraph.ts` remains untouched.

Exact final evidence:
- remediation pre-PR `b5a768e919b9a75fb71a1a627bc521f74661a13b`, run `38506960989` / job `115666560063` GREEN;
- final PR #328 head `bba0fa7a94cd45084c55149f80714dd1155a5baa`;
- PR CI `38507157523` / `115667172988` GREEN;
- PR Android `38507157492` / `115667172667` GREEN including Build/Verify/Upload APK;
- canonical `{CANON}`, parent `8dec7945338e0152e83536605b18da63879818fe`, tree `8435b068908d82225b5442c8865578c46fedc243`;
- main CI `38507278577` / `115667552196` GREEN;
- main Android `38507278528` / `115667552109` GREEN including Build/Verify/Upload APK;
- Pages `38507354839`, build `115667791913` + deploy `115667881614` GREEN.

Issue #326 CLOSED / completed. J4C-B is **DEPLOYED / FROZEN**.

"""
marker = "## Documentation canonicals\n"
if s.count(marker) != 1:
    raise SystemExit(f"ledger documentation heading expected once, found {s.count(marker)}")
s = s.replace(marker, j4cb + marker, 1)
s = sub_once(s, r"- DOC17 — J4C-A closure & J4C-B activation:.*\n", f"- DOC17 — J4C-A closure & J4C-B activation: `{DOC17}` — Issue #324 / PR #325;\n- DOC18 — J4C-B closure & J4C-C activation: Issue #329, branch `docs/es-13-j4c-b-closure-j4c-c-activation`, in progress from gameplay canonical `{CANON}`.\n", "ledger docs list")
next_ledger = """## Next planned gameplay

### ES-13J4C-C — Controlled Normal-Progression Siege Adoption
Status: **NEXT ENGINEERING TARGET AFTER DOC18 CLOSURE**.

Broaden `SIEGE_PRISM / ARTILLERY_CARRIER` only through a bounded policy proved from current Campaign/Infinite selection seams. Prefer narrow Infinite-only deterministic replacement; do not add density, caps, budgets, collections or a second director. J4C-B 700 ms target-lock/COMMIT/ACK behavior and `SIEGE_CATHEDRAL` support policy remain frozen. Hard-control families and mine/mirror semantics remain deferred.

"""
s = sub_once(s, r"## Next planned gameplay\n.*?(?=## Program sequence)", next_ledger, "ledger next gameplay", re.S)
s = sub_once(s, r"`J4C-B Live Siege Volley Integration → J4C-C Controlled Siege Progression →", "`J4C-C Controlled Siege Progression →", "ledger sequence")
p.write_text(s)


# ES13_GAMEPLAY_ROADMAP.md
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
s = p.read_text()
roadmap = f"""### J4C-B — Live Siege Volley Telegraph Integration
Status: **DEPLOYED / FROZEN**  
Canonical: `{CANON}`  
Issue #326 / delivery PR #327 + exact-scope remediation PR #328

Certified live policy:
- all currently existing `SIEGE_PRISM`, including `SIEGE_CATHEDRAL` support, use the 700 ms target-lock telegraph;
- target remains fixed; COMMIT remains latched under projectile budget rejection; ACK/reset occurs only after successful projectile creation;
- existing three-projectile volley, speed `4.0`, spread `0.12`, cooldown `150 + Math.random() * 70`, caps/budgets and boss-support policy remain unchanged;
- no second collection/director, family-only full-array scan or Campaign/Infinite progression expansion;
- J4C-A `siegeVolleyTelegraph.ts` remains unchanged.

PR #327 initially contained one extra historical certification-file adaptation. Fail-closed PR #328 restored it to pre-J4C-B state. Final `{DOC17}...{CANON}` diff is exactly the six approved J4C-B files.

Exact final anchors:
- remediation pre-PR `b5a768e919b9a75fb71a1a627bc521f74661a13b`, run `38506960989` / `115666560063` GREEN;
- PR #328 final head `bba0fa7a94cd45084c55149f80714dd1155a5baa`;
- PR CI `38507157523` / `115667172988` GREEN; Android `38507157492` / `115667172667` GREEN;
- canonical `{CANON}`, parent `8dec7945338e0152e83536605b18da63879818fe`, tree `8435b068908d82225b5442c8865578c46fedc243`;
- main CI `38507278577` / `115667552196` GREEN; Android `38507278528` / `115667552109` GREEN;
- Pages `38507354839`, build `115667791913` + deploy `115667881614` GREEN.

### J4C-C — Controlled Normal-Progression Siege Adoption
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC18 CLOSURE**

With SIEGE fairness certified live, J4C-C may broaden where `SIEGE_PRISM / ARTILLERY_CARRIER` appears in normal progression. The implementation issue must inspect current Campaign/Infinite selection first and prove a bounded policy rather than presume a sector cadence.

Design constraints:
- prefer narrow Infinite-only adoption unless runtime evidence independently justifies Campaign;
- deterministically replace an existing spawn opportunity/budget rather than add entities;
- preserve J4C-B target-lock/COMMIT/ACK behavior and `SIEGE_CATHEDRAL` support policy exactly;
- preserve projectile count/speed/spread/cooldown, global caps/budgets and entity arrays;
- no new `EnemyType`, parallel collection/director, family-only full-array scan or independent timer/RNG authority;
- preserve evolved-enemy and J3 enemy-formation authority isolation.

`FORMATION_BREAKER` and `JAMMER` remain deferred pending independent hard-control spacing/recovery proof. `MINE_WEAVER` / `MIRROR_WARDEN` remain deferred until genuine mine/mirror mechanics exist. J3C-C remains deferred, not cancelled.

"""
s = sub_once(s, r"### J4C-B — Live Siege Volley Telegraph Integration\n.*?(?=### J4 design gate)", roadmap, "roadmap J4C block", re.S)
p.write_text(s)

# Final semantic assertions.
assert CANON in Path("docs/PROJECT_CONTINUITY.md").read_text()
assert "ES-13J4C-C — Controlled Normal-Progression Siege Adoption" in Path("docs/PROJECT_CONTINUITY.md").read_text()
assert "ES-13J4C-B — Live Siege Volley Telegraph Integration | DEPLOYED / FROZEN" in Path("docs/IMPLEMENTATION_LEDGER.md").read_text()
assert "### J4C-C — Controlled Normal-Progression Siege Adoption" in Path("docs/ES13_GAMEPLAY_ROADMAP.md").read_text()
