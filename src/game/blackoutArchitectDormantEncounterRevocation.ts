/** B2B2A: dormant null-only engine revocation. No Architect encounter is minted. */
export type BlackoutArchitectDormantEncounterSlot = null;

export const BLACKOUT_ARCHITECT_DORMANT_REVOCATION_AUTHORITY_CONTRACT = Object.freeze({
  ownsDormantEncounterRevocationOnly: true,
  ownsEngineEncounterIssuanceAuthority: false,
  ownsAuthenticatedEncounterIdentityAuthority: false,
  ownsLifecycleFreshnessOrReplayAuthority: false,
  ownsPhysicalCardinalGeometryAuthority: false,
  ownsAnchorDurabilityAuthority: false,
  ownsCollisionProvenanceAuthority: false,
  ownsProjectileConsumptionAuthority: false,
  ownsBossHealthOrDamageAuthority: false,
  ownsBossSpawnOrAttackAuthority: false,
  ownsBossPhaseOrExposureAuthority: false,
  ownsRuntimeOrModeRoutingAuthority: false,
  ownsRewardsOrPersistenceAuthority: false,
  ownsTimerOrRandomnessAuthority: false,
  ownsProjectileOrEntityCollectionAuthority: false,
  ownsFotonOrFormationAuthority: false,
  ownsCapOrBudgetAuthority: false,
} as const);

/** Identity issuance is deliberately absent: null is the only valid slot. */
export const revokeBlackoutArchitectDormantEncounter =
  (): BlackoutArchitectDormantEncounterSlot => null;
