import assert from "node:assert/strict";
import test from "node:test";

import {
  expandInfiniteSectorWaves,
  validateInfiniteWavePlan,
} from "../src/game/infiniteWaveDirector.ts";
import {
  generateInfiniteSectorRecipe,
} from "../src/game/infiniteSectorDirector.ts";
import { EnemyType } from "../src/game/types.ts";

test("wave expansion is deterministic for a certified sector recipe", () => {
  const sector = generateInfiniteSectorRecipe(137, "wave-certification");
  const a = expandInfiniteSectorWaves(sector);
  const b = expandInfiniteSectorWaves(sector);

  assert.deepEqual(a, b);
  assert.deepEqual(validateInfiniteWavePlan(sector, a), {
    valid: true,
    errors: [],
  });
});

test("wave budgets conserve the exact sector enemy budget", () => {
  for (const sectorNumber of [11, 15, 25, 26, 51, 100, 101, 500, 1000]) {
    const sector = generateInfiniteSectorRecipe(
      sectorNumber,
      "budget-conservation",
    );
    const waves = expandInfiniteSectorWaves(sector);
    const total = waves.reduce(
      (sum, wave) => sum + wave.enemyBudget,
      0,
    );

    assert.equal(waves.length, sector.waveCount);
    assert.equal(total, sector.enemyBudget);
  }
});

test("pressure ramps through a sector and final wave reaches sector pressure", () => {
  const sector = generateInfiniteSectorRecipe(88, "pressure-ramp");
  const waves = expandInfiniteSectorWaves(sector);
  const finalWave = waves.at(-1);

  assert.ok(finalWave);
  assert.equal(
    finalWave.maxConcurrentEnemies,
    sector.maxConcurrentEnemies,
  );
  assert.equal(
    finalWave.spawnIntervalFrames,
    sector.spawnIntervalFrames,
  );
  assert.equal(finalWave.eliteChance, sector.eliteChance);
  assert.equal(
    finalWave.aggressionMultiplier,
    sector.aggressionMultiplier,
  );
  assert.equal(
    finalWave.projectileDensityMultiplier,
    sector.projectileDensityMultiplier,
  );
  assert.equal(finalWave.hazardIntensity, sector.hazardIntensity);
  assert.equal(finalWave.statMultiplier, sector.statMultiplier);
  assert.equal(
    finalWave.enemyComposition.length,
    sector.enemyComposition.length,
  );
  assert.equal(
    finalWave.activeMutators.length,
    sector.mutators.length,
  );

  for (let i = 1; i < waves.length; i += 1) {
    assert.ok(
      waves[i].maxConcurrentEnemies >=
        waves[i - 1].maxConcurrentEnemies,
    );
    assert.ok(
      waves[i].spawnIntervalFrames <=
        waves[i - 1].spawnIntervalFrames,
    );
    assert.ok(waves[i].eliteChance >= waves[i - 1].eliteChance);
    assert.ok(
      waves[i].aggressionMultiplier >=
        waves[i - 1].aggressionMultiplier,
    );
    assert.ok(
      waves[i].projectileDensityMultiplier >=
        waves[i - 1].projectileDensityMultiplier,
    );
    assert.ok(
      waves[i].hazardIntensity >= waves[i - 1].hazardIntensity,
    );
    assert.ok(
      waves[i].statMultiplier >= waves[i - 1].statMultiplier,
    );
    assert.ok(
      waves[i].enemyComposition.length >=
        waves[i - 1].enemyComposition.length,
    );
    assert.ok(
      waves[i].activeMutators.length >=
        waves[i - 1].activeMutators.length,
    );
  }
});

test("milestones appear only on the final wave", () => {
  for (const sectorNumber of [15, 25, 50, 75, 100]) {
    const sector = generateInfiniteSectorRecipe(
      sectorNumber,
      "milestone-placement",
    );
    const waves = expandInfiniteSectorWaves(sector);

    assert.ok(sector.milestone);
    for (const wave of waves.slice(0, -1)) {
      assert.equal(wave.milestone, null);
    }
    assert.deepEqual(waves.at(-1)?.milestone, sector.milestone);
  }
});

test("ordinary wave composition never injects the canonical boss enemy", () => {
  for (let sectorNumber = 11; sectorNumber <= 1000; sectorNumber += 1) {
    const sector = generateInfiniteSectorRecipe(
      sectorNumber,
      "boss-exclusion",
    );
    const waves = expandInfiniteSectorWaves(sector);

    for (const wave of waves) {
      assert.ok(
        !wave.enemyComposition.includes(EnemyType.BOSS_DEVOURER),
      );
    }
  }
});

test("complete wave plans remain valid from Sector 11 through 1000", () => {
  for (let sectorNumber = 11; sectorNumber <= 1000; sectorNumber += 1) {
    const sector = generateInfiniteSectorRecipe(
      sectorNumber,
      "wave-range-certification",
    );
    const waves = expandInfiniteSectorWaves(sector);
    const validation = validateInfiniteWavePlan(sector, waves);

    assert.deepEqual(
      validation,
      { valid: true, errors: [] },
      `Sector ${sectorNumber} failed: ${validation.errors.join(", ")}`,
    );
  }
});

test("validator rejects budget leakage and premature milestones", () => {
  const sector = generateInfiniteSectorRecipe(25, "invalid-wave-check");
  const waves = expandInfiniteSectorWaves(sector);
  const invalid = waves.map((wave) => ({
    ...wave,
    fairness: { ...wave.fairness },
  }));

  invalid[0].enemyBudget += 100;
  invalid[0].milestone = sector.milestone;

  const validation = validateInfiniteWavePlan(sector, invalid);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes("enemyBudgetTotal"));
  assert.ok(validation.errors.includes("milestone:1"));
});
