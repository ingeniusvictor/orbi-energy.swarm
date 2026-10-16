import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackModeContract.ts",
  "utf8",
);
const runtimeRouter = readFileSync(
  "src/game/runtimeProgressionRouter.ts",
  "utf8",
);
const gameSource = readFileSync(
  "src/game/EnergySwarmGame.tsx",
  "utf8",
);
const startScreen = readFileSync(
  "src/components/StartScreen.tsx",
  "utf8",
);
const resultScreen = readFileSync(
  "src/components/ResultScreen.tsx",
  "utf8",
);
const persistence = readFileSync(
  "src/game/runPersistence.ts",
  "utf8",
);
const storage = readFileSync(
  "src/game/storage.ts",
  "utf8",
);
const typesSource = readFileSync(
  "src/game/types.ts",
  "utf8",
);

test("J8A freezes exactly one pure Score Attack semantic profile", () => {
  assert.match(source, /"SCORE_ATTACK"/);
  assert.match(source, /displayName:\s*"Score Attack"/);
  assert.match(source, /family:\s*"ARCADE_SCORE_CHASE"/);
  assert.match(source, /profileMode:\s*"PROFILE_ONLY"/);
  assert.match(source, /objective:\s*"MAXIMIZE_EXISTING_RUN_SCORE"/);
  assert.match(source, /completionCompatibility:\s*"TIMEBOX"/);
  assert.match(source, /scoreSourceCompatibility:\s*"EXISTING_RUN_SCORE"/);
  assert.match(source, /usesExistingRunScoreSemantics:\s*true/);
  assert.match(source, /usesExistingTimeboxVocabulary:\s*true/);
  assert.match(source, /ADDITIONAL_GAME_MODE_PROFILE_COUNT\s*=\s*\n?\s*ADDITIONAL_GAME_MODE_PROFILES\.length/);
});

test("J8A stays profile-only and does not choose live mode mechanics", () => {
  for (const requiredFalse of [
    "selectsExactDuration",
    "selectsProgressionSubstrate",
    "selectsRuntimeModeDiscriminator",
    "selectsStartFlow",
    "selectsPersistenceSchema",
    "selectsResultPresentation",
    "selectsSeedPolicy",
    "executesLiveMode",
    "mutatesScoreFormula",
    "awardsModeRewards",
  ]) {
    assert.match(source, new RegExp(`${requiredFalse}: false`));
  }

  assert.doesNotMatch(source, /durationMs:\s*\d+/);
  assert.doesNotMatch(source, /Math\.random|Date\.now|performance\.now|localStorage|sessionStorage/);
  assert.doesNotMatch(source, /^import\s/m);
});

test("J8A does not alter or get adopted by current live runtime UI or persistence authorities", () => {
  for (const [label, liveSource] of [
    ["EnergySwarmGame", gameSource],
    ["StartScreen", startScreen],
    ["ResultScreen", resultScreen],
    ["runtimeProgressionRouter", runtimeRouter],
    ["runPersistence", persistence],
    ["storage", storage],
  ]) {
    assert.equal(
      liveSource.includes("scoreAttackModeContract"),
      false,
      `${label} must not import J8A`,
    );
  }

  assert.match(runtimeRouter, /mode:\s*"CAMPAIGN"/);
  assert.match(runtimeRouter, /mode:\s*"INFINITE"/);
  assert.doesNotMatch(runtimeRouter, /mode:\s*"SCORE_ATTACK"/);
  assert.match(startScreen, /onStartGame:\s*\(\)\s*=>\s*void/);
  assert.match(typesSource, /highScore:\s*number/);
  assert.match(
    typesSource,
    /export type RunArchiveOutcome =\s*\n?\s*\| "DEFEAT"\s*\n?\s*\| "CAMPAIGN_CLEARED"/,
  );
});

test("J8A authority contract owns profile definition only", () => {
  assert.match(source, /ownsProfileDefinitionAuthority:\s*true/);

  for (const requiredFalse of [
    "ownsLiveAdoptionAuthority",
    "ownsRuntimeModeAuthority",
    "ownsProgressionAuthority",
    "ownsDescriptorMutationAuthority",
    "ownsCompletionPolicyAuthority",
    "ownsExactDurationAuthority",
    "ownsTimerAuthority",
    "ownsClock",
    "ownsPauseAuthority",
    "ownsSpawnAuthority",
    "ownsArenaAuthority",
    "ownsEntityCollection",
    "ownsProjectileCollection",
    "ownsDamageAuthority",
    "ownsDefeatAuthority",
    "ownsScoreMutationAuthority",
    "ownsScoreFormulaAuthority",
    "ownsRewardAuthority",
    "ownsEconomyAuthority",
    "ownsPersistenceAuthority",
    "ownsStorageSchemaAuthority",
    "ownsRunArchiveAuthority",
    "ownsHighScoreAuthority",
    "ownsStartScreenAuthority",
    "ownsResultScreenAuthority",
    "ownsHudAuthority",
    "ownsRandomness",
    "ownsHashAuthority",
    "ownsSeedAuthority",
    "ownsFullArrayScan",
    "mayLookupEntities",
    "mayMutateEntities",
    "mayMutateGlobalCaps",
    "mayCreateEntities",
    "mayRemoveEntities",
  ]) {
    assert.match(source, new RegExp(`${requiredFalse}: false`));
  }
});
