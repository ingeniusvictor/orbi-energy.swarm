import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const game = read("src/game/EnergySwarmGame.tsx");
const start = read("src/components/StartScreen.tsx");
const hud = read("src/components/GameHud.tsx");
const result = read("src/components/ResultScreen.tsx");
const runtimeRouter = read("src/game/runtimeProgressionRouter.ts");

test("J8P exposes Score Attack as a secondary public choice while Campaign stays primary", () => {
  assert.match(start, /data-primary-start-cta="true"[\s\S]*onStartGame\(\)/);
  assert.match(start, /data-score-attack-start-cta="true"[\s\S]*onStartScoreAttack\(\)/);
  assert.match(start, /stats\.scoreAttackBestScore/);
  assert.match(start, /SCORE_ATTACK_DURATION_MS/);
});

test("public Score Attack delegates into frozen J8O and presentation identity stays scalar", () => {
  assert.match(game, /useState<ScoreAttackLiveEngineStartMode>\("CAMPAIGN"\)/);
  assert.match(game, /setPresentationMode\(mode\);[\s\S]*startGame\(\);/);
  assert.match(game, /onStartScoreAttack=\{\(\) => \{[\s\S]*startGameWithMode\("SCORE_ATTACK"\)/);
  assert.doesNotMatch(runtimeRouter, /SCORE_ATTACK/);
});

test("Score Attack restarts reuse the same J8O start path and menu exit clears presentation identity", () => {
  const restartMatches = game.match(/startGameWithMode\(presentationMode\)/g) ?? [];
  assert.ok(restartMatches.length >= 3);
  const menuResets = game.match(/setPresentationMode\("CAMPAIGN"\)/g) ?? [];
  assert.ok(menuResets.length >= 2);
});

test("HUD replaces Campaign objective vocabulary with Score Attack attribution without a second timer", () => {
  assert.match(hud, /presentationMode === "SCORE_ATTACK"/);
  assert.match(hud, /SCORE_ATTACK_DURATION_MS/);
  assert.match(hud, /SCORE ATTACK · \{scoreAttackDurationSeconds\}S TIMEBOX/);
  assert.match(hud, /const campaignObjective = scoreAttackActive[\s\S]*\? null[\s\S]*getCampaignObjective/);
  assert.doesNotMatch(hud, /setInterval|setTimeout|Date\.now|performance\.now/);
});

test("Score Attack result surface uses only the dedicated record and omits generic reward/archive semantics", () => {
  const branchStart = result.indexOf("if (isScoreAttack)");
  const genericStart = result.indexOf("\n  return (\n", branchStart + 1);
  assert.ok(branchStart >= 0);
  assert.ok(genericStart > branchStart);
  const scoreAttackBranch = result.slice(branchStart, genericStart);
  assert.match(scoreAttackBranch, /scoreAttackDisplayRecord/);
  assert.match(scoreAttackBranch, /dedicated Score Attack record/);
  assert.doesNotMatch(scoreAttackBranch, /highScore/);
  assert.doesNotMatch(scoreAttackBranch, /nanoCreditsGained/);
  assert.doesNotMatch(scoreAttackBranch, /recentRunArchive/);
  assert.doesNotMatch(scoreAttackBranch, /bestInfiniteSector/);
});
