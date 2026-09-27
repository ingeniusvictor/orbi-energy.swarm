import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_STATS } from "../src/game/storage.ts";
import {
  applyCampaignVictoryCheckpoint,
  applyFinalRunCommit,
  applyInfiniteMilestoneRecord,
  applyInfiniteProgressRecord,
  createRunCommitLedger,
} from "../src/game/runPersistence.ts";

const freshStats = () => ({
  ...DEFAULT_STATS,
  gameMemories: [...DEFAULT_STATS.gameMemories],
  discoveredThreats: [
    ...(DEFAULT_STATS.discoveredThreats ?? []),
  ],
  bossCodexSeenAttacks: [
    ...(DEFAULT_STATS.bossCodexSeenAttacks ?? []),
  ],
  bossCodexSeenPhases: [
    ...(DEFAULT_STATS.bossCodexSeenPhases ?? []),
  ],
});

test("default profile exposes neutral Infinite Swarm records", () => {
  const stats = freshStats();
  assert.equal(stats.bestInfiniteSector, 0);
  assert.equal(stats.bestInfiniteWave, 0);
  assert.equal(stats.infiniteMinibossesDefeated, 0);
  assert.equal(stats.infiniteBossRematchesDefeated, 0);
});

test("infinite reach rejects campaign, zero, negative and non-finite coordinates", () => {
  const base = freshStats();

  for (const input of [
    { sector: 10, waveNumber: 3 },
    { sector: 11, waveNumber: 0 },
    { sector: -1, waveNumber: 1 },
    { sector: Number.NaN, waveNumber: 1 },
    { sector: 11, waveNumber: Number.POSITIVE_INFINITY },
  ]) {
    assert.deepEqual(
      applyInfiniteProgressRecord(base, input),
      base,
    );
  }
});

test("infinite reach advances lexicographically by sector then wave", () => {
  let stats = applyInfiniteProgressRecord(
    freshStats(),
    { sector: 11, waveNumber: 1 },
  );
  assert.equal(stats.bestInfiniteSector, 11);
  assert.equal(stats.bestInfiniteWave, 1);

  stats = applyInfiniteProgressRecord(stats, {
    sector: 11,
    waveNumber: 3,
  });
  assert.equal(stats.bestInfiniteSector, 11);
  assert.equal(stats.bestInfiniteWave, 3);

  stats = applyInfiniteProgressRecord(stats, {
    sector: 12,
    waveNumber: 1,
  });
  assert.equal(stats.bestInfiniteSector, 12);
  assert.equal(stats.bestInfiniteWave, 1);

  const unchanged = applyInfiniteProgressRecord(stats, {
    sector: 11,
    waveNumber: 99,
  });
  assert.equal(unchanged.bestInfiniteSector, 12);
  assert.equal(unchanged.bestInfiniteWave, 1);
});

test("final run commit records Infinite reach without changing campaign victory counters", () => {
  const final = applyFinalRunCommit(
    freshStats(),
    {
      currentScore: 50000,
      bestWaveReached: 25,
      bestSwarmSize: 64,
      nanoCreditsBalance: 2400,
      gameMemories: [],
      enemiesDestroyed: 900,
      resourcesCollected: 420,
      infiniteSectorReached: 25,
      infiniteWaveReached: 4,
    },
    createRunCommitLedger(),
  );

  assert.equal(final.stats.bestInfiniteSector, 25);
  assert.equal(final.stats.bestInfiniteWave, 4);
  assert.equal(final.stats.totalVictories, 0);
  assert.equal(final.stats.bossVictories, 0);
});

test("campaign checkpoint never invents Infinite reach", () => {
  const checkpoint = applyCampaignVictoryCheckpoint(
    freshStats(),
    {
      currentScore: 12000,
      bestWaveReached: 10,
      bestSwarmSize: 40,
      nanoCreditsBalance: 700,
      gameMemories: [],
      bossFightDurationMs: 40000,
      remainingIntegrityPercent: 70,
      preferredBossFormation: "CIRCLE",
      bossCodexSeenPhases: [1, 2, 3],
      bossCodexSeenAttacks: ["devourer_beam"],
      firstVictoryAt: "2026-09-27T05:30:00.000Z",
    },
    createRunCommitLedger(),
  );

  assert.equal(checkpoint.stats.bestInfiniteSector, 0);
  assert.equal(checkpoint.stats.bestInfiniteWave, 0);
  assert.equal(
    checkpoint.stats.infiniteMinibossesDefeated,
    0,
  );
  assert.equal(
    checkpoint.stats.infiniteBossRematchesDefeated,
    0,
  );
});

test("milestone records increment the correct counter exactly once per event id", () => {
  const ledger = createRunCommitLedger();

  const warden = applyInfiniteMilestoneRecord(
    freshStats(),
    {
      eventId: "sector-15:warden",
      kind: "MINIBOSS",
    },
    ledger,
  );
  assert.equal(
    warden.stats.infiniteMinibossesDefeated,
    1,
  );
  assert.equal(
    warden.stats.infiniteBossRematchesDefeated,
    0,
  );

  const repeated = applyInfiniteMilestoneRecord(
    warden.stats,
    {
      eventId: "sector-15:warden",
      kind: "MINIBOSS",
    },
    warden.ledger,
  );
  assert.equal(
    repeated.stats.infiniteMinibossesDefeated,
    1,
  );

  const rematch = applyInfiniteMilestoneRecord(
    repeated.stats,
    {
      eventId: "sector-25:devourer-rematch",
      kind: "BOSS_REMATCH",
    },
    repeated.ledger,
  );
  assert.equal(
    rematch.stats.infiniteMinibossesDefeated,
    1,
  );
  assert.equal(
    rematch.stats.infiniteBossRematchesDefeated,
    1,
  );
});

test("blank milestone ids fail closed without counting", () => {
  const result = applyInfiniteMilestoneRecord(
    freshStats(),
    {
      eventId: "   ",
      kind: "BOSS_REMATCH",
    },
    createRunCommitLedger(),
  );

  assert.equal(
    result.stats.infiniteBossRematchesDefeated,
    0,
  );
  assert.deepEqual(
    result.ledger.committedInfiniteMilestoneEvents,
    [],
  );
});
