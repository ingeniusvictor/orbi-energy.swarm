import assert from "node:assert/strict";
import test from "node:test";

import {
  applyInfiniteRunContext,
  getInfiniteContextModulation,
  normalizeInfiniteRunContext,
} from "../src/game/infiniteContextDirector.ts";
import {
  generateInfiniteSectorRecipe,
  validateInfiniteSectorRecipe,
} from "../src/game/infiniteSectorDirector.ts";

const NEUTRAL = {
  swarmStrength: 0.5,
  shieldIntegrity: 0.5,
  buildPower: 0.5,
  recentDamagePressure: 0.5,
  recentClearEfficiency: 0.5,
};

const STRONG = {
  swarmStrength: 1,
  shieldIntegrity: 1,
  buildPower: 1,
  recentDamagePressure: 0,
  recentClearEfficiency: 1,
};

const STRUGGLING = {
  swarmStrength: 0,
  shieldIntegrity: 0,
  buildPower: 0,
  recentDamagePressure: 1,
  recentClearEfficiency: 0,
};

test("neutral context produces zero pressure delta", () => {
  const modulation = getInfiniteContextModulation(NEUTRAL);
  assert.equal(modulation.pressureDelta, 0);
  assert.equal(modulation.performanceScore, 0);
});

test("context modulation is bounded to plus or minus eight percent", () => {
  assert.equal(
    getInfiniteContextModulation(STRONG).pressureDelta,
    0.08,
  );
  assert.equal(
    getInfiniteContextModulation(STRUGGLING).pressureDelta,
    -0.08,
  );
});

test("signals are normalized and non-finite values are rejected", () => {
  assert.deepEqual(
    normalizeInfiniteRunContext({
      swarmStrength: 2,
      shieldIntegrity: -1,
      buildPower: 0.25,
      recentDamagePressure: 0.75,
      recentClearEfficiency: 0.5,
    }),
    {
      swarmStrength: 1,
      shieldIntegrity: 0,
      buildPower: 0.25,
      recentDamagePressure: 0.75,
      recentClearEfficiency: 0.5,
    },
  );

  assert.throws(
    () =>
      normalizeInfiniteRunContext({
        ...NEUTRAL,
        buildPower: Number.NaN,
      }),
    RangeError,
  );
});

test("same baseline and context produce identical contextual recipes", () => {
  const baseline = generateInfiniteSectorRecipe(137, "context-cert");
  const a = applyInfiniteRunContext(baseline, STRONG);
  const b = applyInfiniteRunContext(baseline, STRONG);

  assert.deepEqual(a, b);
  assert.equal(a.baselineRecipeId, baseline.recipeId);
  assert.match(a.recipeId, new RegExp(`^${baseline.recipeId}:ctx-`));
});

test("context transformation does not mutate the baseline recipe", () => {
  const baseline = generateInfiniteSectorRecipe(88, "immutability");
  const snapshot = structuredClone(baseline);

  applyInfiniteRunContext(baseline, STRUGGLING);

  assert.deepEqual(baseline, snapshot);
});

test("strong context increases selected pressure while struggling context reduces it", () => {
  const baseline = generateInfiniteSectorRecipe(60, "direction-check");
  const strong = applyInfiniteRunContext(baseline, STRONG);
  const struggling = applyInfiniteRunContext(
    baseline,
    STRUGGLING,
  );

  assert.ok(strong.enemyBudget >= baseline.enemyBudget);
  assert.ok(
    strong.maxConcurrentEnemies >= baseline.maxConcurrentEnemies,
  );
  assert.ok(
    strong.spawnIntervalFrames <= baseline.spawnIntervalFrames,
  );
  assert.ok(strong.eliteChance >= baseline.eliteChance);

  assert.ok(struggling.enemyBudget <= baseline.enemyBudget);
  assert.ok(
    struggling.maxConcurrentEnemies <=
      baseline.maxConcurrentEnemies,
  );
  assert.ok(
    struggling.spawnIntervalFrames >=
      baseline.spawnIntervalFrames,
  );
  assert.ok(struggling.eliteChance <= baseline.eliteChance);
});

test("fairness, composition, mutators and milestones are never altered by context", () => {
  const baseline = generateInfiniteSectorRecipe(75, "fairness-check");
  const contextual = applyInfiniteRunContext(baseline, STRONG);

  assert.deepEqual(contextual.fairness, baseline.fairness);
  assert.deepEqual(
    contextual.enemyComposition,
    baseline.enemyComposition,
  );
  assert.deepEqual(contextual.mutators, baseline.mutators);
  assert.deepEqual(contextual.milestone, baseline.milestone);

  assert.notEqual(contextual.fairness, baseline.fairness);
  assert.notEqual(
    contextual.enemyComposition,
    baseline.enemyComposition,
  );
  assert.notEqual(contextual.mutators, baseline.mutators);
});

test("representative contexts remain valid through Sector 1000", () => {
  const contexts = [STRUGGLING, NEUTRAL, STRONG];

  for (let sector = 11; sector <= 1000; sector += 1) {
    const baseline = generateInfiniteSectorRecipe(
      sector,
      "context-range-cert",
    );

    for (const context of contexts) {
      const contextual = applyInfiniteRunContext(
        baseline,
        context,
      );
      const validation = validateInfiniteSectorRecipe(contextual);

      assert.deepEqual(
        validation,
        { valid: true, errors: [] },
        `Sector ${sector}: ${validation.errors.join(", ")}`,
      );
      assert.ok(
        Math.abs(contextual.contextModulation.pressureDelta) <=
          0.08,
      );
      assert.deepEqual(contextual.fairness, baseline.fairness);
    }
  }
});
