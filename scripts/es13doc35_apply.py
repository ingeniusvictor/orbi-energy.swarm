from pathlib import Path
import re

CANON = "8a5244e770c360d13b8218599ba3f49bbaa03b46"
PARENT = "b858b14a2682fd5855eda5093fc6b13ec3a5653c"
TREE = "3bcbbf230fa83cd44dc4d23cb4339ef077fd37cd"


def sub_once(text: str, pattern: str, replacement: str, label: str, flags=0) -> str:
    out, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one replacement, got {count}")
    return out


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, got {count}")
    return text.replace(old, new, 1)

continuity_path = Path("docs/PROJECT_CONTINUITY.md")
ledger_path = Path("docs/IMPLEMENTATION_LEDGER.md")
roadmap_path = Path("docs/ES13_GAMEPLAY_ROADMAP.md")

continuity = continuity_path.read_text()
ledger = ledger_path.read_text()
roadmap = roadmap_path.read_text()

continuity = sub_once(
    continuity,
    r"## Current certified gameplay canonical\n\n.*?Version remains `0\.2\.0-beta\.1`\. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay\.\n",
    f"""## Current certified gameplay canonical\n\n`{CANON}`\n\nPhase: **ES-13J7A — Pure Timed Survival Bonus Challenge Profile Contract**\nStatus: **DEPLOYED / FROZEN**\nIssue: #395 — CLOSED / completed\nDelivery: PR #396 — squash merged\n\nSingle parent: `{PARENT}` — DOC34 documentation canonical.\n\nCanonical tree: `{TREE}`.\n\nVersion remains `0.2.0-beta.1`. Full RC/manual certification remains intentionally deferred while ES-13 materially expands gameplay.\n""",
    "continuity canonical block",
    re.S,
)

continuity = replace_once(
    continuity,
    "- DOC34 — J6B-D closure & J7 discovery activation: Issue #393, branch `docs/es-13-j6bd-closure-j7-discovery`, documentation-only closure in progress from gameplay canonical `247d976b6e2cc634cbc5158cdff46ac42b51c5fc`.",
    "- DOC34 — J6B-D closure & J7 discovery activation: `b858b14a2682fd5855eda5093fc6b13ec3a5653c` — Issue #393 / PR #394.\n- DOC35 — J7A closure & J7B opportunity/cadence discovery activation: Issue #397, branch `docs/es-13-j7a-closure-j7b-activation`, documentation-only closure in progress from gameplay canonical `8a5244e770c360d13b8218599ba3f49bbaa03b46`.",
    "continuity DOC34 chronology",
)

continuity = sub_once(
    continuity,
    r"## Next gameplay phase\n\n### ES-13J7 — Bonus Challenge Rounds Discovery\n.*?(?=## Resolved diagnostics)",
    """## J7A result\nJ7A froze the first Bonus Challenge semantic profile without live adoption.\n\nCertified contract:\n- exactly one challenge identity: `TIMED_SURVIVAL` / `Timed Survival`;\n- family `RHYTHM_BREAKER`;\n- mode `PROFILE_ONLY`;\n- objective `SURVIVE_UNTIL_TIME_EXPIRES`;\n- completion compatibility `TIMEBOX`, reusing the existing runtime completion vocabulary;\n- duration is only bounded to the roadmap-derived `20000..40000 ms` window; no exact duration is selected;\n- unsupported, padded and deferred challenge identifiers fail closed;\n- no runtime file imports the contract;\n- no opportunity/cadence/source-mode selection, descriptor mutation, timer/clock/pause, spawn/arena, progression, combat, score/reward/economy, HUD, scan/index, cap/budget, entity/projectile or formation authority.\n\nFinal product scope exactly:\n- `src/game/bonusChallengeContract.ts`;\n- `tests/es-13j7a-bonus-challenge-contract.test.mjs`;\n- `tests/gameplay/bonus-challenge-contract.test.ts`.\n\n## J7A exact evidence\n- DOC34 baseline `b858b14a2682fd5855eda5093fc6b13ec3a5653c`;\n- pre-PR certification SHA `0bb6786bf20f1a3f8a8c24d8f4ec423199658f7c`, run `38849277024`, certify job `116806658248` GREEN and Android job `116806889571` GREEN with APK build/verify/upload;\n- final PR #396 head `67d6bbff8f303b51a7f84e8e18d02eb2021c4b8f`;\n- PR CI `38849513155` / `116807380556` GREEN;\n- PR Android `38849513130` / `116807380273` GREEN including APK build/verify/upload;\n- canonical `8a5244e770c360d13b8218599ba3f49bbaa03b46`, single parent `b858b14a2682fd5855eda5093fc6b13ec3a5653c`, tree `3bcbbf230fa83cd44dc4d23cb4339ef077fd37cd`;\n- canonical diff exactly three certified product files;\n- main CI `38849701016` / `116807960929` GREEN;\n- main Android `38849700878` / `116807960547` GREEN including APK build/verify/upload;\n- Pages `38849771214`: build `116808178956` + deploy `116808274531` GREEN.\n\nIssue #395 CLOSED / completed. J7A is **DEPLOYED / FROZEN**.\n\n## Next gameplay phase\n\n### ES-13J7B — Pure Bonus Challenge Opportunity/Cadence Contract\nStatus: **NEXT DISCOVERY / CONTRACT TARGET AFTER DOC35 CLOSURE**\n\nJ7B must decide when and where the frozen J7A `TIMED_SURVIVAL` profile may become eligible, without adopting it live. Required discovery:\n- derive only from existing runtime progression/session facts;\n- prove source-mode scope rather than assume Campaign or Infinite;\n- choose a deterministic sparse opportunity rule and any minimum progression threshold;\n- explicitly exclude or define first/final wave, milestone and recovery interactions;\n- prove collision/precedence with J6 dynamic events and existing tactical/milestone seams;\n- decide whether eligibility targets an existing wave slot or whether a future insertion model would require separate justification;\n- retain `PROFILE_ONLY` J7A semantics and do not choose an exact duration yet unless a dedicated contract proves it.\n\nJ7B remains pure: no runtime descriptor mutation, timer start/tick, spawn/arena change, score/reward/economy, HUD, RNG/clock, collection/scan/index, cap/budget or entity authority.\n\n""",
    "continuity J7 next phase",
    re.S,
)

continuity = sub_once(
    continuity,
    r"Suggested handoff:\n> .*?\n\n## Update obligation",
    f"""Suggested handoff:\n> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J7A gameplay canonical is `{CANON}`, fully DEPLOYED / FROZEN via Issue #395 / PR #396 with pure `TIMED_SURVIVAL` / `PROFILE_ONLY` semantics and post-main CI/Android/Pages GREEN. Complete DOC35 if still open, then perform J7B opportunity/cadence architecture before any live Bonus Challenge adoption. Reuse existing progression facts and TIMEBOX compatibility, but do not infer source-mode scope, exact duration, cadence, rewards, spawn/arena or HUD authority. Preserve caps/budgets, J6 coexistence, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.\n\n## Update obligation""",
    "continuity handoff",
    re.S,
)

ledger = replace_once(
    ledger,
    "| ES-13J6B-D — Controlled Live Dynamic Event Adoption | DEPLOYED / FROZEN | `247d976b6e2cc634cbc5158cdff46ac42b51c5fc` | #391 | #392 |",
    "| ES-13J6B-D — Controlled Live Dynamic Event Adoption | DEPLOYED / FROZEN | `247d976b6e2cc634cbc5158cdff46ac42b51c5fc` | #391 | #392 |\n| ES-13J7A — Pure Timed Survival Bonus Challenge Profile Contract | DEPLOYED / FROZEN | `8a5244e770c360d13b8218599ba3f49bbaa03b46` | #395 | #396 |",
    "ledger milestone row",
)

ledger = replace_once(
    ledger,
    "- DOC34 — J6B-D closure & J7 discovery activation: Issue #393, branch `docs/es-13-j6bd-closure-j7-discovery`, in progress from gameplay canonical `247d976b6e2cc634cbc5158cdff46ac42b51c5fc`.",
    "- DOC34 — J6B-D closure & J7 discovery activation: `b858b14a2682fd5855eda5093fc6b13ec3a5653c` — Issue #393 / PR #394.\n- DOC35 — J7A closure & J7B opportunity/cadence discovery activation: Issue #397, branch `docs/es-13-j7a-closure-j7b-activation`, in progress from gameplay canonical `8a5244e770c360d13b8218599ba3f49bbaa03b46`.",
    "ledger DOC34 chronology",
)

ledger = replace_once(
    ledger,
    "- No new timer/RNG/seed/clock, collections/scans, spawn/progression, combat/economy, cap/budget, FOTON or formation authority.\n\n## Frozen manual/physical blockers",
    "- No new timer/RNG/seed/clock, collections/scans, spawn/progression, combat/economy, cap/budget, FOTON or formation authority.\n\n### J7A — Pure Timed Survival Bonus Challenge Profile Contract\n- Exactly one immutable profile: `TIMED_SURVIVAL` / `Timed Survival`, family `RHYTHM_BREAKER`, mode `PROFILE_ONLY`, objective `SURVIVE_UNTIL_TIME_EXPIRES`.\n- Compatibility intent is the existing `TIMEBOX` completion vocabulary; J7A owns no completion/timer authority.\n- Duration remains a window only: `20000..40000 ms`; no exact duration/cadence/source mode is selected.\n- Unsupported/padded/deferred challenge ids fail closed; no live runtime import/adoption.\n- Pre-PR `0bb6786bf20f1a3f8a8c24d8f4ec423199658f7c`, run `38849277024`, certify `116806658248` GREEN + Android `116806889571` GREEN.\n- Final PR #396 head `67d6bbff8f303b51a7f84e8e18d02eb2021c4b8f`; PR CI `38849513155` / `116807380556` GREEN; PR Android `38849513130` / `116807380273` GREEN.\n- Canonical `8a5244e770c360d13b8218599ba3f49bbaa03b46`, parent `b858b14a2682fd5855eda5093fc6b13ec3a5653c`, tree `3bcbbf230fa83cd44dc4d23cb4339ef077fd37cd`, exact diff three product files.\n- Main CI `38849701016` / `116807960929` GREEN; Android `38849700878` / `116807960547` GREEN; Pages `38849771214`, build `116808178956` + deploy `116808274531` GREEN.\n- No live timer/pause, spawn/arena, progression, combat, score/reward/economy, HUD, scan/index, cap/budget, entity/projectile or formation authority.\n\n## Frozen manual/physical blockers",
    "ledger J7A evidence insertion",
)

ledger = sub_once(
    ledger,
    r"## Next planned gameplay\n\n### ES-13J7 — Bonus Challenge Rounds Discovery\n.*?(?=J4D\+ additional tactical families remain deferred:)",
    """## Next planned gameplay\n\n### ES-13J7B — Pure Bonus Challenge Opportunity/Cadence Contract\nStatus: **NEXT DISCOVERY / CONTRACT TARGET AFTER DOC35 CLOSURE**.\n\nJ7A has selected only the semantic `TIMED_SURVIVAL` profile and a 20–40 s compatibility window. J7B must remain pure and determine eligibility/cadence from existing progression facts: source-mode scope, sparse deterministic opportunity rule, threshold, first/final-wave exclusions, milestone/recovery handling, J6 collision/precedence and whether the opportunity targets an existing wave slot. No exact duration, descriptor mutation, live timer, spawn/arena, reward/economy, HUD, RNG/clock, collections/scans or cap/budget authority is allowed in J7B.\n\n""",
    "ledger next gameplay",
    re.S,
)

roadmap = sub_once(
    roadmap,
    r"## J7 — Bonus Challenge Rounds\n.*?(?=## J8 — Additional Game Modes)",
    """## J7 — Bonus Challenge Rounds\nStatus: **ACTIVE PROGRAM**\n\n20–40 s rhythm breakers remain the long-range design vocabulary: precision, rescue, collection, evasive corridors, pursuit, affinity puzzles, obstacle navigation, timed survival and survival without firing.\n\n### J7A — Pure Timed Survival Bonus Challenge Profile Contract\nStatus: **DEPLOYED / FROZEN**\nCanonical: `8a5244e770c360d13b8218599ba3f49bbaa03b46`  \nIssue #395 / PR #396\n\nJ7A selected the smallest justified first challenge without live adoption:\n- `TIMED_SURVIVAL` / `Timed Survival`;\n- family `RHYTHM_BREAKER`;\n- mode `PROFILE_ONLY`;\n- objective `SURVIVE_UNTIL_TIME_EXPIRES`;\n- compatibility intent `TIMEBOX`;\n- duration window only `20000..40000 ms`;\n- no exact duration, opportunity/cadence, source-mode, timer/pause, spawn/arena, score/reward/economy, HUD or runtime mutation authority.\n\nExisting runtime `TIMEBOX` completion and pause-safe game-loop timing remain separate authorities; J7A does not import into live runtime code. Other candidate challenge types remain uncontracted.\n\nExact deployment anchors:\n- pre-PR `0bb6786bf20f1a3f8a8c24d8f4ec423199658f7c`, run `38849277024`, certify job `116806658248` + Android `116806889571` GREEN;\n- final PR #396 head `67d6bbff8f303b51a7f84e8e18d02eb2021c4b8f`;\n- PR CI `38849513155` / `116807380556` GREEN; Android `38849513130` / `116807380273` GREEN;\n- canonical `8a5244e770c360d13b8218599ba3f49bbaa03b46`, parent `b858b14a2682fd5855eda5093fc6b13ec3a5653c`, tree `3bcbbf230fa83cd44dc4d23cb4339ef077fd37cd`;\n- main CI `38849701016` / `116807960929` GREEN; Android `38849700878` / `116807960547` GREEN;\n- Pages `38849771214`, build `116808178956` + deploy `116808274531` GREEN.\n\n### J7B — Pure Bonus Challenge Opportunity/Cadence Contract\nStatus: **NEXT DISCOVERY / CONTRACT TARGET AFTER DOC35 CLOSURE**\n\nJ7B must establish deterministic eligibility before any Timed Survival live adoption. Discovery must prove:\n- source-mode scope from existing runtime architecture;\n- sparse deterministic cadence and any minimum threshold;\n- first/final-wave, milestone and recovery exclusions/semantics;\n- collision/precedence with J6 dynamic events and existing tactical/milestone seams;\n- whether eligibility can target an existing wave slot or whether a future insertion model requires separate justification.\n\nJ7B remains pure: no descriptor mutation, exact duration, timer start/tick, spawn/arena composition, score/reward/economy, HUD, RNG/clock, collection/scan/index, caps/budgets, entities/projectiles, FOTON or formation changes.\n\n""",
    "roadmap J7 block",
    re.S,
)

# Fail-closed preservation guards.
for label, text in (("continuity", continuity), ("ledger", ledger), ("roadmap", roadmap)):
    for required in ("#4", "#5", "#202", "#248"):
        if required not in text:
            raise SystemExit(f"{label}: missing manual blocker {required}")

for required in ("#254", "#283", "J3C-C", "J4D+"):
    if required not in continuity:
        raise SystemExit(f"continuity: missing preserved marker {required}")

for required in (
    "## J8 — Additional Game Modes",
    "## J9 — Boss",
    "## J10 —",
    "## J11 —",
    "## J12 —",
    "## J13 —",
    "## J14 —",
    "## J15 —",
    "ES-14",
):
    if required not in roadmap:
        raise SystemExit(f"roadmap: missing preserved marker {required}")

for required in (CANON, "ES-13J7B", "TIMED_SURVIVAL"):
    for label, text in (("continuity", continuity), ("ledger", ledger), ("roadmap", roadmap)):
        if required not in text:
            raise SystemExit(f"{label}: missing DOC35 marker {required}")

continuity_path.write_text(continuity)
ledger_path.write_text(ledger)
roadmap_path.write_text(roadmap)
