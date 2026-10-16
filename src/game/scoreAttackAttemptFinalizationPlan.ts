import type { RuntimeCompletionSnapshot } from "./runtimeCompletionPolicy";
import {
  resolveScoreAttackRecordCommitEligibility,
  type ScoreAttackRecordCommitEligibilityProjection,
} from "./scoreAttackRecordCommitEligibility";
import type { ScoreAttackRuntimeActivationEnvelope } from "./scoreAttackRuntimeActivationEnvelope";
import {
  resolveScoreAttackTerminalCompletionDisposition,
  type ScoreAttackTerminalCompletionDisposition,
} from "./scoreAttackTerminalCompletionDisposition";
import { SCORE_ATTACK_DURATION_MS } from "./scoreAttackTimeboxProjection";

export type ScoreAttackAttemptFinalizationPlanKind =
  "SCORE_ATTACK_ATTEMPT_FINALIZATION_PLAN";
export type ScoreAttackAttemptFinalizationPlanMode = "FINALIZATION_ONLY";

export interface ScoreAttackAttemptFinalizationPlan {
  readonly kind: ScoreAttackAttemptFinalizationPlanKind;
  readonly finalizationMode: ScoreAttackAttemptFinalizationPlanMode;
  readonly modeId: "SCORE_ATTACK";
  readonly sourceRuntimeMode: "INFINITE";
  readonly exactDurationMs: typeof SCORE_ATTACK_DURATION_MS;
  readonly activationEnvelope: Readonly<ScoreAttackRuntimeActivationEnvelope>;
  readonly terminalDisposition: Readonly<ScoreAttackTerminalCompletionDisposition>;
  readonly recordEligibility: Readonly<ScoreAttackRecordCommitEligibilityProjection>;
  readonly completionFact: Readonly<{
    type: "TIMEBOX";
    durationMs: typeof SCORE_ATTACK_DURATION_MS;
    completed: true;
  }>;
  readonly disposition: "END_SCORE_ATTACK_ATTEMPT";
  readonly recordId: ScoreAttackRecordCommitEligibilityProjection["recordId"];
  readonly recordStatus: ScoreAttackRecordCommitEligibilityProjection["recordStatus"];
  readonly normalizedExistingBestScore: number;
  readonly normalizedCandidateScore: number;
  readonly projectedBestScore: number;
  readonly eligibleToAdvanceRecord: boolean;
  readonly preservesExactActivationEnvelopeIdentity: true;
  readonly delegatesTerminalResolutionToJ8J: true;
  readonly delegatesRecordEligibilityToJ8F: true;
  readonly advancesInfiniteRuntime: false;
  readonly writesStorage: false;
  readonly mutatesGameStats: false;
  readonly mutatesGlobalHighScore: false;
  readonly writesGenericRunPersistence: false;
  readonly writesRunArchive: false;
  readonly writesReactStateOrRefs: false;
  readonly transitionsResultUi: false;
  readonly startsOrTicksTimer: false;
  readonly ownsCompletionCursor: false;
  readonly advancesOrEndsSession: false;
}

export interface ScoreAttackAttemptFinalizationPlanAuthorityContract {
  readonly ownsAttemptFinalizationPlanCompositionAuthority: true;
  readonly ownsRuntimeActivationEnvelopeAuthority: false;
  readonly ownsTerminalCompletionDispositionAuthority: false;
  readonly ownsRuntimeCompletionEvaluationAuthority: false;
  readonly ownsRecordCommitEligibilityAuthority: false;
  readonly ownsDedicatedRecordProjectionAuthority: false;
  readonly ownsStorageWriteAuthority: false;
  readonly ownsGameStatsAuthority: false;
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

export const SCORE_ATTACK_ATTEMPT_FINALIZATION_PLAN_AUTHORITY_CONTRACT: Readonly<ScoreAttackAttemptFinalizationPlanAuthorityContract> =
  Object.freeze({
    ownsAttemptFinalizationPlanCompositionAuthority: true,
    ownsRuntimeActivationEnvelopeAuthority: false,
    ownsTerminalCompletionDispositionAuthority: false,
    ownsRuntimeCompletionEvaluationAuthority: false,
    ownsRecordCommitEligibilityAuthority: false,
    ownsDedicatedRecordProjectionAuthority: false,
    ownsStorageWriteAuthority: false,
    ownsGameStatsAuthority: false,
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

export const resolveScoreAttackAttemptFinalizationPlan = (
  activationEnvelope: Readonly<ScoreAttackRuntimeActivationEnvelope> | null,
  snapshot: RuntimeCompletionSnapshot,
  existingBestScore: number,
  candidateScore: number,
): Readonly<ScoreAttackAttemptFinalizationPlan> | null => {
  if (
    !activationEnvelope ||
    activationEnvelope.kind !== "SCORE_ATTACK_RUNTIME_ACTIVATION_ENVELOPE" ||
    activationEnvelope.activationMode !== "ACTIVATION_ONLY" ||
    activationEnvelope.modeId !== "SCORE_ATTACK" ||
    activationEnvelope.sourceRuntimeMode !== "INFINITE" ||
    activationEnvelope.runtimeProgression.mode !== "INFINITE" ||
    activationEnvelope.runtimeProgression !==
      activationEnvelope.bootstrapEnvelope.runtimeProgression ||
    activationEnvelope.runtimeSession !==
      activationEnvelope.bootstrapEnvelope.runtimeProgression.session ||
    activationEnvelope.runtimeProjectionBundle.descriptor !==
      activationEnvelope.effectiveDescriptor ||
    activationEnvelope.runtimeProjectionBundle.completionOverlay.descriptor !==
      activationEnvelope.effectiveDescriptor ||
    activationEnvelope.completionPolicy.type !== "TIMEBOX" ||
    activationEnvelope.completionPolicy.durationMs !==
      SCORE_ATTACK_DURATION_MS ||
    activationEnvelope.exactDurationMs !== SCORE_ATTACK_DURATION_MS
  ) {
    return null;
  }

  const terminalDisposition =
    resolveScoreAttackTerminalCompletionDisposition(
      activationEnvelope.bootstrapEnvelope,
      activationEnvelope.runtimeProjectionBundle.completionOverlay,
      snapshot,
    );

  if (
    !terminalDisposition ||
    terminalDisposition.modeId !== activationEnvelope.modeId ||
    terminalDisposition.sourceRuntimeMode !==
      activationEnvelope.sourceRuntimeMode ||
    terminalDisposition.disposition !== "END_SCORE_ATTACK_ATTEMPT" ||
    terminalDisposition.completionType !== "TIMEBOX" ||
    terminalDisposition.exactDurationMs !== SCORE_ATTACK_DURATION_MS ||
    terminalDisposition.advanceInfiniteRuntime !== false
  ) {
    return null;
  }

  const completionFact = Object.freeze({
    type: "TIMEBOX" as const,
    durationMs: SCORE_ATTACK_DURATION_MS,
    completed: true as const,
  });

  const recordEligibility = resolveScoreAttackRecordCommitEligibility(
    activationEnvelope.modeId,
    completionFact,
    existingBestScore,
    candidateScore,
  );

  if (
    !recordEligibility ||
    recordEligibility.modeId !== activationEnvelope.modeId ||
    recordEligibility.completionType !== "TIMEBOX" ||
    recordEligibility.durationMs !== SCORE_ATTACK_DURATION_MS
  ) {
    return null;
  }

  return Object.freeze({
    kind: "SCORE_ATTACK_ATTEMPT_FINALIZATION_PLAN",
    finalizationMode: "FINALIZATION_ONLY",
    modeId: activationEnvelope.modeId,
    sourceRuntimeMode: activationEnvelope.sourceRuntimeMode,
    exactDurationMs: SCORE_ATTACK_DURATION_MS,
    activationEnvelope,
    terminalDisposition,
    recordEligibility,
    completionFact,
    disposition: terminalDisposition.disposition,
    recordId: recordEligibility.recordId,
    recordStatus: recordEligibility.recordStatus,
    normalizedExistingBestScore:
      recordEligibility.normalizedExistingBestScore,
    normalizedCandidateScore: recordEligibility.normalizedCandidateScore,
    projectedBestScore: recordEligibility.projectedBestScore,
    eligibleToAdvanceRecord: recordEligibility.eligibleToAdvanceRecord,
    preservesExactActivationEnvelopeIdentity: true,
    delegatesTerminalResolutionToJ8J: true,
    delegatesRecordEligibilityToJ8F: true,
    advancesInfiniteRuntime: false,
    writesStorage: false,
    mutatesGameStats: false,
    mutatesGlobalHighScore: false,
    writesGenericRunPersistence: false,
    writesRunArchive: false,
    writesReactStateOrRefs: false,
    transitionsResultUi: false,
    startsOrTicksTimer: false,
    ownsCompletionCursor: false,
    advancesOrEndsSession: false,
  });
};
