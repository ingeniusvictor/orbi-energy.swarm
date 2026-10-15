import type {
  CommandLinkBreakIntent,
  CommandLinkBreakResolution,
} from "./commandLinkBreakResolution";
import type {
  PriorityTargetDefeatSignal,
  PriorityTargetProfileId,
} from "./priorityTargetContract";

export type CommandLinkCombatEffectSourceFreshness = "CURRENT" | "STALE";
export type CommandLinkCombatEffectId = "COMMAND_LINK_DISRUPTION_PULSE";
export type CommandLinkCombatEffectIntent = "PULSE_LINKED_MEMBERS";
export type CommandLinkCombatEffectMode = "PROPOSAL_ONLY";
export type CommandLinkCombatEffectTargetRole = "LINKED_MEMBER";

export interface CommandLinkCombatEffectAuthorityContract {
  ownsPriorityTargetProfileAuthority: false;
  ownsCommandLinkBreakAuthority: false;
  ownsFreshnessAuthority: false;
  ownsFormationAuthority: false;
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

export interface CommandLinkCombatEffectProjection {
  groupId: string;
  profileId: PriorityTargetProfileId;
  signal: PriorityTargetDefeatSignal;
  sourceIntent: CommandLinkBreakIntent;
  effectId: CommandLinkCombatEffectId;
  intent: CommandLinkCombatEffectIntent;
  effectMode: CommandLinkCombatEffectMode;
  targetRole: CommandLinkCombatEffectTargetRole;
  targetMemberIndices: readonly number[];
  requiresCurrentFormationMatch: true;
  requiresLivingTarget: true;
  appliesDamage: false;
  killsTargets: false;
  awardsScore: false;
  awardsRewards: false;
  spawnsProjectiles: false;
  mutatesFormation: false;
}

export const COMMAND_LINK_COMBAT_EFFECT_AUTHORITY_CONTRACT: Readonly<CommandLinkCombatEffectAuthorityContract> =
  Object.freeze({
    ownsPriorityTargetProfileAuthority: false,
    ownsCommandLinkBreakAuthority: false,
    ownsFreshnessAuthority: false,
    ownsFormationAuthority: false,
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

const SIZE_TWO_TARGET_MEMBER_INDICES: readonly number[] = Object.freeze([1]);
const SIZE_THREE_TARGET_MEMBER_INDICES: readonly number[] = Object.freeze([1, 2]);

const resolveTargetMemberIndices = (
  linkedMemberIndices: readonly number[],
): readonly number[] | null => {
  if (
    linkedMemberIndices.length === 1 &&
    linkedMemberIndices[0] === 1
  ) {
    return SIZE_TWO_TARGET_MEMBER_INDICES;
  }

  if (
    linkedMemberIndices.length === 2 &&
    linkedMemberIndices[0] === 1 &&
    linkedMemberIndices[1] === 2
  ) {
    return SIZE_THREE_TARGET_MEMBER_INDICES;
  }

  return null;
};

export const projectCommandLinkCombatEffect = (
  resolution: Readonly<CommandLinkBreakResolution> | null | undefined,
  sourceFreshness: CommandLinkCombatEffectSourceFreshness,
): Readonly<CommandLinkCombatEffectProjection> | null => {
  if (!resolution || sourceFreshness !== "CURRENT") return null;
  if (
    typeof resolution.groupId !== "string" ||
    resolution.groupId.length === 0 ||
    resolution.groupId.trim() !== resolution.groupId ||
    resolution.profileId !== "COMMAND_CORE" ||
    resolution.signal !== "COMMAND_LINK_BROKEN" ||
    resolution.intent !== "DETACH_LINKED_MEMBERS" ||
    resolution.effectMode !== "INTENT_ONLY" ||
    resolution.coreMemberIndex !== 0
  ) {
    return null;
  }

  const targetMemberIndices = resolveTargetMemberIndices(
    resolution.linkedMemberIndices,
  );
  if (!targetMemberIndices) return null;

  return Object.freeze({
    groupId: resolution.groupId,
    profileId: resolution.profileId,
    signal: resolution.signal,
    sourceIntent: resolution.intent,
    effectId: "COMMAND_LINK_DISRUPTION_PULSE",
    intent: "PULSE_LINKED_MEMBERS",
    effectMode: "PROPOSAL_ONLY",
    targetRole: "LINKED_MEMBER",
    targetMemberIndices,
    requiresCurrentFormationMatch: true,
    requiresLivingTarget: true,
    appliesDamage: false,
    killsTargets: false,
    awardsScore: false,
    awardsRewards: false,
    spawnsProjectiles: false,
    mutatesFormation: false,
  });
};
