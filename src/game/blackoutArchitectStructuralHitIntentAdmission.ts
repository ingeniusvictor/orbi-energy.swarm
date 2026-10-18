import {
  BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS,
  type BlackoutArchitectStructuralAnchorId,
} from "./blackoutArchitectStructuralTopology";
import type { BlackoutArchitectStructuralTargetEligibilityProjection } from "./blackoutArchitectStructuralTargetEligibility";
import { EnemyType } from "./types";

export type BlackoutArchitectStructuralHitIntentAdmissionMode = "HIT_INTENT_ONLY";
export type BlackoutArchitectStructuralHitIntentDisposition = "ADMIT" | "DENY";

export type BlackoutArchitectStructuralHitIntent =
  | {
      readonly targetKind: "ANCHOR";
      readonly anchorId: BlackoutArchitectStructuralAnchorId;
    }
  | {
      readonly targetKind: "CORE";
    };

export interface BlackoutArchitectStructuralHitIntentAdmissionProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly admissionMode: BlackoutArchitectStructuralHitIntentAdmissionMode;
  readonly chassisId: "TITAN_CORE";
  readonly enemyType: EnemyType.BOSS_TITAN;
  readonly intent: Readonly<BlackoutArchitectStructuralHitIntent>;
  readonly disposition: BlackoutArchitectStructuralHitIntentDisposition;
}

export interface BlackoutArchitectStructuralHitIntentAdmissionAuthorityContract {
  readonly ownsAbstractStructuralHitIntentAdmissionAuthority: true;
  readonly ownsStructuralTargetEligibilityProjectionAuthority: false;
  readonly ownsStructuralTopologyAuthority: false;
  readonly ownsEnemyTypeMappingAuthority: false;
  readonly ownsChassisSelectionBindingAuthority: false;
  readonly ownsHitDetectionOrCollisionAuthority: false;
  readonly ownsDamageApplicationOrFormulaAuthority: false;
  readonly ownsBossOrWeakpointHealthAuthority: false;
  readonly ownsCoordinateOrGeometryAuthority: false;
  readonly ownsPhaseOrThresholdAuthority: false;
  readonly ownsVulnerabilityDurationAuthority: false;
  readonly ownsAttackOrProjectileAuthority: false;
  readonly ownsSpawnOrMilestoneAuthority: false;
  readonly ownsRaidOrRematchAuthority: false;
  readonly ownsRuntimeAdoptionAuthority: false;
  readonly ownsModeRoutingAuthority: false;
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

export const BLACKOUT_ARCHITECT_STRUCTURAL_HIT_INTENT_ADMISSION_AUTHORITY_CONTRACT: Readonly<BlackoutArchitectStructuralHitIntentAdmissionAuthorityContract> =
  Object.freeze({
    ownsAbstractStructuralHitIntentAdmissionAuthority: true,
    ownsStructuralTargetEligibilityProjectionAuthority: false,
    ownsStructuralTopologyAuthority: false,
    ownsEnemyTypeMappingAuthority: false,
    ownsChassisSelectionBindingAuthority: false,
    ownsHitDetectionOrCollisionAuthority: false,
    ownsDamageApplicationOrFormulaAuthority: false,
    ownsBossOrWeakpointHealthAuthority: false,
    ownsCoordinateOrGeometryAuthority: false,
    ownsPhaseOrThresholdAuthority: false,
    ownsVulnerabilityDurationAuthority: false,
    ownsAttackOrProjectileAuthority: false,
    ownsSpawnOrMilestoneAuthority: false,
    ownsRaidOrRematchAuthority: false,
    ownsRuntimeAdoptionAuthority: false,
    ownsModeRoutingAuthority: false,
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

const hasExactOwnKeys = (value: unknown, keys: readonly string[]): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const present = Reflect.ownKeys(value);
  return present.length === keys.length && keys.every((key) => present.includes(key));
};

const resolveExactEligibilityProjection = (
  value: unknown,
): Readonly<BlackoutArchitectStructuralTargetEligibilityProjection> | null => {
  if (
    !hasExactOwnKeys(value, [
      "bossId", "eligibilityMode", "chassisId",
      "enemyType", "anchorTargets", "coreTargetEligibility",
    ]) ||
    !Object.isFrozen(value) ||
    value.bossId !== "BLACKOUT_ARCHITECT" ||
    value.eligibilityMode !== "ELIGIBILITY_ONLY" ||
    value.chassisId !== "TITAN_CORE" ||
    value.enemyType !== EnemyType.BOSS_TITAN ||
    !Array.isArray(value.anchorTargets) ||
    !Object.isFrozen(value.anchorTargets) ||
    value.anchorTargets.length !== BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length
  ) {
    return null;
  }

  const anchorTargets = value.anchorTargets;
  let ineligibleCount = 0;
  for (let index = 0; index < BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length; index++) {
    const entry: unknown = anchorTargets[index];
    if (
      !hasExactOwnKeys(entry, ["anchorId", "targetEligibility"]) ||
      !Object.isFrozen(entry) ||
      entry.anchorId !== BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS[index] ||
      (entry.targetEligibility !== "ELIGIBLE" && entry.targetEligibility !== "INELIGIBLE")
    ) {
      return null;
    }
    if (entry.targetEligibility === "INELIGIBLE") {
      ineligibleCount++;
    }
  }

  // An integrity check on frozen J9F metadata, not a new topology/exposure resolver.
  const expectedCore = ineligibleCount === BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length
    ? "ELIGIBLE"
    : "LOCKED";
  if (value.coreTargetEligibility !== expectedCore) {
    return null;
  }

  return value as unknown as Readonly<BlackoutArchitectStructuralTargetEligibilityProjection>;
};

const resolveExactIntent = (
  value: unknown,
): Readonly<BlackoutArchitectStructuralHitIntent> | null => {
  if (!hasExactOwnKeys(value, ["targetKind"]) && !hasExactOwnKeys(value, ["targetKind", "anchorId"])) {
    return null;
  }
  if (value.targetKind === "CORE" && hasExactOwnKeys(value, ["targetKind"])) {
    return Object.freeze({ targetKind: "CORE" as const });
  }
  if (
    value.targetKind === "ANCHOR" &&
    hasExactOwnKeys(value, ["targetKind", "anchorId"]) &&
    BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.some((id) => id === value.anchorId)
  ) {
    return Object.freeze({
      targetKind: "ANCHOR" as const,
      anchorId: value.anchorId as BlackoutArchitectStructuralAnchorId,
    });
  }
  return null;
};

export const resolveBlackoutArchitectStructuralHitIntentAdmission = (
  eligibilityInput: unknown,
  hitIntentInput: unknown,
): Readonly<BlackoutArchitectStructuralHitIntentAdmissionProjection> | null => {
  const eligibility = resolveExactEligibilityProjection(eligibilityInput);
  const intent = resolveExactIntent(hitIntentInput);
  if (!eligibility || !intent) {
    return null;
  }

  const admitted = intent.targetKind === "CORE"
    ? eligibility.coreTargetEligibility === "ELIGIBLE"
    : eligibility.anchorTargets.some(
        (target) => target.anchorId === intent.anchorId && target.targetEligibility === "ELIGIBLE",
      );

  // Projection only: does not report a hit, apply damage, or mutate boss/weakpoint state.
  return Object.freeze({
    bossId: eligibility.bossId,
    admissionMode: "HIT_INTENT_ONLY",
    chassisId: eligibility.chassisId,
    enemyType: eligibility.enemyType,
    intent,
    disposition: admitted ? "ADMIT" : "DENY",
  });
};
