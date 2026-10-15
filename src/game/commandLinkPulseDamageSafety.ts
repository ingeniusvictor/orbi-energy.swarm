import type { CommandLinkPulseTargetEligibility } from "./commandLinkPulseTargetEligibility";

export type CommandLinkPulseDamageSafetyMode = "NON_LETHAL_PROJECTION_ONLY";

export interface CommandLinkPulseDamageSafetyAuthorityContract {
  ownsTargetEligibilityAuthority: false;
  ownsDamageMagnitudeTuning: false;
  ownsHealthMutationAuthority: false;
  ownsDefeatAuthority: false;
  ownsScoreAuthority: false;
  ownsRewardAuthority: false;
  ownsDropAuthority: false;
  ownsMilestoneAuthority: false;
  ownsBossDefeatAuthority: false;
  ownsFormationAuthority: false;
  ownsSpawnAuthority: false;
  ownsEntityCollection: false;
  ownsProjectileCollection: false;
  ownsClock: false;
  ownsRandomness: false;
  ownsFullArrayScan: false;
  mayLookupEntities: false;
  mayMutateEntities: false;
  mayMutateGlobalCaps: false;
  mayCreateEntities: false;
  mayRemoveEntities: false;
}

export interface CommandLinkPulseDamageSafetyProjection {
  groupId: string;
  effectId: "COMMAND_LINK_DISRUPTION_PULSE";
  intent: "PULSE_LINKED_MEMBERS";
  targetRole: "LINKED_MEMBER";
  sourceEligibilityMode: "ELIGIBLE_ONLY";
  sourceBindingMode: "BINDING_ONLY";
  damageSafetyMode: CommandLinkPulseDamageSafetyMode;
  memberIndex: number;
  memberCount: 2 | 3;
  currentHealth: number;
  maxHealth: number;
  proposedDamage: number;
  safeDamage: number;
  resultingHealth: number;
  healthFloor: 1;
  canKill: false;
  mutatesHealth: false;
  registersDefeat: false;
  awardsScore: false;
  awardsRewards: false;
  spawnsProjectiles: false;
  mutatesFormation: false;
}

export const COMMAND_LINK_PULSE_DAMAGE_SAFETY_AUTHORITY_CONTRACT: Readonly<CommandLinkPulseDamageSafetyAuthorityContract> =
  Object.freeze({
    ownsTargetEligibilityAuthority: false,
    ownsDamageMagnitudeTuning: false,
    ownsHealthMutationAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsDropAuthority: false,
    ownsMilestoneAuthority: false,
    ownsBossDefeatAuthority: false,
    ownsFormationAuthority: false,
    ownsSpawnAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsClock: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

const isValidEligibility = (
  eligibility: Readonly<CommandLinkPulseTargetEligibility>,
): boolean => {
  if (
    typeof eligibility.groupId !== "string" ||
    eligibility.groupId.length === 0 ||
    eligibility.groupId.trim() !== eligibility.groupId ||
    eligibility.effectId !== "COMMAND_LINK_DISRUPTION_PULSE" ||
    eligibility.intent !== "PULSE_LINKED_MEMBERS" ||
    eligibility.sourceEffectMode !== "PROPOSAL_ONLY" ||
    eligibility.targetRole !== "LINKED_MEMBER" ||
    eligibility.eligibilityMode !== "ELIGIBLE_ONLY" ||
    eligibility.bindingMode !== "BINDING_ONLY" ||
    eligibility.appliesDamage !== false ||
    eligibility.killsTarget !== false ||
    eligibility.registersDefeat !== false ||
    eligibility.awardsScore !== false ||
    eligibility.awardsRewards !== false ||
    eligibility.spawnsProjectiles !== false ||
    eligibility.mutatesFormation !== false ||
    !Number.isInteger(eligibility.memberIndex)
  ) {
    return false;
  }

  if (eligibility.memberCount === 2) {
    return eligibility.memberIndex === 1;
  }

  if (eligibility.memberCount === 3) {
    return eligibility.memberIndex === 1 || eligibility.memberIndex === 2;
  }

  return false;
};

const isFiniteNumber = (value: number): boolean => Number.isFinite(value);

export const projectCommandLinkPulseDamageSafety = (
  eligibility: Readonly<CommandLinkPulseTargetEligibility> | null | undefined,
  currentHealth: number,
  maxHealth: number,
  proposedDamage: number,
): Readonly<CommandLinkPulseDamageSafetyProjection> | null => {
  if (!eligibility || !isValidEligibility(eligibility)) return null;

  if (
    !isFiniteNumber(currentHealth) ||
    !isFiniteNumber(maxHealth) ||
    !isFiniteNumber(proposedDamage) ||
    currentHealth < 1 ||
    maxHealth < 1 ||
    currentHealth > maxHealth ||
    proposedDamage <= 0
  ) {
    return null;
  }

  const maximumNonLethalDamage = Math.max(0, currentHealth - 1);
  const boundedDamage = Math.min(proposedDamage, maximumNonLethalDamage);
  const resultingHealth = Math.max(1, currentHealth - boundedDamage);
  const safeDamage = Math.max(0, currentHealth - resultingHealth);

  return Object.freeze({
    groupId: eligibility.groupId,
    effectId: eligibility.effectId,
    intent: eligibility.intent,
    targetRole: eligibility.targetRole,
    sourceEligibilityMode: eligibility.eligibilityMode,
    sourceBindingMode: eligibility.bindingMode,
    damageSafetyMode: "NON_LETHAL_PROJECTION_ONLY",
    memberIndex: eligibility.memberIndex,
    memberCount: eligibility.memberCount,
    currentHealth,
    maxHealth,
    proposedDamage,
    safeDamage,
    resultingHealth,
    healthFloor: 1,
    canKill: false,
    mutatesHealth: false,
    registersDefeat: false,
    awardsScore: false,
    awardsRewards: false,
    spawnsProjectiles: false,
    mutatesFormation: false,
  });
};
