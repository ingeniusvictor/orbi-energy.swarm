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
import { resolveRuntimeWaveDescriptor } from "./runtimeProgressionRouter";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";
import type { ScoreAttackBootstrapEnvelope } from "./scoreAttackBootstrapEnvelope";
import {
  resolveScoreAttackRuntimeDescriptorCompletionOverlay,
  type ScoreAttackRuntimeDescriptorCompletionOverlay,
} from "./scoreAttackRuntimeDescriptorCompletionOverlay";

export type ScoreAttackRuntimeProjectionBundleKind =
  "SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE";
export type ScoreAttackRuntimeProjectionBundleMode = "PROJECTION_ONLY";

export interface ScoreAttackRuntimeProjectionBundle {
  readonly kind: ScoreAttackRuntimeProjectionBundleKind;
  readonly projectionMode: ScoreAttackRuntimeProjectionBundleMode;
  readonly modeId: "SCORE_ATTACK";
  readonly sourceRuntimeMode: "INFINITE";
  readonly descriptor: Readonly<RuntimeWaveDescriptor>;
  readonly completionOverlay: Readonly<ScoreAttackRuntimeDescriptorCompletionOverlay>;
  readonly combatPressure: Readonly<RuntimeCombatPressureProjection>;
  readonly mutatorEffects: Readonly<RuntimeMutatorEffectProfile>;
  readonly enemyBudget: number;
  readonly milestoneEncounter: Readonly<InfiniteMilestoneEncounterProfile> | null;
  readonly adaptiveInvasionBypassed: true;
  readonly usesLiveFollowerCount: false;
  readonly dynamicEventCompatibilityChecked: true;
  readonly dynamicEventAdoption: null;
  readonly bonusChallengeCompatibilityChecked: true;
  readonly bonusChallengeAdoption: null;
  readonly preservesJ8IEffectiveDescriptor: true;
  readonly preservesCanonicalRecipeComparability: true;
  readonly writesRuntimeProjectionCache: false;
  readonly adoptsLiveRuntime: false;
  readonly writesReactStateOrRefs: false;
  readonly startsOrTicksTimer: false;
  readonly ownsTerminalDisposition: false;
  readonly writesPersistence: false;
  readonly writesRunArchive: false;
  readonly writesScoreAttackRecord: false;
}

export interface ScoreAttackRuntimeProjectionBundleAuthorityContract {
  readonly ownsScoreAttackRuntimeProjectionBundleAuthority: true;
  readonly ownsBootstrapEnvelopeAuthority: false;
  readonly ownsDescriptorCompletionOverlayAuthority: false;
  readonly ownsGenericRuntimeProjectionCacheAuthority: false;
  readonly ownsAdaptiveInvasionAuthority: false;
  readonly ownsDynamicEventOpportunityAuthority: false;
  readonly ownsDynamicEventSelectionAuthority: false;
  readonly ownsDynamicEventAdoptionAuthority: false;
  readonly ownsBonusChallengeOpportunityAuthority: false;
  readonly ownsBonusChallengeAdoptionAuthority: false;
  readonly ownsCombatPressureAuthority: false;
  readonly ownsMutatorEffectAuthority: false;
  readonly ownsEnemyBudgetAuthority: false;
  readonly ownsMilestoneEncounterAuthority: false;
  readonly ownsTerminalCompletionDispositionAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsProgressionAuthority: false;
  readonly ownsLiveAdoptionAuthority: false;
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

export const SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE_AUTHORITY_CONTRACT: Readonly<ScoreAttackRuntimeProjectionBundleAuthorityContract> =
  Object.freeze({
    ownsScoreAttackRuntimeProjectionBundleAuthority: true,
    ownsBootstrapEnvelopeAuthority: false,
    ownsDescriptorCompletionOverlayAuthority: false,
    ownsGenericRuntimeProjectionCacheAuthority: false,
    ownsAdaptiveInvasionAuthority: false,
    ownsDynamicEventOpportunityAuthority: false,
    ownsDynamicEventSelectionAuthority: false,
    ownsDynamicEventAdoptionAuthority: false,
    ownsBonusChallengeOpportunityAuthority: false,
    ownsBonusChallengeAdoptionAuthority: false,
    ownsCombatPressureAuthority: false,
    ownsMutatorEffectAuthority: false,
    ownsEnemyBudgetAuthority: false,
    ownsMilestoneEncounterAuthority: false,
    ownsTerminalCompletionDispositionAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsProgressionAuthority: false,
    ownsLiveAdoptionAuthority: false,
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

export const resolveScoreAttackRuntimeProjectionBundle = (
  envelope: Readonly<ScoreAttackBootstrapEnvelope> | null,
): Readonly<ScoreAttackRuntimeProjectionBundle> | null => {
  if (
    !envelope ||
    envelope.kind !== "SCORE_ATTACK_BOOTSTRAP_ENVELOPE" ||
    envelope.modeId !== "SCORE_ATTACK" ||
    envelope.runtimeProgressionMode !== "INFINITE" ||
    envelope.runtimeProgression.mode !== "INFINITE" ||
    envelope.canonicalFreshStart.sector !== 11 ||
    envelope.canonicalFreshStart.wave !== 1 ||
    envelope.runtimeProgression.session.currentSector !== 11 ||
    envelope.runtimeProgression.session.currentWaveNumber !== 1
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
  if (!completionOverlay) {
    return null;
  }

  const effectiveDescriptor = completionOverlay.descriptor;

  const dynamicEventCompatibility =
    applyDynamicMidSectorEventRuntimeAdoption(
      envelope.runtimeProgression,
      effectiveDescriptor,
    );
  if (
    dynamicEventCompatibility.adoption !== null ||
    dynamicEventCompatibility.descriptor !== effectiveDescriptor
  ) {
    return null;
  }

  const bonusChallengeCompatibility =
    applyBonusChallengeRuntimeAdoption(
      envelope.runtimeProgression,
      effectiveDescriptor,
    );
  if (
    bonusChallengeCompatibility.adoption !== null ||
    bonusChallengeCompatibility.descriptor !== effectiveDescriptor
  ) {
    return null;
  }

  const combatPressure = Object.freeze({
    ...projectRuntimeCombatPressure(effectiveDescriptor),
  });
  const mutatorEffects = Object.freeze({
    ...projectRuntimeMutatorEffects(effectiveDescriptor),
  });
  const milestoneEncounter =
    projectInfiniteMilestoneEncounter(effectiveDescriptor);

  return Object.freeze({
    kind: "SCORE_ATTACK_RUNTIME_PROJECTION_BUNDLE",
    projectionMode: "PROJECTION_ONLY",
    modeId: envelope.modeId,
    sourceRuntimeMode: envelope.runtimeProgression.mode,
    descriptor: effectiveDescriptor,
    completionOverlay,
    combatPressure,
    mutatorEffects,
    enemyBudget: getRuntimeMutatedEnemyBudget(effectiveDescriptor),
    milestoneEncounter: milestoneEncounter
      ? Object.freeze({ ...milestoneEncounter })
      : null,
    adaptiveInvasionBypassed: true,
    usesLiveFollowerCount: false,
    dynamicEventCompatibilityChecked: true,
    dynamicEventAdoption: null,
    bonusChallengeCompatibilityChecked: true,
    bonusChallengeAdoption: null,
    preservesJ8IEffectiveDescriptor: true,
    preservesCanonicalRecipeComparability: true,
    writesRuntimeProjectionCache: false,
    adoptsLiveRuntime: false,
    writesReactStateOrRefs: false,
    startsOrTicksTimer: false,
    ownsTerminalDisposition: false,
    writesPersistence: false,
    writesRunArchive: false,
    writesScoreAttackRecord: false,
  });
};
