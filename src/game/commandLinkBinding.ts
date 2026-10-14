import type { PriorityTargetProfileId } from "./priorityTargetContract";

export const COMMAND_LINK_CORE_MEMBER_INDEX = 0 as const;
export const COMMAND_LINK_SUPPORTED_MEMBER_COUNTS = Object.freeze([2, 3] as const);

export type CommandLinkSupportedMemberCount = 2 | 3;
export type CommandLinkMemberRole = "COMMAND_CORE" | "LINKED_MEMBER";
export type CommandLinkBindingMode = "BINDING_ONLY";

export interface CommandLinkFormationFacts {
  groupId: string;
  memberIndex: number;
  memberCount: number;
}

export interface CommandLinkBindingAuthorityContract {
  ownsFormationAuthority: false;
  ownsPriorityTargetProfileAuthority: false;
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
  mayMutateGlobalCaps: false;
  mayCreateEntities: false;
  mayRemoveEntities: false;
}

export interface CommandLinkBindingResolution {
  groupId: string;
  profileId: PriorityTargetProfileId;
  bindingMode: CommandLinkBindingMode;
  memberIndex: number;
  memberCount: CommandLinkSupportedMemberCount;
  coreMemberIndex: typeof COMMAND_LINK_CORE_MEMBER_INDEX;
  memberRole: CommandLinkMemberRole;
  linkedMemberIndices: readonly number[];
}

export const COMMAND_LINK_BINDING_AUTHORITY_CONTRACT: Readonly<CommandLinkBindingAuthorityContract> =
  Object.freeze({
    ownsFormationAuthority: false,
    ownsPriorityTargetProfileAuthority: false,
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
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

const SIZE_TWO_LINKED_MEMBER_INDICES: readonly number[] = Object.freeze([1]);
const SIZE_THREE_LINKED_MEMBER_INDICES: readonly number[] = Object.freeze([1, 2]);

const isSupportedMemberCount = (
  memberCount: number,
): memberCount is CommandLinkSupportedMemberCount =>
  memberCount === 2 || memberCount === 3;

const isValidGroupId = (groupId: unknown): groupId is string =>
  typeof groupId === "string" &&
  groupId.length > 0 &&
  groupId.trim() === groupId;

export const resolveCommandLinkBinding = (
  input: CommandLinkFormationFacts,
): Readonly<CommandLinkBindingResolution> | null => {
  if (!input || !isValidGroupId(input.groupId)) return null;
  if (!Number.isInteger(input.memberCount) || !isSupportedMemberCount(input.memberCount)) {
    return null;
  }
  if (
    !Number.isInteger(input.memberIndex) ||
    input.memberIndex < 0 ||
    input.memberIndex >= input.memberCount
  ) {
    return null;
  }

  const linkedMemberIndices =
    input.memberCount === 2
      ? SIZE_TWO_LINKED_MEMBER_INDICES
      : SIZE_THREE_LINKED_MEMBER_INDICES;

  return Object.freeze({
    groupId: input.groupId,
    profileId: "COMMAND_CORE",
    bindingMode: "BINDING_ONLY",
    memberIndex: input.memberIndex,
    memberCount: input.memberCount,
    coreMemberIndex: COMMAND_LINK_CORE_MEMBER_INDEX,
    memberRole:
      input.memberIndex === COMMAND_LINK_CORE_MEMBER_INDEX
        ? "COMMAND_CORE"
        : "LINKED_MEMBER",
    linkedMemberIndices,
  });
};
