import type { InfiniteSectorRecipe } from "./infiniteSectorDirector";
import { validateInfiniteSectorRecipe } from "./infiniteSectorDirector";

export interface InfiniteRunContext {
  swarmStrength: number;
  shieldIntegrity: number;
  buildPower: number;
  recentDamagePressure: number;
  recentClearEfficiency: number;
}

export interface NormalizedInfiniteRunContext extends InfiniteRunContext {}

export interface InfiniteContextModulation {
  pressureDelta: number;
  performanceScore: number;
  contextFingerprint: string;
}

export interface ContextualInfiniteSectorRecipe extends InfiniteSectorRecipe {
  baselineRecipeId: string;
  context: NormalizedInfiniteRunContext;
  contextModulation: InfiniteContextModulation;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const round = (value: number, digits = 3) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const normalizeSignal = (value: number) => {
  if (!Number.isFinite(value)) {
    throw new RangeError("Run-context signals must be finite numbers.");
  }
  return round(clamp(value, 0, 1));
};

export const normalizeInfiniteRunContext = (
  context: InfiniteRunContext,
): NormalizedInfiniteRunContext => ({
  swarmStrength: normalizeSignal(context.swarmStrength),
  shieldIntegrity: normalizeSignal(context.shieldIntegrity),
  buildPower: normalizeSignal(context.buildPower),
  recentDamagePressure: normalizeSignal(context.recentDamagePressure),
  recentClearEfficiency: normalizeSignal(context.recentClearEfficiency),
});

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const fingerprintContext = (
  context: NormalizedInfiniteRunContext,
) => {
  const canonical = [
    context.swarmStrength,
    context.shieldIntegrity,
    context.buildPower,
    context.recentDamagePressure,
    context.recentClearEfficiency,
  ].map((value) => value.toFixed(3)).join(":");

  return hashString(canonical).toString(16).padStart(8, "0");
};

export const getInfiniteContextModulation = (
  context: InfiniteRunContext,
): InfiniteContextModulation & {
  normalizedContext: NormalizedInfiniteRunContext;
} => {
  const normalizedContext = normalizeInfiniteRunContext(context);

  const positivePerformance =
    (
      normalizedContext.swarmStrength +
      normalizedContext.shieldIntegrity +
      normalizedContext.buildPower +
      normalizedContext.recentClearEfficiency
    ) / 4;

  const centeredPerformance = positivePerformance - 0.5;
  const centeredStress =
    normalizedContext.recentDamagePressure - 0.5;

  const performanceScore = round(
    clamp(
      centeredPerformance - centeredStress * 0.5,
      -0.75,
      0.75,
    ),
  );

  const pressureDelta = round(
    clamp(performanceScore * 0.12, -0.08, 0.08),
  );

  return {
    normalizedContext,
    performanceScore,
    pressureDelta,
    contextFingerprint: fingerprintContext(normalizedContext),
  };
};

export const applyInfiniteRunContext = (
  baseline: InfiniteSectorRecipe,
  context: InfiniteRunContext,
): ContextualInfiniteSectorRecipe => {
  const baselineValidation = validateInfiniteSectorRecipe(baseline);
  if (!baselineValidation.valid) {
    throw new RangeError(
      `Cannot modulate an invalid baseline recipe: ${baselineValidation.errors.join(", ")}`,
    );
  }

  const {
    normalizedContext,
    performanceScore,
    pressureDelta,
    contextFingerprint,
  } = getInfiniteContextModulation(context);

  const enemyBudget = clamp(
    Math.round(baseline.enemyBudget * (1 + pressureDelta)),
    28,
    180,
  );

  const maxConcurrentEnemies = clamp(
    baseline.maxConcurrentEnemies +
      Math.round(pressureDelta * 20),
    14,
    36,
  );

  const spawnIntervalFrames = clamp(
    Math.round(
      baseline.spawnIntervalFrames *
        (1 - pressureDelta * 0.35),
    ),
    42,
    105,
  );

  const eliteChance = round(
    clamp(
      baseline.eliteChance + pressureDelta * 0.25,
      0.08,
      0.55,
    ),
  );

  const aggressionMultiplier = round(
    clamp(
      baseline.aggressionMultiplier *
        (1 + pressureDelta * 0.3),
      1,
      2,
    ),
  );

  const projectileDensityMultiplier = round(
    clamp(
      baseline.projectileDensityMultiplier *
        (1 + pressureDelta * 0.25),
      1,
      2.2,
    ),
  );

  const hazardIntensity = round(
    clamp(
      baseline.hazardIntensity * (1 + pressureDelta * 0.25),
      0.1,
      1,
    ),
  );

  const statMultiplier = round(
    clamp(
      baseline.statMultiplier * (1 + pressureDelta * 0.12),
      1,
      2.5,
    ),
  );

  const contextual: ContextualInfiniteSectorRecipe = {
    ...baseline,
    recipeId: `${baseline.recipeId}:ctx-${contextFingerprint}`,
    enemyComposition: [...baseline.enemyComposition],
    mutators: [...baseline.mutators],
    fairness: { ...baseline.fairness },
    milestone: baseline.milestone ? { ...baseline.milestone } : null,
    enemyBudget,
    maxConcurrentEnemies,
    spawnIntervalFrames,
    eliteChance,
    aggressionMultiplier,
    projectileDensityMultiplier,
    hazardIntensity,
    statMultiplier,
    baselineRecipeId: baseline.recipeId,
    context: normalizedContext,
    contextModulation: {
      pressureDelta,
      performanceScore,
      contextFingerprint,
    },
  };

  const contextualValidation =
    validateInfiniteSectorRecipe(contextual);

  if (!contextualValidation.valid) {
    throw new RangeError(
      `Context modulation produced an invalid recipe: ${contextualValidation.errors.join(", ")}`,
    );
  }

  return contextual;
};
