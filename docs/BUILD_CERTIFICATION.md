# ES-01 — Repository & Build Certification

## Canonical baseline

- Canonical branch: `main`
- Recovery baseline commit: `4b499587ec26e65c1e44c36cdb852731431a4c21`
- Immutable annotated tag: `v0.1.0-prototype-recovery-baseline-original`
- Product/audit baseline before ES-01: `068ad0e0f1c58be785c3c4d296d6f3d6419e8f48`

The annotated recovery tag resolves to the original demo commit above.

## Clean-run certification

GitHub Actions run **#1** on Node 22 completed successfully from a clean runner and passed:

1. `npm ci`
2. `npm run typecheck`
3. `npm run build`

That run certifies that the repository lockfile can reconstruct a working dependency tree independently of any developer machine.

## ES-01 hardening

This phase adds:

- a portable `npm run clean` implementation for Windows/Linux/macOS;
- a Node 22 engine declaration aligned with CI;
- zero-dependency repository smoke tests using `node:test`;
- smoke-test execution as a required CI step;
- baseline invariants covering viewport/world dimensions, the ten handcrafted sectors, the Blackout Devourer climax, six original formations, and governing product documents.

## Dependency audit

The recovered AI Studio package metadata still contains inherited dependencies that are not referenced by the current source tree, including `@google/genai`, `express`, `dotenv`, and `motion`.

They are intentionally **not removed in ES-01**. Dependency pruning will be handled in a focused follow-up with lockfile regeneration and a clean CI run, avoiding an unrelated dependency graph rewrite inside the baseline-certification PR.

## ES-01 exit criteria

- [x] canonical history restored;
- [x] original prototype tag verified;
- [x] deterministic clean install proven by GitHub Actions;
- [x] TypeScript gate GREEN;
- [x] production build GREEN;
- [x] portable repository scripts;
- [x] smoke/regression foundation added;
- [ ] ES-01 PR CI GREEN;
- [ ] ES-01 merged to `main`.

The final two items are completed by the ES-01 pull request workflow and merge.
