import type { RuntimeCompletionSnapshot } from "./runtimeCompletionPolicy";
import type { RuntimeProgressionState } from "./runtimeProgressionRouter";
import {
  resolveScoreAttackAttemptFinalizationPlan,
  type ScoreAttackAttemptFinalizationPlan,
} from "./scoreAttackAttemptFinalizationPlan";
import {
  resolveScoreAttackRuntimeActivationEnvelope,
  type ScoreAttackRuntimeActivationEnvelope,
} from "./scoreAttackRuntimeActivationEnvelope";
import type { ScoreAttackRuntimeProjectionBundle } from "./scoreAttackRuntimeProjectionBundle";
import {
  applyScoreAttackStatsCommit,
  type ScoreAttackStatsCommitApplication,
} from "./scoreAttackStatsCommitApplication";
import type { GameStats } from "./types";

export type ScoreAttackLiveEngineStartMode = "CAMPAIGN" | "SCORE_ATTACK";
export type ScoreAttackLiveEngineActivation =
  Readonly<ScoreAttackRuntimeActivationEnvelope>;

export interface ScoreAttackLiveEngineTerminalApplication {
  readonly kind: "SCORE_ATTACK_LIVE_ENGINE_TERMINAL_APPLICATION";
  readonly modeId: "SCORE_ATTACK";
  readonly activationEnvelope: ScoreAttackLiveEngineActivation;
  readonly finalizationPlan: Readonly<ScoreAttackAttemptFinalizationPlan>;
  readonly statsCommitApplication: Readonly<ScoreAttackStatsCommitApplication>;
  readonly recordChanged: boolean;
  readonly stats: Readonly<GameStats>;
  readonly endsAttempt: true;
  readonly advancesInfiniteRuntime: false;
  readonly skipsGenericRunPersistence: true;
  readonly writesStorageDirectly: false;
  readonly transitionsResultUi: false;
}

export interface ScoreAttackLiveEngineLifecycleAuthorityContract {
  readonly ownsControlledLiveEngineCoordinationAuthority: true;
  readonly ownsRuntimeActivationEnvelopeAuthority: false;
  readonly ownsRuntimeProjectionBundleAuthority: false;
  readonly ownsAttemptFinalizationPlanAuthority: false;
  readonly ownsDedicatedStatsCommitAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsInfiniteProgressionAuthority: false;
  readonly ownsGenericRuntimeProjectionCacheAuthority: false;
  readonly ownsTimerAuthority: false;
  readonly ownsCompletionCursorAuthority: false;
  readonly ownsClock: false;
  readonly ownsStorageWriteAuthority: false;
  readonly ownsGenericRunPersistenceAuthority: false;
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
  readonly ownsFullArrayScan: false;
}

export const SCORE_ATTACK_LIVE_ENGINE_LIFECYCLE_AUTHORITY_CONTRACT: Readonly<ScoreAttackLiveEngineLifecycleAuthorityContract> =
  Object.freeze({
    ownsControlledLiveEngineCoordinationAuthority: true,
    ownsRuntimeActivationEnvelopeAuthority: false,
    ownsRuntimeProjectionBundleAuthority: false,
    ownsAttemptFinalizationPlanAuthority: false,
    ownsDedicatedStatsCommitAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsInfiniteProgressionAuthority: false,
    ownsGenericRuntimeProjectionCacheAuthority: false,
    ownsTimerAuthority: false,
    ownsCompletionCursorAuthority: false,
    ownsClock: false,
    ownsStorageWriteAuthority: false,
    ownsGenericRunPersistenceAuthority: false,
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
    ownsFullArrayScan: false,
  });

const activationMatchesRuntime = (
  activation: ScoreAttackLiveEngineActivation,
  runtimeProgression: RuntimeProgressionState,
) =>
  activation.kind === "SCORE_ATTACK_RUNTIME_ACTIVATION_ENVELOPE" &&
  activation.activationMode === "ACTIVATION_ONLY" &&
  activation.modeId === "SCORE_ATTACK" &&
  activation.sourceRuntimeMode === "INFINITE" &&
  runtimeProgression === activation.runtimeProgression &&
  runtimeProgression.mode === "INFINITE" &&
  runtimeProgression.session === activation.runtimeSession &&
  activation.runtimeProjectionBundle.descriptor ===
    activation.effectiveDescriptor &&
  activation.completionPolicy.type === "TIMEBOX" &&
  activation.completionPolicy.durationMs === activation.exactDurationMs;

export const resolveScoreAttackLiveEngineActivation = (
  mode: ScoreAttackLiveEngineStartMode,
): ScoreAttackLiveEngineActivation | null => {
  if (mode !== "SCORE_ATTACK") return null;
  return resolveScoreAttackRuntimeActivationEnvelope(mode);
};

export const resolveScoreAttackLiveRuntimeProjection = (
  activation: ScoreAttackLiveEngineActivation | null,
  runtimeProgression: RuntimeProgressionState,
): Readonly<ScoreAttackRuntimeProjectionBundle> | null => {
  if (!activation || !activationMatchesRuntime(activation, runtimeProgression)) {
    return null;
  }
  return activation.runtimeProjectionBundle;
};

export const resolveScoreAttackLiveTerminalApplication = (
  activation: ScoreAttackLiveEngineActivation | null,
  runtimeProgression: RuntimeProgressionState,
  snapshot: RuntimeCompletionSnapshot,
  stats: Readonly<GameStats> | null,
  candidateScore: number,
): Readonly<ScoreAttackLiveEngineTerminalApplication> | null => {
  if (
    !activation ||
    !stats ||
    !activationMatchesRuntime(activation, runtimeProgression)
  ) {
    return null;
  }

  const finalizationPlan = resolveScoreAttackAttemptFinalizationPlan(
    activation,
    snapshot,
    stats.scoreAttackBestScore,
    candidateScore,
  );
  if (
    !finalizationPlan ||
    finalizationPlan.activationEnvelope !== activation ||
    finalizationPlan.advancesInfiniteRuntime !== false ||
    finalizationPlan.writesGenericRunPersistence !== false
  ) {
    return null;
  }

  const statsCommitApplication = applyScoreAttackStatsCommit(
    stats,
    finalizationPlan,
  );
  if (
    !statsCommitApplication ||
    statsCommitApplication.finalizationPlan !== finalizationPlan ||
    statsCommitApplication.preservesGlobalHighScore !== true ||
    statsCommitApplication.preservesGenericRunPersistence !== true ||
    statsCommitApplication.preservesRunArchive !== true ||
    statsCommitApplication.writesStorage !== false ||
    statsCommitApplication.callsApplyFinalRunCommit !== false
  ) {
    return null;
  }

  return Object.freeze({
    kind: "SCORE_ATTACK_LIVE_ENGINE_TERMINAL_APPLICATION",
    modeId: "SCORE_ATTACK",
    activationEnvelope: activation,
    finalizationPlan,
    statsCommitApplication,
    recordChanged: statsCommitApplication.changedDedicatedRecord,
    stats: statsCommitApplication.stats,
    endsAttempt: true,
    advancesInfiniteRuntime: false,
    skipsGenericRunPersistence: true,
    writesStorageDirectly: false,
    transitionsResultUi: false,
  });
};
