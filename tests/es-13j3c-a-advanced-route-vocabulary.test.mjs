import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const routeSource = readFileSync("src/game/enemyFormationRoutes.ts", "utf8");
const liveDirectorSource = readFileSync("src/game/liveEnemyFormationDirector.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const playerFormationsSource = readFileSync("src/game/formations.ts", "utf8");

const routeCycleStart = liveDirectorSource.indexOf("const ROUTE_CYCLE");
const routeCycleEnd = liveDirectorSource.indexOf("];", routeCycleStart);
const liveRouteCycle = liveDirectorSource.slice(routeCycleStart, routeCycleEnd + 2);

test("J3C-A extends only the existing pure enemy route authority", () => {
  assert.doesNotMatch(routeSource, /^\s*import\s/m);
  assert.match(routeSource, /"PINCER"/);
  assert.match(routeSource, /"X_CROSS"/);
  assert.match(routeSource, /"SERPENTINE"/);
  assert.match(routeSource, /"WEDGE"/);
  assert.match(routeSource, /"ORBIT"/);
  assert.match(routeSource, /"SPIRAL"/);
  assert.match(routeSource, /projectEnemyFormationRoute/);
  assert.match(routeSource, /projectWedge/);
  assert.match(routeSource, /projectOrbit/);
  assert.match(routeSource, /projectSpiral/);
});

test("J3C-A preserves J3A bounded constants and caller-owned progress contract", () => {
  assert.match(routeSource, /ENEMY_FORMATION_ROUTE_MAX_MEMBERS = 8/);
  assert.match(routeSource, /ENEMY_FORMATION_ROUTE_EXTENT = 1\.25/);
  assert.match(routeSource, /ENEMY_FORMATION_ENTRY_END = 0\.2/);
  assert.match(routeSource, /ENEMY_FORMATION_PRESSURE_END = 0\.8/);
  assert.match(routeSource, /input\.progress/);
  assert.match(routeSource, /input\.mirror/);
});

test("J3C-A has no hidden time, randomness, rendering or side-effect authority", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /new Date/,
    /performance\.now/,
    /requestAnimationFrame/,
    /cancelAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /localStorage/,
    /sessionStorage/,
    /new Audio/,
    /AudioContext/,
    /fetch\s*\(/,
    /canvas/i,
    /react/i,
  ]) {
    assert.doesNotMatch(routeSource, forbidden);
  }
});

test("J3C-A does not own modes, entities, projectiles, score or simulation budgets", () => {
  for (const forbidden of [
    /\bCAMPAIGN\b/,
    /\bINFINITE\b/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /enemiesRef/,
    /projectilesRef/,
    /Enemy\[\]/,
    /Projectile\[\]/,
    /enemyBudget/,
    /projectileBudget/,
    /spawnInterval/,
    /maxConcurrentEnemies/,
    /score/i,
    /damage/i,
    /reward/i,
  ]) {
    assert.doesNotMatch(routeSource, forbidden);
  }
});

test("J3C-A deliberately does not adopt new routes into the J3B live cycle", () => {
  assert.notEqual(routeCycleStart, -1);
  assert.notEqual(routeCycleEnd, -1);
  assert.match(liveRouteCycle, /"PINCER"/);
  assert.match(liveRouteCycle, /"X_CROSS"/);
  assert.match(liveRouteCycle, /"SERPENTINE"/);
  assert.doesNotMatch(liveRouteCycle, /"WEDGE"|"ORBIT"|"SPIRAL"/);

  assert.doesNotMatch(gameSource, /WEDGE_ADVANCE|ROTATING_RING|SPIRAL_COMPRESSION/);
});

test("J3C-A keeps the player/FOTON formation authority separate", () => {
  assert.doesNotMatch(
    playerFormationsSource,
    /enemyFormation|EnemyFormation|PINCER|X_CROSS|SERPENTINE|WEDGE_ADVANCE|ROTATING_RING|SPIRAL_COMPRESSION/,
  );
  assert.doesNotMatch(routeSource, /formations\.ts|formationCycle|EnergySwarmGame/);
});

test("J3C-A exposes distinct tactical telegraph intents for all three advanced routes", () => {
  for (const token of [
    "WEDGE_ADVANCE",
    "CHOOSE_WEDGE_FLANK",
    "ROTATING_RING",
    "CHOOSE_RING_SIDE",
    "SPIRAL_COMPRESSION",
    "TIME_SPIRAL_GAP",
  ]) {
    assert.match(routeSource, new RegExp(`"${token}"`));
  }
});
