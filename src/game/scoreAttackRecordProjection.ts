import { getAdditionalGameModeProfile } from "./scoreAttackModeContract";
import { SCORE_ATTACK_DURATION_MS } from "./scoreAttackTimeboxProjection";

export const SCORE_ATTACK_RECORD_ID = "SCORE_ATTACK_BEST_SCORE" as const;

export type ScoreAttackRecordProjectionMode = "RECORD_PROJECTION_ONLY";
export type ScoreAttackRecordStatus =
  | "NEW_BEST"
  | "TIED_BEST"
  | "BELOW_BEST";

export interface ScoreAttackRecordProjection {
  readonly modeId: "SCORE_ATTACK";
  readonly recordId: typeof SCORE_ATTACK_RECORD_ID;
  readonly projectionMode: ScoreAttackRecordProjectionMode;
  readonly durationCompatibilityMs: typeof SCORE_ATTACK_DURATION_MS;
  readonly normalizedExistingBestScore: number;
  readonly normalizedCandidateScore: number;
  readonly projectedBestScore: number;
  readonly status: ScoreAttackRecordStatus;
  readonly writesStorage: false;
  readonly mutatesGlobalHighScore: false;
  readonly mutatesGameStats: false;
  readonly adoptsLiveMode: false;
}

export interface ScoreAttackRecordProjectionAuthorityContract {
  readonly ownsDedicatedRecordProjectionAuthority: true;
  readonly ownsGlobalHighScoreAuthority: false;
  readonly ownsGameStatsAuthority: false;
  readonly ownsPersistenceAuthority: false;
  readonly ownsStorageSchemaAuthority: false;
  readonly ownsStorageWriteAuthority: false;
  readonly ownsRunArchiveAuthority: false;
  readonly ownsModeIdentityAuthority: false;
  readonly ownsExactDurationAuthority: false;
  readonly ownsCompletionPolicyAuthority: false;
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
  SCORE_ATTACK_PROFILE.profileMode !== "PROFILE_ONLY" ||
  SCORE_ATTACK_PROFILE.objective !== "MAXIMIZE_EXISTING_RUN_SCORE" ||
  SCORE_ATTACK_PROFILE.scoreSourceCompatibility !== "EXISTING_RUN_SCORE" ||
  SCORE_ATTACK_DURATION_MS !== 60000
) {
  throw new Error(
    "J8D requires the certified J8A Score Attack identity and J8C 60000 ms duration compatibility.",
  );
}

export const SCORE_ATTACK_RECORD_PROJECTION_AUTHORITY_CONTRACT: Readonly<ScoreAttackRecordProjectionAuthorityContract> =
  Object.freeze({
    ownsDedicatedRecordProjectionAuthority: true,
    ownsGlobalHighScoreAuthority: false,
    ownsGameStatsAuthority: false,
    ownsPersistenceAuthority: false,
    ownsStorageSchemaAuthority: false,
    ownsStorageWriteAuthority: false,
    ownsRunArchiveAuthority: false,
    ownsModeIdentityAuthority: false,
    ownsExactDurationAuthority: false,
    ownsCompletionPolicyAuthority: false,
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

const normalizeRecordScore = (value: number): number | null => {
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }

  return Math.max(
    0,
    Math.min(Number.MAX_SAFE_INTEGER, Math.floor(value)),
  );
};

export const resolveScoreAttackRecordProjection = (
  modeId: string,
  existingBestScore: number,
  candidateScore: number,
): Readonly<ScoreAttackRecordProjection> | null => {
  const profile = getAdditionalGameModeProfile(modeId);
  if (
    !profile ||
    profile.modeId !== SCORE_ATTACK_PROFILE.modeId ||
    profile.objective !== SCORE_ATTACK_PROFILE.objective
  ) {
    return null;
  }

  const normalizedExistingBestScore = normalizeRecordScore(existingBestScore);
  const normalizedCandidateScore = normalizeRecordScore(candidateScore);

  if (
    normalizedExistingBestScore === null ||
    normalizedCandidateScore === null
  ) {
    return null;
  }

  const status: ScoreAttackRecordStatus =
    normalizedCandidateScore > normalizedExistingBestScore
      ? "NEW_BEST"
      : normalizedCandidateScore === normalizedExistingBestScore
        ? "TIED_BEST"
        : "BELOW_BEST";

  return Object.freeze({
    modeId: SCORE_ATTACK_PROFILE.modeId,
    recordId: SCORE_ATTACK_RECORD_ID,
    projectionMode: "RECORD_PROJECTION_ONLY",
    durationCompatibilityMs: SCORE_ATTACK_DURATION_MS,
    normalizedExistingBestScore,
    normalizedCandidateScore,
    projectedBestScore: Math.max(
      normalizedExistingBestScore,
      normalizedCandidateScore,
    ),
    status,
    writesStorage: false,
    mutatesGlobalHighScore: false,
    mutatesGameStats: false,
    adoptsLiveMode: false,
  });
};
