export const PRIORITY_TARGET_PROFILE_COUNT = 1;

export type PriorityTargetProfileId = "COMMAND_CORE";
export type PriorityTargetPriorityIntent = "HIGH";
export type PriorityTargetCounterplayIntent = "FOCUS_CORE_TO_BREAK_LINK";
export type PriorityTargetObjectiveKind = "BREAK_COMMAND_LINK";
export type PriorityTargetDefeatSignal = "COMMAND_LINK_BROKEN";
export type PriorityTargetEffectMode = "SIGNAL_ONLY";

export interface PriorityTargetAuthorityContract {
  ownsSpawnAuthority: false;
  ownsEntityCollection: false;
  ownsProjectileCollection: false;
  ownsDamageAuthority: false;
  ownsDefeatAuthority: false;
  ownsScoreAuthority: false;
  ownsRewardAuthority: false;
  ownsFormationAuthority: false;
  ownsClock: false;
  ownsRandomness: false;
  ownsFullArrayScan: false;
  mayMutateGlobalCaps: false;
  mayCreateEntities: false;
}

export interface PriorityTargetDecisionContract {
  tacticalQuestion: string;
  counterplayIntent: PriorityTargetCounterplayIntent;
  priorityIntent: PriorityTargetPriorityIntent;
}

export interface PriorityTargetObjectiveContract {
  kind: PriorityTargetObjectiveKind;
  defeatSignal: PriorityTargetDefeatSignal;
  effectMode: PriorityTargetEffectMode;
  appliesDamage: false;
  killsLinkedTargets: false;
  awardsScore: false;
  awardsRewards: false;
  mutatesFormation: false;
}

export interface PriorityTargetProfile {
  profileId: PriorityTargetProfileId;
  displayName: string;
  decision: Readonly<PriorityTargetDecisionContract>;
  objective: Readonly<PriorityTargetObjectiveContract>;
  authority: Readonly<PriorityTargetAuthorityContract>;
}

export interface PriorityTargetDefeatResolution {
  profileId: PriorityTargetProfileId;
  signal: PriorityTargetDefeatSignal;
  effectMode: PriorityTargetEffectMode;
}

export const PRIORITY_TARGET_AUTHORITY_CONTRACT: Readonly<PriorityTargetAuthorityContract> =
  Object.freeze({
    ownsSpawnAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsFormationAuthority: false,
    ownsClock: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
  });

const COMMAND_CORE_PROFILE: Readonly<PriorityTargetProfile> = Object.freeze({
  profileId: "COMMAND_CORE",
  displayName: "Command Core",
  decision: Object.freeze({
    tacticalQuestion:
      "Do I expose myself to focus the command core now, or contain its linked formation first?",
    counterplayIntent: "FOCUS_CORE_TO_BREAK_LINK",
    priorityIntent: "HIGH",
  }),
  objective: Object.freeze({
    kind: "BREAK_COMMAND_LINK",
    defeatSignal: "COMMAND_LINK_BROKEN",
    effectMode: "SIGNAL_ONLY",
    appliesDamage: false,
    killsLinkedTargets: false,
    awardsScore: false,
    awardsRewards: false,
    mutatesFormation: false,
  }),
  authority: PRIORITY_TARGET_AUTHORITY_CONTRACT,
});

export const PRIORITY_TARGET_PROFILES: readonly Readonly<PriorityTargetProfile>[] =
  Object.freeze([COMMAND_CORE_PROFILE]);

export const getPriorityTargetProfile = (
  profileId: string,
): Readonly<PriorityTargetProfile> | null =>
  profileId === "COMMAND_CORE" ? COMMAND_CORE_PROFILE : null;

export const resolvePriorityTargetDefeatSignal = (
  profileId: string,
): Readonly<PriorityTargetDefeatResolution> | null => {
  const profile = getPriorityTargetProfile(profileId);
  if (!profile) return null;

  return Object.freeze({
    profileId: profile.profileId,
    signal: profile.objective.defeatSignal,
    effectMode: profile.objective.effectMode,
  });
};
