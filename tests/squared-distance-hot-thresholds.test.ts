import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const canvas = readFileSync(
  new URL("../src/game/EnergySwarmCanvas.tsx", import.meta.url),
  "utf8",
);

const section = (
  source: string,
  startMarker: string,
  endMarker: string,
) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(
    endMarker,
    start + startMarker.length,
  );
  assert.ok(start >= 0, `Missing start: ${startMarker}`);
  assert.ok(end > start, `Missing end: ${endMarker}`);
  return source.slice(start, end);
};

test("spawn safety uses the exact squared radius without sqrt", () => {
  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(spawn, /spawnDistanceSquared/);
  assert.match(
    spawn,
    /spawnSafetyRadius \* spawnSafetyRadius/,
  );
  assert.doesNotMatch(
    spawn,
    /distToPlayer = Math\.sqrt/,
  );
});

test("Devourer beam keeps the exact 25-unit hit radius as a squared comparison", () => {
  const attacks = section(
    game,
    "const executeBossAttackTicks =",
    "// --- ENGINE UPDATES",
  );

  assert.match(
    attacks,
    /distToBeamSquared < 25 \* 25/,
  );
  assert.doesNotMatch(
    attacks,
    /distToBeam = Math\.sqrt/,
  );
});

test("electrical storm keeps its exact configured strike radius with distance squared", () => {
  const physics = section(
    game,
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /distanceSquared <=[\s\S]*electricalStormConfig\.strikeRadius \*[\s\S]*electricalStormConfig\.strikeRadius/,
  );
});

test("enemy shooter tests the exact 320-unit range without normalizing distance", () => {
  const shoot = section(
    game,
    "const shootFromEnemy =",
    "// --- DETECT SINGLE-IMPACT COLLISION SWEEPS ---",
  );

  assert.match(
    shoot,
    /distanceSquared < 320 \* 320/,
  );
  assert.match(shoot, /Math\.atan2\(dy, dx\)/);
  assert.doesNotMatch(
    shoot,
    /const dist = Math\.sqrt\(dx \* dx \+ dy \* dy\)/,
  );
});

test("resource attraction defers sqrt until the exact pull radius has passed", () => {
  const physics = section(
    game,
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  const resourceStart = physics.indexOf(
    "resourcesRef.current.forEach",
  );
  assert.ok(resourceStart >= 0);
  const resourceLoop = physics.slice(resourceStart);

  assert.match(
    resourceLoop,
    /const distanceSquared = dx \* dx \+ dy \* dy/,
  );
  assert.match(
    resourceLoop,
    /const pullRadiusSquared =[\s\S]*pullRadius \* pullRadius/,
  );
  assert.match(
    resourceLoop,
    /distanceSquared > 0\.001 \* 0\.001 &&[\s\S]*distanceSquared < pullRadiusSquared[\s\S]*const distance = Math\.sqrt\(distanceSquared\)/,
  );
  assert.match(
    resourceLoop,
    /distanceSquared < 15 \* 15/,
  );
});

test("resource cleanup reuses the live array instead of allocating with filter", () => {
  assert.match(
    game,
    /compactArrayInPlace\([\s\S]{0,140}resourcesRef\.current,[\s\S]{0,140}!resource\.consumed && resource\.size > 0/,
  );
  assert.doesNotMatch(
    game,
    /resourcesRef\.current\s*=\s*resourcesRef\.current\.filter/,
  );
});

test("compact tactical radar uses one squared radius for allies enemies and resources", () => {
  const radar = section(
    game,
    "const drawTacticalMinimap =",
    "// --- TOUCH AND COORDINATE POINTER MAPS ---",
  );

  assert.match(
    radar,
    /const radiusWorldSquared =[\s\S]*radiusWorld \* radiusWorld/,
  );

  const squaredChecks =
    radar.match(
      /distanceSquared < radiusWorldSquared/g,
    ) ?? [];
  assert.equal(squaredChecks.length, 3);
});

test("pointer drag and click thresholds keep their exact 8px and 10px boundaries", () => {
  const pointers = section(
    game,
    "const handlePointerMove =",
    "// --- MOBILE / ANDROID HELD-DIRECTION INPUT ---",
  );

  assert.match(
    pointers,
    /distanceSquared > 8 \* 8/,
  );
  assert.match(
    pointers,
    /distanceSquared < 10 \* 10/,
  );
});

test("resource label renderer avoids sqrt for far pickups but preserves exact proximity opacity", () => {
  assert.match(
    canvas,
    /distanceSquared < 120 \* 120/,
  );
  assert.match(
    canvas,
    /else if \(closeVisible\)[\s\S]*const distance =[\s\S]*Math\.sqrt\(distanceSquared\)[\s\S]*\(120 - distance\) \/ 40/,
  );
});

test("movement normalization square roots remain present in live simulation", () => {
  assert.match(
    game,
    /const len = Math\.sqrt\(moveX \* moveX \+ moveY \* moveY\)/,
  );
  assert.match(
    game,
    /const distToLeader = Math\.sqrt\(dxToLeader \* dxToLeader \+ dyToLeader \* dyToLeader\)/,
  );
});
