import assert from "node:assert/strict";
import test from "node:test";

import { createInfiniteSession } from "../src/game/infiniteSession.ts";
import {
  isRuntimeWaveComplete,
  shouldTickRuntimeTimer,
} from "../src/game/runtimeCompletionPolicy.ts";
import {
  createCampaignRuntimeWaveDescriptor,
  createInfiniteRuntimeWaveDescriptor,
} from "../src/game/runtimeWaveDescriptor.ts";

test("campaign TIMEBOX completion preserves timer semantics", () => {
  const descriptor = createCampaignRuntimeWaveDescriptor(1);

  assert.equal(descriptor.completionPolicy.type, "TIMEBOX");
  assert.equal(shouldTickRuntimeTimer(descriptor), true);
  assert.equal(
    isRuntimeWaveComplete(descriptor, {
      remainingTimeMs: 1,
      spawnedEnemyCount: descriptor.spawn.enemyBudget,
      livingEnemyCount: 0,
      bossDefeated: false,
    }),
    false,
  );
  assert.equal(
    isRuntimeWaveComplete(descriptor, {
      remainingTimeMs: 0,
      spawnedEnemyCount: 0,
      livingEnemyCount: 99,
      bossDefeated: false,
    }),
    true,
  );
});

test("campaign boss completion depends only on boss defeat", () => {
  const descriptor = createCampaignRuntimeWaveDescriptor(10);

  assert.equal(descriptor.completionPolicy.type, "BOSS_DEFEAT");
  assert.equal(shouldTickRuntimeTimer(descriptor), false);
  assert.equal(
    isRuntimeWaveComplete(descriptor, {
      remainingTimeMs: -5000,
      spawnedEnemyCount: 999,
      livingEnemyCount: 0,
      bossDefeated: false,
    }),
    false,
  );
  assert.equal(
    isRuntimeWaveComplete(descriptor, {
      remainingTimeMs: 999999,
      spawnedEnemyCount: 0,
      livingEnemyCount: 50,
      bossDefeated: true,
    }),
    true,
  );
});

test("infinite BUDGET_AND_CLEAR waits for full budget and a cleared arena", () => {
  const descriptor = createInfiniteRuntimeWaveDescriptor(
    createInfiniteSession("completion-policy"),
  );

  assert.equal(descriptor.completionPolicy.type, "BUDGET_AND_CLEAR");
  assert.equal(shouldTickRuntimeTimer(descriptor), false);

  assert.equal(
    isRuntimeWaveComplete(descriptor, {
      remainingTimeMs: -1,
      spawnedEnemyCount: descriptor.spawn.enemyBudget - 1,
      livingEnemyCount: 0,
      bossDefeated: false,
    }),
    false,
  );
  assert.equal(
    isRuntimeWaveComplete(descriptor, {
      remainingTimeMs: -1,
      spawnedEnemyCount: descriptor.spawn.enemyBudget,
      livingEnemyCount: 1,
      bossDefeated: false,
    }),
    false,
  );
  assert.equal(
    isRuntimeWaveComplete(descriptor, {
      remainingTimeMs: 999999,
      spawnedEnemyCount: descriptor.spawn.enemyBudget,
      livingEnemyCount: 0,
      bossDefeated: false,
    }),
    true,
  );
});

test("budget completion normalizes malformed negative and non-finite counters safely", () => {
  const descriptor = createInfiniteRuntimeWaveDescriptor(
    createInfiniteSession("completion-normalize"),
  );

  assert.equal(
    isRuntimeWaveComplete(descriptor, {
      remainingTimeMs: 0,
      spawnedEnemyCount: Number.NaN,
      livingEnemyCount: -5,
      bossDefeated: false,
    }),
    false,
  );
});
