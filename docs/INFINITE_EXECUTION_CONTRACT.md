# ES-07C — Infinite Wave Execution Contract

This phase defines the seam between procedural generation and future runtime
integration. It still does **not** connect Sector 11+ to the live game loop.

## Pipeline

```
InfiniteSectorRecipe
  -> InfiniteWaveRecipe[]
  -> InfiniteWaveExecutionPlan
  -> future runtime adapter
```

The execution plan is deliberately runtime-neutral. It contains the concrete
values a simulation will eventually consume without importing React, Canvas or
the current monolithic game component.

## Traceability

Every plan carries:

- sector and wave identity;
- stable execution ID;
- source sector recipe ID;
- source wave ID;
- original seed.

This makes generated encounters inspectable and reproducible.

## Completion policy

Infinite waves use a declarative `BUDGET_AND_CLEAR` policy in the contract.
ES-07C does not implement that policy in the live runtime.

## Mapped data

The execution plan carries:

- biome;
- spawn budget / cadence / concurrency / composition / elite chance;
- aggression, projectile, hazard and stat pressure;
- active mutators;
- resource/reward metadata;
- milestone metadata;
- fairness envelope.

## Preservation boundary

ES-07C does not modify:

- `EnergySwarmGame.tsx`;
- handcrafted `WAVES[0..9]`;
- `getWaveConfig`;
- persistence;
- boss AI.

Runtime integration must occur in a later explicitly certified phase.
