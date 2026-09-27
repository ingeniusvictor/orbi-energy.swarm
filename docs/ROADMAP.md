# ORBI Energy Swarm — Development Roadmap

The goal is to finish and polish the existing playable demo without destroying the gameplay qualities already present in the prototype.

## ES-00 — Original Demo Preservation — COMPLETE

- Import original ZIP without gameplay edits.
- Secret scan.
- Immutable baseline tag.

## ES-01 — Repository Certification

- Make dependency install deterministic.
- Typecheck and production build GREEN in CI.
- Resolve package metadata/script inconsistencies.
- Establish first smoke tests.

## ES-02 — Runtime & Architecture Audit

- Map the master game loop, state ownership and render boundaries.
- Identify safe extraction seams from `EnergySwarmGame.tsx`.
- Add regression tests around storage, formations, wave definitions and upgrades.

## ES-03 — Playable Demo Regression Pass

- Verify desktop controls.
- Verify touch/mobile controls.
- Verify pause/resume/restart.
- Verify recruitment, formations, combat, resources and persistence.
- Verify ten-sector progression and boss completion.

## ES-04 — Gameplay Feel & Onboarding

- First-run tutorial.
- Difficulty ramp review.
- Clearer goals, feedback and damage readability.
- Preserve original responsiveness and swarm fantasy.

## ES-05 — Progression & Replayability

- Consolidate permanent progression.
- Balance relic economy and mid-run upgrade choices.
- Review run duration, boss pacing and replay incentives.

## ES-06 — Visual / Audio Polish

- Performance-safe VFX pass.
- UI hierarchy and accessibility pass.
- Mobile readability.
- Audio mix and boss telegraph clarity.

## ES-07 — Content Completion

- Decide which documented deferred systems belong in v1.0.
- Add content only after core loop regression gates are stable.

## ES-08 — Release Engineering

- Versioning and changelog.
- Web deployment target.
- PWA/installability evaluation.
- Release candidate certification.
