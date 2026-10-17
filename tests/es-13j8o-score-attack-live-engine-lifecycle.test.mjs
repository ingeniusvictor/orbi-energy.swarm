import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackLiveEngineLifecycle.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const startScreenSource = readFileSync("src/components/StartScreen.tsx", "utf8");
const resultScreenSource = readFileSync("src/components/ResultScreen.tsx", "utf8");

test("J8O coordinates frozen J8L/J8M/J8N behind one engine-only seam", () => {
  assert.match(source, /resolveScoreAttackRuntimeActivationEnvelope/);
  assert.match(source, /resolveScoreAttackAttemptFinalizationPlan/);
  assert.match(source, /applyScoreAttackStatsCommit/);
  assert.match(source, /runtimeProgression === activation\.runtimeProgression/);
  assert.match(source, /runtimeProgression\.session === activation\.runtimeSession/);
  assert.match(source, /skipsGenericRunPersistence:\s*true/);
  assert.match(source, /advancesInfiniteRuntime:\s*false/);
  assert.match(source, /writesStorageDirectly:\s*false/);

  assert.doesNotMatch(
    source,
    /saveGameStats|loadGameStats|resetGameStats|applyFinalRunCommit|localStorage|sessionStorage|Date\.now|performance\.now|Math\.random/,
  );
});

test("EnergySwarmGame keeps J8O as the engine coordinator while J8P adds presentation-only adoption", () => {
  assert.match(gameSource, /from "\.\/scoreAttackLiveEngineLifecycle"/);
  assert.match(gameSource, /scoreAttackActivationRef/);
  assert.match(gameSource, /resolveScoreAttackLiveRuntimeProjection/);
  assert.match(gameSource, /resolveScoreAttackLiveTerminalApplication/);
  assert.match(gameSource, /startGameWithMode/);
  assert.match(gameSource, /startGameWithMode\("CAMPAIGN"\)/);
  assert.match(gameSource, /startGameWithMode\("SCORE_ATTACK"\)/);
  assert.match(gameSource, /changedDedicatedRecord/);
  assert.match(gameSource, /updateStatsAndSave/);

  for (const frozenDirectImport of [
    "scoreAttackRuntimeProjectionBundle",
    "scoreAttackRuntimeActivationEnvelope",
    "scoreAttackAttemptFinalizationPlan",
    "scoreAttackStatsCommitApplication",
  ]) {
    for (const [label, liveSource] of [
      ["EnergySwarmGame", gameSource],
      ["StartScreen", startScreenSource],
      ["ResultScreen", resultScreenSource],
    ]) {
      assert.equal(
        liveSource.includes(frozenDirectImport),
        false,
        `${label} must not directly import frozen ${frozenDirectImport}`,
      );
    }
  }

  assert.match(startScreenSource, /onStartScoreAttack/);
  assert.doesNotMatch(startScreenSource, /resolveScoreAttackLiveEngineActivation|startGameWithMode/);
  assert.match(resultScreenSource, /presentationMode === "SCORE_ATTACK"/);
  assert.doesNotMatch(
    resultScreenSource,
    /resolveScoreAttackLiveEngineActivation|resolveScoreAttackLiveRuntimeProjection|resolveScoreAttackLiveTerminalApplication/,
  );
});

test("J8O has no new runtime discriminator, timer, cache, spawn or economy authority", () => {
  assert.doesNotMatch(source, /setInterval|setTimeout|requestAnimationFrame/);
  assert.doesNotMatch(source, /createRuntimeProjectionBundleCache|getCachedRuntimeProjectionBundle/);
  assert.doesNotMatch(source, /advanceInfiniteRuntimeState|endInfiniteSession/);

  const positives = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);
  assert.deepEqual([...new Set(positives)], [
    "ownsControlledLiveEngineCoordinationAuthority",
  ]);
});
