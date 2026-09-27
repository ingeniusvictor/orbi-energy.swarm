import { GameStats, QualityPreset } from "./types";

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
  infiniteBossRematchesDefeated: 0
};

const safeRecordInteger = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;

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
      bestInfiniteSector: safeRecordInteger(parsed.bestInfiniteSector),
      bestInfiniteWave: safeRecordInteger(parsed.bestInfiniteWave),
      infiniteMinibossesDefeated: safeRecordInteger(parsed.infiniteMinibossesDefeated),
      infiniteBossRematchesDefeated: safeRecordInteger(parsed.infiniteBossRematchesDefeated)
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
