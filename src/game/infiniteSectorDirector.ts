import { BiomeType, EnemyType } from "./types";

export type InfiniteProgressionTier =
  | "MASTERY"
  | "ADVANCED_COMBINATION"
  | "HIGH_PRESSURE"
  | "ENDLESS_ENDGAME";

export type InfiniteMutator =
  | "ELECTRICAL_STORM"
  | "REDUCED_VISIBILITY"
  | "MAGNETIC_DRIFT"
  | "ACCELERATED_ENEMIES"
  | "REGENERATIVE_ENEMIES"
  | "FRAGILE_SWARM"
  | "UNSTABLE_RESOURCE_FIELDS"
  | "FORMATION_DISRUPTION"
  | "ELITE_BURST"
  | "DOUBLE_THREAT";

export type InfiniteMilestoneKind = "MINIBOSS" | "BOSS_REMATCH";

export interface InfiniteSectorRecipe {
  sector: number;
  seed: string;
  recipeId: string;
  tier: InfiniteProgressionTier;
  biome: BiomeType;
  waveCount: number;
  enemyBudget: number;
  maxConcurrentEnemies: number;
  spawnIntervalFrames: number;
  enemyComposition: EnemyType[];
  eliteChance: number;
  mutators: InfiniteMutator[];
  aggressionMultiplier: number;
  projectileDensityMultiplier: number;
  hazardIntensity: number;
  statMultiplier: number;
  resourceMultiplier: number;
  rewardTier: 1 | 2 | 3 | 4 | 5;
  recoverySector: boolean;
  milestone: {
    kind: InfiniteMilestoneKind;
    id: string;
  } | null;
  fairness: {
    minTelegraphMs: number;
    maxSimultaneousHardControlSources: number;
    spawnSafetyRadius: number;
    projectileBudget: number;
  };
}

const ENEMY_POOL = [
  EnemyType.CRAWLER,
  EnemyType.PARASITE,
  EnemyType.DRONE,
  EnemyType.SPLITTER,
  EnemyType.DISRUPTOR,
  EnemyType.BLACKOUT_ELITE,
] as const;

const BIOME_POOL = [
  BiomeType.SOLAR_PLAINS,
  BiomeType.DEEP_WATER,
  BiomeType.CYBER_VOID,
  BiomeType.ACID_SWAMP,
  BiomeType.MAGMA_CHAMBER,
  BiomeType.QUANTUM_NEXUS,
] as const;

const MUTATOR_POOL: readonly InfiniteMutator[] = [
  "ELECTRICAL_STORM",
  "REDUCED_VISIBILITY",
  "MAGNETIC_DRIFT",
  "ACCELERATED_ENEMIES",
  "REGENERATIVE_ENEMIES",
  "FRAGILE_SWARM",
  "UNSTABLE_RESOURCE_FIELDS",
  "FORMATION_DISRUPTION",
  "ELITE_BURST",
  "DOUBLE_THREAT",
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const round = (value: number, digits = 3) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createSeededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pickUnique = <T>(
  source: readonly T[],
  count: number,
  random: () => number,
): T[] => {
  const pool = [...source];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, clamp(count, 0, pool.length));
};

export const getInfiniteProgressionTier = (
  sector: number,
): InfiniteProgressionTier => {
  if (sector < 11) {
    throw new RangeError("Infinite progression starts at Sector 11.");
  }
  if (sector <= 25) return "MASTERY";
  if (sector <= 50) return "ADVANCED_COMBINATION";
  if (sector <= 100) return "HIGH_PRESSURE";
  return "ENDLESS_ENDGAME";
};

const getTierIndex = (tier: InfiniteProgressionTier) => {
  switch (tier) {
    case "MASTERY":
      return 0;
    case "ADVANCED_COMBINATION":
      return 1;
    case "HIGH_PRESSURE":
      return 2;
    case "ENDLESS_ENDGAME":
      return 3;
  }
};

const getMilestone = (sector: number) => {
  if (sector % 25 === 0) {
    return {
      kind: "BOSS_REMATCH" as const,
      id: `devourer-rematch-${sector}`,
    };
  }

  if (sector % 5 === 0) {
    return {
      kind: "MINIBOSS" as const,
      id: `blackout-miniboss-${sector}`,
    };
  }

  return null;
};

export const generateInfiniteSectorRecipe = (
  sector: number,
  seed = "orbi-infinite",
): InfiniteSectorRecipe => {
  const tier = getInfiniteProgressionTier(sector);
  const tierIndex = getTierIndex(tier);
  const progress = sector - 10;
  const logarithmicPressure = Math.log2(progress + 1);
  const milestone = getMilestone(sector);
  const recoverySector = sector > 11 && (sector - 1) % 25 === 0;

  const numericSeed = hashString(`${seed}:${sector}`);
  const random = createSeededRandom(numericSeed);

  let enemyBudget = clamp(
    Math.round(24 + progress * 1.25 + logarithmicPressure * 5),
    28,
    180,
  );
  let maxConcurrentEnemies = clamp(
    14 + Math.floor(logarithmicPressure * 2.5) + tierIndex * 2,
    14,
    36,
  );
  let spawnIntervalFrames = clamp(
    Math.round(105 - logarithmicPressure * 6 - tierIndex * 4),
    42,
    105,
  );

  if (recoverySector) {
    enemyBudget = Math.max(28, Math.round(enemyBudget * 0.82));
    maxConcurrentEnemies = Math.max(14, maxConcurrentEnemies - 3);
    spawnIntervalFrames = Math.min(105, spawnIntervalFrames + 12);
  }

  const compositionCount = clamp(
    2 + Math.floor(logarithmicPressure / 2) + (tierIndex >= 1 ? 1 : 0),
    2,
    ENEMY_POOL.length,
  );

  const mutatorTargetCount = recoverySector
    ? 1
    : clamp(tierIndex + 1, 1, 4);

  const biome =
    BIOME_POOL[Math.floor(random() * BIOME_POOL.length)] ??
    BiomeType.SOLAR_PLAINS;

  const enemyComposition = pickUnique(
    ENEMY_POOL,
    compositionCount,
    random,
  );

  const mutators = pickUnique(
    MUTATOR_POOL,
    mutatorTargetCount,
    random,
  );

  const eliteChance = round(
    clamp(0.08 + progress * 0.0015 + tierIndex * 0.035, 0.08, 0.55),
  );

  const aggressionMultiplier = round(
    recoverySector
      ? clamp(
          (1 + progress * 0.002 + tierIndex * 0.12) * 0.88,
          1,
          2,
        )
      : clamp(1 + progress * 0.002 + tierIndex * 0.12, 1, 2),
  );

  const projectileDensityMultiplier = round(
    recoverySector
      ? clamp(
          (1 + progress * 0.0015 + tierIndex * 0.1) * 0.9,
          1,
          2.2,
        )
      : clamp(1 + progress * 0.0015 + tierIndex * 0.1, 1, 2.2),
  );

  const hazardIntensity = round(
    recoverySector
      ? clamp(
          (0.12 + progress * 0.001 + tierIndex * 0.12) * 0.7,
          0.1,
          1,
        )
      : clamp(0.12 + progress * 0.001 + tierIndex * 0.12, 0.1, 1),
  );

  const statMultiplier = round(
    clamp(
      1 + logarithmicPressure * 0.08 + progress * 0.0008,
      1,
      2.5,
    ),
  );

  const resourceMultiplier = round(
    clamp(1.2 + logarithmicPressure * 0.12 + tierIndex * 0.15, 1.2, 3),
  );

  const rewardTier = clamp(
    1 + tierIndex + (milestone ? 1 : 0),
    1,
    5,
  ) as 1 | 2 | 3 | 4 | 5;

  const waveCount = clamp(
    3 + tierIndex + (milestone ? 1 : 0),
    3,
    7,
  );

  const projectileBudget = clamp(
    Math.round(80 + progress * 0.22 + tierIndex * 12),
    80,
    240,
  );

  return {
    sector,
    seed,
    recipeId: `sector-${sector}-${numericSeed.toString(16).padStart(8, "0")}`,
    tier,
    biome,
    waveCount,
    enemyBudget,
    maxConcurrentEnemies,
    spawnIntervalFrames,
    enemyComposition,
    eliteChance,
    mutators,
    aggressionMultiplier,
    projectileDensityMultiplier,
    hazardIntensity,
    statMultiplier,
    resourceMultiplier,
    rewardTier,
    recoverySector,
    milestone,
    fairness: {
      minTelegraphMs: 900,
      maxSimultaneousHardControlSources: 2,
      spawnSafetyRadius: 120,
      projectileBudget,
    },
  };
};
