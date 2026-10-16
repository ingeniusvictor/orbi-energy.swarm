import type { InfiniteRunContext } from "./infiniteContextDirector";
import { NEUTRAL_INFINITE_RUN_CONTEXT } from "./infinitePlanBuilder";
import { createInfiniteSession } from "./infiniteSession";
import {
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY,
  resolveScoreAttackExecutionSubstrateCompatibility,
} from "./scoreAttackExecutionSubstrateContract";
import { getAdditionalGameModeProfile } from "./scoreAttackModeContract";
import {
  SCORE_ATTACK_DURATION_MS,
  resolveScoreAttackTimeboxProjection,
} from "./scoreAttackTimeboxProjection";

export const SCORE_ATTACK_RUN_RECIPE_VERSION = 1 as const;
export const SCORE_ATTACK_CANONICAL_SEED = "orbi-score-attack-v1" as const;

export type ScoreAttackRunRecipeKind = "SCORE_ATTACK_CANONICAL_RUN_RECIPE";
export type ScoreAttackRunRecipeMode = "RECIPE_ONLY";
export type ScoreAttackSeedPolicy = "FIXED_VERSIONED";
export type ScoreAttackRunContextPolicy = "NEUTRAL_INFINITE_CONTEXT";

export interface ScoreAttackCanonicalRunRecipe {
  readonly kind: ScoreAttackRunRecipeKind;
  readonly recipeMode: ScoreAttackRunRecipeMode;
  readonly modeId: "SCORE_ATTACK";
  readonly recipeVersion: typeof SCORE_ATTACK_RUN_RECIPE_VERSION;
  readonly seedPolicy: ScoreAttackSeedPolicy;
  readonly seed: typeof SCORE_ATTACK_CANONICAL_SEED;
  readonly contextPolicy: ScoreAttackRunContextPolicy;
  readonly context: Readonly<InfiniteRunContext>;
  readonly executionSubstrate: "INFINITE_SESSION";
  readonly runtimeProgressionCompatibility: "INFINITE";
  readonly canonicalFreshStart: Readonly<{
    sector: 11;
    wave: 1;
    sectorsCompleted: 0;
    wavesCompleted: 0;
    status: "ACTIVE";
  }>;
  readonly exactDurationMs: typeof SCORE_ATTACK_DURATION_MS;
  readonly completionType: "TIMEBOX";
  readonly selectsSeedPolicy: true;
  readonly selectsRunContextPolicy: true;
  readonly provesFreshSubstrateCompatibility: true;
  readonly provesTimeboxCompatibility: true;
  readonly returnsProofSession: false;
  readonly adoptsLiveSession: false;
  readonly executesLiveMode: false;
  readonly changesProgression: false;
  readonly changesRuntimeDescriptor: false;
  readonly changesPersistence: false;
  readonly changesScoreFormula: false;
  readonly changesRewardsOrEconomy: false;
  readonly changesHud: false;
}

export interface ScoreAttackRunRecipeAuthorityContract {
  readonly ownsCanonicalRunRecipeSeedPolicyAuthority: true;
  readonly ownsModeIdentityAuthority: false;
  readonly ownsInfinitePlanAuthority: false;
  readonly ownsInfiniteContextSemanticsAuthority: false;
  readonly ownsExecutionSubstrateCompatibilityAuthority: false;
  readonly ownsExactDurationAuthority: false;
  readonly ownsCompletionProjectionAuthority: false;
  readonly ownsLiveModeExecutionAuthority: false;
  readonly ownsLiveSessionLifecycleAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsProgressionAuthority: false;
  readonly ownsDescriptorMutationAuthority: false;
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
  readonly ownsClockDerivedSeedAuthority: false;
  readonly ownsHashAuthority: false;
  readonly ownsFullArrayScan: false;
  readonly mayLookupEntities: false;
  readonly mayMutateEntities: false;
  readonly mayMutateGlobalCaps: false;
  readonly mayCreateEntities: false;
  readonly mayRemoveEntities: false;
}

const SCORE_ATTACK_PROFILE = getAdditionalGameModeProfile("SCORE_ATTACK");

if (
  !SCORE_ATTACK_PROFILE ||
  SCORE_ATTACK_PROFILE.modeId !== "SCORE_ATTACK" ||
  SCORE_ATTACK_PROFILE.profileMode !== "PROFILE_ONLY" ||
  SCORE_ATTACK_PROFILE.completionCompatibility !== "TIMEBOX" ||
  SCORE_ATTACK_PROFILE.selectsSeedPolicy !== false ||
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY.modeId !== "SCORE_ATTACK" ||
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY.executionSubstrate !==
    "INFINITE_SESSION" ||
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY.runtimeProgressionCompatibility !==
    "INFINITE" ||
  SCORE_ATTACK_DURATION_MS !== 60000
) {
  throw new Error(
    "J8G requires the certified J8A profile, J8B Infinite substrate compatibility and J8C 60000 ms TIMEBOX projection.",
  );
}

const SCORE_ATTACK_NEUTRAL_CONTEXT: Readonly<InfiniteRunContext> = Object.freeze({
  ...NEUTRAL_INFINITE_RUN_CONTEXT,
});

export const SCORE_ATTACK_RUN_RECIPE_AUTHORITY_CONTRACT: Readonly<ScoreAttackRunRecipeAuthorityContract> =
  Object.freeze({
    ownsCanonicalRunRecipeSeedPolicyAuthority: true,
    ownsModeIdentityAuthority: false,
    ownsInfinitePlanAuthority: false,
    ownsInfiniteContextSemanticsAuthority: false,
    ownsExecutionSubstrateCompatibilityAuthority: false,
    ownsExactDurationAuthority: false,
    ownsCompletionProjectionAuthority: false,
    ownsLiveModeExecutionAuthority: false,
    ownsLiveSessionLifecycleAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsProgressionAuthority: false,
    ownsDescriptorMutationAuthority: false,
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
    ownsClockDerivedSeedAuthority: false,
    ownsHashAuthority: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

export const resolveScoreAttackCanonicalRunRecipe = (
  modeId: string,
): Readonly<ScoreAttackCanonicalRunRecipe> | null => {
  const profile = getAdditionalGameModeProfile(modeId);
  if (
    !profile ||
    profile.modeId !== SCORE_ATTACK_PROFILE.modeId ||
    profile.profileMode !== SCORE_ATTACK_PROFILE.profileMode
  ) {
    return null;
  }

  // A transient pure session proves that the selected deterministic recipe
  // remains compatible with frozen J8B/J8C. It never escapes this resolver.
  const proofSession = createInfiniteSession(
    SCORE_ATTACK_CANONICAL_SEED,
    SCORE_ATTACK_NEUTRAL_CONTEXT,
  );

  const substrateCompatibility =
    resolveScoreAttackExecutionSubstrateCompatibility(modeId, proofSession);
  if (
    !substrateCompatibility ||
    substrateCompatibility !== SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY
  ) {
    return null;
  }

  const timeboxProjection = resolveScoreAttackTimeboxProjection(
    modeId,
    proofSession,
  );
  if (
    !timeboxProjection ||
    timeboxProjection.exactDurationMs !== SCORE_ATTACK_DURATION_MS ||
    timeboxProjection.completionProjection.type !== "TIMEBOX" ||
    timeboxProjection.completionProjection.durationMs !== SCORE_ATTACK_DURATION_MS
  ) {
    return null;
  }

  return Object.freeze({
    kind: "SCORE_ATTACK_CANONICAL_RUN_RECIPE",
    recipeMode: "RECIPE_ONLY",
    modeId: SCORE_ATTACK_PROFILE.modeId,
    recipeVersion: SCORE_ATTACK_RUN_RECIPE_VERSION,
    seedPolicy: "FIXED_VERSIONED",
    seed: SCORE_ATTACK_CANONICAL_SEED,
    contextPolicy: "NEUTRAL_INFINITE_CONTEXT",
    context: SCORE_ATTACK_NEUTRAL_CONTEXT,
    executionSubstrate: substrateCompatibility.executionSubstrate,
    runtimeProgressionCompatibility:
      substrateCompatibility.runtimeProgressionCompatibility,
    canonicalFreshStart: substrateCompatibility.canonicalFreshStart,
    exactDurationMs: timeboxProjection.exactDurationMs,
    completionType: timeboxProjection.completionProjection.type,
    selectsSeedPolicy: true,
    selectsRunContextPolicy: true,
    provesFreshSubstrateCompatibility: true,
    provesTimeboxCompatibility: true,
    returnsProofSession: false,
    adoptsLiveSession: false,
    executesLiveMode: false,
    changesProgression: false,
    changesRuntimeDescriptor: false,
    changesPersistence: false,
    changesScoreFormula: false,
    changesRewardsOrEconomy: false,
    changesHud: false,
  });
};
