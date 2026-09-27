# ES-07A — Seeded Infinite Sector Recipe Core

This phase introduces a **pure, disconnected** recipe generator for Sector 11+.

It does not modify the current ten-sector campaign, runtime wave loop, storage schema or boss AI.

## Determinism

`generateInfiniteSectorRecipe(sector, seed)` is deterministic:

- same sector + same seed -> same recipe;
- a recipe has a stable `recipeId`;
- changing the seed changes the recipe identity.

This makes notable runs reproducible and gives later difficulty work an inspectable data contract.

## Progression bands

- 11–25: `MASTERY`
- 26–50: `ADVANCED_COMBINATION`
- 51–100: `HIGH_PRESSURE`
- 101+: `ENDLESS_ENDGAME`

## Recipe pressure dimensions

The generator varies several dimensions instead of relying on HP alone:

- enemy budget;
- simultaneous enemies;
- spawn cadence;
- archetype diversity;
- elite chance;
- mutator combinations;
- aggression;
- projectile density;
- environmental hazard intensity;
- moderate stat multiplier;
- resources/reward tier;
- milestone encounters.

## Milestones and recovery

- every fifth sector may carry a miniboss milestone;
- every 25th sector is reserved for a boss-rematch milestone;
- the sector immediately following a 25-sector milestone is marked as a recovery sector with reduced pressure.

## Hard safety bounds

The ES-07A certification suite generates every Sector 11–1000 and rejects recipes outside the initial safety envelope:

- enemy budget: 28–180;
- simultaneous enemies: 14–36;
- spawn interval: 42–105 frames;
- enemy archetypes: 2–6 unique non-boss types;
- elite chance: 8–55%;
- mutators: 1–4;
- aggression: 1.0–2.0×;
- projectile density: 1.0–2.2×;
- hazard intensity: 0.1–1.0;
- stat multiplier: 1.0–2.5×;
- projectile budget: 80–240;
- minimum telegraph window: 900 ms;
- maximum simultaneous hard-control sources: 2;
- spawn safety radius: 120 logical units.

These are **recipe constraints**, not yet runtime tuning. Manual playtesting is still required before gameplay integration.
