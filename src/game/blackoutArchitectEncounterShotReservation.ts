import {
  BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS,
  type BlackoutArchitectStructuralAnchorId,
} from "./blackoutArchitectStructuralTopology";

export type BlackoutArchitectShotReservationMode = "REFERENCE_RESERVATION_ONLY";

export interface BlackoutArchitectShotReservationProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly reservationMode: "RESERVED_ONLY";
  readonly runEpoch: number;
  readonly frameSequence: number;
  readonly projectileOrdinal: number;
  readonly anchorId: BlackoutArchitectStructuralAnchorId;
  readonly collisionProvenanceVerified: false;
  readonly projectileIdentityAuthenticated: false;
  readonly consumesProjectile: false;
  readonly preventsGlobalReplay: false;
  readonly authorizesDamage: false;
  readonly mutatesHealth: false;
}

export interface BlackoutArchitectEncounterShotReservation {
  readonly runEpoch: number;
  readonly reservationMode: BlackoutArchitectShotReservationMode;
  readonly reserve: (
    projectile: unknown,
    currentPhysicsFrame: unknown,
    anchorId: unknown,
  ) => Readonly<BlackoutArchitectShotReservationProjection> | null;
}

export const BLACKOUT_ARCHITECT_SHOT_RESERVATION_AUTHORITY_CONTRACT = Object.freeze({
  ownsIsolatedReferenceReservationAuthority: true,
  ownsEngineEncounterIssuanceAuthority: false,
  ownsTrustedProjectileIdentityAuthority: false,
  ownsPhysicalAnchorGeometryAuthority: false,
  ownsCollisionDetectionOrProvenanceAuthority: false,
  ownsProjectileConsumptionAuthority: false,
  ownsGlobalReplayPreventionAuthority: false,
  ownsBossHealthOrDamageAuthority: false,
  ownsHitIntentAdmissionAuthority: false,
  ownsDirectHitProposalAdoptionAuthority: false,
  ownsBossSpawnOrAttackAuthority: false,
  ownsRuntimeOrModeRoutingAuthority: false,
  ownsProjectileCollectionAuthority: false,
  ownsRandomnessAuthority: false,
  ownsCapOrBudgetAuthority: false,
  ownsFotonOrFormationAuthority: false,
} as const);

const isNonnegativeSafeOrdinal = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isSafeInteger(value) &&
  value >= 0 &&
  !Object.is(value, -0);

const isPositiveSafeOrdinal = (value: unknown): value is number =>
  isNonnegativeSafeOrdinal(value) && value > 0;

// Examine own data descriptors only; never evaluate a caller-supplied getter.
const ownDataValue = (value: object, key: string): unknown => {
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  return descriptor && Object.prototype.hasOwnProperty.call(descriptor, "value")
    ? descriptor.value
    : undefined;
};

/**
 * This is a private per-ledger reference reservation, not a collision ticket.
 * Caller input can be spoofed or cloned. Only an eventual engine-owned adapter
 * can establish that a physical impact and encounter identity are authentic.
 */
export const createBlackoutArchitectEncounterShotReservation = (
  runEpochInput: unknown,
): Readonly<BlackoutArchitectEncounterShotReservation> | null => {
  if (!isPositiveSafeOrdinal(runEpochInput)) return null;
  const runEpoch = runEpochInput;
  const reservedProjectiles = new WeakSet<object>();

  return Object.freeze({
    runEpoch,
    reservationMode: "REFERENCE_RESERVATION_ONLY" as const,
    reserve: (
      projectile: unknown,
      currentPhysicsFrame: unknown,
      anchorId: unknown,
    ): Readonly<BlackoutArchitectShotReservationProjection> | null => {
      try {
        if (
          projectile === null ||
          typeof projectile !== "object" ||
          Array.isArray(projectile) ||
          Object.getPrototypeOf(projectile) !== Object.prototype ||
          !Object.isExtensible(projectile) ||
          !isNonnegativeSafeOrdinal(currentPhysicsFrame) ||
          !BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.some((id) => id === anchorId)
        ) return null;
        const fromPlayer = ownDataValue(projectile, "fromPlayer");
        const life = ownDataValue(projectile, "life");
        const shotRunEpoch = ownDataValue(projectile, "collisionTraceRunEpoch");
        const createdFrame = ownDataValue(projectile, "collisionTracePhysicsFrame");
        const projectileOrdinal = ownDataValue(projectile, "collisionTraceProjectileOrdinal");
        if (
          fromPlayer !== true ||
          typeof life !== "number" || !Number.isFinite(life) || life <= 0 ||
          !isPositiveSafeOrdinal(shotRunEpoch) || shotRunEpoch !== runEpoch ||
          !isNonnegativeSafeOrdinal(createdFrame) ||
          currentPhysicsFrame < createdFrame ||
          !isPositiveSafeOrdinal(projectileOrdinal) ||
          Object.prototype.hasOwnProperty.call(projectile, "collisionTraceObservedLegacyHitFrame") ||
          Object.prototype.hasOwnProperty.call(projectile, "collisionTraceObservedLegacyHitKind") ||
          reservedProjectiles.has(projectile)
        ) return null;

        reservedProjectiles.add(projectile);
        return Object.freeze({
          bossId: "BLACKOUT_ARCHITECT",
          reservationMode: "RESERVED_ONLY",
          runEpoch,
          frameSequence: currentPhysicsFrame,
          projectileOrdinal,
          anchorId: anchorId as BlackoutArchitectStructuralAnchorId,
          collisionProvenanceVerified: false,
          projectileIdentityAuthenticated: false,
          consumesProjectile: false,
          preventsGlobalReplay: false,
          authorizesDamage: false,
          mutatesHealth: false,
        });
      } catch {
        // Invalid proxy/descriptors cannot establish any reservation.
        return null;
      }
    },
  });
};
