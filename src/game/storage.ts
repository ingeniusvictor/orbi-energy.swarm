import { normalizeFlashIntensityMode } from "./flashAccessibility";
import {
  FormationType,
  QualityPreset,
  type GameStats,
  type RunArchiveAffinity,
  type RunArchiveEntry,
  type RunArchiveFormation,
  type RunArchiveOutcome,
} from "./types";

const LOCAL_STORAGE_KEY = "orbi_energy_swarm_stats_v2";

export const DEFAULT_STATS: GameStats = {
  highScore: 0,
  bestWave: 1,
  bestSwarmSize: 1,
  totalRuns: 0,
  totalVictories: 0,
  totalEnemiesDestroyed: 0,
  totalResourcesCollected: 0,
  totalNanoCredits: 0,
  totalPurifiedEnergy: 0,
  bossDefeated: false,
  gameMemories: [],
  audioMuted: false,
  qualityPreset: QualityPreset.MEDIUM,
  tutorialCompleted: false,
  screenShakeMode: "FULL",
  flashIntensity: "FULL",
  coreLabelsMode: "PROXIMITY",
  inputMode: "HYBRID",
  minimapMode: "COMPACT",
  discoveredThreats: [],
  bossAttempts: 0,
  bossVictories: 0,
  firstBossVictoryAt: "",
  fastestBossVictory: 999999,
  bestBossRemainingIntegrity: 0,
  preferredBossFormation: "",
  bossLabelsMode: "IMPORTANT",
  bossCodexSeenAttacks: [],
  bossCodexSeenPhases: [1],
  bestInfiniteSector: 0,
  bestInfiniteWave: 0,
  infiniteMinibossesDefeated: 0,
  infiniteBossRematchesDefeated: 0,
  recentRunArchive: []
};

const safeRecordInteger = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;

export const MAX_RECENT_RUN_ARCHIVE = 8;
const MAX_TEMPORARY_BUILD_ENTRIES = 24;
const MAX_TEMPORARY_BUILD_STACK = 99;

const RUN_ARCHIVE_OUTCOMES = new Set<RunArchiveOutcome>([
  "DEFEAT",
  "CAMPAIGN_CLEARED",
]);
const RUN_ARCHIVE_AFFINITIES = new Set<RunArchiveAffinity>([
  "solar",
  "hydro",
  "wind",
  "thermal",
  "nuclear",
  "quantum",
  "none",
]);
const RUN_ARCHIVE_FORMATIONS = new Set<RunArchiveFormation>([
  FormationType.LINE,
  FormationType.CIRCLE,
  FormationType.DELTA,
  FormationType.SHIELD,
  FormationType.V_SHAPE,
  FormationType.SCATTERED,
  "none",
]);

const normalizeTemporaryBuild = (
  value: unknown,
): Record<string, number> => {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  const normalized: Record<string, number> = {};
  for (const [rawKey, rawStack] of Object.entries(value)) {
    if (
      Object.keys(normalized).length >=
      MAX_TEMPORARY_BUILD_ENTRIES
    ) {
      break;
    }

    const key = rawKey.trim();
    if (
      !/^[a-z0-9_-]{1,64}$/i.test(key) ||
      typeof rawStack !== "number" ||
      !Number.isFinite(rawStack)
    ) {
      continue;
    }

    const stack = Math.min(
      MAX_TEMPORARY_BUILD_STACK,
      Math.max(0, Math.floor(rawStack)),
    );
    if (stack > 0) {
      normalized[key] = stack;
    }
  }

  return normalized;
};

export const sanitizeRecentRunArchive = (
  value: unknown,
): RunArchiveEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const archive: RunArchiveEntry[] = [];
  const seenRunIds = new Set<string>();

  for (const raw of value) {
    if (archive.length >= MAX_RECENT_RUN_ARCHIVE) {
      break;
    }
    if (
      !raw ||
      typeof raw !== "object" ||
      Array.isArray(raw)
    ) {
      continue;
    }

    const candidate = raw as Record<string, unknown>;
    const runId =
      typeof candidate.runId === "string"
        ? candidate.runId.trim()
        : "";
    const completedAt =
      typeof candidate.completedAt === "string"
        ? candidate.completedAt.trim()
        : "";
    const outcome = candidate.outcome;

    if (
      !runId ||
      runId.length > 120 ||
      seenRunIds.has(runId) ||
      !completedAt ||
      !Number.isFinite(Date.parse(completedAt)) ||
      typeof outcome !== "string" ||
      !RUN_ARCHIVE_OUTCOMES.has(
        outcome as RunArchiveOutcome,
      )
    ) {
      continue;
    }

    const strongestAffinity =
      typeof candidate.strongestAffinity === "string" &&
      RUN_ARCHIVE_AFFINITIES.has(
        candidate.strongestAffinity as RunArchiveAffinity,
      )
        ? (candidate.strongestAffinity as RunArchiveAffinity)
        : "none";
    const mostUsedFormation =
      typeof candidate.mostUsedFormation === "string" &&
      RUN_ARCHIVE_FORMATIONS.has(
        candidate.mostUsedFormation as RunArchiveFormation,
      )
        ? (candidate.mostUsedFormation as RunArchiveFormation)
        : "none";

    const infiniteSectorReached = safeRecordInteger(
      candidate.infiniteSectorReached,
    );
    const infiniteWaveReached = safeRecordInteger(
      candidate.infiniteWaveReached,
    );

    const entry: RunArchiveEntry = {
      runId,
      completedAt,
      outcome: outcome as RunArchiveOutcome,
      score: safeRecordInteger(candidate.score),
      campaignWaveReached: safeRecordInteger(
        candidate.campaignWaveReached,
      ),
      durationMs: safeRecordInteger(candidate.durationMs),
      enemiesDestroyed: safeRecordInteger(
        candidate.enemiesDestroyed,
      ),
      maxSwarmSize: safeRecordInteger(
        candidate.maxSwarmSize,
      ),
      strongestAffinity,
      mostUsedFormation,
      temporaryBuild: normalizeTemporaryBuild(
        candidate.temporaryBuild,
      ),
    };

    if (
      infiniteSectorReached >= 11 &&
      infiniteWaveReached >= 1
    ) {
      entry.infiniteSectorReached =
        infiniteSectorReached;
      entry.infiniteWaveReached = infiniteWaveReached;
    }

    archive.push(entry);
    seenRunIds.add(runId);
  }

  return archive;
};

export function loadGameStats(): GameStats {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      // Ensure specific arrays / deep structures are correct
      gameMemories: Array.isArray(parsed.gameMemories) ? parsed.gameMemories : [],
      discoveredThreats: Array.isArray(parsed.discoveredThreats) ? parsed.discoveredThreats : [],
      bossCodexSeenAttacks: Array.isArray(parsed.bossCodexSeenAttacks) ? parsed.bossCodexSeenAttacks : [],
      bossCodexSeenPhases: Array.isArray(parsed.bossCodexSeenPhases) ? parsed.bossCodexSeenPhases : [1],
      flashIntensity: normalizeFlashIntensityMode(parsed.flashIntensity),
      bestInfiniteSector: safeRecordInteger(parsed.bestInfiniteSector),
      bestInfiniteWave: safeRecordInteger(parsed.bestInfiniteWave),
      infiniteMinibossesDefeated: safeRecordInteger(parsed.infiniteMinibossesDefeated),
      infiniteBossRematchesDefeated: safeRecordInteger(parsed.infiniteBossRematchesDefeated),
      recentRunArchive: sanitizeRecentRunArchive(parsed.recentRunArchive)
    };
  } catch (err) {
    console.error("Failed to load ORBI ENERGY SWARM stats, resetting to defaults", err);
    return { ...DEFAULT_STATS };
  }
}

export function saveGameStats(stats: GameStats): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error("Failed to save ORBI ENERGY SWARM stats", err);
  }
}

export function resetGameStats(): GameStats {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_STATS));
    return { ...DEFAULT_STATS };
  } catch (err) {
    console.error("Failed to reset ORBI ENERGY SWARM stats", err);
    return { ...DEFAULT_STATS };
  }
}
