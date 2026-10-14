import assert from "node:assert/strict";
import test from "node:test";

import {
  LIVE_SIEGE_VOLLEY_AUTHORITY_CONTRACT,
  LIVE_SIEGE_VOLLEY_FIRE_RANGE,
  acknowledgeLiveSiegeVolleyShot,
  stepLiveSiegeVolley,
} from "../../src/game/liveSiegeVolleyIntegration.ts";
import { SIEGE_VOLLEY_TELEGRAPH_MS } from "../../src/game/siegeVolleyTelegraph.ts";

test("J4C-B does not start before cooldown readiness", () => {
  const result = stepLiveSiegeVolley({
    deltaMs: 16,
    cooldownReady: false,
    targetX: 400,
    targetY: 200,
    targetInRange: true,
  });

  assert.equal(result.state, undefined);
  assert.equal(result.telegraphStarted, false);
  assert.equal(result.commitReady, false);
});

test("J4C-B waits for the existing SIEGE firing envelope before locking", () => {
  const result = stepLiveSiegeVolley({
    deltaMs: 16,
    cooldownReady: true,
    targetX: 400,
    targetY: 200,
    targetInRange: false,
  });

  assert.equal(result.state, undefined);
  assert.equal(result.telegraphStarted, false);
  assert.equal(result.commitReady, false);
  assert.equal(LIVE_SIEGE_VOLLEY_FIRE_RANGE, 320);
});

test("J4C-B starts exactly one 700 ms target-locked telegraph", () => {
  const started = stepLiveSiegeVolley({
    deltaMs: 16,
    cooldownReady: true,
    targetX: 412.5,
    targetY: 233.25,
    targetInRange: true,
  });

  assert.equal(started.telegraphStarted, true);
  assert.equal(started.commitReady, false);
  assert.deepEqual(started.state, {
    phase: "TELEGRAPH",
    remainingMs: SIEGE_VOLLEY_TELEGRAPH_MS,
    targetX: 412.5,
    targetY: 233.25,
  });

  const movedPlayer = stepLiveSiegeVolley({
    state: started.state,
    deltaMs: 100,
    cooldownReady: true,
    targetX: 999,
    targetY: 888,
    targetInRange: true,
  });

  assert.equal(movedPlayer.state?.targetX, 412.5);
  assert.equal(movedPlayer.state?.targetY, 233.25);
  assert.equal(movedPlayer.state?.remainingMs, 600);
});

test("J4C-B exposes COMMIT only after the certified reaction window", () => {
  const started = stepLiveSiegeVolley({
    deltaMs: 0,
    cooldownReady: true,
    targetX: 500,
    targetY: 250,
    targetInRange: true,
  });

  const beforeBoundary = stepLiveSiegeVolley({
    state: started.state,
    deltaMs: 699,
    cooldownReady: true,
    targetX: 700,
    targetY: 400,
    targetInRange: true,
  });
  assert.equal(beforeBoundary.commitReady, false);
  assert.equal(beforeBoundary.state?.phase, "TELEGRAPH");
  assert.equal(beforeBoundary.state?.remainingMs, 1);

  const atBoundary = stepLiveSiegeVolley({
    state: beforeBoundary.state,
    deltaMs: 1,
    cooldownReady: true,
    targetX: 700,
    targetY: 400,
    targetInRange: true,
  });
  assert.equal(atBoundary.commitReady, true);
  assert.equal(atBoundary.state?.phase, "COMMIT");
  assert.equal(atBoundary.state?.targetX, 500);
  assert.equal(atBoundary.state?.targetY, 250);
});

test("J4C-B keeps COMMIT latched when projectile authority rejects the shot", () => {
  const started = stepLiveSiegeVolley({
    deltaMs: 0,
    cooldownReady: true,
    targetX: 320,
    targetY: 180,
    targetInRange: true,
  });
  const commit = stepLiveSiegeVolley({
    state: started.state,
    deltaMs: SIEGE_VOLLEY_TELEGRAPH_MS,
    cooldownReady: true,
    targetX: 900,
    targetY: 900,
    targetInRange: false,
  });

  const rejected = acknowledgeLiveSiegeVolleyShot(
    commit.state,
    false,
  );
  assert.equal(rejected.acknowledged, false);
  assert.equal(rejected.state, commit.state);

  const retry = stepLiveSiegeVolley({
    state: rejected.state,
    deltaMs: 1000,
    cooldownReady: true,
    targetX: 1,
    targetY: 2,
    targetInRange: false,
  });
  assert.equal(retry.commitReady, true);
  assert.equal(retry.state, commit.state);
});

test("J4C-B clears the latched commit only after one accepted shot", () => {
  const started = stepLiveSiegeVolley({
    deltaMs: 0,
    cooldownReady: true,
    targetX: 300,
    targetY: 140,
    targetInRange: true,
  });
  const commit = stepLiveSiegeVolley({
    state: started.state,
    deltaMs: SIEGE_VOLLEY_TELEGRAPH_MS,
    cooldownReady: true,
    targetX: 999,
    targetY: 999,
    targetInRange: false,
  });

  const accepted = acknowledgeLiveSiegeVolleyShot(
    commit.state,
    true,
  );
  assert.equal(accepted.acknowledged, true);
  assert.equal(accepted.state, undefined);

  const duplicate = acknowledgeLiveSiegeVolleyShot(
    accepted.state,
    true,
  );
  assert.equal(duplicate.acknowledged, false);
  assert.equal(duplicate.state, undefined);
});

test("J4C-B invalid targets fail closed through the certified pure contract", () => {
  const result = stepLiveSiegeVolley({
    deltaMs: 16,
    cooldownReady: true,
    targetX: Number.NaN,
    targetY: 200,
    targetInRange: true,
  });

  assert.equal(result.state, undefined);
  assert.equal(result.telegraphStarted, false);
  assert.equal(result.commitReady, false);
});

test("J4C-B adapter owns no collections, budgets, caps, spawn or cooldown RNG", () => {
  assert.deepEqual(LIVE_SIEGE_VOLLEY_AUTHORITY_CONTRACT, {
    ownsEnemyCollection: false,
    ownsProjectileCollection: false,
    ownsSpawnAuthority: false,
    ownsProjectileBudget: false,
    ownsCooldownRandomness: false,
    ownsFullArrayScan: false,
    mayMutateGlobalCaps: false,
  });
  assert.equal(Object.isFrozen(LIVE_SIEGE_VOLLEY_AUTHORITY_CONTRACT), true);
});
