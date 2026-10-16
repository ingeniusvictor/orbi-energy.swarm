import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/scoreAttackRuntimeProjectionBundle.ts",
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
const genericBundleSource = readFileSync(
  "src/game/runtimeProjectionBundleCache.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const terminalSource = readFileSync(
  "src/game/scoreAttackTerminalCompletionDisposition.ts",
  "utf8",
);


test("J8K composes frozen J8H and J8I through existing pure runtime projectors", () => {
  assert.match(source, /ScoreAttackBootstrapEnvelope/);
  assert.match(source, /resolveRuntimeWaveDescriptor/);
  assert.match(source, /resolveScoreAttackRuntimeDescriptorCompletionOverlay/);
  assert.match(source, /applyDynamicMidSectorEventRuntimeAdoption/);
  assert.match(source, /applyBonusChallengeRuntimeAdoption/);
  assert.match(source, /projectRuntimeCombatPressure/);
  assert.match(source, /projectRuntimeMutatorEffects/);
  assert.match(source, /getRuntimeMutatedEnemyBudget/);
  assert.match(source, /projectInfiniteMilestoneEncounter/);
  assert.match(source, /SCORE_ATTACK_DURATION_MS/);

  assert.match(bootstrapSource, /modeId:\s*"SCORE_ATTACK"/);
  assert.match(overlaySource, /sourceCompletionType:\s*"BUDGET_AND_CLEAR"/);
  assert.match(overlaySource, /type:\s*"TIMEBOX"/);
});

test("J8K excludes Adaptive Invasion, generic cache and terminal disposition from Score Attack composition", () => {
  assert.doesNotMatch(
    source,
    /applyAdaptiveInvasionToDescriptor|adaptiveInvasionRuntime/,
  );
  assert.doesNotMatch(
    source,
    /getCachedRuntimeProjectionBundle|createRuntimeProjectionBundleCache|runtimeProjectionBundleCache/,
  );
  assert.doesNotMatch(
    source,
    /scoreAttackTerminalCompletionDisposition|resolveScoreAttackTerminalCompletionDisposition/,
  );
  assert.doesNotMatch(
    source,
    /EnergySwarmGame|StartScreen|ResultScreen|GameHud|runPersistence|storage/,
  );
  assert.doesNotMatch(
    source,
    /Date\.now|performance\.now|Math\.random|localStorage|sessionStorage/,
  );

  assert.match(genericBundleSource, /applyAdaptiveInvasionToDescriptor/);
  assert.equal(
    gameSource.includes("scoreAttackRuntimeProjectionBundle"),
    false,
    "EnergySwarmGame must not import J8K yet",
  );
  assert.equal(
    terminalSource.includes("scoreAttackRuntimeProjectionBundle"),
    false,
    "J8J must remain separate from J8K",
  );
});

test("J8K requires J6 and J7 compatibility to remain null and descriptor-preserving", () => {
  assert.match(source, /dynamicEventCompatibility\.adoption\s*!==\s*null/);
  assert.match(source, /dynamicEventCompatibility\.descriptor\s*!==\s*descriptor/);
  assert.match(source, /bonusChallengeCompatibility\.adoption\s*!==\s*null/);
  assert.match(source, /bonusChallengeCompatibility\.descriptor\s*!==\s*descriptor/);
  assert.match(source, /verifiesDynamicEventIsolation:\s*true/);
  assert.match(source, /verifiesBonusChallengeIsolation:\s*true/);
  assert.match(source, /dynamicMidSectorEventAdoption:\s*null/);
  assert.match(source, /bonusChallengeAdoption:\s*null/);
  assert.match(source, /adaptiveInvasionApplied:\s*false/);
  assert.match(source, /acceptsLiveFollowerCount:\s*false/);
});

test("J8K authority contract has projection-bundle composition as its only positive authority", () => {
  assert.match(
    source,
    /ownsScoreAttackRuntimeProjectionBundleCompositionAuthority:\s*true/,
  );

  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual([...new Set(positiveMatches)], [
    "ownsScoreAttackRuntimeProjectionBundleCompositionAuthority",
  ]);
});
