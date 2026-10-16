import {
  resolveRuntimeWaveDescriptor,
} from "./runtimeProgressionRouter";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";
import {
  SCORE_ATTACK_DURATION_MS,
} from "./scoreAttackTimeboxProjection";
import type {
  ScoreAttackBootstrapEnvelope,
} from "./scoreAttackBootstrapEnvelope";

export type ScoreAttackRuntimeDescriptorCompletionOverlayKind =
  "SCORE_ATTACK_RUNTIME_DESCRIPTOR_COMPLETION_OVERLAY";
export type ScoreAttackRuntimeDescriptorCompletionOverlayMode =
  "PROJECTION_ONLY";

export interface ScoreAttackRuntimeDescriptorCompletionOverlay {
  readonly kind: ScoreAttackRuntimeDescriptorCompletionOverlayKind;
  readonly projectionMode: ScoreAttackRuntimeDescriptorCompletionOverlayMode;
  readonly modeId: "SCORE_ATTACK";
  readonly sourceRuntimeMode: "INFINITE";
  readonly sourceCompletionType: "BUDGET_AND_CLEAR";
  readonly exactDurationMs: typeof SCORE_ATTACK_DURATION_MS;
  readonly completionPolicy: Readonly<{
    type: "TIMEBOX";
    durationMs: typeof SCORE_ATTACK_DURATION_MS;
  }>;
  readonly descriptor: Readonly<RuntimeWaveDescriptor>;
  readonly preservesDescriptorIdentity: true;
  readonly preservesDescriptorDisplay: true;
  readonly preservesBiomeIntent: true;
  readonly preservesSpawnSemantics: true;
  readonly preservesModifiers: true;
  readonly preservesPressureSemantics: true;
  readonly preservesRewardSemantics: true;
  readonly preservesMilestoneSemantics: true;
  readonly preservesFairnessSemantics: true;
  readonly preservesSourceFacts: true;
  readonly changesOnlyCompletionPolicy: true;
  readonly preservesCanonicalModeIdentityOutsideRuntimeDiscriminator: true;
  readonly adoptsLiveRuntime: false;
  readonly writesRuntimeProjectionCache: false;
  readonly startsOrTicksTimer: false;
  readonly ownsCompletionCursor: false;
  readonly advancesSession: false;
  readonly writesReactStateOrRefs: false;
  readonly writesPersistence: false;
  readonly writesRunArchive: false;
}

export interface ScoreAttackRuntimeDescriptorCompletionOverlayAuthorityContract {
  readonly ownsDescriptorCompletionOverlayProjectionAuthority: true;
  readonly ownsBootstrapEnvelopeAuthority: false;
  readonly ownsModeIdentityAuthority: false;
  readonly ownsRunRecipeAuthority: false;
  readonly ownsSeedPolicyAuthority: false;
  readonly ownsRuntimeDescriptorConstructionAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsProgressionAuthority: false;
  readonly ownsExactDurationAuthority: false;
  readonly ownsCompletionProjectionAuthority: false;
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

export const SCORE_ATTACK_RUNTIME_DESCRIPTOR_COMPLETION_OVERLAY_AUTHORITY_CONTRACT: Readonly<ScoreAttackRuntimeDescriptorCompletionOverlayAuthorityContract> =
  Object.freeze({
    ownsDescriptorCompletionOverlayProjectionAuthority: true,
    ownsBootstrapEnvelopeAuthority: false,
    ownsModeIdentityAuthority: false,
    ownsRunRecipeAuthority: false,
    ownsSeedPolicyAuthority: false,
    ownsRuntimeDescriptorConstructionAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsProgressionAuthority: false,
    ownsExactDurationAuthority: false,
    ownsCompletionProjectionAuthority: false,
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

const descriptorsAreCanonicallyEqual = (
  left: RuntimeWaveDescriptor,
  right: RuntimeWaveDescriptor,
) => JSON.stringify(left) === JSON.stringify(right);

export const resolveScoreAttackRuntimeDescriptorCompletionOverlay = (
  envelope: Readonly<ScoreAttackBootstrapEnvelope> | null,
  descriptor: RuntimeWaveDescriptor | null,
): Readonly<ScoreAttackRuntimeDescriptorCompletionOverlay> | null => {
  if (
    !envelope ||
    !descriptor ||
    envelope.kind !== "SCORE_ATTACK_BOOTSTRAP_ENVELOPE" ||
    envelope.bootstrapMode !== "BOOTSTRAP_ONLY" ||
    envelope.modeId !== "SCORE_ATTACK" ||
    envelope.runtimeProgressionMode !== "INFINITE" ||
    envelope.runtimeProgression.mode !== "INFINITE" ||
    envelope.completionType !== "TIMEBOX" ||
    envelope.exactDurationMs !== SCORE_ATTACK_DURATION_MS ||
    envelope.addsRuntimeProgressionDiscriminator !== false ||
    envelope.adoptsLiveRuntime !== false
  ) {
    return null;
  }

  const session = envelope.runtimeProgression.session;
  if (
    session.status !== "ACTIVE" ||
    session.seed !== envelope.seed ||
    session.currentSector !== envelope.canonicalFreshStart.sector ||
    session.currentWaveNumber !== envelope.canonicalFreshStart.wave ||
    session.sectorsCompleted !== envelope.canonicalFreshStart.sectorsCompleted ||
    session.wavesCompleted !== envelope.canonicalFreshStart.wavesCompleted ||
    envelope.canonicalFreshStart.status !== "ACTIVE"
  ) {
    return null;
  }

  const canonicalDescriptor = resolveRuntimeWaveDescriptor(
    envelope.runtimeProgression,
  );
  if (
    !descriptorsAreCanonicallyEqual(descriptor, canonicalDescriptor) ||
    descriptor.sourceMode !== "INFINITE" ||
    descriptor.sector !== envelope.canonicalFreshStart.sector ||
    descriptor.waveNumber !== envelope.canonicalFreshStart.wave ||
    descriptor.source.seed !== envelope.seed ||
    descriptor.completionPolicy.type !== "BUDGET_AND_CLEAR"
  ) {
    return null;
  }

  const completionPolicy = Object.freeze({
    type: "TIMEBOX" as const,
    durationMs: SCORE_ATTACK_DURATION_MS,
  });

  const projectedDescriptor: Readonly<RuntimeWaveDescriptor> = Object.freeze({
    ...descriptor,
    completionPolicy,
  });

  return Object.freeze({
    kind: "SCORE_ATTACK_RUNTIME_DESCRIPTOR_COMPLETION_OVERLAY",
    projectionMode: "PROJECTION_ONLY",
    modeId: envelope.modeId,
    sourceRuntimeMode: envelope.runtimeProgression.mode,
    sourceCompletionType: "BUDGET_AND_CLEAR",
    exactDurationMs: SCORE_ATTACK_DURATION_MS,
    completionPolicy,
    descriptor: projectedDescriptor,
    preservesDescriptorIdentity: true,
    preservesDescriptorDisplay: true,
    preservesBiomeIntent: true,
    preservesSpawnSemantics: true,
    preservesModifiers: true,
    preservesPressureSemantics: true,
    preservesRewardSemantics: true,
    preservesMilestoneSemantics: true,
    preservesFairnessSemantics: true,
    preservesSourceFacts: true,
    changesOnlyCompletionPolicy: true,
    preservesCanonicalModeIdentityOutsideRuntimeDiscriminator: true,
    adoptsLiveRuntime: false,
    writesRuntimeProjectionCache: false,
    startsOrTicksTimer: false,
    ownsCompletionCursor: false,
    advancesSession: false,
    writesReactStateOrRefs: false,
    writesPersistence: false,
    writesRunArchive: false,
  });
};
