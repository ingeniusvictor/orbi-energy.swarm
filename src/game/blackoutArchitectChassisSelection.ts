import {
  BLACKOUT_ARCHITECT_COMPATIBLE_CHASSIS_IDS,
  type BlackoutArchitectChassisCompatibilityProjection,
} from "./blackoutArchitectChassisCompatibility";

export type BlackoutArchitectChassisSelectionMode = "SELECTION_ONLY";
export type BlackoutArchitectChassisBindingMode = "BINDING_ONLY";

export interface BlackoutArchitectChassisSelectionProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly selectionMode: BlackoutArchitectChassisSelectionMode;
  readonly bindingMode: BlackoutArchitectChassisBindingMode;
  readonly chassisId: "TITAN_CORE";
}

export interface BlackoutArchitectChassisSelectionAuthorityContract {
  readonly ownsBossChassisSelectionBindingAuthority: true;
  readonly ownsChassisCompatibilityAuthority: false;
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

export const BLACKOUT_ARCHITECT_CHASSIS_SELECTION_AUTHORITY_CONTRACT: Readonly<BlackoutArchitectChassisSelectionAuthorityContract> =
  Object.freeze({
    ownsBossChassisSelectionBindingAuthority: true,
    ownsChassisCompatibilityAuthority: false,
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

const resolveExactCompatibilityProjection = (
  value: unknown,
): Readonly<BlackoutArchitectChassisCompatibilityProjection> | null => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (
    keys.length !== 4 ||
    !keys.includes("bossId") ||
    !keys.includes("compatibilityMode") ||
    !keys.includes("chassisId") ||
    !keys.includes("structuralAnchorCount") ||
    record.bossId !== "BLACKOUT_ARCHITECT" ||
    record.compatibilityMode !== "COMPATIBILITY_ONLY" ||
    record.chassisId !== BLACKOUT_ARCHITECT_COMPATIBLE_CHASSIS_IDS[0] ||
    record.structuralAnchorCount !== 4
  ) {
    return null;
  }

  return Object.freeze({
    bossId: "BLACKOUT_ARCHITECT",
    compatibilityMode: "COMPATIBILITY_ONLY",
    chassisId: BLACKOUT_ARCHITECT_COMPATIBLE_CHASSIS_IDS[0],
    structuralAnchorCount: 4,
  });
};

export const resolveBlackoutArchitectChassisSelection = (
  value: unknown,
): Readonly<BlackoutArchitectChassisSelectionProjection> | null => {
  const compatibility = resolveExactCompatibilityProjection(value);
  if (!compatibility) {
    return null;
  }

  return Object.freeze({
    bossId: compatibility.bossId,
    selectionMode: "SELECTION_ONLY",
    bindingMode: "BINDING_ONLY",
    chassisId: compatibility.chassisId,
  });
};
