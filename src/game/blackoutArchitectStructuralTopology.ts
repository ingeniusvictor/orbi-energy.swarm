import { BLACKOUT_ARCHITECT_PROFILE } from "./blackoutArchitectProfileContract";

export const BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS = Object.freeze([
  "NORTH",
  "EAST",
  "SOUTH",
  "WEST",
] as const);

export type BlackoutArchitectStructuralAnchorId =
  (typeof BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS)[number];

export type BlackoutArchitectTopologyMode = "TOPOLOGY_ONLY";
export type BlackoutArchitectCoreExposureEligibility = "LOCKED" | "ELIGIBLE";

export interface BlackoutArchitectStructuralAnchorFact {
  readonly anchorId: BlackoutArchitectStructuralAnchorId;
  readonly destroyed: boolean;
}

export interface BlackoutArchitectStructuralTopologyProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly topologyMode: BlackoutArchitectTopologyMode;
  readonly anchorIds: readonly BlackoutArchitectStructuralAnchorId[];
  readonly destroyedAnchorCount: number;
  readonly coreExposureEligibility: BlackoutArchitectCoreExposureEligibility;
}

export interface BlackoutArchitectStructuralTopologyAuthorityContract {
  readonly ownsStructuralTopologyAuthority: true;
  readonly ownsCoreExposureEligibilityProjectionAuthority: true;
  readonly ownsCoordinateOrGeometryAuthority: false;
  readonly ownsRenderingAuthority: false;
  readonly ownsAnchorHealthAuthority: false;
  readonly ownsDamageOrDefeatAuthority: false;
  readonly ownsBossHealthAuthority: false;
  readonly ownsPhaseAuthority: false;
  readonly ownsVulnerabilityDurationAuthority: false;
  readonly ownsEnemyTypeAuthority: false;
  readonly ownsBossChassisAuthority: false;
  readonly ownsAttackOrProjectileAuthority: false;
  readonly ownsSpawnOrMilestoneAuthority: false;
  readonly ownsRuntimeAdoptionAuthority: false;
  readonly ownsTimerOrClockAuthority: false;
  readonly ownsArenaMutationAuthority: false;
  readonly ownsHudAuthority: false;
  readonly ownsRewardOrEconomyAuthority: false;
  readonly ownsPersistenceAuthority: false;
  readonly ownsEntityOrProjectileCollectionAuthority: false;
  readonly ownsCapOrBudgetAuthority: false;
  readonly ownsFotonOrFormationAuthority: false;
}

export const BLACKOUT_ARCHITECT_STRUCTURAL_TOPOLOGY_AUTHORITY_CONTRACT: Readonly<BlackoutArchitectStructuralTopologyAuthorityContract> =
  Object.freeze({
    ownsStructuralTopologyAuthority: true,
    ownsCoreExposureEligibilityProjectionAuthority: true,
    ownsCoordinateOrGeometryAuthority: false,
    ownsRenderingAuthority: false,
    ownsAnchorHealthAuthority: false,
    ownsDamageOrDefeatAuthority: false,
    ownsBossHealthAuthority: false,
    ownsPhaseAuthority: false,
    ownsVulnerabilityDurationAuthority: false,
    ownsEnemyTypeAuthority: false,
    ownsBossChassisAuthority: false,
    ownsAttackOrProjectileAuthority: false,
    ownsSpawnOrMilestoneAuthority: false,
    ownsRuntimeAdoptionAuthority: false,
    ownsTimerOrClockAuthority: false,
    ownsArenaMutationAuthority: false,
    ownsHudAuthority: false,
    ownsRewardOrEconomyAuthority: false,
    ownsPersistenceAuthority: false,
    ownsEntityOrProjectileCollectionAuthority: false,
    ownsCapOrBudgetAuthority: false,
    ownsFotonOrFormationAuthority: false,
  });

const isStructuralAnchorId = (
  value: unknown,
): value is BlackoutArchitectStructuralAnchorId =>
  typeof value === "string" &&
  BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.some((anchorId) => anchorId === value);

const resolveExactAnchorFact = (
  value: unknown,
): BlackoutArchitectStructuralAnchorFact | null => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (
    keys.length !== 2 ||
    !keys.includes("anchorId") ||
    !keys.includes("destroyed") ||
    !isStructuralAnchorId(record.anchorId) ||
    typeof record.destroyed !== "boolean"
  ) {
    return null;
  }

  return Object.freeze({
    anchorId: record.anchorId,
    destroyed: record.destroyed,
  });
};

export const resolveBlackoutArchitectStructuralTopology = (
  facts: unknown,
): Readonly<BlackoutArchitectStructuralTopologyProjection> | null => {
  if (
    BLACKOUT_ARCHITECT_PROFILE.id !== "BLACKOUT_ARCHITECT" ||
    !Array.isArray(facts) ||
    facts.length !== BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length
  ) {
    return null;
  }

  const resolvedFacts = facts.map(resolveExactAnchorFact);
  if (resolvedFacts.some((fact) => fact === null)) {
    return null;
  }

  const exactFacts = resolvedFacts as readonly BlackoutArchitectStructuralAnchorFact[];
  for (const anchorId of BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS) {
    if (exactFacts.filter((fact) => fact.anchorId === anchorId).length !== 1) {
      return null;
    }
  }

  const destroyedAnchorCount = exactFacts.filter((fact) => fact.destroyed).length;
  const coreExposureEligible =
    destroyedAnchorCount === BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length;

  return Object.freeze({
    bossId: BLACKOUT_ARCHITECT_PROFILE.id,
    topologyMode: "TOPOLOGY_ONLY",
    anchorIds: BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS,
    destroyedAnchorCount,
    coreExposureEligibility: coreExposureEligible ? "ELIGIBLE" : "LOCKED",
  });
};
