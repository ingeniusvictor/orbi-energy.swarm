import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("campaign guide preserves the six-stage learning arc through Sector 10", () => {
  const component = read("src/components/CampaignArc.tsx");

  for (const range of ["01–02", "03–04", "05–06", "07–08", "09", "10"]) {
    assert.match(component, new RegExp(range));
  }

  assert.match(component, /BLACKOUT DEVOURER/);
  assert.match(component, /master the swarm before endless mode/i);
  assert.match(component, /dominar el enjambre antes del modo infinito/i);
});

test("start screen surfaces the campaign arc without changing launch semantics", () => {
  const start = read("src/components/StartScreen.tsx");

  assert.match(start, /CampaignArc language=\{language\}/);
  assert.match(start, /onStartGame\(\)/);
  assert.match(start, /activateSync/);
});

test("campaign arc remains presentation-only", () => {
  const component = read("src/components/CampaignArc.tsx");

  assert.doesNotMatch(component, /enemyBudget|spawnInterval|difficultyMultiplier|maxConcurrentEnemies/);
  assert.doesNotMatch(component, /setStats|saveGameStats|onStartGame/);
});
