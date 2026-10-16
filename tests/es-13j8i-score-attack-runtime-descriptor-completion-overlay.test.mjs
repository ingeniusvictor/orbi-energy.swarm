import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackRuntimeDescriptorCompletionOverlay.ts",
  "utf8",
);
const bootstrapSource = readFileSync(
  "src/game/scoreAttackBootstrapEnvelope.ts",
  "utf8",
);
const routerSource = readFileSync(
  "src/game/runtimeProgressionRouter.ts",
  "utf8",
);
const descriptorSource = readFileSync(
  "src/game/runtimeWaveDescriptor.ts",
  "utf8",
);
const completionPolicySource = readFileSync(
  "src/game/runtimeCompletionPolicy.ts",
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

test("J8I delegates bootstrap, descriptor construction and exact duration to frozen authorities", () => {
  assert.match(source, /ScoreAttackBootstrapEnvelope/);
  assert.match(source, /resolveRuntimeWaveDescriptor/);
  assert.match(source, /SCORE_ATTACK_DURATION_MS/);
  assert.match(source, /BUDGET_AND_CLEAR/);
  assert.match(source, /TIMEBOX/);
  assert.match(source, /modeId:\s*"SCORE_ATTACK"/);
  assert.match(source, /sourceRuntimeMode:\s*envelope\.runtimeProgression\.mode/);

  assert.match(bootstrapSource, /modeId:\s*"SCORE_ATTACK"/);
  assert.match(bootstrapSource, /runtimeProgressionMode:\s*runtimeProgression\.mode/);
  assert.match(routerSource, /mode:\s*"CAMPAIGN"/);
  assert.match(routerSource, /mode:\s*"INFINITE"/);
  assert.doesNotMatch(routerSource, /SCORE_ATTACK/);
  assert.match(descriptorSource, /completionPolicy:\s*\{\s*type:\s*"BUDGET_AND_CLEAR"\s*\}/);
});

test("J8I stays disconnected from cache, live timer, React UI and persistence adoption", () => {
  assert.doesNotMatch(
    source,
    /getCachedRuntimeProjectionBundle|createRuntimeProjectionBundleCache|shouldTickRuntimeTimer|isRuntimeWaveComplete/,
  );
  assert.doesNotMatch(
    source,
    /advanceInfiniteRuntimeState|advanceInfiniteSession|endInfiniteSession/,
  );
  assert.doesNotMatch(
    source,
    /localStorage|sessionStorage|Date\.now|performance\.now|Math\.random/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(?:EnergySwarmGame|StartScreen|ResultScreen|storage|runPersistence|runtimeProjectionBundleCache|runtimeCompletionPolicy)[^"']*["']/,
  );

  for (const [label, liveSource] of [
    ["runtimeProjectionBundleCache", cacheSource],
    ["runtimeCompletionPolicy", completionPolicySource],
    ["EnergySwarmGame", gameSource],
    ["StartScreen", startScreenSource],
    ["ResultScreen", resultScreenSource],
    ["storage", storageSource],
    ["runPersistence", persistenceSource],
  ]) {
    assert.equal(
      liveSource.includes("scoreAttackRuntimeDescriptorCompletionOverlay"),
      false,
      `${label} must not import J8I`,
    );
  }
});

test("J8I source changes only completion policy in the projected descriptor", () => {
  assert.match(
    source,
    /const projectedDescriptor:[\s\S]*Object\.freeze\(\{[\s\S]*\.\.\.descriptor,[\s\S]*completionPolicy,[\s\S]*\}\)/,
  );
  assert.match(source, /changesOnlyCompletionPolicy:\s*true/);
  assert.match(source, /preservesDescriptorIdentity:\s*true/);
  assert.match(source, /preservesDescriptorDisplay:\s*true/);
  assert.match(source, /preservesSpawnSemantics:\s*true/);
  assert.match(source, /preservesPressureSemantics:\s*true/);
  assert.match(source, /preservesRewardSemantics:\s*true/);
  assert.match(source, /preservesFairnessSemantics:\s*true/);
  assert.match(source, /preservesSourceFacts:\s*true/);
});

test("J8I authority contract has descriptor-completion overlay projection as its only positive authority", () => {
  assert.match(
    source,
    /ownsDescriptorCompletionOverlayProjectionAuthority:\s*true/,
  );

  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual([...new Set(positiveMatches)], [
    "ownsDescriptorCompletionOverlayProjectionAuthority",
  ]);
});
