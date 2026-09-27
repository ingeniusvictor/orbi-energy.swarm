# ES-07D — Inspectable Run-Context Difficulty Modulation

ES-07D preserves the deterministic sector+seed recipe from ES-07A as the
canonical baseline and applies a second, explicit transformation using normalized
run-context signals.

It remains disconnected from live gameplay.

## Context signals

All signals are normalized to `0..1`:

- swarm strength;
- shield integrity;
- build power;
- recent damage pressure;
- recent clear efficiency.

Non-finite inputs are rejected.

## Transparency

Every contextual recipe carries:

- `baselineRecipeId`;
- normalized context;
- context fingerprint;
- performance score;
- applied pressure delta.

Identical baseline recipe + identical context produces an identical contextual
recipe.

## Bound

Context may adjust encounter pressure by at most **±8%**.

It may make bounded changes to:

- enemy budget;
- max concurrent enemies;
- spawn cadence;
- elite chance;
- aggression;
- projectile density;
- hazard intensity;
- moderate stat multiplier.

It does **not** change:

- minimum telegraph window;
- spawn safety radius;
- hard-control-source cap;
- projectile safety budget;
- enemy composition;
- mutator set;
- milestone identity;
- seed.

## Design rule

This is not hidden dynamic difficulty. The baseline remains inspectable and the
modulation is explicit data with a reproducible context fingerprint.

Runtime wiring and UX disclosure belong to later phases.
