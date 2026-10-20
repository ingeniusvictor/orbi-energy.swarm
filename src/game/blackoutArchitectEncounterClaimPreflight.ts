import {
  BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS,
  type BlackoutArchitectStructuralAnchorId,
} from "./blackoutArchitectStructuralTopology";

export type BlackoutArchitectEncounterClaimPreflightMode = "PREFLIGHT_ONLY";

export interface BlackoutArchitectEncounterClaimPreflightProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly preflightMode: BlackoutArchitectEncounterClaimPreflightMode;
  readonly chassisId: "TITAN_CORE";
  readonly runEpoch: number;
  readonly encounterOrdinal: number;
  readonly physicsFrame: number;
  readonly anchorIds: readonly BlackoutArchitectStructuralAnchorId[];
  readonly engineEncounterIssued: false;
  readonly trustedEncounterIdentity: false;
  readonly lifecycleFreshnessVerified: false;
  readonly physicalAnchorGeometryVerified: false;
  readonly collisionProvenanceVerified: false;
  readonly projectileIdentityAuthenticated: false;
  readonly consumesProjectile: false;
  readonly preventsReplay: false;
  readonly authorizesDamage: false;
  readonly mutatesHealth: false;
  readonly spawnsBoss: false;
  readonly routesGameMode: false;
}

export const BLACKOUT_ARCHITECT_ENCOUNTER_CLAIM_PREFLIGHT_AUTHORITY_CONTRACT = Object.freeze({
  ownsPureCallerClaimPreflightAuthority: true,
  ownsEngineEncounterIssuanceAuthority: false,
  ownsTrustedEncounterIdentityAuthority: false,
  ownsEngineLifecycleAuthority: false,
  ownsPhysicalAnchorGeometryAuthority: false,
  ownsAnchorDurabilityAuthority: false,
  ownsCollisionDetectionOrProvenanceAuthority: false,
  ownsProjectileIdentityAuthority: false,
  ownsProjectileConsumptionAuthority: false,
  ownsGlobalReplayPreventionAuthority: false,
  ownsBossHealthOrDamageAuthority: false,
  ownsBossSpawnAttackOrPhaseAuthority: false,
  ownsRuntimeOrModeRoutingAuthority: false,
  ownsEconomyOrRewardsAuthority: false,
  ownsTimersOrRandomnessAuthority: false,
  ownsProjectileOrEntityCollectionAuthority: false,
  ownsFotonOrFormationAuthority: false,
  ownsCapOrBudgetAuthority: false,
} as const);

const CLAIM_FIELDS = Object.freeze([
  "bossId",
  "runEpoch",
  "encounterOrdinal",
  "physicsFrame",
  "chassisId",
  "anchorIds",
] as const);

const isSafeOrdinal = (value: unknown, positive: boolean): value is number =>
  typeof value === "number" &&
  Number.isSafeInteger(value) &&
  !Object.is(value, -0) &&
  (positive ? value > 0 : value >= 0);

// Caller-supplied fields remain untrusted even when shape-valid. Inspect only
// own data descriptors, never evaluate caller accessors.
const readExactOwnData = (
  input: unknown,
): Readonly<Record<(typeof CLAIM_FIELDS)[number], unknown>> | null => {
  if (input === null || typeof input !== "object" || Array.isArray(input)) return null;
  if (Object.getPrototypeOf(input) !== Object.prototype) return null;
  const keys = Reflect.ownKeys(input);
  if (keys.length !== CLAIM_FIELDS.length || !CLAIM_FIELDS.every((key) => keys.includes(key))) {
    return null;
  }
  const values = Object.create(null) as Record<(typeof CLAIM_FIELDS)[number], unknown>;
  for (const field of CLAIM_FIELDS) {
    const descriptor = Object.getOwnPropertyDescriptor(input, field);
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) return null;
    values[field] = descriptor.value;
  }
  return values;
};

const hasExactCardinalRoster = (value: unknown): boolean => {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || value.length !== 4) {
    return false;
  }
  const keys = Reflect.ownKeys(value);
  if (keys.length !== 5 || !keys.includes("length")) return false;
  let seenMask = 0;
  for (let index = 0; index < 4; index++) {
    const key = String(index);
    if (!keys.includes(key)) return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) return false;
    const cardinalIndex = BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS.findIndex(
      (id) => id === descriptor.value,
    );
    if (cardinalIndex < 0 || (seenMask & (1 << cardinalIndex)) !== 0) return false;
    seenMask |= 1 << cardinalIndex;
  }
  return seenMask === 0b1111;
};

/**
 * Pure, isolated caller-claim preflight. Neither shape validity nor frozen
 * output establishes an engine-issued encounter or an actual collision.
 */
export const resolveBlackoutArchitectEncounterClaimPreflight = (
  input: unknown,
): Readonly<BlackoutArchitectEncounterClaimPreflightProjection> | null => {
  try {
    const claim = readExactOwnData(input);
    if (
      !claim ||
      claim.bossId !== "BLACKOUT_ARCHITECT" ||
      claim.chassisId !== "TITAN_CORE" ||
      !isSafeOrdinal(claim.runEpoch, true) ||
      !isSafeOrdinal(claim.encounterOrdinal, true) ||
      !isSafeOrdinal(claim.physicsFrame, false) ||
      !hasExactCardinalRoster(claim.anchorIds)
    ) return null;

    return Object.freeze({
      bossId: "BLACKOUT_ARCHITECT",
      preflightMode: "PREFLIGHT_ONLY",
      chassisId: "TITAN_CORE",
      runEpoch: claim.runEpoch,
      encounterOrdinal: claim.encounterOrdinal,
      physicsFrame: claim.physicsFrame,
      anchorIds: BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS,
      engineEncounterIssued: false,
      trustedEncounterIdentity: false,
      lifecycleFreshnessVerified: false,
      physicalAnchorGeometryVerified: false,
      collisionProvenanceVerified: false,
      projectileIdentityAuthenticated: false,
      consumesProjectile: false,
      preventsReplay: false,
      authorizesDamage: false,
      mutatesHealth: false,
      spawnsBoss: false,
      routesGameMode: false,
    });
  } catch {
    // Throwing traps/descriptors cannot establish a valid claim.
    return null;
  }
};
