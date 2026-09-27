# ES-07E — Certified Infinite Sector Plan Builder

ES-07E provides the single pure entrypoint future runtime code should consume.

```ts
buildCertifiedInfiniteSectorPlan(sector, seed, context)
```

## Pipeline

The builder performs the complete certified chain:

1. generate canonical baseline sector recipe;
2. validate baseline recipe;
3. apply normalized/inspectable run context;
4. validate effective contextual recipe;
5. expand deterministic wave recipes;
6. validate the full wave plan;
7. build runtime-neutral execution plans;
8. validate every execution plan;
9. return one `CertifiedInfiniteSectorPlan`.

Any invalid stage throws instead of handing unsafe data to runtime.

## Inspectability

The returned object preserves:

- baseline recipe;
- effective contextual recipe;
- every wave recipe;
- every execution plan;
- context fingerprint;
- pressure delta;
- stable plan ID;
- seed and sector.

This means a future bug report can identify exactly which generated plan was played.

## Neutral context

The builder exposes `NEUTRAL_INFINITE_RUN_CONTEXT` so callers can request
the baseline encounter pressure while still using the same complete pipeline.

## Certification

Tests build the entire pipeline for every Sector 11–1000 under three
representative contexts:

- struggling;
- neutral;
- strong.

ES-07E still does not connect procedural sectors to the live game.
