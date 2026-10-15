import {
  resolveDynamicMidSectorEventOpportunity,
} from "./dynamicMidSectorEventOpportunity";
import {
  resolveDynamicMidSectorEventSelection,
} from "./dynamicMidSectorEventSelection";
import {
  resolveDynamicMidSectorEventEffectMapping,
  type DynamicMidSectorEventEffectMapping,
} from "./dynamicMidSectorEventEffectMapping";
import type { DynamicMidSectorEventId } from "./dynamicMidSectorEventIdentity";
import type { InfiniteMutator } from "./infiniteSectorDirector";
import type { RuntimeProgressionState } from "./runtimeProgressionRouter";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";

export type DynamicMidSectorEventRuntimeAdoptionKind =
  "DYNAMIC_MID_SECTOR_EVENT_RUNTIME_ADOPTION";
export type DynamicMidSectorEventRuntimeAdoptionMode = "CURRENT_WAVE_ONLY";
export type DynamicMidSectorEventRuntimeAdoptionStatus = "MAPPED" | "UNMAPPED";
export type DynamicMidSectorEventRuntimeTelegraphMode =
  | "WAVE_ANNOUNCEMENT"
  | "EXISTING_EFFECT_TELEGRAPH";

interface DynamicMidSectorEventRuntimeAdoptionBase {
  readonly kind: DynamicMidSectorEventRuntimeAdoptionKind;
  readonly adoptionMode: DynamicMidSectorEventRuntimeAdoptionMode;
  readonly sourceMode: "INFINITE";
  readonly status: DynamicMidSectorEventRuntimeAdoptionStatus;
  readonly sector: number;
  readonly waveIndex: number;
  readonly waveCount: number;
  readonly opportunityId: string;
  readonly identityFingerprint: string;
  readonly eventId: DynamicMidSectorEventId;
  readonly telegraphMode: DynamicMidSectorEventRuntimeTelegraphMode;
  readonly ownsClock: false;
  readonly ownsRandomness: false;
  readonly ownsLifecycleTimer: false;
  readonly mutatesRecipe: false;
  readonly mutatesSession: false;
  readonly mutatesEntities: false;
  readonly mutatesEnvironmentDirectly: false;
  readonly changesSpawnAuthority: false;
  readonly changesBudgetAuthority: false;
  readonly changesCombatEconomyAuthority: false;
}

export interface DynamicMidSectorEventMappedRuntimeAdoption
  extends DynamicMidSectorEventRuntimeAdoptionBase {
  readonly status: "MAPPED";
  readonly mappedMutator: InfiniteMutator;
  readonly addsMappedMutator: boolean;
  readonly appliesExistingMutatorSemantics: true;
}

export interface DynamicMidSectorEventUnmappedRuntimeAdoption
  extends DynamicMidSectorEventRuntimeAdoptionBase {
  readonly status: "UNMAPPED";
  readonly mappedMutator: null;
  readonly addsMappedMutator: false;
  readonly appliesExistingMutatorSemantics: false;
}

export type DynamicMidSectorEventRuntimeAdoption =
  | DynamicMidSectorEventMappedRuntimeAdoption
  | DynamicMidSectorEventUnmappedRuntimeAdoption;

export interface DynamicMidSectorEventRuntimeAdoptionAuthorityContract {
  ownsLiveAdoptionAuthority: true;
  ownsDescriptorModifierOverlayAuthority: true;
  ownsOpportunitySelectionAuthority: false;
  ownsEventSelectionAuthority: false;
  ownsCompatibilityMappingAuthority: false;
  ownsMutatorMagnitudeAuthority: false;
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
  mayMutateGlobalCaps: false;
  mayCreateEntities: false;
  mayRemoveEntities: false;
}

export const DYNAMIC_MID_SECTOR_EVENT_RUNTIME_ADOPTION_AUTHORITY_CONTRACT: Readonly<DynamicMidSectorEventRuntimeAdoptionAuthorityContract> =
  Object.freeze({
    ownsLiveAdoptionAuthority: true,
    ownsDescriptorModifierOverlayAuthority: true,
    ownsOpportunitySelectionAuthority: false,
    ownsEventSelectionAuthority: false,
    ownsCompatibilityMappingAuthority: false,
    ownsMutatorMagnitudeAuthority: false,
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
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

export interface DynamicMidSectorEventRuntimeAdoptionResult {
  readonly descriptor: RuntimeWaveDescriptor;
  readonly adoption: Readonly<DynamicMidSectorEventRuntimeAdoption> | null;
}

const humanizeEventId = (eventId: DynamicMidSectorEventId) =>
  eventId
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getTelegraphMode = (
  mapping: Readonly<DynamicMidSectorEventEffectMapping>,
): DynamicMidSectorEventRuntimeTelegraphMode =>
  mapping.mappingStatus === "MAPPED" &&
  mapping.mappedMutator === "ELECTRICAL_STORM"
    ? "EXISTING_EFFECT_TELEGRAPH"
    : "WAVE_ANNOUNCEMENT";

const createBaseAdoption = (
  mapping: Readonly<DynamicMidSectorEventEffectMapping>,
) => ({
  kind: "DYNAMIC_MID_SECTOR_EVENT_RUNTIME_ADOPTION" as const,
  adoptionMode: "CURRENT_WAVE_ONLY" as const,
  sourceMode: "INFINITE" as const,
  status: mapping.mappingStatus,
  sector: mapping.sector,
  waveIndex: mapping.waveIndex,
  waveCount: mapping.waveCount,
  opportunityId: mapping.opportunityId,
  identityFingerprint: mapping.identityFingerprint,
  eventId: mapping.eventId,
  telegraphMode: getTelegraphMode(mapping),
  ownsClock: false as const,
  ownsRandomness: false as const,
  ownsLifecycleTimer: false as const,
  mutatesRecipe: false as const,
  mutatesSession: false as const,
  mutatesEntities: false as const,
  mutatesEnvironmentDirectly: false as const,
  changesSpawnAuthority: false as const,
  changesBudgetAuthority: false as const,
  changesCombatEconomyAuthority: false as const,
});

const unchanged = (
  descriptor: RuntimeWaveDescriptor,
): Readonly<DynamicMidSectorEventRuntimeAdoptionResult> =>
  Object.freeze({
    descriptor,
    adoption: null,
  });

export const applyDynamicMidSectorEventRuntimeAdoption = (
  state: RuntimeProgressionState,
  descriptor: RuntimeWaveDescriptor,
): Readonly<DynamicMidSectorEventRuntimeAdoptionResult> => {
  if (state.mode !== "INFINITE" || descriptor.sourceMode !== "INFINITE") {
    return unchanged(descriptor);
  }

  if (
    descriptor.sector !== state.session.currentSector ||
    descriptor.waveNumber !== state.session.currentWaveNumber ||
    descriptor.waveCount !== state.session.currentPlan.executionPlans.length
  ) {
    return unchanged(descriptor);
  }

  const seed = descriptor.source.seed;
  const recipeId = descriptor.source.recipeId;
  if (!seed || !recipeId) return unchanged(descriptor);

  const opportunity = resolveDynamicMidSectorEventOpportunity({
    sourceMode: "INFINITE",
    sector: descriptor.sector,
    waveIndex: descriptor.waveNumber,
    waveCount: descriptor.waveCount,
    recoverySector: state.session.currentPlan.effectiveRecipe.recoverySector,
    hasMilestone: descriptor.milestone !== null,
    seed,
    recipeId,
  });
  if (!opportunity) return unchanged(descriptor);

  const selection = resolveDynamicMidSectorEventSelection(opportunity);
  if (!selection) return unchanged(descriptor);

  const mapping = resolveDynamicMidSectorEventEffectMapping(selection);
  if (!mapping) return unchanged(descriptor);

  const baseAdoption = createBaseAdoption(mapping);

  if (mapping.mappingStatus === "UNMAPPED") {
    const adoption: DynamicMidSectorEventUnmappedRuntimeAdoption = Object.freeze({
      ...baseAdoption,
      status: "UNMAPPED",
      mappedMutator: null,
      addsMappedMutator: false,
      appliesExistingMutatorSemantics: false,
    });

    return Object.freeze({
      descriptor,
      adoption,
    });
  }

  const alreadyActive = descriptor.modifiers.includes(mapping.mappedMutator);
  const modifiers = alreadyActive
    ? [...descriptor.modifiers]
    : [...descriptor.modifiers, mapping.mappedMutator];
  const eventLabel = humanizeEventId(mapping.eventId);

  const adoptedDescriptor: RuntimeWaveDescriptor = {
    ...descriptor,
    descriptorId: `${descriptor.descriptorId}:j6bd:${mapping.eventId.toLowerCase()}`,
    display: {
      ...descriptor.display,
      name: `${descriptor.display.name} // ${eventLabel.toUpperCase()}`,
      displayName: `${descriptor.display.displayName} // ${eventLabel}`,
      description: `${descriptor.display.description} Dynamic event: ${eventLabel}.`,
    },
    modifiers,
  };

  const adoption: DynamicMidSectorEventMappedRuntimeAdoption = Object.freeze({
    ...baseAdoption,
    status: "MAPPED",
    mappedMutator: mapping.mappedMutator,
    addsMappedMutator: !alreadyActive,
    appliesExistingMutatorSemantics: true,
  });

  return Object.freeze({
    descriptor: adoptedDescriptor,
    adoption,
  });
};
