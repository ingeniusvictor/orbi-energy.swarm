# ORBI Energy Swarm — Repository Audit

## Audit scope

Source: original playable ZIP imported on 2026-09-26.

Original ZIP SHA-256: `4ed6fc09a1d03f3cdcca50eea8b1f863dc49145563d3d00f56a61a09dfd1ed7e`.

Original baseline tag: `v0.1.0-prototype-recovery-baseline-original`.

## What is already present

- React 19 + TypeScript + Vite 6 application.
- HTML5 Canvas real-time game renderer and unified `requestAnimationFrame` loop.
- Keyboard, mouse, touch and virtual D-pad input.
- Six swarm formations.
- Multiple enemy classes, autonomous swarm targeting and projectile combat.
- Six biome/environment identities.
- Resource harvesting, Wild Orbi recruitment, persistent progression and relic upgrades.
- Procedural Web Audio soundtrack/effects.
- Spanish and English localization.
- Wave identity system with ten canonical sectors.
- Mid-run upgrade system.
- Blackout Devourer boss implementation, boss phases, attacks, telemetry, codex and victory persistence.
- Desktop/mobile HUD, pause, result, companion and upgrade interfaces.

## Repository hygiene findings

### Clean

- No real API key or credential was found in the source scan.
- `.env.example` contains placeholders only.
- `.gitignore` already excludes `.env*`, `node_modules`, build output, coverage and logs.
- The archive contains source code rather than generated dependency folders.

### Needs attention

1. `package.json` was still named `react-example` at import time and reported version `0.0.0`.
2. README instructs `npm run typecheck`, but the imported package only exposed `lint` for `tsc --noEmit`.
3. There are currently no automated test files.
4. There was no GitHub Actions workflow in the imported archive.
5. `src/game/EnergySwarmGame.tsx` is very large (~179 KB) and concentrates a substantial portion of runtime state/logic. It should be decomposed incrementally, not rewritten wholesale.
6. `docs/FUTURE_SYSTEMS.md` still lists boss encounters as deferred even though the Blackout Devourer is implemented. Documentation state is inconsistent.
7. `metadata.json` declares a Gemini server-side capability, while no active `@google/genai` usage was found in `src/` during static inspection.
8. Two ~119 KB master prompt/code snapshot text files remain in the root. They may be useful historical provenance, but should be classified later as archive material rather than runtime source.

## Verification status

Static structure and credential checks: PASS.

Dependency installation/build verification could not be completed in the audit sandbox because package installation stalled while fetching dependencies. This is an environment limitation, not evidence of a source failure. GitHub CI is the canonical next verification gate.

## Preservation rule

The original demo must remain reproducible from the immutable baseline tag. Any modernization begins after that point.
