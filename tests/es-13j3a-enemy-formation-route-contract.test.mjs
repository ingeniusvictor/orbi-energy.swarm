import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const ROUTE_SOURCE_PATH = "src/game/enemyFormationRoutes.ts";
const source = readFileSync(ROUTE_SOURCE_PATH, "utf8");

test("J3A route contract remains standalone and mode-agnostic", () => {
  assert.doesNotMatch(source, /^\s*import\s/m);
  assert.doesNotMatch(source, /\bCAMPAIGN\b|\bINFINITE\b/);
  assert.doesNotMatch(source, /formations\.ts|formationCycle|EnergySwarmGame/);

  assert.match(source, /"PINCER"/);
  assert.match(source, /"X_CROSS"/);
  assert.match(source, /"SERPENTINE"/);
  assert.match(source, /projectEnemyFormationRoute/);
});

test("J3A has no hidden time, randomness or side-effect authority", () => {
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
  ]) {
    assert.doesNotMatch(source, forbidden);
  }
});

test("J3A does not own entities, projectiles or global simulation budgets", () => {
  for (const forbidden of [
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
  ]) {
    assert.doesNotMatch(source, forbidden);
  }

  assert.match(source, /ENEMY_FORMATION_ROUTE_MAX_MEMBERS = 8/);
  assert.match(source, /ENEMY_FORMATION_ROUTE_EXTENT = 1\.25/);
});

test("J3A projection contract exposes bounded route, phase, role and telegraph metadata", () => {
  assert.match(source, /EnemyFormationRouteProjection/);
  assert.match(source, /EnemyFormationRoutePhase/);
  assert.match(source, /EnemyFormationMemberRole/);
  assert.match(source, /EnemyFormationTelegraphKind/);
  assert.match(source, /safeIntent/);
  assert.match(source, /position:/);
  assert.match(source, /progress:/);
  assert.match(source, /complete:/);
});
