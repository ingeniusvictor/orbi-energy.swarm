import { EnemyType, type BiomeType } from "./types";
import type { InfiniteSectorRecipe } from "./infiniteSectorDirector";
import type { InfiniteWaveRecipe } from "./infiniteWaveDirector";

export type InfiniteCompletionPolicy = "BUDGET_AND_CLEAR";

export interface InfiniteWaveExecutionPlan {
  kind: "INFINITE_WAVE";
  sector: number;
  waveIndex: number;
  waveCount: number;
  executionId: string;
  sourceRecipeId: string;
  sourceWaveId: string;
  seed: string;
  biome: BiomeType;
  completionPolicy: InfiniteCompletionPolicy;
  spawn: {
    enemyBudget: number;
    maxConcurrentEnemies: number;
    spawnIntervalFrames: number;
    enemyComposition: EnemyType[];
    eliteChance: number;
  };
  pressure: {
    aggressionMultiplier: number;
    projectileDensityMultiplier: number;
    hazardIntensity: number;
    statMultiplier: number;
  };
  mutators: InfiniteWaveRecipe["activeMutators"];
  rewards: {
    resourceMultiplier: number;
    rewardTier: InfiniteSectorRecipe["rewardTier"];
  };
  milestone: InfiniteWaveRecipe["milestone"];
  fairness: InfiniteWaveRecipe["fairness"];
}

export interface InfiniteExecutionPlanValidation {
  valid: boolean;
  errors: string[];
}

export const createInfiniteWaveExecutionPlan = (
  sectorRecipe: InfiniteSectorRecipe,
  waveRecipe: InfiniteWaveRecipe,
): InfiniteWaveExecutionPlan => {
  if (waveRecipe.sector !== sectorRecipe.sector) {
    throw new RangeError("Wave recipe does not belong to the supplied sector recipe.");
  }

  return {
    kind: "INFINITE_WAVE",
    sector: sectorRecipe.sector,
    waveIndex: waveRecipe.waveIndex,
    waveCount: waveRecipe.waveCount,
    executionId: `${waveRecipe.id}:execution`,
    sourceRecipeId: sectorRecipe.recipeId,
    sourceWaveId: waveRecipe.id,
    seed: sectorRecipe.seed,
    biome: sectorRecipe.biome,
    completionPolicy: "BUDGET_AND_CLEAR",
    spawn: {
      enemyBudget: waveRecipe.enemyBudget,
      maxConcurrentEnemies: waveRecipe.maxConcurrentEnemies,
      spawnIntervalFrames: waveRecipe.spawnIntervalFrames,
      enemyComposition: [...waveRecipe.enemyComposition],
      eliteChance: waveRecipe.eliteChance,
    },
    pressure: {
      aggressionMultiplier: waveRecipe.aggressionMultiplier,
      projectileDensityMultiplier: waveRecipe.projectileDensityMultiplier,
      hazardIntensity: waveRecipe.hazardIntensity,
      statMultiplier: waveRecipe.statMultiplier,
    },
    mutators: [...waveRecipe.activeMutators],
    rewards: {
      resourceMultiplier: waveRecipe.resourceMultiplier,
      rewardTier: sectorRecipe.rewardTier,
    },
    milestone: waveRecipe.milestone
      ? { ...waveRecipe.milestone }
      : null,
    fairness: { ...waveRecipe.fairness },
  };
};

export const validateInfiniteWaveExecutionPlan = (
  sectorRecipe: InfiniteSectorRecipe,
  waveRecipe: InfiniteWaveRecipe,
  plan: InfiniteWaveExecutionPlan,
): InfiniteExecutionPlanValidation => {
  const errors: string[] = [];

  if (
    plan.kind !== "INFINITE_WAVE" ||
    plan.completionPolicy !== "BUDGET_AND_CLEAR"
  ) {
    errors.push("executionPolicy");
  }

  if (
    plan.sector !== sectorRecipe.sector ||
    plan.waveIndex !== waveRecipe.waveIndex ||
    plan.waveCount !== waveRecipe.waveCount
  ) {
    errors.push("identity");
  }

  if (
    plan.sourceRecipeId !== sectorRecipe.recipeId ||
    plan.sourceWaveId !== waveRecipe.id ||
    plan.seed !== sectorRecipe.seed ||
    plan.executionId !== `${waveRecipe.id}:execution`
  ) {
    errors.push("traceability");
  }

  if (plan.biome !== sectorRecipe.biome) {
    errors.push("biome");
  }

  if (
    plan.spawn.enemyBudget !== waveRecipe.enemyBudget ||
    plan.spawn.maxConcurrentEnemies !== waveRecipe.maxConcurrentEnemies ||
    plan.spawn.spawnIntervalFrames !== waveRecipe.spawnIntervalFrames ||
    plan.spawn.eliteChance !== waveRecipe.eliteChance
  ) {
    errors.push("spawn");
  }

  if (
    plan.spawn.enemyComposition.length !==
      waveRecipe.enemyComposition.length ||
    plan.spawn.enemyComposition.some(
      (enemy, index) =>
        enemy !== waveRecipe.enemyComposition[index] ||
        enemy === EnemyType.BOSS_DEVOURER,
    )
  ) {
    errors.push("enemyComposition");
  }

  if (
    plan.pressure.aggressionMultiplier !==
      waveRecipe.aggressionMultiplier ||
    plan.pressure.projectileDensityMultiplier !==
      waveRecipe.projectileDensityMultiplier ||
    plan.pressure.hazardIntensity !== waveRecipe.hazardIntensity ||
    plan.pressure.statMultiplier !== waveRecipe.statMultiplier
  ) {
    errors.push("pressure");
  }

  if (
    plan.mutators.length !== waveRecipe.activeMutators.length ||
    plan.mutators.some(
      (mutator, index) =>
        mutator !== waveRecipe.activeMutators[index],
    )
  ) {
    errors.push("mutators");
  }

  if (
    plan.rewards.resourceMultiplier !== waveRecipe.resourceMultiplier ||
    plan.rewards.rewardTier !== sectorRecipe.rewardTier
  ) {
    errors.push("rewards");
  }

  if (
    JSON.stringify(plan.milestone) !==
      JSON.stringify(waveRecipe.milestone)
  ) {
    errors.push("milestone");
  }

  if (
    plan.fairness.minTelegraphMs !==
      waveRecipe.fairness.minTelegraphMs ||
    plan.fairness.maxSimultaneousHardControlSources !==
      waveRecipe.fairness.maxSimultaneousHardControlSources ||
    plan.fairness.spawnSafetyRadius !==
      waveRecipe.fairness.spawnSafetyRadius ||
    plan.fairness.projectileBudget !==
      waveRecipe.fairness.projectileBudget
  ) {
    errors.push("fairness");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
