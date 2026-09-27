import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  CAMPAIGN_GUIDE_STAGES,
  getCampaignGuideStage,
  getCampaignObjective,
} from "../src/game/campaignGuide.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("campaign guide preserves the six-stage learning arc through Sector 10", () => {
  assert.deepEqual(
    CAMPAIGN_GUIDE_STAGES.map((stage) => stage.rangeLabel),
    ["01–02", "03–04", "05–06", "07–08", "09", "10"],
  );
  assert.equal(CAMPAIGN_GUIDE_STAGES.length, 6);
  assert.equal(getCampaignGuideStage(10)?.id, "blackout-devourer");
  assert.equal(getCampaignGuideStage(10)?.boss, true);
  assert.equal(getCampaignGuideStage(11), undefined);
});

test("campaign guide exposes bilingual contextual objectives", () => {
  assert.match(getCampaignObjective(1, "es") ?? "", /Muévete/);
  assert.match(getCampaignObjective(3, "en") ?? "", /formation/i);
  assert.match(getCampaignObjective(10, "es") ?? "", /telegraphs/i);
  assert.match(getCampaignObjective(10, "en") ?? "", /shield nodes/i);
  assert.equal(getCampaignObjective(11, "en"), null);
});

test("start screen surfaces the campaign arc without changing launch semantics", () => {
  const start = read("src/components/StartScreen.tsx");

  assert.match(start, /CampaignArc language=\{language\}/);
  assert.match(start, /onStartGame\(\)/);
  assert.match(start, /activateSync/);
});

test("HUD reads objectives from the canonical campaign guide", () => {
  const hud = read("src/components/GameHud.tsx");
  assert.match(hud, /getCampaignObjective/);
  assert.match(hud, /orbi-hud-objective/);
  assert.match(hud, /OBJECTIVE/);
  assert.match(hud, /OBJETIVO/);
});

test("campaign guide remains presentation-only", () => {
  const guide = read("src/game/campaignGuide.ts");

  assert.doesNotMatch(guide, /enemyBudget|spawnInterval|difficultyMultiplier|maxConcurrentEnemies/);
  assert.doesNotMatch(guide, /setStats|saveGameStats|onStartGame/);
});
