import assert from "node:assert/strict";
import test from "node:test";

import {
  createInfiniteWaveExecutionPlan,
  validateInfiniteWaveExecutionPlan,
} from "../src/game/infiniteExecutionPlan.ts";
import {
  generateInfiniteSectorRecipe,
} from "../src/game/infiniteSectorDirector.ts";
import {
  expandInfiniteSectorWaves,
} from "../src/game/infiniteWaveDirector.ts";

test("execution plan preserves source identity and deterministic traceability", () => {
  const sector = generateInfiniteSectorRecipe(137, "execution-cert");
  const wave = expandInfiniteSectorWaves(sector)[2];
  assert.ok(wave);

  const a = createInfiniteWaveExecutionPlan(sector, wave);
  const b = createInfiniteWaveExecutionPlan(sector, wave);

  assert.deepEqual(a, b);
  assert.equal(a.sourceRecipeId, sector.recipeId);
  assert.equal(a.sourceWaveId, wave.id);
  assert.equal(a.executionId, `${wave.id}:execution`);
  assert.equal(a.seed, sector.seed);
  assert.equal(a.completionPolicy, "BUDGET_AND_CLEAR");
});

test("execution plan does not alias mutable source arrays", () => {
  const sector = generateInfiniteSectorRecipe(51, "copy-safety");
  const wave = expandInfiniteSectorWaves(sector)[0];
  assert.ok(wave);

  const plan = createInfiniteWaveExecutionPlan(sector, wave);

  assert.notEqual(plan.spawn.enemyComposition, wave.enemyComposition);
  assert.notEqual(plan.mutators, wave.activeMutators);
  assert.notEqual(plan.fairness, wave.fairness);
});

test("execution plans remain traceable and valid for Sectors 11–1000", () => {
  for (let sectorNumber = 11; sectorNumber <= 1000; sectorNumber += 1) {
    const sector = generateInfiniteSectorRecipe(
      sectorNumber,
      "execution-range-cert",
    );
    const waves = expandInfiniteSectorWaves(sector);

    for (const wave of waves) {
      const plan = createInfiniteWaveExecutionPlan(sector, wave);
      const validation = validateInfiniteWaveExecutionPlan(
        sector,
        wave,
        plan,
      );

      assert.deepEqual(
        validation,
        { valid: true, errors: [] },
        `Sector ${sectorNumber} wave ${wave.waveIndex}: ${validation.errors.join(", ")}`,
      );
    }
  }
});

test("execution adapter rejects a wave from another sector", () => {
  const sectorA = generateInfiniteSectorRecipe(25, "sector-a");
  const sectorB = generateInfiniteSectorRecipe(26, "sector-b");
  const foreignWave = expandInfiniteSectorWaves(sectorB)[0];
  assert.ok(foreignWave);

  assert.throws(
    () => createInfiniteWaveExecutionPlan(sectorA, foreignWave),
    RangeError,
  );
});

test("validator catches broken traceability and spawn mapping", () => {
  const sector = generateInfiniteSectorRecipe(75, "broken-plan");
  const wave = expandInfiniteSectorWaves(sector)[0];
  assert.ok(wave);

  const plan = createInfiniteWaveExecutionPlan(sector, wave);
  const invalid = {
    ...plan,
    sourceRecipeId: "wrong-recipe",
    spawn: {
      ...plan.spawn,
      enemyBudget: plan.spawn.enemyBudget + 1,
    },
  };

  const validation = validateInfiniteWaveExecutionPlan(
    sector,
    wave,
    invalid,
  );

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes("traceability"));
  assert.ok(validation.errors.includes("spawn"));
});
