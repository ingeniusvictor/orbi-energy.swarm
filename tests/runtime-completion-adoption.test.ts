import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

const section = (
  startMarker: string,
  endMarker: string,
) => {
  const start = game.indexOf(startMarker);
  const end = game.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0, `Missing start marker: ${startMarker}`);
  assert.ok(end > start, `Missing end marker: ${endMarker}`);
  return game.slice(start, end);
};

test("EnergySwarmGame imports the certified runtime completion evaluator", () => {
  assert.match(game, /isRuntimeWaveComplete/);
  assert.match(game, /shouldTickRuntimeTimer/);
  assert.match(game, /runtimeCompletionPolicy/);
});

test("wave transitions tick time only through the completion policy contract", () => {
  const transitions = section(
    "const handleWaveTransitions =",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /if \(shouldTickRuntimeTimer\(descriptor\)\)[\s\S]*waveTimeRemainingRef\.current -= delta/,
  );
  assert.match(
    transitions,
    /isRuntimeWaveComplete\([\s\S]*completionDescriptor,[\s\S]*remainingTimeMs:[\s\S]*spawnedEnemyCount:[\s\S]*livingEnemyCount,?[\s\S]*bossDefeated: false/,
  );
  assert.doesNotMatch(
    transitions,
    /if \(waveTimeRemainingRef\.current <= 0\)/,
  );
});

test("runtime completion snapshot excludes dead enemies and the campaign boss", () => {
  const transitions = section(
    "const handleWaveTransitions =",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /!enemy\.isDead && !enemy\.isBoss/,
  );
  assert.match(
    transitions,
    /spawnedEnemyCount: waveBudgetSpawnedRef\.current/,
  );
});

test("WaveConfig presentation lookup is guarded to campaign mode", () => {
  const transitions = section(
    "const handleWaveTransitions =",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /descriptor\.sourceMode === "CAMPAIGN"[\s\S]*getWaveConfig\(currentWaveRef\.current\)[\s\S]*: null/,
  );
});

test("Devourer victory now hands off after the existing cinematic", () => {
  const block = section(
    "const updateBossDefeatSequence",
    "// --- ENGINE UPDATES",
  );

  assert.match(block, /enterInfiniteAfterCampaignVictory\(\)/);
  assert.doesNotMatch(block, /triggerGameOver\(true\)/);
});
