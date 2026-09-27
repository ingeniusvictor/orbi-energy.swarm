import { EnemyType } from "./types";
import type {
  InfiniteMutator,
  InfiniteSectorRecipe,
} from "./infiniteSectorDirector";

export interface InfiniteWaveRecipe {
  sector: number;
  waveIndex: number;
  waveCount: number;
  id: string;
  enemyBudget: number;
  maxConcurrentEnemies: number;
  spawnIntervalFrames: number;
  enemyComposition: EnemyType[];
  eliteChance: number;
  activeMutators: InfiniteMutator[];
  aggressionMultiplier: number;
  projectileDensityMultiplier: number;
  hazardIntensity: number;
  statMultiplier: number;
  resourceMultiplier: number;
  milestone: InfiniteSectorRecipe["milestone"];
  fairness: InfiniteSectorRecipe["fairness"];
}

export interface InfiniteWavePlanValidation {
  valid: boolean;
  errors: string[];
}

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

const deterministicOrder = <T>(
  source: readonly T[],
  seedText: string,
): T[] => {
  const random = createSeededRandom(hashString(seedText));
  const result = [...source];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const allocateBudgets = (
  totalBudget: number,
  waveCount: number,
  hasMilestone: boolean,
) => {
  const weights = Array.from({ length: waveCount }, (_, index) => {
    const normalized = waveCount === 1 ? 1 : index / (waveCount - 1);
    const milestoneBoost =
      hasMilestone && index === waveCount - 1 ? 0.22 : 0;
    return 0.82 + normalized * 0.36 + milestoneBoost;
  });

  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  const budgets = weights.map((weight) =>
    Math.max(1, Math.floor((totalBudget * weight) / totalWeight)),
  );

  let allocated = budgets.reduce((sum, value) => sum + value, 0);
  let cursor = waveCount - 1;

  while (allocated < totalBudget) {
    budgets[cursor] += 1;
    allocated += 1;
    cursor -= 1;
    if (cursor < 0) cursor = waveCount - 1;
  }

  while (allocated > totalBudget) {
    if (budgets[cursor] > 1) {
      budgets[cursor] -= 1;
      allocated -= 1;
    }
    cursor -= 1;
    if (cursor < 0) cursor = waveCount - 1;
  }

  return budgets;
};

export const expandInfiniteSectorWaves = (
  sectorRecipe: InfiniteSectorRecipe,
): InfiniteWaveRecipe[] => {
  const waveCount = sectorRecipe.waveCount;
  const budgets = allocateBudgets(
    sectorRecipe.enemyBudget,
    waveCount,
    Boolean(sectorRecipe.milestone),
  );

  const orderedEnemies = deterministicOrder(
    sectorRecipe.enemyComposition,
    `${sectorRecipe.recipeId}:enemies`,
  );
  const orderedMutators = deterministicOrder(
    sectorRecipe.mutators,
    `${sectorRecipe.recipeId}:mutators`,
  );

  return Array.from({ length: waveCount }, (_, index) => {
    const waveIndex = index + 1;
    const progress = waveCount === 1 ? 1 : index / (waveCount - 1);
    const finalWave = waveIndex === waveCount;

    const compositionCount = Math.min(
      orderedEnemies.length,
      Math.max(
        2,
        Math.round(2 + progress * Math.max(0, orderedEnemies.length - 2)),
      ),
    );

    const mutatorCount = Math.min(
      orderedMutators.length,
      Math.max(
        1,
        Math.ceil(progress * orderedMutators.length),
      ),
    );

    const earlyCadenceRelief = Math.round((1 - progress) * 14);
    const earlyConcurrencyRelief = Math.round((1 - progress) * 4);

    return {
      sector: sectorRecipe.sector,
      waveIndex,
      waveCount,
      id: `${sectorRecipe.recipeId}:wave-${waveIndex}`,
      enemyBudget: budgets[index],
      maxConcurrentEnemies: Math.max(
        8,
        sectorRecipe.maxConcurrentEnemies - earlyConcurrencyRelief,
      ),
      spawnIntervalFrames:
        sectorRecipe.spawnIntervalFrames + earlyCadenceRelief,
      enemyComposition: orderedEnemies.slice(0, compositionCount),
      eliteChance: round(
        sectorRecipe.eliteChance * (0.72 + progress * 0.28),
      ),
      activeMutators: orderedMutators.slice(0, mutatorCount),
      aggressionMultiplier: round(
        1 +
          (sectorRecipe.aggressionMultiplier - 1) *
            (0.65 + progress * 0.35),
      ),
      projectileDensityMultiplier: round(
        1 +
          (sectorRecipe.projectileDensityMultiplier - 1) *
            (0.65 + progress * 0.35),
      ),
      hazardIntensity: round(
        sectorRecipe.hazardIntensity * (0.7 + progress * 0.3),
      ),
      statMultiplier: round(
        1 +
          (sectorRecipe.statMultiplier - 1) *
            (0.75 + progress * 0.25),
      ),
      resourceMultiplier: sectorRecipe.resourceMultiplier,
      milestone: finalWave ? sectorRecipe.milestone : null,
      fairness: { ...sectorRecipe.fairness },
    };
  });
};

export const validateInfiniteWavePlan = (
  sectorRecipe: InfiniteSectorRecipe,
  waves: readonly InfiniteWaveRecipe[],
): InfiniteWavePlanValidation => {
  const errors: string[] = [];

  if (waves.length !== sectorRecipe.waveCount) {
    errors.push("waveCount");
  }

  const totalBudget = waves.reduce(
    (sum, wave) => sum + wave.enemyBudget,
    0,
  );
  if (totalBudget !== sectorRecipe.enemyBudget) {
    errors.push("enemyBudgetTotal");
  }

  const ids = new Set(waves.map((wave) => wave.id));
  if (ids.size !== waves.length) {
    errors.push("waveIds");
  }

  const allowedEnemies = new Set(sectorRecipe.enemyComposition);
  const allowedMutators = new Set(sectorRecipe.mutators);

  waves.forEach((wave, index) => {
    if (
      wave.sector !== sectorRecipe.sector ||
      wave.waveIndex !== index + 1 ||
      wave.waveCount !== sectorRecipe.waveCount
    ) {
      errors.push(`waveIdentity:${index + 1}`);
    }

    if (wave.enemyBudget < 1) {
      errors.push(`enemyBudget:${index + 1}`);
    }

    if (
      wave.maxConcurrentEnemies < 8 ||
      wave.maxConcurrentEnemies > sectorRecipe.maxConcurrentEnemies
    ) {
      errors.push(`maxConcurrentEnemies:${index + 1}`);
    }

    if (
      wave.spawnIntervalFrames < sectorRecipe.spawnIntervalFrames ||
      wave.spawnIntervalFrames > Math.min(120, sectorRecipe.spawnIntervalFrames + 14)
    ) {
      errors.push(`spawnIntervalFrames:${index + 1}`);
    }

    if (
      wave.enemyComposition.length < 2 ||
      wave.enemyComposition.some(
        (enemy) =>
          enemy === EnemyType.BOSS_DEVOURER || !allowedEnemies.has(enemy),
      ) ||
      new Set(wave.enemyComposition).size !==
        wave.enemyComposition.length
    ) {
      errors.push(`enemyComposition:${index + 1}`);
    }

    if (
      wave.activeMutators.length < 1 ||
      wave.activeMutators.some((mutator) => !allowedMutators.has(mutator)) ||
      new Set(wave.activeMutators).size !==
        wave.activeMutators.length
    ) {
      errors.push(`activeMutators:${index + 1}`);
    }

    if (
      wave.eliteChance < 0 ||
      wave.eliteChance > sectorRecipe.eliteChance
    ) {
      errors.push(`eliteChance:${index + 1}`);
    }

    if (
      wave.aggressionMultiplier < 1 ||
      wave.aggressionMultiplier > sectorRecipe.aggressionMultiplier
    ) {
      errors.push(`aggressionMultiplier:${index + 1}`);
    }

    if (
      wave.projectileDensityMultiplier < 1 ||
      wave.projectileDensityMultiplier >
        sectorRecipe.projectileDensityMultiplier
    ) {
      errors.push(`projectileDensityMultiplier:${index + 1}`);
    }

    if (
      wave.hazardIntensity < 0 ||
      wave.hazardIntensity > sectorRecipe.hazardIntensity
    ) {
      errors.push(`hazardIntensity:${index + 1}`);
    }

    if (
      wave.statMultiplier < 1 ||
      wave.statMultiplier > sectorRecipe.statMultiplier
    ) {
      errors.push(`statMultiplier:${index + 1}`);
    }

    if (wave.resourceMultiplier !== sectorRecipe.resourceMultiplier) {
      errors.push(`resourceMultiplier:${index + 1}`);
    }

    const shouldHaveMilestone =
      index === waves.length - 1 ? sectorRecipe.milestone : null;

    if (
      JSON.stringify(wave.milestone) !==
      JSON.stringify(shouldHaveMilestone)
    ) {
      errors.push(`milestone:${index + 1}`);
    }

    if (
      wave.fairness.minTelegraphMs !==
        sectorRecipe.fairness.minTelegraphMs ||
      wave.fairness.maxSimultaneousHardControlSources !==
        sectorRecipe.fairness.maxSimultaneousHardControlSources ||
      wave.fairness.spawnSafetyRadius !==
        sectorRecipe.fairness.spawnSafetyRadius ||
      wave.fairness.projectileBudget !==
        sectorRecipe.fairness.projectileBudget
    ) {
      errors.push(`fairness:${index + 1}`);
    }
  });

  const finalWave = waves[waves.length - 1];
  if (finalWave) {
    if (
      finalWave.maxConcurrentEnemies !==
        sectorRecipe.maxConcurrentEnemies ||
      finalWave.spawnIntervalFrames !== sectorRecipe.spawnIntervalFrames ||
      finalWave.eliteChance !== sectorRecipe.eliteChance ||
      finalWave.aggressionMultiplier !==
        sectorRecipe.aggressionMultiplier ||
      finalWave.projectileDensityMultiplier !==
        sectorRecipe.projectileDensityMultiplier ||
      finalWave.hazardIntensity !== sectorRecipe.hazardIntensity ||
      finalWave.statMultiplier !== sectorRecipe.statMultiplier ||
      finalWave.enemyComposition.length !==
        sectorRecipe.enemyComposition.length ||
      finalWave.activeMutators.length !== sectorRecipe.mutators.length
    ) {
      errors.push("finalWavePressure");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
