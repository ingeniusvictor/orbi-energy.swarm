import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_STATS } from "../../src/game/storage";
import type { GameStats } from "../../src/game/types";
import {
  SCORE_ATTACK_STATS_COMMIT_APPLICATION_AUTHORITY_CONTRACT,
  applyScoreAttackStatsCommit,
} from "../../src/game/scoreAttackStatsCommitApplication";
import { resolveScoreAttackAttemptFinalizationPlan } from "../../src/game/scoreAttackAttemptFinalizationPlan";
import { resolveScoreAttackRuntimeActivationEnvelope } from "../../src/game/scoreAttackRuntimeActivationEnvelope";

const makeStats = (best: number): GameStats => ({
  ...DEFAULT_STATS,
  highScore: 9999,
  scoreAttackBestScore: best,
  bestWave: 7,
  bestSwarmSize: 13,
  totalRuns: 17,
  totalVictories: 4,
  totalEnemiesDestroyed: 321,
  totalResourcesCollected: 222,
  totalNanoCredits: 777,
  totalPurifiedEnergy: 88,
  bossDefeated: true,
  gameMemories: ["memory-a"],
  discoveredThreats: ["RIFT_HUNTER"],
  bossCodexSeenAttacks: ["ATTACK_A"],
  bossCodexSeenPhases: [1, 2],
  bestInfiniteSector: 44,
  bestInfiniteWave: 3,
  infiniteMinibossesDefeated: 8,
  infiniteBossRematchesDefeated: 2,
  recentRunArchive: [
    {
      runId: "existing-run",
      completedAt: "2026-10-16T00:00:00.000Z",
      outcome: "DEFEAT",
      score: 123,
      campaignWaveReached: 7,
      durationMs: 456,
      enemiesDestroyed: 12,
      maxSwarmSize: 6,
      strongestAffinity: "solar",
      mostUsedFormation: "LINE",
      temporaryBuild: { alpha: 1 },
    },
  ],
});

const makePlan = (existingBest: number, candidate: number) => {
  const activation = resolveScoreAttackRuntimeActivationEnvelope("SCORE_ATTACK");
  assert.ok(activation);
  const plan = resolveScoreAttackAttemptFinalizationPlan(
    activation,
    {
      remainingTimeMs: 0,
      spawnedEnemyCount: 0,
      livingEnemyCount: 999,
      bossDefeated: false,
    },
    existingBest,
    candidate,
  );
  assert.ok(plan);
  return plan;
};

test("J8N applies NEW_BEST by changing only scoreAttackBestScore", () => {
  const stats = makeStats(1200.9);
  const plan = makePlan(1200.9, 1800.2);
  const before = structuredClone(stats);
  const archiveRef = stats.recentRunArchive;
  const memoriesRef = stats.gameMemories;

  const application = applyScoreAttackStatsCommit(stats, plan);
  assert.ok(application);
  assert.equal(Object.isFrozen(application), true);
  assert.equal(Object.isFrozen(application.stats), true);
  assert.equal(application.disposition, "APPLIED_NEW_BEST");
  assert.equal(application.previousBestScore, 1200);
  assert.equal(application.nextBestScore, 1800);
  assert.equal(application.changedDedicatedRecord, true);
  assert.equal(application.sourceRecordStatus, "NEW_BEST");
  assert.equal(application.stats.scoreAttackBestScore, 1800);
  assert.equal(application.stats.highScore, stats.highScore);
  assert.equal(application.stats.totalRuns, stats.totalRuns);
  assert.equal(application.stats.bestInfiniteSector, stats.bestInfiniteSector);
  assert.equal(application.stats.recentRunArchive, archiveRef);
  assert.equal(application.stats.gameMemories, memoriesRef);

  const expected = { ...before, scoreAttackBestScore: 1800 };
  assert.deepEqual(application.stats, expected);
  assert.deepEqual(stats, before);
});

test("J8N preserves stats for TIED_BEST and BELOW_BEST", () => {
  for (const candidate of [100.1, 99.9]) {
    const stats = makeStats(100.9);
    const plan = makePlan(100.9, candidate);
    const before = structuredClone(stats);
    const application = applyScoreAttackStatsCommit(stats, plan);
    assert.ok(application);

    if (candidate >= 100) {
      assert.equal(application.disposition, "NO_CHANGE_TIED_BEST");
      assert.equal(application.sourceRecordStatus, "TIED_BEST");
    } else {
      assert.equal(application.disposition, "NO_CHANGE_BELOW_BEST");
      assert.equal(application.sourceRecordStatus, "BELOW_BEST");
    }
    assert.equal(application.changedDedicatedRecord, false);
    assert.equal(application.previousBestScore, 100);
    assert.equal(application.nextBestScore, 100);
    assert.deepEqual(application.stats, before);
    assert.notEqual(application.stats, stats);
    assert.deepEqual(stats, before);
  }
});

test("J8N fails closed when current dedicated best is stale relative to J8M", () => {
  const plan = makePlan(100, 200);

  assert.equal(applyScoreAttackStatsCommit(makeStats(101), plan), null);
  assert.equal(applyScoreAttackStatsCommit(makeStats(99), plan), null);
  assert.equal(applyScoreAttackStatsCommit(makeStats(-1), plan), null);
  assert.equal(applyScoreAttackStatsCommit(makeStats(Number.NaN), plan), null);
});

test("J8N fails closed for absent or internally inconsistent finalization facts", () => {
  const stats = makeStats(100);
  const plan = makePlan(100, 200);

  assert.equal(applyScoreAttackStatsCommit(stats, null), null);

  assert.equal(
    applyScoreAttackStatsCommit(stats, {
      ...plan,
      disposition: "ADVANCE_INFINITE_RUNTIME" as never,
    }),
    null,
  );

  assert.equal(
    applyScoreAttackStatsCommit(stats, {
      ...plan,
      projectedBestScore: 199,
    }),
    null,
  );

  assert.equal(
    applyScoreAttackStatsCommit(stats, {
      ...plan,
      eligibleToAdvanceRecord: false,
    }),
    null,
  );
});

test("J8N authority contract owns only dedicated stats-commit application", () => {
  assert.equal(
    Object.isFrozen(SCORE_ATTACK_STATS_COMMIT_APPLICATION_AUTHORITY_CONTRACT),
    true,
  );

  const positives = Object.entries(
    SCORE_ATTACK_STATS_COMMIT_APPLICATION_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positives, [
    "ownsDedicatedStatsCommitApplicationAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_STATS_COMMIT_APPLICATION_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsDedicatedStatsCommitApplicationAuthority") continue;
    assert.equal(value, false, `${key} must remain false`);
  }
});
