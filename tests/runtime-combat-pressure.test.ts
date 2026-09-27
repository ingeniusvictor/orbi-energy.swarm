import assert from "node:assert/strict";
import test from "node:test";

import { createInfiniteSession } from "../src/game/infiniteSession.ts";
import { projectRuntimeCombatPressure } from "../src/game/runtimeCombatPressure.ts";
import {
  createCampaignRuntimeWaveDescriptor,
  createInfiniteRuntimeWaveDescriptor,
} from "../src/game/runtimeWaveDescriptor.ts";

test("campaign projection preserves the legacy health curve and leaves all new combat axes neutral", () => {
  for (let sector = 1; sector <= 10; sector += 1) {
    const descriptor =
      createCampaignRuntimeWaveDescriptor(sector);
    const projection =
      projectRuntimeCombatPressure(descriptor);

    assert.equal(projection.sourceMode, "CAMPAIGN");
    assert.equal(
      projection.enemyHealthMultiplier,
      descriptor.pressure.legacyDifficultyMultiplier ?? 1,
    );
    assert.equal(
      projection.enemyMovementSpeedMultiplier,
      1,
    );
    assert.equal(projection.contactDamageMultiplier, 1);
    assert.equal(projection.enemyAttackRateMultiplier, 1);
    assert.equal(projection.resourceValueMultiplier, 1);
    assert.equal(projection.projectileBudget, null);
    assert.equal(projection.spawnSafetyRadius, 150);
    assert.equal(projection.minTelegraphMs, null);
  }
});

test("infinite projection maps certified pressure and reward axes directly", () => {
  const descriptor = createInfiniteRuntimeWaveDescriptor(
    createInfiniteSession("pressure-projection"),
  );
  const projection =
    projectRuntimeCombatPressure(descriptor);

  assert.equal(projection.sourceMode, "INFINITE");
  assert.equal(
    projection.enemyHealthMultiplier,
    descriptor.pressure.statMultiplier,
  );
  assert.equal(
    projection.enemyMovementSpeedMultiplier,
    descriptor.pressure.aggressionMultiplier,
  );
  assert.equal(
    projection.contactDamageMultiplier,
    descriptor.pressure.statMultiplier,
  );
  assert.equal(
    projection.enemyAttackRateMultiplier,
    descriptor.pressure.projectileDensityMultiplier,
  );
  assert.equal(
    projection.resourceValueMultiplier,
    descriptor.rewards.resourceMultiplier,
  );
  assert.equal(
    projection.projectileBudget,
    descriptor.fairness?.projectileBudget ?? null,
  );
  assert.equal(
    projection.spawnSafetyRadius,
    descriptor.fairness?.spawnSafetyRadius ?? 150,
  );
  assert.equal(
    projection.hazardIntensity,
    descriptor.pressure.hazardIntensity,
  );
  assert.equal(
    projection.minTelegraphMs,
    descriptor.fairness?.minTelegraphMs ?? null,
  );
});

test("infinite pressure projection remains finite and bounded through Sector 1000", () => {
  let session = createInfiniteSession(
    "pressure-projection-long-run",
  );

  while (session.currentSector <= 1000) {
    const descriptor =
      createInfiniteRuntimeWaveDescriptor(session);
    const projection =
      projectRuntimeCombatPressure(descriptor);

    for (const value of [
      projection.enemyHealthMultiplier,
      projection.enemyMovementSpeedMultiplier,
      projection.contactDamageMultiplier,
      projection.enemyAttackRateMultiplier,
      projection.resourceValueMultiplier,
      projection.spawnSafetyRadius,
      projection.hazardIntensity,
    ]) {
      assert.equal(Number.isFinite(value), true);
      assert.ok(value >= 0);
    }

    assert.ok(projection.enemyHealthMultiplier <= 2.5);
    assert.ok(
      projection.enemyMovementSpeedMultiplier <= 2,
    );
    assert.ok(projection.contactDamageMultiplier <= 2.5);
    assert.ok(projection.enemyAttackRateMultiplier <= 2.2);
    assert.ok(projection.resourceValueMultiplier <= 3);
    assert.ok(
      (projection.projectileBudget ?? 0) <= 240,
    );

    const waveCount =
      session.currentPlan.executionPlans.length;
    for (let index = 0; index < waveCount; index += 1) {
      const { advanceInfiniteSession } =
        await import("../src/game/infiniteSession.ts");
      session = advanceInfiniteSession(session);
    }

    if (session.currentSector > 1000) break;
  }
});
