from pathlib import Path
import re

BASE = "53ff3b1fa0da58ea9bb7259162a98f3dac17df77"


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
roadmap = '''### J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope
Status: **DEPLOYED / FROZEN**
Canonical: `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`
Issue #363 / PR #364

Certified behavior:
- consumes one already-eligible current linked target plus caller-supplied `currentHealth`, `maxHealth` and `proposedDamage`;
- requires finite `currentHealth >= 1`, finite `maxHealth >= 1`, `currentHealth <= maxHealth`, finite `proposedDamage > 0`;
- preserves an exact 1 HP non-lethal floor and clamps overkill rather than killing;
- `0 < currentHealth < 1` fails closed rather than inventing healing;
- does not choose or tune proposed damage;
- output is immutable `NON_LETHAL_PROJECTION_ONLY` metadata;
- no live health mutation, defeat, score/reward/drop, milestone/boss, scan/lookup/collection, timing/RNG, cap/budget or entity authority;
- J5F-A/J5F-B/J5B and live runtime remain frozen.

Exact deployment anchors:
- pre-PR `345d84493e10d2b2e6308811206e3597755d6b5a`, run `38686699512` / job `116263082196` GREEN including exact scope + Android APK;
- final PR #364 head `e131110e5d586660b755dada17be0d011faee682`;
- PR CI `38686990002` / `116264005879` GREEN; Android `38686989965` / `116264005932` GREEN;
- canonical `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`, parent `7a24f7a747a2d2eb2fb79b4eb4a249ded67a8193`, tree `a6067fdfdc5847fa7b6c0f73894bfa889fec24e4`;
- main CI `38687143378` / `116264489750` GREEN; Android `38687143454` / `116264489903` GREEN;
- Pages `38687226083`, build `116264740311` + deploy `116264855735` GREEN.

### J5F-D — Pure Effective Trigger-Damage Source Projection
Status: **NEXT ACTIVE ENGINEERING SLICE AFTER DOC27 CLOSURE**

Runtime discovery shows both existing defeat-capable paths already compute the final scalar damage applied before health mutation: direct hit uses `damageToApply`; splash uses `splashDamage`. J5F-D must reuse caller-supplied resolved source facts rather than inventing a pulse multiplier.

Required direction:
- pure deterministic contract only; no `EnergySwarmGame.tsx` adoption;
- consume caller-supplied source kind (`DIRECT_HIT` or `SPLASH_HIT`), resolved source damage and source health immediately before that hit;
- require finite positive source damage and finite positive pre-hit source health;
- project effective trigger damage as `min(resolvedSourceDamage, sourceHealthBeforeHit)` so projectile overkill is not amplified into pulse magnitude;
- expose that bounded scalar only as proposed downstream pulse damage metadata;
- no fixed multiplier, percentage, radius, cadence, clock or RNG;
- no target lookup/scan/collection, health mutation, defeat/reward/drop attribution, projectile/spawn, formation, cap/budget or entity create/remove authority;
- any live wiring remains J5F-E+ and must independently prove source capture, current-target application and single defeat/reward attribution.

'''
s = replace_regex(
    s,
    r"### J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope\n.*?(?=## J6 — Dynamic Mid-Sector Events)",
    roadmap,
    "roadmap J5F-C to J5F-D",
)
p.write_text(s)


# LEDGER
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
j5fb_row = "| ES-13J5F-B — Pure Current Command-Link Pulse Target Eligibility Contract | DEPLOYED / FROZEN | `9812592dd77a0dd4e6364d57857f4c9065757d49` | #359 | #360 |"
j5fc_row = "| ES-13J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope | DEPLOYED / FROZEN | `53ff3b1fa0da58ea9bb7259162a98f3dac17df77` | #363 | #364 |"
s = replace_exact(s, j5fb_row, j5fb_row + "\n" + j5fc_row, "ledger milestone")
ledger_evidence = '''### J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope
J5F-C froze a pure non-lethal damage-safety projection for one already-eligible linked target without choosing pulse tuning or mutating live health.

Final product diff exactly:
- `src/game/commandLinkPulseDamageSafety.ts`;
- `tests/es-13j5fc-command-link-pulse-damage-safety.test.mjs`;
- `tests/gameplay/command-link-pulse-damage-safety.test.ts`.

Exact evidence:
- baseline DOC26 `7a24f7a747a2d2eb2fb79b4eb4a249ded67a8193`;
- pre-PR SHA `345d84493e10d2b2e6308811206e3597755d6b5a`, run `38686699512` / job `116263082196` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact scope guard and Android APK build/verify/upload;
- final PR #364 head `e131110e5d586660b755dada17be0d011faee682`;
- PR CI `38686990002` / `116264005879` GREEN;
- PR Android `38686989965` / `116264005932` GREEN including Build/Verify/Upload APK;
- canonical `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`, single parent `7a24f7a747a2d2eb2fb79b4eb4a249ded67a8193`, tree `a6067fdfdc5847fa7b6c0f73894bfa889fec24e4`;
- canonical diff exactly three certified product/test files;
- main CI `38687143378` / `116264489750` GREEN;
- main Android `38687143454` / `116264489903` GREEN including Build/Verify/Upload APK;
- Pages `38687226083`: build `116264740311` + deploy `116264855735` GREEN.

Issue #363 CLOSED / completed. J5F-C is **DEPLOYED / FROZEN**.

'''
s = replace_exact(s, "## Documentation canonicals\n", ledger_evidence + "## Documentation canonicals\n", "ledger evidence")
s = replace_exact(
    s,
    "- DOC26 — J5F-B closure & J5F-C non-lethal damage safety activation: Issue #361, branch `docs/es-13-j5fb-closure-j5fc-activation`, in progress from gameplay canonical `9812592dd77a0dd4e6364d57857f4c9065757d49`.",
    "- DOC26 — J5F-B closure & J5F-C non-lethal damage safety activation: `7a24f7a747a2d2eb2fb79b4eb4a249ded67a8193` — Issue #361 / PR #362.\n- DOC27 — J5F-C closure & J5F-D trigger-damage source activation: Issue #365, branch `docs/es-13-j5fc-closure-j5fd-source-projection`, in progress from gameplay canonical `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`.",
    "ledger DOC26 DOC27",
)
ledger_next = '''### ES-13J5F-D — Pure Effective Trigger-Damage Source Projection
Status: **NEXT ENGINEERING TARGET AFTER DOC27 CLOSURE**.

Existing direct and splash combat paths already compute the final scalar damage they apply before mutating health (`damageToApply` and `splashDamage`). J5F-D must remain pure and reuse those caller-supplied resolved facts rather than inventing a new pulse multiplier or percentage.

Required contract: validate source kind plus finite positive resolved source damage and finite positive source health immediately before the defeating hit; project `effectiveTriggerDamage = min(resolvedSourceDamage, sourceHealthBeforeHit)` and expose it only as downstream proposed pulse-damage metadata. No live source capture, target lookup, mutation, defeat/reward/drop attribution, timing/RNG, projectile/spawn, formation, cap/budget or entity authority. Live wiring remains J5F-E+.

'''
s = replace_regex(
    s,
    r"### ES-13J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope\n.*?(?=J4D\+ additional tactical families remain deferred:)",
    ledger_next,
    "ledger next phase",
)
s = replace_exact(
    s,
    "`J5F-C Pure Non-Lethal Command-Link Pulse Damage Safety Envelope → J5F-D+ source tuning/live application → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`",
    "`J5F-D Pure Effective Trigger-Damage Source Projection → J5F-E+ separately proven live application → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance → ES-14 Living Warfront`",
    "ledger chronology",
)
p.write_text(s)


# CONTINUITY
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
current = '''## Current certified gameplay canonical

`53ff3b1fa0da58ea9bb7259162a98f3dac17df77`

Phase: **ES-13J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope**
Status: **DEPLOYED / FROZEN**
Issue: #363 — CLOSED / completed
Delivery: PR #364 — squash merged

Single parent: `7a24f7a747a2d2eb2fb79b4eb4a249ded67a8193` — DOC26 documentation canonical.

Canonical tree: `a6067fdfdc5847fa7b6c0f73894bfa889fec24e4`.

'''
s = replace_regex(
    s,
    r"## Current certified gameplay canonical\n.*?(?=Version remains `0\.2\.0-beta\.1`\.)",
    current,
    "continuity current canonical",
)
cont_evidence = '''## J5F-C result
J5F-C established the pure non-lethal damage-safety envelope required before any Command-Link pulse source magnitude or live health mutation may be considered.

Certified contract:
- consumes frozen J5F-B eligibility plus caller-supplied `currentHealth`, `maxHealth`, `proposedDamage`;
- finite `currentHealth >= 1`, `maxHealth >= 1`, `currentHealth <= maxHealth`, `proposedDamage > 0` required;
- exact 1 HP floor; overkill clamps to non-lethal safe damage;
- `(0,1)` current health fails closed instead of healing;
- no damage magnitude tuning, live health mutation, defeat, score/reward/drop, boss/milestone, lookup/scan/collection, clock/RNG, cap/budget or entity authority.

Final product scope exactly:
- `src/game/commandLinkPulseDamageSafety.ts`;
- `tests/es-13j5fc-command-link-pulse-damage-safety.test.mjs`;
- `tests/gameplay/command-link-pulse-damage-safety.test.ts`.

## J5F-C exact evidence
- DOC26 baseline `7a24f7a747a2d2eb2fb79b4eb4a249ded67a8193`;
- pre-PR SHA `345d84493e10d2b2e6308811206e3597755d6b5a`, run `38686699512` / job `116263082196` GREEN including repo/gameplay/platform/typecheck/release/dossier/build/readiness, exact product-scope guard and Android APK build/verify/upload;
- final PR #364 head `e131110e5d586660b755dada17be0d011faee682`;
- PR CI `38686990002` / `116264005879` GREEN;
- PR Android `38686989965` / `116264005932` GREEN including Build/Verify/Upload APK;
- canonical `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`, single parent `7a24f7a747a2d2eb2fb79b4eb4a249ded67a8193`, tree `a6067fdfdc5847fa7b6c0f73894bfa889fec24e4`;
- canonical diff exactly three certified product/test files;
- main CI `38687143378` / `116264489750` GREEN;
- main Android `38687143454` / `116264489903` GREEN including Build/Verify/Upload APK;
- Pages `38687226083`: build `116264740311` + deploy `116264855735` GREEN.

Issue #363 CLOSED / completed. J5F-C is **DEPLOYED / FROZEN**.

'''
s = replace_exact(s, "## ES-13 gameplay canonicals\n", cont_evidence + "## ES-13 gameplay canonicals\n", "continuity evidence")
s = replace_exact(
    s,
    "- J5F-B — Pure Current Command-Link Pulse Target Eligibility Contract: `9812592dd77a0dd4e6364d57857f4c9065757d49`.",
    "- J5F-B — Pure Current Command-Link Pulse Target Eligibility Contract: `9812592dd77a0dd4e6364d57857f4c9065757d49`.\n- J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope: `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`.",
    "continuity canonical list",
)
s = replace_exact(
    s,
    "- DOC26 — J5F-B closure & J5F-C non-lethal damage safety activation: Issue #361, branch `docs/es-13-j5fb-closure-j5fc-activation`, documentation-only closure in progress from gameplay canonical `9812592dd77a0dd4e6364d57857f4c9065757d49`.",
    "- DOC26 — J5F-B closure & J5F-C non-lethal damage safety activation: `7a24f7a747a2d2eb2fb79b4eb4a249ded67a8193` — Issue #361 / PR #362.\n- DOC27 — J5F-C closure & J5F-D trigger-damage source activation: Issue #365, branch `docs/es-13-j5fc-closure-j5fd-source-projection`, documentation-only closure in progress from gameplay canonical `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`.",
    "continuity DOC26 DOC27",
)
cont_next = '''### ES-13J5F-D — Pure Effective Trigger-Damage Source Projection
Status: **NEXT ENGINEERING TARGET AFTER DOC27 CLOSURE**

Runtime discovery confirms both existing defeat-capable paths already own a final scalar immediately before health mutation: direct-hit `damageToApply` and splash `splashDamage`. J5F-D will remain pure and caller-fed, validating only source kind, final resolved source damage and source health immediately before the hit.

Required direction:
- source kind limited to `DIRECT_HIT` / `SPLASH_HIT`;
- finite positive resolved source damage and pre-hit source health required;
- `effectiveTriggerDamage = min(resolvedSourceDamage, sourceHealthBeforeHit)` to prevent overkill amplification;
- immutable projection only; no multiplier/percentage/tuning;
- no `EnergySwarmGame.tsx` adoption, target lookup/scan/collection, health mutation, defeat/reward/drop attribution, projectile/spawn, formation, timing/RNG, cap/budget or entity create/remove authority;
- any J5F-E+ live wiring must independently prove exact source capture, current linked-target application and single defeat/reward attribution.

'''
s = replace_regex(
    s,
    r"### ES-13J5F-C — Pure Non-Lethal Command-Link Pulse Damage Safety Envelope\n.*?(?=J4D\+ additional tactical families remain \*\*DEFERRED)",
    cont_next,
    "continuity next phase",
)
s = replace_exact(
    s,
    "`J5F-C Pure Non-Lethal Command-Link Pulse Damage Safety Envelope → J5F-D+ source tuning/live application → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "`J5F-D Pure Effective Trigger-Damage Source Projection → J5F-E+ separately proven live application → J6 Dynamic Events → J7 Bonus Rounds → J8 Additional Modes → J9 Boss Expansion → J10 Expert Risk/Reward → J11 Build/Synergy → J12 Rare/Secret Encounters → J13 Score/Rank/Mastery → J14 Procedural Matrix → J15 Integration/Balance`",
    "continuity chronology",
)
s = replace_regex(
    s,
    r"> Continue ORBI Energy Swarm autonomously\..*?(?=\n\n## Update obligation)",
    "> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J5F-C gameplay canonical is `53ff3b1fa0da58ea9bb7259162a98f3dac17df77`, fully DEPLOYED / FROZEN via Issue #363 / PR #364 with exact three-file product scope and post-main CI/Android/Pages GREEN. Complete DOC27 if still open, then implement J5F-D as a pure Effective Trigger-Damage Source Projection only: caller-supplied `DIRECT_HIT`/`SPLASH_HIT`, resolved source damage and pre-hit source health; project `min(resolvedSourceDamage, sourceHealthBeforeHit)` with no tuning, runtime mutation, lookup/scan/collection, defeat/reward/drop, timing/RNG or cap authority. Any live application remains J5F-E+ and requires independent source-capture/current-target/single-attribution proof. Keep J4D+ families and J3C-C deferred until prerequisites are proven. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.",
    "continuity handoff",
)
p.write_text(s)

print("DOC27 patch prepared")
