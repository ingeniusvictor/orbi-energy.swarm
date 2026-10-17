import {
  BLACKOUT_ARCHITECT_PROFILE,
  BLACKOUT_ARCHITECT_UNRESOLVED_SELECTIONS,
} from "./blackoutArchitectProfileContract";
import { BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS } from "./blackoutArchitectStructuralTopology";
import { getBossChassisProfile } from "./bossChassis";

export const BLACKOUT_ARCHITECT_COMPATIBLE_CHASSIS_IDS = Object.freeze([
  "TITAN_CORE",
] as const);

export type BlackoutArchitectCompatibleChassisId =
  (typeof BLACKOUT_ARCHITECT_COMPATIBLE_CHASSIS_IDS)[number];

export type BlackoutArchitectChassisCompatibilityMode = "COMPATIBILITY_ONLY";

export interface BlackoutArchitectChassisCompatibilityFact {
  readonly chassisId: BlackoutArchitectCompatibleChassisId;
  readonly weakpointCount: number;
  readonly weakpointMotion: "ANCHORED";
  readonly angularVelocityPerFrame: number;
}

export interface BlackoutArchitectChassisCompatibilityProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly compatibilityMode: BlackoutArchitectChassisCompatibilityMode;
  readonly chassisId: BlackoutArchitectCompatibleChassisId;
  readonly structuralAnchorCount: 4;
}

export interface BlackoutArchitectChassisCompatibilityAuthorityContract {
  readonly ownsChassisCompatibilityAuthority: true;
  readonly ownsBossChassisSelectionAuthority: false;
  readonly ownsEnemyTypeAuthority: false;
  readonly ownsBossHealthAuthority: false;
  readonly ownsWeakpointHealthAuthority: false;
  readonly ownsCoordinateOrGeometryAuthority: false;
  readonly ownsDamageFormulaAuthority: false;
  readonly ownsVulnerabilityDurationAuthority: false;
  readonly ownsPhaseAuthority: false;
  readonly ownsAttackOrProjectileAuthority: false;
  readonly ownsSpawnOrMilestoneAuthority: false;
  readonly ownsRuntimeAdoptionAuthority: false;
  readonly ownsTimerOrClockAuthority: false;
  readonly ownsArenaMutationAuthority: false;
  readonly ownsHudAuthority: false;
  readonly ownsRewardOrEconomyAuthority: false;
  readonly ownsPersistenceAuthority: false;
  readonly ownsEntityOrProjectileCollectionAuthority: false;
  readonly ownsRandomnessAuthority: false;
  readonly ownsCapOrBudgetAuthority: false;
  readonly ownsFotonOrFormationAuthority: false;
}

export const BLACKOUT_ARCHITECT_CHASSIS_COMPATIBILITY_AUTHORITY_CONTRACT: Readonly<BlackoutArchitectChassisCompatibilityAuthorityContract> =
  Object.freeze({
    ownsChassisCompatibilityAuthority: true,
    ownsBossChassisSelectionAuthority: false,
    ownsEnemyTypeAuthority: false,
    ownsBossHealthAuthority: false,
    ownsWeakpointHealthAuthority: false,
    ownsCoordinateOrGeometryAuthority: false,
    ownsDamageFormulaAuthority: false,
    ownsVulnerabilityDurationAuthority: false,
    ownsPhaseAuthority: false,
    ownsAttackOrProjectileAuthority: false,
    ownsSpawnOrMilestoneAuthority: false,
    ownsRuntimeAdoptionAuthority: false,
    ownsTimerOrClockAuthority: false,
    ownsArenaMutationAuthority: false,
    ownsHudAuthority: false,
    ownsRewardOrEconomyAuthority: false,
    ownsPersistenceAuthority: false,
    ownsEntityOrProjectileCollectionAuthority: false,
    ownsRandomnessAuthority: false,
    ownsCapOrBudgetAuthority: false,
    ownsFotonOrFormationAuthority: false,
  });

const resolveExactCompatibilityFact = (
  value: unknown,
): Readonly<BlackoutArchitectChassisCompatibilityFact> | null => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (
    keys.length !== 4 ||
    !keys.includes("chassisId") ||
    !keys.includes("weakpointCount") ||
    !keys.includes("weakpointMotion") ||
    !keys.includes("angularVelocityPerFrame") ||
    record.chassisId !== "TITAN_CORE" ||
    record.weakpointCount !== BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length ||
    record.weakpointMotion !== "ANCHORED" ||
    record.angularVelocityPerFrame !== 0
  ) {
    return null;
  }

  return Object.freeze({
    chassisId: "TITAN_CORE",
    weakpointCount: BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length,
    weakpointMotion: "ANCHORED",
    angularVelocityPerFrame: 0,
  });
};

export const resolveBlackoutArchitectChassisCompatibility = (
  value: unknown,
): Readonly<BlackoutArchitectChassisCompatibilityProjection> | null => {
  const fact = resolveExactCompatibilityFact(value);
  if (
    !fact ||
    BLACKOUT_ARCHITECT_PROFILE.id !== "BLACKOUT_ARCHITECT" ||
    BLACKOUT_ARCHITECT_UNRESOLVED_SELECTIONS.selectsBossChassis !== false ||
    BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length !== 4
  ) {
    return null;
  }

  const chassis = getBossChassisProfile("TITAN_CORE");
  if (
    chassis.id !== fact.chassisId ||
    chassis.weakpoints.count !== fact.weakpointCount ||
    chassis.weakpoints.motion !== fact.weakpointMotion ||
    chassis.weakpoints.angularVelocityPerFrame !== fact.angularVelocityPerFrame
  ) {
    return null;
  }

  return Object.freeze({
    bossId: BLACKOUT_ARCHITECT_PROFILE.id,
    compatibilityMode: "COMPATIBILITY_ONLY",
    chassisId: fact.chassisId,
    structuralAnchorCount: 4,
  });
};
