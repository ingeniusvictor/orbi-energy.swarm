import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/game/scoreAttackRunRecipe.ts", "utf8");
const j8aSource = readFileSync("src/game/scoreAttackModeContract.ts", "utf8");
const j8bSource = readFileSync(
  "src/game/scoreAttackExecutionSubstrateContract.ts",
  "utf8",
);
const j8cSource = readFileSync(
  "src/game/scoreAttackTimeboxProjection.ts",
  "utf8",
);
const infinitePlanSource = readFileSync("src/game/infinitePlanBuilder.ts", "utf8");
const storageSource = readFileSync("src/game/storage.ts", "utf8");
const persistenceSource = readFileSync("src/game/runPersistence.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const startScreen = readFileSync("src/components/StartScreen.tsx", "utf8");
const resultScreen = readFileSync("src/components/ResultScreen.tsx", "utf8");

test("J8G freezes one versioned deterministic Score Attack recipe", () => {
  assert.match(source, /SCORE_ATTACK_RUN_RECIPE_VERSION = 1 as const/);
  assert.match(
    source,
    /SCORE_ATTACK_CANONICAL_SEED = "orbi-score-attack-v1" as const/,
  );
  assert.match(source, /ScoreAttackSeedPolicy = "FIXED_VERSIONED"/);
  assert.match(
    source,
    /ScoreAttackRunContextPolicy = "NEUTRAL_INFINITE_CONTEXT"/,
  );
  assert.match(source, /selectsSeedPolicy:\s*true/);
  assert.match(source, /selectsRunContextPolicy:\s*true/);
  assert.match(source, /returnsProofSession:\s*false/);
  assert.match(source, /adoptsLiveSession:\s*false/);
  assert.match(source, /executesLiveMode:\s*false/);

  assert.match(j8aSource, /selectsSeedPolicy:\s*false/);
  assert.match(j8bSource, /constructsLiveSession:\s*false/);
  assert.match(j8bSource, /selectsSeedPolicy:\s*false/);
  assert.match(j8cSource, /SCORE_ATTACK_DURATION_MS = 60000 as const/);
  assert.match(j8cSource, /selectsSeedPolicy:\s*false/);
  assert.match(infinitePlanSource, /NEUTRAL_INFINITE_RUN_CONTEXT/);
});

test("J8G reuses existing Infinite construction only for internal compatibility proof", () => {
  assert.match(
    source,
    /createInfiniteSession\(\s*SCORE_ATTACK_CANONICAL_SEED,\s*SCORE_ATTACK_NEUTRAL_CONTEXT/,
  );
  assert.match(source, /resolveScoreAttackExecutionSubstrateCompatibility/);
  assert.match(source, /resolveScoreAttackTimeboxProjection/);
  assert.match(source, /proofSession/);
  assert.doesNotMatch(source, /return\s+proofSession/);
  assert.doesNotMatch(source, /advanceInfiniteSession|endInfiniteSession/);
});

test("J8G has no random, clock, persistence, runtime or UI adoption", () => {
  assert.doesNotMatch(source, /Math\.random|Date\.now|performance\.now/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|applyFinalRunCommit/);
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*(?:storage|runPersistence|EnergySwarmGame|StartScreen|ResultScreen)[^"']*["']/,
  );

  for (const [label, liveSource] of [
    ["storage", storageSource],
    ["runPersistence", persistenceSource],
    ["EnergySwarmGame", gameSource],
    ["StartScreen", startScreen],
    ["ResultScreen", resultScreen],
  ]) {
    assert.equal(
      liveSource.includes("scoreAttackRunRecipe"),
      false,
      `${label} must not import J8G`,
    );
  }
});

test("J8G authority contract has canonical recipe/seed policy as its only positive authority", () => {
  assert.match(
    source,
    /ownsCanonicalRunRecipeSeedPolicyAuthority:\s*true/,
  );

  const positiveMatches = [
    ...source.matchAll(/\b(owns[A-Za-z]+|may[A-Za-z]+):\s*true/g),
  ].map((match) => match[1]);

  assert.deepEqual([...new Set(positiveMatches)], [
    "ownsCanonicalRunRecipeSeedPolicyAuthority",
  ]);
});
