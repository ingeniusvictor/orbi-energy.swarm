import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackRecordProjection.ts",
  "utf8",
);
const j8aSource = readFileSync(
  "src/game/scoreAttackModeContract.ts",
  "utf8",
);
const j8cSource = readFileSync(
  "src/game/scoreAttackTimeboxProjection.ts",
  "utf8",
);
const typesSource = readFileSync("src/game/types.ts", "utf8");
const persistence = readFileSync("src/game/runPersistence.ts", "utf8");
const storage = readFileSync("src/game/storage.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const startScreen = readFileSync("src/components/StartScreen.tsx", "utf8");
const resultScreen = readFileSync("src/components/ResultScreen.tsx", "utf8");

test("J8D freezes a dedicated storage-neutral Score Attack record vocabulary", () => {
  assert.match(source, /SCORE_ATTACK_RECORD_ID = "SCORE_ATTACK_BEST_SCORE"/);
  assert.match(source, /ScoreAttackRecordProjectionMode = "RECORD_PROJECTION_ONLY"/);
  assert.match(source, /"NEW_BEST"/);
  assert.match(source, /"TIED_BEST"/);
  assert.match(source, /"BELOW_BEST"/);
  assert.match(source, /Number\.isFinite/);
  assert.match(source, /Math\.floor/);
  assert.match(source, /Number\.MAX_SAFE_INTEGER/);
  assert.match(source, /Math\.max\(/);
  assert.match(source, /writesStorage:\s*false/);
  assert.match(source, /mutatesGlobalHighScore:\s*false/);
  assert.match(source, /mutatesGameStats:\s*false/);

  assert.match(j8aSource, /modeId:\s*"SCORE_ATTACK"/);
  assert.match(j8cSource, /SCORE_ATTACK_DURATION_MS = 60000 as const/);
});

test("J8D does not mutate GameStats, global highScore, storage schema or persistence authorities", () => {
  assert.equal(typesSource.includes("scoreAttackBestScore"), false);
  assert.equal(storage.includes("scoreAttackBestScore"), false);
  assert.equal(persistence.includes("scoreAttackBestScore"), false);

  assert.match(typesSource, /highScore:\s*number/);
  assert.match(storage, /highScore:\s*0/);
  assert.match(persistence, /highScore:\s*Math\.max/);

  for (const [label, liveSource] of [
    ["types", typesSource],
    ["runPersistence", persistence],
    ["storage", storage],
    ["EnergySwarmGame", gameSource],
    ["StartScreen", startScreen],
    ["ResultScreen", resultScreen],
  ]) {
    assert.equal(
      liveSource.includes("scoreAttackRecordProjection"),
      false,
      `${label} must not import J8D`,
    );
  }
});

test("J8D exposes no storage, UI, runtime, random or entity authority", () => {
  for (const requiredFalse of [
    "ownsGlobalHighScoreAuthority",
    "ownsGameStatsAuthority",
    "ownsPersistenceAuthority",
    "ownsStorageSchemaAuthority",
    "ownsStorageWriteAuthority",
    "ownsRunArchiveAuthority",
    "ownsModeIdentityAuthority",
    "ownsExactDurationAuthority",
    "ownsCompletionPolicyAuthority",
    "ownsLiveModeExecutionAuthority",
    "ownsRuntimeModeAuthority",
    "ownsProgressionAuthority",
    "ownsSessionConstructionAuthority",
    "ownsTimerAuthority",
    "ownsClock",
    "ownsPauseAuthority",
    "ownsStartScreenAuthority",
    "ownsResultScreenAuthority",
    "ownsHudAuthority",
    "ownsScoreMutationAuthority",
    "ownsScoreFormulaAuthority",
    "ownsRewardAuthority",
    "ownsEconomyAuthority",
    "ownsSpawnAuthority",
    "ownsArenaAuthority",
    "ownsEntityCollection",
    "ownsProjectileCollection",
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

  assert.doesNotMatch(
    source,
    /localStorage|sessionStorage|Math\.random|Date\.now|performance\.now/,
  );
});

test("J8D authority contract has dedicated record projection as its only positive authority", () => {
  assert.match(source, /ownsDedicatedRecordProjectionAuthority:\s*true/);

  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual(
    [...new Set(positiveMatches)],
    ["ownsDedicatedRecordProjectionAuthority"],
  );
});
