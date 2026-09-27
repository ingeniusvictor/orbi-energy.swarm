# ORBI Energy Swarm — Development Roadmap

The goal is to finish and elevate the existing playable demo without destroying the gameplay qualities already present in the prototype.

The governing documents are:

- `docs/PRODUCT_VISION.md`
- `docs/PREMIUM_WEB_ANDROID_SPEC.md`
- `docs/INFINITE_PROGRESSION_SPEC.md`

## ES-00 — Original Demo Preservation — COMPLETE

- Import original ZIP without gameplay edits.
- Secret scan.
- Immutable baseline tag.

## ES-01 — Repository & Build Certification

- Make dependency install deterministic.
- Typecheck and production build GREEN in CI.
- Resolve package metadata/script inconsistencies.
- Establish first smoke tests.
- Confirm preserved baseline can be reconstructed.

## ES-02 — Gameplay Behavior Certification

- Map the master game loop, state ownership and render boundaries.
- Freeze/document player-visible behavior of the current demo.
- Add regression coverage around storage, formations, waves, upgrades and boss completion.
- Identify safe extraction seams from `EnergySwarmGame.tsx`.

## ES-03 — Premium Presentation Foundation

- Establish product shell architecture distinct from world/HUD.
- Introduce premium start/menu/loading/transition language.
- Define visual tokens, typography hierarchy and motion rules.
- Preserve combat clarity over decorative effects.

## ES-04 — Responsive Game View Architecture

- Introduce stable logical viewport and CSS/internal canvas separation.
- Safe-area-aware layout system.
- Breakpoint/aspect-ratio-specific HUD composition.
- Certify desktop 16:9, laptop 16:10, ultrawide, tablet and phone classes.

## ES-05 — Android Interaction & Touch UX

- Touch-first controls and comfortable hit targets.
- Landscape-first premium gameplay unless testing proves otherwise.
- Android gesture/navigation safe areas.
- App focus/pause/resume/orientation handling.
- Performance tiers for mobile hardware.

## ES-06 — Campaign 1–10 Stabilization

- Preserve ten-sector learning/progression arc.
- Improve onboarding, telegraphs and objective clarity.
- Validate Blackout Devourer as the campaign climax/mastery check.
- Balance without erasing original gameplay feel.

## ES-07 — Infinite Progression Engine

- Sector 11 -> unbounded progression.
- Seedable sector recipe generation.
- Procedural difficulty director.
- Multi-dimensional difficulty instead of pure HP scaling.
- Automated large-range recipe validation.

## ES-08 — Enemy, Mutator & Boss Evolution

- Evolved enemy variants.
- Meaningful mutator pool.
- Milestone encounters and boss rematches/variants.
- Fairness and performance constraints.

## ES-09 — Long-Term Progression & Replayability

- Highest sector / score / run record tracking.
- Build and formation run history where valuable.
- Refined permanent progression and relic economy.
- Achievements/challenges/codex as appropriate.

## ES-10 — Visual & Audio Polish

- Performance-safe VFX pass.
- Premium HUD polish.
- Audio mix and boss telegraph clarity.
- Accessibility and readability pass.

## ES-11 — Android Performance Certification

- Low/mid/high mobile quality tiers.
- 60/90/120 Hz behavior review.
- Thermal and sustained-session testing.
- Device/orientation regression matrix.

## ES-12 — Release Engineering

- Versioning and changelog.
- Web deployment target.
- PWA/installability or native-wrapper decision.
- Android packaging/release pipeline.
- Release candidate certification.
