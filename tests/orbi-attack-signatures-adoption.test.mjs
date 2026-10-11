import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const game = read("src/game/EnergySwarmGame.tsx");
const canvas = read("src/game/EnergySwarmCanvas.tsx");
const types = read("src/game/types.ts");

test("swarm firing resolves canonical signature profiles", () => {
  assert.match(game, /getOrbiAttackProfile\(signature\)/);
  assert.match(game, /getFallbackAttackSignatureForAffinity\(affinity\)/);
  assert.match(game, /attackSignature: signature/);
  assert.match(game, /attackShape: profile\.shape/);
  assert.match(game, /profile\.cooldownFrames/);
});

test("quantum echoes remain globally bounded", () => {
  assert.match(game, /profile\.echoAngleRadians > 0/);
  assert.match(
    game,
    /projectilesRef\.current\.length >= MAX_PROJECTILES\) break/,
  );
});

test("magnetic grouping reuses the existing collision spatial index", () => {
  assert.match(game, /findAllCollidingSpatialItems\([\s\S]*enemyCollisionIndex/);
  assert.match(game, /relocateSpatialIndexEntry\([\s\S]*enemyCollisionIndex/);
  assert.doesNotMatch(
    game,
    /magneticPullRadius[\s\S]{0,1200}enemiesRef\.current\.(?:filter|map|find|sort)/,
  );
});

test("hydro slow thermal-atomic splash and H2NOVA support are profile driven", () => {
  assert.match(game, /proj\.slowDurationMs/);
  assert.match(game, /proj\.splashRadius/);
  assert.match(game, /proj\.splashDamageMultiplier/);
  assert.match(game, /profile\.supportShieldRestore/);
});

test("Canvas renders different projectile silhouettes instead of one recolored line", () => {
  for (const shape of [
    "RIPPLE",
    "CRESCENT",
    "PLASMA",
    "ARC",
    "PARTICLE",
    "KINETIC",
    "CELL",
    "PHASE",
    "SYNTHESIS",
    "LANCE",
  ]) {
    assert.match(canvas, new RegExp(`case \\\"${shape}\\\"`));
  }
  assert.match(canvas, /ctx\.ellipse\(/);
  assert.match(canvas, /ctx\.roundRect\(/);
  assert.match(canvas, /ctx\.lineTo\(/);
});

test("projectile contract carries attack behavior without touching enemy counts", () => {
  assert.match(types, /attackShape\?: OrbiAttackShape/);
  assert.match(types, /magneticPullRadius\?: number/);
  assert.match(types, /supportShieldRestore\?: number/);
  assert.doesNotMatch(types, /maxEnemies|enemyCountOverride/);
});
