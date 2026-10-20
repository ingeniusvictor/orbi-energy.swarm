import type {
  BlackoutArchitectOfflineCandidateFactory,
} from "./blackoutArchitectOfflineEncounterFactory";

/**
 * B2B2B2A: strictly offline reference-attachment rehearsal.
 * Both the candidate and the opaque "boss" object are caller-origin inputs;
 * successful attachment is NOT a true engine spawn or encounter issuance.
 */
export interface BlackoutArchitectOfflineReferenceAttachment {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly mode: "ATTACHMENT_REHEARSAL_ONLY";
  readonly candidateMode: "FACTORY_ONLY";
  readonly runEpoch: number;
  readonly encounterOrdinal: number;
  readonly engineEncounterIssued: false;
  readonly authenticatedLiveBossReference: false;
  readonly engineEpochAuthenticated: false;
  readonly lifecycleFreshnessCertified: false;
  readonly physicalCardinalGeometryVerified: false;
  readonly collisionProvenanceVerified: false;
  readonly projectileConsumptionAuthorized: false;
  readonly globalReplayPreventionAuthorized: false;
  readonly bossHealthOrDamageAuthorized: false;
  readonly bossSpawnOrAttackAuthorized: false;
  readonly bossPhaseOrExposureAuthorized: false;
  readonly runtimeOrModeRoutingAuthorized: false;
  readonly rewardsOrPersistenceAuthorized: false;
}

export interface BlackoutArchitectOfflineReferenceAttachmentOwner {
  readonly attach: (candidate: unknown, reference: unknown, runEpoch: unknown) =>
    Readonly<BlackoutArchitectOfflineReferenceAttachment> | null;
  readonly isAttached: (candidate: unknown, reference: unknown, runEpoch: unknown) => boolean;
  readonly getCurrent: () => Readonly<BlackoutArchitectOfflineReferenceAttachment> | null;
  readonly revoke: () => null;
}

export const BLACKOUT_ARCHITECT_OFFLINE_REFERENCE_ATTACHMENT_AUTHORITY = Object.freeze({
  ownsIsolatedReferenceAttachmentRehearsalOnly: true,
  ownsEngineEncounterIssuanceAuthority: false,
  ownsAuthenticatedLiveBossIdentityAuthority: false,
  ownsEngineRunEpochAuthority: false,
  ownsLifecycleFreshnessAuthority: false,
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
  ownsTimerOrRandomnessAuthority: false,
  ownsProjectileOrEntityCollectionAuthority: false,
  ownsFotonOrFormationAuthority: false,
  ownsCapOrBudgetAuthority: false,
} as const);

const positiveSafe = (v: unknown): v is number =>
  typeof v === "number" && Number.isSafeInteger(v) && v > 0 && !Object.is(v, -0);

/** Read only data descriptors, never invoke candidate accessors. */
const readCandidate = (value: unknown): { runEpoch: number; ordinal: number } | null => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  const field = (name: string): unknown => {
    const descriptor = Object.getOwnPropertyDescriptor(value, name);
    return descriptor && Object.prototype.hasOwnProperty.call(descriptor, "value")
      ? descriptor.value : undefined;
  };
  if (field("bossId") !== "BLACKOUT_ARCHITECT" ||
      field("candidateMode") !== "FACTORY_ONLY") return null;
  const runEpoch = field("runEpoch");
  const ordinal = field("encounterOrdinal");
  return positiveSafe(runEpoch) && positiveSafe(ordinal)
    ? { runEpoch, ordinal } : null;
};

/**
 * Closure-private current attachment. Caller-created objects are untrusted.
 * The owner never hands out an authenticated identity or a reference token.
 */
export const createBlackoutArchitectOfflineReferenceAttachmentOwner = (
  factory: BlackoutArchitectOfflineCandidateFactory,
): Readonly<BlackoutArchitectOfflineReferenceAttachmentOwner> => {
  let candidateRef: unknown = null;
  let bossRef: object | null = null;
  let current: Readonly<BlackoutArchitectOfflineReferenceAttachment> | null = null;

  const revoke = (): null => {
    current = null;
    candidateRef = null;
    bossRef = null;
    return null;
  };

  const valid = (candidate: unknown, reference: unknown, runEpoch: unknown): boolean => {
    if (!positiveSafe(runEpoch) ||
        reference === null || typeof reference !== "object" || Array.isArray(reference) ||
        !factory.isCurrent(candidate)) return false;
    const facts = readCandidate(candidate);
    return facts !== null && facts.runEpoch === runEpoch;
  };

  const attach = (
    candidate: unknown, reference: unknown, runEpoch: unknown,
  ): Readonly<BlackoutArchitectOfflineReferenceAttachment> | null => {
    // Never keep a previous attachment after a repeated or failed attach.
    const duplicate = current !== null && candidateRef === candidate && bossRef === reference;
    revoke();
    if (duplicate) return null;
    try {
      if (!valid(candidate, reference, runEpoch)) return null;
      const facts = readCandidate(candidate);
      if (!facts) return null;
      candidateRef = candidate;
      bossRef = reference as object;
      current = Object.freeze({
        bossId: "BLACKOUT_ARCHITECT",
        mode: "ATTACHMENT_REHEARSAL_ONLY",
        candidateMode: "FACTORY_ONLY",
        runEpoch: facts.runEpoch,
        encounterOrdinal: facts.ordinal,
        engineEncounterIssued: false,
        authenticatedLiveBossReference: false,
        engineEpochAuthenticated: false,
        lifecycleFreshnessCertified: false,
        physicalCardinalGeometryVerified: false,
        collisionProvenanceVerified: false,
        projectileConsumptionAuthorized: false,
        globalReplayPreventionAuthorized: false,
        bossHealthOrDamageAuthorized: false,
        bossSpawnOrAttackAuthorized: false,
        bossPhaseOrExposureAuthorized: false,
        runtimeOrModeRoutingAuthorized: false,
        rewardsOrPersistenceAuthorized: false,
      });
      return current;
    } catch {
      return revoke(); // Throwing proxy/factory cannot admit even an offline attachment.
    }
  };

  const isAttached = (candidate: unknown, reference: unknown, runEpoch: unknown): boolean => {
    if (current === null) return false;
    try {
      if (candidate !== candidateRef || reference !== bossRef ||
          runEpoch !== current.runEpoch ||
          !valid(candidate, reference, runEpoch)) {
        revoke();
        return false;
      }
      return true;
    } catch {
      revoke();
      return false;
    }
  };

  const getCurrent = (): Readonly<BlackoutArchitectOfflineReferenceAttachment> | null => {
    if (current === null) return null;
    try {
      if (!valid(candidateRef, bossRef, current.runEpoch)) return revoke();
      return current;
    } catch {
      return revoke();
    }
  };

  return Object.freeze({ attach, isAttached, getCurrent, revoke });
};
