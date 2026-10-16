from pathlib import Path
import re

ROADMAP = Path('docs/ES13_GAMEPLAY_ROADMAP.md')
LEDGER = Path('docs/IMPLEMENTATION_LEDGER.md')
CONTINUITY = Path('docs/PROJECT_CONTINUITY.md')

J8M = '9ec6a76bf34057881326530af9581e0eca1a0c74'
J8M_PARENT = '25fed78cc7a6855a015d10538246490c914d6818'
J8M_TREE = '3fd28427b2997aaae3a5ea4b20bc4c1bfbd8e644'


def sub_once(text, pattern, replacement, label, flags=re.S):
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one replacement, got {count}')
    return updated


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one marker, got {count}')
    return text.replace(old, new, 1)

roadmap = ROADMAP.read_text()
j9_marker = '## J9 — Boss & Miniboss Expansion'
j9_tail = roadmap[roadmap.index(j9_marker):]
roadmap = sub_once(
    roadmap,
    r'### ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract\n.*?(?=\n## J9 — Boss & Miniboss Expansion)',
    '''### ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract
Status: **DEPLOYED / FROZEN**
Canonical: `9ec6a76bf34057881326530af9581e0eca1a0c74`  
Issue #461 / PR #462

J8M freezes pure Score Attack terminal orchestration without performing live writes or UI transitions:
- consumes exact frozen J8L activation identity plus one existing runtime completion snapshot;
- delegates terminal resolution only to J8J and returns null until canonical `END_SCORE_ATTACK_ATTEMPT`;
- derives only completed `TIMEBOX / 60000 ms` metadata;
- delegates score normalization/comparison/eligibility only to J8F;
- preserves NEW_BEST / TIED_BEST / BELOW_BEST and invalid-score fail-closed semantics;
- preserves exact activation-envelope identity;
- exactly one positive authority: attempt-finalization plan composition;
- no storage/GameStats/global-highScore/generic-run-persistence/archive/UI/timer/session/gameplay mutation authority.

Exact deployment anchors:
- pre-PR SHA `e1d0782323797f23df07b23144343a1bad6f6ed7`, run `38967353570`, certify `117197025001` + Android `117197024558` GREEN;
- clean PR #462 head `be585fcbe0db9e3070679a248b32e3e843685557`;
- PR CI `38967576188` / `117197754938` GREEN; Android `38967575955` / `117197754035` GREEN;
- canonical `9ec6a76bf34057881326530af9581e0eca1a0c74`, parent `25fed78cc7a6855a015d10538246490c914d6818`, tree `3fd28427b2997aaae3a5ea4b20bc4c1bfbd8e644`, exact diff three certified files;
- main CI `38967741204` / `117198308312` GREEN; Android `38967740979` / `117198308018` GREEN;
- Pages `38967850132`, build `117198668879` + deploy `117198801507` GREEN.

### ES-13J8N — Pure Dedicated Score Attack Stats-Commit Application Contract
Status: **NEXT CONTRACT TARGET AFTER DOC51 CLOSURE**

Discovery after J8M shows live adoption is still unsafe if Score Attack falls through the generic run finalizer: current `commitStats(...)` delegates to `applyFinalRunCommit(...)`, while the dedicated Score Attack record must remain isolated from global `highScore`, generic archive/run counters and Infinite persistence. Generic live projection also consumes live follower count, and generic Infinite completion advances the runtime, so those seams remain deferred until dedicated record application is frozen.

J8N must consume one valid J8M finalization plan plus existing `GameStats`, fail closed if the current `scoreAttackBestScore` no longer matches J8M's normalized existing-best fact, and return a new immutable stats application result. NEW_BEST may change only `scoreAttackBestScore` to J8M `projectedBestScore`; TIED_BEST / BELOW_BEST must preserve stats semantically unchanged. Every unrelated GameStats field, including global `highScore`, Campaign/Infinite records, totalRuns, credits, memories and recent-run archive, must remain exact.

J8N owns only dedicated Score Attack stats-commit application semantics. It must not call `saveGameStats`, localStorage, `applyFinalRunCommit`, archive append, React/UI, runtime/session/timer, score formula/economy, spawn/arena/entity/projectile/cap/budget/FOTON/formation authorities.
''',
    'roadmap J8M closure/J8N activation',
)
if roadmap[roadmap.index(j9_marker):] != j9_tail:
    raise SystemExit('roadmap J9+ preservation failed')
ROADMAP.write_text(roadmap)

ledger = LEDGER.read_text()
ledger = replace_once(
    ledger,
    '| ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract | DEPLOYED / FROZEN | `d41f00a1a87140dba1ddc2d04b207261df862307` | #457 | #458 |',
    '| ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract | DEPLOYED / FROZEN | `d41f00a1a87140dba1ddc2d04b207261df862307` | #457 | #458 |\n| ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract | DEPLOYED / FROZEN | `9ec6a76bf34057881326530af9581e0eca1a0c74` | #461 | #462 |',
    'ledger J8M milestone row',
)
ledger = sub_once(
    ledger,
    r'\n## Next planned gameplay\n\n### ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)',
    '''
### J8M — Pure Score Attack Attempt Finalization Plan Contract
- Pure composition of frozen J8L activation, J8J terminal disposition and J8F dedicated-record eligibility.
- Null until canonical TIMEBOX completion; terminal disposition is exactly `END_SCORE_ATTACK_ATTEMPT` and never advances Infinite.
- NEW_BEST/TIED_BEST/BELOW_BEST and score normalization/clamping remain inherited from J8F.
- Pre-PR `e1d0782323797f23df07b23144343a1bad6f6ed7`: run `38967353570`, certify `117197025001` + Android `117197024558` GREEN.
- PR #462 head `be585fcbe0db9e3070679a248b32e3e843685557`: CI `38967576188` / `117197754938` + Android `38967575955` / `117197754035` GREEN.
- Canonical `9ec6a76bf34057881326530af9581e0eca1a0c74`, parent `25fed78cc7a6855a015d10538246490c914d6818`, tree `3fd28427b2997aaae3a5ea4b20bc4c1bfbd8e644`, exact diff three certified files.
- Main CI `38967741204` / `117198308312`, Android `38967740979` / `117198308018`, Pages `38967850132` build `117198668879` + deploy `117198801507` GREEN.

## Next planned gameplay

### ES-13J8N — Pure Dedicated Score Attack Stats-Commit Application Contract
Status: **NEXT CONTRACT TARGET AFTER DOC51 CLOSURE**.

J8N must apply one valid J8M plan to existing GameStats without storage I/O: stale current dedicated-best facts fail closed; NEW_BEST changes only `scoreAttackBestScore`; TIED/BELOW preserve all stats. Global highScore, generic run persistence/archive, Infinite progression and every unrelated field remain isolated. No storage/UI/runtime/timer/gameplay authority.''',
    'ledger J8M evidence/J8N next',
)
LEDGER.write_text(ledger)

continuity = CONTINUITY.read_text()
continuity = sub_once(
    continuity,
    r'## Current certified gameplay canonical\n\n`d41f00a1a87140dba1ddc2d04b207261df862307`\n\nPhase: \*\*ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #457 — CLOSED / completed\nDelivery: PR #458 — squash merged\n\nSingle parent: `9d110a10e07da45f51c932d575f0ae3edb9606d4` — DOC49 documentation canonical\.\n\nCanonical tree: `20e5f9a1a48a03108d1c5ea140009d56e0b8da29`\.',
    '''## Current certified gameplay canonical

`9ec6a76bf34057881326530af9581e0eca1a0c74`

Phase: **ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract**
Status: **DEPLOYED / FROZEN**
Issue: #461 — CLOSED / completed
Delivery: PR #462 — squash merged

Single parent: `25fed78cc7a6855a015d10538246490c914d6818` — DOC50 documentation canonical.

Canonical tree: `3fd28427b2997aaae3a5ea4b20bc4c1bfbd8e644`.''',
    'continuity current canonical',
)
continuity = sub_once(
    continuity,
    r'\n## Next gameplay phase\n\n### ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract\n.*?(?=\n## Resolved diagnostics)',
    '''
## J8M result
J8M froze pure Score Attack terminal orchestration over exact J8L/J8J/J8F facts. It returns null until canonical TIMEBOX completion, then exposes `END_SCORE_ATTACK_ATTEMPT`, completed 60000 ms metadata and dedicated record eligibility without advancing Infinite or writing persistence/UI state.

## J8M exact evidence
- DOC50 baseline `25fed78cc7a6855a015d10538246490c914d6818`;
- pre-PR SHA `e1d0782323797f23df07b23144343a1bad6f6ed7`, run `38967353570`, certify `117197025001` + Android `117197024558` GREEN;
- final PR #462 head `be585fcbe0db9e3070679a248b32e3e843685557`;
- PR CI `38967576188` / `117197754938` GREEN;
- PR Android `38967575955` / `117197754035` GREEN including APK build/verify/upload;
- canonical `9ec6a76bf34057881326530af9581e0eca1a0c74`, single parent `25fed78cc7a6855a015d10538246490c914d6818`, tree `3fd28427b2997aaae3a5ea4b20bc4c1bfbd8e644`, exact diff three certified files;
- main CI `38967741204` / `117198308312` GREEN;
- main Android `38967740979` / `117198308018` GREEN including APK build/verify/upload;
- Pages `38967850132`: build `117198668879` + deploy `117198801507` GREEN.

Issue #461 CLOSED / completed. J8M is **DEPLOYED / FROZEN**.

## Next gameplay phase

### ES-13J8N — Pure Dedicated Score Attack Stats-Commit Application Contract
Status: **NEXT CONTRACT TARGET AFTER DOC51 CLOSURE**

Discovery shows Score Attack cannot safely reuse generic `commitStats(...)` / `applyFinalRunCommit(...)`: those authorities update generic run persistence/high-score/archive semantics. J8N must therefore own only a pure dedicated GameStats application boundary over J8M. It must fail closed on stale dedicated-best facts, apply NEW_BEST only to `scoreAttackBestScore`, preserve tied/below runs without stats changes, and preserve every unrelated GameStats field exactly. No save/localStorage, generic persistence/archive, React/UI, runtime/session/timer or gameplay authority is allowed.
''',
    'continuity J8M closure/J8N activation',
)
CONTINUITY.write_text(continuity)

for required in ('## J9 — Boss & Miniboss Expansion', '## J15', 'ES-14'):
    if required not in ROADMAP.read_text():
        raise SystemExit(f'roadmap marker missing: {required}')
for required in ('#4', '#5', '#202', '#248'):
    if required not in LEDGER.read_text():
        raise SystemExit(f'ledger blocker marker missing: {required}')
for required in ('#254', '#283'):
    if required not in CONTINUITY.read_text():
        raise SystemExit(f'continuity diagnostic marker missing: {required}')
