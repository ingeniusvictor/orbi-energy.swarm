import {
  BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS,
  type BlackoutArchitectStructuralAnchorFact,
  type BlackoutArchitectStructuralAnchorId,
} from "./blackoutArchitectStructuralTopology";

export type BlackoutArchitectDurabilitySnapshotMode = "SNAPSHOT_ONLY";

export interface BlackoutArchitectStructuralDurabilityFact {
  readonly anchorId: BlackoutArchitectStructuralAnchorId;
  readonly currentHealth: number;
  readonly maxHealth: number;
}

export interface BlackoutArchitectStructuralDurabilitySnapshotProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly durabilityMode: BlackoutArchitectDurabilitySnapshotMode;
  readonly anchorFacts: readonly Readonly<BlackoutArchitectStructuralAnchorFact>[];
}

export interface BlackoutArchitectStructuralDurabilitySnapshotAuthorityContract {
  readonly ownsExternalDurabilitySnapshotFactProjectionAuthority: true;
  readonly ownsHealthBalanceOrDefaultsAuthority: false;
  readonly ownsCoreOrBossHealthAuthority: false;
  readonly ownsLiveHealthMutationAuthority: false;
  readonly ownsDamageCalculationOrApplicationAuthority: false;
  readonly ownsHitDetectionOrCollisionAuthority: false;
  readonly ownsStructuralTopologyOrCoreExposureAuthority: false;
  readonly ownsTargetEligibilityAuthority: false;
  readonly ownsHitIntentAdmissionAuthority: false;
  readonly ownsCoordinateOrGeometryAuthority: false;
  readonly ownsPhaseOrVulnerabilityDurationAuthority: false;
  readonly ownsTimerOrClockAuthority: false;
  readonly ownsAttackOrProjectileAuthority: false;
  readonly ownsSpawnOrMilestoneAuthority: false;
  readonly ownsRaidOrRematchAuthority: false;
  readonly ownsRuntimeAdoptionAuthority: false;
  readonly ownsModeRoutingAuthority: false;
  readonly ownsHudAuthority: false;
  readonly ownsRewardOrEconomyAuthority: false;
  readonly ownsPersistenceAuthority: false;
  readonly ownsEntityOrProjectileCollectionAuthority: false;
  readonly ownsRandomnessAuthority: false;
  readonly ownsCapOrBudgetAuthority: false;
  readonly ownsFotonOrFormationAuthority: false;
}

export const BLACKOUT_ARCHITECT_STRUCTURAL_DURABILITY_SNAPSHOT_AUTHORITY_CONTRACT: Readonly<BlackoutArchitectStructuralDurabilitySnapshotAuthorityContract> =
  Object.freeze({
    ownsExternalDurabilitySnapshotFactProjectionAuthority: true,
    ownsHealthBalanceOrDefaultsAuthority: false,
    ownsCoreOrBossHealthAuthority: false,
    ownsLiveHealthMutationAuthority: false,
    ownsDamageCalculationOrApplicationAuthority: false,
    ownsHitDetectionOrCollisionAuthority: false,
    ownsStructuralTopologyOrCoreExposureAuthority: false,
    ownsTargetEligibilityAuthority: false,
    ownsHitIntentAdmissionAuthority: false,
    ownsCoordinateOrGeometryAuthority: false,
    ownsPhaseOrVulnerabilityDurationAuthority: false,
    ownsTimerOrClockAuthority: false,
    ownsAttackOrProjectileAuthority: false,
    ownsSpawnOrMilestoneAuthority: false,
    ownsRaidOrRematchAuthority: false,
    ownsRuntimeAdoptionAuthority: false,
    ownsModeRoutingAuthority: false,
    ownsHudAuthority: false,
    ownsRewardOrEconomyAuthority: false,
    ownsPersistenceAuthority: false,
    ownsEntityOrProjectileCollectionAuthority: false,
    ownsRandomnessAuthority: false,
    ownsCapOrBudgetAuthority: false,
    ownsFotonOrFormationAuthority: false,
  });

const resolveOwnDataFields = (
  value: unknown,
  fields: readonly string[],
): Record<string, unknown> | null => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    return null;
  }
  const ownKeys = Reflect.ownKeys(value);
  if (ownKeys.length !== fields.length || !fields.every((field) => ownKeys.includes(field))) {
    return null;
  }
  const values: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
  for (const field of fields) {
    const descriptor = Object.getOwnPropertyDescriptor(value, field);
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) {
      return null;
    }
    values[field] = descriptor.value;
  }
  return values;
};

const isExactBoundedSnapshotArray = (value: unknown): value is readonly unknown[] => {
  if (
    !Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Array.prototype ||
    value.length !== BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length
  ) {
    return false;
  }
  const ownKeys = Reflect.ownKeys(value);
  if (
    ownKeys.length !== BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length + 1 ||
    !ownKeys.includes("length")
  ) {
    return false;
  }
  for (let index = 0; index < BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length; index++) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) {
      return false;
    }
  }
  return true;
};

export const resolveBlackoutArchitectStructuralDurabilitySnapshot = (
  input: unknown,
): Readonly<BlackoutArchitectStructuralDurabilitySnapshotProjection> | null => {
  if (!isExactBoundedSnapshotArray(input)) {
    return null;
  }
  const statuses: (boolean | null)[] = Array(BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length).fill(null);
  for (const candidate of input) {
    const fact = resolveOwnDataFields(candidate, ["anchorId", "currentHealth", "maxHealth"]);
    if (
      !fact ||
      typeof fact.currentHealth !== "number" ||
      !Number.isFinite(fact.currentHealth) ||
      Object.is(fact.currentHealth, -0) ||
      fact.currentHealth < 0 ||
      typeof fact.maxHealth !== "number" ||
      !Number.isFinite(fact.maxHealth) ||
      fact.maxHealth <= 0 ||
      fact.currentHealth > fact.maxHealth
    ) {
      return null;
    }
    const index = BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.findIndex(
      (anchorId) => anchorId === fact.anchorId,
    );
    if (index < 0 || statuses[index] !== null) {
      return null;
    }
    statuses[index] = fact.currentHealth === 0;
  }
  if (statuses.some((destroyed) => destroyed === null)) {
    return null;
  }

  // Facts only; J9B remains authoritative for core exposure and topology.
  const anchorFacts = Object.freeze(
    BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.map((anchorId, index) =>
      Object.freeze({ anchorId, destroyed: statuses[index] as boolean }),
    ),
  );

  return Object.freeze({
    bossId: "BLACKOUT_ARCHITECT",
    durabilityMode: "SNAPSHOT_ONLY",
    anchorFacts,
  });
};
