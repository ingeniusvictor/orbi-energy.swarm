import type { InfiniteMutator } from "./infiniteSectorDirector";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";

export interface RuntimeMutatorEffectProfile {
  sourceMode: RuntimeWaveDescriptor["sourceMode"];
  activeMutators: InfiniteMutator[];
  enemySpeedMultiplier: number;
  enemyRegenFractionPerSecond: number;
  incomingDamageMultiplier: number;
  formationCohesionMultiplier: number;
  eliteChanceBonus: number;
  enemyBudgetMultiplier: number;
  electricalStormIntensity: number;
  visibilityScale: number;
  magneticDriftStrength: number;
  resourceFieldInstability: number;
}

type MutatorEffectPatch = Partial<
  Omit<
    RuntimeMutatorEffectProfile,
    "sourceMode" | "activeMutators"
  >
>;

const MUTATOR_EFFECTS: Record<
  InfiniteMutator,
  MutatorEffectPatch
> = {
  ELECTRICAL_STORM: {
    electricalStormIntensity: 1,
  },
  REDUCED_VISIBILITY: {
    visibilityScale: 0.7,
  },
  MAGNETIC_DRIFT: {
    magneticDriftStrength: 0.18,
  },
  ACCELERATED_ENEMIES: {
    enemySpeedMultiplier: 1.18,
  },
  REGENERATIVE_ENEMIES: {
    enemyRegenFractionPerSecond: 0.006,
  },
  FRAGILE_SWARM: {
    incomingDamageMultiplier: 1.2,
  },
  UNSTABLE_RESOURCE_FIELDS: {
    resourceFieldInstability: 0.3,
  },
  FORMATION_DISRUPTION: {
    formationCohesionMultiplier: 0.72,
  },
  ELITE_BURST: {
    eliteChanceBonus: 0.12,
  },
  DOUBLE_THREAT: {
    enemyBudgetMultiplier: 1.35,
  },
};

const NEUTRAL_EFFECTS: Omit<
  RuntimeMutatorEffectProfile,
  "sourceMode" | "activeMutators"
> = {
  enemySpeedMultiplier: 1,
  enemyRegenFractionPerSecond: 0,
  incomingDamageMultiplier: 1,
  formationCohesionMultiplier: 1,
  eliteChanceBonus: 0,
  enemyBudgetMultiplier: 1,
  electricalStormIntensity: 0,
  visibilityScale: 1,
  magneticDriftStrength: 0,
  resourceFieldInstability: 0,
};

const clamp = (
  value: number,
  min: number,
  max: number,
) => Math.min(max, Math.max(min, value));

const isInfiniteMutator = (
  value: string,
): value is InfiniteMutator =>
  Object.prototype.hasOwnProperty.call(
    MUTATOR_EFFECTS,
    value,
  );

export const projectRuntimeMutatorEffects = (
  descriptor: RuntimeWaveDescriptor,
): RuntimeMutatorEffectProfile => {
  if (descriptor.sourceMode !== "INFINITE") {
    return {
      sourceMode: descriptor.sourceMode,
      activeMutators: [],
      ...NEUTRAL_EFFECTS,
    };
  }

  const activeMutators = Array.from(
    new Set(
      descriptor.modifiers.filter(isInfiniteMutator),
    ),
  );

  const profile: RuntimeMutatorEffectProfile = {
    sourceMode: "INFINITE",
    activeMutators,
    ...NEUTRAL_EFFECTS,
  };

  for (const mutator of activeMutators) {
    const patch = MUTATOR_EFFECTS[mutator];

    if (patch.enemySpeedMultiplier !== undefined) {
      profile.enemySpeedMultiplier *=
        patch.enemySpeedMultiplier;
    }
    if (
      patch.enemyRegenFractionPerSecond !== undefined
    ) {
      profile.enemyRegenFractionPerSecond +=
        patch.enemyRegenFractionPerSecond;
    }
    if (patch.incomingDamageMultiplier !== undefined) {
      profile.incomingDamageMultiplier *=
        patch.incomingDamageMultiplier;
    }
    if (
      patch.formationCohesionMultiplier !== undefined
    ) {
      profile.formationCohesionMultiplier *=
        patch.formationCohesionMultiplier;
    }
    if (patch.eliteChanceBonus !== undefined) {
      profile.eliteChanceBonus +=
        patch.eliteChanceBonus;
    }
    if (patch.enemyBudgetMultiplier !== undefined) {
      profile.enemyBudgetMultiplier *=
        patch.enemyBudgetMultiplier;
    }
    if (
      patch.electricalStormIntensity !== undefined
    ) {
      profile.electricalStormIntensity +=
        patch.electricalStormIntensity;
    }
    if (patch.visibilityScale !== undefined) {
      profile.visibilityScale *= patch.visibilityScale;
    }
    if (patch.magneticDriftStrength !== undefined) {
      profile.magneticDriftStrength +=
        patch.magneticDriftStrength;
    }
    if (
      patch.resourceFieldInstability !== undefined
    ) {
      profile.resourceFieldInstability +=
        patch.resourceFieldInstability;
    }
  }

  profile.enemySpeedMultiplier = clamp(
    profile.enemySpeedMultiplier,
    1,
    1.25,
  );
  profile.enemyRegenFractionPerSecond = clamp(
    profile.enemyRegenFractionPerSecond,
    0,
    0.01,
  );
  profile.incomingDamageMultiplier = clamp(
    profile.incomingDamageMultiplier,
    1,
    1.25,
  );
  profile.formationCohesionMultiplier = clamp(
    profile.formationCohesionMultiplier,
    0.65,
    1,
  );
  profile.eliteChanceBonus = clamp(
    profile.eliteChanceBonus,
    0,
    0.15,
  );
  profile.enemyBudgetMultiplier = clamp(
    profile.enemyBudgetMultiplier,
    1,
    1.4,
  );
  profile.electricalStormIntensity = clamp(
    profile.electricalStormIntensity,
    0,
    1,
  );
  profile.visibilityScale = clamp(
    profile.visibilityScale,
    0.6,
    1,
  );
  profile.magneticDriftStrength = clamp(
    profile.magneticDriftStrength,
    0,
    0.25,
  );
  profile.resourceFieldInstability = clamp(
    profile.resourceFieldInstability,
    0,
    0.4,
  );

  return profile;
};
