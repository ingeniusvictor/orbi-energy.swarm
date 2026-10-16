import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackTerminalCompletionDisposition.ts",
  "utf8",
);
const bootstrapSource = readFileSync(
  "src/game/scoreAttackBootstrapEnvelope.ts",
  "utf8",
);
const overlaySource = readFileSync(
  "src/game/scoreAttackRuntimeDescriptorCompletionOverlay.ts",
  "utf8",
);
const completionPolicySource = readFileSync(
  "src/game/runtimeCompletionPolicy.ts",
  "utf8",
);
const routerSource = readFileSync(
  "src/game/runtimeProgressionRouter.ts",
  "utf8",
);
const cacheSource = readFileSync(
  "src/game/runtimeProjectionBundleCache.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const startScreenSource = readFileSync("src/components/StartScreen.tsx", "utf8");
const resultScreenSource = readFileSync("src/components/ResultScreen.tsx", "utf8");
const storageSource = readFileSync("src/game/storage.ts", "utf8");
const persistenceSource = readFileSync("src/game/runPersistence.ts", "utf8");

test("J8J delegates canonical facts to J8H/J8I and completion truth to runtimeCompletionPolicy", () => {
  assert.match(source, /ScoreAttackBootstrapEnvelope/);
  assert.match(source, /ScoreAttackRuntimeDescriptorCompletionOverlay/);
  assert.match(source, /resolveScoreAttackRuntimeDescriptorCompletionOverlay/);
  assert.match(source, /resolveRuntimeWaveDescriptor/);
  assert.match(source, /SCORE_ATTACK_DURATION_MS/);
  assert.match(source, /isRuntimeWaveComplete\(overlay\.descriptor, snapshot\)/);
  assert.match(source, /disposition:\s*"END_SCORE_ATTACK_ATTEMPT"/);
  assert.match(source, /advanceInfiniteRuntime:\s*false/);

  assert.match(bootstrapSource, /modeId:\s*"SCORE_ATTACK"/);
  assert.match(bootstrapSource, /runtimeProgressionMode:\s*runtimeProgression\.mode/);
  assert.match(overlaySource, /const completionPolicy = Object\.freeze\(/);
  assert.match(overlaySource, /type:\s*"TIMEBOX" as const/);
  assert.match(completionPolicySource, /case\s+"TIMEBOX":/);
  assert.match(completionPolicySource, /snapshot\.remainingTimeMs\s*<=\s*0/);
  assert.doesNotMatch(routerSource, /SCORE_ATTACK/);
});

test("J8J cannot advance/end session or adopt live cache, React UI or persistence", () => {
  assert.doesNotMatch(source, /\badvanceInfiniteRuntimeState\s*\(/);
  assert.doesNotMatch(source, /\badvanceInfiniteSession\s*\(/);
  assert.doesNotMatch(source, /\bendInfiniteSession\s*\(/);
  assert.doesNotMatch(source, /getCachedRuntimeProjectionBundle|createRuntimeProjectionBundleCache/);
  assert.doesNotMatch(source, /setIsPlaying|setIsGameOver|setVictory|setStats/);
  assert.doesNotMatch(source, /applyFinalRunCommit|saveGameStats|localStorage|sessionStorage/);
  assert.doesNotMatch(source, /Date\.now|performance\.now|Math\.random/);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(?:EnergySwarmGame|StartScreen|ResultScreen|storage|runPersistence|runtimeProjectionBundleCache)[^"']*["']/,
  );

  for (const [label, liveSource] of [
    ["runtimeProjectionBundleCache", cacheSource],
    ["EnergySwarmGame", gameSource],
    ["StartScreen", startScreenSource],
    ["ResultScreen", resultScreenSource],
    ["storage", storageSource],
    ["runPersistence", persistenceSource],
  ]) {
    assert.equal(
      liveSource.includes("scoreAttackTerminalCompletionDisposition"),
      false,
      `${label} must not import J8J`,
    );
  }
});

test("J8J preserves nested INFINITE runtime identity while projecting terminal disposition only", () => {
  assert.match(source, /sourceRuntimeMode:\s*envelope\.runtimeProgression\.mode/);
  assert.match(source, /preservesNestedRuntimeDiscriminator:\s*true/);
  assert.match(source, /mutatesSessionStatus:\s*false/);
  assert.match(source, /callsSessionEnd:\s*false/);
  assert.match(source, /writesRuntimeProjectionCache:\s*false/);
  assert.match(source, /writesReactStateOrRefs:\s*false/);
  assert.match(source, /transitionsResultUi:\s*false/);
  assert.match(source, /writesPersistence:\s*false/);
  assert.match(source, /writesRunArchive:\s*false/);
  assert.match(source, /writesScoreAttackRecord:\s*false/);
});

test("J8J authority contract has terminal disposition projection as its only positive authority", () => {
  assert.match(
    source,
    /ownsTerminalCompletionDispositionProjectionAuthority:\s*true/,
  );

  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual([...new Set(positiveMatches)], [
    "ownsTerminalCompletionDispositionProjectionAuthority",
  ]);
});
