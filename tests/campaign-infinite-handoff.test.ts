import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_STATS } from "../src/game/storage.ts";
import { beginInfiniteAfterCampaignVictory } from "../src/game/campaignInfiniteHandoff.ts";
import { createRunCommitLedger } from "../src/game/runPersistence.ts";
import { infiniteDescriptorMatchesSession } from "../src/game/runtimeWaveDescriptor.ts";

const freshStats = () => ({
  ...DEFAULT_STATS,
  gameMemories: [...DEFAULT_STATS.gameMemories],
  bossCodexSeenAttacks: [...(DEFAULT_STATS.bossCodexSeenAttacks ?? [])],
  bossCodexSeenPhases: [...(DEFAULT_STATS.bossCodexSeenPhases ?? [])],
});

const victoryInput = {
  currentScore: 15000,
  bestWaveReached: 10,
  bestSwarmSize: 44,
  nanoCreditsBalance: 920,
  gameMemories: ["quantum_core:2"],
  bossFightDurationMs: 38_000,
  remainingIntegrityPercent: 72,
  preferredBossFormation: "CIRCLE",
  bossCodexSeenPhases: [1, 2, 3],
  bossCodexSeenAttacks: ["devourer_beam", "devourer_charge"],
  firstVictoryAt: "2026-09-27T04:10:00.000Z",
};

test("campaign handoff checkpoints victory but leaves final telemetry uncommitted", () => {
  const handoff = beginInfiniteAfterCampaignVictory(
    freshStats(),
    victoryInput,
    createRunCommitLedger(),
    "handoff-seed",
  );

  assert.equal(handoff.checkpoint.stats.totalRuns, 1);
  assert.equal(handoff.checkpoint.stats.totalVictories, 1);
  assert.equal(handoff.checkpoint.stats.bossVictories, 1);
  assert.equal(handoff.checkpoint.ledger.runCountCommitted, true);
  assert.equal(handoff.checkpoint.ledger.campaignVictoryCommitted, true);
  assert.equal(handoff.checkpoint.ledger.telemetryCommitted, false);
  assert.equal(handoff.checkpoint.stats.totalEnemiesDestroyed, 0);
  assert.equal(handoff.checkpoint.stats.totalResourcesCollected, 0);
});

test("campaign handoff creates an active Sector 11 Wave 1 infinite session", () => {
  const handoff = beginInfiniteAfterCampaignVictory(
    freshStats(),
    victoryInput,
    createRunCommitLedger(),
    "handoff-seed",
  );

  assert.equal(handoff.session.status, "ACTIVE");
  assert.equal(handoff.session.currentSector, 11);
  assert.equal(handoff.session.currentWaveNumber, 1);
  assert.equal(handoff.session.sectorsCompleted, 0);
  assert.equal(handoff.session.wavesCompleted, 0);
});

test("campaign handoff exposes a matching infinite runtime descriptor", () => {
  const handoff = beginInfiniteAfterCampaignVictory(
    freshStats(),
    victoryInput,
    createRunCommitLedger(),
    "handoff-seed",
  );

  assert.equal(handoff.descriptor.sourceMode, "INFINITE");
  assert.equal(handoff.descriptor.sector, 11);
  assert.equal(handoff.descriptor.waveNumber, 1);
  assert.equal(handoff.descriptor.completionPolicy.type, "BUDGET_AND_CLEAR");
  assert.equal(
    infiniteDescriptorMatchesSession(handoff.descriptor, handoff.session),
    true,
  );
});

test("handoff is deterministic for the same seed and context", () => {
  const first = beginInfiniteAfterCampaignVictory(
    freshStats(),
    victoryInput,
    createRunCommitLedger(),
    "same-seed",
  );
  const second = beginInfiniteAfterCampaignVictory(
    freshStats(),
    victoryInput,
    createRunCommitLedger(),
    "same-seed",
  );

  assert.equal(first.session.sessionId, second.session.sessionId);
  assert.deepEqual(first.session.currentPlan, second.session.currentPlan);
  assert.deepEqual(first.descriptor, second.descriptor);
});

test("reusing the returned ledger never double-counts campaign victory", () => {
  const first = beginInfiniteAfterCampaignVictory(
    freshStats(),
    victoryInput,
    createRunCommitLedger(),
    "handoff-seed",
  );

  const second = beginInfiniteAfterCampaignVictory(
    first.checkpoint.stats,
    {
      ...victoryInput,
      currentScore: 17000,
      nanoCreditsBalance: 980,
    },
    first.checkpoint.ledger,
    "handoff-seed",
  );

  assert.equal(second.checkpoint.stats.totalRuns, 1);
  assert.equal(second.checkpoint.stats.totalVictories, 1);
  assert.equal(second.checkpoint.stats.bossVictories, 1);
  assert.equal(second.checkpoint.stats.highScore, 17000);
  assert.equal(second.checkpoint.stats.totalNanoCredits, 980);
});
