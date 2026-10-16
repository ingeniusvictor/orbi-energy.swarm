from pathlib import Path
import re

ROADMAP = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
LEDGER = Path("docs/IMPLEMENTATION_LEDGER.md")
CONTINUITY = Path("docs/PROJECT_CONTINUITY.md")

J8E = "5260ffc4e63061646b180d4da419d5d7b794db68"
J8E_PARENT = "7da459c56ab27d7891cf859db9c1065347cd2736"
J8E_TREE = "6094ca2b366463179233fb63383d355c03839d4b"


def sub_once(text: str, pattern: str, replacement: str, label: str, flags=re.S) -> str:
    next_text, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one replacement, got {count}")
    return next_text


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one marker, got {count}")
    return text.replace(old, new, 1)


# Roadmap: preserve J9+ byte-for-byte while replacing only the active J8 tail.
roadmap = ROADMAP.read_text()
roadmap_j9_tail = roadmap[roadmap.index("## J9 — Boss & Miniboss Expansion"):]
roadmap = sub_once(
    roadmap,
    r"### ES-13J8E — Dedicated Score Attack Storage-Schema Adoption\n.*?(?=\n## J9 — Boss & Miniboss Expansion)",
    '''### ES-13J8E — Dedicated Score Attack Storage-Schema Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `5260ffc4e63061646b180d4da419d5d7b794db68`  
Issue #428 / PR #429

J8E reserves the dedicated Score Attack record in the existing persistence schema without making Score Attack live:
- `GameStats.scoreAttackBestScore: number` is required and defaults to `0`;
- the existing `orbi_energy_swarm_stats_v2` key and save/reset path remain authoritative;
- load sanitization is finite, non-negative, floored and capped at `Number.MAX_SAFE_INTEGER`; malformed/negative values fail closed to `0`;
- global `highScore` remains independent;
- `scoreAttackRecordProjection.ts` and `runPersistence.ts` remain unchanged;
- no run-completion record write, archive change, live session/runtime/timer/UI adoption or Campaign/Infinite behavior change was introduced.

Exact closure evidence:
- initial certifier `38919090012` correctly went RED on one historical pre-J8E J8D test; Android `117034051271` still passed with APK;
- evidence-driven test-only transition was documented on #428 without modifying J8D implementation or `runPersistence.ts`;
- final pre-PR SHA `7298d284e3c78801a14cef2416240732417186f1`, run `38919470032`, certify `117035335947` + Android `117035335482` GREEN;
- clean PR head `4cc7c247b91429b1cccbefeebaba690e156c89d1`;
- PR CI `38919716924` / `117036177752` GREEN; Android `38919717107` / `117036177762` GREEN;
- canonical `5260ffc4e63061646b180d4da419d5d7b794db68`, parent `7da459c56ab27d7891cf859db9c1065347cd2736`, tree `6094ca2b366463179233fb63383d355c03839d4b`, exact diff four certified source/test files;
- main CI `38919920231` / `117036889398` GREEN; Android `38919920210` / `117036889938` GREEN;
- Pages `38920010388`, build `117037206191` + deploy `117037367882` GREEN.

### ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract
Status: **NEXT CONTRACT TARGET AFTER DOC43 CLOSURE**

Discovery after J8E shows that effective record writes are still premature: `FinalRunCommitInput` has no mode/completion discriminator, generic `applyFinalRunCommit(...)` always owns global `highScore`, J8B does not construct/execute a live Score Attack session and J8C only projects TIMEBOX completion.

J8F must therefore freeze a pure/fail-closed decision boundary only. It may consume explicit `SCORE_ATTACK` identity, explicit TIMEBOX-completion facts, the existing dedicated best score and candidate score through frozen J8D projection semantics, and report record advancement eligibility only for `NEW_BEST`. Non-Score-Attack, absent/wrong completion facts and non-advancing projections fail closed.

J8F must not write storage, mutate `GameStats`, change `applyFinalRunCommit`, add live mode/session/timer/clock/pause authority, alter StartScreen/ResultScreen/HUD, score formula, rewards/economy, archives, Campaign/Infinite behavior, spawn/arena, scans/indexes, caps/budgets, entities/projectiles, FOTON or formations.
''',
    "roadmap J8E/J8F transition",
)
if roadmap[roadmap.index("## J9 — Boss & Miniboss Expansion"):] != roadmap_j9_tail:
    raise SystemExit("roadmap downstream J9+ preservation failed")
ROADMAP.write_text(roadmap)

# Ledger: add J8E milestone, close DOC42, start DOC43, add evidence, activate J8F.
ledger = LEDGER.read_text()
ledger = replace_once(
    ledger,
    '| ES-13J8D — Pure Dedicated Score Attack Record Projection Contract | DEPLOYED / FROZEN | `de37f4a818b05b09c136617b71cf3620bf4e1e83` | #424 | #425 |',
    '| ES-13J8D — Pure Dedicated Score Attack Record Projection Contract | DEPLOYED / FROZEN | `de37f4a818b05b09c136617b71cf3620bf4e1e83` | #424 | #425 |\n| ES-13J8E — Dedicated Score Attack Storage-Schema Adoption | DEPLOYED / FROZEN | `5260ffc4e63061646b180d4da419d5d7b794db68` | #428 | #429 |',
    "ledger J8E milestone row",
)
ledger = replace_once(
    ledger,
    '- DOC42 — J8D closure & J8E dedicated Score Attack storage-schema adoption activation: Issue #426, branch `docs/es-13-j8d-closure-j8e-storage-schema`, in progress from gameplay canonical `de37f4a818b05b09c136617b71cf3620bf4e1e83`.',
    '- DOC42 — J8D closure & J8E dedicated Score Attack storage-schema adoption activation: `7da459c56ab27d7891cf859db9c1065347cd2736` — Issue #426 / PR #427.\n- DOC43 — J8E closure & J8F pure Score Attack record-commit eligibility activation: Issue #430, branch `docs/es-13-j8e-closure-j8f-record-commit-eligibility`, documentation-only closure in progress from gameplay canonical `5260ffc4e63061646b180d4da419d5d7b794db68`.',
    "ledger DOC42/DOC43 lineage",
)
ledger = sub_once(
    ledger,
    r"\n## Next planned gameplay\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)",
    '''
### J8E — Dedicated Score Attack Storage-Schema Adoption
- Required `GameStats.scoreAttackBestScore`, default `0`, existing v2 storage key/save/reset path retained.
- Persisted values sanitize to finite non-negative floored integers capped at `Number.MAX_SAFE_INTEGER`; malformed/negative values fail closed to `0`.
- Global `highScore` remains independent; J8D source and `runPersistence.ts` unchanged.
- Initial certifier `38919090012` exposed one obsolete pre-J8E architecture expectation; scope amendment was documented on #428 and fixed test-only without weakening J8D purity.
- Final pre-PR `7298d284e3c78801a14cef2416240732417186f1`: run `38919470032`, certify `117035335947` + Android `117035335482` GREEN.
- PR #429 head `4cc7c247b91429b1cccbefeebaba690e156c89d1`: CI `38919716924` / `117036177752` + Android `38919717107` / `117036177762` GREEN.
- Canonical `5260ffc4e63061646b180d4da419d5d7b794db68`, parent `7da459c56ab27d7891cf859db9c1065347cd2736`, tree `6094ca2b366463179233fb63383d355c03839d4b`, exact diff four certified files.
- Main CI `38919920231` / `117036889398`, Android `38919920210` / `117036889938`, Pages `38920010388` build `117037206191` + deploy `117037367882` GREEN.

## Next planned gameplay

### ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract
Status: **NEXT CONTRACT TARGET AFTER DOC43 CLOSURE**.

J8F is pure decision policy only. It must consume explicit canonical Score Attack identity + explicit TIMEBOX-completion facts and delegate best/candidate comparison to frozen J8D projection semantics. Only `NEW_BEST` may project record advancement eligibility; unsupported/missing identity/completion facts fail closed. It must not mutate `GameStats`, storage or `applyFinalRunCommit`, and must not acquire live runtime/session/timer/UI/archive/score/reward/economy/spawn/arena/entity authority.''',
    "ledger next gameplay transition",
)
LEDGER.write_text(ledger)

# Continuity: make J8E the certified gameplay canonical, record result/evidence, activate J8F.
continuity = CONTINUITY.read_text()
continuity = sub_once(
    continuity,
    r"## Current certified gameplay canonical\n\n`de37f4a818b05b09c136617b71cf3620bf4e1e83`\n\nPhase: \*\*ES-13J8D — Pure Dedicated Score Attack Record Projection Contract\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #424 — CLOSED / completed\nDelivery: PR #425 — squash merged\n\nSingle parent: `2e4eb93a06e303c42cd8c97a133a176860eb2e38` — DOC41 documentation canonical\.\n\nCanonical tree: `4bb5318cff768ec4cd5390be0d76daf3b1013b26`\.",
    '''## Current certified gameplay canonical

`5260ffc4e63061646b180d4da419d5d7b794db68`

Phase: **ES-13J8E — Dedicated Score Attack Storage-Schema Adoption**
Status: **DEPLOYED / FROZEN**
Issue: #428 — CLOSED / completed
Delivery: PR #429 — squash merged

Single parent: `7da459c56ab27d7891cf859db9c1065347cd2736` — DOC42 documentation canonical.

Canonical tree: `6094ca2b366463179233fb63383d355c03839d4b`.''',
    "continuity current canonical",
)
continuity = replace_once(
    continuity,
    '- DOC42 — J8D closure & J8E dedicated Score Attack storage-schema adoption activation: Issue #426, branch `docs/es-13-j8d-closure-j8e-storage-schema`, documentation-only closure in progress from gameplay canonical `de37f4a818b05b09c136617b71cf3620bf4e1e83`.',
    '- DOC42 — J8D closure & J8E dedicated Score Attack storage-schema adoption activation: `7da459c56ab27d7891cf859db9c1065347cd2736` — Issue #426 / PR #427.\n- DOC43 — J8E closure & J8F pure Score Attack record-commit eligibility activation: Issue #430, branch `docs/es-13-j8e-closure-j8f-record-commit-eligibility`, documentation-only closure in progress from gameplay canonical `5260ffc4e63061646b180d4da419d5d7b794db68`.',
    "continuity DOC42/DOC43 lineage",
)
continuity = sub_once(
    continuity,
    r"\n## Next gameplay phase\n\n### ES-13J8E — Dedicated Score Attack Storage-Schema Adoption\n.*?(?=\n## Resolved diagnostics)",
    '''
## J8E result
J8E adopted one dedicated Score Attack best-score field into the existing GameStats/v2 storage contract without making Score Attack live. `scoreAttackBestScore` defaults to `0`, loads with bounded J8D-compatible sanitization and remains semantically independent from global `highScore`. J8D implementation and `runPersistence.ts` stayed unchanged.

## J8E exact evidence
- DOC42 baseline `7da459c56ab27d7891cf859db9c1065347cd2736`;
- initial certifier `38919090012` correctly RED on one obsolete historical J8D pre-J8E assertion; Android `117034051271` GREEN with APK;
- evidence-driven test-only scope amendment documented on #428; J8D source + `runPersistence.ts` unchanged;
- final pre-PR SHA `7298d284e3c78801a14cef2416240732417186f1`, run `38919470032`, certify `117035335947` + Android `117035335482` GREEN;
- final PR #429 head `4cc7c247b91429b1cccbefeebaba690e156c89d1`;
- PR CI `38919716924` / `117036177752` GREEN;
- PR Android `38919717107` / `117036177762` GREEN including APK build/verify/upload;
- canonical `5260ffc4e63061646b180d4da419d5d7b794db68`, single parent `7da459c56ab27d7891cf859db9c1065347cd2736`, tree `6094ca2b366463179233fb63383d355c03839d4b`, exact diff four certified source/test files;
- main CI `38919920231` / `117036889398` GREEN;
- main Android `38919920210` / `117036889938` GREEN including APK build/verify/upload;
- Pages `38920010388`: build `117037206191` + deploy `117037367882` GREEN.

Issue #428 CLOSED / completed. J8E is **DEPLOYED / FROZEN**.

## Next gameplay phase

### ES-13J8F — Pure Score Attack Record-Commit Eligibility Contract
Status: **NEXT CONTRACT TARGET AFTER DOC43 CLOSURE**

Discovery is explicit: J8B does not construct/execute a live Score Attack session, J8C only projects TIMEBOX completion, and current `FinalRunCommitInput` carries no mode/completion discriminator while generic `applyFinalRunCommit(...)` owns global `highScore`. A live Score Attack record write is therefore not yet safe.

J8F must freeze only a pure/fail-closed eligibility projection. Given explicit canonical `SCORE_ATTACK` identity, explicit TIMEBOX-completion facts, existing dedicated best and candidate score, it must consume J8D projection semantics and report advancement only for `NEW_BEST`. Missing/wrong identity or completion facts fail closed. J8F owns no storage/GameStats write, `applyFinalRunCommit`, archive, live session/runtime/timer/clock/pause, UI/HUD, score formula, reward/economy, spawn/arena, scan/index, cap/budget, entity/projectile, FOTON or formation authority.
''',
    "continuity J8E closure/J8F activation",
)
continuity = sub_once(
    continuity,
    r"Suggested handoff:\n> Continue ORBI Energy Swarm autonomously\..*?(?=\n\n## Update obligation)",
    '''Suggested handoff:
> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J8E gameplay canonical is `5260ffc4e63061646b180d4da419d5d7b794db68`, fully DEPLOYED / FROZEN via Issue #428 / PR #429 with dedicated `scoreAttackBestScore` schema/storage adoption, global `highScore` isolation and post-main CI/Android/Pages GREEN. Complete DOC43 if still open, then implement J8F as a pure Score Attack record-commit eligibility contract: canonical `SCORE_ATTACK` + explicit TIMEBOX completion only, delegate record comparison to frozen J8D projection, allow advancement only for `NEW_BEST`, fail closed otherwise, and do not write storage/GameStats or modify `applyFinalRunCommit`. Preserve Campaign/Infinite, archives/UI/runtime, caps/budgets, FOTON/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.''',
    "continuity new-chat handoff",
)
CONTINUITY.write_text(continuity)

# Final content guards.
for path in (ROADMAP, LEDGER, CONTINUITY):
    text = path.read_text()
    for required in (
        J8E,
        "ES-13J8F",
        "SCORE_ATTACK",
        "TIMEBOX",
    ):
        if required not in text:
            raise SystemExit(f"{path}: missing required marker {required}")

for required in ("#4", "#5", "#202", "#248", "#254", "#283"):
    if required not in LEDGER.read_text() and required not in CONTINUITY.read_text():
        raise SystemExit(f"preservation marker missing: {required}")
