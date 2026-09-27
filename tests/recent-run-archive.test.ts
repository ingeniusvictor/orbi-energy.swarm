import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_RECENT_RUN_ARCHIVE,
  sanitizeRecentRunArchive,
  DEFAULT_STATS,
} from "../src/game/storage.ts";
import {
  applyCampaignVictoryCheckpoint,
  applyFinalRunCommit,
  createRunCommitLedger,
  type FinalRunCommitInput,
} from "../src/game/runPersistence.ts";
import {
  FormationType,
  type RunArchiveEntry,
} from "../src/game/types.ts";

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
  recentRunArchive: [
    ...DEFAULT_STATS.recentRunArchive,
  ],
});

const archiveEntry = (
  runId: string,
  overrides: Partial<RunArchiveEntry> = {},
): RunArchiveEntry => ({
  runId,
  completedAt: "2026-09-27T15:20:00.000Z",
  outcome: "DEFEAT",
  score: 12000,
  campaignWaveReached: 10,
  durationMs: 180000,
  enemiesDestroyed: 220,
  maxSwarmSize: 32,
  strongestAffinity: "solar",
  mostUsedFormation: FormationType.DELTA,
  temporaryBuild: {
    solar_overcharge: 2,
    swarm_cohesion: 1,
  },
  ...overrides,
});

const finalInput = (
  entry?: RunArchiveEntry,
): FinalRunCommitInput => ({
  currentScore: entry?.score ?? 12000,
  bestWaveReached:
    entry?.campaignWaveReached ?? 10,
  bestSwarmSize: entry?.maxSwarmSize ?? 32,
  nanoCreditsBalance: 400,
  gameMemories: [],
  enemiesDestroyed:
    entry?.enemiesDestroyed ?? 220,
  resourcesCollected: 80,
  runArchiveEntry: entry,
});

test("default profile exposes an empty recent run archive", () => {
  assert.deepEqual(DEFAULT_STATS.recentRunArchive, []);
  assert.equal(MAX_RECENT_RUN_ARCHIVE, 8);
});

test("final run commit archives one normalized completed run", () => {
  const entry = archiveEntry("run-001", {
    outcome: "CAMPAIGN_CLEARED",
    infiniteSectorReached: 31,
    infiniteWaveReached: 3,
  });

  const result = applyFinalRunCommit(
    freshStats(),
    {
      ...finalInput(entry),
      infiniteSectorReached: 31,
      infiniteWaveReached: 3,
    },
    createRunCommitLedger(),
  );

  assert.equal(result.stats.recentRunArchive.length, 1);
  assert.deepEqual(
    result.stats.recentRunArchive[0],
    entry,
  );
  assert.equal(result.ledger.runArchiveCommitted, true);
  assert.equal(result.stats.bestInfiniteSector, 31);
  assert.equal(result.stats.bestInfiniteWave, 3);
});

test("campaign checkpoint never archives a still-running session", () => {
  const base = freshStats();
  const checkpoint = applyCampaignVictoryCheckpoint(
    base,
    {
      currentScore: 10000,
      bestWaveReached: 10,
      bestSwarmSize: 28,
      nanoCreditsBalance: 500,
      gameMemories: [],
      bossFightDurationMs: 40000,
      remainingIntegrityPercent: 60,
      preferredBossFormation: "DELTA",
      bossCodexSeenPhases: [1, 2, 3],
      bossCodexSeenAttacks: ["devourer_beam"],
      firstVictoryAt: "2026-09-27T15:00:00.000Z",
    },
    createRunCommitLedger(),
  );

  assert.deepEqual(
    checkpoint.stats.recentRunArchive,
    [],
  );
  assert.equal(
    checkpoint.ledger.runArchiveCommitted,
    false,
  );
});

test("same ledger cannot append the same run twice", () => {
  const first = applyFinalRunCommit(
    freshStats(),
    finalInput(archiveEntry("run-002")),
    createRunCommitLedger(),
  );
  const repeated = applyFinalRunCommit(
    first.stats,
    finalInput(archiveEntry("run-002")),
    first.ledger,
  );

  assert.equal(
    repeated.stats.recentRunArchive.length,
    1,
  );
  assert.equal(
    repeated.stats.recentRunArchive[0].runId,
    "run-002",
  );
});

test("duplicate runId stays idempotent even with a fresh ledger", () => {
  const first = applyFinalRunCommit(
    freshStats(),
    finalInput(archiveEntry("run-003")),
    createRunCommitLedger(),
  );
  const repeated = applyFinalRunCommit(
    first.stats,
    finalInput(
      archiveEntry("run-003", { score: 999999 }),
    ),
    createRunCommitLedger(),
  );

  assert.equal(
    repeated.stats.recentRunArchive.length,
    1,
  );
  assert.equal(
    repeated.stats.recentRunArchive[0].score,
    12000,
    "existing persisted run entry remains canonical",
  );
  assert.equal(
    repeated.ledger.runArchiveCommitted,
    true,
  );
});

test("archive stays bounded to the eight most recent unique runs", () => {
  let stats = freshStats();

  for (let index = 0; index < 12; index += 1) {
    const runId = `run-${index}`;
    const result = applyFinalRunCommit(
      stats,
      finalInput(
        archiveEntry(runId, {
          score: index,
          completedAt:
            `2026-09-27T15:${String(index).padStart(2, "0")}:00.000Z`,
        }),
      ),
      createRunCommitLedger(),
    );
    stats = result.stats;
  }

  assert.equal(
    stats.recentRunArchive.length,
    MAX_RECENT_RUN_ARCHIVE,
  );
  assert.deepEqual(
    stats.recentRunArchive.map((entry) => entry.runId),
    [
      "run-11",
      "run-10",
      "run-9",
      "run-8",
      "run-7",
      "run-6",
      "run-5",
      "run-4",
    ],
  );
});

test("storage sanitizer drops invalid entries and normalizes unsafe fields", () => {
  const sanitized = sanitizeRecentRunArchive([
    null,
    "bad",
    {
      runId: "   ",
      completedAt: "2026-09-27T15:20:00.000Z",
      outcome: "DEFEAT",
    },
    {
      runId: "run-safe",
      completedAt: "2026-09-27T15:20:00.000Z",
      outcome: "DEFEAT",
      score: -100,
      campaignWaveReached: Number.POSITIVE_INFINITY,
      durationMs: 1234.9,
      enemiesDestroyed: -2,
      maxSwarmSize: 7.8,
      strongestAffinity: "not-real",
      mostUsedFormation: "not-real",
      infiniteSectorReached: 10,
      infiniteWaveReached: 9,
      temporaryBuild: {
        solar_overcharge: 2.9,
        swarm_cohesion: -1,
        "bad key!": 5,
        giant_stack: 100000,
      },
    },
  ]);

  assert.equal(sanitized.length, 1);
  const [entry] = sanitized;
  assert.equal(entry.runId, "run-safe");
  assert.equal(entry.score, 0);
  assert.equal(entry.campaignWaveReached, 0);
  assert.equal(entry.durationMs, 1234);
  assert.equal(entry.enemiesDestroyed, 0);
  assert.equal(entry.maxSwarmSize, 7);
  assert.equal(entry.strongestAffinity, "none");
  assert.equal(entry.mostUsedFormation, "none");
  assert.equal(entry.infiniteSectorReached, undefined);
  assert.equal(entry.infiniteWaveReached, undefined);
  assert.deepEqual(entry.temporaryBuild, {
    solar_overcharge: 2,
    giant_stack: 99,
  });
});

test("storage sanitizer deduplicates by newest persisted occurrence", () => {
  const first = archiveEntry("same-run", {
    score: 100,
  });
  const duplicate = archiveEntry("same-run", {
    score: 200,
  });

  const sanitized = sanitizeRecentRunArchive([
    first,
    duplicate,
  ]);

  assert.equal(sanitized.length, 1);
  assert.equal(sanitized[0].score, 100);
});

test("malformed final archive payload fails closed without consuming archive gate", () => {
  const malformed = archiveEntry("bad-run", {
    completedAt: "not-a-date",
  });

  const result = applyFinalRunCommit(
    freshStats(),
    finalInput(malformed),
    createRunCommitLedger(),
  );

  assert.deepEqual(result.stats.recentRunArchive, []);
  assert.equal(
    result.ledger.runArchiveCommitted,
    false,
  );
});

test("archive write leaves existing campaign and Infinite counters semantically intact", () => {
  const base = {
    ...freshStats(),
    totalVictories: 4,
    bossVictories: 4,
    infiniteMinibossesDefeated: 8,
    infiniteBossRematchesDefeated: 3,
  };

  const result = applyFinalRunCommit(
    base,
    finalInput(archiveEntry("run-isolated")),
    createRunCommitLedger(),
  );

  assert.equal(result.stats.totalVictories, 4);
  assert.equal(result.stats.bossVictories, 4);
  assert.equal(
    result.stats.infiniteMinibossesDefeated,
    8,
  );
  assert.equal(
    result.stats.infiniteBossRematchesDefeated,
    3,
  );
});
