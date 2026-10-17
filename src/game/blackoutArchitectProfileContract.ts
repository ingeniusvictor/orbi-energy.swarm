export const BOSS_EXPANSION_PROFILE_IDS = Object.freeze([
  "BLACKOUT_ARCHITECT",
] as const);

export type BossExpansionProfileId = (typeof BOSS_EXPANSION_PROFILE_IDS)[number];

export type BlackoutArchitectFamily = "BATTLEFIELD_CONTROL";
export type BlackoutArchitectProfileMode = "PROFILE_ONLY";
export type BlackoutArchitectEncounterRole = "SPATIAL_CONTROL_CAPITAL";
export type BlackoutArchitectPhaseCompatibility = "MULTI_PHASE";
export type BlackoutArchitectDestructibleZoneCompatibility = "STRUCTURAL_ZONES";
export type BlackoutArchitectAffinityPressureCompatibility = "AFFINITY_PRESSURE";
export type BlackoutArchitectFormationPressureCompatibility = "FORMATION_PRESSURE";
export type BlackoutArchitectBattlefieldManipulationCompatibility =
  "ARENA_GEOMETRY_MANIPULATION";
export type BlackoutArchitectVulnerabilityCompatibility =
  "TELEGRAPHED_EXPOSURE_WINDOW";

export interface BlackoutArchitectProfile {
  readonly id: "BLACKOUT_ARCHITECT";
  readonly displayName: "Blackout Architect";
  readonly family: BlackoutArchitectFamily;
  readonly profileMode: BlackoutArchitectProfileMode;
  readonly encounterRole: BlackoutArchitectEncounterRole;
  readonly phaseCompatibility: BlackoutArchitectPhaseCompatibility;
  readonly destructibleZoneCompatibility: BlackoutArchitectDestructibleZoneCompatibility;
  readonly affinityPressureCompatibility: BlackoutArchitectAffinityPressureCompatibility;
  readonly formationPressureCompatibility: BlackoutArchitectFormationPressureCompatibility;
  readonly battlefieldManipulationCompatibility: BlackoutArchitectBattlefieldManipulationCompatibility;
  readonly vulnerabilityCompatibility: BlackoutArchitectVulnerabilityCompatibility;
}

export interface BlackoutArchitectUnresolvedSelections {
  readonly selectsEnemyType: false;
  readonly selectsBossChassis: false;
  readonly selectsExactHealth: false;
  readonly selectsExactPhaseCount: false;
  readonly selectsExactPhaseThresholds: false;
  readonly selectsExactDestructibleZoneCount: false;
  readonly selectsExactDestructibleZoneHealth: false;
  readonly selectsExactVulnerabilityDuration: false;
  readonly selectsAttackSet: false;
  readonly selectsAttackWeights: false;
  readonly selectsAttackCooldowns: false;
  readonly selectsSpawnCadence: false;
  readonly selectsMilestoneOrRematchAdoption: false;
  readonly selectsArenaGeometryImplementation: false;
}

export interface BlackoutArchitectAuthorityContract {
  readonly ownsProfileDefinitionAuthority: true;
  readonly ownsEnemyTypeAuthority: false;
  readonly ownsBossChassisAuthority: false;
  readonly ownsRuntimeOrMilestoneAuthority: false;
  readonly ownsPhaseThresholdAuthority: false;
  readonly ownsDestructibleZoneRuntimeAuthority: false;
  readonly ownsVulnerabilityTimerAuthority: false;
  readonly ownsTimerOrClockAuthority: false;
  readonly ownsSpawnAuthority: false;
  readonly ownsArenaMutationAuthority: false;
  readonly ownsEntityOrProjectileCollectionAuthority: false;
  readonly ownsDamageFormulaAuthority: false;
  readonly ownsRewardOrEconomyAuthority: false;
  readonly ownsPersistenceAuthority: false;
  readonly ownsHudAuthority: false;
  readonly ownsRandomnessAuthority: false;
  readonly ownsCapOrBudgetAuthority: false;
  readonly ownsFotonOrFormationAuthority: false;
}

export const BLACKOUT_ARCHITECT_PROFILE: Readonly<BlackoutArchitectProfile> =
  Object.freeze({
    id: "BLACKOUT_ARCHITECT",
    displayName: "Blackout Architect",
    family: "BATTLEFIELD_CONTROL",
    profileMode: "PROFILE_ONLY",
    encounterRole: "SPATIAL_CONTROL_CAPITAL",
    phaseCompatibility: "MULTI_PHASE",
    destructibleZoneCompatibility: "STRUCTURAL_ZONES",
    affinityPressureCompatibility: "AFFINITY_PRESSURE",
    formationPressureCompatibility: "FORMATION_PRESSURE",
    battlefieldManipulationCompatibility: "ARENA_GEOMETRY_MANIPULATION",
    vulnerabilityCompatibility: "TELEGRAPHED_EXPOSURE_WINDOW",
  });

export const BLACKOUT_ARCHITECT_UNRESOLVED_SELECTIONS: Readonly<BlackoutArchitectUnresolvedSelections> =
  Object.freeze({
    selectsEnemyType: false,
    selectsBossChassis: false,
    selectsExactHealth: false,
    selectsExactPhaseCount: false,
    selectsExactPhaseThresholds: false,
    selectsExactDestructibleZoneCount: false,
    selectsExactDestructibleZoneHealth: false,
    selectsExactVulnerabilityDuration: false,
    selectsAttackSet: false,
    selectsAttackWeights: false,
    selectsAttackCooldowns: false,
    selectsSpawnCadence: false,
    selectsMilestoneOrRematchAdoption: false,
    selectsArenaGeometryImplementation: false,
  });

export const BLACKOUT_ARCHITECT_AUTHORITY_CONTRACT: Readonly<BlackoutArchitectAuthorityContract> =
  Object.freeze({
    ownsProfileDefinitionAuthority: true,
    ownsEnemyTypeAuthority: false,
    ownsBossChassisAuthority: false,
    ownsRuntimeOrMilestoneAuthority: false,
    ownsPhaseThresholdAuthority: false,
    ownsDestructibleZoneRuntimeAuthority: false,
    ownsVulnerabilityTimerAuthority: false,
    ownsTimerOrClockAuthority: false,
    ownsSpawnAuthority: false,
    ownsArenaMutationAuthority: false,
    ownsEntityOrProjectileCollectionAuthority: false,
    ownsDamageFormulaAuthority: false,
    ownsRewardOrEconomyAuthority: false,
    ownsPersistenceAuthority: false,
    ownsHudAuthority: false,
    ownsRandomnessAuthority: false,
    ownsCapOrBudgetAuthority: false,
    ownsFotonOrFormationAuthority: false,
  });

export const resolveBlackoutArchitectProfile = (
  id: string,
): Readonly<BlackoutArchitectProfile> | null =>
  id === BLACKOUT_ARCHITECT_PROFILE.id ? BLACKOUT_ARCHITECT_PROFILE : null;
