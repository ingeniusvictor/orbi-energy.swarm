import type { GameStats } from "./types";

export interface RunCommitLedger {
  runCountCommitted: boolean;
  campaignVictoryCommitted: boolean;
  telemetryCommitted: boolean;
}

export interface CampaignVictoryCheckpointInput {
  currentScore: number;
  bestWaveReached: number;
  bestSwarmSize: number;
  nanoCreditsBalance: number;
  gameMemories: string[];
  bossFightDurationMs: number;
  remainingIntegrityPercent: number;
  preferredBossFormation: string;
  bossCodexSeenPhases: number[];
  bossCodexSeenAttacks: string[];
  firstVictoryAt: string;
}

export interface FinalRunCommitInput {
  currentScore: number;
  bestWaveReached: number;
  bestSwarmSize: number;
  nanoCreditsBalance: number;
  gameMemories: string[];
  enemiesDestroyed: number;
  resourcesCollected: number;
}

export interface RunCommitTransition {
  stats: GameStats;
  ledger: RunCommitLedger;
}

export const createRunCommitLedger = (): RunCommitLedger => ({
  runCountCommitted: false,
  campaignVictoryCommitted: false,
  telemetryCommitted: false,
});

const finiteNonNegative = (value: number, fallback = 0) =>
  Number.isFinite(value) ? Math.max(0, value) : fallback;

const integerNonNegative = (value: number, fallback = 0) =>
  Math.floor(finiteNonNegative(value, fallback));

const unique = <T>(values: readonly T[]) =>
  Array.from(new Set(values));

const copyLedger = (ledger: RunCommitLedger): RunCommitLedger => ({
  runCountCommitted: ledger.runCountCommitted,
  campaignVictoryCommitted: ledger.campaignVictoryCommitted,
  telemetryCommitted: ledger.telemetryCommitted,
});

export const applyCampaignVictoryCheckpoint = (
  fresh: GameStats,
  input: CampaignVictoryCheckpointInput,
  ledger: RunCommitLedger,
): RunCommitTransition => {
  const nextLedger = copyLedger(ledger);
  const countRun = !nextLedger.runCountCommitted;
  const countVictory = !nextLedger.campaignVictoryCommitted;

  const fightDurationMs = finiteNonNegative(
    input.bossFightDurationMs,
  );
  const existingFastest =
    fresh.fastestBossVictory && fresh.fastestBossVictory > 0
      ? fresh.fastestBossVictory
      : Number.POSITIVE_INFINITY;
  const fastestBossVictory =
    fightDurationMs > 0
      ? Math.min(existingFastest, fightDurationMs)
      : fresh.fastestBossVictory;

  const seenPhases = unique([
    ...(fresh.bossCodexSeenPhases ?? []),
    ...input.bossCodexSeenPhases,
  ]);
  const seenAttacks = unique([
    ...(fresh.bossCodexSeenAttacks ?? []),
    ...input.bossCodexSeenAttacks,
  ]);

  const stats: GameStats = {
    ...fresh,
    highScore: Math.max(
      fresh.highScore,
      integerNonNegative(input.currentScore),
    ),
    bestWave: Math.max(
      fresh.bestWave,
      integerNonNegative(input.bestWaveReached),
    ),
    bestSwarmSize: Math.max(
      fresh.bestSwarmSize,
      integerNonNegative(input.bestSwarmSize),
    ),
    totalRuns: fresh.totalRuns + (countRun ? 1 : 0),
    totalVictories:
      fresh.totalVictories + (countVictory ? 1 : 0),
    // Run telemetry intentionally stays untouched at the campaign checkpoint.
    totalEnemiesDestroyed: fresh.totalEnemiesDestroyed,
    totalResourcesCollected: fresh.totalResourcesCollected,
    totalNanoCredits: integerNonNegative(
      input.nanoCreditsBalance,
      fresh.totalNanoCredits,
    ),
    bossDefeated: true,
    gameMemories: [...input.gameMemories],
    bossVictories:
      (fresh.bossVictories ?? 0) + (countVictory ? 1 : 0),
    firstBossVictoryAt:
      fresh.firstBossVictoryAt ||
      (countVictory ? input.firstVictoryAt : ""),
    fastestBossVictory,
    bestBossRemainingIntegrity: Math.max(
      fresh.bestBossRemainingIntegrity ?? 0,
      finiteNonNegative(input.remainingIntegrityPercent),
    ),
    preferredBossFormation:
      input.preferredBossFormation ||
      fresh.preferredBossFormation ||
      "",
    bossCodexSeenPhases: seenPhases,
    bossCodexSeenAttacks: seenAttacks,
  };

  nextLedger.runCountCommitted = true;
  nextLedger.campaignVictoryCommitted = true;

  return {
    stats,
    ledger: nextLedger,
  };
};

export const applyFinalRunCommit = (
  fresh: GameStats,
  input: FinalRunCommitInput,
  ledger: RunCommitLedger,
): RunCommitTransition => {
  const nextLedger = copyLedger(ledger);
  const countRun = !nextLedger.runCountCommitted;
  const commitTelemetry = !nextLedger.telemetryCommitted;

  const stats: GameStats = {
    ...fresh,
    highScore: Math.max(
      fresh.highScore,
      integerNonNegative(input.currentScore),
    ),
    bestWave: Math.max(
      fresh.bestWave,
      integerNonNegative(input.bestWaveReached),
    ),
    bestSwarmSize: Math.max(
      fresh.bestSwarmSize,
      integerNonNegative(input.bestSwarmSize),
    ),
    totalRuns: fresh.totalRuns + (countRun ? 1 : 0),
    // Campaign victory counters are checkpoint-only and never increment here.
    totalVictories: fresh.totalVictories,
    totalEnemiesDestroyed:
      fresh.totalEnemiesDestroyed +
      (commitTelemetry
        ? integerNonNegative(input.enemiesDestroyed)
        : 0),
    totalResourcesCollected:
      fresh.totalResourcesCollected +
      (commitTelemetry
        ? integerNonNegative(input.resourcesCollected)
        : 0),
    totalNanoCredits: integerNonNegative(
      input.nanoCreditsBalance,
      fresh.totalNanoCredits,
    ),
    gameMemories: [...input.gameMemories],
  };

  nextLedger.runCountCommitted = true;
  nextLedger.telemetryCommitted = true;

  return {
    stats,
    ledger: nextLedger,
  };
};
