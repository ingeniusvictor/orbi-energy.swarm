import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackTimeboxProjection.ts",
  "utf8",
);
const j8aSource = readFileSync(
  "src/game/scoreAttackModeContract.ts",
  "utf8",
);
const j8bSource = readFileSync(
  "src/game/scoreAttackExecutionSubstrateContract.ts",
  "utf8",
);
const completionSource = readFileSync(
  "src/game/runtimeCompletionPolicy.ts",
  "utf8",
);
const waveSource = readFileSync(
  "src/game/waveDirector.ts",
  "utf8",
);
const j7cSource = readFileSync(
  "src/game/bonusChallengeTimeboxProjection.ts",
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

test("J8C consumes frozen J8A + J8B and freezes only a pure 60000 ms TIMEBOX projection", () => {
  assert.match(source, /getAdditionalGameModeProfile/);
  assert.match(source, /resolveScoreAttackExecutionSubstrateCompatibility/);
  assert.match(source, /SCORE_ATTACK_DURATION_MS = 60000 as const/);
  assert.match(source, /projectionMode:\s*"PROJECTION_ONLY"/);
  assert.match(source, /type:\s*"TIMEBOX"/);
  assert.match(source, /durationMs:\s*SCORE_ATTACK_DURATION_MS/);
  assert.match(source, /selectsExactDuration:\s*true/);
  assert.match(source, /projectsTimeboxCompletion:\s*true/);

  assert.match(j8aSource, /completionCompatibility:\s*"TIMEBOX"/);
  assert.match(j8aSource, /scoreSourceCompatibility:\s*"EXISTING_RUN_SCORE"/);
  assert.match(j8bSource, /executionSubstrate:\s*"INFINITE_SESSION"/);
  assert.match(j8bSource, /selectsExactDuration:\s*false/);

  assert.match(waveSource, /waveNumber:\s*9,[\s\S]*?duration:\s*60000/);
  assert.match(j7cSource, /BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS = 30000/);
});

test("J8C does not create a live timer, mutate runtime descriptors or adopt UI/storage authority", () => {
  for (const requiredFalse of [
    "executesLiveMode",
    "mutatesRuntimeDescriptor",
    "constructsLiveSession",
    "startsTimer",
    "ticksTimer",
    "resetsTimer",
    "ownsPauseLifecycle",
    "selectsSeedPolicy",
    "changesProgression",
    "changesScoreFormula",
    "changesPersistence",
    "changesHud",
    "ownsModeIdentityAuthority",
    "ownsExecutionSubstrateCompatibilityAuthority",
    "ownsLiveModeExecutionAuthority",
    "ownsLiveCompletionPolicyAuthority",
    "ownsDescriptorMutationAuthority",
    "ownsRuntimeModeAuthority",
    "ownsProgressionAuthority",
    "ownsSessionConstructionAuthority",
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

  assert.doesNotMatch(source, /createInfiniteSession\s*\(/);
  assert.doesNotMatch(source, /advanceInfiniteSession\s*\(/);
  assert.doesNotMatch(source, /waveTimeRemainingRef/);
  assert.doesNotMatch(source, /shouldTickRuntimeTimer\s*\(/);
  assert.doesNotMatch(source, /isRuntimeWaveComplete\s*\(/);
  assert.doesNotMatch(source, /Math\.random|Date\.now|performance\.now|localStorage|sessionStorage/);
});

test("J8C leaves existing live completion, runtime, UI and persistence authorities unadopted", () => {
  for (const [label, liveSource] of [
    ["runtimeCompletionPolicy", completionSource],
    ["EnergySwarmGame", gameSource],
    ["StartScreen", startScreen],
    ["ResultScreen", resultScreen],
    ["runPersistence", persistence],
    ["storage", storage],
  ]) {
    assert.equal(
      liveSource.includes("scoreAttackTimeboxProjection"),
      false,
      `${label} must not import J8C`,
    );
  }

  assert.match(completionSource, /remainingTimeMs\s*<=\s*0/);
  assert.match(completionSource, /shouldTickRuntimeTimer/);
});

test("J8C authority contract has exactly two positive authorities", () => {
  assert.match(source, /ownsExactDurationProjectionAuthority:\s*true/);
  assert.match(source, /ownsCompletionProjectionAuthority:\s*true/);

  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual(
    [...new Set(positiveMatches)],
    [
      "ownsExactDurationProjectionAuthority",
      "ownsCompletionProjectionAuthority",
    ],
  );
});
