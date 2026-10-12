# ORBI Energy Swarm — Chat Handoff Template

Use this when a ChatGPT thread reaches its context limit or development is resumed in a new thread.

```text
CONTINUATION — ORBI ENERGY SWARM

Repository:
ingeniousvictor/orbi-energy.swarm

Before modifying anything:
1. Read `docs/PROJECT_CONTINUITY.md`.
2. Read `docs/IMPLEMENTATION_LEDGER.md`.
3. Read `docs/ES13_GAMEPLAY_ROADMAP.md`.
4. Verify the current `main` SHA directly in GitHub.
5. Verify every active Issue/PR/branch referenced by `PROJECT_CONTINUITY.md`.
6. Treat repository and exact CI/Pages evidence as authoritative over old chat context.

Mandatory workflow:
Issue → Branch from exact canonical → implementation → gates → PR → PR CI GREEN → squash merge → main CI GREEN → Android GREEN → Pages GREEN on the exact canonical SHA.

Rules:
- correction before speed;
- work autonomously where evidence allows;
- never modify `main` directly;
- never weaken tests just to make them pass;
- never declare a phase deployed until exact-SHA post-merge CI/Pages evidence exists;
- preserve Campaign/Infinite isolation and global caps unless a scoped issue proves a change is required;
- temporary certification workflows must be removed before final PR;
- manual/hardware evidence cannot be replaced by CI;
- update roadmap, continuity and implementation ledger before administratively closing each phase.

Continue from the exact Active Work section of `docs/PROJECT_CONTINUITY.md`.
```

This template is convenience only. The live repository state remains authoritative.