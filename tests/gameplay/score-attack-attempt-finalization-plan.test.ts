import assert from "node:assert/strict";
import test from "node:test";

import type { RuntimeCompletionSnapshot } from "../../src/game/runtimeCompletionPolicy";
import {
  SCORE_ATTACK_ATTEMPT_FINALIZATION_PLAN_AUTHORITY_CONTRACT,
  resolveScoreAttackAttemptFinalizationPlan,
} from "../../src/game/scoreAttackAttemptFinalizationPlan";
import {
  resolveScoreAttackRuntimeActivationEnvelope,
  type ScoreAttackRuntimeActivationEnvelope,
} from "../../src/game/scoreAttackRuntimeActivationEnvelope";

const activation = () => {
  const resolved = resolveScoreAttackRuntimeActivationEnvelope("SCORE_ATTACK");
  assert.ok(resolved);
  return resolved;
};

const snapshot = (remainingTimeMs: number): RuntimeCompletionSnapshot => ({
  remainingTimeMs,
  spawnedEnemyCount: 0,
  livingEnemyCount: 999,
  bossDefeated: false,
});

test("J8M returns null until frozen J8J resolves canonical terminal completion", () => {
  const envelope = activation();

  assert.equal(
    resolveScoreAttackAttemptFinalizationPlan(
      envelope,
      snapshot(1),
      100,
      200,
    ),
    null,
  );

  const completed = resolveScoreAttackAttemptFinalizationPlan(
    envelope,
    snapshot(0),
    100,
    200,
  );
  assert.ok(completed);
  assert.equal(completed.disposition, "END_SCORE_ATTACK_ATTEMPT");
  assert.equal(completed.terminalDisposition.advanceInfiniteRuntime, false);
});

test("J8M composes immutable terminal and NEW_BEST eligibility facts without writes", () => {
  const envelope = activation();
  const plan = resolveScoreAttackAttemptFinalizationPlan(
    envelope,
    snapshot(0),
    1200.9,
    1800.2,
  );

  assert.ok(plan);
  assert.equal(Object.isFrozen(plan), true);
  assert.equal(Object.isFrozen(plan.completionFact), true);
  assert.equal(plan.kind, "SCORE_ATTACK_ATTEMPT_FINALIZATION_PLAN");
  assert.equal(plan.finalizationMode, "FINALIZATION_ONLY");
  assert.equal(plan.modeId, "SCORE_ATTACK");
  assert.equal(plan.sourceRuntimeMode, "INFINITE");
  assert.equal(plan.exactDurationMs, 60000);
  assert.equal(plan.activationEnvelope, envelope);
  assert.deepEqual(plan.completionFact, {
    type: "TIMEBOX",
    durationMs: 60000,
    completed: true,
  });
  assert.equal(plan.disposition, "END_SCORE_ATTACK_ATTEMPT");
  assert.equal(plan.recordId, "SCORE_ATTACK_BEST_SCORE");
  assert.equal(plan.recordStatus, "NEW_BEST");
  assert.equal(plan.normalizedExistingBestScore, 1200);
  assert.equal(plan.normalizedCandidateScore, 1800);
  assert.equal(plan.projectedBestScore, 1800);
  assert.equal(plan.eligibleToAdvanceRecord, true);
  assert.equal(plan.preservesExactActivationEnvelopeIdentity, true);
  assert.equal(plan.delegatesTerminalResolutionToJ8J, true);
  assert.equal(plan.delegatesRecordEligibilityToJ8F, true);

  assert.equal(plan.advancesInfiniteRuntime, false);
  assert.equal(plan.writesStorage, false);
  assert.equal(plan.mutatesGameStats, false);
  assert.equal(plan.mutatesGlobalHighScore, false);
  assert.equal(plan.writesGenericRunPersistence, false);
  assert.equal(plan.writesRunArchive, false);
  assert.equal(plan.writesReactStateOrRefs, false);
  assert.equal(plan.transitionsResultUi, false);
  assert.equal(plan.startsOrTicksTimer, false);
  assert.equal(plan.ownsCompletionCursor, false);
  assert.equal(plan.advancesOrEndsSession, false);
});

test("J8M preserves J8F tied and below-best semantics after terminal completion", () => {
  const envelope = activation();

  const tied = resolveScoreAttackAttemptFinalizationPlan(
    envelope,
    snapshot(0),
    10.9,
    10.1,
  );
  assert.ok(tied);
  assert.equal(tied.recordStatus, "TIED_BEST");
  assert.equal(tied.normalizedExistingBestScore, 10);
  assert.equal(tied.normalizedCandidateScore, 10);
  assert.equal(tied.projectedBestScore, 10);
  assert.equal(tied.eligibleToAdvanceRecord, false);

  const below = resolveScoreAttackAttemptFinalizationPlan(
    envelope,
    snapshot(-1),
    11,
    10,
  );
  assert.ok(below);
  assert.equal(below.recordStatus, "BELOW_BEST");
  assert.equal(below.projectedBestScore, 11);
  assert.equal(below.eligibleToAdvanceRecord, false);
});

test("J8M inherits J8F clamping and invalid-score fail-closed behavior", () => {
  const envelope = activation();

  const clamped = resolveScoreAttackAttemptFinalizationPlan(
    envelope,
    snapshot(0),
    1,
    Number.MAX_VALUE,
  );
  assert.ok(clamped);
  assert.equal(clamped.normalizedCandidateScore, Number.MAX_SAFE_INTEGER);
  assert.equal(clamped.projectedBestScore, Number.MAX_SAFE_INTEGER);
  assert.equal(clamped.eligibleToAdvanceRecord, true);

  for (const invalid of [NaN, Infinity, -Infinity, -1]) {
    assert.equal(
      resolveScoreAttackAttemptFinalizationPlan(
        envelope,
        snapshot(0),
        invalid,
        2,
      ),
      null,
    );
    assert.equal(
      resolveScoreAttackAttemptFinalizationPlan(
        envelope,
        snapshot(0),
        1,
        invalid,
      ),
      null,
    );
  }
});

test("J8M fails closed for absent or internally mismatched activation facts", () => {
  const envelope = activation();

  assert.equal(
    resolveScoreAttackAttemptFinalizationPlan(null, snapshot(0), 1, 2),
    null,
  );

  const mismatchedRuntime = {
    ...envelope,
    runtimeProgression: {
      ...envelope.runtimeProgression,
    },
  } as unknown as Readonly<ScoreAttackRuntimeActivationEnvelope>;

  assert.equal(
    resolveScoreAttackAttemptFinalizationPlan(
      mismatchedRuntime,
      snapshot(0),
      1,
      2,
    ),
    null,
  );

  const wrongDuration = {
    ...envelope,
    exactDurationMs: 30000,
  } as unknown as Readonly<ScoreAttackRuntimeActivationEnvelope>;

  assert.equal(
    resolveScoreAttackAttemptFinalizationPlan(
      wrongDuration,
      snapshot(0),
      1,
      2,
    ),
    null,
  );
});

test("J8M is deterministic and does not mutate activation, snapshot or score inputs", () => {
  const envelope = activation();
  const completeSnapshot = snapshot(0);
  const envelopeBefore = JSON.stringify(envelope);
  const snapshotBefore = JSON.stringify(completeSnapshot);

  const first = resolveScoreAttackAttemptFinalizationPlan(
    envelope,
    completeSnapshot,
    50.9,
    75.8,
  );
  const second = resolveScoreAttackAttemptFinalizationPlan(
    envelope,
    completeSnapshot,
    50.9,
    75.8,
  );

  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
  assert.deepEqual(first, second);
  assert.equal(first.activationEnvelope, envelope);
  assert.equal(second.activationEnvelope, envelope);
  assert.equal(JSON.stringify(envelope), envelopeBefore);
  assert.equal(JSON.stringify(completeSnapshot), snapshotBefore);
});

test("J8M authority contract owns only attempt-finalization plan composition", () => {
  assert.equal(
    Object.isFrozen(SCORE_ATTACK_ATTEMPT_FINALIZATION_PLAN_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_ATTEMPT_FINALIZATION_PLAN_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsAttemptFinalizationPlanCompositionAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_ATTEMPT_FINALIZATION_PLAN_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsAttemptFinalizationPlanCompositionAuthority") continue;
    assert.equal(value, false, `${key} must remain false`);
  }
});
