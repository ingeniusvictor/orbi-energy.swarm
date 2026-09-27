# ORBI Energy Swarm — Infinite Progression Specification

## Product intent

The ten handcrafted sectors are the opening campaign and learning arc. They must not remain the hard content ceiling.

After the Sector 10 climax, ORBI Energy Swarm should transition into **Infinite Swarm**, an endless challenge where difficulty, composition and decision pressure continue to evolve for highly skilled players.

## High-level structure

### Sectors 1–10 — Campaign Core

Hand-authored progression used to introduce and teach the existing systems. Preserve recognizable pacing while improving clarity and polish.

### Sectors 11–25 — System Mastery

Increase composition complexity, simultaneous threats and upgrade pressure. Introduce the first meaningful mutator combinations.

### Sectors 26–50 — Advanced Combination

More demanding wave compositions, faster decision cycles, environmental pressure and evolved enemy variants.

### Sectors 51–100 — High Pressure

Layer multiple systems together. Boss/rematch variants, stronger mutators, tighter resource decisions and reduced room for mechanical mistakes.

### Sector 101+ — Endless Endgame

No fixed upper limit. Difficulty is driven by a seeded procedural director with bounded rules that preserve fairness and telegraph clarity.

## Difficulty model

Difficulty should be multi-dimensional.

Inputs may include:

- enemy count;
- enemy archetype mix;
- simultaneous archetype diversity;
- spawn cadence;
- movement/aggression speed;
- projectile density;
- attack pattern complexity;
- environmental hazards;
- mutators;
- resource scarcity;
- formation pressure;
- boss phase combinations;
- moderate stat scaling.

Pure HP/damage multiplication is explicitly insufficient as an infinite progression strategy.

## Difficulty Director

Introduce a deterministic/seedable director that receives at minimum:

- sector index;
- player progression tier;
- current run strength/build;
- recent wave performance signals;
- available enemy/biome/mutator pools;
- fairness constraints.

The director outputs a sector recipe rather than directly mutating runtime state.

A recipe should be inspectable and testable, for example:

- biome;
- wave count;
- enemy budget;
- archetype weights;
- modifiers;
- elite/evolved variants;
- boss/miniboss event;
- reward tier;
- seed.

## Fairness constraints

Infinite does not mean arbitrary. The director must respect rules such as:

- minimum telegraph windows;
- maximum simultaneous unavoidable damage sources;
- caps on specific crowd-control combinations;
- spawn safety around player/swarm location;
- performance budgets for entity/projectile counts;
- recovery opportunities after extreme encounters.

## Mutator examples

Potential future mutators include:

- electrical storm;
- reduced visibility;
- magnetic drift;
- accelerated enemies;
- regenerative enemies;
- fragile swarm;
- unstable resource fields;
- formation disruption pressure;
- elite-only bursts;
- double-threat sectors.

Mutators must change decisions or execution, not merely recolor the scene.

## Boss evolution

Blackout Devourer should remain an important canonical boss but can later participate in an evolved encounter system:

- rematch variants;
- altered phase ordering;
- additional attack combinations;
- biome-modified variants;
- elite modifiers;
- endless milestone encounters.

Future bosses can be added after the director and regression infrastructure are stable.

## Long-term motivation

Track at minimum:

- highest sector reached;
- best score;
- run duration;
- selected formation/build;
- upgrades/relic decisions;
- defeat cause where useful;
- seed/recipe identity for notable runs.

Future progression may include unlocks, achievements, codex records and challenge presets, but should not compromise the purity of the core run loop.

## Engineering constraints

Do not bolt infinite mode directly into the current monolithic component. First extract or formalize:

- wave definitions;
- difficulty/scaling rules;
- sector recipe data;
- deterministic random source where needed;
- run/session persistence boundaries.

Infinite mode should be testable largely as data/logic without requiring a rendered canvas.

## Certification target

The feature is considered viable when automated tests can generate and validate large sector ranges (for example 11–1000) without illegal recipes, runaway entity budgets or invalid progression state, while manual playtests confirm that difficulty becomes richer rather than merely slower.
