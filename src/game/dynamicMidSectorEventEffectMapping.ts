import {
  DYNAMIC_MID_SECTOR_EVENT_IDS,
  type DynamicMidSectorEventId,
} from "./dynamicMidSectorEventIdentity";
import type { DynamicMidSectorEventSelection } from "./dynamicMidSectorEventSelection";
import type { InfiniteMutator } from "./infiniteSectorDirector";

export type DynamicMidSectorEventEffectMappingKind =
  "DYNAMIC_MID_SECTOR_EVENT_EFFECT_MAPPING";
export type DynamicMidSectorEventEffectMappingMode = "COMPATIBILITY_ONLY";
export type DynamicMidSectorEventEffectMappingStatus = "MAPPED" | "UNMAPPED";

interface DynamicMidSectorEventEffectMappingBase {
  readonly kind: DynamicMidSectorEventEffectMappingKind;
  readonly mappingMode: DynamicMidSectorEventEffectMappingMode;
  readonly sourceMode: "INFINITE";
  readonly sector: number;
  readonly waveIndex: number;
  readonly waveCount: number;
  readonly opportunityId: string;
  readonly identityFingerprint: string;
  readonly selectionIndex: number;
  readonly eventId: DynamicMidSectorEventId;
  readonly selectsOpportunity: false;
  readonly selectsEventIdentity: false;
  readonly appliesMutatorEffect: false;
  readonly executesLiveEffect: false;
  readonly mutatesEnvironment: false;
  readonly spawnsEntities: false;
  readonly awardsRewards: false;
}

export interface DynamicMidSectorEventMappedEffectCompatibility
  extends DynamicMidSectorEventEffectMappingBase {
  readonly mappingStatus: "MAPPED";
  readonly mappedMutator: InfiniteMutator;
  readonly mapsToMutatorEffect: true;
}

export interface DynamicMidSectorEventUnmappedEffectCompatibility
  extends DynamicMidSectorEventEffectMappingBase {
  readonly mappingStatus: "UNMAPPED";
  readonly mappedMutator: null;
  readonly mapsToMutatorEffect: false;
}

export type DynamicMidSectorEventEffectMapping =
  | DynamicMidSectorEventMappedEffectCompatibility
  | DynamicMidSectorEventUnmappedEffectCompatibility;

export interface DynamicMidSectorEventEffectMappingAuthorityContract {
  ownsOpportunitySelectionAuthority: false;
  ownsEventSelectionAuthority: false;
  ownsCompatibilityMappingAuthority: true;
  ownsMutatorMappingAuthority: true;
  ownsMutatorApplicationAuthority: false;
  ownsEventExecutionAuthority: false;
  ownsEnvironmentAuthority: false;
  ownsRecipeAuthority: false;
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
  mayMutateEnvironment: false;
  mayMutateGlobalCaps: false;
  mayCreateEntities: false;
  mayRemoveEntities: false;
}

export const DYNAMIC_MID_SECTOR_EVENT_EFFECT_MAPPING_AUTHORITY_CONTRACT: Readonly<DynamicMidSectorEventEffectMappingAuthorityContract> =
  Object.freeze({
    ownsOpportunitySelectionAuthority: false,
    ownsEventSelectionAuthority: false,
    ownsCompatibilityMappingAuthority: true,
    ownsMutatorMappingAuthority: true,
    ownsMutatorApplicationAuthority: false,
    ownsEventExecutionAuthority: false,
    ownsEnvironmentAuthority: false,
    ownsRecipeAuthority: false,
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
    mayMutateEnvironment: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

const EVENT_MUTATOR_COMPATIBILITY: Readonly<
  Record<DynamicMidSectorEventId, InfiniteMutator | null>
> = Object.freeze({
  SOLAR_STORM: "ELECTRICAL_STORM",
  QUANTUM_RIFT: "MAGNETIC_DRIFT",
  BLACKOUT_SURGE: "REDUCED_VISIBILITY",
  CRYSTAL_RUSH: "UNSTABLE_RESOURCE_FIELDS",
  DYSON_ECLIPSE: null,
});

const EXACT_IDENTITY_FINGERPRINT = /^[0-9a-f]{8}$/;

const isCurrentJ6BBSelection = (
  selection: Readonly<DynamicMidSectorEventSelection>,
) => {
  if (selection.kind !== "DYNAMIC_MID_SECTOR_EVENT_SELECTION") return false;
  if (selection.selectionMode !== "SELECTION_ONLY") return false;
  if (selection.sourceMode !== "INFINITE") return false;
  if (!Number.isInteger(selection.sector) || selection.sector < 11) return false;
  if (
    !Number.isInteger(selection.waveCount) ||
    selection.waveCount < 3 ||
    selection.waveCount > 7
  ) {
    return false;
  }
  if (
    !Number.isInteger(selection.waveIndex) ||
    selection.waveIndex <= 1 ||
    selection.waveIndex >= selection.waveCount
  ) {
    return false;
  }
  if (!EXACT_IDENTITY_FINGERPRINT.test(selection.identityFingerprint)) {
    return false;
  }
  if (
    selection.opportunityId !==
    `j6a:${selection.sector}:${selection.waveIndex}:${selection.identityFingerprint}`
  ) {
    return false;
  }
  if (
    !Number.isInteger(selection.selectionIndex) ||
    selection.selectionIndex < 0 ||
    selection.selectionIndex >= DYNAMIC_MID_SECTOR_EVENT_IDS.length
  ) {
    return false;
  }

  const expectedSelectionIndex =
    Number.parseInt(selection.identityFingerprint, 16) %
    DYNAMIC_MID_SECTOR_EVENT_IDS.length;
  if (selection.selectionIndex !== expectedSelectionIndex) return false;
  if (selection.eventId !== DYNAMIC_MID_SECTOR_EVENT_IDS[expectedSelectionIndex]) {
    return false;
  }
  if (
    selection.selectsOpportunity !== false ||
    selection.selectsEventIdentity !== true ||
    selection.mapsToMutatorEffect !== false ||
    selection.executesLiveEffect !== false ||
    selection.mutatesEnvironment !== false ||
    selection.spawnsEntities !== false ||
    selection.awardsRewards !== false
  ) {
    return false;
  }

  return true;
};

const projectBaseCompatibility = (
  selection: Readonly<DynamicMidSectorEventSelection>,
) => ({
  kind: "DYNAMIC_MID_SECTOR_EVENT_EFFECT_MAPPING" as const,
  mappingMode: "COMPATIBILITY_ONLY" as const,
  sourceMode: "INFINITE" as const,
  sector: selection.sector,
  waveIndex: selection.waveIndex,
  waveCount: selection.waveCount,
  opportunityId: selection.opportunityId,
  identityFingerprint: selection.identityFingerprint,
  selectionIndex: selection.selectionIndex,
  eventId: selection.eventId,
  selectsOpportunity: false as const,
  selectsEventIdentity: false as const,
  appliesMutatorEffect: false as const,
  executesLiveEffect: false as const,
  mutatesEnvironment: false as const,
  spawnsEntities: false as const,
  awardsRewards: false as const,
});

export const resolveDynamicMidSectorEventEffectMapping = (
  selection: Readonly<DynamicMidSectorEventSelection> | null | undefined,
): Readonly<DynamicMidSectorEventEffectMapping> | null => {
  if (!selection || !isCurrentJ6BBSelection(selection)) return null;

  const mappedMutator = EVENT_MUTATOR_COMPATIBILITY[selection.eventId];
  const base = projectBaseCompatibility(selection);

  if (mappedMutator === null) {
    return Object.freeze({
      ...base,
      mappingStatus: "UNMAPPED" as const,
      mappedMutator: null,
      mapsToMutatorEffect: false as const,
    });
  }

  return Object.freeze({
    ...base,
    mappingStatus: "MAPPED" as const,
    mappedMutator,
    mapsToMutatorEffect: true as const,
  });
};
