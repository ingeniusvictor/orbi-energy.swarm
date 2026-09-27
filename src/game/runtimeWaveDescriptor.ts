import {
  BOSS_WAVE_NUMBER,
  BLACKOUT_DEVOURER_CANON,
  getWaveConfig,
} from "./waveDirector";
import type {
  BiomeType,
  EnemyType,
  FormationType,
  WaveConfig,
} from "./types";
import {
  getCurrentInfiniteExecutionPlan,
  type InfiniteSessionState,
} from "./infiniteSession";

export type RuntimeWaveSourceMode = "CAMPAIGN" | "INFINITE";

export type RuntimeWaveCompletionPolicy =
  | { type: "TIMEBOX"; durationMs: number }
  | { type: "BOSS_DEFEAT" }
  | { type: "BUDGET_AND_CLEAR" };

export interface RuntimeWaveDescriptor {
  sourceMode: RuntimeWaveSourceMode;
  descriptorId: string;
  sector: number;
  waveNumber: number;
  waveCount: number;
  display: {
    name: string;
    displayName: string;
    subtitle: string;
    description: string;
    tacticalAdvice: string;
    warningLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    accentColor: string;
    recommendedFormation: FormationType | null;
  };
  completionPolicy: RuntimeWaveCompletionPolicy;
  biomeIntent: BiomeType | null;
  spawn: {
    enemyBudget: number;
    maxConcurrentEnemies: number;
    spawnIntervalFrames: number;
    enemyComposition: EnemyType[];
    eliteChance: number;
  };
  modifiers: string[];
  pressure: {
    legacyDifficultyMultiplier: number | null;
    aggressionMultiplier: number;
    projectileDensityMultiplier: number;
    hazardIntensity: number;
    statMultiplier: number;
  };
  rewards: {
    resourceMultiplier: number;
    rewardTier: number | null;
  };
  milestone:
    | {
        kind: "CAMPAIGN_BOSS" | "MINIBOSS" | "BOSS_REMATCH";
        id: string;
      }
    | null;
  fairness:
    | {
        minTelegraphMs: number;
        maxSimultaneousHardControlSources: number;
        spawnSafetyRadius: number;
        projectileBudget: number;
      }
    | null;
  source: {
    campaignWaveId: string | null;
    recipeId: string | null;
    waveId: string | null;
    seed: string | null;
  };
}

export const createCampaignRuntimeWaveDescriptor = (
  waveNumber: number,
): RuntimeWaveDescriptor => {
  if (
    !Number.isInteger(waveNumber) ||
    waveNumber < 1 ||
    waveNumber > BOSS_WAVE_NUMBER
  ) {
    throw new RangeError("Campaign runtime waves are limited to Sectors 1–10.");
  }

  const cfg = getWaveConfig(waveNumber);
  const bossWave = cfg.waveNumber === BOSS_WAVE_NUMBER;

  return {
    sourceMode: "CAMPAIGN",
    descriptorId: `campaign:${cfg.id}`,
    sector: cfg.waveNumber,
    waveNumber: cfg.waveNumber,
    waveCount: BOSS_WAVE_NUMBER,
    display: {
      name: cfg.name,
      displayName: cfg.displayName,
      subtitle: cfg.subtitle,
      description: cfg.description,
      tacticalAdvice: cfg.tacticalAdvice,
      warningLevel: cfg.warningLevel,
      accentColor: cfg.introColor,
      recommendedFormation: cfg.recommendedFormation ?? null,
    },
    completionPolicy: bossWave
      ? { type: "BOSS_DEFEAT" }
      : { type: "TIMEBOX", durationMs: cfg.duration },
    biomeIntent: null,
    spawn: {
      enemyBudget: cfg.enemyBudget,
      maxConcurrentEnemies: cfg.maxConcurrentEnemies,
      spawnIntervalFrames: cfg.spawnInterval,
      enemyComposition: [...cfg.enemyComposition],
      eliteChance: cfg.eliteChance,
    },
    modifiers: cfg.environmentalModifier
      ? [cfg.environmentalModifier]
      : [],
    pressure: {
      legacyDifficultyMultiplier: cfg.difficultyMultiplier,
      aggressionMultiplier: 1,
      projectileDensityMultiplier: 1,
      hazardIntensity: cfg.environmentalModifier ? 1 : 0,
      statMultiplier: 1,
    },
    rewards: {
      resourceMultiplier: cfg.resourceMultiplier,
      rewardTier: null,
    },
    milestone: bossWave
      ? {
          kind: "CAMPAIGN_BOSS",
          id: BLACKOUT_DEVOURER_CANON.id,
        }
      : null,
    fairness: null,
    source: {
      campaignWaveId: cfg.id,
      recipeId: null,
      waveId: null,
      seed: null,
    },
  };
};

const infiniteWarningLevel = (
  session: InfiniteSessionState,
): RuntimeWaveDescriptor["display"]["warningLevel"] => {
  switch (session.currentPlan.effectiveRecipe.tier) {
    case "MASTERY":
      return "MEDIUM";
    case "ADVANCED_COMBINATION":
      return "HIGH";
    case "HIGH_PRESSURE":
    case "ENDLESS_ENDGAME":
      return "CRITICAL";
  }
};

const humanize = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const createInfiniteRuntimeWaveDescriptor = (
  session: InfiniteSessionState,
): RuntimeWaveDescriptor => {
  const execution = getCurrentInfiniteExecutionPlan(session);
  const effective = session.currentPlan.effectiveRecipe;
  const milestone = execution.milestone;

  return {
    sourceMode: "INFINITE",
    descriptorId: `infinite:${execution.executionId}`,
    sector: execution.sector,
    waveNumber: execution.waveIndex,
    waveCount: execution.waveCount,
    display: {
      name: `Infinite Sector ${execution.sector} · Wave ${execution.waveIndex}/${execution.waveCount}`,
      displayName: `Infinite Sector ${execution.sector} · Wave ${execution.waveIndex}/${execution.waveCount}`,
      subtitle: humanize(effective.tier),
      description:
        execution.mutators.length > 0
          ? `Active modifiers: ${execution.mutators.map(humanize).join(", ")}.`
          : "No active modifiers.",
      tacticalAdvice:
        "Adapt formation and movement to the active threat mix while preserving swarm integrity.",
      warningLevel: infiniteWarningLevel(session),
      accentColor:
        effective.tier === "MASTERY"
          ? "#22d3ee"
          : effective.tier === "ADVANCED_COMBINATION"
            ? "#a78bfa"
            : effective.tier === "HIGH_PRESSURE"
              ? "#fb7185"
              : "#f43f5e",
      recommendedFormation: null,
    },
    completionPolicy: { type: "BUDGET_AND_CLEAR" },
    biomeIntent: execution.biome,
    spawn: {
      enemyBudget: execution.spawn.enemyBudget,
      maxConcurrentEnemies: execution.spawn.maxConcurrentEnemies,
      spawnIntervalFrames: execution.spawn.spawnIntervalFrames,
      enemyComposition: [...execution.spawn.enemyComposition],
      eliteChance: execution.spawn.eliteChance,
    },
    modifiers: [...execution.mutators],
    pressure: {
      legacyDifficultyMultiplier: null,
      aggressionMultiplier: execution.pressure.aggressionMultiplier,
      projectileDensityMultiplier:
        execution.pressure.projectileDensityMultiplier,
      hazardIntensity: execution.pressure.hazardIntensity,
      statMultiplier: execution.pressure.statMultiplier,
    },
    rewards: {
      resourceMultiplier: execution.rewards.resourceMultiplier,
      rewardTier: execution.rewards.rewardTier,
    },
    milestone: milestone
      ? {
          kind: milestone.kind,
          id: milestone.id,
        }
      : null,
    fairness: { ...execution.fairness },
    source: {
      campaignWaveId: null,
      recipeId: execution.sourceRecipeId,
      waveId: execution.sourceWaveId,
      seed: execution.seed,
    },
  };
};

export const campaignDescriptorMatchesWaveConfig = (
  descriptor: RuntimeWaveDescriptor,
  cfg: WaveConfig,
) => {
  const expectedPolicy =
    cfg.waveNumber === BOSS_WAVE_NUMBER
      ? "BOSS_DEFEAT"
      : "TIMEBOX";

  return (
    descriptor.sourceMode === "CAMPAIGN" &&
    descriptor.sector === cfg.waveNumber &&
    descriptor.waveNumber === cfg.waveNumber &&
    descriptor.display.name === cfg.name &&
    descriptor.display.displayName === cfg.displayName &&
    descriptor.display.subtitle === cfg.subtitle &&
    descriptor.display.description === cfg.description &&
    descriptor.display.tacticalAdvice === cfg.tacticalAdvice &&
    descriptor.display.warningLevel === cfg.warningLevel &&
    descriptor.display.accentColor === cfg.introColor &&
    descriptor.display.recommendedFormation ===
      (cfg.recommendedFormation ?? null) &&
    descriptor.completionPolicy.type === expectedPolicy &&
    (
      expectedPolicy !== "TIMEBOX" ||
      (
        descriptor.completionPolicy.type === "TIMEBOX" &&
        descriptor.completionPolicy.durationMs === cfg.duration
      )
    ) &&
    descriptor.spawn.enemyBudget === cfg.enemyBudget &&
    descriptor.spawn.maxConcurrentEnemies ===
      cfg.maxConcurrentEnemies &&
    descriptor.spawn.spawnIntervalFrames === cfg.spawnInterval &&
    descriptor.spawn.eliteChance === cfg.eliteChance &&
    descriptor.spawn.enemyComposition.length ===
      cfg.enemyComposition.length &&
    descriptor.spawn.enemyComposition.every(
      (enemy, index) => enemy === cfg.enemyComposition[index],
    ) &&
    descriptor.rewards.resourceMultiplier ===
      cfg.resourceMultiplier &&
    descriptor.pressure.legacyDifficultyMultiplier ===
      cfg.difficultyMultiplier &&
    descriptor.source.campaignWaveId === cfg.id
  );
};


export const infiniteDescriptorMatchesSession = (
  descriptor: RuntimeWaveDescriptor,
  session: InfiniteSessionState,
) => {
  const execution = getCurrentInfiniteExecutionPlan(session);
  const milestone = execution.milestone;

  return (
    descriptor.sourceMode === "INFINITE" &&
    descriptor.sector === execution.sector &&
    descriptor.waveNumber === execution.waveIndex &&
    descriptor.waveCount === execution.waveCount &&
    descriptor.completionPolicy.type === "BUDGET_AND_CLEAR" &&
    descriptor.biomeIntent === execution.biome &&
    descriptor.spawn.enemyBudget === execution.spawn.enemyBudget &&
    descriptor.spawn.maxConcurrentEnemies ===
      execution.spawn.maxConcurrentEnemies &&
    descriptor.spawn.spawnIntervalFrames ===
      execution.spawn.spawnIntervalFrames &&
    descriptor.spawn.eliteChance === execution.spawn.eliteChance &&
    descriptor.spawn.enemyComposition.length ===
      execution.spawn.enemyComposition.length &&
    descriptor.spawn.enemyComposition.every(
      (enemy, index) =>
        enemy === execution.spawn.enemyComposition[index],
    ) &&
    descriptor.modifiers.length === execution.mutators.length &&
    descriptor.modifiers.every(
      (modifier, index) => modifier === execution.mutators[index],
    ) &&
    descriptor.pressure.legacyDifficultyMultiplier === null &&
    descriptor.pressure.aggressionMultiplier ===
      execution.pressure.aggressionMultiplier &&
    descriptor.pressure.projectileDensityMultiplier ===
      execution.pressure.projectileDensityMultiplier &&
    descriptor.pressure.hazardIntensity ===
      execution.pressure.hazardIntensity &&
    descriptor.pressure.statMultiplier ===
      execution.pressure.statMultiplier &&
    descriptor.rewards.resourceMultiplier ===
      execution.rewards.resourceMultiplier &&
    descriptor.rewards.rewardTier === execution.rewards.rewardTier &&
    JSON.stringify(descriptor.milestone) ===
      JSON.stringify(
        milestone
          ? { kind: milestone.kind, id: milestone.id }
          : null,
      ) &&
    JSON.stringify(descriptor.fairness) ===
      JSON.stringify(execution.fairness) &&
    descriptor.source.recipeId === execution.sourceRecipeId &&
    descriptor.source.waveId === execution.sourceWaveId &&
    descriptor.source.seed === execution.seed
  );
};
