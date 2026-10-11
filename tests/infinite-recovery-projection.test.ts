import assert from "node:assert/strict";
import test from "node:test";

import { buildCertifiedInfiniteSectorPlan } from "../src/game/infinitePlanBuilder.ts";
import { validateInfiniteWavePlan } from "../src/game/infiniteWaveDirector.ts";

test("recovery sectors preserve zero environmental mutators through waves and execution", () => {
  const plan = buildCertifiedInfiniteSectorPlan(26, "h6-recovery-projection");

  assert.equal(plan.baselineRecipe.recoverySector, true);
  assert.deepEqual(plan.baselineRecipe.mutators, []);
  assert.deepEqual(plan.effectiveRecipe.mutators, []);
  assert.ok(plan.waves.length > 0);
  assert.equal(plan.executionPlans.length, plan.waves.length);

  for (const wave of plan.waves) {
    assert.deepEqual(wave.activeMutators, []);
  }
  for (const execution of plan.executionPlans) {
    assert.deepEqual(execution.mutators, []);
  }

  assert.deepEqual(
    validateInfiniteWavePlan(plan.effectiveRecipe, plan.waves),
    { valid: true, errors: [] },
  );
});
