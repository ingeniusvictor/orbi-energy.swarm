import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getAdditionalGameModeProfile } from "../../src/game/scoreAttackModeContract";
import { SCORE_ATTACK_DURATION_MS } from "../../src/game/scoreAttackTimeboxProjection";

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("J8P presents the frozen J8A identity and J8C duration without redefining them", () => {
  const profile = getAdditionalGameModeProfile("SCORE_ATTACK");
  assert.ok(profile);
  assert.equal(profile.displayName, "Score Attack");
  assert.equal(profile.objective, "MAXIMIZE_EXISTING_RUN_SCORE");
  assert.equal(SCORE_ATTACK_DURATION_MS, 60000);
});

test("J8P presentation surfaces do not introduce timer or clock APIs", () => {
  const presentation = [
    read("src/components/StartScreen.tsx"),
    read("src/components/GameHud.tsx"),
    read("src/components/ResultScreen.tsx"),
  ].join("\n");

  assert.doesNotMatch(
    presentation,
    /setInterval|setTimeout|requestAnimationFrame|Date\.now|performance\.now/,
  );
});

test("Score Attack remains outside RuntimeProgressionState and generic persistence authority", () => {
  const runtimeRouter = read("src/game/runtimeProgressionRouter.ts");
  const storage = read("src/game/storage.ts");
  assert.doesNotMatch(runtimeRouter, /SCORE_ATTACK/);
  assert.match(storage, /scoreAttackBestScore/);
  assert.match(storage, /highScore/);
});
