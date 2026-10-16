import {
  isRuntimeWaveComplete,
  type RuntimeCompletionSnapshot,
} from "./runtimeCompletionPolicy";
import { resolveRuntimeWaveDescriptor } from "./runtimeProgressionRouter";
import type { ScoreAttackBootstrapEnvelope } from "./scoreAttackBootstrapEnvelope";
import {
  resolveScoreAttackRuntimeDescriptorCompletionOverlay,
  type ScoreAttackRuntimeDescriptorCompletionOverlay,
} from "./scoreAttackRuntimeDescriptorCompletionOverlay";
import { SCORE_ATTACK_DURATION_MS } from "./scoreAttackTimeboxProjection";

export type ScoreAttackTerminalCompletionDispositionKind =
  "SCORE_ATTACK_TERMINAL_COMPLETION_DISPOSITION";
export type ScoreAttackTerminalCompletionDispositionMode = "PROJECTION_ONLY";
export type ScoreAttackTerminalAction = "END_SCORE_ATTACK_ATTEMPT";

export interface ScoreAttackTerminalCompletionDisposition {
  readonly kind: ScoreAttackTerminalCompletionDispositionKind;
  readonly projectionMode: ScoreAttackTerminalCompletionDispositionMode;
  readonly modeId: "SCORE_ATTACK";
  readonly sourceRuntimeMode: "INFINITE";
  readonly completionType: "TIMEBOX";
  readonly exactDurationMs: typeof SCORE_ATTACK_DURATION_MS;
  readonly disposition: ScoreAttackTerminalAction;
  readonly completionEvaluatedByRuntimePolicy: true;
  readonly advanceInfiniteRuntime: false;
  readonly preservesNestedRuntimeDiscriminator: true;
  readonly mutatesSessionStatus: false;
  readonly callsSessionEnd: false;
  readonly writesRuntimeProjectionCache: false;
  readonly writesReactStateOrRefs: false;
  readonly transitionsResultUi: false;
  readonly writesPersistence: false;
  readonly writesRunArchive: false;
  readonly writesScoreAttackRecord: false;
}

export interface ScoreAttackTerminalCompletionDispositionAuthorityContract {
  readonly ownsTerminalCompletionDispositionProjectionAuthority: true;
  readonly ownsBootstrapEnvelopeAuthority: false;
  readonly ownsDescriptorCompletionOverlayAuthority: false;
  readonly ownsRuntimeCompletionEvaluationAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsInfiniteProgressionAuthority: false;
  readonly ownsSessionLifecycleAuthority: false;
  readonly ownsLiveAdoptionAuthority: false;
  readonly ownsRuntimeProjectionCacheAuthority: false;
  readonly ownsTimerAuthority: false;
  readonly ownsCompletionCursorAuthority: false;
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

export const SCORE_ATTACK_TERMINAL_COMPLETION_DISPOSITION_AUTHORITY_CONTRACT: Readonly<ScoreAttackTerminalCompletionDispositionAuthorityContract> =
  Object.freeze({
    ownsTerminalCompletionDispositionProjectionAuthority: true,
    ownsBootstrapEnvelopeAuthority: false,
    ownsDescriptorCompletionOverlayAuthority: false,
    ownsRuntimeCompletionEvaluationAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsInfiniteProgressionAuthority: false,
    ownsSessionLifecycleAuthority: false,
    ownsLiveAdoptionAuthority: false,
    ownsRuntimeProjectionCacheAuthority: false,
    ownsTimerAuthority: false,
    ownsCompletionCursorAuthority: false,
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

const overlaysAreCanonicallyEqual = (
  left: Readonly<ScoreAttackRuntimeDescriptorCompletionOverlay>,
  right: Readonly<ScoreAttackRuntimeDescriptorCompletionOverlay>,
) => JSON.stringify(left) === JSON.stringify(right);

export const resolveScoreAttackTerminalCompletionDisposition = (
  envelope: Readonly<ScoreAttackBootstrapEnvelope> | null,
  overlay: Readonly<ScoreAttackRuntimeDescriptorCompletionOverlay> | null,
  snapshot: RuntimeCompletionSnapshot,
): Readonly<ScoreAttackTerminalCompletionDisposition> | null => {
  if (
    !envelope ||
    !overlay ||
    envelope.kind !== "SCORE_ATTACK_BOOTSTRAP_ENVELOPE" ||
    envelope.modeId !== "SCORE_ATTACK" ||
    envelope.runtimeProgressionMode !== "INFINITE" ||
    envelope.runtimeProgression.mode !== "INFINITE" ||
    envelope.exactDurationMs !== SCORE_ATTACK_DURATION_MS ||
    envelope.completionType !== "TIMEBOX" ||
    overlay.kind !== "SCORE_ATTACK_RUNTIME_DESCRIPTOR_COMPLETION_OVERLAY" ||
    overlay.projectionMode !== "PROJECTION_ONLY" ||
    overlay.modeId !== envelope.modeId ||
    overlay.sourceRuntimeMode !== envelope.runtimeProgression.mode ||
    overlay.completionPolicy.type !== "TIMEBOX" ||
    overlay.completionPolicy.durationMs !== SCORE_ATTACK_DURATION_MS ||
    overlay.exactDurationMs !== SCORE_ATTACK_DURATION_MS ||
    overlay.descriptor.completionPolicy.type !== "TIMEBOX" ||
    overlay.descriptor.completionPolicy.durationMs !== SCORE_ATTACK_DURATION_MS
  ) {
    return null;
  }

  const baseDescriptor = resolveRuntimeWaveDescriptor(
    envelope.runtimeProgression,
  );
  const expectedOverlay =
    resolveScoreAttackRuntimeDescriptorCompletionOverlay(
      envelope,
      baseDescriptor,
    );

  if (
    !expectedOverlay ||
    !overlaysAreCanonicallyEqual(overlay, expectedOverlay)
  ) {
    return null;
  }

  if (!isRuntimeWaveComplete(overlay.descriptor, snapshot)) {
    return null;
  }

  return Object.freeze({
    kind: "SCORE_ATTACK_TERMINAL_COMPLETION_DISPOSITION",
    projectionMode: "PROJECTION_ONLY",
    modeId: envelope.modeId,
    sourceRuntimeMode: envelope.runtimeProgression.mode,
    completionType: overlay.completionPolicy.type,
    exactDurationMs: overlay.exactDurationMs,
    disposition: "END_SCORE_ATTACK_ATTEMPT",
    completionEvaluatedByRuntimePolicy: true,
    advanceInfiniteRuntime: false,
    preservesNestedRuntimeDiscriminator: true,
    mutatesSessionStatus: false,
    callsSessionEnd: false,
    writesRuntimeProjectionCache: false,
    writesReactStateOrRefs: false,
    transitionsResultUi: false,
    writesPersistence: false,
    writesRunArchive: false,
    writesScoreAttackRecord: false,
  });
};
