export const ADDITIONAL_GAME_MODE_IDS = Object.freeze([
  "SCORE_ATTACK",
] as const);

export type AdditionalGameModeId =
  (typeof ADDITIONAL_GAME_MODE_IDS)[number];
export type ScoreAttackModeFamily = "ARCADE_SCORE_CHASE";
export type ScoreAttackProfileMode = "PROFILE_ONLY";
export type ScoreAttackObjective = "MAXIMIZE_EXISTING_RUN_SCORE";
export type ScoreAttackCompletionCompatibility = "TIMEBOX";
export type ScoreAttackScoreSourceCompatibility = "EXISTING_RUN_SCORE";

export interface ScoreAttackModeProfile {
  readonly modeId: "SCORE_ATTACK";
  readonly displayName: "Score Attack";
  readonly family: ScoreAttackModeFamily;
  readonly profileMode: ScoreAttackProfileMode;
  readonly objective: ScoreAttackObjective;
  readonly completionCompatibility: ScoreAttackCompletionCompatibility;
  readonly scoreSourceCompatibility: ScoreAttackScoreSourceCompatibility;
  readonly usesExistingRunScoreSemantics: true;
  readonly usesExistingTimeboxVocabulary: true;
  readonly selectsExactDuration: false;
  readonly selectsProgressionSubstrate: false;
  readonly selectsRuntimeModeDiscriminator: false;
  readonly selectsStartFlow: false;
  readonly selectsPersistenceSchema: false;
  readonly selectsResultPresentation: false;
  readonly selectsSeedPolicy: false;
  readonly executesLiveMode: false;
  readonly mutatesScoreFormula: false;
  readonly awardsModeRewards: false;
}

export interface ScoreAttackModeAuthorityContract {
  readonly ownsProfileDefinitionAuthority: true;
  readonly ownsLiveAdoptionAuthority: false;
  readonly ownsRuntimeModeAuthority: false;
  readonly ownsProgressionAuthority: false;
  readonly ownsDescriptorMutationAuthority: false;
  readonly ownsCompletionPolicyAuthority: false;
  readonly ownsExactDurationAuthority: false;
  readonly ownsTimerAuthority: false;
  readonly ownsClock: false;
  readonly ownsPauseAuthority: false;
  readonly ownsSpawnAuthority: false;
  readonly ownsArenaAuthority: false;
  readonly ownsEntityCollection: false;
  readonly ownsProjectileCollection: false;
  readonly ownsDamageAuthority: false;
  readonly ownsDefeatAuthority: false;
  readonly ownsScoreMutationAuthority: false;
  readonly ownsScoreFormulaAuthority: false;
  readonly ownsRewardAuthority: false;
  readonly ownsEconomyAuthority: false;
  readonly ownsPersistenceAuthority: false;
  readonly ownsStorageSchemaAuthority: false;
  readonly ownsRunArchiveAuthority: false;
  readonly ownsHighScoreAuthority: false;
  readonly ownsStartScreenAuthority: false;
  readonly ownsResultScreenAuthority: false;
  readonly ownsHudAuthority: false;
  readonly ownsRandomness: false;
  readonly ownsHashAuthority: false;
  readonly ownsSeedAuthority: false;
  readonly ownsFullArrayScan: false;
  readonly mayLookupEntities: false;
  readonly mayMutateEntities: false;
  readonly mayMutateGlobalCaps: false;
  readonly mayCreateEntities: false;
  readonly mayRemoveEntities: false;
}

const SCORE_ATTACK_PROFILE: Readonly<ScoreAttackModeProfile> = Object.freeze({
  modeId: "SCORE_ATTACK",
  displayName: "Score Attack",
  family: "ARCADE_SCORE_CHASE",
  profileMode: "PROFILE_ONLY",
  objective: "MAXIMIZE_EXISTING_RUN_SCORE",
  completionCompatibility: "TIMEBOX",
  scoreSourceCompatibility: "EXISTING_RUN_SCORE",
  usesExistingRunScoreSemantics: true,
  usesExistingTimeboxVocabulary: true,
  selectsExactDuration: false,
  selectsProgressionSubstrate: false,
  selectsRuntimeModeDiscriminator: false,
  selectsStartFlow: false,
  selectsPersistenceSchema: false,
  selectsResultPresentation: false,
  selectsSeedPolicy: false,
  executesLiveMode: false,
  mutatesScoreFormula: false,
  awardsModeRewards: false,
});

const ADDITIONAL_GAME_MODE_PROFILE_BY_ID: Readonly<
  Record<AdditionalGameModeId, Readonly<ScoreAttackModeProfile>>
> = Object.freeze({
  SCORE_ATTACK: SCORE_ATTACK_PROFILE,
});

export const ADDITIONAL_GAME_MODE_PROFILES = Object.freeze(
  ADDITIONAL_GAME_MODE_IDS.map(
    (modeId) => ADDITIONAL_GAME_MODE_PROFILE_BY_ID[modeId],
  ),
);

export const ADDITIONAL_GAME_MODE_PROFILE_COUNT =
  ADDITIONAL_GAME_MODE_PROFILES.length;

export const getAdditionalGameModeProfile = (
  modeId: string,
): Readonly<ScoreAttackModeProfile> | null => {
  if (
    !Object.prototype.hasOwnProperty.call(
      ADDITIONAL_GAME_MODE_PROFILE_BY_ID,
      modeId,
    )
  ) {
    return null;
  }

  return ADDITIONAL_GAME_MODE_PROFILE_BY_ID[
    modeId as AdditionalGameModeId
  ];
};

export const SCORE_ATTACK_MODE_AUTHORITY_CONTRACT: Readonly<ScoreAttackModeAuthorityContract> =
  Object.freeze({
    ownsProfileDefinitionAuthority: true,
    ownsLiveAdoptionAuthority: false,
    ownsRuntimeModeAuthority: false,
    ownsProgressionAuthority: false,
    ownsDescriptorMutationAuthority: false,
    ownsCompletionPolicyAuthority: false,
    ownsExactDurationAuthority: false,
    ownsTimerAuthority: false,
    ownsClock: false,
    ownsPauseAuthority: false,
    ownsSpawnAuthority: false,
    ownsArenaAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreMutationAuthority: false,
    ownsScoreFormulaAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
    ownsPersistenceAuthority: false,
    ownsStorageSchemaAuthority: false,
    ownsRunArchiveAuthority: false,
    ownsHighScoreAuthority: false,
    ownsStartScreenAuthority: false,
    ownsResultScreenAuthority: false,
    ownsHudAuthority: false,
    ownsRandomness: false,
    ownsHashAuthority: false,
    ownsSeedAuthority: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });
