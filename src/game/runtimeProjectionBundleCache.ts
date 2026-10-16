import {
  resolveRuntimeWaveDescriptor,
  type RuntimeProgressionState,
} from "./runtimeProgressionRouter";
import {
  projectRuntimeCombatPressure,
  type RuntimeCombatPressureProjection,
} from "./runtimeCombatPressure";
import {
  getRuntimeMutatedEnemyBudget,
  projectRuntimeMutatorEffects,
  type RuntimeMutatorEffectProfile,
} from "./runtimeMutatorEffects";
import {
  projectInfiniteMilestoneEncounter,
  type InfiniteMilestoneEncounterProfile,
} from "./runtimeMilestoneEncounter";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";
import { applyAdaptiveInvasionToDescriptor } from "./adaptiveInvasionRuntime";
import {
  applyDynamicMidSectorEventRuntimeAdoption,
  type DynamicMidSectorEventRuntimeAdoption,
} from "./dynamicMidSectorEventRuntimeAdoption";
import {
  applyBonusChallengeRuntimeAdoption,
  type BonusChallengeRuntimeAdoption,
} from "./bonusChallengeRuntimeAdoption";

export interface RuntimeProjectionBundle {
  descriptor: RuntimeWaveDescriptor;
  combatPressure: RuntimeCombatPressureProjection;
  mutatorEffects: RuntimeMutatorEffectProfile;
  enemyBudget: number;
  milestoneEncounter: InfiniteMilestoneEncounterProfile | null;
  dynamicEventAdoption: Readonly<DynamicMidSectorEventRuntimeAdoption> | null;
  bonusChallengeAdoption: Readonly<BonusChallengeRuntimeAdoption> | null;
}

export type RuntimeProjectionBundleCache = WeakMap<
  RuntimeProgressionState,
  RuntimeProjectionBundle
>;

export const createRuntimeProjectionBundleCache =
  (): RuntimeProjectionBundleCache =>
    new WeakMap<RuntimeProgressionState, RuntimeProjectionBundle>();

export const getCachedRuntimeProjectionBundle = (
  cache: RuntimeProjectionBundleCache,
  state: RuntimeProgressionState,
  liveFollowerCount?: number,
): RuntimeProjectionBundle => {
  const cached = cache.get(state);
  if (cached) {
    return cached;
  }

  const baseDescriptor = resolveRuntimeWaveDescriptor(state);
  const adaptiveDescriptor =
    typeof liveFollowerCount === "number"
      ? applyAdaptiveInvasionToDescriptor(baseDescriptor, liveFollowerCount)
      : baseDescriptor;
  const dynamicEventProjection =
    applyDynamicMidSectorEventRuntimeAdoption(
      state,
      adaptiveDescriptor,
    );
  const bonusChallengeProjection =
    applyBonusChallengeRuntimeAdoption(
      state,
      dynamicEventProjection.descriptor,
    );
  const descriptor = bonusChallengeProjection.descriptor;
  const bundle: RuntimeProjectionBundle = {
    descriptor,
    combatPressure:
      projectRuntimeCombatPressure(descriptor),
    mutatorEffects:
      projectRuntimeMutatorEffects(descriptor),
    enemyBudget:
      getRuntimeMutatedEnemyBudget(descriptor),
    milestoneEncounter:
      projectInfiniteMilestoneEncounter(descriptor),
    dynamicEventAdoption:
      dynamicEventProjection.adoption,
    bonusChallengeAdoption:
      bonusChallengeProjection.adoption,
  };

  cache.set(state, bundle);
  return bundle;
};
