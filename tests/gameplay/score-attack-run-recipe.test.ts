import assert from "node:assert/strict";
import test from "node:test";

import { NEUTRAL_INFINITE_RUN_CONTEXT } from "../../src/game/infinitePlanBuilder";
import { createInfiniteSession } from "../../src/game/infiniteSession";
import { resolveScoreAttackExecutionSubstrateCompatibility } from "../../src/game/scoreAttackExecutionSubstrateContract";
import {
  SCORE_ATTACK_CANONICAL_SEED,
  SCORE_ATTACK_RUN_RECIPE_AUTHORITY_CONTRACT,
  SCORE_ATTACK_RUN_RECIPE_VERSION,
  resolveScoreAttackCanonicalRunRecipe,
} from "../../src/game/scoreAttackRunRecipe";
import { resolveScoreAttackTimeboxProjection } from "../../src/game/scoreAttackTimeboxProjection";

test("J8G projects one immutable versioned canonical Score Attack recipe", () => {
  const recipe = resolveScoreAttackCanonicalRunRecipe("SCORE_ATTACK");

  assert.ok(recipe);
  assert.equal(Object.isFrozen(recipe), true);
  assert.equal(Object.isFrozen(recipe.context), true);
  assert.equal(recipe.kind, "SCORE_ATTACK_CANONICAL_RUN_RECIPE");
  assert.equal(recipe.recipeMode, "RECIPE_ONLY");
  assert.equal(recipe.modeId, "SCORE_ATTACK");
  assert.equal(recipe.recipeVersion, SCORE_ATTACK_RUN_RECIPE_VERSION);
  assert.equal(recipe.recipeVersion, 1);
  assert.equal(recipe.seedPolicy, "FIXED_VERSIONED");
  assert.equal(recipe.seed, SCORE_ATTACK_CANONICAL_SEED);
  assert.equal(recipe.seed, "orbi-score-attack-v1");
  assert.equal(recipe.contextPolicy, "NEUTRAL_INFINITE_CONTEXT");
  assert.deepEqual(recipe.context, NEUTRAL_INFINITE_RUN_CONTEXT);
  assert.equal(recipe.executionSubstrate, "INFINITE_SESSION");
  assert.equal(recipe.runtimeProgressionCompatibility, "INFINITE");
  assert.deepEqual(recipe.canonicalFreshStart, {
    sector: 11,
    wave: 1,
    sectorsCompleted: 0,
    wavesCompleted: 0,
    status: "ACTIVE",
  });
  assert.equal(recipe.exactDurationMs, 60000);
  assert.equal(recipe.completionType, "TIMEBOX");
  assert.equal(recipe.selectsSeedPolicy, true);
  assert.equal(recipe.selectsRunContextPolicy, true);
  assert.equal(recipe.provesFreshSubstrateCompatibility, true);
  assert.equal(recipe.provesTimeboxCompatibility, true);
  assert.equal(recipe.returnsProofSession, false);
  assert.equal(recipe.adoptsLiveSession, false);
  assert.equal(recipe.executesLiveMode, false);
});

test("J8G recipe deterministically reproduces J8B/J8C-compatible fresh substrate facts", () => {
  const first = resolveScoreAttackCanonicalRunRecipe("SCORE_ATTACK");
  const second = resolveScoreAttackCanonicalRunRecipe("SCORE_ATTACK");

  assert.ok(first);
  assert.ok(second);
  assert.deepEqual(second, first);

  const proofSession = createInfiniteSession(first.seed, first.context);
  const substrate = resolveScoreAttackExecutionSubstrateCompatibility(
    first.modeId,
    proofSession,
  );
  assert.ok(substrate);
  assert.equal(substrate.executionSubstrate, first.executionSubstrate);
  assert.equal(
    substrate.runtimeProgressionCompatibility,
    first.runtimeProgressionCompatibility,
  );
  assert.deepEqual(substrate.canonicalFreshStart, first.canonicalFreshStart);

  const timebox = resolveScoreAttackTimeboxProjection(first.modeId, proofSession);
  assert.ok(timebox);
  assert.equal(timebox.exactDurationMs, first.exactDurationMs);
  assert.equal(timebox.completionProjection.type, first.completionType);
  assert.equal(timebox.completionProjection.durationMs, first.exactDurationMs);
});

test("J8G fails closed for unsupported mode identity", () => {
  assert.equal(resolveScoreAttackCanonicalRunRecipe("BOSS_RUSH"), null);
  assert.equal(resolveScoreAttackCanonicalRunRecipe("score_attack"), null);
  assert.equal(resolveScoreAttackCanonicalRunRecipe(" SCORE_ATTACK "), null);
});

test("J8G exposes no authority beyond canonical recipe/seed policy selection", () => {
  assert.equal(
    Object.isFrozen(SCORE_ATTACK_RUN_RECIPE_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    SCORE_ATTACK_RUN_RECIPE_AUTHORITY_CONTRACT,
  )
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  assert.deepEqual(positiveAuthorities, [
    "ownsCanonicalRunRecipeSeedPolicyAuthority",
  ]);

  for (const [key, value] of Object.entries(
    SCORE_ATTACK_RUN_RECIPE_AUTHORITY_CONTRACT,
  )) {
    if (key === "ownsCanonicalRunRecipeSeedPolicyAuthority") continue;
    assert.equal(value, false, `${key} must remain false`);
  }
});
