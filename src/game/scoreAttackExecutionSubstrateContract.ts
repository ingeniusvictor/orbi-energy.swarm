import {
  getAdditionalGameModeProfile,
} from "./scoreAttackModeContract";
import {
  validateInfiniteSession,
  type InfiniteSessionState,
} from "./infiniteSession";
import {
  createInfiniteRuntimeState,
  resolveRuntimeWaveDescriptor,
} from "./runtimeProgressionRouter";

export type ScoreAttackExecutionSubstrate = "INFINITE_SESSION";
export type ScoreAttackExecutionSubstrateContractMode =
  "COMPATIBILITY_ONLY";
export type ScoreAttackRuntimeProgressionCompatibility = "INFINITE";

export interface ScoreAttackExecutionSubstrateCompatibility {
  readonly modeId: "SCORE_ATTACK";
  readonly contractMode: ScoreAttackExecutionSubstrateContractMode;
  readonly executionSubstrate: ScoreAttackExecutionSubstrate;
  readonly runtimeProgressionCompatibility: ScoreAttackRuntimeProgressionCompatibility;
  readonly canonicalFreshStart: Readonly<{
    sector: 11;
    wave: 1;
    sectorsCompleted: 0;
    wavesCompleted: 0;
    status: "ACTIVE";
  }>;
  readonly requiresCampaignVictoryCheckpoint: false;
  readonly reusesExistingInfiniteAdvancement: true;
  readonly reusesExistingRuntimeDescriptorPipeline: true;
  readonly keepsScoreAttackOutsideRuntimeProgressionDiscriminator: true;
  readonly selectsExecutionSubstrateCompatibility: true;
  readonly selectsExactDuration: false;
  readonly selectsSeedPolicy: false;
  readonly constructsLiveSession: false;
  readonly executesLiveMode: false;
}

export interface ScoreAttackExecutionSubstrateAuthorityContract {
  readonly ownsExecutionSubstrateCompatibilityAuthority: true;
  readonly ownsLiveAdoptionAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsProgressionAuthority: false;
  readonly ownsSessionConstructionAuthority: false;
  readonly ownsCampaignVictoryCheckpointAuthority: false;
  readonly ownsDescriptorMutationAuthority: false;
  readonly ownsCompletionPolicyAuthority: false;
  readonly ownsExactDurationAuthority: false;
  readonly ownsTimerAuthority: false;
  readonly ownsClock: false;
  readonly ownsPauseAuthority: false;
  readonly ownsSpawnAuthority: false;
  readonly ownsArenaAuthority: false;
  readonly ownsEntityCollection: false;
  readonly ownsProjectileCollection: false;
  readonly ownsDamageAuthority: false;
  readonly ownsDefeatAuthority: false;
  readonly ownsScoreMutationAuthority: false;
  readonly ownsScoreFormulaAuthority: false;
  readonly ownsRewardAuthority: false;
  readonly ownsEconomyAuthority: false;
  readonly ownsPersistenceAuthority: false;
  readonly ownsStorageSchemaAuthority: false;
  readonly ownsRunArchiveAuthority: false;
  readonly ownsHighScoreAuthority: false;
  readonly ownsStartScreenAuthority: false;
  readonly ownsResultScreenAuthority: false;
  readonly ownsHudAuthority: false;
  readonly ownsRandomness: false;
  readonly ownsHashAuthority: false;
  readonly ownsSeedAuthority: false;
  readonly ownsFullArrayScan: false;
  readonly mayLookupEntities: false;
  readonly mayMutateEntities: false;
  readonly mayMutateGlobalCaps: false;
  readonly mayCreateEntities: false;
  readonly mayRemoveEntities: false;
}

const CANONICAL_FRESH_START = Object.freeze({
  sector: 11,
  wave: 1,
  sectorsCompleted: 0,
  wavesCompleted: 0,
  status: "ACTIVE",
} as const);

export const SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY: Readonly<ScoreAttackExecutionSubstrateCompatibility> =
  Object.freeze({
    modeId: "SCORE_ATTACK",
    contractMode: "COMPATIBILITY_ONLY",
    executionSubstrate: "INFINITE_SESSION",
    runtimeProgressionCompatibility: "INFINITE",
    canonicalFreshStart: CANONICAL_FRESH_START,
    requiresCampaignVictoryCheckpoint: false,
    reusesExistingInfiniteAdvancement: true,
    reusesExistingRuntimeDescriptorPipeline: true,
    keepsScoreAttackOutsideRuntimeProgressionDiscriminator: true,
    selectsExecutionSubstrateCompatibility: true,
    selectsExactDuration: false,
    selectsSeedPolicy: false,
    constructsLiveSession: false,
    executesLiveMode: false,
  });

export const SCORE_ATTACK_EXECUTION_SUBSTRATE_AUTHORITY_CONTRACT: Readonly<ScoreAttackExecutionSubstrateAuthorityContract> =
  Object.freeze({
    ownsExecutionSubstrateCompatibilityAuthority: true,
    ownsLiveAdoptionAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsProgressionAuthority: false,
    ownsSessionConstructionAuthority: false,
    ownsCampaignVictoryCheckpointAuthority: false,
    ownsDescriptorMutationAuthority: false,
    ownsCompletionPolicyAuthority: false,
    ownsExactDurationAuthority: false,
    ownsTimerAuthority: false,
    ownsClock: false,
    ownsPauseAuthority: false,
    ownsSpawnAuthority: false,
    ownsArenaAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreMutationAuthority: false,
    ownsScoreFormulaAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
    ownsPersistenceAuthority: false,
    ownsStorageSchemaAuthority: false,
    ownsRunArchiveAuthority: false,
    ownsHighScoreAuthority: false,
    ownsStartScreenAuthority: false,
    ownsResultScreenAuthority: false,
    ownsHudAuthority: false,
    ownsRandomness: false,
    ownsHashAuthority: false,
    ownsSeedAuthority: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

export const resolveScoreAttackExecutionSubstrateCompatibility = (
  modeId: string,
  session: InfiniteSessionState,
): Readonly<ScoreAttackExecutionSubstrateCompatibility> | null => {
  const profile = getAdditionalGameModeProfile(modeId);
  if (
    !profile ||
    profile.modeId !== "SCORE_ATTACK" ||
    profile.profileMode !== "PROFILE_ONLY"
  ) {
    return null;
  }

  const validation = validateInfiniteSession(session);
  if (
    !validation.valid ||
    session.kind !== "INFINITE_SESSION" ||
    session.status !== "ACTIVE" ||
    session.currentSector !== CANONICAL_FRESH_START.sector ||
    session.currentWaveNumber !== CANONICAL_FRESH_START.wave ||
    session.sectorsCompleted !== CANONICAL_FRESH_START.sectorsCompleted ||
    session.wavesCompleted !== CANONICAL_FRESH_START.wavesCompleted
  ) {
    return null;
  }

  const runtimeState = createInfiniteRuntimeState(session);
  if (
    runtimeState.mode !== "INFINITE" ||
    runtimeState.session !== session
  ) {
    return null;
  }

  // Resolving the current descriptor proves compatibility with the existing
  // runtime projection path without mutating or owning that authority.
  resolveRuntimeWaveDescriptor(runtimeState);

  return SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY;
};
