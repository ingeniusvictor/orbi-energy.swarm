import {
  BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS,
  type BlackoutArchitectStructuralAnchorId,
} from "./blackoutArchitectStructuralTopology";

export type BlackoutArchitectGeometricCandidateMode = "GEOMETRIC_CANDIDATE_ONLY";

export interface BlackoutArchitectCallerAnchorCircle {
  readonly anchorId: BlackoutArchitectStructuralAnchorId;
  readonly x: number;
  readonly y: number;
  readonly radius: number;
}

export interface BlackoutArchitectCallerProjectileProbe {
  readonly x: number;
  readonly y: number;
  readonly radius: number;
}

export interface BlackoutArchitectGeometricCandidateProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly candidateMode: BlackoutArchitectGeometricCandidateMode;
  readonly candidateAnchorId: BlackoutArchitectStructuralAnchorId | null;
  readonly geometryProvenanceVerified: false;
  readonly projectileProvenanceVerified: false;
  readonly authorizesDamage: false;
  readonly mutatesHealth: false;
}

export interface BlackoutArchitectGeometricCandidateAuthorityContract {
  readonly ownsPureCallerGeometryCandidateAuthority: true;
  readonly ownsPhysicalGeometrySourceAuthority: false;
  readonly ownsProjectileLifecycleAuthority: false;
  readonly ownsHitOrCollisionProvenanceAuthority: false;
  readonly ownsTimeFreshnessOrReplayAuthority: false;
  readonly ownsDamageCalculationOrApplicationAuthority: false;
  readonly ownsHealthMutationAuthority: false;
  readonly ownsStructuralTopologyAuthority: false;
  readonly ownsTargetEligibilityAuthority: false;
  readonly ownsHitIntentAdmissionAuthority: false;
  readonly ownsDurabilitySnapshotAuthority: false;
  readonly ownsDirectHitProposalAuthority: false;
  readonly ownsCoreOrBossHealthAuthority: false;
  readonly ownsCoordinateDefaultsOrPlacementAuthority: false;
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

export const BLACKOUT_ARCHITECT_GEOMETRIC_CANDIDATE_AUTHORITY_CONTRACT:
  Readonly<BlackoutArchitectGeometricCandidateAuthorityContract> = Object.freeze({
    ownsPureCallerGeometryCandidateAuthority: true,
    ownsPhysicalGeometrySourceAuthority: false,
    ownsProjectileLifecycleAuthority: false,
    ownsHitOrCollisionProvenanceAuthority: false,
    ownsTimeFreshnessOrReplayAuthority: false,
    ownsDamageCalculationOrApplicationAuthority: false,
    ownsHealthMutationAuthority: false,
    ownsStructuralTopologyAuthority: false,
    ownsTargetEligibilityAuthority: false,
    ownsHitIntentAdmissionAuthority: false,
    ownsDurabilitySnapshotAuthority: false,
    ownsDirectHitProposalAuthority: false,
    ownsCoreOrBossHealthAuthority: false,
    ownsCoordinateDefaultsOrPlacementAuthority: false,
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

// Caller geometry is untrusted: validate descriptors without invoking getters.
const readExactOwnData = (
  input: unknown,
  keys: readonly string[],
): Readonly<Record<string, unknown>> | null => {
  if (input === null || typeof input !== "object" || Array.isArray(input)) return null;
  const prototype: unknown = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) return null;
  const own = Reflect.ownKeys(input);
  if (own.length !== keys.length || !keys.every((key) => own.includes(key))) return null;
  const result: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) {
      return null;
    }
    result[key] = descriptor.value;
  }
  return result;
};

const isFourExactDenseDataEntries = (value: unknown): value is readonly unknown[] => {
  if (
    !Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Array.prototype ||
    value.length !== BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length
  ) return false;
  const present = Reflect.ownKeys(value);
  if (
    present.length !== BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length + 1 ||
    !present.includes("length")
  ) return false;
  for (let i = 0; i < BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length; i++) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(i));
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) return false;
  }
  return true;
};

const isFiniteCoordinate = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const resolveBlackoutArchitectStructuralGeometricCandidate = (
  callerAnchorGeometryInput: unknown,
  callerProjectileProbeInput: unknown,
): Readonly<BlackoutArchitectGeometricCandidateProjection> | null => {
  if (!isFourExactDenseDataEntries(callerAnchorGeometryInput)) return null;
  const probe = readExactOwnData(callerProjectileProbeInput, ["x", "y", "radius"]);
  if (
    !probe ||
    !isFiniteCoordinate(probe.x) ||
    !isFiniteCoordinate(probe.y) ||
    !isFiniteCoordinate(probe.radius) ||
    probe.radius < 0 ||
    Object.is(probe.radius, -0)
  ) return null;

  const unique = new Set<BlackoutArchitectStructuralAnchorId>();
  let candidateAnchorId: BlackoutArchitectStructuralAnchorId | null = null;
  for (let index = 0; index < callerAnchorGeometryInput.length; index++) {
    const anchor = readExactOwnData(callerAnchorGeometryInput[index], [
      "anchorId", "x", "y", "radius",
    ]);
    if (
      !anchor ||
      !BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.some((id) => id === anchor.anchorId) ||
      !isFiniteCoordinate(anchor.x) ||
      !isFiniteCoordinate(anchor.y) ||
      !isFiniteCoordinate(anchor.radius) ||
      anchor.radius <= 0
    ) return null;

    const anchorId = anchor.anchorId as BlackoutArchitectStructuralAnchorId;
    if (unique.has(anchorId)) return null;
    unique.add(anchorId);

    const dx = anchor.x - probe.x;
    const dy = anchor.y - probe.y;
    const combinedRadius = anchor.radius + probe.radius;
    if (
      !Number.isFinite(dx) || !Number.isFinite(dy) ||
      !Number.isFinite(combinedRadius)
    ) return null;
    const distance = Math.hypot(dx, dy);
    if (!Number.isFinite(distance)) return null;

    // A candidate is not proof of a live hit. Reject multi-anchor ambiguity.
    if (distance < combinedRadius) {
      if (candidateAnchorId !== null) return null;
      candidateAnchorId = anchorId;
    }
  }
  if (unique.size !== BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.length) return null;

  return Object.freeze({
    bossId: "BLACKOUT_ARCHITECT",
    candidateMode: "GEOMETRIC_CANDIDATE_ONLY",
    candidateAnchorId,
    geometryProvenanceVerified: false,
    projectileProvenanceVerified: false,
    authorizesDamage: false,
    mutatesHealth: false,
  });
};
