/**
 * ES-13J9L-B2B2B1 — ISOLATED OFFLINE PROTOTYPE, not engine authority.
 *
 * A caller may create an offline factory and its candidates. These records are
 * never live-engine-issued encounters or authenticated physical collision data.
 */
export type BlackoutArchitectOfflineCandidateMode = "FACTORY_ONLY";

export interface BlackoutArchitectOfflineCandidate {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly candidateMode: BlackoutArchitectOfflineCandidateMode;
  readonly runEpoch: number;
  readonly encounterOrdinal: number;
  readonly engineEncounterIssued: false;
  readonly authenticatedLiveBossReference: false;
  readonly lifecycleFreshnessCertified: false;
  readonly physicalCardinalGeometryVerified: false;
  readonly collisionProvenanceVerified: false;
  readonly projectileConsumptionAuthorized: false;
  readonly globalReplayPreventionAuthorized: false;
  readonly bossHealthOrDamageAuthorized: false;
  readonly bossSpawnAuthorized: false;
  readonly bossPhaseOrAttackAuthorized: false;
  readonly runtimeOrModeRoutingAuthorized: false;
  readonly rewardsOrPersistenceAuthorized: false;
}

export interface BlackoutArchitectOfflineCandidateFactory {
  readonly begin: (runEpoch: unknown) => Readonly<BlackoutArchitectOfflineCandidate> | null;
  readonly isCurrent: (candidate: unknown) => boolean;
  readonly getCurrent: () => Readonly<BlackoutArchitectOfflineCandidate> | null;
  readonly revoke: () => null;
}

export const BLACKOUT_ARCHITECT_OFFLINE_CANDIDATE_AUTHORITY_CONTRACT = Object.freeze({
  ownsIsolatedOfflineCandidateConstructionOnly: true,
  ownsEngineEncounterIssuanceAuthority: false,
  ownsAuthenticatedLiveBossIdentityAuthority: false,
  ownsPhysicalCardinalGeometryAuthority: false,
  ownsAnchorDurabilityAuthority: false,
  ownsCollisionProvenanceAuthority: false,
  ownsProjectileConsumptionAuthority: false,
  ownsGlobalReplayPreventionAuthority: false,
  ownsBossHealthOrDamageAuthority: false,
  ownsBossSpawnOrAttackAuthority: false,
  ownsBossPhaseOrExposureAuthority: false,
  ownsRuntimeOrModeRoutingAuthority: false,
  ownsRewardsOrPersistenceAuthority: false,
  ownsTimersOrRandomnessAuthority: false,
  ownsProjectileOrEntityCollectionAuthority: false,
  ownsFotonOrFormationAuthority: false,
  ownsCapOrBudgetAuthority: false,
} as const);

const isPositiveSafeOrdinal = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isSafeInteger(value) &&
  value > 0 &&
  !Object.is(value, -0);

/** Pure arithmetic preflight, NOT a trusted live-engine epoch. */
export const nextBlackoutArchitectOfflineCandidateOrdinal = (
  previous: unknown,
): number | null =>
  typeof previous === "number" &&
  Number.isSafeInteger(previous) &&
  previous >= 0 &&
  !Object.is(previous, -0) &&
  previous < Number.MAX_SAFE_INTEGER
    ? previous + 1
    : null;

/**
 * Closure-private ownership: no external input can provide an ordinal, and
 * no record is considered current merely because its fields match.
 */
export const createBlackoutArchitectOfflineCandidateFactory =
  (): Readonly<BlackoutArchitectOfflineCandidateFactory> => {
    let ordinal = 0;
    let current: Readonly<BlackoutArchitectOfflineCandidate> | null = null;

    const revoke = (): null => {
      current = null;
      return null;
    };

    const begin = (runEpoch: unknown): Readonly<BlackoutArchitectOfflineCandidate> | null => {
      // Failed calls also revoke previous candidates; the ordinal never rewinds.
      current = null;
      if (!isPositiveSafeOrdinal(runEpoch)) return null;
      const next = nextBlackoutArchitectOfflineCandidateOrdinal(ordinal);
      if (next === null) return null;
      ordinal = next;
      current = Object.freeze({
        bossId: "BLACKOUT_ARCHITECT",
        candidateMode: "FACTORY_ONLY",
        runEpoch,
        encounterOrdinal: ordinal,
        engineEncounterIssued: false,
        authenticatedLiveBossReference: false,
        lifecycleFreshnessCertified: false,
        physicalCardinalGeometryVerified: false,
        collisionProvenanceVerified: false,
        projectileConsumptionAuthorized: false,
        globalReplayPreventionAuthorized: false,
        bossHealthOrDamageAuthorized: false,
        bossSpawnAuthorized: false,
        bossPhaseOrAttackAuthorized: false,
        runtimeOrModeRoutingAuthorized: false,
        rewardsOrPersistenceAuthorized: false,
      });
      return current;
    };

    const isCurrent = (candidate: unknown): boolean =>
      current !== null && candidate === current;

    const getCurrent = (): Readonly<BlackoutArchitectOfflineCandidate> | null => current;

    return Object.freeze({ begin, isCurrent, getCurrent, revoke });
  };
