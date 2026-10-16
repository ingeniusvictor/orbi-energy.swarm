import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/game/scoreAttackBootstrapEnvelope.ts", "utf8");
const routerSource = readFileSync("src/game/runtimeProgressionRouter.ts", "utf8");
const j8gSource = readFileSync("src/game/scoreAttackRunRecipe.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const startScreen = readFileSync("src/components/StartScreen.tsx", "utf8");
const resultScreen = readFileSync("src/components/ResultScreen.tsx", "utf8");
const storageSource = readFileSync("src/game/storage.ts", "utf8");
const persistenceSource = readFileSync("src/game/runPersistence.ts", "utf8");

test("J8H preserves SCORE_ATTACK outside the existing INFINITE runtime discriminator", () => {
  assert.match(source, /modeId:\s*"SCORE_ATTACK"/);
  assert.match(source, /runtimeProgressionCompatibility !== "INFINITE"/);
  assert.match(source, /runtimeProgression\.mode !== "INFINITE"/);
  assert.match(source, /preservesCanonicalModeIdentityOutsideRuntimeDiscriminator:\s*true/);
  assert.match(source, /addsRuntimeProgressionDiscriminator:\s*false/);

  assert.match(routerSource, /mode:\s*"CAMPAIGN"/);
  assert.match(routerSource, /mode:\s*"INFINITE"/);
  assert.doesNotMatch(routerSource, /SCORE_ATTACK/);
});

test("J8H delegates recipe, session, runtime and TIMEBOX authorities", () => {
  assert.match(source, /resolveScoreAttackCanonicalRunRecipe/);
  assert.match(source, /createInfiniteSession\(recipe\.seed, recipe\.context\)/);
  assert.match(source, /resolveScoreAttackExecutionSubstrateCompatibility/);
  assert.match(source, /resolveScoreAttackTimeboxProjection/);
  assert.match(source, /createInfiniteRuntimeState\(session\)/);
  assert.match(source, /SCORE_ATTACK_DURATION_MS/);
  assert.match(j8gSource, /SCORE_ATTACK_CANONICAL_SEED = "orbi-score-attack-v1"/);

  assert.doesNotMatch(
    source,
    /advanceInfiniteSession|advanceInfiniteRuntimeState|endInfiniteSession/,
  );
});

test("J8H remains disconnected from live React, persistence and timer adoption", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(?:EnergySwarmGame|StartScreen|ResultScreen|storage|runPersistence)[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /localStorage|sessionStorage|applyFinalRunCommit|Date\.now|performance\.now|Math\.random/,
  );

  for (const [label, liveSource] of [
    ["EnergySwarmGame", gameSource],
    ["StartScreen", startScreen],
    ["ResultScreen", resultScreen],
    ["storage", storageSource],
    ["runPersistence", persistenceSource],
  ]) {
    assert.equal(
      liveSource.includes("scoreAttackBootstrapEnvelope"),
      false,
      `${label} must not import J8H`,
    );
  }
});

test("J8H authority contract has bootstrap-envelope construction as its only positive authority", () => {
  assert.match(source, /ownsBootstrapEnvelopeConstructionAuthority:\s*true/);

  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual([...new Set(positiveMatches)], [
    "ownsBootstrapEnvelopeConstructionAuthority",
  ]);
});
