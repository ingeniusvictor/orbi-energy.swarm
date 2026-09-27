import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

test("runtime enemy counts use allocation-free helpers", () => {
  for (const helper of [
    "countLivingStandardEnemies",
    "countActiveEvolvedEnemies",
    "countMinionsOfType",
    "countLivingEnemies",
  ]) {
    assert.ok(
      game.includes(helper),
      `Missing count helper: ${helper}`,
    );
  }
});

test("EnergySwarmGame no longer allocates arrays just to count enemy states", () => {
  assert.doesNotMatch(
    game,
    /enemiesRef\.current\.filter\([\s\S]{0,240}?\)\.length/,
  );
});

test("wave completion still excludes dead enemies and bosses through the dedicated helper", () => {
  const marker = "const livingEnemyCount =";
  const waveSectionStart = game.indexOf(
    "const handleWaveTransitions",
  );
  const markerIndex = game.indexOf(
    marker,
    waveSectionStart,
  );

  assert.ok(waveSectionStart >= 0);
  assert.ok(markerIndex > waveSectionStart);
  const snippet = game.slice(
    markerIndex,
    markerIndex + 220,
  );
  assert.match(
    snippet,
    /countLivingStandardEnemies\([\s\S]*enemiesRef\.current/,
  );
});

test("spawn evolution count stays based on live evolved non-boss enemies", () => {
  const spawnStart = game.indexOf(
    "const spawnEnemy =",
  );
  const snippet = game.slice(
    spawnStart,
    spawnStart + 4200,
  );
  assert.match(
    snippet,
    /countActiveEvolvedEnemies\([\s\S]*enemiesRef\.current/,
  );
});

test("boss summon and splitter caps use allocation-free runtime counts", () => {
  assert.match(
    game,
    /countMinionsOfType\([\s\S]*enemiesRef\.current,[\s\S]*rule\.enemyType/,
  );
  assert.match(
    game,
    /countLivingEnemies\([\s\S]*enemiesRef\.current/,
  );
});
