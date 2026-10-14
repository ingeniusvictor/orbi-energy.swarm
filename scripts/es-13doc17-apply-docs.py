from pathlib import Path
import re

GAMEPLAY = "4cb5fb320c4bed4fa884ede312c4f3c323cdc5c6"
DOC16 = "56aca8a129be9310f64bb04a99fb19560b52b2e3"
FINAL_HEAD = "1724dc4fd199e7be50f1110c7606d54bbe2b1543"


def replace_range(source: str, start: str, end: str, replacement: str, label: str) -> str:
    pattern = re.compile(rf"{re.escape(start)}.*?(?={re.escape(end)})", re.S)
    matches = list(pattern.finditer(source))
    if len(matches) != 1:
        raise RuntimeError(f"Expected one {label} block, found {len(matches)}")
    return pattern.sub(replacement.rstrip() + "\n\n", source, count=1)


# PROJECT_CONTINUITY
path = Path("docs/PROJECT_CONTINUITY.md")
source = path.read_text(encoding="utf-8")

current = f'''## Current certified gameplay canonical

`{GAMEPLAY}`

Phase: **ES-13J4C-A — Pure Siege Volley Telegraph Contract**  
Status: **DEPLOYED / FROZEN**  
Issue: #322 — CLOSED / completed  
PR: #323 — squash merged

Single parent: `{DOC16}` — ES-13DOC16 documentation canonical.

Version remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.

## J4C-A result
J4C-A solved the fairness contract before broadening `SIEGE_PRISM` progression. The new pure `siegeVolleyTelegraph.ts` state machine has no live runtime authority and defines:
- phases `IDLE → TELEGRAPH → COMMIT`;
- a fixed 700 ms simulation-time reaction window;
- finite target coordinates locked at telegraph start;
- exact-boundary/overshoot commit emitted once only;
- COMMIT latched until explicit acknowledgement;
- projection vocabulary `SIEGE_VOLLEY` + `BREAK_ARTILLERY_ENVELOPE`;
- fail-closed invalid target/delta handling;
- zero spawn/entity/projectile collection, full-array scan, global-cap, support-entity or cooldown-RNG authority.

J4C-A intentionally did **not** touch `EnergySwarmGame.tsx`, `EnergySwarmCanvas.tsx`, `types.ts`, progression/spawn selection, `SIEGE_CATHEDRAL` support composition, projectile count/speed/spread/cooldown, Android/package/docs/assets or global caps.

This matters because `SIEGE_PRISM` is already live as `SIEGE_CATHEDRAL` support (max 2), while its current runtime fires immediately when cooldown expires. J4C-B can now adopt a certified fairness seam into that existing context before any additional normal-progression SIEGE appearance.

## J4C-A exact evidence
- baseline/docs canonical: `{DOC16}`;
- pre-PR certified head `d4963c8d435996adf39e6df582ba7c15540d3ab9`, run `38492253039`, job `115619974269` — GREEN including Android/APK/J4C-A scope guard;
- final clean PR head `{FINAL_HEAD}`;
- PR CI `38492465605`, job `115620646548` — GREEN on exact final head;
- PR Android `38492465573`, job `115620646615` — GREEN on exact final head including Build/Verify/Upload APK;
- squash gameplay canonical `{GAMEPLAY}`;
- main CI `38492584499`, job `115621028391` — GREEN on exact canonical;
- main Android `38492584516`, job `115621028451` — GREEN on exact canonical including Build/Verify/Upload APK;
- Pages `38492658345` — build job `115621262106` + deploy job `115621344438`, both GREEN on exact canonical.'''
source = replace_range(source, "## Current certified gameplay canonical", "## ES-13 gameplay canonicals", current, "continuity current canonical")

anchor = "- J4B — Narrow Live Warp Ambusher Adoption: `1023cee74d1c32a379bf542551397ae134f43573`."
addition = anchor + f"\n- J4C-A — Pure Siege Volley Telegraph Contract: `{GAMEPLAY}`."
if source.count(anchor) != 1:
    raise RuntimeError("Expected one J4B canonical anchor")
source = source.replace(anchor, addition, 1)

docs = f'''## Documentation canonicals
- DOC11: `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- DOC12: `f85e2432934454da191dea9bd0c9da43bbce86ca`;
- DOC13: `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- DOC14 — J3D closure & J4 activation: `998292cd40a3364aa7f22933b6312173956d3baa`;
- DOC15 — J4A closure & J4B activation: `096b2c9fe53551664b56baf6e382368f8b4078da` — Issue #316 / PR #317;
- DOC16 — J4B closure & J4C activation: `{DOC16}` — Issue #320 / PR #321;
- DOC17 — J4C-A closure & J4C-B activation: Issue #324, branch `docs/es-13-j4c-a-closure-j4c-b-activation`, documentation-only closure in progress from gameplay canonical `{GAMEPLAY}`.'''
source = replace_range(source, "## Documentation canonicals", "## Next gameplay phase", docs, "continuity docs canonicals")

next_phase = '''## Next gameplay phase

### ES-13J4C-B — Live Siege Volley Telegraph Integration
Status: **NEXT ENGINEERING TARGET AFTER DOC17 CLOSURE**

Adopt the certified J4C-A contract into existing `SIEGE_PRISM` instances, including `SIEGE_CATHEDRAL` support, without broadening normal Campaign/Infinite SIEGE progression.

Required behavior:
- each live SIEGE owns only its bounded telegraph state; no second enemy collection/director;
- when the existing SIEGE cooldown becomes ready, lock the current finite player position and start the certified 700 ms telegraph instead of firing immediately;
- render a clear world-space visual cue to the locked target and explicit `SIEGE_VOLLEY` readability;
- fire the existing three-projectile SIEGE spread only on the single COMMIT edge through existing `shootFromEnemy` and projectile-budget authority;
- acknowledge/reset exactly once and then resume the existing randomized cooldown;
- no target tracking after lock and no duplicate shot during COMMIT;
- preserve `MAX_ENEMIES`, `MAX_PROJECTILES`, SIEGE projectile count/speed/spread, boss support count/cooldown and all normal progression selection.

J4C-B must explicitly test the `SIEGE_CATHEDRAL` support context. Normal-progression SIEGE adoption remains a later dedicated slice after live fairness is exact-SHA certified. Hard-control families and mine/mirror semantics remain deferred.'''
source = replace_range(source, "## Next gameplay phase", "## Resolved diagnostics", next_phase, "continuity next gameplay")

old_sequence = "`J4C Bounded Tactical Family Slice → J4D+ Additional Tactical Families"
new_sequence = "`J4C-B Live Siege Volley Integration → J4C-C Controlled Siege Progression → J4D+ Additional Tactical Families"
if source.count(old_sequence) != 1:
    raise RuntimeError("Expected continuity chronology anchor")
source = source.replace(old_sequence, new_sequence, 1)

handoff_pattern = re.compile(r"Suggested handoff:\n> .*?(?=\n\n## Update obligation)", re.S)
if len(list(handoff_pattern.finditer(source))) != 1:
    raise RuntimeError("Expected one continuity handoff block")
handoff = f'''Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J4C-A gameplay canonical is `{GAMEPLAY}`, fully deployed/frozen. Complete DOC17 if still open, then implement J4C-B by integrating the certified 700 ms target-locked Siege Volley into existing SIEGE instances including Siege Cathedral support, without broadening progression. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.'''
source = handoff_pattern.sub(handoff, source, count=1)
path.write_text(source, encoding="utf-8")


# IMPLEMENTATION_LEDGER
path = Path("docs/IMPLEMENTATION_LEDGER.md")
source = path.read_text(encoding="utf-8")
row_anchor = "| ES-13J4B — Narrow Live Warp Ambusher Adoption | DEPLOYED / FROZEN | `1023cee74d1c32a379bf542551397ae134f43573` | #318 | #319 |"
row = f"| ES-13J4C-A — Pure Siege Volley Telegraph Contract | DEPLOYED / FROZEN | `{GAMEPLAY}` | #322 | #323 |"
if source.count(row_anchor) != 1:
    raise RuntimeError("Expected J4B ledger row")
source = source.replace(row_anchor, row_anchor + "\n" + row, 1)

section = f'''### J4C-A — Pure Siege Volley Telegraph Contract
J4C-A established the fairness seam before any additional SIEGE progression. The pure state machine locks one finite target at telegraph start, holds a 700 ms simulation-time reaction window, emits one COMMIT edge at/after the exact boundary, remains latched until explicit acknowledgement, and projects `SIEGE_VOLLEY` / `BREAK_ARTILLERY_ENVELOPE` metadata. Invalid target/delta inputs fail closed.

Authority remains zero: no spawn authority, entity/projectile collections, full-array scans, global-cap mutation, support-entity creation or cooldown RNG. J4C-A made no live runtime/renderer/progression changes. This is intentionally prerequisite work because `SIEGE_CATHEDRAL` already spawns up to two `SIEGE_PRISM` supports while current SIEGE firing has no reaction window.

Final product diff exactly three files: `src/game/siegeVolleyTelegraph.ts` plus two J4C-A tests.

Exact evidence:
- baseline `{DOC16}`;
- pre-PR head `d4963c8d435996adf39e6df582ba7c15540d3ab9`, run `38492253039`, job `115619974269` — GREEN;
- final PR head `{FINAL_HEAD}`;
- PR CI `38492465605`, job `115620646548` — GREEN;
- PR Android `38492465573`, job `115620646615` — GREEN including Build/Verify/Upload APK;
- canonical `{GAMEPLAY}`, single parent `{DOC16}`;
- main CI `38492584499`, job `115621028391` — GREEN;
- main Android `38492584516`, job `115621028451` — GREEN including Build/Verify/Upload APK;
- Pages `38492658345`, build `115621262106` + deploy `115621344438` — GREEN.

Issue #322 CLOSED / completed. J4C-A is **DEPLOYED / FROZEN**.'''
marker = "## Documentation canonicals"
if source.count(marker) != 1:
    raise RuntimeError("Expected ledger docs marker")
source = source.replace(marker, section + "\n\n" + marker, 1)

ledger_docs = f'''## Documentation canonicals
- DOC11 `31de2cd5bb89ae3032902c09ace881119c04dfec`;
- DOC12 `f85e2432934454da191dea9bd0c9da43bbce86ca`;
- DOC13 `03fbaefc45d065a5815e52cca6a6e67b0471949a`;
- DOC14 — J3D closure & J4 activation: `998292cd40a3364aa7f22933b6312173956d3baa`;
- DOC15 — J4A closure & J4B activation: `096b2c9fe53551664b56baf6e382368f8b4078da` — Issue #316 / PR #317;
- DOC16 — J4B closure & J4C activation: `{DOC16}` — Issue #320 / PR #321;
- DOC17 — J4C-A closure & J4C-B activation: Issue #324, branch `docs/es-13-j4c-a-closure-j4c-b-activation`, in progress from gameplay canonical `{GAMEPLAY}`.'''
source = replace_range(source, "## Documentation canonicals", "## Frozen manual/physical blockers", ledger_docs, "ledger docs canonicals")

ledger_next = '''## Next planned gameplay

### ES-13J4C-B — Live Siege Volley Telegraph Integration
Status: **NEXT ENGINEERING TARGET AFTER DOC17 CLOSURE**.

Integrate the certified J4C-A state into existing `SIEGE_PRISM` instances, including `SIEGE_CATHEDRAL` support. Lock target at readiness, render the 700 ms cue, fire the existing three-projectile spread only on the one-shot COMMIT edge through existing projectile authority, acknowledge/reset once, and preserve all current spawn/progression/cap/budget contracts. Normal-progression SIEGE adoption remains later.'''
source = replace_range(source, "## Next planned gameplay", "## Program sequence", ledger_next, "ledger next gameplay")

seq_old = "`J4C Bounded Tactical Family Slice → J4D+ Additional Tactical Families"
seq_new = "`J4C-B Live Siege Volley Integration → J4C-C Controlled Siege Progression → J4D+ Additional Tactical Families"
if source.count(seq_old) != 1:
    raise RuntimeError("Expected ledger sequence anchor")
source = source.replace(seq_old, seq_new, 1)
path.write_text(source, encoding="utf-8")


# ROADMAP
path = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
source = path.read_text(encoding="utf-8")
roadmap = f'''### J4C-A — Pure Siege Volley Telegraph Contract
Status: **DEPLOYED / FROZEN**  
Canonical: `{GAMEPLAY}`  
Issue #322 / PR #323

J4C-A created the pure fairness contract required by `ARTILLERY_CARRIER / SIEGE_PRISM` before any additional live adoption:
- 700 ms simulation-time telegraph;
- target locked at telegraph start;
- `IDLE → TELEGRAPH → COMMIT` state machine;
- exact one-shot COMMIT edge with explicit acknowledgement;
- `SIEGE_VOLLEY` + `BREAK_ARTILLERY_ENVELOPE` projection metadata;
- invalid input fail-closed;
- zero live runtime authority.

No runtime/renderer/progression/cap or `SIEGE_CATHEDRAL` composition changes occurred in J4C-A.

Exact deployment anchors:
- pre-PR head `d4963c8d435996adf39e6df582ba7c15540d3ab9`, run `38492253039` / job `115619974269` GREEN;
- final PR head `{FINAL_HEAD}`;
- PR CI `38492465605` / job `115620646548` GREEN;
- PR Android `38492465573` / job `115620646615` GREEN;
- canonical `{GAMEPLAY}`;
- main CI `38492584499` / job `115621028391` GREEN;
- main Android `38492584516` / job `115621028451` GREEN;
- Pages `38492658345`, build `115621262106` + deploy `115621344438` GREEN.

### J4C-B — Live Siege Volley Telegraph Integration
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC17 CLOSURE**

Adopt J4C-A into all currently existing `SIEGE_PRISM` instances, including `SIEGE_CATHEDRAL` support, without broadening normal progression.

Required gates of the gameplay design:
- current SIEGE cooldown readiness begins the 700 ms target-lock telegraph instead of immediate fire;
- renderer shows a clear target-locked artillery cue/readable `SIEGE_VOLLEY` state;
- existing three-projectile SIEGE spread fires only on the certified single COMMIT edge through existing `shootFromEnemy`/projectile-budget authority;
- COMMIT is acknowledged/reset exactly once before a new randomized cooldown;
- no duplicate shot, no target tracking after lock, no second enemy collection/director and no family-only full-array scan;
- `MAX_ENEMIES`, `MAX_PROJECTILES`, projectile count/speed/spread, `SIEGE_CATHEDRAL` support max/cooldown, Campaign and normal Infinite compositions remain unchanged.

Normal-progression SIEGE adoption is deferred to a later controlled slice after J4C-B exact-SHA fairness certification. `FORMATION_BREAKER` and `JAMMER` remain deferred pending hard-control proof; `MINE_WEAVER` / `MIRROR_WARDEN` remain outside the certified contract.'''
source = replace_range(source, "### J4C — Next Bounded Tactical Family Slice", "### J4 design gate", roadmap, "roadmap J4C")
path.write_text(source, encoding="utf-8")

print("DOC17 documentation patch applied successfully.")
