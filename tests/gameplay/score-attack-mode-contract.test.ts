import assert from "node:assert/strict";
import test from "node:test";

import {
  ADDITIONAL_GAME_MODE_IDS,
  ADDITIONAL_GAME_MODE_PROFILE_COUNT,
  ADDITIONAL_GAME_MODE_PROFILES,
  SCORE_ATTACK_MODE_AUTHORITY_CONTRACT,
  getAdditionalGameModeProfile,
} from "../../src/game/scoreAttackModeContract";

test("J8A exposes exactly one immutable Score Attack profile", () => {
  assert.deepEqual(ADDITIONAL_GAME_MODE_IDS, ["SCORE_ATTACK"]);
  assert.equal(ADDITIONAL_GAME_MODE_PROFILE_COUNT, 1);
  assert.equal(ADDITIONAL_GAME_MODE_PROFILES.length, 1);
  assert.equal(Object.isFrozen(ADDITIONAL_GAME_MODE_IDS), true);
  assert.equal(Object.isFrozen(ADDITIONAL_GAME_MODE_PROFILES), true);

  const profile = getAdditionalGameModeProfile("SCORE_ATTACK");
  assert.ok(profile);
  assert.equal(Object.isFrozen(profile), true);
  assert.deepEqual(profile, {
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
});

test("J8A lookup is deterministic and fails closed for noncanonical ids", () => {
  const canonical = getAdditionalGameModeProfile("SCORE_ATTACK");
  assert.ok(canonical);
  assert.equal(
    getAdditionalGameModeProfile("SCORE_ATTACK"),
    canonical,
  );

  for (const unsupported of [
    "",
    " SCORE_ATTACK",
    "SCORE_ATTACK ",
    "score_attack",
    "BOSS_RUSH",
    "SURVIVAL",
    "DAILY_SEED",
    "PERFECT_SECTOR",
  ]) {
    assert.equal(getAdditionalGameModeProfile(unsupported), null);
  }
});

test("J8A authority contract has profile definition as its only positive authority", () => {
  assert.equal(Object.isFrozen(SCORE_ATTACK_MODE_AUTHORITY_CONTRACT), true);
  assert.equal(
    SCORE_ATTACK_MODE_AUTHORITY_CONTRACT.ownsProfileDefinitionAuthority,
    true,
  );

  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_MODE_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsProfileDefinitionAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_MODE_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsProfileDefinitionAuthority") continue;
    assert.equal(value, false, `${key} must remain false`);
  }
});

test("J8A profile does not silently freeze unresolved live decisions", () => {
  const profile = getAdditionalGameModeProfile("SCORE_ATTACK");
  assert.ok(profile);

  assert.equal(profile.selectsExactDuration, false);
  assert.equal(profile.selectsProgressionSubstrate, false);
  assert.equal(profile.selectsRuntimeModeDiscriminator, false);
  assert.equal(profile.selectsStartFlow, false);
  assert.equal(profile.selectsPersistenceSchema, false);
  assert.equal(profile.selectsResultPresentation, false);
  assert.equal(profile.selectsSeedPolicy, false);
  assert.equal(profile.executesLiveMode, false);
  assert.equal(profile.mutatesScoreFormula, false);
  assert.equal(profile.awardsModeRewards, false);
});
