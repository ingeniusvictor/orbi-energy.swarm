from pathlib import Path
import re

ROADMAP = Path('docs/ES13_GAMEPLAY_ROADMAP.md')
LEDGER = Path('docs/IMPLEMENTATION_LEDGER.md')
CONTINUITY = Path('docs/PROJECT_CONTINUITY.md')

J8L = 'd41f00a1a87140dba1ddc2d04b207261df862307'
J8L_PARENT = '9d110a10e07da45f51c932d575f0ae3edb9606d4'
J8L_TREE = '20e5f9a1a48a03108d1c5ea140009d56e0b8da29'


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

# ROADMAP: close J8L, activate J8M, preserve J9+ byte-for-byte.
roadmap = ROADMAP.read_text()
j9_marker = '## J9 — Boss & Miniboss Expansion'
j9_tail = roadmap[roadmap.index(j9_marker):]
roadmap = sub_once(
    roadmap,
    r'### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract\n.*?(?=\n## J9 — Boss & Miniboss Expansion)',
    '''### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract
Status: **DEPLOYED / FROZEN**
Canonical: `d41f00a1a87140dba1ddc2d04b207261df862307`  
Issue #457 / PR #458

J8L freezes the pure outer Score Attack activation carrier required before controlled live adoption:
- consumes one valid frozen J8H bootstrap envelope and its exact J8K projection bundle;
- preserves explicit outer `modeId: SCORE_ATTACK` while nested runtime remains exactly `INFINITE`;
- carries exact object identity for bootstrap envelope, runtime/session, J8K bundle and effective descriptor;
- inherits canonical Sector 11 / Wave 1, fixed seed, TIMEBOX / 60000 ms, Adaptive Invasion bypass and J6/J7 null compatibility;
- owns only activation-envelope construction/composition;
- no React/cache/start/result/HUD adoption, timer/clock/cursor, session advance/end, persistence/archive/record write or gameplay mutation authority.

Exact deployment anchors:
- initial pre-PR run `38962595762` exposed only a test-side truncation of frozen J8B `canonicalFreshStart`; product scope/repo smoke remained GREEN and Android succeeded;
- isolated corrected diagnostic `38963366915` / `117183693510` passed all six J8L tests;
- final pre-PR SHA `1c9f9e65b8307d1f73dfc6215c6f77b387cfbf0b`, run `38963464711`, certify `117184022310` + Android `117184023007` GREEN;
- clean PR #458 head `a06c71e7ca72991051e7bcc7752f0f50089e41d4`;
- PR CI `38963705565` / `117184830694` GREEN; Android `38963705688` / `117184831351` GREEN;
- canonical `d41f00a1a87140dba1ddc2d04b207261df862307`, parent `9d110a10e07da45f51c932d575f0ae3edb9606d4`, tree `20e5f9a1a48a03108d1c5ea140009d56e0b8da29`, exact diff three certified files;
- main CI `38963938606` / `117185611390` GREEN; Android `38963938646` / `117185612137` GREEN;
- Pages `38964054007`, build `117186003430` + deploy `117186140619` GREEN.

### ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract
Status: **NEXT CONTRACT TARGET AFTER DOC50 CLOSURE**

J8M must freeze the final pure terminal-orchestration prerequisite before live Score Attack UI/runtime/persistence adoption. It must consume one valid J8L activation envelope plus one existing `RuntimeCompletionSnapshot`, delegate terminal completion only to frozen J8J/existing runtime completion policy, and return null until J8J resolves canonical `END_SCORE_ATTACK_ATTEMPT`.

Once terminal, J8M must derive the completed TIMEBOX fact exactly `{ type: "TIMEBOX", durationMs: 60000, completed: true }`, delegate dedicated record eligibility only to frozen J8F using current `scoreAttackBestScore` plus candidate run score, and expose immutable finalization metadata: terminal disposition, normalized existing/candidate scores, projected dedicated best, record status and dedicated-record-advance eligibility.

J8M must keep global `highScore`, generic run persistence/archive and generic Infinite progression separate. It owns no storage/GameStats writes, `saveGameStats`, `applyFinalRunCommit`, React/ResultScreen/HUD transition, timer/clock/cursor, session progression, score formula/economy, spawn/arena/entity/projectile/cap/budget/FOTON/formation authority.
''',
    'roadmap J8L closure/J8M activation',
)
if roadmap[roadmap.index(j9_marker):] != j9_tail:
    raise SystemExit('roadmap J9+ preservation failed')
ROADMAP.write_text(roadmap)

# LEDGER: add J8L milestone and replace next-target block.
ledger = LEDGER.read_text()
ledger = replace_once(
    ledger,
    '| ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract | DEPLOYED / FROZEN | `ac943f609e427618465104f51b8f023620c8bf98` | #453 | #454 |',
    '| ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract | DEPLOYED / FROZEN | `ac943f609e427618465104f51b8f023620c8bf98` | #453 | #454 |\n| ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract | DEPLOYED / FROZEN | `d41f00a1a87140dba1ddc2d04b207261df862307` | #457 | #458 |',
    'ledger J8L milestone row',
)
ledger = sub_once(
    ledger,
    r'\n## Next planned gameplay\n\n### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract\n.*?(?=\n\nJ4D\+ additional tactical families remain deferred)',
    '''
### J8L — Pure Score Attack Runtime Activation Envelope Contract
- Pure outer `SCORE_ATTACK` activation envelope over exact J8H + J8K object identity.
- Nested runtime remains `INFINITE`; effective descriptor remains TIMEBOX / 60000 with J8K isolation facts.
- Initial test-only mismatch was corrected without product-scope widening; isolated J8L diagnostic passed all six tests.
- Final pre-PR `1c9f9e65b8307d1f73dfc6215c6f77b387cfbf0b`: run `38963464711`, certify `117184022310` + Android `117184023007` GREEN.
- PR #458 head `a06c71e7ca72991051e7bcc7752f0f50089e41d4`: CI `38963705565` / `117184830694` + Android `38963705688` / `117184831351` GREEN.
- Canonical `d41f00a1a87140dba1ddc2d04b207261df862307`, parent `9d110a10e07da45f51c932d575f0ae3edb9606d4`, tree `20e5f9a1a48a03108d1c5ea140009d56e0b8da29`, exact diff three certified files.
- Main CI `38963938606` / `117185611390`, Android `38963938646` / `117185612137`, Pages `38964054007` build `117186003430` + deploy `117186140619` GREEN.

## Next planned gameplay

### ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract
Status: **NEXT CONTRACT TARGET AFTER DOC50 CLOSURE**.

J8M must compose J8L + J8J + J8F into one immutable pure finalization plan: fail closed until canonical TIMEBOX completion, then expose END_SCORE_ATTACK_ATTEMPT plus dedicated-record projection/eligibility from existing `scoreAttackBestScore` and candidate score. No storage/GameStats/global-highScore/generic-run-persistence/archive/UI/timer/session/gameplay mutation authority.''',
    'ledger J8L evidence/J8M next',
)
LEDGER.write_text(ledger)

# CONTINUITY: advance certified gameplay canonical and next phase.
continuity = CONTINUITY.read_text()
continuity = sub_once(
    continuity,
    r'## Current certified gameplay canonical\n\n`ac943f609e427618465104f51b8f023620c8bf98`\n\nPhase: \*\*ES-13J8K — Pure Score Attack Effective Runtime Projection Bundle / Overlay-Isolation Contract\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #453 — CLOSED / completed\nDelivery: PR #454 — squash merged\n\nSingle parent: `cea92b2304797ac2af597a3416a2b23b17563154` — DOC48 documentation canonical\.\n\nCanonical tree: `648c34b28bb03695aa0288998b8d992638cb489a`\.',
    '''## Current certified gameplay canonical

`d41f00a1a87140dba1ddc2d04b207261df862307`

Phase: **ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract**
Status: **DEPLOYED / FROZEN**
Issue: #457 — CLOSED / completed
Delivery: PR #458 — squash merged

Single parent: `9d110a10e07da45f51c932d575f0ae3edb9606d4` — DOC49 documentation canonical.

Canonical tree: `20e5f9a1a48a03108d1c5ea140009d56e0b8da29`.''',
    'continuity current canonical',
)
continuity = sub_once(
    continuity,
    r'\n## Next gameplay phase\n\n### ES-13J8L — Pure Score Attack Runtime Activation Envelope Contract\n.*?(?=\n## Resolved diagnostics)',
    '''
## J8L result
J8L froze the pure outer Score Attack activation envelope over exact J8H + J8K object identity. It preserves explicit outer `SCORE_ATTACK`, nested `INFINITE` runtime/session identity and effective TIMEBOX / 60000 projection facts without creating live React/cache/start/result/timer/persistence authority.

## J8L exact evidence
- DOC49 baseline `9d110a10e07da45f51c932d575f0ae3edb9606d4`;
- initial pre-PR run `38962595762` exposed only a test-side truncation of frozen J8B `canonicalFreshStart`; product scope/repo smoke were GREEN and Android succeeded;
- corrected isolated J8L diagnostic `38963366915` / `117183693510` passed all six tests;
- final pre-PR SHA `1c9f9e65b8307d1f73dfc6215c6f77b387cfbf0b`, run `38963464711`, certify `117184022310` + Android `117184023007` GREEN;
- final PR #458 head `a06c71e7ca72991051e7bcc7752f0f50089e41d4`;
- PR CI `38963705565` / `117184830694` GREEN;
- PR Android `38963705688` / `117184831351` GREEN including APK build/verify/upload;
- canonical `d41f00a1a87140dba1ddc2d04b207261df862307`, single parent `9d110a10e07da45f51c932d575f0ae3edb9606d4`, tree `20e5f9a1a48a03108d1c5ea140009d56e0b8da29`, exact diff three certified files;
- main CI `38963938606` / `117185611390` GREEN;
- main Android `38963938646` / `117185612137` GREEN including APK build/verify/upload;
- Pages `38964054007`: build `117186003430` + deploy `117186140619` GREEN.

Issue #457 CLOSED / completed. J8L is **DEPLOYED / FROZEN**.

## Next gameplay phase

### ES-13J8M — Pure Score Attack Attempt Finalization Plan Contract
Status: **NEXT CONTRACT TARGET AFTER DOC50 CLOSURE**

J8M must own only pure finalization-plan composition. It consumes a valid J8L activation envelope plus one existing runtime completion snapshot, delegates terminal resolution only to J8J/existing runtime completion policy, and returns null until canonical `END_SCORE_ATTACK_ATTEMPT`.

When terminal, J8M derives exact completed TIMEBOX / 60000 metadata and delegates dedicated record eligibility only to J8F using current `scoreAttackBestScore` plus candidate score. It exposes immutable terminal + dedicated-record projection facts while leaving global `highScore`, generic `applyFinalRunCommit`, archives and Infinite progression untouched. No storage/GameStats writes, UI transition, timer/clock/cursor, session advance/end or gameplay mutation authority is allowed.
''',
    'continuity J8L closure/J8M activation',
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
