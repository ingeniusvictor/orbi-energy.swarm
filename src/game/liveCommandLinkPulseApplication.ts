import {
  projectCommandLinkCombatEffect,
  type CommandLinkCombatEffectProjection,
} from "./commandLinkCombatEffectContract";
import {
  resolveCommandLinkBreakResolution,
  type CommandLinkBreakResolution,
} from "./commandLinkBreakResolution";
import type { CommandLinkFormationFacts } from "./commandLinkBinding";
import {
  projectCommandLinkPulseDamageSafety,
  type CommandLinkPulseDamageSafetyProjection,
} from "./commandLinkPulseDamageSafety";
import {
  resolveCommandLinkPulseTargetEligibility,
  type CommandLinkPulseTargetEligibility,
} from "./commandLinkPulseTargetEligibility";
import {
  projectCommandLinkPulseTriggerDamageSource,
  type CommandLinkPulseTriggerDamageSourceKind,
  type CommandLinkPulseTriggerDamageSourceProjection,
} from "./commandLinkPulseTriggerDamageSource";

export type LiveCommandLinkPulseIntentMode = "LIVE_NON_LETHAL_PENDING";
export type LiveCommandLinkPulseTargetMode = "LIVE_NON_LETHAL_HEALTH_APPLICATION";

export interface LiveCommandLinkPulseAuthorityContract {
  ownsCommandLinkBreakAuthority: false;
  ownsEffectProposalAuthority: false;
  ownsTargetEligibilityAuthority: false;
  ownsDamageSafetyAuthority: false;
  ownsTriggerDamageSourceAuthority: false;
  ownsDefeatAuthority: false;
  ownsScoreAuthority: false;
  ownsRewardAuthority: false;
  ownsDropAuthority: false;
  ownsFormationAuthority: false;
  ownsSpawnAuthority: false;
  ownsEntityCollection: false;
  ownsProjectileCollection: false;
  ownsClock: false;
  ownsRandomness: false;
  ownsFullArrayScan: false;
  mayLookupEntities: false;
  maySetLinkedTargetDead: false;
  mayRegisterPulseDefeat: false;
  mayMutateGlobalCaps: false;
  mayCreateEntities: false;
  mayRemoveEntities: false;
}

export interface LiveCommandLinkPulseIntent {
  mode: LiveCommandLinkPulseIntentMode;
  resolution: Readonly<CommandLinkBreakResolution>;
  proposal: Readonly<CommandLinkCombatEffectProjection>;
  source: Readonly<CommandLinkPulseTriggerDamageSourceProjection>;
}

export interface LiveCommandLinkPulseTargetProjection {
  mode: LiveCommandLinkPulseTargetMode;
  eligibility: Readonly<CommandLinkPulseTargetEligibility>;
  safety: Readonly<CommandLinkPulseDamageSafetyProjection>;
  safeDamage: number;
  resultingHealth: number;
  healthFloor: 1;
  canKill: false;
  setIsDead: false;
  registersDefeat: false;
  awardsScore: false;
  awardsRewards: false;
  awardsDrops: false;
  mutatesFormation: false;
}

export const LIVE_COMMAND_LINK_PULSE_AUTHORITY_CONTRACT: Readonly<LiveCommandLinkPulseAuthorityContract> =
  Object.freeze({
    ownsCommandLinkBreakAuthority: false,
    ownsEffectProposalAuthority: false,
    ownsTargetEligibilityAuthority: false,
    ownsDamageSafetyAuthority: false,
    ownsTriggerDamageSourceAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsDropAuthority: false,
    ownsFormationAuthority: false,
    ownsSpawnAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsClock: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    maySetLinkedTargetDead: false,
    mayRegisterPulseDefeat: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

export const resolveLiveCommandLinkPulseIntent = (
  coreFormation: Readonly<CommandLinkFormationFacts> | null | undefined,
  sourceKind: CommandLinkPulseTriggerDamageSourceKind,
  resolvedSourceDamage: number,
  sourceHealthBeforeHit: number,
): Readonly<LiveCommandLinkPulseIntent> | null => {
  if (!coreFormation) return null;

  const resolution = resolveCommandLinkBreakResolution(coreFormation);
  if (!resolution) return null;

  const proposal = projectCommandLinkCombatEffect(resolution, "CURRENT");
  if (!proposal) return null;

  const source = projectCommandLinkPulseTriggerDamageSource(
    sourceKind,
    resolvedSourceDamage,
    sourceHealthBeforeHit,
  );
  if (!source) return null;

  return Object.freeze({
    mode: "LIVE_NON_LETHAL_PENDING",
    resolution,
    proposal,
    source,
  });
};

export const projectLiveCommandLinkPulseTarget = (
  intent: Readonly<LiveCommandLinkPulseIntent> | null | undefined,
  candidateFormation: Readonly<CommandLinkFormationFacts> | null | undefined,
  currentHealth: number,
  maxHealth: number,
  isLiving: boolean,
): Readonly<LiveCommandLinkPulseTargetProjection> | null => {
  if (!intent || intent.mode !== "LIVE_NON_LETHAL_PENDING") return null;

  const eligibility = resolveCommandLinkPulseTargetEligibility(
    intent.proposal,
    candidateFormation,
    isLiving,
  );
  if (!eligibility) return null;

  const safety = projectCommandLinkPulseDamageSafety(
    eligibility,
    currentHealth,
    maxHealth,
    intent.source.proposedPulseDamage,
  );
  if (!safety) return null;

  return Object.freeze({
    mode: "LIVE_NON_LETHAL_HEALTH_APPLICATION",
    eligibility,
    safety,
    safeDamage: safety.safeDamage,
    resultingHealth: safety.resultingHealth,
    healthFloor: safety.healthFloor,
    canKill: false,
    setIsDead: false,
    registersDefeat: false,
    awardsScore: false,
    awardsRewards: false,
    awardsDrops: false,
    mutatesFormation: false,
  });
};
