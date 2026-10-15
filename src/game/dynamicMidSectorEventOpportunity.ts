import type { RuntimeWaveSourceMode } from "./runtimeWaveDescriptor";

export const DYNAMIC_EVENT_MIN_WAVE_COUNT = 3 as const;
export const DYNAMIC_EVENT_MAX_WAVE_COUNT = 7 as const;

export type DynamicMidSectorEventOpportunityMode = "OPPORTUNITY_ONLY";
export type DynamicMidSectorEventOpportunityKind =
  "DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY";

export interface DynamicMidSectorEventOpportunityFacts {
  sourceMode: RuntimeWaveSourceMode;
  sector: number;
  waveIndex: number;
  waveCount: number;
  recoverySector: boolean;
  hasMilestone: boolean;
  seed: string;
  recipeId: string;
}

export interface DynamicMidSectorEventOpportunityAuthorityContract {
  ownsEventIdentityAuthority: false;
  ownsEventExecutionAuthority: false;
  ownsSectorAuthority: false;
  ownsWaveAuthority: false;
  ownsRecoveryAuthority: false;
  ownsMilestoneAuthority: false;
  ownsSpawnAuthority: false;
  ownsProgressionAuthority: false;
  ownsEntityCollection: false;
  ownsProjectileCollection: false;
  ownsDamageAuthority: false;
  ownsDefeatAuthority: false;
  ownsScoreAuthority: false;
  ownsRewardAuthority: false;
  ownsEconomyAuthority: false;
  ownsMutatorAuthority: false;
  ownsEnvironmentAuthority: false;
  ownsClock: false;
  ownsRandomness: false;
  ownsFullArrayScan: false;
  mayLookupEntities: false;
  mayMutateEntities: false;
  mayMutateGlobalCaps: false;
  mayCreateEntities: false;
  mayRemoveEntities: false;
}

export interface DynamicMidSectorEventOpportunity {
  kind: DynamicMidSectorEventOpportunityKind;
  opportunityMode: DynamicMidSectorEventOpportunityMode;
  sourceMode: "INFINITE";
  sector: number;
  waveIndex: number;
  waveCount: number;
  selectedWaveIndex: number;
  opportunityId: string;
  identityFingerprint: string;
  selectsEventIdentity: false;
  appliesLiveEffect: false;
  mutatesEnvironment: false;
  mutatesMutators: false;
  spawnsEntities: false;
  awardsRewards: false;
}

export const DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY_AUTHORITY_CONTRACT: Readonly<DynamicMidSectorEventOpportunityAuthorityContract> =
  Object.freeze({
    ownsEventIdentityAuthority: false,
    ownsEventExecutionAuthority: false,
    ownsSectorAuthority: false,
    ownsWaveAuthority: false,
    ownsRecoveryAuthority: false,
    ownsMilestoneAuthority: false,
    ownsSpawnAuthority: false,
    ownsProgressionAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
    ownsMutatorAuthority: false,
    ownsEnvironmentAuthority: false,
    ownsClock: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

const isCanonicalIdentity = (value: string) =>
  value.length > 0 && value.trim() === value;

const hashIdentity = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const selectInteriorWaveIndex = (
  seed: string,
  recipeId: string,
  sector: number,
  waveCount: number,
) => {
  const identity = `${seed}\u0000${recipeId}\u0000${sector}\u0000${waveCount}`;
  const identityHash = hashIdentity(identity);
  const interiorWaveCount = waveCount - 2;

  return {
    identityHash,
    selectedWaveIndex: 2 + (identityHash % interiorWaveCount),
  };
};

export const resolveDynamicMidSectorEventOpportunity = (
  facts: Readonly<DynamicMidSectorEventOpportunityFacts>,
): Readonly<DynamicMidSectorEventOpportunity> | null => {
  if (facts.sourceMode !== "INFINITE") return null;
  if (!Number.isInteger(facts.sector) || facts.sector < 11) return null;
  if (
    !Number.isInteger(facts.waveCount) ||
    facts.waveCount < DYNAMIC_EVENT_MIN_WAVE_COUNT ||
    facts.waveCount > DYNAMIC_EVENT_MAX_WAVE_COUNT
  ) {
    return null;
  }
  if (
    !Number.isInteger(facts.waveIndex) ||
    facts.waveIndex < 1 ||
    facts.waveIndex > facts.waveCount
  ) {
    return null;
  }
  if (!isCanonicalIdentity(facts.seed) || !isCanonicalIdentity(facts.recipeId)) {
    return null;
  }
  if (facts.recoverySector || facts.hasMilestone) return null;
  if (facts.waveIndex === 1 || facts.waveIndex === facts.waveCount) return null;

  const { identityHash, selectedWaveIndex } = selectInteriorWaveIndex(
    facts.seed,
    facts.recipeId,
    facts.sector,
    facts.waveCount,
  );

  if (facts.waveIndex !== selectedWaveIndex) return null;

  const identityFingerprint = identityHash.toString(16).padStart(8, "0");

  return Object.freeze({
    kind: "DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY",
    opportunityMode: "OPPORTUNITY_ONLY",
    sourceMode: "INFINITE",
    sector: facts.sector,
    waveIndex: facts.waveIndex,
    waveCount: facts.waveCount,
    selectedWaveIndex,
    opportunityId: `j6a:${facts.sector}:${selectedWaveIndex}:${identityFingerprint}`,
    identityFingerprint,
    selectsEventIdentity: false,
    appliesLiveEffect: false,
    mutatesEnvironment: false,
    mutatesMutators: false,
    spawnsEntities: false,
    awardsRewards: false,
  });
};
