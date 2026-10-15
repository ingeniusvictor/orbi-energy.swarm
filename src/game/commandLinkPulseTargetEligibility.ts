import type {
  CommandLinkCombatEffectProjection,
} from "./commandLinkCombatEffectContract";
import {
  resolveCommandLinkBinding,
  type CommandLinkBindingMode,
  type CommandLinkFormationFacts,
  type CommandLinkSupportedMemberCount,
} from "./commandLinkBinding";

export type CommandLinkPulseTargetEligibilityMode = "ELIGIBLE_ONLY";

export interface CommandLinkPulseTargetEligibilityAuthorityContract {
  ownsCombatEffectProposalAuthority: false;
  ownsCommandLinkBindingAuthority: false;
  ownsLivingStateAuthority: false;
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

export interface CommandLinkPulseTargetEligibility {
  groupId: string;
  effectId: "COMMAND_LINK_DISRUPTION_PULSE";
  intent: "PULSE_LINKED_MEMBERS";
  sourceEffectMode: "PROPOSAL_ONLY";
  targetRole: "LINKED_MEMBER";
  eligibilityMode: CommandLinkPulseTargetEligibilityMode;
  memberIndex: number;
  memberCount: CommandLinkSupportedMemberCount;
  bindingMode: CommandLinkBindingMode;
  appliesDamage: false;
  killsTarget: false;
  registersDefeat: false;
  awardsScore: false;
  awardsRewards: false;
  spawnsProjectiles: false;
  mutatesFormation: false;
}

export const COMMAND_LINK_PULSE_TARGET_ELIGIBILITY_AUTHORITY_CONTRACT: Readonly<CommandLinkPulseTargetEligibilityAuthorityContract> =
  Object.freeze({
    ownsCombatEffectProposalAuthority: false,
    ownsCommandLinkBindingAuthority: false,
    ownsLivingStateAuthority: false,
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

const isValidProjectionSemantics = (
  projection: Readonly<CommandLinkCombatEffectProjection>,
): boolean =>
  typeof projection.groupId === "string" &&
  projection.groupId.length > 0 &&
  projection.groupId.trim() === projection.groupId &&
  projection.profileId === "COMMAND_CORE" &&
  projection.signal === "COMMAND_LINK_BROKEN" &&
  projection.sourceIntent === "DETACH_LINKED_MEMBERS" &&
  projection.effectId === "COMMAND_LINK_DISRUPTION_PULSE" &&
  projection.intent === "PULSE_LINKED_MEMBERS" &&
  projection.effectMode === "PROPOSAL_ONLY" &&
  projection.targetRole === "LINKED_MEMBER" &&
  projection.requiresCurrentFormationMatch === true &&
  projection.requiresLivingTarget === true &&
  projection.appliesDamage === false &&
  projection.killsTargets === false &&
  projection.awardsScore === false &&
  projection.awardsRewards === false &&
  projection.spawnsProjectiles === false &&
  projection.mutatesFormation === false;

const matchesCurrentBoundedTarget = (
  targetMemberIndices: readonly number[],
  memberCount: CommandLinkSupportedMemberCount,
  memberIndex: number,
): boolean => {
  if (memberCount === 2) {
    return (
      targetMemberIndices.length === 1 &&
      targetMemberIndices[0] === 1 &&
      memberIndex === 1
    );
  }

  return (
    targetMemberIndices.length === 2 &&
    targetMemberIndices[0] === 1 &&
    targetMemberIndices[1] === 2 &&
    (memberIndex === 1 || memberIndex === 2)
  );
};

export const resolveCommandLinkPulseTargetEligibility = (
  projection: Readonly<CommandLinkCombatEffectProjection> | null | undefined,
  candidateFormation: Readonly<CommandLinkFormationFacts> | null | undefined,
  isLiving: boolean,
): Readonly<CommandLinkPulseTargetEligibility> | null => {
  if (!projection || !candidateFormation || isLiving !== true) return null;
  if (!isValidProjectionSemantics(projection)) return null;

  const binding = resolveCommandLinkBinding(candidateFormation);
  if (!binding || binding.memberRole !== "LINKED_MEMBER") return null;
  if (binding.groupId !== projection.groupId) return null;
  if (
    !matchesCurrentBoundedTarget(
      projection.targetMemberIndices,
      binding.memberCount,
      binding.memberIndex,
    )
  ) {
    return null;
  }

  return Object.freeze({
    groupId: binding.groupId,
    effectId: projection.effectId,
    intent: projection.intent,
    sourceEffectMode: projection.effectMode,
    targetRole: binding.memberRole,
    eligibilityMode: "ELIGIBLE_ONLY",
    memberIndex: binding.memberIndex,
    memberCount: binding.memberCount,
    bindingMode: binding.bindingMode,
    appliesDamage: false,
    killsTarget: false,
    registersDefeat: false,
    awardsScore: false,
    awardsRewards: false,
    spawnsProjectiles: false,
    mutatesFormation: false,
  });
};
