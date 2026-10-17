import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_STATS } from "../../src/game/storage";
import {
  SCORE_ATTACK_LIVE_ENGINE_LIFECYCLE_AUTHORITY_CONTRACT,
  resolveScoreAttackLiveEngineActivation,
  resolveScoreAttackLiveRuntimeProjection,
  resolveScoreAttackLiveTerminalApplication,
} from "../../src/game/scoreAttackLiveEngineLifecycle";
import type { GameStats } from "../../src/game/types";

const makeStats = (best: number): GameStats => ({
  ...DEFAULT_STATS,
  highScore: 9000,
  scoreAttackBestScore: best,
  totalRuns: 12,
  totalVictories: 4,
  bestInfiniteSector: 44,
  bestInfiniteWave: 3,
});

const completedSnapshot = {
  remainingTimeMs: 0,
  spawnedEnemyCount: 0,
  livingEnemyCount: 99,
  bossDefeated: false,
};

test("J8O resolves only the canonical Score Attack live activation and exact frozen projection bundle", () => {
  assert.equal(resolveScoreAttackLiveEngineActivation("CAMPAIGN"), null);

  const activation = resolveScoreAttackLiveEngineActivation("SCORE_ATTACK");
  assert.ok(activation);
  assert.equal(Object.isFrozen(activation), true);
  assert.equal(activation.modeId, "SCORE_ATTACK");
  assert.equal(activation.runtimeProgression.mode, "INFINITE");
  assert.equal(activation.completionPolicy.type, "TIMEBOX");
  assert.equal(activation.completionPolicy.durationMs, 60000);

  const projection = resolveScoreAttackLiveRuntimeProjection(
    activation,
    activation.runtimeProgression,
  );
  assert.ok(projection);
  assert.equal(projection, activation.runtimeProjectionBundle);
  assert.equal(projection.descriptor, activation.effectiveDescriptor);
  assert.equal(projection.descriptor.completionPolicy.type, "TIMEBOX");
  assert.equal(projection.descriptor.completionPolicy.durationMs, 60000);
  assert.equal(projection.adaptiveInvasionBypassed, true);
  assert.equal(projection.dynamicEventAdoption, null);
  assert.equal(projection.bonusChallengeAdoption, null);
});

test("J8O terminal NEW_BEST delegates J8M and J8N without generic persistence", () => {
  const activation = resolveScoreAttackLiveEngineActivation("SCORE_ATTACK");
  assert.ok(activation);
  const stats = makeStats(100);

  const terminal = resolveScoreAttackLiveTerminalApplication(
    activation,
    activation.runtimeProgression,
    completedSnapshot,
    stats,
    250.9,
  );
  assert.ok(terminal);
  assert.equal(Object.isFrozen(terminal), true);
  assert.equal(terminal.endsAttempt, true);
  assert.equal(terminal.advancesInfiniteRuntime, false);
  assert.equal(terminal.skipsGenericRunPersistence, true);
  assert.equal(terminal.writesStorageDirectly, false);
  assert.equal(terminal.transitionsResultUi, false);
  assert.equal(terminal.recordChanged, true);
  assert.equal(terminal.statsCommitApplication.disposition, "APPLIED_NEW_BEST");
  assert.equal(terminal.stats.scoreAttackBestScore, 250);
  assert.equal(terminal.stats.highScore, stats.highScore);
  assert.equal(terminal.stats.totalRuns, stats.totalRuns);
  assert.equal(terminal.stats.totalVictories, stats.totalVictories);
  assert.equal(terminal.stats.bestInfiniteSector, stats.bestInfiniteSector);
});

test("J8O terminal tied/below outcomes remain dedicated-record no-ops", () => {
  const activation = resolveScoreAttackLiveEngineActivation("SCORE_ATTACK");
  assert.ok(activation);

  for (const candidate of [100.9, 99.9]) {
    const stats = makeStats(100.9);
    const terminal = resolveScoreAttackLiveTerminalApplication(
      activation,
      activation.runtimeProgression,
      completedSnapshot,
      stats,
      candidate,
    );
    assert.ok(terminal);
    assert.equal(terminal.recordChanged, false);
    assert.equal(terminal.stats.scoreAttackBestScore, 100.9);
    assert.equal(terminal.stats.highScore, stats.highScore);
    assert.equal(terminal.stats.totalRuns, stats.totalRuns);
  }
});

test("J8O fails closed for non-terminal or mismatched runtime facts", () => {
  const activation = resolveScoreAttackLiveEngineActivation("SCORE_ATTACK");
  assert.ok(activation);
  const stats = makeStats(100);

  assert.equal(
    resolveScoreAttackLiveTerminalApplication(
      activation,
      activation.runtimeProgression,
      { ...completedSnapshot, remainingTimeMs: 1 },
      stats,
      200,
    ),
    null,
  );

  assert.equal(
    resolveScoreAttackLiveRuntimeProjection(
      null,
      activation.runtimeProgression,
    ),
    null,
  );
});

test("J8O authority contract owns only controlled live engine coordination", () => {
  assert.equal(
    Object.isFrozen(SCORE_ATTACK_LIVE_ENGINE_LIFECYCLE_AUTHORITY_CONTRACT),
    true,
  );

  const positives = Object.entries(
    SCORE_ATTACK_LIVE_ENGINE_LIFECYCLE_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positives, [
    "ownsControlledLiveEngineCoordinationAuthority",
  ]);
});
