import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackRuntimeProjectionBundle.ts",
  "utf8",
);
const j8hSource = readFileSync(
  "src/game/scoreAttackBootstrapEnvelope.ts",
  "utf8",
);
const j8iSource = readFileSync(
  "src/game/scoreAttackRuntimeDescriptorCompletionOverlay.ts",
  "utf8",
);
const j8jSource = readFileSync(
  "src/game/scoreAttackTerminalCompletionDisposition.ts",
  "utf8",
);
const genericCacheSource = readFileSync(
  "src/game/runtimeProjectionBundleCache.ts",
  "utf8",
);
const adaptiveSource = readFileSync(
  "src/game/adaptiveInvasionRuntime.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const startScreenSource = readFileSync("src/components/StartScreen.tsx", "utf8");
const resultScreenSource = readFileSync("src/components/ResultScreen.tsx", "utf8");
const persistenceSource = readFileSync("src/game/runPersistence.ts", "utf8");

test("J8K composes from J8H/J8I and existing pure runtime projectors", () => {
  assert.match(source, /ScoreAttackBootstrapEnvelope/);
  assert.match(source, /resolveRuntimeWaveDescriptor/);
  assert.match(source, /resolveScoreAttackRuntimeDescriptorCompletionOverlay/);
  assert.match(source, /applyDynamicMidSectorEventRuntimeAdoption/);
  assert.match(source, /applyBonusChallengeRuntimeAdoption/);
  assert.match(source, /projectRuntimeCombatPressure/);
  assert.match(source, /projectRuntimeMutatorEffects/);
  assert.match(source, /getRuntimeMutatedEnemyBudget/);
  assert.match(source, /projectInfiniteMilestoneEncounter/);
  assert.match(source, /adaptiveInvasionBypassed:\s*true/);
  assert.match(source, /usesLiveFollowerCount:\s*false/);

  assert.match(j8hSource, /modeId:\s*recipe\.modeId/);
  assert.match(j8iSource, /changesOnlyCompletionPolicy:\s*true/);
  assert.match(j8jSource, /advanceInfiniteRuntime:\s*false/);
});

test("J8K has no Adaptive Invasion, live follower-count, generic cache or terminal-disposition dependency", () => {
  assert.doesNotMatch(source, /applyAdaptiveInvasionToDescriptor/);
  assert.doesNotMatch(
    source,
    /from\s+["']\.\/adaptiveInvasionRuntime["']/,
  );
  assert.doesNotMatch(source, /\bliveFollowerCount\b/);
  assert.doesNotMatch(source, /\bswarmRef\b|\bswarm\.length\b/);
  assert.doesNotMatch(source, /getCachedRuntimeProjectionBundle/);
  assert.doesNotMatch(
    source,
    /from\s+["']\.\/runtimeProjectionBundleCache["']/,
  );
  assert.doesNotMatch(source, /scoreAttackTerminalCompletionDisposition/);
  assert.doesNotMatch(source, /resolveScoreAttackTerminalCompletionDisposition/);

  assert.match(adaptiveSource, /liveFollowerCount/);
  assert.match(genericCacheSource, /applyAdaptiveInvasionToDescriptor/);
});

test("J8K remains pure and unadopted by live UI/cache/persistence seams", () => {
  assert.doesNotMatch(source, /setIsPlaying|setIsGameOver|setVictory|setStats/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|applyFinalRunCommit|saveGameStats/);
  assert.doesNotMatch(source, /Date\.now|performance\.now|Math\.random/);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(?:EnergySwarmGame|StartScreen|ResultScreen|storage|runPersistence)[^"']*["']/,
  );

  for (const [label, liveSource] of [
    ["runtimeProjectionBundleCache", genericCacheSource],
    ["EnergySwarmGame", gameSource],
    ["StartScreen", startScreenSource],
    ["ResultScreen", resultScreenSource],
    ["runPersistence", persistenceSource],
  ]) {
    assert.equal(
      liveSource.includes("scoreAttackRuntimeProjectionBundle"),
      false,
      `${label} must not import J8K`,
    );
  }
});

test("J8K authority contract has projection-bundle composition as its only positive authority", () => {
  assert.match(
    source,
    /ownsScoreAttackRuntimeProjectionBundleAuthority:\s*true/,
  );

  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual([...new Set(positiveMatches)], [
    "ownsScoreAttackRuntimeProjectionBundleAuthority",
  ]);
});
