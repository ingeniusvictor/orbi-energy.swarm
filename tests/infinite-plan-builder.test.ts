import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCertifiedInfiniteSectorPlan,
  NEUTRAL_INFINITE_RUN_CONTEXT,
} from "../src/game/infinitePlanBuilder.ts";

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

test("builder returns one fully certified inspectable sector plan", () => {
  const plan = buildCertifiedInfiniteSectorPlan(
    137,
    "builder-cert",
    NEUTRAL_INFINITE_RUN_CONTEXT,
  );

  assert.equal(plan.kind, "CERTIFIED_INFINITE_SECTOR_PLAN");
  assert.equal(plan.sector, 137);
  assert.equal(plan.seed, "builder-cert");
  assert.equal(plan.baselineRecipe.sector, 137);
  assert.equal(plan.effectiveRecipe.sector, 137);
  assert.equal(plan.waves.length, plan.effectiveRecipe.waveCount);
  assert.equal(plan.executionPlans.length, plan.waves.length);
  assert.deepEqual(plan.certification, {
    baselineValid: true,
    effectiveRecipeValid: true,
    wavePlanValid: true,
    executionPlansValid: true,
    waveCount: plan.waves.length,
    executionPlanCount: plan.executionPlans.length,
    contextFingerprint:
      plan.effectiveRecipe.contextModulation.contextFingerprint,
    pressureDelta:
      plan.effectiveRecipe.contextModulation.pressureDelta,
  });
});

test("same sector, seed and context produce identical certified plans", () => {
  const a = buildCertifiedInfiniteSectorPlan(
    88,
    "deterministic-builder",
    STRONG,
  );
  const b = buildCertifiedInfiniteSectorPlan(
    88,
    "deterministic-builder",
    STRONG,
  );

  assert.deepEqual(a, b);
});

test("context changes effective plan identity without changing baseline identity", () => {
  const neutral = buildCertifiedInfiniteSectorPlan(
    60,
    "context-identity",
    NEUTRAL_INFINITE_RUN_CONTEXT,
  );
  const strong = buildCertifiedInfiniteSectorPlan(
    60,
    "context-identity",
    STRONG,
  );

  assert.equal(
    neutral.baselineRecipe.recipeId,
    strong.baselineRecipe.recipeId,
  );
  assert.notEqual(
    neutral.effectiveRecipe.recipeId,
    strong.effectiveRecipe.recipeId,
  );
  assert.notEqual(neutral.planId, strong.planId);
});

test("execution plans remain traceable to effective wave and sector recipes", () => {
  const plan = buildCertifiedInfiniteSectorPlan(
    75,
    "traceability-builder",
    STRONG,
  );

  plan.executionPlans.forEach((execution, index) => {
    const wave = plan.waves[index];
    assert.ok(wave);
    assert.equal(
      execution.sourceRecipeId,
      plan.effectiveRecipe.recipeId,
    );
    assert.equal(execution.sourceWaveId, wave.id);
    assert.equal(execution.seed, plan.seed);
    assert.equal(execution.waveIndex, wave.waveIndex);
  });
});

test("builder rejects invalid sector and context input", () => {
  assert.throws(
    () => buildCertifiedInfiniteSectorPlan(10),
    RangeError,
  );
  assert.throws(
    () =>
      buildCertifiedInfiniteSectorPlan(11, "invalid-context", {
        ...NEUTRAL_INFINITE_RUN_CONTEXT,
        buildPower: Number.NaN,
      }),
    RangeError,
  );
});

test("full certified pipeline succeeds for Sectors 11–1000 under representative contexts", () => {
  const contexts = [
    STRUGGLING,
    NEUTRAL_INFINITE_RUN_CONTEXT,
    STRONG,
  ];

  for (let sector = 11; sector <= 1000; sector += 1) {
    for (const context of contexts) {
      const plan = buildCertifiedInfiniteSectorPlan(
        sector,
        "full-pipeline-cert",
        context,
      );

      assert.equal(plan.sector, sector);
      assert.equal(plan.certification.baselineValid, true);
      assert.equal(plan.certification.effectiveRecipeValid, true);
      assert.equal(plan.certification.wavePlanValid, true);
      assert.equal(plan.certification.executionPlansValid, true);
      assert.equal(
        plan.executionPlans.length,
        plan.effectiveRecipe.waveCount,
      );
      assert.ok(
        Math.abs(plan.certification.pressureDelta) <= 0.08,
      );
    }
  }
});
