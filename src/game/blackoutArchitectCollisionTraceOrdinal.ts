// J9L-A is a bounded scalar successor for engine-owned metadata only.
// No collision detection, authenticity, consumption or replay prevention.
export const nextBlackoutArchitectCollisionTraceOrdinal = (current: unknown): number | null => {
  if (
    typeof current !== "number" ||
    !Number.isSafeInteger(current) ||
    current < 0 ||
    Object.is(current, -0) ||
    current >= Number.MAX_SAFE_INTEGER
  ) return null;
  return current + 1;
};

export const BLACKOUT_ARCHITECT_COLLISION_TRACE_ORDINAL_AUTHORITY_CONTRACT = Object.freeze({
  ownsPureBoundedOrdinalSuccessorAuthority: true,
  ownsCollisionDetectionOrPhysicalGeometryAuthority: false,
  ownsCollisionEventIssuanceAuthority: false,
  ownsProjectileConsumptionOrReplayPreventionAuthority: false,
  ownsBossHealthOrDamageAuthority: false,
  ownsRunOrProjectileIdentityAuthenticationAuthority: false,
  ownsSpawnOrBossActivationAuthority: false,
  ownsModeRoutingOrTuningAuthority: false,
  ownsCapOrBudgetAuthority: false,
  ownsRandomnessAuthority: false,
} as const);
