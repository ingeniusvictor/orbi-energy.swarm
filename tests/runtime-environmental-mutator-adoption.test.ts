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

test("EnergySwarmGame imports certified environmental-field helpers", () => {
  assert.match(
    game,
    /getReducedVisibilityOverlayProfile/,
  );
  assert.match(game, /getResourceFieldProfile/);
  assert.match(game, /runtimeEnvironmentalFields/);
});

test("MAGNETIC_DRIFT moves only active Infinite Swarm resources and clamps them to world bounds", () => {
  const physics = section(
    "// 9. Resources Magnet and Collection checks",
    "// 10. SINGLE-IMPACT COLLISION SWEEPS",
  );

  assert.match(
    physics,
    /const environmentalFieldActive =[\s\S]*waveActiveRef\.current &&[\s\S]*simulationDescriptor\.sourceMode === "INFINITE"/,
  );
  assert.match(
    physics,
    /fieldProfile\.driftXPerFrame/,
  );
  assert.match(
    physics,
    /fieldProfile\.driftYPerFrame/,
  );
  assert.match(physics, /WORLD_BOUNDS\.minX/);
  assert.match(physics, /WORLD_BOUNDS\.maxX/);
  assert.match(physics, /WORLD_BOUNDS\.minY/);
  assert.match(physics, /WORLD_BOUNDS\.maxY/);
  assert.doesNotMatch(
    physics,
    /playerPosRef\.current\.[xy] \+=.*drift/,
  );
});

test("UNSTABLE_RESOURCE_FIELDS modulates attraction but never reward value or pickup distance", () => {
  const physics = section(
    "// 9. Resources Magnet and Collection checks",
    "// 10. SINGLE-IMPACT COLLISION SWEEPS",
  );

  assert.match(
    physics,
    /fieldProfile\.attractionRadiusMultiplier/,
  );
  assert.match(
    physics,
    /fieldProfile\.attractionSpeedMultiplier/,
  );
  assert.match(physics, /if \(dist < 15\)/);

  const collect = section(
    "const triggerResourceCollect =",
    "// --- SHOOT TRIGGER FROM SWARM FOLLOWER ---",
  );
  assert.doesNotMatch(
    collect,
    /resourceFieldInstability/,
  );
  assert.doesNotMatch(
    collect,
    /getResourceFieldProfile/,
  );
});

test("resource attraction avoids divide-by-zero under environmental fields", () => {
  const physics = section(
    "// 9. Resources Magnet and Collection checks",
    "// 10. SINGLE-IMPACT COLLISION SWEEPS",
  );

  assert.match(
    physics,
    /dist > 0\.001 && dist < pullRadius/,
  );
});

test("REDUCED_VISIBILITY overlays only the battlefield during an active Infinite wave", () => {
  const render = section(
    "const renderCanvasScene =",
    "// --- TOUCH AND COORDINATE POINTER MAPS ---",
  );

  assert.match(
    render,
    /if \(waveActiveRef\.current\)/,
  );
  assert.match(
    render,
    /renderDescriptor\.sourceMode === "INFINITE"/,
  );
  assert.match(
    render,
    /getReducedVisibilityOverlayProfile/,
  );
  assert.match(render, /ctx\.createRadialGradient/);
  assert.match(
    render,
    /visibilityProfile\.innerRadius/,
  );
  assert.match(
    render,
    /visibilityProfile\.outerRadius/,
  );
});

test("tactical minimap is rendered after reduced-visibility overlay and stays readable", () => {
  const render = section(
    "const renderCanvasScene =",
    "// --- TOUCH AND COORDINATE POINTER MAPS ---",
  );

  const overlayIndex = render.indexOf(
    "getReducedVisibilityOverlayProfile",
  );
  const radarIndex = render.indexOf(
    "drawTacticalMinimap",
  );

  assert.ok(overlayIndex >= 0);
  assert.ok(radarIndex > overlayIndex);
});

test("campaign and Devourer rendering paths do not get explicit environmental overrides", () => {
  const boss = section(
    "const spawnBoss =",
    "const skipBossIntro =",
  );
  assert.doesNotMatch(
    boss,
    /runtimeEnvironmentalFields/,
  );
  assert.doesNotMatch(
    boss,
    /getResourceFieldProfile/,
  );
  assert.doesNotMatch(
    boss,
    /getReducedVisibilityOverlayProfile/,
  );
});
