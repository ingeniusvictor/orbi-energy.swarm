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

test("campaign runtime imports the unified certified descriptor router", () => {
  assert.match(
    game,
    /resolveRuntimeWaveDescriptor[\\s\\S]*runtimeProgressionRouter/,
  );
  assert.match(game, /createCampaignRuntimeState/);
  assert.doesNotMatch(game, /createCampaignRuntimeWaveDescriptor/);
});

test("regular enemy spawning no longer reads WaveConfig directly", () => {
  const spawnEnemy = section(
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.doesNotMatch(spawnEnemy, /getWaveConfig\(/);
  assert.match(
    spawnEnemy,
    /descriptor\.spawn\.maxConcurrentEnemies/,
  );
  assert.match(
    spawnEnemy,
    /descriptor\.spawn\.enemyComposition/,
  );
  assert.match(
    spawnEnemy,
    /descriptor\.pressure\.legacyDifficultyMultiplier/,
  );
  assert.match(
    spawnEnemy,
    /descriptor\.spawn\.eliteChance/,
  );
  assert.match(spawnEnemy, /descriptor\.modifiers\.includes/);
});

test("wave spawn cadence and budget are descriptor-backed", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /simulationDescriptor\.spawn\.spawnIntervalFrames/,
  );
  assert.match(
    physics,
    /simulationDescriptor\.spawn\.enemyBudget/,
  );
  assert.doesNotMatch(
    physics,
    /const cfg = getWaveConfig\(currentWaveRef\.current\)/,
  );
});

test("campaign wave activation uses descriptor metadata and boss policy", () => {
  const transitions = section(
    "const handleWaveTransitions =",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /getCurrentRuntimeDescriptor\(\)/,
  );
  assert.match(
    transitions,
    /descriptor\.completionPolicy\.type === "TIMEBOX"/,
  );
  assert.match(
    transitions,
    /descriptor\.completionPolicy\.type === "BOSS_DEFEAT"/,
  );
  assert.match(
    transitions,
    /descriptor\.modifiers\.includes\("BLACKOUT_HAZARD_ZONES"\)/,
  );

  // WaveConfig remains only for the existing WaveIntro component contract.
  assert.match(
    transitions,
    /getWaveConfig\(currentWaveRef\.current\); \/\/ presentation-only WaveIntro contract/,
  );
});

test("CORE_DROP_BOOST reads the runtime descriptor in both kill paths", () => {
  const matches = game.match(
    /currentWaveDescriptor\.modifiers\.includes\("CORE_DROP_BOOST"\)/g,
  );

  assert.equal(matches?.length, 2);
  assert.doesNotMatch(
    game,
    /currentWaveCfg\.environmentalModifier === "CORE_DROP_BOOST"/,
  );
});
