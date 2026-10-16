import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackRecordCommitEligibility.ts",
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
const j8dSource = readFileSync(
  "src/game/scoreAttackRecordProjection.ts",
  "utf8",
);
const typesSource = readFileSync("src/game/types.ts", "utf8");
const storageSource = readFileSync("src/game/storage.ts", "utf8");
const persistenceSource = readFileSync("src/game/runPersistence.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const startScreen = readFileSync("src/components/StartScreen.tsx", "utf8");
const resultScreen = readFileSync("src/components/ResultScreen.tsx", "utf8");

test("J8F freezes pure Score Attack record-commit eligibility vocabulary", () => {
  assert.match(source, /ScoreAttackRecordCommitEligibilityMode = "ELIGIBILITY_ONLY"/);
  assert.match(source, /completionFact\.type !== "TIMEBOX"/);
  assert.match(source, /completionFact\.durationMs !== SCORE_ATTACK_DURATION_MS/);
  assert.match(source, /completionFact\.completed !== true/);
  assert.match(source, /recordProjection\.status === "NEW_BEST"/);
  assert.match(source, /writesStorage:\s*false/);
  assert.match(source, /mutatesGameStats:\s*false/);
  assert.match(source, /mutatesGlobalHighScore:\s*false/);
  assert.match(source, /adoptsLiveMode:\s*false/);

  assert.match(j8aSource, /modeId:\s*"SCORE_ATTACK"/);
  assert.match(j8cSource, /SCORE_ATTACK_DURATION_MS = 60000 as const/);
  assert.match(j8dSource, /resolveScoreAttackRecordProjection/);
  assert.match(typesSource, /scoreAttackBestScore:\s*number/);
  assert.match(storageSource, /scoreAttackBestScore:\s*0/);
});

test("J8F delegates score normalization and comparison to frozen J8D", () => {
  assert.match(
    source,
    /resolveScoreAttackRecordProjection\(\s*modeId,\s*existingBestScore,\s*candidateScore/,
  );
  assert.doesNotMatch(
    source,
    /Number\.isFinite|Math\.floor|Number\.MAX_SAFE_INTEGER/,
  );
});

test("J8F remains disconnected from persistence, live runtime and UI adoption", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(?:storage|runPersistence)[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /localStorage|sessionStorage|applyFinalRunCommit|Math\.random|Date\.now|performance\.now/,
  );

  for (const [label, liveSource] of [
    ["runPersistence", persistenceSource],
    ["EnergySwarmGame", gameSource],
    ["StartScreen", startScreen],
    ["ResultScreen", resultScreen],
  ]) {
    assert.equal(
      liveSource.includes("scoreAttackRecordCommitEligibility"),
      false,
      `${label} must not import J8F`,
    );
  }
});

test("J8F exposes no storage, runtime, UI, score or entity authority", () => {
  for (const requiredFalse of [
    "ownsDedicatedRecordProjectionAuthority",
    "ownsModeIdentityAuthority",
    "ownsCompletionProjectionAuthority",
    "ownsLiveCompletionPolicyAuthority",
    "ownsExactDurationAuthority",
    "ownsGameStatsAuthority",
    "ownsPersistenceAuthority",
    "ownsStorageSchemaAuthority",
    "ownsStorageWriteAuthority",
    "ownsGlobalHighScoreAuthority",
    "ownsRunArchiveAuthority",
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
});

test("J8F authority contract has record-commit eligibility as its only positive authority", () => {
  assert.match(source, /ownsRecordCommitEligibilityAuthority:\s*true/);

  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual(
    [...new Set(positiveMatches)],
    ["ownsRecordCommitEligibilityAuthority"],
  );
});
