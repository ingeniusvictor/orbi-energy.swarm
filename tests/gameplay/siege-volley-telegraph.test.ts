import assert from "node:assert/strict";
import test from "node:test";

import {
  SIEGE_VOLLEY_AUTHORITY_CONTRACT,
  SIEGE_VOLLEY_SAFE_INTENT,
  SIEGE_VOLLEY_TELEGRAPH_KIND,
  SIEGE_VOLLEY_TELEGRAPH_MS,
  acknowledgeSiegeVolleyCommit,
  beginSiegeVolleyTelegraph,
  createSiegeVolleyTelegraphState,
  projectSiegeVolleyTelegraph,
  stepSiegeVolleyTelegraph,
} from "../../src/game/siegeVolleyTelegraph.ts";

test("J4C-A starts from one immutable fail-closed idle state", () => {
  const state = createSiegeVolleyTelegraphState();

  assert.deepEqual(state, {
    phase: "IDLE",
    remainingMs: 0,
    targetX: null,
    targetY: null,
  });
  assert.equal(Object.isFrozen(state), true);

  assert.throws(() => {
    const mutable = state as unknown as { phase: string };
    mutable.phase = "COMMIT";
  }, TypeError);
  assert.equal(state.phase, "IDLE");
});

test("begin locks one finite target for the complete telegraph", () => {
  const idle = createSiegeVolleyTelegraphState();
  const begin = beginSiegeVolleyTelegraph(idle, 412.5, 233.25);

  assert.equal(begin.telegraphStarted, true);
  assert.equal(Object.isFrozen(begin), true);
  assert.deepEqual(begin.state, {
    phase: "TELEGRAPH",
    remainingMs: SIEGE_VOLLEY_TELEGRAPH_MS,
    targetX: 412.5,
    targetY: 233.25,
  });
  assert.equal(Object.isFrozen(begin.state), true);

  const secondBegin = beginSiegeVolleyTelegraph(
    begin.state,
    999,
    888,
  );
  assert.equal(secondBegin.telegraphStarted, false);
  assert.equal(secondBegin.state, begin.state);
  assert.equal(secondBegin.state.targetX, 412.5);
  assert.equal(secondBegin.state.targetY, 233.25);
});

test("invalid targets fail closed without entering telegraph", () => {
  const idle = createSiegeVolleyTelegraphState();
  const invalidTargets = [
    [Number.NaN, 100],
    [100, Number.NaN],
    [Number.POSITIVE_INFINITY, 100],
    [100, Number.NEGATIVE_INFINITY],
  ] as const;

  for (const [x, y] of invalidTargets) {
    const result = beginSiegeVolleyTelegraph(idle, x, y);
    assert.equal(result.telegraphStarted, false);
    assert.equal(result.state, idle);
  }
});

test("the exact 700 ms boundary commits once after a readable reaction window", () => {
  const started = beginSiegeVolleyTelegraph(
    createSiegeVolleyTelegraphState(),
    500,
    250,
  ).state;

  const beforeBoundary = stepSiegeVolleyTelegraph(started, 699);
  assert.equal(beforeBoundary.commitTriggered, false);
  assert.equal(beforeBoundary.state.phase, "TELEGRAPH");
  assert.equal(beforeBoundary.state.remainingMs, 1);

  const atBoundary = stepSiegeVolleyTelegraph(
    beforeBoundary.state,
    1,
  );
  assert.equal(atBoundary.commitTriggered, true);
  assert.deepEqual(atBoundary.state, {
    phase: "COMMIT",
    remainingMs: 0,
    targetX: 500,
    targetY: 250,
  });

  const latched = stepSiegeVolleyTelegraph(
    atBoundary.state,
    1000,
  );
  assert.equal(latched.commitTriggered, false);
  assert.equal(latched.state, atBoundary.state);
});

test("one exact-duration step and overshoot both emit only one commit edge", () => {
  const exactStart = beginSiegeVolleyTelegraph(
    createSiegeVolleyTelegraphState(),
    10,
    20,
  ).state;
  const exact = stepSiegeVolleyTelegraph(
    exactStart,
    SIEGE_VOLLEY_TELEGRAPH_MS,
  );
  assert.equal(exact.commitTriggered, true);
  assert.equal(exact.state.phase, "COMMIT");

  const overshootStart = beginSiegeVolleyTelegraph(
    createSiegeVolleyTelegraphState(),
    30,
    40,
  ).state;
  const overshoot = stepSiegeVolleyTelegraph(
    overshootStart,
    SIEGE_VOLLEY_TELEGRAPH_MS + 5000,
  );
  assert.equal(overshoot.commitTriggered, true);
  assert.equal(overshoot.state.phase, "COMMIT");

  const afterOvershoot = stepSiegeVolleyTelegraph(
    overshoot.state,
    SIEGE_VOLLEY_TELEGRAPH_MS + 5000,
  );
  assert.equal(afterOvershoot.commitTriggered, false);
  assert.equal(afterOvershoot.state, overshoot.state);
});

test("commit remains latched until explicit acknowledgement", () => {
  const telegraph = beginSiegeVolleyTelegraph(
    createSiegeVolleyTelegraphState(),
    71,
    91,
  ).state;

  const premature = acknowledgeSiegeVolleyCommit(telegraph);
  assert.equal(premature.acknowledged, false);
  assert.equal(premature.state, telegraph);

  const commit = stepSiegeVolleyTelegraph(
    telegraph,
    SIEGE_VOLLEY_TELEGRAPH_MS,
  ).state;
  const acknowledged = acknowledgeSiegeVolleyCommit(commit);
  assert.equal(acknowledged.acknowledged, true);
  assert.deepEqual(acknowledged.state, {
    phase: "IDLE",
    remainingMs: 0,
    targetX: null,
    targetY: null,
  });

  const duplicateAck = acknowledgeSiegeVolleyCommit(
    acknowledged.state,
  );
  assert.equal(duplicateAck.acknowledged, false);
  assert.equal(duplicateAck.state, acknowledged.state);
});

test("invalid simulation deltas fail closed without advancing or committing", () => {
  const telegraph = beginSiegeVolleyTelegraph(
    createSiegeVolleyTelegraphState(),
    100,
    200,
  ).state;

  for (const delta of [
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ]) {
    const result = stepSiegeVolleyTelegraph(
      telegraph,
      delta,
    );
    assert.equal(result.commitTriggered, false);
    assert.equal(result.state, telegraph);
  }
});

test("deterministic chunking reaches the same latched commit and target", () => {
  const targetX = 640;
  const targetY = 360;

  const oneStep = stepSiegeVolleyTelegraph(
    beginSiegeVolleyTelegraph(
      createSiegeVolleyTelegraphState(),
      targetX,
      targetY,
    ).state,
    700,
  );

  let chunkedState = beginSiegeVolleyTelegraph(
    createSiegeVolleyTelegraphState(),
    targetX,
    targetY,
  ).state;
  let commitEdges = 0;

  for (let index = 0; index < 7; index += 1) {
    const stepped = stepSiegeVolleyTelegraph(
      chunkedState,
      100,
    );
    chunkedState = stepped.state;
    if (stepped.commitTriggered) commitEdges += 1;
  }

  assert.equal(commitEdges, 1);
  assert.deepEqual(chunkedState, oneStep.state);
});

test("projection exposes bounded progress, locked target and certified counterplay vocabulary", () => {
  const idleProjection = projectSiegeVolleyTelegraph(
    createSiegeVolleyTelegraphState(),
  );
  assert.deepEqual(idleProjection, {
    kind: SIEGE_VOLLEY_TELEGRAPH_KIND,
    safeIntent: SIEGE_VOLLEY_SAFE_INTENT,
    phase: "IDLE",
    telegraphActive: false,
    commitReady: false,
    progress: 0,
    remainingMs: 0,
    targetX: null,
    targetY: null,
  });
  assert.equal(Object.isFrozen(idleProjection), true);

  const started = beginSiegeVolleyTelegraph(
    createSiegeVolleyTelegraphState(),
    320,
    180,
  ).state;
  const progressValues: number[] = [];
  let state = started;

  for (const delta of [0, 175, 175, 175]) {
    const stepped = stepSiegeVolleyTelegraph(state, delta);
    state = stepped.state;
    const projection = projectSiegeVolleyTelegraph(state);
    progressValues.push(projection.progress);
    assert.ok(projection.progress >= 0);
    assert.ok(projection.progress <= 1);
    assert.equal(projection.targetX, 320);
    assert.equal(projection.targetY, 180);
  }

  for (let index = 1; index < progressValues.length; index += 1) {
    assert.ok(progressValues[index] >= progressValues[index - 1]);
  }

  const commit = stepSiegeVolleyTelegraph(state, 175).state;
  const commitProjection = projectSiegeVolleyTelegraph(commit);
  assert.equal(commitProjection.progress, 1);
  assert.equal(commitProjection.telegraphActive, false);
  assert.equal(commitProjection.commitReady, true);
  assert.equal(commitProjection.kind, "SIEGE_VOLLEY");
  assert.equal(
    commitProjection.safeIntent,
    "BREAK_ARTILLERY_ENVELOPE",
  );
});

test("pure Siege Volley contract owns no live runtime authority", () => {
  assert.equal(Object.isFrozen(SIEGE_VOLLEY_AUTHORITY_CONTRACT), true);
  assert.deepEqual(SIEGE_VOLLEY_AUTHORITY_CONTRACT, {
    ownsSpawnAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsFullArrayScan: false,
    mayMutateGlobalCaps: false,
    mayCreateSupportEntities: false,
    ownsCooldownRandomness: false,
  });
});
