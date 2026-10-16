import type { GameStats } from "./types";
import type { ScoreAttackAttemptFinalizationPlan } from "./scoreAttackAttemptFinalizationPlan";
import {
  SCORE_ATTACK_RECORD_ID,
  resolveScoreAttackRecordProjection,
  type ScoreAttackRecordStatus,
} from "./scoreAttackRecordProjection";
import { SCORE_ATTACK_DURATION_MS } from "./scoreAttackTimeboxProjection";

export type ScoreAttackStatsCommitApplicationKind =
  "SCORE_ATTACK_STATS_COMMIT_APPLICATION";
export type ScoreAttackStatsCommitApplicationMode = "STATS_APPLICATION_ONLY";
export type ScoreAttackStatsCommitDisposition =
  | "APPLIED_NEW_BEST"
  | "NO_CHANGE_TIED_BEST"
  | "NO_CHANGE_BELOW_BEST";

export interface ScoreAttackStatsCommitApplication {
  readonly kind: ScoreAttackStatsCommitApplicationKind;
  readonly applicationMode: ScoreAttackStatsCommitApplicationMode;
  readonly modeId: "SCORE_ATTACK";
  readonly recordId: typeof SCORE_ATTACK_RECORD_ID;
  readonly sourceRecordStatus: ScoreAttackRecordStatus;
  readonly disposition: ScoreAttackStatsCommitDisposition;
  readonly previousBestScore: number;
  readonly nextBestScore: number;
  readonly changedDedicatedRecord: boolean;
  readonly finalizationPlan: Readonly<ScoreAttackAttemptFinalizationPlan>;
  readonly stats: Readonly<GameStats>;
  readonly preservesGlobalHighScore: true;
  readonly preservesGenericRunPersistence: true;
  readonly preservesRunArchive: true;
  readonly writesStorage: false;
  readonly callsSaveGameStats: false;
  readonly callsApplyFinalRunCommit: false;
  readonly writesReactStateOrRefs: false;
  readonly advancesRuntimeOrSession: false;
}

export interface ScoreAttackStatsCommitApplicationAuthorityContract {
  readonly ownsDedicatedStatsCommitApplicationAuthority: true;
  readonly ownsDedicatedRecordProjectionAuthority: false;
  readonly ownsAttemptFinalizationPlanAuthority: false;
  readonly ownsStorageWriteAuthority: false;
  readonly ownsStorageSchemaAuthority: false;
  readonly ownsGlobalHighScoreAuthority: false;
  readonly ownsGenericRunPersistenceAuthority: false;
  readonly ownsRunArchiveAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsInfiniteProgressionAuthority: false;
  readonly ownsSessionLifecycleAuthority: false;
  readonly ownsLiveAdoptionAuthority: false;
  readonly ownsTimerAuthority: false;
  readonly ownsCompletionCursorAuthority: false;
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
  readonly ownsFullArrayScan: false;
  readonly mayLookupEntities: false;
  readonly mayMutateEntities: false;
  readonly mayMutateGlobalCaps: false;
  readonly mayCreateEntities: false;
  readonly mayRemoveEntities: false;
}

export const SCORE_ATTACK_STATS_COMMIT_APPLICATION_AUTHORITY_CONTRACT: Readonly<ScoreAttackStatsCommitApplicationAuthorityContract> =
  Object.freeze({
    ownsDedicatedStatsCommitApplicationAuthority: true,
    ownsDedicatedRecordProjectionAuthority: false,
    ownsAttemptFinalizationPlanAuthority: false,
    ownsStorageWriteAuthority: false,
    ownsStorageSchemaAuthority: false,
    ownsGlobalHighScoreAuthority: false,
    ownsGenericRunPersistenceAuthority: false,
    ownsRunArchiveAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsInfiniteProgressionAuthority: false,
    ownsSessionLifecycleAuthority: false,
    ownsLiveAdoptionAuthority: false,
    ownsTimerAuthority: false,
    ownsCompletionCursorAuthority: false,
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
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

const resolveNormalizedCurrentBest = (value: number): number | null => {
  const projection = resolveScoreAttackRecordProjection(
    "SCORE_ATTACK",
    value,
    value,
  );
  return projection?.normalizedExistingBestScore ?? null;
};

export const applyScoreAttackStatsCommit = (
  stats: Readonly<GameStats>,
  finalizationPlan: Readonly<ScoreAttackAttemptFinalizationPlan> | null,
): Readonly<ScoreAttackStatsCommitApplication> | null => {
  if (
    !finalizationPlan ||
    finalizationPlan.kind !== "SCORE_ATTACK_ATTEMPT_FINALIZATION_PLAN" ||
    finalizationPlan.finalizationMode !== "FINALIZATION_ONLY" ||
    finalizationPlan.modeId !== "SCORE_ATTACK" ||
    finalizationPlan.disposition !== "END_SCORE_ATTACK_ATTEMPT" ||
    finalizationPlan.recordId !== SCORE_ATTACK_RECORD_ID ||
    finalizationPlan.completionFact.type !== "TIMEBOX" ||
    finalizationPlan.completionFact.durationMs !== SCORE_ATTACK_DURATION_MS ||
    finalizationPlan.completionFact.completed !== true ||
    finalizationPlan.exactDurationMs !== SCORE_ATTACK_DURATION_MS ||
    finalizationPlan.recordEligibility.recordId !== SCORE_ATTACK_RECORD_ID ||
    finalizationPlan.recordEligibility.recordStatus !==
      finalizationPlan.recordStatus ||
    finalizationPlan.recordEligibility.normalizedExistingBestScore !==
      finalizationPlan.normalizedExistingBestScore ||
    finalizationPlan.recordEligibility.normalizedCandidateScore !==
      finalizationPlan.normalizedCandidateScore ||
    finalizationPlan.recordEligibility.projectedBestScore !==
      finalizationPlan.projectedBestScore ||
    finalizationPlan.recordEligibility.eligibleToAdvanceRecord !==
      finalizationPlan.eligibleToAdvanceRecord
  ) {
    return null;
  }

  const normalizedCurrentBest = resolveNormalizedCurrentBest(
    stats.scoreAttackBestScore,
  );
  if (
    normalizedCurrentBest === null ||
    normalizedCurrentBest !== finalizationPlan.normalizedExistingBestScore
  ) {
    return null;
  }

  const status = finalizationPlan.recordStatus;
  let disposition: ScoreAttackStatsCommitDisposition;
  let nextBestScore = normalizedCurrentBest;
  let changedDedicatedRecord = false;

  if (status === "NEW_BEST") {
    if (
      !finalizationPlan.eligibleToAdvanceRecord ||
      finalizationPlan.projectedBestScore <= normalizedCurrentBest ||
      finalizationPlan.projectedBestScore !==
        finalizationPlan.normalizedCandidateScore
    ) {
      return null;
    }
    disposition = "APPLIED_NEW_BEST";
    nextBestScore = finalizationPlan.projectedBestScore;
    changedDedicatedRecord = true;
  } else if (status === "TIED_BEST") {
    if (
      finalizationPlan.eligibleToAdvanceRecord ||
      finalizationPlan.projectedBestScore !== normalizedCurrentBest ||
      finalizationPlan.normalizedCandidateScore !== normalizedCurrentBest
    ) {
      return null;
    }
    disposition = "NO_CHANGE_TIED_BEST";
  } else if (status === "BELOW_BEST") {
    if (
      finalizationPlan.eligibleToAdvanceRecord ||
      finalizationPlan.projectedBestScore !== normalizedCurrentBest ||
      finalizationPlan.normalizedCandidateScore >= normalizedCurrentBest
    ) {
      return null;
    }
    disposition = "NO_CHANGE_BELOW_BEST";
  } else {
    return null;
  }

  const nextStats: Readonly<GameStats> = Object.freeze(
    changedDedicatedRecord
      ? {
          ...stats,
          scoreAttackBestScore: nextBestScore,
        }
      : { ...stats },
  );

  return Object.freeze({
    kind: "SCORE_ATTACK_STATS_COMMIT_APPLICATION",
    applicationMode: "STATS_APPLICATION_ONLY",
    modeId: "SCORE_ATTACK",
    recordId: SCORE_ATTACK_RECORD_ID,
    sourceRecordStatus: status,
    disposition,
    previousBestScore: normalizedCurrentBest,
    nextBestScore,
    changedDedicatedRecord,
    finalizationPlan,
    stats: nextStats,
    preservesGlobalHighScore: true,
    preservesGenericRunPersistence: true,
    preservesRunArchive: true,
    writesStorage: false,
    callsSaveGameStats: false,
    callsApplyFinalRunCommit: false,
    writesReactStateOrRefs: false,
    advancesRuntimeOrSession: false,
  });
};
