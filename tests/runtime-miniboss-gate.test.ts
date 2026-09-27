import assert from "node:assert/strict";
import test from "node:test";

import {
  createRuntimeMinibossGateState,
  markRuntimeMinibossSpawned,
  requestRuntimeMinibossSpawn,
  stepRuntimeMinibossGate,
  syncRuntimeMinibossGate,
} from "../src/game/runtimeMinibossGate.ts";
import type { InfiniteMilestoneEncounterProfile } from "../src/game/runtimeMilestoneEncounter.ts";
import { EnemyType } from "../src/game/types.ts";

const profile: Extract<
  InfiniteMilestoneEncounterProfile,
  { kind: "MINIBOSS" }
> = {
  kind: "MINIBOSS",
  milestoneId: "blackout-miniboss-15",
  sector: 15,
  waveNumber: 4,
  spawnTrigger: "REPLACE_FINAL_BUDGET_SLOT",
  completionMode: "BUDGET_AND_CLEAR",
  enemyType: EnemyType.BLACKOUT_ELITE,
  healthMultiplier: 2.6,
  movementSpeedMultiplier: 1.08,
  contactDamageMultiplier: 1.35,
  sizeMultiplier: 1.55,
  rewardMultiplier: 1.7,
  telegraphMs: 1400,
  campaignTelemetryMode: "ISOLATED",
};

test("non-miniboss synchronization resets the gate", () => {
  const dirty = {
    descriptorId: "old",
    phase: "SPAWNED" as const,
    remainingMs: 0,
  };

  assert.deepEqual(
    syncRuntimeMinibossGate(
      dirty,
      "new",
      null,
    ),
    createRuntimeMinibossGateState(),
  );
});

test("new miniboss descriptor starts in IDLE state", () => {
  const state = syncRuntimeMinibossGate(
    createRuntimeMinibossGateState(),
    "infinite:sector-15:final",
    profile,
  );

  assert.deepEqual(state, {
    descriptorId: "infinite:sector-15:final",
    phase: "IDLE",
    remainingMs: 0,
  });
});

test("first spawn request starts exactly one telegraph", () => {
  const synced = syncRuntimeMinibossGate(
    createRuntimeMinibossGateState(),
    "descriptor-15",
    profile,
  );

  const first =
    requestRuntimeMinibossSpawn(
      synced,
      profile,
    );
  assert.equal(first.telegraphStarted, true);
  assert.equal(first.readyToSpawn, false);
  assert.equal(first.state.phase, "TELEGRAPH");
  assert.equal(
    first.state.remainingMs,
    profile.telegraphMs,
  );

  const repeated =
    requestRuntimeMinibossSpawn(
      first.state,
      profile,
    );
  assert.equal(
    repeated.telegraphStarted,
    false,
  );
  assert.equal(repeated.readyToSpawn, false);
  assert.deepEqual(repeated.state, first.state);
});

test("telegraph becomes ready only after its certified duration", () => {
  const telegraph = {
    descriptorId: "descriptor-15",
    phase: "TELEGRAPH" as const,
    remainingMs: 1400,
  };

  const early =
    stepRuntimeMinibossGate(
      telegraph,
      1399,
    );
  assert.equal(early.phase, "TELEGRAPH");
  assert.equal(early.remainingMs, 1);

  const ready =
    stepRuntimeMinibossGate(early, 1);
  assert.equal(ready.phase, "READY");
  assert.equal(ready.remainingMs, 0);

  const request =
    requestRuntimeMinibossSpawn(
      ready,
      profile,
    );
  assert.equal(request.readyToSpawn, true);
  assert.equal(
    request.telegraphStarted,
    false,
  );
});

test("spawned gate cannot emit a second miniboss", () => {
  const spawned =
    markRuntimeMinibossSpawned({
      descriptorId: "descriptor-15",
      phase: "READY",
      remainingMs: 0,
    });

  const request =
    requestRuntimeMinibossSpawn(
      spawned,
      profile,
    );

  assert.equal(spawned.phase, "SPAWNED");
  assert.equal(request.readyToSpawn, false);
  assert.equal(
    request.telegraphStarted,
    false,
  );
});

test("changing descriptor resets a previously spawned gate", () => {
  const spawned = {
    descriptorId: "sector-15-final",
    phase: "SPAWNED" as const,
    remainingMs: 0,
  };

  const reset = syncRuntimeMinibossGate(
    spawned,
    "sector-20-final",
    profile,
  );

  assert.equal(
    reset.descriptorId,
    "sector-20-final",
  );
  assert.equal(reset.phase, "IDLE");
});
