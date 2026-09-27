import assert from "node:assert/strict";
import test from "node:test";

import {
  generateInfiniteSectorRecipe,
  getInfiniteProgressionTier,
} from "../src/game/infiniteSectorDirector.ts";
import { EnemyType } from "../src/game/types.ts";

test("infinite progression tiers begin at Sector 11", () => {
  assert.throws(() => getInfiniteProgressionTier(10), RangeError);
  assert.equal(getInfiniteProgressionTier(11), "MASTERY");
  assert.equal(getInfiniteProgressionTier(25), "MASTERY");
  assert.equal(getInfiniteProgressionTier(26), "ADVANCED_COMBINATION");
  assert.equal(getInfiniteProgressionTier(50), "ADVANCED_COMBINATION");
  assert.equal(getInfiniteProgressionTier(51), "HIGH_PRESSURE");
  assert.equal(getInfiniteProgressionTier(100), "HIGH_PRESSURE");
  assert.equal(getInfiniteProgressionTier(101), "ENDLESS_ENDGAME");
});

test("same sector and seed produce an identical recipe", () => {
  const a = generateInfiniteSectorRecipe(137, "orbi-certification");
  const b = generateInfiniteSectorRecipe(137, "orbi-certification");
  assert.deepEqual(a, b);
});

test("recipe identity changes when the seed changes", () => {
  const a = generateInfiniteSectorRecipe(137, "seed-a");
  const b = generateInfiniteSectorRecipe(137, "seed-b");
  assert.notEqual(a.recipeId, b.recipeId);
});

test("milestone and recovery sectors follow the canonical cadence", () => {
  assert.equal(generateInfiniteSectorRecipe(15).milestone?.kind, "MINIBOSS");
  assert.equal(generateInfiniteSectorRecipe(25).milestone?.kind, "BOSS_REMATCH");
  assert.equal(generateInfiniteSectorRecipe(26).recoverySector, true);
  assert.equal(generateInfiniteSectorRecipe(50).milestone?.kind, "BOSS_REMATCH");
  assert.equal(generateInfiniteSectorRecipe(51).recoverySector, true);
  assert.equal(generateInfiniteSectorRecipe(52).recoverySector, false);
});

test("Sectors 11–1000 always stay inside certified recipe bounds", () => {
  for (let sector = 11; sector <= 1000; sector += 1) {
    const recipe = generateInfiniteSectorRecipe(
      sector,
      "range-certification",
    );

    assert.equal(recipe.sector, sector);
    assert.ok(recipe.enemyBudget >= 28 && recipe.enemyBudget <= 180);
    assert.ok(
      recipe.maxConcurrentEnemies >= 14 &&
        recipe.maxConcurrentEnemies <= 36,
    );
    assert.ok(
      recipe.spawnIntervalFrames >= 42 &&
        recipe.spawnIntervalFrames <= 105,
    );
    assert.ok(recipe.waveCount >= 3 && recipe.waveCount <= 7);
    assert.ok(recipe.enemyComposition.length >= 2);
    assert.ok(recipe.enemyComposition.length <= 6);
    assert.equal(
      new Set(recipe.enemyComposition).size,
      recipe.enemyComposition.length,
    );
    assert.ok(!recipe.enemyComposition.includes(EnemyType.BOSS_DEVOURER));
    assert.ok(recipe.eliteChance >= 0.08 && recipe.eliteChance <= 0.55);
    assert.ok(recipe.mutators.length >= 1 && recipe.mutators.length <= 4);
    assert.equal(new Set(recipe.mutators).size, recipe.mutators.length);
    assert.ok(
      recipe.aggressionMultiplier >= 1 &&
        recipe.aggressionMultiplier <= 2,
    );
    assert.ok(
      recipe.projectileDensityMultiplier >= 1 &&
        recipe.projectileDensityMultiplier <= 2.2,
    );
    assert.ok(
      recipe.hazardIntensity >= 0.1 &&
        recipe.hazardIntensity <= 1,
    );
    assert.ok(recipe.statMultiplier >= 1 && recipe.statMultiplier <= 2.5);
    assert.ok(
      recipe.resourceMultiplier >= 1.2 &&
        recipe.resourceMultiplier <= 3,
    );
    assert.ok(recipe.rewardTier >= 1 && recipe.rewardTier <= 5);
    assert.equal(recipe.fairness.minTelegraphMs, 900);
    assert.equal(
      recipe.fairness.maxSimultaneousHardControlSources,
      2,
    );
    assert.equal(recipe.fairness.spawnSafetyRadius, 120);
    assert.ok(
      recipe.fairness.projectileBudget >= 80 &&
        recipe.fairness.projectileBudget <= 240,
    );
  }
});

test("recovery sectors reduce pressure after 25-sector milestones", () => {
  const milestone = generateInfiniteSectorRecipe(25, "recovery-check");
  const recovery = generateInfiniteSectorRecipe(26, "recovery-check");
  const next = generateInfiniteSectorRecipe(27, "recovery-check");

  assert.equal(milestone.milestone?.kind, "BOSS_REMATCH");
  assert.equal(recovery.recoverySector, true);
  assert.ok(recovery.enemyBudget <= next.enemyBudget);
  assert.ok(recovery.maxConcurrentEnemies <= next.maxConcurrentEnemies);
  assert.ok(recovery.spawnIntervalFrames >= next.spawnIntervalFrames);
});
