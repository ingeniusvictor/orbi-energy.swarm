import {
  generateInfiniteSectorRecipe,
  validateInfiniteSectorRecipe,
  type InfiniteSectorRecipe,
} from "./infiniteSectorDirector";
import {
  applyInfiniteRunContext,
  type ContextualInfiniteSectorRecipe,
  type InfiniteRunContext,
} from "./infiniteContextDirector";
import {
  expandInfiniteSectorWaves,
  validateInfiniteWavePlan,
  type InfiniteWaveRecipe,
} from "./infiniteWaveDirector";
import {
  createInfiniteWaveExecutionPlan,
  validateInfiniteWaveExecutionPlan,
  type InfiniteWaveExecutionPlan,
} from "./infiniteExecutionPlan";

export const NEUTRAL_INFINITE_RUN_CONTEXT: InfiniteRunContext = {
  swarmStrength: 0.5,
  shieldIntegrity: 0.5,
  buildPower: 0.5,
  recentDamagePressure: 0.5,
  recentClearEfficiency: 0.5,
};

export interface CertifiedInfiniteSectorPlan {
  kind: "CERTIFIED_INFINITE_SECTOR_PLAN";
  planId: string;
  sector: number;
  seed: string;
  baselineRecipe: InfiniteSectorRecipe;
  effectiveRecipe: ContextualInfiniteSectorRecipe;
  waves: InfiniteWaveRecipe[];
  executionPlans: InfiniteWaveExecutionPlan[];
  certification: {
    baselineValid: true;
    effectiveRecipeValid: true;
    wavePlanValid: true;
    executionPlansValid: true;
    waveCount: number;
    executionPlanCount: number;
    contextFingerprint: string;
    pressureDelta: number;
  };
}

const assertValid = (
  stage: string,
  validation: { valid: boolean; errors: string[] },
) => {
  if (!validation.valid) {
    throw new RangeError(
      `${stage} validation failed: ${validation.errors.join(", ")}`,
    );
  }
};

export const buildCertifiedInfiniteSectorPlan = (
  sector: number,
  seed = "orbi-infinite",
  context: InfiniteRunContext = NEUTRAL_INFINITE_RUN_CONTEXT,
): CertifiedInfiniteSectorPlan => {
  const baselineRecipe = generateInfiniteSectorRecipe(sector, seed);
  const baselineValidation =
    validateInfiniteSectorRecipe(baselineRecipe);
  assertValid("Baseline sector recipe", baselineValidation);

  const effectiveRecipe = applyInfiniteRunContext(
    baselineRecipe,
    context,
  );
  const effectiveValidation =
    validateInfiniteSectorRecipe(effectiveRecipe);
  assertValid("Contextual sector recipe", effectiveValidation);

  const waves = expandInfiniteSectorWaves(effectiveRecipe);
  const waveValidation = validateInfiniteWavePlan(
    effectiveRecipe,
    waves,
  );
  assertValid("Infinite wave plan", waveValidation);

  const executionPlans = waves.map((wave) => {
    const plan = createInfiniteWaveExecutionPlan(
      effectiveRecipe,
      wave,
    );
    const validation = validateInfiniteWaveExecutionPlan(
      effectiveRecipe,
      wave,
      plan,
    );
    assertValid(
      `Infinite execution plan wave ${wave.waveIndex}`,
      validation,
    );
    return plan;
  });

  const contextFingerprint =
    effectiveRecipe.contextModulation.contextFingerprint;
  const pressureDelta =
    effectiveRecipe.contextModulation.pressureDelta;

  return {
    kind: "CERTIFIED_INFINITE_SECTOR_PLAN",
    planId: `${effectiveRecipe.recipeId}:certified-plan`,
    sector,
    seed,
    baselineRecipe,
    effectiveRecipe,
    waves,
    executionPlans,
    certification: {
      baselineValid: true,
      effectiveRecipeValid: true,
      wavePlanValid: true,
      executionPlansValid: true,
      waveCount: waves.length,
      executionPlanCount: executionPlans.length,
      contextFingerprint,
      pressureDelta,
    },
  };
};
