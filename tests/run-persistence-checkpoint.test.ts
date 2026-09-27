import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_STATS } from "../src/game/storage.ts";
import {
  applyCampaignVictoryCheckpoint,
  applyFinalRunCommit,
  createRunCommitLedger,
} from "../src/game/runPersistence.ts";

const freshStats = () => ({
  ...DEFAULT_STATS,
  gameMemories: [...DEFAULT_STATS.gameMemories],
  discoveredThreats: [...(DEFAULT_STATS.discoveredThreats ?? [])],
  bossCodexSeenAttacks: [...(DEFAULT_STATS.bossCodexSeenAttacks ?? [])],
  bossCodexSeenPhases: [...(DEFAULT_STATS.bossCodexSeenPhases ?? [])],
});

const victoryInput = {
  currentScore: 12500,
  bestWaveReached: 10,
  bestSwarmSize: 42,
  nanoCreditsBalance: 760,
  gameMemories: ["hydrogen_deflector:2"],
  bossFightDurationMs: 42_000,
  remainingIntegrityPercent: 67,
  preferredBossFormation: "CIRCLE",
  bossCodexSeenPhases: [1, 2, 3],
  bossCodexSeenAttacks: ["devourer_beam", "gravity_well"],
  firstVictoryAt: "2026-09-27T03:45:00.000Z",
};

test("campaign victory checkpoint counts the run and victory exactly once", () => {
  const result = applyCampaignVictoryCheckpoint(
    freshStats(),
    victoryInput,
    createRunCommitLedger(),
  );

  assert.equal(result.stats.totalRuns, 1);
  assert.equal(result.stats.totalVictories, 1);
  assert.equal(result.stats.bossVictories, 1);
  assert.equal(result.stats.bossDefeated, true);
  assert.equal(result.ledger.runCountCommitted, true);
  assert.equal(result.ledger.campaignVictoryCommitted, true);
  assert.equal(result.ledger.telemetryCommitted, false);
});

test("campaign checkpoint persists boss records and current permanent balance", () => {
  const result = applyCampaignVictoryCheckpoint(
    freshStats(),
    victoryInput,
    createRunCommitLedger(),
  );

  assert.equal(result.stats.highScore, 12500);
  assert.equal(result.stats.bestWave, 10);
  assert.equal(result.stats.bestSwarmSize, 42);
  assert.equal(result.stats.totalNanoCredits, 760);
  assert.equal(
    result.stats.firstBossVictoryAt,
    "2026-09-27T03:45:00.000Z",
  );
  assert.equal(result.stats.fastestBossVictory, 42_000);
  assert.equal(result.stats.bestBossRemainingIntegrity, 67);
  assert.equal(result.stats.preferredBossFormation, "CIRCLE");
  assert.deepEqual(result.stats.bossCodexSeenPhases, [1, 2, 3]);
  assert.deepEqual(
    result.stats.bossCodexSeenAttacks,
    ["devourer_beam", "gravity_well"],
  );
  assert.deepEqual(
    result.stats.gameMemories,
    ["hydrogen_deflector:2"],
  );
});

test("campaign checkpoint deliberately does not accumulate run telemetry", () => {
  const base = freshStats();
  base.totalEnemiesDestroyed = 500;
  base.totalResourcesCollected = 250;

  const result = applyCampaignVictoryCheckpoint(
    base,
    victoryInput,
    createRunCommitLedger(),
  );

  assert.equal(result.stats.totalEnemiesDestroyed, 500);
  assert.equal(result.stats.totalResourcesCollected, 250);
});

test("reapplying a campaign checkpoint with its ledger is count-idempotent", () => {
  const first = applyCampaignVictoryCheckpoint(
    freshStats(),
    victoryInput,
    createRunCommitLedger(),
  );
  const second = applyCampaignVictoryCheckpoint(
    first.stats,
    {
      ...victoryInput,
      currentScore: 14000,
      nanoCreditsBalance: 800,
    },
    first.ledger,
  );

  assert.equal(second.stats.totalRuns, 1);
  assert.equal(second.stats.totalVictories, 1);
  assert.equal(second.stats.bossVictories, 1);
  assert.equal(second.stats.highScore, 14000);
  assert.equal(second.stats.totalNanoCredits, 800);
});

test("final run commit after campaign checkpoint adds telemetry once without recounting run or victory", () => {
  const checkpoint = applyCampaignVictoryCheckpoint(
    freshStats(),
    victoryInput,
    createRunCommitLedger(),
  );

  const final = applyFinalRunCommit(
    checkpoint.stats,
    {
      currentScore: 22000,
      bestWaveReached: 37,
      bestSwarmSize: 58,
      nanoCreditsBalance: 1220,
      gameMemories: ["hydrogen_deflector:2", "quantum_core:1"],
      enemiesDestroyed: 640,
      resourcesCollected: 310,
    },
    checkpoint.ledger,
  );

  assert.equal(final.stats.totalRuns, 1);
  assert.equal(final.stats.totalVictories, 1);
  assert.equal(final.stats.bossVictories, 1);
  assert.equal(final.stats.totalEnemiesDestroyed, 640);
  assert.equal(final.stats.totalResourcesCollected, 310);
  assert.equal(final.stats.highScore, 22000);
  assert.equal(final.stats.bestWave, 37);
  assert.equal(final.stats.bestSwarmSize, 58);
  assert.equal(final.stats.totalNanoCredits, 1220);
  assert.equal(final.ledger.telemetryCommitted, true);
});

test("reapplying final commit with its ledger never duplicates telemetry", () => {
  const first = applyFinalRunCommit(
    freshStats(),
    {
      currentScore: 4000,
      bestWaveReached: 6,
      bestSwarmSize: 20,
      nanoCreditsBalance: 200,
      gameMemories: [],
      enemiesDestroyed: 80,
      resourcesCollected: 30,
    },
    createRunCommitLedger(),
  );

  const second = applyFinalRunCommit(
    first.stats,
    {
      currentScore: 4500,
      bestWaveReached: 6,
      bestSwarmSize: 21,
      nanoCreditsBalance: 210,
      gameMemories: [],
      enemiesDestroyed: 80,
      resourcesCollected: 30,
    },
    first.ledger,
  );

  assert.equal(second.stats.totalRuns, 1);
  assert.equal(second.stats.totalEnemiesDestroyed, 80);
  assert.equal(second.stats.totalResourcesCollected, 30);
  assert.equal(second.stats.highScore, 4500);
  assert.equal(second.stats.totalNanoCredits, 210);
});

test("pre-boss defeat still counts one run and one telemetry commit without victory", () => {
  const final = applyFinalRunCommit(
    freshStats(),
    {
      currentScore: 3100,
      bestWaveReached: 4,
      bestSwarmSize: 17,
      nanoCreditsBalance: 120,
      gameMemories: [],
      enemiesDestroyed: 44,
      resourcesCollected: 18,
    },
    createRunCommitLedger(),
  );

  assert.equal(final.stats.totalRuns, 1);
  assert.equal(final.stats.totalVictories, 0);
  assert.equal(final.stats.bossVictories, 0);
  assert.equal(final.stats.bossDefeated, false);
  assert.equal(final.stats.totalEnemiesDestroyed, 44);
  assert.equal(final.stats.totalResourcesCollected, 18);
});

test("untouched profile preferences and discovery fields survive both transitions", () => {
  const base = freshStats();
  base.audioMuted = true;
  base.tutorialCompleted = true;
  base.discoveredThreats = ["DRONE"];
  base.screenShakeMode = "REDUCED";

  const checkpoint = applyCampaignVictoryCheckpoint(
    base,
    victoryInput,
    createRunCommitLedger(),
  );
  const final = applyFinalRunCommit(
    checkpoint.stats,
    {
      currentScore: 13000,
      bestWaveReached: 12,
      bestSwarmSize: 45,
      nanoCreditsBalance: 900,
      gameMemories: victoryInput.gameMemories,
      enemiesDestroyed: 200,
      resourcesCollected: 100,
    },
    checkpoint.ledger,
  );

  assert.equal(final.stats.audioMuted, true);
  assert.equal(final.stats.tutorialCompleted, true);
  assert.deepEqual(final.stats.discoveredThreats, ["DRONE"]);
  assert.equal(final.stats.screenShakeMode, "REDUCED");
});
