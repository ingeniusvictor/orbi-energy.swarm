import {
  resolveCommandLinkBinding,
  type CommandLinkFormationFacts,
} from "./commandLinkBinding";
import {
  resolvePriorityTargetDefeatSignal,
  type PriorityTargetDefeatSignal,
  type PriorityTargetProfileId,
} from "./priorityTargetContract";

export type CommandLinkBreakIntent = "DETACH_LINKED_MEMBERS";
export type CommandLinkBreakEffectMode = "INTENT_ONLY";

export interface CommandLinkBreakAuthorityContract {
  ownsFormationAuthority: false;
  ownsPriorityTargetProfileAuthority: false;
  ownsBindingAuthority: false;
  ownsSpawnAuthority: false;
  ownsEntityCollection: false;
  ownsProjectileCollection: false;
  ownsDamageAuthority: false;
  ownsDefeatAuthority: false;
  ownsScoreAuthority: false;
  ownsRewardAuthority: false;
  ownsClock: false;
  ownsRandomness: false;
  ownsFullArrayScan: false;
  mayLookupEntities: false;
  mayMutateEntities: false;
  mayMutateGlobalCaps: false;
  mayCreateEntities: false;
  mayRemoveEntities: false;
}

export interface CommandLinkBreakResolution {
  groupId: string;
  profileId: PriorityTargetProfileId;
  signal: PriorityTargetDefeatSignal;
  intent: CommandLinkBreakIntent;
  effectMode: CommandLinkBreakEffectMode;
  coreMemberIndex: 0;
  linkedMemberIndices: readonly number[];
}

export const COMMAND_LINK_BREAK_AUTHORITY_CONTRACT: Readonly<CommandLinkBreakAuthorityContract> =
  Object.freeze({
    ownsFormationAuthority: false,
    ownsPriorityTargetProfileAuthority: false,
    ownsBindingAuthority: false,
    ownsSpawnAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsClock: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

export const resolveCommandLinkBreakResolution = (
  input: CommandLinkFormationFacts,
): Readonly<CommandLinkBreakResolution> | null => {
  const binding = resolveCommandLinkBinding(input);
  if (!binding || binding.memberRole !== "COMMAND_CORE") return null;

  const defeatResolution = resolvePriorityTargetDefeatSignal(binding.profileId);
  if (
    !defeatResolution ||
    defeatResolution.signal !== "COMMAND_LINK_BROKEN" ||
    defeatResolution.effectMode !== "SIGNAL_ONLY"
  ) {
    return null;
  }

  return Object.freeze({
    groupId: binding.groupId,
    profileId: binding.profileId,
    signal: defeatResolution.signal,
    intent: "DETACH_LINKED_MEMBERS",
    effectMode: "INTENT_ONLY",
    coreMemberIndex: binding.coreMemberIndex,
    linkedMemberIndices: binding.linkedMemberIndices,
  });
};
