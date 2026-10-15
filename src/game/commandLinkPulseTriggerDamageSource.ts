export type CommandLinkPulseTriggerDamageSourceKind =
  | "DIRECT_HIT"
  | "SPLASH_HIT";

export type CommandLinkPulseTriggerDamageSourceMode =
  "EFFECTIVE_TRIGGER_DAMAGE_ONLY";

export interface CommandLinkPulseTriggerDamageSourceAuthorityContract {
  ownsSourceCaptureAuthority: false;
  ownsDamageMagnitudeTuning: false;
  ownsTargetEligibilityAuthority: false;
  ownsHealthMutationAuthority: false;
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
  mayMutateEntities: false;
  mayMutateGlobalCaps: false;
  mayCreateEntities: false;
  mayRemoveEntities: false;
}

export interface CommandLinkPulseTriggerDamageSourceProjection {
  sourceKind: CommandLinkPulseTriggerDamageSourceKind;
  sourceMode: CommandLinkPulseTriggerDamageSourceMode;
  resolvedSourceDamage: number;
  sourceHealthBeforeHit: number;
  effectiveTriggerDamage: number;
  proposedPulseDamage: number;
  transfersOverkill: false;
  appliesDamage: false;
  mutatesHealth: false;
  registersDefeat: false;
  awardsScore: false;
  awardsRewards: false;
  awardsDrops: false;
  spawnsProjectiles: false;
  mutatesFormation: false;
}

export const COMMAND_LINK_PULSE_TRIGGER_DAMAGE_SOURCE_AUTHORITY_CONTRACT: Readonly<CommandLinkPulseTriggerDamageSourceAuthorityContract> =
  Object.freeze({
    ownsSourceCaptureAuthority: false,
    ownsDamageMagnitudeTuning: false,
    ownsTargetEligibilityAuthority: false,
    ownsHealthMutationAuthority: false,
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
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

const isSupportedSourceKind = (
  sourceKind: string,
): sourceKind is CommandLinkPulseTriggerDamageSourceKind =>
  sourceKind === "DIRECT_HIT" || sourceKind === "SPLASH_HIT";

export const projectCommandLinkPulseTriggerDamageSource = (
  sourceKind: CommandLinkPulseTriggerDamageSourceKind,
  resolvedSourceDamage: number,
  sourceHealthBeforeHit: number,
): Readonly<CommandLinkPulseTriggerDamageSourceProjection> | null => {
  if (!isSupportedSourceKind(sourceKind)) return null;

  if (
    !Number.isFinite(resolvedSourceDamage) ||
    !Number.isFinite(sourceHealthBeforeHit) ||
    resolvedSourceDamage <= 0 ||
    sourceHealthBeforeHit <= 0
  ) {
    return null;
  }

  const effectiveTriggerDamage = Math.min(
    resolvedSourceDamage,
    sourceHealthBeforeHit,
  );

  return Object.freeze({
    sourceKind,
    sourceMode: "EFFECTIVE_TRIGGER_DAMAGE_ONLY",
    resolvedSourceDamage,
    sourceHealthBeforeHit,
    effectiveTriggerDamage,
    proposedPulseDamage: effectiveTriggerDamage,
    transfersOverkill: false,
    appliesDamage: false,
    mutatesHealth: false,
    registersDefeat: false,
    awardsScore: false,
    awardsRewards: false,
    awardsDrops: false,
    spawnsProjectiles: false,
    mutatesFormation: false,
  });
};
