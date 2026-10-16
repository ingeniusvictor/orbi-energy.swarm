import assert from "node:assert/strict";
import test from "node:test";

import {
  advanceInfiniteSession,
  createInfiniteSession,
  endInfiniteSession,
} from "../../src/game/infiniteSession";
import {
  SCORE_ATTACK_DURATION_MS,
  SCORE_ATTACK_TIMEBOX_PROJECTION_AUTHORITY_CONTRACT,
  resolveScoreAttackTimeboxProjection,
} from "../../src/game/scoreAttackTimeboxProjection";
import { WAVES } from "../../src/game/waveDirector";

test("J8C freezes one immutable 60000 ms TIMEBOX projection for a fresh compatible Score Attack substrate", () => {
  const session = createInfiniteSession("j8c-fixture-seed");
  const before = JSON.stringify(session);

  const projection = resolveScoreAttackTimeboxProjection(
    "SCORE_ATTACK",
    session,
  );

  assert.ok(projection);
  assert.equal(Object.isFrozen(projection), true);
  assert.equal(Object.isFrozen(projection.completionProjection), true);
  assert.equal(SCORE_ATTACK_DURATION_MS, 60000);
  assert.deepEqual(projection, {
    kind: "SCORE_ATTACK_TIMEBOX_PROJECTION",
    projectionMode: "PROJECTION_ONLY",
    modeId: "SCORE_ATTACK",
    objective: "MAXIMIZE_EXISTING_RUN_SCORE",
    scoreSourceCompatibility: "EXISTING_RUN_SCORE",
    executionSubstrate: "INFINITE_SESSION",
    runtimeProgressionCompatibility: "INFINITE",
    exactDurationMs: 60000,
    completionProjection: {
      type: "TIMEBOX",
      durationMs: 60000,
    },
    selectsExactDuration: true,
    projectsTimeboxCompletion: true,
    executesLiveMode: false,
    mutatesRuntimeDescriptor: false,
    constructsLiveSession: false,
    startsTimer: false,
    ticksTimer: false,
    resetsTimer: false,
    ownsPauseLifecycle: false,
    selectsSeedPolicy: false,
    changesProgression: false,
    changesScoreFormula: false,
    changesPersistence: false,
    changesHud: false,
  });

  assert.equal(JSON.stringify(session), before);
});

test("J8C fails closed for unsupported ids and incompatible substrate facts", () => {
  const fresh = createInfiniteSession("j8c-fail-closed-seed");

  for (const unsupported of [
    "",
    " SCORE_ATTACK",
    "SCORE_ATTACK ",
    "score_attack",
    "BOSS_RUSH",
    "DAILY_SEED",
  ]) {
    assert.equal(
      resolveScoreAttackTimeboxProjection(unsupported, fresh),
      null,
    );
  }

  assert.equal(
    resolveScoreAttackTimeboxProjection(
      "SCORE_ATTACK",
      advanceInfiniteSession(fresh),
    ),
    null,
  );

  assert.equal(
    resolveScoreAttackTimeboxProjection(
      "SCORE_ATTACK",
      endInfiniteSession(fresh, "EXITED"),
    ),
    null,
  );
});

test("J8C reuses an existing normal Campaign 60000 ms duration without coupling to J7's 30000 ms authority", () => {
  const campaignWave9 = WAVES.find((wave) => wave.waveNumber === 9);
  assert.ok(campaignWave9);
  assert.equal(campaignWave9.duration, SCORE_ATTACK_DURATION_MS);
  assert.equal(SCORE_ATTACK_DURATION_MS, 60000);
  assert.notEqual(SCORE_ATTACK_DURATION_MS, 30000);
});

test("J8C authority contract owns exactly duration projection and completion metadata projection", () => {
  assert.equal(
    Object.isFrozen(SCORE_ATTACK_TIMEBOX_PROJECTION_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_TIMEBOX_PROJECTION_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsExactDurationProjectionAuthority",
    "ownsCompletionProjectionAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_TIMEBOX_PROJECTION_AUTHORITY_CONTRACT,
  )) {
    if (
      key === "ownsExactDurationProjectionAuthority" ||
      key === "ownsCompletionProjectionAuthority"
    ) {
      continue;
    }
    assert.equal(value, false, `${key} must remain false`);
  }
});
