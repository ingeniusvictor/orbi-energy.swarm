import { getBonusChallengeProfile } from "./bonusChallengeContract";
import {
  DYNAMIC_EVENT_MAX_WAVE_COUNT,
  resolveDynamicMidSectorEventOpportunity,
} from "./dynamicMidSectorEventOpportunity";
import type { RuntimeWaveSourceMode } from "./runtimeWaveDescriptor";

export const BONUS_CHALLENGE_MIN_INFINITE_SECTOR = 33 as const;
export const BONUS_CHALLENGE_SECTOR_CADENCE = 10 as const;
export const BONUS_CHALLENGE_SECTOR_OFFSET = 33 as const;
export const BONUS_CHALLENGE_MIN_WAVE_COUNT = 4 as const;
export const BONUS_CHALLENGE_MAX_WAVE_COUNT = DYNAMIC_EVENT_MAX_WAVE_COUNT;

export type BonusChallengeOpportunityKind =
  "BONUS_CHALLENGE_OPPORTUNITY";
export type BonusChallengeOpportunityMode = "OPPORTUNITY_ONLY";
export type BonusChallengeWaveSlotPolicy = "AVOID_J6_WAVE_2";

export interface BonusChallengeOpportunityFacts {
  readonly sourceMode: RuntimeWaveSourceMode;
  readonly sector: number;
  readonly waveIndex: number;
  readonly waveCount: number;
  readonly recoverySector: boolean;
  readonly hasMilestone: boolean;
  readonly seed: string;
  readonly recipeId: string;
}

export interface BonusChallengeOpportunityAuthorityContract {
  readonly ownsOpportunityEligibilityAuthority: true;
  readonly ownsExistingWaveSlotSelectionAuthority: true;
  readonly ownsChallengeIdentityAuthority: false;
  readonly ownsChallengeExecutionAuthority: false;
  readonly ownsSectorAuthority: false;
  readonly ownsWaveAuthority: false;
  readonly ownsRecoveryAuthority: false;
  readonly ownsMilestoneAuthority: false;
  readonly ownsCompletionPolicyAuthority: false;
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

export interface BonusChallengeOpportunity {
  readonly kind: BonusChallengeOpportunityKind;
  readonly opportunityMode: BonusChallengeOpportunityMode;
  readonly challengeId: "TIMED_SURVIVAL";
  readonly sourceMode: "INFINITE";
  readonly sector: number;
  readonly waveIndex: number;
  readonly waveCount: number;
  readonly selectedWaveIndex: number;
  readonly waveSlotPolicy: BonusChallengeWaveSlotPolicy;
  readonly j6OccupiesWaveTwo: boolean;
  readonly opportunityId: string;
  readonly selectsExactDuration: false;
  readonly executesLiveChallenge: false;
  readonly mutatesRuntimeDescriptor: false;
  readonly startsTimer: false;
  readonly altersSpawnComposition: false;
  readonly altersArena: false;
  readonly awardsRewards: false;
}

export const BONUS_CHALLENGE_OPPORTUNITY_AUTHORITY_CONTRACT: Readonly<BonusChallengeOpportunityAuthorityContract> =
  Object.freeze({
    ownsOpportunityEligibilityAuthority: true,
    ownsExistingWaveSlotSelectionAuthority: true,
    ownsChallengeIdentityAuthority: false,
    ownsChallengeExecutionAuthority: false,
    ownsSectorAuthority: false,
    ownsWaveAuthority: false,
    ownsRecoveryAuthority: false,
    ownsMilestoneAuthority: false,
    ownsCompletionPolicyAuthority: false,
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

if (
  !TIMED_SURVIVAL_PROFILE ||
  TIMED_SURVIVAL_PROFILE.profileMode !== "PROFILE_ONLY" ||
  TIMED_SURVIVAL_PROFILE.completionCompatibility !== "TIMEBOX"
) {
  throw new Error("J7B requires the certified J7A Timed Survival profile.");
}

const isCanonicalIdentity = (value: string): boolean =>
  value.length > 0 && value.trim() === value;

export const isBonusChallengeCadenceSector = (sector: number): boolean =>
  Number.isInteger(sector) &&
  sector >= BONUS_CHALLENGE_MIN_INFINITE_SECTOR &&
  (sector - BONUS_CHALLENGE_SECTOR_OFFSET) % BONUS_CHALLENGE_SECTOR_CADENCE === 0;

const resolveSelectedWaveIndex = (
  facts: Readonly<BonusChallengeOpportunityFacts>,
): Readonly<{
  selectedWaveIndex: 2 | 3;
  j6OccupiesWaveTwo: boolean;
}> => {
  const j6WaveTwoOpportunity = resolveDynamicMidSectorEventOpportunity({
    sourceMode: facts.sourceMode,
    sector: facts.sector,
    waveIndex: 2,
    waveCount: facts.waveCount,
    recoverySector: facts.recoverySector,
    hasMilestone: facts.hasMilestone,
    seed: facts.seed,
    recipeId: facts.recipeId,
  });

  const j6OccupiesWaveTwo = j6WaveTwoOpportunity !== null;

  return Object.freeze({
    selectedWaveIndex: j6OccupiesWaveTwo ? 3 : 2,
    j6OccupiesWaveTwo,
  });
};

export const resolveBonusChallengeOpportunity = (
  facts: Readonly<BonusChallengeOpportunityFacts>,
): Readonly<BonusChallengeOpportunity> | null => {
  if (facts.sourceMode !== "INFINITE") return null;
  if (!isBonusChallengeCadenceSector(facts.sector)) return null;
  if (
    !Number.isInteger(facts.waveCount) ||
    facts.waveCount < BONUS_CHALLENGE_MIN_WAVE_COUNT ||
    facts.waveCount > BONUS_CHALLENGE_MAX_WAVE_COUNT
  ) {
    return null;
  }
  if (
    !Number.isInteger(facts.waveIndex) ||
    facts.waveIndex < 1 ||
    facts.waveIndex > facts.waveCount
  ) {
    return null;
  }
  if (!isCanonicalIdentity(facts.seed) || !isCanonicalIdentity(facts.recipeId)) {
    return null;
  }
  if (facts.recoverySector || facts.hasMilestone) return null;
  if (facts.waveIndex === 1 || facts.waveIndex === facts.waveCount) return null;

  const { selectedWaveIndex, j6OccupiesWaveTwo } =
    resolveSelectedWaveIndex(facts);

  if (facts.waveIndex !== selectedWaveIndex) return null;

  return Object.freeze({
    kind: "BONUS_CHALLENGE_OPPORTUNITY",
    opportunityMode: "OPPORTUNITY_ONLY",
    challengeId: TIMED_SURVIVAL_PROFILE.challengeId,
    sourceMode: "INFINITE",
    sector: facts.sector,
    waveIndex: facts.waveIndex,
    waveCount: facts.waveCount,
    selectedWaveIndex,
    waveSlotPolicy: "AVOID_J6_WAVE_2",
    j6OccupiesWaveTwo,
    opportunityId: `j7b:timed-survival:${facts.sector}:${selectedWaveIndex}`,
    selectsExactDuration: false,
    executesLiveChallenge: false,
    mutatesRuntimeDescriptor: false,
    startsTimer: false,
    altersSpawnComposition: false,
    altersArena: false,
    awardsRewards: false,
  });
};
