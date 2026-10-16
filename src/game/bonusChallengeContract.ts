export const BONUS_CHALLENGE_IDS = Object.freeze([
  "TIMED_SURVIVAL",
] as const);

export type BonusChallengeId = (typeof BONUS_CHALLENGE_IDS)[number];
export type BonusChallengeFamily = "RHYTHM_BREAKER";
export type BonusChallengeProfileMode = "PROFILE_ONLY";
export type BonusChallengeObjective = "SURVIVE_UNTIL_TIME_EXPIRES";
export type BonusChallengeCompletionCompatibility = "TIMEBOX";

export interface BonusChallengeDurationWindow {
  readonly minMs: 20000;
  readonly maxMs: 40000;
}

export interface BonusChallengeProfile {
  readonly challengeId: BonusChallengeId;
  readonly displayName: string;
  readonly family: BonusChallengeFamily;
  readonly profileMode: BonusChallengeProfileMode;
  readonly objective: BonusChallengeObjective;
  readonly completionCompatibility: BonusChallengeCompletionCompatibility;
  readonly durationWindowMs: Readonly<BonusChallengeDurationWindow>;
  readonly requiresFiringRestriction: false;
  readonly requiresObjectiveEntities: false;
  readonly requiresCollectibles: false;
  readonly requiresArenaGeometry: false;
  readonly selectsOpportunity: false;
  readonly selectsCadence: false;
  readonly selectsSourceMode: false;
  readonly choosesExactDuration: false;
  readonly executesLiveChallenge: false;
  readonly mutatesRuntimeDescriptor: false;
  readonly awardsRewards: false;
  readonly appliesFailurePenalty: false;
}

export interface BonusChallengeAuthorityContract {
  readonly ownsOpportunitySelectionAuthority: false;
  readonly ownsChallengeSelectionAuthority: false;
  readonly ownsLiveAdoptionAuthority: false;
  readonly ownsDescriptorMutationAuthority: false;
  readonly ownsCompletionPolicyAuthority: false;
  readonly ownsTimerAuthority: false;
  readonly ownsClock: false;
  readonly ownsPauseAuthority: false;
  readonly ownsSpawnAuthority: false;
  readonly ownsArenaAuthority: false;
  readonly ownsProgressionAuthority: false;
  readonly ownsEntityCollection: false;
  readonly ownsProjectileCollection: false;
  readonly ownsDamageAuthority: false;
  readonly ownsDefeatAuthority: false;
  readonly ownsScoreAuthority: false;
  readonly ownsRewardAuthority: false;
  readonly ownsEconomyAuthority: false;
  readonly ownsHudAuthority: false;
  readonly ownsRandomness: false;
  readonly ownsFullArrayScan: false;
  readonly mayLookupEntities: false;
  readonly mayMutateEntities: false;
  readonly mayMutateGlobalCaps: false;
  readonly mayCreateEntities: false;
  readonly mayRemoveEntities: false;
}

export const BONUS_CHALLENGE_DURATION_WINDOW_MS: Readonly<BonusChallengeDurationWindow> =
  Object.freeze({
    minMs: 20000,
    maxMs: 40000,
  });

const TIMED_SURVIVAL_PROFILE: Readonly<BonusChallengeProfile> = Object.freeze({
  challengeId: "TIMED_SURVIVAL",
  displayName: "Timed Survival",
  family: "RHYTHM_BREAKER",
  profileMode: "PROFILE_ONLY",
  objective: "SURVIVE_UNTIL_TIME_EXPIRES",
  completionCompatibility: "TIMEBOX",
  durationWindowMs: BONUS_CHALLENGE_DURATION_WINDOW_MS,
  requiresFiringRestriction: false,
  requiresObjectiveEntities: false,
  requiresCollectibles: false,
  requiresArenaGeometry: false,
  selectsOpportunity: false,
  selectsCadence: false,
  selectsSourceMode: false,
  choosesExactDuration: false,
  executesLiveChallenge: false,
  mutatesRuntimeDescriptor: false,
  awardsRewards: false,
  appliesFailurePenalty: false,
});

const BONUS_CHALLENGE_PROFILE_BY_ID: Readonly<
  Record<BonusChallengeId, Readonly<BonusChallengeProfile>>
> = Object.freeze({
  TIMED_SURVIVAL: TIMED_SURVIVAL_PROFILE,
});

export const BONUS_CHALLENGE_PROFILES = Object.freeze(
  BONUS_CHALLENGE_IDS.map(
    (challengeId) => BONUS_CHALLENGE_PROFILE_BY_ID[challengeId],
  ),
);

export const BONUS_CHALLENGE_PROFILE_COUNT = BONUS_CHALLENGE_PROFILES.length;

export const getBonusChallengeProfile = (
  challengeId: string,
): Readonly<BonusChallengeProfile> | null => {
  if (
    !Object.prototype.hasOwnProperty.call(
      BONUS_CHALLENGE_PROFILE_BY_ID,
      challengeId,
    )
  ) {
    return null;
  }

  return BONUS_CHALLENGE_PROFILE_BY_ID[challengeId as BonusChallengeId];
};

export const BONUS_CHALLENGE_AUTHORITY_CONTRACT: Readonly<BonusChallengeAuthorityContract> =
  Object.freeze({
    ownsOpportunitySelectionAuthority: false,
    ownsChallengeSelectionAuthority: false,
    ownsLiveAdoptionAuthority: false,
    ownsDescriptorMutationAuthority: false,
    ownsCompletionPolicyAuthority: false,
    ownsTimerAuthority: false,
    ownsClock: false,
    ownsPauseAuthority: false,
    ownsSpawnAuthority: false,
    ownsArenaAuthority: false,
    ownsProgressionAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
    ownsHudAuthority: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });
