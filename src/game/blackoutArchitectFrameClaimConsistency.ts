import {
  BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS,
  type BlackoutArchitectStructuralAnchorId,
} from "./blackoutArchitectStructuralTopology";

export type BlackoutArchitectFrameClaimMode = "FRAME_CLAIM_CONSISTENCY_ONLY";

export interface BlackoutArchitectCallerFrameSnapshot {
  readonly encounterId: string;
  readonly frameSequence: number;
  readonly projectileId: string;
  readonly projectileAlive: boolean;
  readonly projectileFromPlayer: boolean;
  readonly projectileConsumed: boolean;
}

export interface BlackoutArchitectCallerContactClaim {
  readonly encounterId: string;
  readonly frameSequence: number;
  readonly projectileId: string;
  readonly anchorId: BlackoutArchitectStructuralAnchorId;
}

export interface BlackoutArchitectFrameClaimConsistencyProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly frameClaimMode: BlackoutArchitectFrameClaimMode;
  readonly encounterId: string;
  readonly frameSequence: number;
  readonly projectileId: string;
  readonly anchorId: BlackoutArchitectStructuralAnchorId;
  readonly collisionProvenanceVerified: false;
  readonly projectileLifecycleVerified: false;
  readonly preventsReplay: false;
  readonly authorizesDamage: false;
  readonly mutatesHealth: false;
}

export interface BlackoutArchitectFrameClaimConsistencyAuthorityContract {
  readonly ownsPureCallerClaimConsistencyAuthority: true;
  readonly ownsEngineEncounterIdentityAuthority: false;
  readonly ownsMonotonicPhysicsFrameAuthority: false;
  readonly ownsProjectileIdentityOrLifecycleAuthority: false;
  readonly ownsProjectileConsumptionAuthority: false;
  readonly ownsCollisionDetectionOrProvenanceAuthority: false;
  readonly ownsGeometryOrAnchorBindingAuthority: false;
  readonly ownsReplayPreventionAuthority: false;
  readonly ownsStructuralTopologyAuthority: false;
  readonly ownsTargetEligibilityAuthority: false;
  readonly ownsHitIntentAdmissionAuthority: false;
  readonly ownsDurabilitySnapshotAuthority: false;
  readonly ownsDirectHitProposalAuthority: false;
  readonly ownsGeometricCandidateAuthority: false;
  readonly ownsCoreOrBossHealthAuthority: false;
  readonly ownsDamageCalculationOrApplicationAuthority: false;
  readonly ownsHealthMutationAuthority: false;
  readonly ownsDefeatOrRewardAuthority: false;
  readonly ownsPhaseOrTimerAuthority: false;
  readonly ownsAttackOrProjectileCreationAuthority: false;
  readonly ownsSpawnOrRematchAuthority: false;
  readonly ownsRuntimeOrModeRoutingAuthority: false;
  readonly ownsHudOrPresentationAuthority: false;
  readonly ownsPersistenceOrEconomyAuthority: false;
  readonly ownsEntityOrProjectileCollectionAuthority: false;
  readonly ownsRandomnessAuthority: false;
  readonly ownsCapOrBudgetAuthority: false;
  readonly ownsFotonOrFormationAuthority: false;
}

export const BLACKOUT_ARCHITECT_FRAME_CLAIM_CONSISTENCY_AUTHORITY_CONTRACT:
  Readonly<BlackoutArchitectFrameClaimConsistencyAuthorityContract> = Object.freeze({
    ownsPureCallerClaimConsistencyAuthority: true,
    ownsEngineEncounterIdentityAuthority: false,
    ownsMonotonicPhysicsFrameAuthority: false,
    ownsProjectileIdentityOrLifecycleAuthority: false,
    ownsProjectileConsumptionAuthority: false,
    ownsCollisionDetectionOrProvenanceAuthority: false,
    ownsGeometryOrAnchorBindingAuthority: false,
    ownsReplayPreventionAuthority: false,
    ownsStructuralTopologyAuthority: false,
    ownsTargetEligibilityAuthority: false,
    ownsHitIntentAdmissionAuthority: false,
    ownsDurabilitySnapshotAuthority: false,
    ownsDirectHitProposalAuthority: false,
    ownsGeometricCandidateAuthority: false,
    ownsCoreOrBossHealthAuthority: false,
    ownsDamageCalculationOrApplicationAuthority: false,
    ownsHealthMutationAuthority: false,
    ownsDefeatOrRewardAuthority: false,
    ownsPhaseOrTimerAuthority: false,
    ownsAttackOrProjectileCreationAuthority: false,
    ownsSpawnOrRematchAuthority: false,
    ownsRuntimeOrModeRoutingAuthority: false,
    ownsHudOrPresentationAuthority: false,
    ownsPersistenceOrEconomyAuthority: false,
    ownsEntityOrProjectileCollectionAuthority: false,
    ownsRandomnessAuthority: false,
    ownsCapOrBudgetAuthority: false,
    ownsFotonOrFormationAuthority: false,
  });

// Caller claims are untrusted. Read only own data descriptors; never invoke accessors.
const readExactOwnData = (
  value: unknown,
  keys: readonly string[],
): Readonly<Record<string, unknown>> | null => {
  try {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
    const prototype: unknown = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return null;
    const own = Reflect.ownKeys(value);
    if (own.length !== keys.length || !keys.every((key) => own.includes(key))) return null;
    const result: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
    for (const key of keys) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) {
        return null;
      }
      result[key] = descriptor.value;
    }
    return result;
  } catch {
    return null;
  }
};

const isBoundedIdentifier = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= 128 &&
  value.trim().length > 0 &&
  value.trim() === value;

const isExactFrameSequence = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isSafeInteger(value) &&
  value >= 0 &&
  !Object.is(value, -0);

const resolveFrozenGeometricAnchor = (
  value: unknown,
): BlackoutArchitectStructuralAnchorId | null => {
  try {
    if (!Object.isFrozen(value)) return null;
  } catch {
    return null;
  }
  const candidate = readExactOwnData(value, [
    "bossId", "candidateMode", "candidateAnchorId",
    "geometryProvenanceVerified", "projectileProvenanceVerified",
    "authorizesDamage", "mutatesHealth",
  ]);
  if (
    !candidate ||
    candidate.bossId !== "BLACKOUT_ARCHITECT" ||
    candidate.candidateMode !== "GEOMETRIC_CANDIDATE_ONLY" ||
    candidate.geometryProvenanceVerified !== false ||
    candidate.projectileProvenanceVerified !== false ||
    candidate.authorizesDamage !== false ||
    candidate.mutatesHealth !== false ||
    !BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.some(
      (id) => id === candidate.candidateAnchorId,
    )
  ) return null;
  return candidate.candidateAnchorId as BlackoutArchitectStructuralAnchorId;
};

export const resolveBlackoutArchitectFrameClaimConsistency = (
  callerFrameInput: unknown,
  callerContactInput: unknown,
  callerGeometricCandidateInput: unknown,
): Readonly<BlackoutArchitectFrameClaimConsistencyProjection> | null => {
  const frame = readExactOwnData(callerFrameInput, [
    "encounterId", "frameSequence", "projectileId",
    "projectileAlive", "projectileFromPlayer", "projectileConsumed",
  ]);
  const claim = readExactOwnData(callerContactInput, [
    "encounterId", "frameSequence", "projectileId", "anchorId",
  ]);
  const anchorId = resolveFrozenGeometricAnchor(callerGeometricCandidateInput);
  if (
    !frame || !claim || anchorId === null ||
    !isBoundedIdentifier(frame.encounterId) ||
    !isBoundedIdentifier(frame.projectileId) ||
    !isExactFrameSequence(frame.frameSequence) ||
    frame.projectileAlive !== true ||
    frame.projectileFromPlayer !== true ||
    frame.projectileConsumed !== false ||
    claim.encounterId !== frame.encounterId ||
    claim.projectileId !== frame.projectileId ||
    claim.frameSequence !== frame.frameSequence ||
    claim.anchorId !== anchorId
  ) return null;

  // This only cross-checks caller assertions. It cannot attest a real engine hit.
  return Object.freeze({
    bossId: "BLACKOUT_ARCHITECT",
    frameClaimMode: "FRAME_CLAIM_CONSISTENCY_ONLY",
    encounterId: frame.encounterId,
    frameSequence: frame.frameSequence,
    projectileId: frame.projectileId,
    anchorId,
    collisionProvenanceVerified: false,
    projectileLifecycleVerified: false,
    preventsReplay: false,
    authorizesDamage: false,
    mutatesHealth: false,
  });
};
