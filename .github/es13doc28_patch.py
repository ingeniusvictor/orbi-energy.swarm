from pathlib import Path
import re


def replace_exact(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly 1 match, got {count}")
    return text.replace(old, new, 1)


def replace_regex(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly 1 match, got {count}")
    return updated


# ROADMAP
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
s = p.read_text()
roadmap = '''### J5F-D — Pure Effective Trigger-Damage Source Projection
Status: **DEPLOYED / FROZEN**
Canonical: `113865079ac4581c90356c3c218a28f8f88b6ef7`
Issue #367 / PR #368

Certified behavior:
- source kind is exactly `DIRECT_HIT` or `SPLASH_HIT`;
- caller supplies already-resolved hit damage plus source health immediately before that hit;
- `effectiveTriggerDamage = min(resolvedSourceDamage, sourceHealthBeforeHit)`;
- `proposedPulseDamage` exactly equals that bounded scalar;
- overkill cannot transfer into pulse magnitude;
- output is immutable `EFFECTIVE_TRIGGER_DAMAGE_ONLY` metadata;
- no multiplier/percentage/radius/cadence/timer/RNG;
- no live IDs, lookup/scan/collection, health mutation, defeat/score/reward/drop, projectile/spawn, formation, cap/budget or entity authority;
- J5F-A/B/C and live runtime remain unchanged.

Exact deployment anchors:
- pre-PR `aa8fe452636ef1857d1664aba3968896a0316731`, run `38721123148` / job `116375646962` GREEN including exact scope + Android APK;
- final PR #368 head `407a647ec511f8a6fb1a44ee13bd3eac9069db0b`;
- PR CI `38721504340` / `116376911142` GREEN; Android `38721504506` / `116376911875` GREEN;
- canonical `113865079ac4581c90356c3c218a28f8f88b6ef7`, parent `bc75751362e0dc8ed79c7b4688aa355ff9ae9648`, tree `c63c7aa7634f2d8ee8555f11da1648a8a83d2af8`;
- main CI `38721717159` / `116377625580` GREEN; Android `38721717129` / `116377625451` GREEN;
- Pages `38721821467`, build `116377981983` + deploy `116378114444` GREEN.

### J5F-E — Controlled Live Command-Link Disruption Pulse Application
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC28 CLOSURE**

Post-J5F-D discovery proves a bounded live application through existing seams only:
- direct and splash paths already own their final resolved hit scalar before health mutation;
- each path can capture only local pre-hit source health and project J5F-D only when that same hit proves lethal;
- `registerCombatDefeat(...)` already centralizes direct+splash defeat and resolves the full current J5D break resolution;
- J5E already carries one pending break through the existing enemy logic pass;
- J5F-B can validate each current linked member inside that same pass;
- J5F-C can project exact non-lethal `resultingHealth` from current `health/maxHealth` plus J5F-D proposed pulse damage;
- pulse application can occur before J5E detaches formation ownership, with no second scan or entity index.

Required direction:
- one new pure live-adapter helper composing frozen J5F-A/B/C/D; frozen contracts remain unchanged;
- one scalar pending pulse object/ref only, never a queue/map/set/index;
- capture pre-hit source health immediately before existing direct/splash health subtraction;
- only a defeat caused by that exact hit may pass J5F-D source metadata into centralized defeat routing;
- J5E detach remains independent if pulse source is absent/invalid;
- capture pending pulse before the existing enemy pass and apply only inside that pass, before J5E clears `enemyFormation`;
- matching current living linked members receive only J5F-C `resultingHealth`; exact 1 HP floor remains authoritative;
- never set linked `isDead`, never register pulse defeat, never award score/reward/drop/persistence and never trigger boss/milestone defeat;
- size-3 may pulse both bounded linked members during the same pass, then consume the captured pulse once with identity guard;
- reset pending pulse at the same run/wave/boss J3 lifecycle boundaries;
- no new Enemy/EnemyType field, scan/collection/lookup, projectile, multiplier/percentage/radius/cadence, timer/RNG, spawn/progression, cap/budget, visual or audio authority.

'''
s = replace_regex(
    s,
    r"### J5F-D — Pure Effective Trigger-Damage Source Projection\n.*?(?=## J6 — Dynamic Mid-Sector Events)",
    roadmap,
    "roadmap J5F-D to J5F-E",
)
p.write_text(s)


# LEDGER
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
j5fc_row = "| ES-13J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope | DEPLOYED / FROZEN | `53ff3b1fa0da58ea9bb7259162a98f3dac17df77` | #363 | #364 |"
j5fd_row = "| ES-13J5F-D — Pure Effective Trigger-Damage Source Projection | DEPLOYED / FROZEN | `113865079ac4581c90356c3c218a28f8f88b6ef7` | #367 | #368 |"
s = replace_exact(s, j5fc_row, j5fc_row + "\n" + j5fd_row, "ledger milestone row")
ledger_evidence = '''### J5F-D — Pure Effective Trigger-Damage Source Projection
J5F-D froze the pure trigger-damage source magnitude used by future Command-Link pulse application without introducing tuning or live authority.

Final product diff exactly:
- `src/game/commandLinkPulseTriggerDamageSource.ts`;
- `tests/es-13j5fd-command-link-pulse-trigger-damage-source.test.mjs`;
- `tests/gameplay/command-link-pulse-trigger-damage-source.test.ts`.

Exact evidence:
- baseline DOC27 `bc75751362e0dc8ed79c7b4688aa355ff9ae9648`;
- pre-PR SHA `aa8fe452636ef1857d1664aba3968896a0316731`, run `38721123148` / job `116375646962` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact scope guard and Android APK build/verify/upload;
- final PR #368 head `407a647ec511f8a6fb1a44ee13bd3eac9069db0b`;
- PR CI `38721504340` / `116376911142` GREEN;
- PR Android `38721504506` / `116376911875` GREEN including Build/Verify/Upload APK;
- canonical `113865079ac4581c90356c3c218a28f8f88b6ef7`, single parent `bc75751362e0dc8ed79c7b4688aa355ff9ae9648`, tree `c63c7aa7634f2d8ee8555f11da1648a8a83d2af8`;
- canonical diff exactly three certified product/test files;
- main CI `38721717159` / `116377625580` GREEN;
- main Android `38721717129` / `116377625451` GREEN including Build/Verify/Upload APK;
- Pages `38721821467`: build `116377981983` + deploy `116378114444` GREEN.

Issue #367 CLOSED / completed. J5F-D is **DEPLOYED / FROZEN**.

'''
s = replace_exact(s, "## Documentation canonicals\n", ledger_evidence + "## Documentation canonicals\n", "ledger J5F-D evidence")
s = replace_exact(
    s,
    "- DOC27 — J5F-C closure & J5F-D trigger-damage source activation: Issue #365, branch `docs/es-13-j5fc-closure-j5fd-source-projection`, in progress from gameplay canonical `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`.",
    "- DOC27 — J5F-C closure & J5F-D trigger-damage source activation: `bc75751362e0dc8ed79c7b4688aa355ff9ae9648` — Issue #365 / PR #366.\n- DOC28 — J5F-D closure & J5F-E controlled live pulse activation: Issue #369, branch `docs/es-13-j5fd-closure-j5fe-live-pulse`, in progress from gameplay canonical `113865079ac4581c90356c3c218a28f8f88b6ef7`.",
    "ledger DOC27 DOC28",
)
ledger_next = '''### ES-13J5F-E — Controlled Live Command-Link Disruption Pulse Application
Status: **NEXT ENGINEERING TARGET AFTER DOC28 CLOSURE**.

The runtime can adopt the frozen J5F-A/B/C/D stack without a second enemy traversal. Direct/splash paths may capture pre-hit source health locally and pass an already-projected J5F-D source only for the hit that actually defeats the current Command Core. A single pending pulse can then be consumed inside the existing J5E enemy pass before formation detach.

Only J5F-C non-lethal `resultingHealth` may be applied to current matching linked members. No linked defeat, `isDead`, defeat registration, score/reward/drop/persistence, boss/milestone defeat, second scan/index, Enemy field, new projectile, pulse tuning, timing/RNG, spawn/progression or cap/budget authority is allowed. Pulse pending state must reset with the same J3 lifecycle boundaries and be consumed once after the existing pass.

'''
s = replace_regex(
    s,
    r"### ES-13J5F-D — Pure Effective Trigger-Damage Source Projection\n.*?(?=J4D\+ additional tactical families remain deferred:)",
    ledger_next,
    "ledger next phase",
)
s = replace_exact(
    s,
    "`J5F-D Pure Effective Trigger-Damage Source Projection → J5F-E+ separately proven live application → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`",
    "`J5F-E Controlled Live Command-Link Disruption Pulse Application → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`",
    "ledger chronology",
)
p.write_text(s)


# CONTINUITY
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
current = '''## Current certified gameplay canonical

`113865079ac4581c90356c3c218a28f8f88b6ef7`

Phase: **ES-13J5F-D — Pure Effective Trigger-Damage Source Projection**
Status: **DEPLOYED / FROZEN**
Issue: #367 — CLOSED / completed
Delivery: PR #368 — squash merged

Single parent: `bc75751362e0dc8ed79c7b4688aa355ff9ae9648` — DOC27 documentation canonical.

Canonical tree: `c63c7aa7634f2d8ee8555f11da1648a8a83d2af8`.

'''
s = replace_regex(
    s,
    r"## Current certified gameplay canonical\n.*?(?=Version remains `0\.2\.0-beta\.1`\.)",
    current,
    "continuity current canonical",
)
cont_evidence = '''## J5F-D result
J5F-D established the pure overkill-bounded trigger-damage source projection required before any live Command-Link disruption pulse may consume defeating-hit damage.

Certified contract:
- exact source vocabulary `DIRECT_HIT` / `SPLASH_HIT`;
- finite positive resolved source damage and pre-hit source health required;
- `effectiveTriggerDamage = min(resolvedSourceDamage, sourceHealthBeforeHit)`;
- `proposedPulseDamage` equals that scalar exactly;
- no multiplier/percentage/radius/cadence/timing rule;
- no live IDs, lookup/scan/collection, mutation, defeat/reward/drop, projectile/spawn, formation, clock/RNG, cap/budget or entity authority.

Final product scope exactly:
- `src/game/commandLinkPulseTriggerDamageSource.ts`;
- `tests/es-13j5fd-command-link-pulse-trigger-damage-source.test.mjs`;
- `tests/gameplay/command-link-pulse-trigger-damage-source.test.ts`.

## J5F-D exact evidence
- DOC27 baseline `bc75751362e0dc8ed79c7b4688aa355ff9ae9648`;
- pre-PR SHA `aa8fe452636ef1857d1664aba3968896a0316731`, run `38721123148` / job `116375646962` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact product-scope guard and Android APK build/verify/upload;
- final PR #368 head `407a647ec511f8a6fb1a44ee13bd3eac9069db0b`;
- PR CI `38721504340` / `116376911142` GREEN;
- PR Android `38721504506` / `116376911875` GREEN including Build/Verify/Upload APK;
- canonical `113865079ac4581c90356c3c218a28f8f88b6ef7`, single parent `bc75751362e0dc8ed79c7b4688aa355ff9ae9648`, tree `c63c7aa7634f2d8ee8555f11da1648a8a83d2af8`;
- canonical diff exactly three certified product/test files;
- main CI `38721717159` / `116377625580` GREEN;
- main Android `38721717129` / `116377625451` GREEN including Build/Verify/Upload APK;
- Pages `38721821467`: build `116377981983` + deploy `116378114444` GREEN.

Issue #367 CLOSED / completed. J5F-D is **DEPLOYED / FROZEN**.

'''
s = replace_exact(s, "## ES-13 gameplay canonicals\n", cont_evidence + "## ES-13 gameplay canonicals\n", "continuity J5F-D evidence")
s = replace_exact(
    s,
    "- J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope: `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`.",
    "- J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope: `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`.\n- J5F-D — Pure Effective Trigger-Damage Source Projection: `113865079ac4581c90356c3c218a28f8f88b6ef7`.",
    "continuity canonical list",
)
s = replace_exact(
    s,
    "- DOC27 — J5F-C closure & J5F-D trigger-damage source activation: Issue #365, branch `docs/es-13-j5fc-closure-j5fd-source-projection`, documentation-only closure in progress from gameplay canonical `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`.",
    "- DOC27 — J5F-C closure & J5F-D trigger-damage source activation: `bc75751362e0dc8ed79c7b4688aa355ff9ae9648` — Issue #365 / PR #366.\n- DOC28 — J5F-D closure & J5F-E controlled live pulse activation: Issue #369, branch `docs/es-13-j5fd-closure-j5fe-live-pulse`, documentation-only closure in progress from gameplay canonical `113865079ac4581c90356c3c218a28f8f88b6ef7`.",
    "continuity DOC27 DOC28",
)
cont_next = '''### ES-13J5F-E — Controlled Live Command-Link Disruption Pulse Application
Status: **NEXT ENGINEERING TARGET AFTER DOC28 CLOSURE**

Architecture discovery proves J5F-E can remain bounded to existing runtime seams. Direct/splash paths capture only local pre-hit source health and use their already-resolved hit scalar; only the exact hit that defeats a valid current Command Core may create pending pulse source metadata. Centralized defeat routing still owns J5E break resolution.

Required direction:
- new pure live-adapter helper composes frozen J5F-A/B/C/D without modifying them;
- one scalar pending pulse ref only;
- capture pending pulse before the existing enemy loop and project each current living linked member inside that same pass, before J5E detach;
- apply only J5F-C non-lethal `resultingHealth`, preserving exact 1 HP floor;
- never set linked `isDead`, never register pulse defeat or award score/reward/drop/persistence;
- size-3 may process both bounded linked members in the one existing pass, then consume the captured pulse once with identity guard;
- reset pulse state at the same run/wave/boss J3 boundaries;
- no second scan/index, Enemy field, new projectile, tuning multiplier/percentage/radius/cadence, clock/RNG, spawn/progression, cap/budget, presentation or audio authority.

'''
s = replace_regex(
    s,
    r"### ES-13J5F-D — Pure Effective Trigger-Damage Source Projection\n.*?(?=J4D\+ additional tactical families remain \*\*DEFERRED)",
    cont_next,
    "continuity next phase",
)
s = replace_exact(
    s,
    "`J5F-D Pure Effective Trigger-Damage Source Projection → J5F-E+ separately proven live application → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "`J5F-E Controlled Live Command-Link Disruption Pulse Application → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "continuity chronology",
)
s = replace_regex(
    s,
    r"> Continue ORBI Energy Swarm autonomously\..*?(?=\n\n## Update obligation)",
    "> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J5F-D gameplay canonical is `113865079ac4581c90356c3c218a28f8f88b6ef7`, fully DEPLOYED / FROZEN via Issue #367 / PR #368 with exact three-file product scope and post-main CI/Android/Pages GREEN. Complete DOC28 if still open, then implement J5F-E as a controlled live Command-Link disruption pulse using only existing direct/splash source scalars, local pre-hit source health, centralized defeat routing and the existing J5E enemy pass. Compose frozen J5F-A/B/C/D in a new helper; one scalar pending pulse only; apply only J5F-C non-lethal resulting health before J5E detach; never set linked isDead or register pulse defeat/reward/drop; no second scan/index, Enemy field, tuning, timer/RNG or cap authority. Keep J4D+ families and J3C-C deferred until prerequisites are proven. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch main directly or weaken tests.",
    "continuity handoff",
)
p.write_text(s)

print("DOC28 patch prepared")
