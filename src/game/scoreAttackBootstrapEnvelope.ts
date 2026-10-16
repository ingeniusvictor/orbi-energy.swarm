import { createInfiniteSession } from "./infiniteSession";
import {
  createInfiniteRuntimeState,
  getRuntimeSector,
  getRuntimeWaveNumber,
  type RuntimeProgressionState,
} from "./runtimeProgressionRouter";
import {
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY,
  resolveScoreAttackExecutionSubstrateCompatibility,
} from "./scoreAttackExecutionSubstrateContract";
import {
  SCORE_ATTACK_CANONICAL_SEED,
  SCORE_ATTACK_RUN_RECIPE_VERSION,
  resolveScoreAttackCanonicalRunRecipe,
} from "./scoreAttackRunRecipe";
import {
  SCORE_ATTACK_DURATION_MS,
  resolveScoreAttackTimeboxProjection,
} from "./scoreAttackTimeboxProjection";

export type ScoreAttackBootstrapEnvelopeMode = "BOOTSTRAP_ONLY";
export type ScoreAttackInfiniteRuntimeProgression = Extract<
  RuntimeProgressionState,
  { mode: "INFINITE" }
>;

export interface ScoreAttackBootstrapEnvelope {
  readonly kind: "SCORE_ATTACK_BOOTSTRAP_ENVELOPE";
  readonly bootstrapMode: ScoreAttackBootstrapEnvelopeMode;
  readonly modeId: "SCORE_ATTACK";
  readonly recipeVersion: typeof SCORE_ATTACK_RUN_RECIPE_VERSION;
  readonly seed: typeof SCORE_ATTACK_CANONICAL_SEED;
  readonly runtimeProgressionMode: "INFINITE";
  readonly runtimeProgression: ScoreAttackInfiniteRuntimeProgression;
  readonly canonicalFreshStart: typeof SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY.canonicalFreshStart;
  readonly completionType: "TIMEBOX";
  readonly exactDurationMs: typeof SCORE_ATTACK_DURATION_MS;
  readonly preservesCanonicalModeIdentityOutsideRuntimeDiscriminator: true;
  readonly reusesExistingInfiniteSessionConstruction: true;
  readonly reusesExistingRuntimeProgressionConstruction: true;
  readonly returnsFreshRuntimeProgression: true;
  readonly addsRuntimeProgressionDiscriminator: false;
  readonly adoptsLiveRuntime: false;
  readonly writesReactStateOrRefs: false;
  readonly startsOrTicksTimer: false;
  readonly advancesSession: false;
  readonly changesRuntimeDescriptor: false;
  readonly writesPersistence: false;
  readonly writesRunArchive: false;
}

export interface ScoreAttackBootstrapEnvelopeAuthorityContract {
  readonly ownsBootstrapEnvelopeConstructionAuthority: true;
  readonly ownsModeIdentityAuthority: false;
  readonly ownsRunRecipeAuthority: false;
  readonly ownsSeedPolicyAuthority: false;
  readonly ownsExecutionSubstrateCompatibilityAuthority: false;
  readonly ownsSessionConstructionSemanticsAuthority: false;
  readonly ownsRuntimeProgressionConstructionSemanticsAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsProgressionAuthority: false;
  readonly ownsDescriptorMutationAuthority: false;
  readonly ownsExactDurationAuthority: false;
  readonly ownsCompletionProjectionAuthority: false;
  readonly ownsLiveAdoptionAuthority: false;
  readonly ownsTimerAuthority: false;
  readonly ownsClock: false;
  readonly ownsPauseAuthority: false;
  readonly ownsPersistenceAuthority: false;
  readonly ownsStorageWriteAuthority: false;
  readonly ownsRunArchiveAuthority: false;
  readonly ownsGlobalHighScoreAuthority: false;
  readonly ownsStartScreenAuthority: false;
  readonly ownsResultScreenAuthority: false;
  readonly ownsHudAuthority: false;
  readonly ownsScoreMutationAuthority: false;
  readonly ownsScoreFormulaAuthority: false;
  readonly ownsRewardAuthority: false;
  readonly ownsEconomyAuthority: false;
  readonly ownsSpawnAuthority: false;
  readonly ownsArenaAuthority: false;
  readonly ownsEntityCollection: false;
  readonly ownsProjectileCollection: false;
  readonly ownsRandomness: false;
  readonly ownsHashAuthority: false;
  readonly ownsFullArrayScan: false;
  readonly mayLookupEntities: false;
  readonly mayMutateEntities: false;
  readonly mayMutateGlobalCaps: false;
  readonly mayCreateEntities: false;
  readonly mayRemoveEntities: false;
}

export const SCORE_ATTACK_BOOTSTRAP_ENVELOPE_AUTHORITY_CONTRACT: Readonly<ScoreAttackBootstrapEnvelopeAuthorityContract> =
  Object.freeze({
    ownsBootstrapEnvelopeConstructionAuthority: true,
    ownsModeIdentityAuthority: false,
    ownsRunRecipeAuthority: false,
    ownsSeedPolicyAuthority: false,
    ownsExecutionSubstrateCompatibilityAuthority: false,
    ownsSessionConstructionSemanticsAuthority: false,
    ownsRuntimeProgressionConstructionSemanticsAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsProgressionAuthority: false,
    ownsDescriptorMutationAuthority: false,
    ownsExactDurationAuthority: false,
    ownsCompletionProjectionAuthority: false,
    ownsLiveAdoptionAuthority: false,
    ownsTimerAuthority: false,
    ownsClock: false,
    ownsPauseAuthority: false,
    ownsPersistenceAuthority: false,
    ownsStorageWriteAuthority: false,
    ownsRunArchiveAuthority: false,
    ownsGlobalHighScoreAuthority: false,
    ownsStartScreenAuthority: false,
    ownsResultScreenAuthority: false,
    ownsHudAuthority: false,
    ownsScoreMutationAuthority: false,
    ownsScoreFormulaAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
    ownsSpawnAuthority: false,
    ownsArenaAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsRandomness: false,
    ownsHashAuthority: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

export const resolveScoreAttackBootstrapEnvelope = (
  modeId: string,
): Readonly<ScoreAttackBootstrapEnvelope> | null => {
  const recipe = resolveScoreAttackCanonicalRunRecipe(modeId);
  if (
    !recipe ||
    recipe.modeId !== "SCORE_ATTACK" ||
    recipe.recipeVersion !== SCORE_ATTACK_RUN_RECIPE_VERSION ||
    recipe.seed !== SCORE_ATTACK_CANONICAL_SEED ||
    recipe.runtimeProgressionCompatibility !== "INFINITE" ||
    recipe.exactDurationMs !== SCORE_ATTACK_DURATION_MS ||
    recipe.completionType !== "TIMEBOX"
  ) {
    return null;
  }

  const session = createInfiniteSession(recipe.seed, recipe.context);
  const substrateCompatibility =
    resolveScoreAttackExecutionSubstrateCompatibility(modeId, session);
  if (
    !substrateCompatibility ||
    substrateCompatibility !== SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY
  ) {
    return null;
  }

  const timeboxProjection = resolveScoreAttackTimeboxProjection(modeId, session);
  if (
    !timeboxProjection ||
    timeboxProjection.exactDurationMs !== SCORE_ATTACK_DURATION_MS ||
    timeboxProjection.completionProjection.type !== "TIMEBOX" ||
    timeboxProjection.completionProjection.durationMs !== SCORE_ATTACK_DURATION_MS
  ) {
    return null;
  }

  const runtimeProgression = createInfiniteRuntimeState(session);
  if (
    runtimeProgression.mode !== "INFINITE" ||
    runtimeProgression.session !== session ||
    getRuntimeSector(runtimeProgression) !==
      substrateCompatibility.canonicalFreshStart.sector ||
    getRuntimeWaveNumber(runtimeProgression) !==
      substrateCompatibility.canonicalFreshStart.wave
  ) {
    return null;
  }

  return Object.freeze({
    kind: "SCORE_ATTACK_BOOTSTRAP_ENVELOPE",
    bootstrapMode: "BOOTSTRAP_ONLY",
    modeId: recipe.modeId,
    recipeVersion: recipe.recipeVersion,
    seed: recipe.seed,
    runtimeProgressionMode: runtimeProgression.mode,
    runtimeProgression,
    canonicalFreshStart: substrateCompatibility.canonicalFreshStart,
    completionType: timeboxProjection.completionProjection.type,
    exactDurationMs: timeboxProjection.exactDurationMs,
    preservesCanonicalModeIdentityOutsideRuntimeDiscriminator: true,
    reusesExistingInfiniteSessionConstruction: true,
    reusesExistingRuntimeProgressionConstruction: true,
    returnsFreshRuntimeProgression: true,
    addsRuntimeProgressionDiscriminator: false,
    adoptsLiveRuntime: false,
    writesReactStateOrRefs: false,
    startsOrTicksTimer: false,
    advancesSession: false,
    changesRuntimeDescriptor: false,
    writesPersistence: false,
    writesRunArchive: false,
  });
};
