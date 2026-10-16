import { getAdditionalGameModeProfile } from "./scoreAttackModeContract";
import {
  SCORE_ATTACK_RECORD_ID,
  resolveScoreAttackRecordProjection,
  type ScoreAttackRecordStatus,
} from "./scoreAttackRecordProjection";
import { SCORE_ATTACK_DURATION_MS } from "./scoreAttackTimeboxProjection";

export type ScoreAttackRecordCommitEligibilityMode = "ELIGIBILITY_ONLY";

export interface ScoreAttackRecordCommitCompletionFact {
  readonly type: "TIMEBOX";
  readonly durationMs: number;
  readonly completed: boolean;
}

export interface ScoreAttackRecordCommitEligibilityProjection {
  readonly modeId: "SCORE_ATTACK";
  readonly recordId: typeof SCORE_ATTACK_RECORD_ID;
  readonly eligibilityMode: ScoreAttackRecordCommitEligibilityMode;
  readonly completionType: "TIMEBOX";
  readonly durationMs: typeof SCORE_ATTACK_DURATION_MS;
  readonly recordStatus: ScoreAttackRecordStatus;
  readonly normalizedExistingBestScore: number;
  readonly normalizedCandidateScore: number;
  readonly projectedBestScore: number;
  readonly eligibleToAdvanceRecord: boolean;
  readonly writesStorage: false;
  readonly mutatesGameStats: false;
  readonly mutatesGlobalHighScore: false;
  readonly adoptsLiveMode: false;
}

export interface ScoreAttackRecordCommitEligibilityAuthorityContract {
  readonly ownsRecordCommitEligibilityAuthority: true;
  readonly ownsDedicatedRecordProjectionAuthority: false;
  readonly ownsModeIdentityAuthority: false;
  readonly ownsCompletionProjectionAuthority: false;
  readonly ownsLiveCompletionPolicyAuthority: false;
  readonly ownsExactDurationAuthority: false;
  readonly ownsGameStatsAuthority: false;
  readonly ownsPersistenceAuthority: false;
  readonly ownsStorageSchemaAuthority: false;
  readonly ownsStorageWriteAuthority: false;
  readonly ownsGlobalHighScoreAuthority: false;
  readonly ownsRunArchiveAuthority: false;
  readonly ownsLiveModeExecutionAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsProgressionAuthority: false;
  readonly ownsSessionConstructionAuthority: false;
  readonly ownsTimerAuthority: false;
  readonly ownsClock: false;
  readonly ownsPauseAuthority: false;
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
  SCORE_ATTACK_PROFILE.modeId !== "SCORE_ATTACK" ||
  SCORE_ATTACK_PROFILE.completionCompatibility !== "TIMEBOX" ||
  SCORE_ATTACK_PROFILE.scoreSourceCompatibility !== "EXISTING_RUN_SCORE" ||
  SCORE_ATTACK_DURATION_MS !== 60000
) {
  throw new Error(
    "J8F requires the certified J8A Score Attack identity and J8C TIMEBOX compatibility.",
  );
}

export const SCORE_ATTACK_RECORD_COMMIT_ELIGIBILITY_AUTHORITY_CONTRACT: Readonly<ScoreAttackRecordCommitEligibilityAuthorityContract> =
  Object.freeze({
    ownsRecordCommitEligibilityAuthority: true,
    ownsDedicatedRecordProjectionAuthority: false,
    ownsModeIdentityAuthority: false,
    ownsCompletionProjectionAuthority: false,
    ownsLiveCompletionPolicyAuthority: false,
    ownsExactDurationAuthority: false,
    ownsGameStatsAuthority: false,
    ownsPersistenceAuthority: false,
    ownsStorageSchemaAuthority: false,
    ownsStorageWriteAuthority: false,
    ownsGlobalHighScoreAuthority: false,
    ownsRunArchiveAuthority: false,
    ownsLiveModeExecutionAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsProgressionAuthority: false,
    ownsSessionConstructionAuthority: false,
    ownsTimerAuthority: false,
    ownsClock: false,
    ownsPauseAuthority: false,
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
    ownsSeedAuthority: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

export const resolveScoreAttackRecordCommitEligibility = (
  modeId: string,
  completionFact: Readonly<ScoreAttackRecordCommitCompletionFact> | null | undefined,
  existingBestScore: number,
  candidateScore: number,
): Readonly<ScoreAttackRecordCommitEligibilityProjection> | null => {
  const profile = getAdditionalGameModeProfile(modeId);
  if (
    !profile ||
    profile.modeId !== SCORE_ATTACK_PROFILE.modeId ||
    profile.completionCompatibility !== "TIMEBOX"
  ) {
    return null;
  }

  if (
    !completionFact ||
    completionFact.type !== "TIMEBOX" ||
    completionFact.durationMs !== SCORE_ATTACK_DURATION_MS ||
    completionFact.completed !== true
  ) {
    return null;
  }

  const recordProjection = resolveScoreAttackRecordProjection(
    modeId,
    existingBestScore,
    candidateScore,
  );
  if (
    !recordProjection ||
    recordProjection.recordId !== SCORE_ATTACK_RECORD_ID ||
    recordProjection.durationCompatibilityMs !== SCORE_ATTACK_DURATION_MS
  ) {
    return null;
  }

  return Object.freeze({
    modeId: SCORE_ATTACK_PROFILE.modeId,
    recordId: recordProjection.recordId,
    eligibilityMode: "ELIGIBILITY_ONLY",
    completionType: completionFact.type,
    durationMs: SCORE_ATTACK_DURATION_MS,
    recordStatus: recordProjection.status,
    normalizedExistingBestScore: recordProjection.normalizedExistingBestScore,
    normalizedCandidateScore: recordProjection.normalizedCandidateScore,
    projectedBestScore: recordProjection.projectedBestScore,
    eligibleToAdvanceRecord: recordProjection.status === "NEW_BEST",
    writesStorage: false,
    mutatesGameStats: false,
    mutatesGlobalHighScore: false,
    adoptsLiveMode: false,
  });
};
