export const DYNAMIC_MID_SECTOR_EVENT_IDS = Object.freeze([
  "SOLAR_STORM",
  "QUANTUM_RIFT",
  "BLACKOUT_SURGE",
  "CRYSTAL_RUSH",
  "DYSON_ECLIPSE",
] as const);

export type DynamicMidSectorEventId =
  (typeof DYNAMIC_MID_SECTOR_EVENT_IDS)[number];

export type DynamicMidSectorEventIdentityMode = "IDENTITY_ONLY";
export type DynamicMidSectorEventIdentityFamily = "ENVIRONMENTAL_IDENTITY";

export interface DynamicMidSectorEventIdentityProfile {
  readonly eventId: DynamicMidSectorEventId;
  readonly displayName: string;
  readonly family: DynamicMidSectorEventIdentityFamily;
  readonly identityMode: DynamicMidSectorEventIdentityMode;
  readonly selectsOpportunity: false;
  readonly selectsEvent: false;
  readonly mapsToMutatorEffect: false;
  readonly executesLiveEffect: false;
}

const createIdentityProfile = (
  eventId: DynamicMidSectorEventId,
  displayName: string,
): Readonly<DynamicMidSectorEventIdentityProfile> =>
  Object.freeze({
    eventId,
    displayName,
    family: "ENVIRONMENTAL_IDENTITY" as const,
    identityMode: "IDENTITY_ONLY" as const,
    selectsOpportunity: false as const,
    selectsEvent: false as const,
    mapsToMutatorEffect: false as const,
    executesLiveEffect: false as const,
  });

const DYNAMIC_MID_SECTOR_EVENT_PROFILE_BY_ID: Readonly<
  Record<DynamicMidSectorEventId, Readonly<DynamicMidSectorEventIdentityProfile>>
> = Object.freeze({
  SOLAR_STORM: createIdentityProfile("SOLAR_STORM", "Solar Storm"),
  QUANTUM_RIFT: createIdentityProfile("QUANTUM_RIFT", "Quantum Rift"),
  BLACKOUT_SURGE: createIdentityProfile("BLACKOUT_SURGE", "Blackout Surge"),
  CRYSTAL_RUSH: createIdentityProfile("CRYSTAL_RUSH", "Crystal Rush"),
  DYSON_ECLIPSE: createIdentityProfile("DYSON_ECLIPSE", "Dyson Eclipse"),
});

export const DYNAMIC_MID_SECTOR_EVENT_IDENTITY_PROFILES = Object.freeze(
  DYNAMIC_MID_SECTOR_EVENT_IDS.map(
    (eventId) => DYNAMIC_MID_SECTOR_EVENT_PROFILE_BY_ID[eventId],
  ),
);

export const DYNAMIC_MID_SECTOR_EVENT_IDENTITY_PROFILE_COUNT =
  DYNAMIC_MID_SECTOR_EVENT_IDENTITY_PROFILES.length;

export const getDynamicMidSectorEventIdentityProfile = (
  eventId: string,
): Readonly<DynamicMidSectorEventIdentityProfile> | null => {
  if (
    !Object.prototype.hasOwnProperty.call(
      DYNAMIC_MID_SECTOR_EVENT_PROFILE_BY_ID,
      eventId,
    )
  ) {
    return null;
  }

  return DYNAMIC_MID_SECTOR_EVENT_PROFILE_BY_ID[
    eventId as DynamicMidSectorEventId
  ];
};

export const DYNAMIC_MID_SECTOR_EVENT_IDENTITY_AUTHORITY_CONTRACT =
  Object.freeze({
    ownsOpportunitySelectionAuthority: false,
    ownsEventSelectionAuthority: false,
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
  } as const);