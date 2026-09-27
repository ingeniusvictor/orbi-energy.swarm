# ORBI Energy Swarm — Agent Development Contract

This repository contains a preserved playable prototype. The original imported demo is permanently tagged:

`v0.1.0-prototype-recovery-baseline-original`

## Correctness-first rules

1. Never rewrite or force-move the original baseline tag.
2. Work from `main` using focused `feature/es-XX-*` branches.
3. Before changing gameplay or presentation, read `docs/PRODUCT_VISION.md`, `docs/PREMIUM_WEB_ANDROID_SPEC.md`, `docs/INFINITE_PROGRESSION_SPEC.md`, `docs/BASELINE_FEATURES.md`, `docs/REPOSITORY_AUDIT.md`, and `docs/ROADMAP.md`.
4. Preserve the feel of the original demo unless a task explicitly changes a mechanic.
5. Do not commit `.env` files, API keys, generated `dist/`, logs, or `node_modules/`.
6. Required gates before merge: `npm run typecheck` and `npm run build`.
7. Add targeted automated tests as systems are extracted from the current monolithic game module.
8. Keep Spanish and English i18n keys synchronized.
9. Prefer small, reversible commits and document gameplay-affecting changes.
10. Do not introduce cloud AI dependencies unless the feature actually requires them and the secret remains server-side.
11. Treat Web and Android as first-class product surfaces; responsive work must preserve composition, readability, touch ergonomics and safe areas rather than merely scaling the existing canvas.
12. The first ten sectors are the handcrafted campaign foundation. Sector 11+ is intended to become an infinite, system-driven challenge; do not hard-code future progression as simple repeated HP/damage multipliers.
