import {
  BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS,
  type BlackoutArchitectStructuralAnchorId,
} from "./blackoutArchitectStructuralTopology";
import {
  resolveBlackoutArchitectStructuralDurabilitySnapshot,
  type BlackoutArchitectStructuralDurabilityFact,
} from "./blackoutArchitectStructuralDurabilitySnapshot";
import { EnemyType } from "./types";

export type BlackoutArchitectDirectHitProposalMode = "PROPOSAL_ONLY";
export type BlackoutArchitectDirectHitSourceClaim = "DIRECT_PLAYER_PROJECTILE_CLAIM";

export interface BlackoutArchitectDirectHitClaim {
  readonly sourceClaim: BlackoutArchitectDirectHitSourceClaim;
  readonly resolvedDamage: number;
}

export interface BlackoutArchitectStructuralDirectHitProposal {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly transitionMode: BlackoutArchitectDirectHitProposalMode;
  readonly chassisId: "TITAN_CORE";
  readonly enemyType: EnemyType.BOSS_TITAN;
  readonly anchorId: BlackoutArchitectStructuralAnchorId;
  readonly sourceClaim: BlackoutArchitectDirectHitSourceClaim;
  readonly currentHealth: number;
  readonly maxHealth: number;
  readonly resolvedDamage: number;
  readonly appliedDamage: number;
  readonly remainingHealth: number;
  readonly wouldDestroy: boolean;
  readonly mutatesHealth: false;
  readonly establishesCollisionProvenance: false;
  readonly registersDefeat: false;
  readonly awardsRewards: false;
}

export interface BlackoutArchitectStructuralDirectHitProposalAuthorityContract {
  readonly ownsPureDirectHitArithmeticProposalAuthority: true;
  readonly ownsSourceCaptureOrHitProvenanceAuthority: false;
  readonly ownsCollisionOrGeometryAuthority: false;
  readonly ownsHealthDefaultsOrTuningAuthority: false;
  readonly ownsHealthMutationAuthority: false;
  readonly ownsDamageSourceResolutionAuthority: false;
  readonly ownsActualHitAuthorizationAuthority: false;
  readonly ownsStructuralTopologyOrExposureAuthority: false;
  readonly ownsTargetEligibilityAuthority: false;
  readonly ownsHitIntentAdmissionAuthority: false;
  readonly ownsDurabilitySnapshotAuthority: false;
  readonly ownsCoreOrBossHealthAuthority: false;
  readonly ownsDefeatOrRewardAuthority: false;
  readonly ownsPhaseOrTimerAuthority: false;
  readonly ownsAttackOrProjectileAuthority: false;
  readonly ownsSpawnOrRematchAuthority: false;
  readonly ownsRuntimeOrModeRoutingAuthority: false;
  readonly ownsHudOrPresentationAuthority: false;
  readonly ownsPersistenceOrEconomyAuthority: false;
  readonly ownsEntityOrProjectileCollectionAuthority: false;
  readonly ownsRandomnessAuthority: false;
  readonly ownsCapOrBudgetAuthority: false;
  readonly ownsFotonOrFormationAuthority: false;
}

export const BLACKOUT_ARCHITECT_STRUCTURAL_DIRECT_HIT_PROPOSAL_AUTHORITY_CONTRACT: Readonly<BlackoutArchitectStructuralDirectHitProposalAuthorityContract> =
  Object.freeze({
    ownsPureDirectHitArithmeticProposalAuthority: true,
    ownsSourceCaptureOrHitProvenanceAuthority: false,
    ownsCollisionOrGeometryAuthority: false,
    ownsHealthDefaultsOrTuningAuthority: false,
    ownsHealthMutationAuthority: false,
    ownsDamageSourceResolutionAuthority: false,
    ownsActualHitAuthorizationAuthority: false,
    ownsStructuralTopologyOrExposureAuthority: false,
    ownsTargetEligibilityAuthority: false,
    ownsHitIntentAdmissionAuthority: false,
    ownsDurabilitySnapshotAuthority: false,
    ownsCoreOrBossHealthAuthority: false,
    ownsDefeatOrRewardAuthority: false,
    ownsPhaseOrTimerAuthority: false,
    ownsAttackOrProjectileAuthority: false,
    ownsSpawnOrRematchAuthority: false,
    ownsRuntimeOrModeRoutingAuthority: false,
    ownsHudOrPresentationAuthority: false,
    ownsPersistenceOrEconomyAuthority: false,
    ownsEntityOrProjectileCollectionAuthority: false,
    ownsRandomnessAuthority: false,
    ownsCapOrBudgetAuthority: false,
    ownsFotonOrFormationAuthority: false,
  });

// Caller data is not trusted. Reject inherited, accessor, symbol and extra fields.
const getExactOwnData = (
  input: unknown,
  keys: readonly string[],
): Readonly<Record<string, unknown>> | null => {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }
  const prototype: unknown = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) return null;
  const present = Reflect.ownKeys(input);
  if (present.length !== keys.length || !keys.every((key) => present.includes(key))) {
    return null;
  }
  const values: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
  for (const key of keys) {
    const own = Object.getOwnPropertyDescriptor(input, key);
    if (!own || !Object.prototype.hasOwnProperty.call(own, "value")) {
      return null;
    }
    values[key] = own.value;
  }
  return values;
};

const resolveAdmittedAnchor = (
  input: unknown,
): BlackoutArchitectStructuralAnchorId | null => {
  if (!Object.isFrozen(input)) return null;
  const admission = getExactOwnData(input, [
    "bossId", "admissionMode", "chassisId", "enemyType", "intent", "disposition",
  ]);
  if (
    !admission ||
    admission.bossId !== "BLACKOUT_ARCHITECT" ||
    admission.admissionMode !== "HIT_INTENT_ONLY" ||
    admission.chassisId !== "TITAN_CORE" ||
    admission.enemyType !== EnemyType.BOSS_TITAN ||
    admission.disposition !== "ADMIT" ||
    !Object.isFrozen(admission.intent)
  ) {
    return null;
  }
  const intent = getExactOwnData(admission.intent, ["targetKind", "anchorId"]);
  if (
    !intent ||
    intent.targetKind !== "ANCHOR" ||
    !BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.some((id) => id === intent.anchorId)
  ) {
    return null;
  }
  return intent.anchorId as BlackoutArchitectStructuralAnchorId;
};

export const resolveBlackoutArchitectStructuralDirectHitProposal = (
  admissionInput: unknown,
  externalDurabilityInput: unknown,
  hitClaimInput: unknown,
): Readonly<BlackoutArchitectStructuralDirectHitProposal> | null => {
  const anchorId = resolveAdmittedAnchor(admissionInput);
  const snapshot = resolveBlackoutArchitectStructuralDurabilitySnapshot(externalDurabilityInput);
  const claim = getExactOwnData(hitClaimInput, ["sourceClaim", "resolvedDamage"]);
  if (
    anchorId === null ||
    !snapshot ||
    !claim ||
    claim.sourceClaim !== "DIRECT_PLAYER_PROJECTILE_CLAIM" ||
    typeof claim.resolvedDamage !== "number" ||
    !Number.isFinite(claim.resolvedDamage) ||
    claim.resolvedDamage <= 0
  ) {
    return null;
  }

  const targetFact = snapshot.anchorFacts.find((fact) => fact.anchorId === anchorId);
  if (!targetFact || targetFact.destroyed || !Array.isArray(externalDurabilityInput)) {
    return null;
  }

  // J9H already validated exact four health records, own data and finite bounds.
  const target = (externalDurabilityInput as readonly BlackoutArchitectStructuralDurabilityFact[])
    .find((fact) => fact.anchorId === anchorId);
  if (!target) return null;
  const currentHealth = Object.getOwnPropertyDescriptor(target, "currentHealth")?.value as unknown;
  const maxHealth = Object.getOwnPropertyDescriptor(target, "maxHealth")?.value as unknown;
  if (
    typeof currentHealth !== "number" ||
    typeof maxHealth !== "number" ||
    !Number.isFinite(currentHealth) ||
    !Number.isFinite(maxHealth) ||
    currentHealth <= 0 ||
    currentHealth > maxHealth
  ) {
    return null;
  }

  const resolvedDamage = claim.resolvedDamage;
  const appliedDamage = Math.min(resolvedDamage, currentHealth);
  const remainingHealth = Math.max(0, currentHealth - appliedDamage);
  // Reject loss of representable health change rather than falsely report a hit.
  if (!Number.isFinite(remainingHealth) || remainingHealth >= currentHealth) {
    return null;
  }

  // A proposal never mutates caller state, collision state or live boss health.
  return Object.freeze({
    bossId: "BLACKOUT_ARCHITECT",
    transitionMode: "PROPOSAL_ONLY",
    chassisId: "TITAN_CORE",
    enemyType: EnemyType.BOSS_TITAN,
    anchorId,
    sourceClaim: "DIRECT_PLAYER_PROJECTILE_CLAIM",
    currentHealth,
    maxHealth,
    resolvedDamage,
    appliedDamage,
    remainingHealth,
    wouldDestroy: remainingHealth === 0,
    mutatesHealth: false,
    establishesCollisionProvenance: false,
    registersDefeat: false,
    awardsRewards: false,
  });
};
