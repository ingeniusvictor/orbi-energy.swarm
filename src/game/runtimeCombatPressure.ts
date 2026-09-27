import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";

export interface RuntimeCombatPressureProjection {
  sourceMode: RuntimeWaveDescriptor["sourceMode"];
  enemyHealthMultiplier: number;
  enemyMovementSpeedMultiplier: number;
  contactDamageMultiplier: number;
  enemyAttackRateMultiplier: number;
  resourceValueMultiplier: number;
  projectileBudget: number | null;
  spawnSafetyRadius: number;
  hazardIntensity: number;
  minTelegraphMs: number | null;
}

const positiveFiniteOr = (
  value: number | null | undefined,
  fallback: number,
) =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value > 0
    ? value
    : fallback;

export const projectRuntimeCombatPressure = (
  descriptor: RuntimeWaveDescriptor,
): RuntimeCombatPressureProjection => {
  if (descriptor.sourceMode === "CAMPAIGN") {
    return {
      sourceMode: "CAMPAIGN",
      enemyHealthMultiplier: positiveFiniteOr(
        descriptor.pressure.legacyDifficultyMultiplier,
        1,
      ),
      enemyMovementSpeedMultiplier: 1,
      contactDamageMultiplier: 1,
      enemyAttackRateMultiplier: 1,
      resourceValueMultiplier: 1,
      projectileBudget: null,
      spawnSafetyRadius: 150,
      hazardIntensity: descriptor.pressure.hazardIntensity,
      minTelegraphMs: null,
    };
  }

  return {
    sourceMode: "INFINITE",
    enemyHealthMultiplier: positiveFiniteOr(
      descriptor.pressure.statMultiplier,
      1,
    ),
    enemyMovementSpeedMultiplier: positiveFiniteOr(
      descriptor.pressure.aggressionMultiplier,
      1,
    ),
    contactDamageMultiplier: positiveFiniteOr(
      descriptor.pressure.statMultiplier,
      1,
    ),
    enemyAttackRateMultiplier: positiveFiniteOr(
      descriptor.pressure.projectileDensityMultiplier,
      1,
    ),
    resourceValueMultiplier: positiveFiniteOr(
      descriptor.rewards.resourceMultiplier,
      1,
    ),
    projectileBudget:
      descriptor.fairness &&
      Number.isFinite(descriptor.fairness.projectileBudget) &&
      descriptor.fairness.projectileBudget > 0
        ? Math.floor(descriptor.fairness.projectileBudget)
        : null,
    spawnSafetyRadius: positiveFiniteOr(
      descriptor.fairness?.spawnSafetyRadius,
      150,
    ),
    hazardIntensity: Math.max(
      0,
      Number.isFinite(descriptor.pressure.hazardIntensity)
        ? descriptor.pressure.hazardIntensity
        : 0,
    ),
    minTelegraphMs:
      descriptor.fairness &&
      Number.isFinite(descriptor.fairness.minTelegraphMs) &&
      descriptor.fairness.minTelegraphMs > 0
        ? descriptor.fairness.minTelegraphMs
        : null,
  };
};
