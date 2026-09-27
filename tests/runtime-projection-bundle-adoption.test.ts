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
  const end = game.indexOf(
    endMarker,
    start + startMarker.length,
  );
  assert.ok(start >= 0, `Missing start marker: ${startMarker}`);
  assert.ok(end > start, `Missing end marker: ${endMarker}`);
  return game.slice(start, end);
};

test("live runtime imports and owns one runtime projection bundle cache", () => {
  assert.match(
    game,
    /createRuntimeProjectionBundleCache/,
  );
  assert.match(
    game,
    /getCachedRuntimeProjectionBundle/,
  );
  assert.match(
    game,
    /const runtimeProjectionBundleCacheRef =[\s\S]*useRef<RuntimeProjectionBundleCache>[\s\S]*createRuntimeProjectionBundleCache\(\)/,
  );
});

test("current descriptor pressure and mutator helpers all route through one cached bundle", () => {
  const helperStart = game.indexOf(
    "const getCurrentRuntimeProjection =",
  );
  const helperEnd = game.indexOf(
    "const isActiveBossRematch =",
    helperStart,
  );
  assert.ok(helperStart >= 0 && helperEnd > helperStart);
  const helpers = game.slice(helperStart, helperEnd);

  assert.match(
    helpers,
    /getCachedRuntimeProjectionBundle\([\s\S]*runtimeProjectionBundleCacheRef\.current,[\s\S]*runtimeProgressionRef\.current/,
  );
  assert.match(
    helpers,
    /getCurrentRuntimeProjection\(\)\.descriptor/,
  );
  assert.match(
    helpers,
    /getCurrentRuntimeProjection\(\)\.combatPressure/,
  );
  assert.match(
    helpers,
    /getCurrentRuntimeProjection\(\)\.mutatorEffects/,
  );
});

test("new run eagerly replaces the projection cache", () => {
  const start = section(
    "const startGame =",
    "// --- REBOOT GAME ON LOSS ---",
  );

  assert.match(
    start,
    /runtimeProjectionBundleCacheRef\.current =[\s\S]*createRuntimeProjectionBundleCache\(\)/,
  );
});

test("wave transitions reuse cached enemy budget and milestone projection", () => {
  const transitions = section(
    "const handleWaveTransitions =",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /const runtimeProjection =[\s\S]*getCurrentRuntimeProjection\(\)/,
  );
  assert.match(
    transitions,
    /runtimeProjection\.enemyBudget/,
  );
  assert.match(
    transitions,
    /runtimeProjection\.milestoneEncounter/,
  );
});

test("spawn path consumes one projection bundle instead of recomputing derived objects", () => {
  const spawn = section(
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(
    spawn,
    /const runtimeProjection =[\s\S]*getCurrentRuntimeProjection\(\)/,
  );
  for (const field of [
    "descriptor",
    "combatPressure",
    "mutatorEffects",
    "milestoneEncounter",
    "enemyBudget",
  ]) {
    assert.match(
      spawn,
      new RegExp(`runtimeProjection\\.${field}`),
    );
  }
});

test("simulation refetches projection after wave transitions may replace runtime state", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  const transitionIndex = physics.indexOf(
    "handleWaveTransitions(delta)",
  );
  const simulationLookupIndex = physics.indexOf(
    "const simulationRuntimeProjection =",
  );

  assert.ok(transitionIndex >= 0);
  assert.ok(
    simulationLookupIndex > transitionIndex,
    "simulation projection must be reacquired after transitions can replace runtime state",
  );
  assert.match(
    physics.slice(simulationLookupIndex),
    /simulationRuntimeProjection\.descriptor[\s\S]*simulationRuntimeProjection\.combatPressure[\s\S]*simulationRuntimeProjection\.mutatorEffects[\s\S]*simulationRuntimeProjection\.enemyBudget[\s\S]*simulationRuntimeProjection\.milestoneEncounter/,
  );
});

test("render visibility and storm paths reuse cached projections", () => {
  const render = section(
    "const renderCanvasScene =",
    "// --- CAMPAIGN VICTORY INFINITE HANDOFF ---",
  );

  assert.match(
    render,
    /const renderRuntimeProjection =[\s\S]*getCurrentRuntimeProjection\(\)/,
  );
  assert.match(
    render,
    /renderRuntimeProjection\.mutatorEffects/,
  );
  assert.match(
    render,
    /const stormRuntimeProjection =[\s\S]*getCurrentRuntimeProjection\(\)/,
  );
  assert.match(
    render,
    /stormRuntimeProjection\.mutatorEffects/,
  );
  assert.match(
    render,
    /stormRuntimeProjection\.combatPressure/,
  );
});

test("live game contains no direct derived projection calls after cache adoption", () => {
  for (const forbidden of [
    "resolveRuntimeWaveDescriptor(",
    "projectRuntimeCombatPressure(",
    "projectRuntimeMutatorEffects(",
    "getRuntimeMutatedEnemyBudget(",
    "projectInfiniteMilestoneEncounter(",
  ]) {
    assert.equal(
      game.includes(forbidden),
      false,
      `direct live projection remains: ${forbidden}`,
    );
  }
});
