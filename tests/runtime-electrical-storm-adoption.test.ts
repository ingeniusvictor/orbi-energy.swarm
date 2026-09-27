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

test("EnergySwarmGame adopts the certified electrical-storm scheduler", () => {
  assert.match(game, /createElectricalStormRuntimeState/);
  assert.match(game, /getElectricalStormConfig/);
  assert.match(game, /stepElectricalStormRuntime/);
  assert.match(game, /runtimeElectricalStorm/);
  assert.match(game, /electricalStormStateRef/);
});

test("new runs reset electrical storm state", () => {
  const start = section(
    "const startGame =",
    "// --- REBOOT GAME ON LOSS ---",
  );

  assert.match(
    start,
    /electricalStormStateRef\.current =[\s\S]*createElectricalStormRuntimeState\(\)/,
  );
});

test("storm scheduler is enabled only for active non-boss Infinite waves", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /waveActiveRef\.current &&[\s\S]*!bossActiveRef\.current &&[\s\S]*simulationDescriptor\.sourceMode === "INFINITE"[\s\S]*getElectricalStormConfig/,
  );
  assert.match(
    physics,
    /: null;[\s\S]*stepElectricalStormRuntime/,
  );
});

test("telegraph captures target feedback before any strike", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  const telegraphIndex = physics.indexOf(
    "electricalStormStep.telegraphStarted",
  );
  const strikeIndex = physics.indexOf(
    "electricalStormStep.strikeTriggered",
  );

  assert.ok(telegraphIndex >= 0);
  assert.ok(strikeIndex > telegraphIndex);
  assert.match(
    physics,
    /GRID STRIKE LOCK/,
  );
});

test("storm damage requires player to remain inside the locked visible radius", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /const distanceSquared = dx \* dx \+ dy \* dy/,
  );
  assert.match(
    physics,
    /distanceSquared <=[\s\S]*electricalStormConfig\.strikeRadius \*[\s\S]*electricalStormConfig\.strikeRadius/,
  );
  assert.match(
    physics,
    /electricalStormConfig\.baseDamage \*[\s\S]*simulationMutatorEffects[\s\S]*\.incomingDamageMultiplier/,
  );
  assert.match(physics, /damagePlayer\(/);
  assert.match(physics, /"DODGED"/);
});

test("storm strike reuses existing visual/audio feedback instead of bypassing the engine", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(physics, /playDisruptorPulseSound\(\)/);
  assert.match(physics, /ParticleType\.BIOME_PORTAL/);
  assert.match(
    physics,
    /screenShakeRef\.current = Math\.max/,
  );
});

test("electrical telegraph renders above reduced-visibility fog and before tactical radar", () => {
  const render = section(
    "const renderCanvasScene =",
    "// --- TOUCH AND COORDINATE POINTER MAPS ---",
  );

  const fogIndex = render.indexOf(
    "getReducedVisibilityOverlayProfile",
  );
  const stormIndex = render.indexOf(
    "stormState.phase === \"TELEGRAPH\"",
  );
  const radarIndex = render.indexOf(
    "drawTacticalMinimap",
  );

  assert.ok(fogIndex >= 0);
  assert.ok(stormIndex > fogIndex);
  assert.ok(radarIndex > stormIndex);
  assert.match(
    render,
    /electricalStormConfig|stormConfig/,
  );
  assert.match(render, /ctx\.setLineDash\(\[8, 6\]\)/);
});

test("campaign Devourer spawn remains outside storm scheduling", () => {
  const boss = section(
    "const spawnBoss =",
    "const skipBossIntro =",
  );

  assert.doesNotMatch(
    boss,
    /stepElectricalStormRuntime/,
  );
  assert.doesNotMatch(
    boss,
    /getElectricalStormConfig/,
  );
});
