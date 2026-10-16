import {
  BONUS_CHALLENGE_DURATION_WINDOW_MS,
  getBonusChallengeProfile,
} from "./bonusChallengeContract";
import {
  resolveBonusChallengeOpportunity,
  type BonusChallengeOpportunityFacts,
} from "./bonusChallengeOpportunity";

export const BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS = 30000 as const;

export type BonusChallengeTimeboxProjectionKind =
  "BONUS_CHALLENGE_TIMEBOX_PROJECTION";
export type BonusChallengeTimeboxProjectionMode = "PROJECTION_ONLY";

export interface BonusChallengeTimeboxCompletionProjection {
  readonly type: "TIMEBOX";
  readonly durationMs: typeof BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS;
}

export interface BonusChallengeTimeboxProjection {
  readonly kind: BonusChallengeTimeboxProjectionKind;
  readonly projectionMode: BonusChallengeTimeboxProjectionMode;
  readonly challengeId: "TIMED_SURVIVAL";
  readonly sourceMode: "INFINITE";
  readonly objective: "SURVIVE_UNTIL_TIME_EXPIRES";
  readonly sector: number;
  readonly waveIndex: number;
  readonly waveCount: number;
  readonly selectedWaveIndex: number;
  readonly opportunityId: string;
  readonly exactDurationMs: typeof BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS;
  readonly completionProjection: Readonly<BonusChallengeTimeboxCompletionProjection>;
  readonly selectsExactDuration: true;
  readonly projectsTimeboxCompletion: true;
  readonly executesLiveChallenge: false;
  readonly mutatesRuntimeDescriptor: false;
  readonly startsTimer: false;
  readonly ticksTimer: false;
  readonly resetsTimer: false;
  readonly ownsPauseLifecycle: false;
  readonly altersSpawnComposition: false;
  readonly altersArena: false;
  readonly changesProgression: false;
  readonly awardsScore: false;
  readonly awardsRewards: false;
  readonly changesEconomy: false;
  readonly changesHud: false;
}

export interface BonusChallengeTimeboxProjectionAuthorityContract {
  readonly ownsExactDurationProjectionAuthority: true;
  readonly ownsCompletionProjectionAuthority: true;
  readonly ownsOpportunityEligibilityAuthority: false;
  readonly ownsExistingWaveSlotSelectionAuthority: false;
  readonly ownsChallengeIdentityAuthority: false;
  readonly ownsLiveChallengeExecutionAuthority: false;
  readonly ownsLiveCompletionPolicyAuthority: false;
  readonly ownsDescriptorMutationAuthority: false;
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
  readonly ownsHashAuthority: false;
  readonly ownsFullArrayScan: false;
  readonly mayLookupEntities: false;
  readonly mayMutateEntities: false;
  readonly mayMutateGlobalCaps: false;
  readonly mayCreateEntities: false;
  readonly mayRemoveEntities: false;
}

export const BONUS_CHALLENGE_TIMEBOX_PROJECTION_AUTHORITY_CONTRACT: Readonly<BonusChallengeTimeboxProjectionAuthorityContract> =
  Object.freeze({
    ownsExactDurationProjectionAuthority: true,
    ownsCompletionProjectionAuthority: true,
    ownsOpportunityEligibilityAuthority: false,
    ownsExistingWaveSlotSelectionAuthority: false,
    ownsChallengeIdentityAuthority: false,
    ownsLiveChallengeExecutionAuthority: false,
    ownsLiveCompletionPolicyAuthority: false,
    ownsDescriptorMutationAuthority: false,
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
    ownsHashAuthority: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });

const TIMED_SURVIVAL_PROFILE = getBonusChallengeProfile("TIMED_SURVIVAL");
const TIMED_SURVIVAL_DURATION_MIDPOINT_MS =
  (BONUS_CHALLENGE_DURATION_WINDOW_MS.minMs +
    BONUS_CHALLENGE_DURATION_WINDOW_MS.maxMs) /
  2;

if (
  !TIMED_SURVIVAL_PROFILE ||
  TIMED_SURVIVAL_PROFILE.profileMode !== "PROFILE_ONLY" ||
  TIMED_SURVIVAL_PROFILE.objective !== "SURVIVE_UNTIL_TIME_EXPIRES" ||
  TIMED_SURVIVAL_PROFILE.completionCompatibility !== "TIMEBOX" ||
  TIMED_SURVIVAL_PROFILE.durationWindowMs !==
    BONUS_CHALLENGE_DURATION_WINDOW_MS ||
  BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS !==
    TIMED_SURVIVAL_DURATION_MIDPOINT_MS ||
  BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS <
    BONUS_CHALLENGE_DURATION_WINDOW_MS.minMs ||
  BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS >
    BONUS_CHALLENGE_DURATION_WINDOW_MS.maxMs
) {
  throw new Error(
    "J7C requires the certified J7A Timed Survival profile and exact midpoint duration.",
  );
}

const TIMEBOX_COMPLETION_PROJECTION: Readonly<BonusChallengeTimeboxCompletionProjection> =
  Object.freeze({
    type: "TIMEBOX",
    durationMs: BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS,
  });

export const resolveBonusChallengeTimeboxProjection = (
  facts: Readonly<BonusChallengeOpportunityFacts>,
): Readonly<BonusChallengeTimeboxProjection> | null => {
  const opportunity = resolveBonusChallengeOpportunity(facts);
  if (!opportunity) return null;
  if (opportunity.challengeId !== TIMED_SURVIVAL_PROFILE.challengeId) return null;

  return Object.freeze({
    kind: "BONUS_CHALLENGE_TIMEBOX_PROJECTION",
    projectionMode: "PROJECTION_ONLY",
    challengeId: TIMED_SURVIVAL_PROFILE.challengeId,
    sourceMode: opportunity.sourceMode,
    objective: TIMED_SURVIVAL_PROFILE.objective,
    sector: opportunity.sector,
    waveIndex: opportunity.waveIndex,
    waveCount: opportunity.waveCount,
    selectedWaveIndex: opportunity.selectedWaveIndex,
    opportunityId: opportunity.opportunityId,
    exactDurationMs: BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS,
    completionProjection: TIMEBOX_COMPLETION_PROJECTION,
    selectsExactDuration: true,
    projectsTimeboxCompletion: true,
    executesLiveChallenge: false,
    mutatesRuntimeDescriptor: false,
    startsTimer: false,
    ticksTimer: false,
    resetsTimer: false,
    ownsPauseLifecycle: false,
    altersSpawnComposition: false,
    altersArena: false,
    changesProgression: false,
    awardsScore: false,
    awardsRewards: false,
    changesEconomy: false,
    changesHud: false,
  });
};
