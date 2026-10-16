from pathlib import Path
import re

CANON = "9440b31b0c8dca2da0cfe92a5f02cbf7065e6d67"
PARENT = "84d259c2a0f5f0284db5f67742a052e6c3003f62"
TREE = "e7d54e341de9d4995f13c62f6a7a2f41922798e9"
BRANCH = "docs/es-13-j7d-j7-closure-j8-discovery"


def replace_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"DOC38 fail-closed: expected exactly one {label} anchor, got {count}")
    return updated

# --- PROJECT_CONTINUITY.md ---
p = Path("docs/PROJECT_CONTINUITY.md")
s = p.read_text()
s = s.replace("Last continuity update: 2026-10-15", "Last continuity update: 2026-10-16", 1)
s = replace_once(
    s,
    r"## Current certified gameplay canonical\n\n`[^`]+`\n\nPhase: \*\*[^\n]+\*\*\nStatus: \*\*DEPLOYED / FROZEN\*\*\nIssue: #[0-9]+ — CLOSED / completed\nDelivery: PR #[0-9]+ — squash merged\n\nSingle parent: `[^`]+` — DOC[0-9]+ documentation canonical\.\n\nCanonical tree: `[^`]+`\.",
    f"""## Current certified gameplay canonical

`{CANON}`

Phase: **ES-13J7D — Controlled Live Timed Survival Adoption**
Status: **DEPLOYED / FROZEN**
Issue: #408 — CLOSED / completed
Delivery: PR #409 — squash merged

Single parent: `{PARENT}` — DOC37 documentation canonical.

Canonical tree: `{TREE}`.""",
    "continuity current canonical",
)
s = replace_once(
    s,
    r"- DOC37 — J7C closure & J7D controlled live Timed Survival adoption activation: Issue #406, branch `docs/es-13-j7c-closure-j7d-activation`, documentation-only closure in progress from gameplay canonical `1ad86de5155a3e6e73630e5244f7ce7ec107f4af`\.",
    f"- DOC37 — J7C closure & J7D controlled live Timed Survival adoption activation: `84d259c2a0f5f0284db5f67742a052e6c3003f62` — Issue #406 / PR #407.\n- DOC38 — J7D/J7 closure & J8 architecture discovery activation: Issue #410, branch `{BRANCH}`, documentation-only closure in progress from gameplay canonical `{CANON}`.",
    "continuity DOC37/DOC38 ledger",
)
next_anchor = "## Next gameplay phase"
j7d_result = f"""## J7D result
J7D completed the first live Timed Survival Bonus Challenge vertical slice without creating a second timer, clock or progression authority.

Certified live behavior:
- consumes frozen J7A profile, J7B Infinite opportunity/slot authority and J7C exact `30000 ms` TIMEBOX projection;
- applies through exactly one immutable current-wave descriptor overlay in `runtimeProjectionBundleCache.ts` after adaptive + J6 overlays and before downstream combat-pressure/mutator/budget/milestone projection;
- Campaign remains unchanged;
- nonselected/noncadence/recovery/milestone/first/final waves remain unchanged;
- selected descriptor must still be `BUDGET_AND_CLEAR`; otherwise J7D fails closed instead of overwriting another completion authority;
- only `completionPolicy` plus bounded deterministic Timed Survival wave-announcement attribution are overlaid;
- spawn, pressure, modifiers, rewards, milestone, fairness, biome and source facts remain unchanged;
- existing `waveTimeRemainingRef`, `shouldTickRuntimeTimer(...)`, pause/upgrade suspension and `isRuntimeWaveComplete(...)` remain the sole timer/pause/completion execution authorities;
- no `EnergySwarmGame.tsx` change, no inserted wave, recipe/session mutation, second progression director, clock/RNG/hash, collections/scans/indexes, spawn/combat/economy, cap/budget, entity/projectile, FOTON or formation authority.

Final product scope exactly:
- `src/game/bonusChallengeRuntimeAdoption.ts`;
- `src/game/runtimeProjectionBundleCache.ts`;
- `tests/es-13j7d-bonus-challenge-runtime-adoption.test.mjs`;
- `tests/gameplay/bonus-challenge-runtime-adoption.test.ts`.

## J7D exact evidence
- DOC37 baseline `{PARENT}`;
- initial diagnostic run `38863999290`: Repository Smoke failed only because one new static assertion expected `cursor.remainingTimeMs` instead of the frozen existing `snapshot.remainingTimeMs`; Android `116852516295` was GREEN and runtime/product authority was not changed to satisfy the test;
- assertion-only repair `35707b94e33658143d535b3c3aef84010f97ba94`;
- final pre-PR SHA `6edcd8350beb2206755bf98518e301849cd99cea`, run `38900414518`, certify `116970988704` + Android `116970988120` GREEN;
- final PR #409 head `8e4b0c17cf4db232f11e4cd3c34bbcde83358aff`;
- PR CI `38900636271` / `116971729124` GREEN;
- PR Android `38900635979` / `116971728007` GREEN including Build/Verify/Upload APK;
- canonical `{CANON}`, single parent `{PARENT}`, tree `{TREE}`;
- canonical diff exactly four certified product/test files;
- main CI `38900847691` / `116972435417` GREEN;
- main Android `38900847145` / `116972433572` GREEN including Build/Verify/Upload APK;
- Pages `38900976181`: build `116972852085` + deploy `116973051764` GREEN.

Issue #408 CLOSED / completed. J7D is **DEPLOYED / FROZEN**.

## J7 program closure
J7A → J7D completes one fully certified end-to-end Bonus Challenge vertical slice: `TIMED_SURVIVAL` profile → deterministic opportunity → exact TIMEBOX projection → controlled live adoption. Precision, rescue, collection, evasive corridors, pursuit, affinity puzzles, obstacle navigation and survival-without-firing remain future Bonus Challenge vocabulary; they are not cancelled and are not implicitly implemented.

"""
if "## J7D result" not in s:
    if next_anchor not in s:
        raise SystemExit("DOC38 fail-closed: continuity next gameplay anchor missing")
    s = s.replace(next_anchor, j7d_result + next_anchor, 1)
s = replace_once(
    s,
    r"## Next gameplay phase\n\n### ES-13J7D — Controlled Live Timed Survival Adoption\nStatus: \*\*NEXT DISCOVERY / LIVE ADOPTION TARGET AFTER DOC37 CLOSURE\*\*\n\nJ7A profile, J7B opportunity/cadence and J7C `30000 ms` TIMEBOX projection are frozen\..*?DOC37 freezes no exact live file/seam\. The dedicated J7D Issue must complete architecture discovery before implementation\.",
    """## Next gameplay phase

### ES-13J8 — Additional Game Modes Architecture Discovery
Status: **NEXT ARCHITECTURE / DISCOVERY TARGET AFTER DOC38 CLOSURE**

J7's first end-to-end Bonus Challenge vertical slice is frozen. J8 now begins as architecture/discovery only; DOC38 selects no concrete game mode.

Candidate vocabulary remains Score Attack, Boss Rush, Survival/Last Light, Swarm Trials, Anomaly Runs, Daily Seed, Elite Hunt, Endless Crisis and Perfect Sector. Discovery must inspect current runtime/session/progression/persistence/start-screen/result-screen architecture and select the smallest mode that can reuse the certified engine/core without a mode-specific fork. It must explicitly prove lifecycle/reset/end semantics, Campaign/Infinite coexistence, persistence/high-score implications, descriptor/progression reuse, UI impact, seed/replay semantics if applicable and Android parity. No scoring rule, duration, rewards/economy, seed policy, persistence schema, runtime state, UI or live behavior is frozen by DOC38.""",
    "continuity next J8 section",
)
s = replace_once(
    s,
    r"> Continue ORBI Energy Swarm autonomously\..*?Never touch `main` directly or weaken tests\.",
    f"> Continue ORBI Energy Swarm autonomously. Repository `ingeniusvictor/orbi-energy.swarm`. J7D gameplay canonical is `{CANON}`, fully DEPLOYED / FROZEN via Issue #408 / PR #409 with controlled live Timed Survival adoption and post-main CI/Android/Pages GREEN. Complete DOC38 if still open, then perform J8 Additional Game Modes architecture discovery before selecting or implementing any concrete mode. Reuse the certified runtime/session/progression/persistence core and avoid mode-specific forks; preserve caps/budgets, Campaign/Infinite isolation, FOTON GLB/formations, J3C-C/J4D+ deferrals and manual blockers. Follow Issue → Branch → full gates → PR → exact-SHA post-merge evidence. Never touch `main` directly or weaken tests.",
    "continuity handoff",
)
p.write_text(s)

# --- IMPLEMENTATION_LEDGER.md ---
p = Path("docs/IMPLEMENTATION_LEDGER.md")
s = p.read_text()
row = f"| ES-13J7D — Controlled Live Timed Survival Adoption | DEPLOYED / FROZEN | `{CANON}` | #408 | #409 |"
if row not in s:
    anchor = "| ES-13J7C — Pure Timed Survival Duration & TIMEBOX Projection Contract | DEPLOYED / FROZEN | `1ad86de5155a3e6e73630e5244f7ce7ec107f4af` | #404 | #405 |"
    if anchor not in s:
        raise SystemExit("DOC38 fail-closed: J7C ledger row missing")
    s = s.replace(anchor, anchor + "\n" + row, 1)
s = replace_once(
    s,
    r"- DOC37 — J7C closure & J7D controlled live Timed Survival adoption activation: Issue #406, branch `docs/es-13-j7c-closure-j7d-activation`, in progress from gameplay canonical `1ad86de5155a3e6e73630e5244f7ce7ec107f4af`\.",
    f"- DOC37 — J7C closure & J7D controlled live Timed Survival adoption activation: `{PARENT}` — Issue #406 / PR #407.\n- DOC38 — J7D/J7 closure & J8 architecture discovery activation: Issue #410, branch `{BRANCH}`, in progress from gameplay canonical `{CANON}`.",
    "ledger DOC37/DOC38",
)
blocker_anchor = "## Frozen manual/physical blockers"
j7d_ledger = f"""### J7D — Controlled Live Timed Survival Adoption
- Single descriptor overlay in `runtimeProjectionBundleCache.ts` after adaptive + J6 and before downstream pressure/mutator/budget/milestone projections; no `EnergySwarmGame.tsx` change.
- Reuses J7A/J7B/J7C; selected current Infinite descriptor must still be `BUDGET_AND_CLEAR`, then only completion policy becomes `TIMEBOX 30000` plus bounded wave-announcement attribution.
- Existing timer/pause/completion lifecycle remains authoritative; Campaign and unrelated descriptor fields remain unchanged.
- Diagnostic run `38863999290` failed only a new static assertion (`cursor.remainingTimeMs` vs frozen `snapshot.remainingTimeMs`); Android `116852516295` was GREEN. Assertion-only repair `35707b94e33658143d535b3c3aef84010f97ba94`; no runtime authority changed to satisfy the test.
- Final pre-PR `6edcd8350beb2206755bf98518e301849cd99cea`, run `38900414518`, certify `116970988704` + Android `116970988120` GREEN.
- Final PR #409 head `8e4b0c17cf4db232f11e4cd3c34bbcde83358aff`; PR CI `38900636271` / `116971729124` GREEN; PR Android `38900635979` / `116971728007` GREEN.
- Canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`, exact diff four product/test files.
- Main CI `38900847691` / `116972435417` GREEN; Android `38900847145` / `116972433572` GREEN; Pages `38900976181`, build `116972852085` + deploy `116973051764` GREEN.
- No second timer/clock/ref/progression director, inserted wave, recipe/session mutation, RNG/hash, collection/scan/index, spawn/combat/economy, cap/budget, entity/projectile, FOTON or formation authority.

### J7 program closure
J7A→J7D certifies the first complete `TIMED_SURVIVAL` Bonus Challenge vertical slice. Other listed Bonus Challenge concepts remain future vocabulary and are neither cancelled nor implemented by implication.

"""
if "### J7D — Controlled Live Timed Survival Adoption" not in s:
    if blocker_anchor not in s:
        raise SystemExit("DOC38 fail-closed: ledger blocker anchor missing")
    s = s.replace(blocker_anchor, j7d_ledger + blocker_anchor, 1)
s = replace_once(
    s,
    r"## Next planned gameplay\n\n### ES-13J7D — Controlled Live Timed Survival Adoption\nStatus: \*\*NEXT DISCOVERY / LIVE ADOPTION TARGET AFTER DOC37 CLOSURE\*\*\.\n\nJ7D must complete architecture discovery before any runtime write\..*?Exact live file/seam is not frozen by DOC37 and requires the dedicated J7D Issue\.",
    """## Next planned gameplay

### ES-13J8 — Additional Game Modes Architecture Discovery
Status: **NEXT ARCHITECTURE / DISCOVERY TARGET AFTER DOC38 CLOSURE**.

Candidate vocabulary remains Score Attack, Boss Rush, Survival/Last Light, Swarm Trials, Anomaly Runs, Daily Seed, Elite Hunt, Endless Crisis and Perfect Sector. Discovery must select the smallest mode that can reuse the certified runtime/session/progression/persistence engine without a mode-specific fork, proving lifecycle/reset/end semantics, Campaign/Infinite coexistence, persistence/high-score implications, descriptor/progression reuse, UI impact, seed/replay semantics if applicable and Android parity. DOC38 freezes no concrete mode, scoring rule, duration, rewards/economy, seed policy, persistence schema, runtime state, UI or live behavior.""",
    "ledger next J8",
)
p.write_text(s)

# --- ES13_GAMEPLAY_ROADMAP.md ---
p = Path("docs/ES13_GAMEPLAY_ROADMAP.md")
s = p.read_text()
s = replace_once(
    s,
    r"## J7 — Bonus Challenge Rounds\nStatus: \*\*ACTIVE PROGRAM\*\*",
    "## J7 — Bonus Challenge Rounds\nStatus: **DEPLOYED / FROZEN — FIRST CERTIFIED VERTICAL SLICE**",
    "roadmap J7 status",
)
s = replace_once(
    s,
    r"### J7D — Controlled Live Timed Survival Adoption\nStatus: \*\*NEXT DISCOVERY / LIVE ADOPTION TARGET AFTER DOC37 CLOSURE\*\*\n\nJ7D is the first J7 slice allowed to investigate live Timed Survival execution:.*?DOC37 does not freeze the exact runtime file/seam; dedicated J7D architecture discovery must do so\.",
    f"""### J7D — Controlled Live Timed Survival Adoption
Status: **DEPLOYED / FROZEN**
Canonical: `{CANON}`  
Issue #408 / PR #409

Certified J7D live policy:
- Infinite-only current-wave adoption; Campaign unchanged;
- consumes frozen J7A/J7B/J7C instead of copying profile/cadence/duration logic;
- one immutable descriptor overlay after adaptive + J6 and before downstream pressure/mutator/budget/milestone projections;
- selected descriptor must still be `BUDGET_AND_CLEAR`, otherwise fail closed;
- overlays only `TIMEBOX 30000` completion plus bounded Timed Survival wave-announcement attribution;
- spawn, pressure, modifiers, rewards, milestone, fairness, biome and source remain unchanged;
- existing runtime timer/pause/completion lifecycle remains authoritative;
- no `EnergySwarmGame.tsx` change, inserted wave, recipe/session mutation, second clock/timer/ref/director, RNG/hash, collections/scans/indexes, spawn/combat/economy, cap/budget, entity/projectile, FOTON or formation authority.

Exact deployment anchors:
- initial diagnostic run `38863999290` exposed only a static test assertion mismatch (`cursor.remainingTimeMs` vs frozen `snapshot.remainingTimeMs`); Android `116852516295` GREEN;
- assertion-only repair `35707b94e33658143d535b3c3aef84010f97ba94`;
- final pre-PR `6edcd8350beb2206755bf98518e301849cd99cea`, run `38900414518`, certify `116970988704` + Android `116970988120` GREEN;
- final PR #409 head `8e4b0c17cf4db232f11e4cd3c34bbcde83358aff`;
- PR CI `38900636271` / `116971729124` GREEN; Android `38900635979` / `116971728007` GREEN;
- canonical `{CANON}`, parent `{PARENT}`, tree `{TREE}`;
- main CI `38900847691` / `116972435417` GREEN; Android `38900847145` / `116972433572` GREEN;
- Pages `38900976181`, build `116972852085` + deploy `116973051764` GREEN.

J7A→J7D completes the first fully certified end-to-end Bonus Challenge vertical slice: `TIMED_SURVIVAL`. Precision, rescue, collection, evasive corridors, pursuit, affinity puzzles, obstacle navigation and survival without firing remain future vocabulary, not cancelled and not implicitly implemented.""",
    "roadmap J7D section",
)
s = replace_once(
    s,
    r"## J8 — Additional Game Modes\nStatus: PLANNED\n\nScore Attack, Boss Rush, Survival/Last Light, Swarm Trials, Anomaly Runs, Daily Seed, Elite Hunt, Endless Crisis and Perfect Sector\. Reuse one certified engine/core; avoid mode-specific forks\.",
    """## J8 — Additional Game Modes
Status: **NEXT ARCHITECTURE / DISCOVERY TARGET AFTER DOC38 CLOSURE**

Candidate vocabulary: Score Attack, Boss Rush, Survival/Last Light, Swarm Trials, Anomaly Runs, Daily Seed, Elite Hunt, Endless Crisis and Perfect Sector. Reuse one certified engine/core; avoid mode-specific forks.

DOC38 activates discovery only. No first J8 mode is frozen. Architecture discovery must inspect runtime/session/progression/persistence/start-screen/result-screen seams and prove the smallest reusable mode boundary, lifecycle/reset/end semantics, Campaign/Infinite coexistence, persistence/high-score impact, descriptor/progression reuse, UI implications, seed/replay behavior if applicable and Android parity before any implementation slice is named.""",
    "roadmap J8 activation",
)
p.write_text(s)

print("DOC38 documentation patch applied successfully")
