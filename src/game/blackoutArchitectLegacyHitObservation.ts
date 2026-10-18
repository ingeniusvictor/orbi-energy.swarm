import type { Projectile } from "./types";

export type BlackoutArchitectLegacyHitKind = "LEGACY_SHIELD_NODE" | "LEGACY_ENEMY";

export const BLACKOUT_ARCHITECT_LEGACY_HIT_OBSERVATION_AUTHORITY_CONTRACT = Object.freeze({
  ownsPassiveLegacyPlayerHitObservationAuthority: true,
  ownsNewCollisionDetectionAuthority: false,
  ownsTrustedHitProvenanceAuthority: false,
  ownsCardinalAnchorBindingAuthority: false,
  ownsExactOnceEncounterLedgerAuthority: false,
  ownsDamageOrHealthMutationAuthority: false,
  ownsProjectileLifecycleOrConsumptionAuthority: false,
  ownsBossSpawnAttackOrPhaseAuthority: false,
  ownsModeEconomyOrRewardsAuthority: false,
  ownsRandomnessOrEntityCollectionAuthority: false,
  ownsFotonCapOrBudgetAuthority: false,
} as const);

const isNonnegativeSafeOrdinal = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isSafeInteger(value) &&
  value >= 0 &&
  !Object.is(value, -0);

const isPositiveSafeOrdinal = (value: unknown): value is number =>
  isNonnegativeSafeOrdinal(value) && value > 0;

// Only call after an existing engine-owned legacy player projectile hit already
// set projectile.life = 0. This marks an observation, NOT a trusted hit ticket.
export const observeBlackoutArchitectLegacyPlayerHit = (
  projectile: Projectile,
  currentRunEpoch: number | null,
  currentPhysicsFrame: number | null,
  kind: BlackoutArchitectLegacyHitKind,
): boolean => {
  if (
    !projectile || typeof projectile !== "object" ||
    Object.getPrototypeOf(projectile) !== Object.prototype ||
    !Object.isExtensible(projectile) ||
    projectile.fromPlayer !== true ||
    typeof projectile.life !== "number" ||
    !Number.isFinite(projectile.life) ||
    projectile.life > 0 ||
    !isPositiveSafeOrdinal(currentRunEpoch) ||
    !isNonnegativeSafeOrdinal(currentPhysicsFrame) ||
    !isPositiveSafeOrdinal(projectile.collisionTraceRunEpoch) ||
    projectile.collisionTraceRunEpoch !== currentRunEpoch ||
    !isNonnegativeSafeOrdinal(projectile.collisionTracePhysicsFrame) ||
    currentPhysicsFrame < projectile.collisionTracePhysicsFrame ||
    !isPositiveSafeOrdinal(projectile.collisionTraceProjectileOrdinal) ||
    (kind !== "LEGACY_SHIELD_NODE" && kind !== "LEGACY_ENEMY") ||
    Object.prototype.hasOwnProperty.call(projectile, "collisionTraceObservedLegacyHitFrame") ||
    Object.prototype.hasOwnProperty.call(projectile, "collisionTraceObservedLegacyHitKind")
  ) return false;

  // A successful call is at most one observation per actual projectile object.
  // The caller's existing collision ordering and combat effects remain unchanged.
  projectile.collisionTraceObservedLegacyHitFrame = currentPhysicsFrame;
  projectile.collisionTraceObservedLegacyHitKind = kind;
  return true;
};
