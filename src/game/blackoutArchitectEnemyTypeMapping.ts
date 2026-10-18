import { getBossChassisProfile } from "./bossChassis";
import type { BlackoutArchitectChassisSelectionProjection } from "./blackoutArchitectChassisSelection";
import { EnemyType } from "./types";

export type BlackoutArchitectEnemyTypeCompatibilityMode = "COMPATIBILITY_ONLY";
export type BlackoutArchitectEnemyTypeMappingMode = "MAPPING_ONLY";

export interface BlackoutArchitectEnemyTypeMappingProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly compatibilityMode: BlackoutArchitectEnemyTypeCompatibilityMode;
  readonly mappingMode: BlackoutArchitectEnemyTypeMappingMode;
  readonly chassisId: "TITAN_CORE";
  readonly enemyType: EnemyType.BOSS_TITAN;
}

export interface BlackoutArchitectEnemyTypeMappingAuthorityContract {
  readonly ownsEnemyTypeCompatibilityMappingAuthority: true;
  readonly ownsChassisSelectionBindingAuthority: false;
  readonly ownsPhysicalChassisConfigurationAuthority: false;
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

export const BLACKOUT_ARCHITECT_ENEMY_TYPE_MAPPING_AUTHORITY_CONTRACT: Readonly<BlackoutArchitectEnemyTypeMappingAuthorityContract> =
  Object.freeze({
    ownsEnemyTypeCompatibilityMappingAuthority: true,
    ownsChassisSelectionBindingAuthority: false,
    ownsPhysicalChassisConfigurationAuthority: false,
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

export const resolveBlackoutArchitectEnemyTypeMapping = (
  selectionInput: unknown,
): Readonly<BlackoutArchitectEnemyTypeMappingProjection> | null => {
  if (selectionInput === null || typeof selectionInput !== "object" || Array.isArray(selectionInput)) {
    return null;
  }
  const record = selectionInput as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length !== 4 || !["bossId", "selectionMode", "bindingMode", "chassisId"].every((key) => keys.includes(key))) {
    return null;
  }
  const selection = record as unknown as BlackoutArchitectChassisSelectionProjection;
  if (
    selection.bossId !== "BLACKOUT_ARCHITECT" ||
    selection.selectionMode !== "SELECTION_ONLY" ||
    selection.bindingMode !== "BINDING_ONLY" ||
    selection.chassisId !== "TITAN_CORE"
  ) {
    return null;
  }

  const chassis = getBossChassisProfile("TITAN_CORE");
  if (
    chassis.id !== "TITAN_CORE" ||
    chassis.enemyType !== EnemyType.BOSS_TITAN
  ) {
    return null;
  }

  return Object.freeze({
    bossId: selection.bossId,
    compatibilityMode: "COMPATIBILITY_ONLY",
    mappingMode: "MAPPING_ONLY",
    chassisId: selection.chassisId,
    enemyType: EnemyType.BOSS_TITAN,
  });
};
