import {
  resolveScoreAttackBootstrapEnvelope,
  type ScoreAttackBootstrapEnvelope,
} from "./scoreAttackBootstrapEnvelope";
import {
  resolveScoreAttackRuntimeProjectionBundle,
  type ScoreAttackRuntimeProjectionBundle,
} from "./scoreAttackRuntimeProjectionBundle";
import { SCORE_ATTACK_DURATION_MS } from "./scoreAttackTimeboxProjection";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";

export type ScoreAttackRuntimeActivationEnvelopeKind =
  "SCORE_ATTACK_RUNTIME_ACTIVATION_ENVELOPE";
export type ScoreAttackRuntimeActivationEnvelopeMode = "ACTIVATION_ONLY";

export interface ScoreAttackRuntimeActivationEnvelope {
  readonly kind: ScoreAttackRuntimeActivationEnvelopeKind;
  readonly activationMode: ScoreAttackRuntimeActivationEnvelopeMode;
  readonly modeId: "SCORE_ATTACK";
  readonly sourceRuntimeMode: "INFINITE";
  readonly seed: ScoreAttackBootstrapEnvelope["seed"];
  readonly exactDurationMs: typeof SCORE_ATTACK_DURATION_MS;
  readonly bootstrapEnvelope: Readonly<ScoreAttackBootstrapEnvelope>;
  readonly runtimeProgression: ScoreAttackBootstrapEnvelope["runtimeProgression"];
  readonly runtimeSession: ScoreAttackBootstrapEnvelope["runtimeProgression"]["session"];
  readonly runtimeProjectionBundle: Readonly<ScoreAttackRuntimeProjectionBundle>;
  readonly effectiveDescriptor: Readonly<RuntimeWaveDescriptor>;
  readonly canonicalFreshStart: ScoreAttackBootstrapEnvelope["canonicalFreshStart"];
  readonly completionPolicy: Readonly<{
    type: "TIMEBOX";
    durationMs: typeof SCORE_ATTACK_DURATION_MS;
  }>;
  readonly preservesCanonicalModeIdentityOutsideRuntimeDiscriminator: true;
  readonly preservesExactBootstrapRuntimeIdentity: true;
  readonly preservesExactBootstrapSessionIdentity: true;
  readonly preservesExactJ8KBundleIdentity: true;
  readonly preservesExactJ8KEffectiveDescriptorIdentity: true;
  readonly adaptiveInvasionBypassed: true;
  readonly dynamicEventAdoption: null;
  readonly bonusChallengeAdoption: null;
  readonly addsRuntimeProgressionDiscriminator: false;
  readonly writesRuntimeProjectionCache: false;
  readonly adoptsLiveRuntime: false;
  readonly writesReactStateOrRefs: false;
  readonly startsOrTicksTimer: false;
  readonly ownsCompletionCursor: false;
  readonly advancesOrEndsSession: false;
  readonly executesTerminalDisposition: false;
  readonly writesPersistence: false;
  readonly writesRunArchive: false;
  readonly writesScoreAttackRecord: false;
}

export interface ScoreAttackRuntimeActivationEnvelopeAuthorityContract {
  readonly ownsRuntimeActivationEnvelopeConstructionAuthority: true;
  readonly ownsModeIdentityAuthority: false;
  readonly ownsBootstrapEnvelopeAuthority: false;
  readonly ownsRuntimeProjectionBundleAuthority: false;
  readonly ownsDescriptorCompletionOverlayAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsGenericRuntimeProjectionCacheAuthority: false;
  readonly ownsAdaptiveInvasionAuthority: false;
  readonly ownsDynamicEventAuthority: false;
  readonly ownsBonusChallengeAuthority: false;
  readonly ownsTerminalCompletionDispositionAuthority: false;
  readonly ownsLiveAdoptionAuthority: false;
  readonly ownsTimerAuthority: false;
  readonly ownsCompletionCursorAuthority: false;
  readonly ownsClock: false;
  readonly ownsPauseAuthority: false;
  readonly ownsProgressionAuthority: false;
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

export const SCORE_ATTACK_RUNTIME_ACTIVATION_ENVELOPE_AUTHORITY_CONTRACT: Readonly<ScoreAttackRuntimeActivationEnvelopeAuthorityContract> =
  Object.freeze({
    ownsRuntimeActivationEnvelopeConstructionAuthority: true,
    ownsModeIdentityAuthority: false,
    ownsBootstrapEnvelopeAuthority: false,
    ownsRuntimeProjectionBundleAuthority: false,
    ownsDescriptorCompletionOverlayAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsGenericRuntimeProjectionCacheAuthority: false,
    ownsAdaptiveInvasionAuthority: false,
    ownsDynamicEventAuthority: false,
    ownsBonusChallengeAuthority: false,
    ownsTerminalCompletionDispositionAuthority: false,
    ownsLiveAdoptionAuthority: false,
    ownsTimerAuthority: false,
    ownsCompletionCursorAuthority: false,
    ownsClock: false,
    ownsPauseAuthority: false,
    ownsProgressionAuthority: false,
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

export const resolveScoreAttackRuntimeActivationEnvelope = (
  modeId: string,
): Readonly<ScoreAttackRuntimeActivationEnvelope> | null => {
  if (modeId !== "SCORE_ATTACK") {
    return null;
  }

  const bootstrapEnvelope = resolveScoreAttackBootstrapEnvelope(modeId);
  if (
    !bootstrapEnvelope ||
    bootstrapEnvelope.modeId !== "SCORE_ATTACK" ||
    bootstrapEnvelope.runtimeProgressionMode !== "INFINITE" ||
    bootstrapEnvelope.runtimeProgression.mode !== "INFINITE" ||
    bootstrapEnvelope.runtimeProgression.session.currentSector !== 11 ||
    bootstrapEnvelope.runtimeProgression.session.currentWaveNumber !== 1 ||
    bootstrapEnvelope.completionType !== "TIMEBOX" ||
    bootstrapEnvelope.exactDurationMs !== SCORE_ATTACK_DURATION_MS
  ) {
    return null;
  }

  const runtimeProjectionBundle =
    resolveScoreAttackRuntimeProjectionBundle(bootstrapEnvelope);
  if (
    !runtimeProjectionBundle ||
    runtimeProjectionBundle.modeId !== bootstrapEnvelope.modeId ||
    runtimeProjectionBundle.sourceRuntimeMode !==
      bootstrapEnvelope.runtimeProgression.mode ||
    runtimeProjectionBundle.descriptor.sourceMode !== "INFINITE" ||
    runtimeProjectionBundle.descriptor.sector !==
      bootstrapEnvelope.runtimeProgression.session.currentSector ||
    runtimeProjectionBundle.descriptor.waveNumber !==
      bootstrapEnvelope.runtimeProgression.session.currentWaveNumber ||
    runtimeProjectionBundle.descriptor.source.seed !== bootstrapEnvelope.seed ||
    runtimeProjectionBundle.descriptor.completionPolicy.type !== "TIMEBOX" ||
    runtimeProjectionBundle.descriptor.completionPolicy.durationMs !==
      SCORE_ATTACK_DURATION_MS ||
    runtimeProjectionBundle.adaptiveInvasionBypassed !== true ||
    runtimeProjectionBundle.usesLiveFollowerCount !== false ||
    runtimeProjectionBundle.dynamicEventAdoption !== null ||
    runtimeProjectionBundle.bonusChallengeAdoption !== null ||
    runtimeProjectionBundle.writesRuntimeProjectionCache !== false ||
    runtimeProjectionBundle.adoptsLiveRuntime !== false ||
    runtimeProjectionBundle.ownsTerminalDisposition !== false
  ) {
    return null;
  }

  const runtimeProgression = bootstrapEnvelope.runtimeProgression;
  const runtimeSession = runtimeProgression.session;
  const effectiveDescriptor = runtimeProjectionBundle.descriptor;
  const completionPolicy = Object.freeze({
    type: "TIMEBOX" as const,
    durationMs: SCORE_ATTACK_DURATION_MS,
  });

  return Object.freeze({
    kind: "SCORE_ATTACK_RUNTIME_ACTIVATION_ENVELOPE",
    activationMode: "ACTIVATION_ONLY",
    modeId: bootstrapEnvelope.modeId,
    sourceRuntimeMode: runtimeProgression.mode,
    seed: bootstrapEnvelope.seed,
    exactDurationMs: SCORE_ATTACK_DURATION_MS,
    bootstrapEnvelope,
    runtimeProgression,
    runtimeSession,
    runtimeProjectionBundle,
    effectiveDescriptor,
    canonicalFreshStart: bootstrapEnvelope.canonicalFreshStart,
    completionPolicy,
    preservesCanonicalModeIdentityOutsideRuntimeDiscriminator: true,
    preservesExactBootstrapRuntimeIdentity: true,
    preservesExactBootstrapSessionIdentity: true,
    preservesExactJ8KBundleIdentity: true,
    preservesExactJ8KEffectiveDescriptorIdentity: true,
    adaptiveInvasionBypassed: true,
    dynamicEventAdoption: null,
    bonusChallengeAdoption: null,
    addsRuntimeProgressionDiscriminator: false,
    writesRuntimeProjectionCache: false,
    adoptsLiveRuntime: false,
    writesReactStateOrRefs: false,
    startsOrTicksTimer: false,
    ownsCompletionCursor: false,
    advancesOrEndsSession: false,
    executesTerminalDisposition: false,
    writesPersistence: false,
    writesRunArchive: false,
    writesScoreAttackRecord: false,
  });
};
