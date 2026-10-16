import {
  getAdditionalGameModeProfile,
} from "./scoreAttackModeContract";
import {
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY,
  resolveScoreAttackExecutionSubstrateCompatibility,
} from "./scoreAttackExecutionSubstrateContract";
import type { InfiniteSessionState } from "./infiniteSession";

export const SCORE_ATTACK_DURATION_MS = 60000 as const;

export type ScoreAttackTimeboxProjectionKind =
  "SCORE_ATTACK_TIMEBOX_PROJECTION";
export type ScoreAttackTimeboxProjectionMode = "PROJECTION_ONLY";

export interface ScoreAttackTimeboxCompletionProjection {
  readonly type: "TIMEBOX";
  readonly durationMs: typeof SCORE_ATTACK_DURATION_MS;
}

export interface ScoreAttackTimeboxProjection {
  readonly kind: ScoreAttackTimeboxProjectionKind;
  readonly projectionMode: ScoreAttackTimeboxProjectionMode;
  readonly modeId: "SCORE_ATTACK";
  readonly objective: "MAXIMIZE_EXISTING_RUN_SCORE";
  readonly scoreSourceCompatibility: "EXISTING_RUN_SCORE";
  readonly executionSubstrate: "INFINITE_SESSION";
  readonly runtimeProgressionCompatibility: "INFINITE";
  readonly exactDurationMs: typeof SCORE_ATTACK_DURATION_MS;
  readonly completionProjection: Readonly<ScoreAttackTimeboxCompletionProjection>;
  readonly selectsExactDuration: true;
  readonly projectsTimeboxCompletion: true;
  readonly executesLiveMode: false;
  readonly mutatesRuntimeDescriptor: false;
  readonly constructsLiveSession: false;
  readonly startsTimer: false;
  readonly ticksTimer: false;
  readonly resetsTimer: false;
  readonly ownsPauseLifecycle: false;
  readonly selectsSeedPolicy: false;
  readonly changesProgression: false;
  readonly changesScoreFormula: false;
  readonly changesPersistence: false;
  readonly changesHud: false;
}

export interface ScoreAttackTimeboxProjectionAuthorityContract {
  readonly ownsExactDurationProjectionAuthority: true;
  readonly ownsCompletionProjectionAuthority: true;
  readonly ownsModeIdentityAuthority: false;
  readonly ownsExecutionSubstrateCompatibilityAuthority: false;
  readonly ownsLiveModeExecutionAuthority: false;
  readonly ownsLiveCompletionPolicyAuthority: false;
  readonly ownsDescriptorMutationAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsProgressionAuthority: false;
  readonly ownsSessionConstructionAuthority: false;
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

const SCORE_ATTACK_PROFILE = getAdditionalGameModeProfile("SCORE_ATTACK");

if (
  !SCORE_ATTACK_PROFILE ||
  SCORE_ATTACK_PROFILE.profileMode !== "PROFILE_ONLY" ||
  SCORE_ATTACK_PROFILE.objective !== "MAXIMIZE_EXISTING_RUN_SCORE" ||
  SCORE_ATTACK_PROFILE.completionCompatibility !== "TIMEBOX" ||
  SCORE_ATTACK_PROFILE.scoreSourceCompatibility !== "EXISTING_RUN_SCORE" ||
  !SCORE_ATTACK_PROFILE.usesExistingTimeboxVocabulary ||
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY.modeId !== "SCORE_ATTACK" ||
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY.contractMode !==
    "COMPATIBILITY_ONLY" ||
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY.executionSubstrate !==
    "INFINITE_SESSION" ||
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY.runtimeProgressionCompatibility !==
    "INFINITE" ||
  SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY.selectsExactDuration !== false
) {
  throw new Error(
    "J8C requires the certified J8A Score Attack profile and J8B execution-substrate compatibility contract.",
  );
}

const TIMEBOX_COMPLETION_PROJECTION: Readonly<ScoreAttackTimeboxCompletionProjection> =
  Object.freeze({
    type: "TIMEBOX",
    durationMs: SCORE_ATTACK_DURATION_MS,
  });

export const SCORE_ATTACK_TIMEBOX_PROJECTION_AUTHORITY_CONTRACT: Readonly<ScoreAttackTimeboxProjectionAuthorityContract> =
  Object.freeze({
    ownsExactDurationProjectionAuthority: true,
    ownsCompletionProjectionAuthority: true,
    ownsModeIdentityAuthority: false,
    ownsExecutionSubstrateCompatibilityAuthority: false,
    ownsLiveModeExecutionAuthority: false,
    ownsLiveCompletionPolicyAuthority: false,
    ownsDescriptorMutationAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsProgressionAuthority: false,
    ownsSessionConstructionAuthority: false,
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

export const resolveScoreAttackTimeboxProjection = (
  modeId: string,
  session: InfiniteSessionState,
): Readonly<ScoreAttackTimeboxProjection> | null => {
  const profile = getAdditionalGameModeProfile(modeId);
  if (
    !profile ||
    profile.modeId !== SCORE_ATTACK_PROFILE.modeId ||
    profile.profileMode !== SCORE_ATTACK_PROFILE.profileMode ||
    profile.completionCompatibility !== "TIMEBOX"
  ) {
    return null;
  }

  const substrateCompatibility =
    resolveScoreAttackExecutionSubstrateCompatibility(modeId, session);
  if (
    !substrateCompatibility ||
    substrateCompatibility !== SCORE_ATTACK_EXECUTION_SUBSTRATE_COMPATIBILITY
  ) {
    return null;
  }

  return Object.freeze({
    kind: "SCORE_ATTACK_TIMEBOX_PROJECTION",
    projectionMode: "PROJECTION_ONLY",
    modeId: SCORE_ATTACK_PROFILE.modeId,
    objective: SCORE_ATTACK_PROFILE.objective,
    scoreSourceCompatibility: SCORE_ATTACK_PROFILE.scoreSourceCompatibility,
    executionSubstrate: substrateCompatibility.executionSubstrate,
    runtimeProgressionCompatibility:
      substrateCompatibility.runtimeProgressionCompatibility,
    exactDurationMs: SCORE_ATTACK_DURATION_MS,
    completionProjection: TIMEBOX_COMPLETION_PROJECTION,
    selectsExactDuration: true,
    projectsTimeboxCompletion: true,
    executesLiveMode: false,
    mutatesRuntimeDescriptor: false,
    constructsLiveSession: false,
    startsTimer: false,
    ticksTimer: false,
    resetsTimer: false,
    ownsPauseLifecycle: false,
    selectsSeedPolicy: false,
    changesProgression: false,
    changesScoreFormula: false,
    changesPersistence: false,
    changesHud: false,
  });
};
