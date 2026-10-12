# Traceability Policy

ORBI Energy Swarm must remain recoverable without relying on conversation history.

## Required closure updates

Every phase that reaches merge/deployment must update, in the same PR or an immediately following documentation PR:

- `PROJECT_CONTINUITY.md` — current canonical, active work, blockers, next action;
- `IMPLEMENTATION_LEDGER.md` — exact completed phase evidence;
- `ES13_GAMEPLAY_ROADMAP.md` — status transition and roadmap changes when applicable.

## Required evidence fields

For completed/deployed phases, record when available:
- issue number;
- branch name;
- PR number;
- final PR head SHA;
- canonical squash-merge SHA;
- pre-PR certification run IDs;
- PR CI and Android run IDs;
- post-merge main CI and Android run IDs;
- Pages/Web deployment run ID;
- unresolved manual/hardware blockers.

## Prohibited shortcuts

Do not:
- mark work complete solely from chat statements;
- mark a PR merge as deployed without exact-SHA post-merge evidence;
- turn a diagnostic hypothesis into a historical fact;
- erase failed attempts that materially explain later architectural decisions;
- replace human/device certification with automated CI.

## Continuity discipline

When a new chat or developer resumes the project:
1. verify `main` first;
2. read `PROJECT_CONTINUITY.md`;
3. read `IMPLEMENTATION_LEDGER.md`;
4. read the active roadmap;
5. inspect active GitHub issues/PRs/branches;
6. only then resume implementation.

Repository evidence wins over stale documentation; when drift is found, correct the continuity records as scoped work.