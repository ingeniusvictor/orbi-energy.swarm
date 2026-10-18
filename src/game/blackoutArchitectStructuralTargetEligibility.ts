import {
  BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS,
  resolveBlackoutArchitectStructuralTopology,
  type BlackoutArchitectStructuralAnchorFact,
  type BlackoutArchitectStructuralAnchorId,
  type BlackoutArchitectCoreExposureEligibility,
} from "./blackoutArchitectStructuralTopology";
import type { BlackoutArchitectEnemyTypeMappingProjection } from "./blackoutArchitectEnemyTypeMapping";
import { EnemyType } from "./types";

export type BlackoutArchitectTargetEligibilityMode = "ELIGIBILITY_ONLY";
export type BlackoutArchitectAnchorTargetEligibility = "ELIGIBLE" | "INELIGIBLE";

export interface BlackoutArchitectStructuralTarget {
  readonly anchorId: BlackoutArchitectStructuralAnchorId;
  readonly targetEligibility: BlackoutArchitectAnchorTargetEligibility;
}

export interface BlackoutArchitectStructuralTargetEligibilityProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly eligibilityMode: BlackoutArchitectTargetEligibilityMode;
  readonly chassisId: "TITAN_CORE";
  readonly enemyType: EnemyType.BOSS_TITAN;
  readonly anchorTargets: readonly Readonly<BlackoutArchitectStructuralTarget>[];
  readonly coreTargetEligibility: BlackoutArchitectCoreExposureEligibility;
}

export interface BlackoutArchitectStructuralTargetEligibilityAuthorityContract {
  readonly ownsStructuralTargetEligibilityProjectionAuthority: true;
  readonly ownsEnemyTypeMappingAuthority: false;
  readonly ownsStructuralTopologyAuthority: false;
  readonly ownsChassisSelectionBindingAuthority: false;
  readonly ownsDamageOrCollisionAuthority: false;
  readonly ownsBossOrWeakpointHealthAuthority: false;
  readonly ownsCoordinateOrGeometryAuthority: false;
  readonly ownsPhaseOrThresholdAuthority: false;
  readonly ownsVulnerabilityDurationAuthority: false;
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

export const BLACKOUT_ARCHITECT_STRUCTURAL_TARGET_ELIGIBILITY_AUTHORITY_CONTRACT: Readonly<BlackoutArchitectStructuralTargetEligibilityAuthorityContract> =
  Object.freeze({
    ownsStructuralTargetEligibilityProjectionAuthority: true,
    ownsEnemyTypeMappingAuthority: false,
    ownsStructuralTopologyAuthority: false,
    ownsChassisSelectionBindingAuthority: false,
    ownsDamageOrCollisionAuthority: false,
    ownsBossOrWeakpointHealthAuthority: false,
    ownsCoordinateOrGeometryAuthority: false,
    ownsPhaseOrThresholdAuthority: false,
    ownsVulnerabilityDurationAuthority: false,
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

const resolveExactEnemyTypeMapping = (
  input: unknown,
): Readonly<BlackoutArchitectEnemyTypeMappingProjection> | null => {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }
  const record = input as Record<string, unknown>;
  const keys = Object.keys(record);
  if (
    keys.length !== 5 ||
    !["bossId", "compatibilityMode", "mappingMode", "chassisId", "enemyType"].every(
      (key) => keys.includes(key),
    ) ||
    record.bossId !== "BLACKOUT_ARCHITECT" ||
    record.compatibilityMode !== "COMPATIBILITY_ONLY" ||
    record.mappingMode !== "MAPPING_ONLY" ||
    record.chassisId !== "TITAN_CORE" ||
    record.enemyType !== EnemyType.BOSS_TITAN
  ) {
    return null;
  }

  return Object.freeze({
    bossId: "BLACKOUT_ARCHITECT",
    compatibilityMode: "COMPATIBILITY_ONLY",
    mappingMode: "MAPPING_ONLY",
    chassisId: "TITAN_CORE",
    enemyType: EnemyType.BOSS_TITAN,
  });
};

export const resolveBlackoutArchitectStructuralTargetEligibility = (
  mappingInput: unknown,
  anchorFactsInput: unknown,
): Readonly<BlackoutArchitectStructuralTargetEligibilityProjection> | null => {
  const mapping = resolveExactEnemyTypeMapping(mappingInput);
  const topology = resolveBlackoutArchitectStructuralTopology(anchorFactsInput);
  if (!mapping || !topology || !Array.isArray(anchorFactsInput)) {
    return null;
  }

  // Frozen J9B has already validated all four exact unique { anchorId, destroyed } facts.
  const facts = anchorFactsInput as readonly BlackoutArchitectStructuralAnchorFact[];
  const anchorTargets = Object.freeze(
    BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.map((anchorId) => {
      const fact = facts.find((entry) => entry.anchorId === anchorId);
      return Object.freeze({
        anchorId,
        targetEligibility: fact?.destroyed === false ? "ELIGIBLE" : "INELIGIBLE",
      } as const);
    }),
  );
  const eligibleAnchorCount = anchorTargets.filter(
    (target) => target.targetEligibility === "ELIGIBLE",
  ).length;

  if (
    eligibleAnchorCount + topology.destroyedAnchorCount !==
      BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length ||
    (topology.coreExposureEligibility === "ELIGIBLE" && eligibleAnchorCount !== 0)
  ) {
    return null;
  }

  return Object.freeze({
    bossId: mapping.bossId,
    eligibilityMode: "ELIGIBILITY_ONLY",
    chassisId: mapping.chassisId,
    enemyType: mapping.enemyType,
    anchorTargets,
    coreTargetEligibility: topology.coreExposureEligibility,
  });
};
