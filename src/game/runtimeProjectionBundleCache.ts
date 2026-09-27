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

export interface RuntimeProjectionBundle {
  descriptor: RuntimeWaveDescriptor;
  combatPressure: RuntimeCombatPressureProjection;
  mutatorEffects: RuntimeMutatorEffectProfile;
  enemyBudget: number;
  milestoneEncounter: InfiniteMilestoneEncounterProfile | null;
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
): RuntimeProjectionBundle => {
  const cached = cache.get(state);
  if (cached) {
    return cached;
  }

  const descriptor = resolveRuntimeWaveDescriptor(state);
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
  };

  cache.set(state, bundle);
  return bundle;
};
