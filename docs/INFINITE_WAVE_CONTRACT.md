# ES-07B — Deterministic Infinite Wave Recipe Contract

ES-07B converts one certified Sector 11+ recipe into a deterministic sequence
of wave recipes. It remains disconnected from the runtime game loop.

## Invariants

For every sector plan:

- wave count equals the sector recipe's `waveCount`;
- wave IDs are stable and unique;
- all wave enemy budgets sum **exactly** to the sector enemy budget;
- ordinary enemy composition is always a subset of the sector composition;
- `BOSS_DEVOURER` never enters ordinary wave composition;
- mutators are always subsets of the sector mutator set;
- fairness limits are inherited unchanged;
- milestone encounters appear only on the final wave.

## Intra-sector pressure curve

The first waves deliberately run below the sector's maximum pressure. Across the
sector, the plan ramps:

- concurrent enemies upward;
- spawn interval downward;
- elite chance upward;
- aggression upward;
- projectile density upward;
- hazard intensity upward;
- moderate stat pressure upward;
- archetype diversity upward;
- active mutator count upward.

The final wave reaches the exact certified pressure values in the sector recipe.

## Budget preservation

Wave expansion does not create extra enemies. Weighted allocation distributes the
sector budget across its waves and then reconciles integer rounding so the sum is
identical to `sectorRecipe.enemyBudget`.

## Certification

The automated ES-07B suite expands and validates complete plans for every Sector
11–1000. This remains logic/data certification only; runtime integration and
manual difficulty playtesting belong to later ES-07 phases.
