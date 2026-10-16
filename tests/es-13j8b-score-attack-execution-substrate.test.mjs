import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackExecutionSubstrateContract.ts",
  "utf8",
);
const profileSource = readFileSync(
  "src/game/scoreAttackModeContract.ts",
  "utf8",
);
const infiniteSession = readFileSync(
  "src/game/infiniteSession.ts",
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

test("J8B is compatibility-only and consumes frozen J8A + Infinite authorities", () => {
  assert.match(source, /getAdditionalGameModeProfile/);
  assert.match(source, /validateInfiniteSession/);
  assert.match(source, /createInfiniteRuntimeState/);
  assert.match(source, /resolveRuntimeWaveDescriptor/);
  assert.match(source, /contractMode:\s*"COMPATIBILITY_ONLY"/);
  assert.match(source, /executionSubstrate:\s*"INFINITE_SESSION"/);
  assert.match(source, /runtimeProgressionCompatibility:\s*"INFINITE"/);
  assert.match(source, /requiresCampaignVictoryCheckpoint:\s*false/);
  assert.match(source, /reusesExistingInfiniteAdvancement:\s*true/);
  assert.match(source, /reusesExistingRuntimeDescriptorPipeline:\s*true/);
  assert.match(
    source,
    /keepsScoreAttackOutsideRuntimeProgressionDiscriminator:\s*true/,
  );

  assert.match(profileSource, /profileMode:\s*"PROFILE_ONLY"/);
  assert.match(infiniteSession, /kind:\s*"INFINITE_SESSION"/);
  assert.match(infiniteSession, /currentSector:\s*11/);
  assert.match(infiniteSession, /currentWaveNumber:\s*1/);
});

test("J8B does not construct or advance a live session and does not freeze deferred mechanics", () => {
  assert.doesNotMatch(source, /createInfiniteSession\s*\(/);
  assert.doesNotMatch(source, /advanceInfiniteSession\s*\(/);
  assert.doesNotMatch(source, /beginInfiniteAfterCampaignVictory/);

  for (const requiredFalse of [
    "selectsExactDuration",
    "selectsSeedPolicy",
    "constructsLiveSession",
    "executesLiveMode",
    "ownsLiveAdoptionAuthority",
    "ownsRuntimeModeAuthority",
    "ownsProgressionAuthority",
    "ownsSessionConstructionAuthority",
    "ownsCampaignVictoryCheckpointAuthority",
    "ownsDescriptorMutationAuthority",
    "ownsCompletionPolicyAuthority",
    "ownsExactDurationAuthority",
    "ownsTimerAuthority",
    "ownsClock",
    "ownsPauseAuthority",
    "ownsScoreMutationAuthority",
    "ownsScoreFormulaAuthority",
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

  assert.doesNotMatch(source, /durationMs:\s*\d+/);
  assert.doesNotMatch(
    source,
    /Math\.random|Date\.now|performance\.now|localStorage|sessionStorage/,
  );
});

test("J8B leaves current live runtime, UI and persistence authorities unmodified and unadopted", () => {
  for (const [label, liveSource] of [
    ["EnergySwarmGame", gameSource],
    ["StartScreen", startScreen],
    ["ResultScreen", resultScreen],
    ["runtimeProgressionRouter", runtimeRouter],
    ["runPersistence", persistence],
    ["storage", storage],
  ]) {
    assert.equal(
      liveSource.includes("scoreAttackExecutionSubstrateContract"),
      false,
      `${label} must not import J8B`,
    );
  }

  assert.match(runtimeRouter, /mode:\s*"CAMPAIGN"/);
  assert.match(runtimeRouter, /mode:\s*"INFINITE"/);
  assert.doesNotMatch(runtimeRouter, /mode:\s*"SCORE_ATTACK"/);
  assert.match(startScreen, /onStartGame:\s*\(\)\s*=>\s*void/);
});

test("J8B authority contract has substrate compatibility as its only positive authority", () => {
  assert.match(
    source,
    /ownsExecutionSubstrateCompatibilityAuthority:\s*true/,
  );

  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual(
    [...new Set(positiveMatches)],
    ["ownsExecutionSubstrateCompatibilityAuthority"],
  );
});
