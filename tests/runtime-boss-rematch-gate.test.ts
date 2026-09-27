import assert from "node:assert/strict";
import test from "node:test";

import {
  createRuntimeBossRematchGateState,
  isRuntimeBossRematchEligible,
  isRuntimeBossRematchResolved,
  markRuntimeBossRematchDefeated,
  markRuntimeBossRematchSpawned,
  requestRuntimeBossRematch,
  stepRuntimeBossRematchGate,
  syncRuntimeBossRematchGate,
} from "../src/game/runtimeBossRematchGate.ts";
import type { InfiniteMilestoneEncounterProfile } from "../src/game/runtimeMilestoneEncounter.ts";
import { EnemyType } from "../src/game/types.ts";

const rematch: Extract<
  InfiniteMilestoneEncounterProfile,
  { kind: "BOSS_REMATCH" }
> = {
  kind: "BOSS_REMATCH",
  milestoneId: "devourer-rematch-25",
  sector: 25,
  waveNumber: 4,
  spawnTrigger: "AFTER_REGULAR_BUDGET_CLEAR",
  completionMode: "BOSS_DEFEAT_AFTER_BUDGET",
  enemyType: EnemyType.BOSS_DEVOURER,
  healthMultiplier: 1.2,
  damageMultiplier: 1.1,
  attackRateMultiplier: 1.05,
  rewardMultiplier: 2.5,
  telegraphMs: 2200,
  campaignTelemetryMode: "ISOLATED",
  campaignVictoryCheckpoint: false,
};

test("non-rematch profiles fail closed to IDLE", () => {
  const active = {
    descriptorId: "infinite:25",
    phase: "SPAWNED" as const,
    remainingMs: 0,
  };

  assert.deepEqual(
    syncRuntimeBossRematchGate(
      active,
      "infinite:25",
      null,
    ),
    createRuntimeBossRematchGateState(),
  );
});

test("descriptor changes reset the rematch lifecycle", () => {
  const synced = syncRuntimeBossRematchGate(
    createRuntimeBossRematchGateState(),
    "infinite:25:4",
    rematch,
  );

  assert.deepEqual(synced, {
    descriptorId: "infinite:25:4",
    phase: "IDLE",
    remainingMs: 0,
  });

  const changed = syncRuntimeBossRematchGate(
    {
      descriptorId: "infinite:25:4",
      phase: "SPAWNED",
      remainingMs: 0,
    },
    "infinite:50:5",
    rematch,
  );

  assert.equal(changed.phase, "IDLE");
  assert.equal(changed.descriptorId, "infinite:50:5");
});

test("rematch eligibility requires full budget and a clean regular field", () => {
  assert.equal(
    isRuntimeBossRematchEligible(rematch, {
      spawnedEnemyCount: 19,
      effectiveEnemyBudget: 20,
      livingRegularEnemyCount: 0,
    }),
    false,
  );

  assert.equal(
    isRuntimeBossRematchEligible(rematch, {
      spawnedEnemyCount: 20,
      effectiveEnemyBudget: 20,
      livingRegularEnemyCount: 1,
    }),
    false,
  );

  assert.equal(
    isRuntimeBossRematchEligible(rematch, {
      spawnedEnemyCount: 20,
      effectiveEnemyBudget: 20,
      livingRegularEnemyCount: 0,
    }),
    true,
  );
});

test("eligible rematch starts exactly one telegraph", () => {
  const eligibility = {
    spawnedEnemyCount: 20,
    effectiveEnemyBudget: 20,
    livingRegularEnemyCount: 0,
  };
  const synced = syncRuntimeBossRematchGate(
    createRuntimeBossRematchGateState(),
    "infinite:25:4",
    rematch,
  );

  const first = requestRuntimeBossRematch(
    synced,
    rematch,
    eligibility,
  );
  assert.equal(first.telegraphStarted, true);
  assert.equal(first.readyToSpawn, false);
  assert.equal(first.state.phase, "TELEGRAPH");
  assert.equal(first.state.remainingMs, rematch.telegraphMs);

  const repeated = requestRuntimeBossRematch(
    first.state,
    rematch,
    eligibility,
  );
  assert.equal(repeated.telegraphStarted, false);
  assert.equal(repeated.readyToSpawn, false);
  assert.equal(repeated.state.phase, "TELEGRAPH");
});

test("telegraph advances deterministically to READY", () => {
  const initial = {
    descriptorId: "infinite:25:4",
    phase: "TELEGRAPH" as const,
    remainingMs: 2200,
  };

  const halfway = stepRuntimeBossRematchGate(
    initial,
    1000,
  );
  assert.equal(halfway.phase, "TELEGRAPH");
  assert.equal(halfway.remainingMs, 1200);

  const ready = stepRuntimeBossRematchGate(
    halfway,
    5000,
  );
  assert.equal(ready.phase, "READY");
  assert.equal(ready.remainingMs, 0);
});

test("READY may spawn exactly once and SPAWNED never re-requests", () => {
  const eligibility = {
    spawnedEnemyCount: 20,
    effectiveEnemyBudget: 20,
    livingRegularEnemyCount: 0,
  };
  const ready = {
    descriptorId: "infinite:25:4",
    phase: "READY" as const,
    remainingMs: 0,
  };

  const request = requestRuntimeBossRematch(
    ready,
    rematch,
    eligibility,
  );
  assert.equal(request.readyToSpawn, true);

  const spawned = markRuntimeBossRematchSpawned(
    request.state,
  );
  assert.equal(spawned.phase, "SPAWNED");

  const repeated = requestRuntimeBossRematch(
    spawned,
    rematch,
    eligibility,
  );
  assert.equal(repeated.readyToSpawn, false);
  assert.equal(repeated.telegraphStarted, false);
});

test("defeat is explicit, idempotent and resolves the milestone", () => {
  const spawned = {
    descriptorId: "infinite:25:4",
    phase: "SPAWNED" as const,
    remainingMs: 0,
  };

  assert.equal(
    isRuntimeBossRematchResolved(spawned, rematch),
    false,
  );

  const defeated =
    markRuntimeBossRematchDefeated(spawned);
  assert.equal(defeated.phase, "DEFEATED");
  assert.equal(
    isRuntimeBossRematchResolved(defeated, rematch),
    true,
  );

  assert.deepEqual(
    markRuntimeBossRematchDefeated(defeated),
    defeated,
  );
});

test("ordinary waves are always resolved from the rematch perspective", () => {
  assert.equal(
    isRuntimeBossRematchResolved(
      createRuntimeBossRematchGateState(),
      null,
    ),
    true,
  );
});
