import {
  DYNAMIC_EVENT_MAX_WAVE_COUNT,
  DYNAMIC_EVENT_MIN_WAVE_COUNT,
  type DynamicMidSectorEventOpportunity,
} from "./dynamicMidSectorEventOpportunity";
import {
  DYNAMIC_MID_SECTOR_EVENT_IDS,
  type DynamicMidSectorEventId,
} from "./dynamicMidSectorEventIdentity";

export type DynamicMidSectorEventSelectionMode = "SELECTION_ONLY";
export type DynamicMidSectorEventSelectionKind =
  "DYNAMIC_MID_SECTOR_EVENT_SELECTION";

export interface DynamicMidSectorEventSelectionAuthorityContract {
  ownsOpportunitySelectionAuthority: false;
  ownsEventSelectionAuthority: true;
  ownsEventExecutionAuthority: false;
  ownsMutatorMappingAuthority: false;
  ownsEnvironmentAuthority: false;
  ownsSpawnAuthority: false;
  ownsProgressionAuthority: false;
  ownsEntityCollection: false;
  ownsProjectileCollection: false;
  ownsDamageAuthority: false;
  ownsDefeatAuthority: false;
  ownsScoreAuthority: false;
  ownsRewardAuthority: false;
  ownsEconomyAuthority: false;
  ownsClock: false;
  ownsRandomness: false;
  ownsFullArrayScan: false;
  mayLookupEntities: false;
  mayMutateEntities: false;
  mayMutateGlobalCaps: false;
  mayCreateEntities: false;
  mayRemoveEntities: false;
}

export interface DynamicMidSectorEventSelection {
  readonly kind: DynamicMidSectorEventSelectionKind;
  readonly selectionMode: DynamicMidSectorEventSelectionMode;
  readonly sourceMode: "INFINITE";
  readonly sector: number;
  readonly waveIndex: number;
  readonly waveCount: number;
  readonly opportunityId: string;
  readonly identityFingerprint: string;
  readonly selectionIndex: number;
  readonly eventId: DynamicMidSectorEventId;
  readonly selectsOpportunity: false;
  readonly selectsEventIdentity: true;
  readonly mapsToMutatorEffect: false;
  readonly executesLiveEffect: false;
  readonly mutatesEnvironment: false;
  readonly spawnsEntities: false;
  readonly awardsRewards: false;
}

export const DYNAMIC_MID_SECTOR_EVENT_SELECTION_AUTHORITY_CONTRACT: Readonly<DynamicMidSectorEventSelectionAuthorityContract> =
  Object.freeze({
    ownsOpportunitySelectionAuthority: false,
    ownsEventSelectionAuthority: true,
    ownsEventExecutionAuthority: false,
    ownsMutatorMappingAuthority: false,
    ownsEnvironmentAuthority: false,
    ownsSpawnAuthority: false,
    ownsProgressionAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
    ownsClock: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

const EXACT_IDENTITY_FINGERPRINT = /^[0-9a-f]{8}$/;

const isCurrentJ6AOpportunity = (
  opportunity: Readonly<DynamicMidSectorEventOpportunity>,
) => {
  if (opportunity.kind !== "DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY") return false;
  if (opportunity.opportunityMode !== "OPPORTUNITY_ONLY") return false;
  if (opportunity.sourceMode !== "INFINITE") return false;
  if (!Number.isInteger(opportunity.sector) || opportunity.sector < 11) return false;
  if (
    !Number.isInteger(opportunity.waveCount) ||
    opportunity.waveCount < DYNAMIC_EVENT_MIN_WAVE_COUNT ||
    opportunity.waveCount > DYNAMIC_EVENT_MAX_WAVE_COUNT
  ) {
    return false;
  }
  if (
    !Number.isInteger(opportunity.waveIndex) ||
    !Number.isInteger(opportunity.selectedWaveIndex) ||
    opportunity.waveIndex !== opportunity.selectedWaveIndex ||
    opportunity.waveIndex <= 1 ||
    opportunity.waveIndex >= opportunity.waveCount
  ) {
    return false;
  }
  if (!EXACT_IDENTITY_FINGERPRINT.test(opportunity.identityFingerprint)) {
    return false;
  }
  if (
    opportunity.opportunityId !==
    `j6a:${opportunity.sector}:${opportunity.selectedWaveIndex}:${opportunity.identityFingerprint}`
  ) {
    return false;
  }
  if (
    opportunity.selectsEventIdentity !== false ||
    opportunity.appliesLiveEffect !== false ||
    opportunity.mutatesEnvironment !== false ||
    opportunity.mutatesMutators !== false ||
    opportunity.spawnsEntities !== false ||
    opportunity.awardsRewards !== false
  ) {
    return false;
  }

  return true;
};

export const resolveDynamicMidSectorEventSelection = (
  opportunity: Readonly<DynamicMidSectorEventOpportunity> | null | undefined,
): Readonly<DynamicMidSectorEventSelection> | null => {
  if (!opportunity || !isCurrentJ6AOpportunity(opportunity)) return null;

  const selectionIndex =
    Number.parseInt(opportunity.identityFingerprint, 16) %
    DYNAMIC_MID_SECTOR_EVENT_IDS.length;
  const eventId = DYNAMIC_MID_SECTOR_EVENT_IDS[selectionIndex];

  if (!eventId) return null;

  return Object.freeze({
    kind: "DYNAMIC_MID_SECTOR_EVENT_SELECTION",
    selectionMode: "SELECTION_ONLY",
    sourceMode: "INFINITE",
    sector: opportunity.sector,
    waveIndex: opportunity.waveIndex,
    waveCount: opportunity.waveCount,
    opportunityId: opportunity.opportunityId,
    identityFingerprint: opportunity.identityFingerprint,
    selectionIndex,
    eventId,
    selectsOpportunity: false,
    selectsEventIdentity: true,
    mapsToMutatorEffect: false,
    executesLiveEffect: false,
    mutatesEnvironment: false,
    spawnsEntities: false,
    awardsRewards: false,
  });
};
