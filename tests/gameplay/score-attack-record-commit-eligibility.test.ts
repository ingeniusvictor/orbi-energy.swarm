import assert from "node:assert/strict";
import test from "node:test";

import {
  SCORE_ATTACK_RECORD_COMMIT_ELIGIBILITY_AUTHORITY_CONTRACT,
  resolveScoreAttackRecordCommitEligibility,
} from "../../src/game/scoreAttackRecordCommitEligibility";

const completedTimebox = Object.freeze({
  type: "TIMEBOX" as const,
  durationMs: 60000,
  completed: true,
});

test("J8F projects immutable record advancement eligibility only for NEW_BEST", () => {
  const projection = resolveScoreAttackRecordCommitEligibility(
    "SCORE_ATTACK",
    completedTimebox,
    1200.9,
    1800.2,
  );

  assert.ok(projection);
  assert.equal(Object.isFrozen(projection), true);
  assert.deepEqual(projection, {
    modeId: "SCORE_ATTACK",
    recordId: "SCORE_ATTACK_BEST_SCORE",
    eligibilityMode: "ELIGIBILITY_ONLY",
    completionType: "TIMEBOX",
    durationMs: 60000,
    recordStatus: "NEW_BEST",
    normalizedExistingBestScore: 1200,
    normalizedCandidateScore: 1800,
    projectedBestScore: 1800,
    eligibleToAdvanceRecord: true,
    writesStorage: false,
    mutatesGameStats: false,
    mutatesGlobalHighScore: false,
    adoptsLiveMode: false,
  });
});

test("J8F keeps tied and below-best completed runs ineligible", () => {
  const tied = resolveScoreAttackRecordCommitEligibility(
    "SCORE_ATTACK",
    completedTimebox,
    10.9,
    10.1,
  );
  assert.ok(tied);
  assert.equal(tied.recordStatus, "TIED_BEST");
  assert.equal(tied.eligibleToAdvanceRecord, false);
  assert.equal(tied.projectedBestScore, 10);

  const below = resolveScoreAttackRecordCommitEligibility(
    "SCORE_ATTACK",
    completedTimebox,
    11,
    10,
  );
  assert.ok(below);
  assert.equal(below.recordStatus, "BELOW_BEST");
  assert.equal(below.eligibleToAdvanceRecord, false);
  assert.equal(below.projectedBestScore, 11);
});

test("J8F fails closed for unsupported mode or incomplete/wrong TIMEBOX facts", () => {
  assert.equal(
    resolveScoreAttackRecordCommitEligibility(
      "BOSS_RUSH",
      completedTimebox,
      1,
      2,
    ),
    null,
  );
  assert.equal(
    resolveScoreAttackRecordCommitEligibility("SCORE_ATTACK", null, 1, 2),
    null,
  );
  assert.equal(
    resolveScoreAttackRecordCommitEligibility(
      "SCORE_ATTACK",
      { ...completedTimebox, completed: false },
      1,
      2,
    ),
    null,
  );
  assert.equal(
    resolveScoreAttackRecordCommitEligibility(
      "SCORE_ATTACK",
      { ...completedTimebox, durationMs: 59999 },
      1,
      2,
    ),
    null,
  );
  assert.equal(
    resolveScoreAttackRecordCommitEligibility(
      "SCORE_ATTACK",
      { type: "WAVE" as never, durationMs: 60000, completed: true },
      1,
      2,
    ),
    null,
  );
});

test("J8F inherits J8D normalization, clamping and invalid-score failure", () => {
  const clamped = resolveScoreAttackRecordCommitEligibility(
    "SCORE_ATTACK",
    completedTimebox,
    1,
    Number.MAX_VALUE,
  );
  assert.ok(clamped);
  assert.equal(clamped.recordStatus, "NEW_BEST");
  assert.equal(clamped.normalizedCandidateScore, Number.MAX_SAFE_INTEGER);
  assert.equal(clamped.projectedBestScore, Number.MAX_SAFE_INTEGER);
  assert.equal(clamped.eligibleToAdvanceRecord, true);

  for (const invalid of [NaN, Infinity, -Infinity, -1]) {
    assert.equal(
      resolveScoreAttackRecordCommitEligibility(
        "SCORE_ATTACK",
        completedTimebox,
        invalid,
        2,
      ),
      null,
    );
    assert.equal(
      resolveScoreAttackRecordCommitEligibility(
        "SCORE_ATTACK",
        completedTimebox,
        1,
        invalid,
      ),
      null,
    );
  }
});

test("J8F authority contract owns only record-commit eligibility authority", () => {
  assert.equal(
    Object.isFrozen(SCORE_ATTACK_RECORD_COMMIT_ELIGIBILITY_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_RECORD_COMMIT_ELIGIBILITY_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsRecordCommitEligibilityAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_RECORD_COMMIT_ELIGIBILITY_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsRecordCommitEligibilityAuthority") continue;
    assert.equal(value, false, `${key} must remain false`);
  }
});
