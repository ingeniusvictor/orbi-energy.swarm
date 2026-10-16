import {
  applyBonusChallengeRuntimeAdoption,
} from "./bonusChallengeRuntimeAdoption";
import {
  applyDynamicMidSectorEventRuntimeAdoption,
} from "./dynamicMidSectorEventRuntimeAdoption";
import {
  projectRuntimeCombatPressure,
  type RuntimeCombatPressureProjection,
} from "./runtimeCombatPressure";
import {
  projectInfiniteMilestoneEncounter,
  type InfiniteMilestoneEncounterProfile,
} from "./runtimeMilestoneEncounter";
import {
  getRuntimeMutatedEnemyBudget,
  projectRuntimeMutatorEffects,
  type RuntimeMutatorEffectProfile,
} from "./runtimeMutatorEffects";
import {
  resolveRuntimeWaveDescriptor,
} from "./runtimeProgressionRouter";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";
import type {
  ScoreAttackBootstrapEnvelope,
} from "./scoreAttackBootstrapEnvelope";
import {
  resolveScoreAttackRuntimeDescriptorCompletionOverlay,
  type ScoreAttackRuntimeDescriptorCompletionOverlay,
} from "./scoreAttackRuntimeDescriptorCompletionOverlay";
import { SCORE_ATTACK_DURATION_MS } from "./scoreAttackTimeboxProjection";

export type ScoreAttackRuntimeProjectionBundleKind =
  "SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE";
export type ScoreAttackRuntimeProjectionBundleMode = "PROJECTION_ONLY";

export interface ScoreAttackRuntimeProjectionBundle {
  readonly kind: ScoreAttackRuntimeProjectionBundleKind;
  readonly projectionMode: ScoreAttackRuntimeProjectionBundleMode;
  readonly modeId: "SCORE_ATTACK";
  readonly sourceRuntimeMode: "INFINITE";
  readonly exactDurationMs: typeof SCORE_ATTACK_DURATION_MS;
  readonly baseDescriptor: Readonly<RuntimeWaveDescriptor>;
  readonly completionOverlay: Readonly<ScoreAttackRuntimeDescriptorCompletionOverlay>;
  readonly descriptor: Readonly<RuntimeWaveDescriptor>;
  readonly combatPressure: Readonly<RuntimeCombatPressureProjection>;
  readonly mutatorEffects: Readonly<RuntimeMutatorEffectProfile>;
  readonly enemyBudget: number;
  readonly milestoneEncounter: Readonly<InfiniteMilestoneEncounterProfile> | null;
  readonly adaptiveInvasionApplied: false;
  readonly dynamicMidSectorEventAdoption: null;
  readonly bonusChallengeAdoption: null;
  readonly preservesScoreAttackCompletionOverlay: true;
  readonly preservesCanonicalDescriptorFacts: true;
  readonly verifiesDynamicEventIsolation: true;
  readonly verifiesBonusChallengeIsolation: true;
  readonly writesGenericRuntimeProjectionCache: false;
  readonly acceptsLiveFollowerCount: false;
  readonly adoptsLiveRuntime: false;
  readonly startsOrTicksTimer: false;
  readonly ownsCompletionCursor: false;
  readonly advancesSession: false;
  readonly writesReactStateOrRefs: false;
  readonly writesPersistence: false;
  readonly writesRunArchive: false;
}

export interface ScoreAttackRuntimeProjectionBundleAuthorityContract {
  readonly ownsScoreAttackRuntimeProjectionBundleCompositionAuthority: true;
  readonly ownsBootstrapEnvelopeAuthority: false;
  readonly ownsDescriptorCompletionOverlayAuthority: false;
  readonly ownsGenericRuntimeProjectionCacheAuthority: false;
  readonly ownsAdaptiveInvasionAuthority: false;
  readonly ownsDynamicEventSelectionAuthority: false;
  readonly ownsDynamicEventEffectAuthority: false;
  readonly ownsBonusChallengeSelectionAuthority: false;
  readonly ownsBonusChallengeEffectAuthority: false;
  readonly ownsCombatPressureAuthority: false;
  readonly ownsMutatorEffectAuthority: false;
  readonly ownsEnemyBudgetAuthority: false;
  readonly ownsMilestoneEncounterAuthority: false;
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

export const SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE_AUTHORITY_CONTRACT: Readonly<ScoreAttackRuntimeProjectionBundleAuthorityContract> =
  Object.freeze({
    ownsScoreAttackRuntimeProjectionBundleCompositionAuthority: true,
    ownsBootstrapEnvelopeAuthority: false,
    ownsDescriptorCompletionOverlayAuthority: false,
    ownsGenericRuntimeProjectionCacheAuthority: false,
    ownsAdaptiveInvasionAuthority: false,
    ownsDynamicEventSelectionAuthority: false,
    ownsDynamicEventEffectAuthority: false,
    ownsBonusChallengeSelectionAuthority: false,
    ownsBonusChallengeEffectAuthority: false,
    ownsCombatPressureAuthority: false,
    ownsMutatorEffectAuthority: false,
    ownsEnemyBudgetAuthority: false,
    ownsMilestoneEncounterAuthority: false,
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

const descriptorsAreCanonicallyEqual = (
  left: Readonly<RuntimeWaveDescriptor>,
  right: Readonly<RuntimeWaveDescriptor>,
) => JSON.stringify(left) === JSON.stringify(right);

export const resolveScoreAttackRuntimeProjectionBundle = (
  envelope: Readonly<ScoreAttackBootstrapEnvelope> | null,
): Readonly<ScoreAttackRuntimeProjectionBundle> | null => {
  if (
    !envelope ||
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

  const baseDescriptor = resolveRuntimeWaveDescriptor(
    envelope.runtimeProgression,
  );
  const completionOverlay =
    resolveScoreAttackRuntimeDescriptorCompletionOverlay(
      envelope,
      baseDescriptor,
    );

  if (
    !completionOverlay ||
    completionOverlay.modeId !== "SCORE_ATTACK" ||
    completionOverlay.sourceRuntimeMode !== "INFINITE" ||
    completionOverlay.sourceCompletionType !== "BUDGET_AND_CLEAR" ||
    completionOverlay.exactDurationMs !== SCORE_ATTACK_DURATION_MS ||
    completionOverlay.completionPolicy.type !== "TIMEBOX" ||
    completionOverlay.completionPolicy.durationMs !== SCORE_ATTACK_DURATION_MS ||
    completionOverlay.changesOnlyCompletionPolicy !== true ||
    completionOverlay.adoptsLiveRuntime !== false ||
    completionOverlay.writesRuntimeProjectionCache !== false
  ) {
    return null;
  }

  const descriptor = completionOverlay.descriptor;
  if (
    descriptor.sourceMode !== "INFINITE" ||
    descriptor.sector !== envelope.canonicalFreshStart.sector ||
    descriptor.waveNumber !== envelope.canonicalFreshStart.wave ||
    descriptor.source.seed !== envelope.seed ||
    descriptor.completionPolicy.type !== "TIMEBOX" ||
    descriptor.completionPolicy.durationMs !== SCORE_ATTACK_DURATION_MS
  ) {
    return null;
  }

  const dynamicEventCompatibility =
    applyDynamicMidSectorEventRuntimeAdoption(
      envelope.runtimeProgression,
      descriptor,
    );
  if (
    dynamicEventCompatibility.adoption !== null ||
    dynamicEventCompatibility.descriptor !== descriptor ||
    !descriptorsAreCanonicallyEqual(
      dynamicEventCompatibility.descriptor,
      descriptor,
    )
  ) {
    return null;
  }

  const bonusChallengeCompatibility =
    applyBonusChallengeRuntimeAdoption(
      envelope.runtimeProgression,
      descriptor,
    );
  if (
    bonusChallengeCompatibility.adoption !== null ||
    bonusChallengeCompatibility.descriptor !== descriptor ||
    !descriptorsAreCanonicallyEqual(
      bonusChallengeCompatibility.descriptor,
      descriptor,
    )
  ) {
    return null;
  }

  const combatPressure = projectRuntimeCombatPressure(descriptor);
  const mutatorEffects = projectRuntimeMutatorEffects(descriptor);
  const enemyBudget = getRuntimeMutatedEnemyBudget(descriptor);
  const milestoneEncounter = projectInfiniteMilestoneEncounter(descriptor);

  Object.freeze(combatPressure);
  Object.freeze(mutatorEffects.activeMutators);
  Object.freeze(mutatorEffects);
  if (milestoneEncounter) Object.freeze(milestoneEncounter);

  return Object.freeze({
    kind: "SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE",
    projectionMode: "PROJECTION_ONLY",
    modeId: envelope.modeId,
    sourceRuntimeMode: envelope.runtimeProgression.mode,
    exactDurationMs: SCORE_ATTACK_DURATION_MS,
    baseDescriptor,
    completionOverlay,
    descriptor,
    combatPressure,
    mutatorEffects,
    enemyBudget,
    milestoneEncounter,
    adaptiveInvasionApplied: false,
    dynamicMidSectorEventAdoption: null,
    bonusChallengeAdoption: null,
    preservesScoreAttackCompletionOverlay: true,
    preservesCanonicalDescriptorFacts: true,
    verifiesDynamicEventIsolation: true,
    verifiesBonusChallengeIsolation: true,
    writesGenericRuntimeProjectionCache: false,
    acceptsLiveFollowerCount: false,
    adoptsLiveRuntime: false,
    startsOrTicksTimer: false,
    ownsCompletionCursor: false,
    advancesSession: false,
    writesReactStateOrRefs: false,
    writesPersistence: false,
    writesRunArchive: false,
  });
};
