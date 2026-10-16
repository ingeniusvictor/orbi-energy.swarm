import assert from "node:assert/strict";
import test from "node:test";

import {
  SCORE_ATTACK_RECORD_ID,
  SCORE_ATTACK_RECORD_PROJECTION_AUTHORITY_CONTRACT,
  resolveScoreAttackRecordProjection,
} from "../../src/game/scoreAttackRecordProjection";

test("J8D projects a dedicated immutable Score Attack best score without storage side effects", () => {
  const projection = resolveScoreAttackRecordProjection(
    "SCORE_ATTACK",
    1200.9,
    1800.2,
  );

  assert.ok(projection);
  assert.equal(Object.isFrozen(projection), true);
  assert.deepEqual(projection, {
    modeId: "SCORE_ATTACK",
    recordId: SCORE_ATTACK_RECORD_ID,
    projectionMode: "RECORD_PROJECTION_ONLY",
    durationCompatibilityMs: 60000,
    normalizedExistingBestScore: 1200,
    normalizedCandidateScore: 1800,
    projectedBestScore: 1800,
    status: "NEW_BEST",
    writesStorage: false,
    mutatesGlobalHighScore: false,
    mutatesGameStats: false,
    adoptsLiveMode: false,
  });
});

test("J8D derives NEW_BEST, TIED_BEST and BELOW_BEST from normalized values", () => {
  assert.equal(
    resolveScoreAttackRecordProjection("SCORE_ATTACK", 10, 11)?.status,
    "NEW_BEST",
  );
  assert.equal(
    resolveScoreAttackRecordProjection("SCORE_ATTACK", 10.9, 10.1)?.status,
    "TIED_BEST",
  );
  assert.equal(
    resolveScoreAttackRecordProjection("SCORE_ATTACK", 11, 10)?.status,
    "BELOW_BEST",
  );

  assert.equal(
    resolveScoreAttackRecordProjection("SCORE_ATTACK", 11, 10)
      ?.projectedBestScore,
    11,
  );
});

test("J8D clamps accepted finite scores to Number.MAX_SAFE_INTEGER and canonicalizes zero", () => {
  const clamped = resolveScoreAttackRecordProjection(
    "SCORE_ATTACK",
    Number.MAX_SAFE_INTEGER + 4096,
    Number.MAX_VALUE,
  );

  assert.ok(clamped);
  assert.equal(
    clamped.normalizedExistingBestScore,
    Number.MAX_SAFE_INTEGER,
  );
  assert.equal(
    clamped.normalizedCandidateScore,
    Number.MAX_SAFE_INTEGER,
  );
  assert.equal(clamped.projectedBestScore, Number.MAX_SAFE_INTEGER);
  assert.equal(clamped.status, "TIED_BEST");

  const zero = resolveScoreAttackRecordProjection("SCORE_ATTACK", -0, 0.9);
  assert.ok(zero);
  assert.equal(Object.is(zero.normalizedExistingBestScore, -0), false);
  assert.equal(zero.normalizedExistingBestScore, 0);
  assert.equal(zero.normalizedCandidateScore, 0);
  assert.equal(zero.status, "TIED_BEST");
});

test("J8D fails closed for unsupported ids and invalid score inputs", () => {
  for (const unsupported of [
    "",
    " SCORE_ATTACK",
    "SCORE_ATTACK ",
    "score_attack",
    "BOSS_RUSH",
    "DAILY_SEED",
  ]) {
    assert.equal(
      resolveScoreAttackRecordProjection(unsupported, 1, 2),
      null,
    );
  }

  for (const invalid of [NaN, Infinity, -Infinity, -1]) {
    assert.equal(
      resolveScoreAttackRecordProjection("SCORE_ATTACK", invalid, 2),
      null,
    );
    assert.equal(
      resolveScoreAttackRecordProjection("SCORE_ATTACK", 1, invalid),
      null,
    );
  }
});

test("J8D authority contract owns only dedicated record projection authority", () => {
  assert.equal(
    Object.isFrozen(SCORE_ATTACK_RECORD_PROJECTION_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_RECORD_PROJECTION_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsDedicatedRecordProjectionAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_RECORD_PROJECTION_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsDedicatedRecordProjectionAuthority") continue;
    assert.equal(value, false, `${key} must remain false`);
  }
});
