import {
  resolveBonusChallengeTimeboxProjection,
  type BonusChallengeTimeboxProjection,
} from "./bonusChallengeTimeboxProjection";
import type { RuntimeProgressionState } from "./runtimeProgressionRouter";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";

export type BonusChallengeRuntimeAdoptionKind =
  "BONUS_CHALLENGE_RUNTIME_ADOPTION";
export type BonusChallengeRuntimeAdoptionMode = "CURRENT_WAVE_ONLY";
export type BonusChallengeRuntimeTelegraphMode = "WAVE_ANNOUNCEMENT";

export interface BonusChallengeRuntimeAdoption {
  readonly kind: BonusChallengeRuntimeAdoptionKind;
  readonly adoptionMode: BonusChallengeRuntimeAdoptionMode;
  readonly sourceMode: "INFINITE";
  readonly challengeId: "TIMED_SURVIVAL";
  readonly sector: number;
  readonly waveIndex: number;
  readonly waveCount: number;
  readonly opportunityId: string;
  readonly exactDurationMs: 30000;
  readonly completionPolicy: Readonly<{
    type: "TIMEBOX";
    durationMs: 30000;
  }>;
  readonly telegraphMode: BonusChallengeRuntimeTelegraphMode;
  readonly ownsClock: false;
  readonly ownsTimer: false;
  readonly ownsCompletionCursor: false;
  readonly ownsPauseLifecycle: false;
  readonly mutatesRecipe: false;
  readonly mutatesSession: false;
  readonly mutatesEntities: false;
  readonly changesSpawnAuthority: false;
  readonly changesArenaAuthority: false;
  readonly changesProgressionAuthority: false;
  readonly changesCombatEconomyAuthority: false;
  readonly changesBudgetAuthority: false;
}

export interface BonusChallengeRuntimeAdoptionAuthorityContract {
  readonly ownsLiveAdoptionAuthority: true;
  readonly ownsDescriptorCompletionOverlayAuthority: true;
  readonly ownsChallengeProfileAuthority: false;
  readonly ownsOpportunitySelectionAuthority: false;
  readonly ownsDurationProjectionAuthority: false;
  readonly ownsLiveCompletionPolicyAuthority: false;
  readonly ownsTimerAuthority: false;
  readonly ownsCompletionCursorAuthority: false;
  readonly ownsClock: false;
  readonly ownsPauseAuthority: false;
  readonly ownsSpawnAuthority: false;
  readonly ownsArenaAuthority: false;
  readonly ownsProgressionAuthority: false;
  readonly ownsEntityCollection: false;
  readonly ownsProjectileCollection: false;
  readonly ownsDamageAuthority: false;
  readonly ownsDefeatAuthority: false;
  readonly ownsScoreAuthority: false;
  readonly ownsRewardAuthority: false;
  readonly ownsEconomyAuthority: false;
  readonly ownsHudAuthority: false;
  readonly ownsRandomness: false;
  readonly ownsHashAuthority: false;
  readonly ownsFullArrayScan: false;
  readonly mayLookupEntities: false;
  readonly mayMutateEntities: false;
  readonly mayMutateGlobalCaps: false;
  readonly mayCreateEntities: false;
  readonly mayRemoveEntities: false;
}

export const BONUS_CHALLENGE_RUNTIME_ADOPTION_AUTHORITY_CONTRACT: Readonly<BonusChallengeRuntimeAdoptionAuthorityContract> =
  Object.freeze({
    ownsLiveAdoptionAuthority: true,
    ownsDescriptorCompletionOverlayAuthority: true,
    ownsChallengeProfileAuthority: false,
    ownsOpportunitySelectionAuthority: false,
    ownsDurationProjectionAuthority: false,
    ownsLiveCompletionPolicyAuthority: false,
    ownsTimerAuthority: false,
    ownsCompletionCursorAuthority: false,
    ownsClock: false,
    ownsPauseAuthority: false,
    ownsSpawnAuthority: false,
    ownsArenaAuthority: false,
    ownsProgressionAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
    ownsHudAuthority: false,
    ownsRandomness: false,
    ownsHashAuthority: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

export interface BonusChallengeRuntimeAdoptionResult {
  readonly descriptor: RuntimeWaveDescriptor;
  readonly adoption: Readonly<BonusChallengeRuntimeAdoption> | null;
}

const unchanged = (
  descriptor: RuntimeWaveDescriptor,
): Readonly<BonusChallengeRuntimeAdoptionResult> =>
  Object.freeze({
    descriptor,
    adoption: null,
  });

const createAdoption = (
  projection: Readonly<BonusChallengeTimeboxProjection>,
): Readonly<BonusChallengeRuntimeAdoption> =>
  Object.freeze({
    kind: "BONUS_CHALLENGE_RUNTIME_ADOPTION",
    adoptionMode: "CURRENT_WAVE_ONLY",
    sourceMode: "INFINITE",
    challengeId: projection.challengeId,
    sector: projection.sector,
    waveIndex: projection.waveIndex,
    waveCount: projection.waveCount,
    opportunityId: projection.opportunityId,
    exactDurationMs: projection.exactDurationMs,
    completionPolicy: projection.completionProjection,
    telegraphMode: "WAVE_ANNOUNCEMENT",
    ownsClock: false,
    ownsTimer: false,
    ownsCompletionCursor: false,
    ownsPauseLifecycle: false,
    mutatesRecipe: false,
    mutatesSession: false,
    mutatesEntities: false,
    changesSpawnAuthority: false,
    changesArenaAuthority: false,
    changesProgressionAuthority: false,
    changesCombatEconomyAuthority: false,
    changesBudgetAuthority: false,
  });

export const applyBonusChallengeRuntimeAdoption = (
  state: RuntimeProgressionState,
  descriptor: RuntimeWaveDescriptor,
): Readonly<BonusChallengeRuntimeAdoptionResult> => {
  if (state.mode !== "INFINITE" || descriptor.sourceMode !== "INFINITE") {
    return unchanged(descriptor);
  }

  if (
    descriptor.sector !== state.session.currentSector ||
    descriptor.waveNumber !== state.session.currentWaveNumber ||
    descriptor.waveCount !== state.session.currentPlan.executionPlans.length
  ) {
    return unchanged(descriptor);
  }

  if (descriptor.completionPolicy.type !== "BUDGET_AND_CLEAR") {
    return unchanged(descriptor);
  }

  const seed = descriptor.source.seed;
  const recipeId = descriptor.source.recipeId;
  if (!seed || !recipeId) return unchanged(descriptor);

  const projection = resolveBonusChallengeTimeboxProjection({
    sourceMode: "INFINITE",
    sector: descriptor.sector,
    waveIndex: descriptor.waveNumber,
    waveCount: descriptor.waveCount,
    recoverySector: state.session.currentPlan.effectiveRecipe.recoverySector,
    hasMilestone: descriptor.milestone !== null,
    seed,
    recipeId,
  });
  if (!projection) return unchanged(descriptor);

  if (
    projection.sector !== descriptor.sector ||
    projection.waveIndex !== descriptor.waveNumber ||
    projection.waveCount !== descriptor.waveCount ||
    projection.selectedWaveIndex !== descriptor.waveNumber
  ) {
    return unchanged(descriptor);
  }

  const adoption = createAdoption(projection);
  const adoptedDescriptor: RuntimeWaveDescriptor = {
    ...descriptor,
    descriptorId: `${descriptor.descriptorId}:j7d:timed-survival`,
    display: {
      ...descriptor.display,
      name: `${descriptor.display.name} // TIMED SURVIVAL`,
      displayName: `${descriptor.display.displayName} // Timed Survival`,
      description: `${descriptor.display.description} Bonus challenge: survive for 30 seconds.`,
    },
    completionPolicy: {
      type: projection.completionProjection.type,
      durationMs: projection.completionProjection.durationMs,
    },
  };

  return Object.freeze({
    descriptor: adoptedDescriptor,
    adoption,
  });
};
