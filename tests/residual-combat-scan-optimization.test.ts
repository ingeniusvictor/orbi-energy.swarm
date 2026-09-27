import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ENEMY_SPATIAL_CELL_SIZE,
  buildSpatialIndex,
  insertSpatialIndexEntry,
  querySpatialIndex,
} from "../src/game/spatialIndex.ts";
import { EnemyType, type Enemy } from "../src/game/types.ts";

const enemy = (
  id: string,
  x: number,
  y: number,
  size = 8,
  isDead = false,
): Enemy => ({
  id,
  type: EnemyType.CRAWLER,
  x,
  y,
  vx: 0,
  vy: 0,
  health: 10,
  maxHealth: 10,
  speed: 1,
  size,
  color: "#fff",
  shootCooldown: 0,
  pulseCooldown: 0,
  contactDamageCooldown: 0,
  isDead,
  isBoss: false,
  flashTicks: 0,
});

const buildEnemyIndex = (enemies: Enemy[]) =>
  buildSpatialIndex(enemies, {
    cellSize: ENEMY_SPATIAL_CELL_SIZE,
    getX: (entry) => entry.x,
    getY: (entry) => entry.y,
    getRadius: (entry) => entry.size,
    include: (entry) => !entry.isDead,
  });

const legacySplashIds = (
  enemies: Enemy[],
  primary: Enemy,
  x: number,
  y: number,
  splashRadius: number,
) =>
  enemies
    .filter((candidate) => {
      if (candidate === primary || candidate.isDead) {
        return false;
      }
      const dx = x - candidate.x;
      const dy = y - candidate.y;
      const radius = splashRadius + candidate.size;
      return dx * dx + dy * dy < radius * radius;
    })
    .map((candidate) => candidate.id);

const spatialSplashIds = (
  enemies: Enemy[],
  primary: Enemy,
  x: number,
  y: number,
  splashRadius: number,
) => {
  const index = buildEnemyIndex(enemies);

  return querySpatialIndex(
    index,
    x,
    y,
    splashRadius + index.maxRadius,
  ).entries
    .filter((entry) => {
      const candidate = entry.item;
      if (candidate === primary || candidate.isDead) {
        return false;
      }
      const dx = x - entry.x;
      const dy = y - entry.y;
      const radius = splashRadius + entry.radius;
      return dx * dx + dy * dy < radius * radius;
    })
    .sort((left, right) => left.order - right.order)
    .map((entry) => entry.item.id);
};

test("spatial thermal splash target set and order match legacy full scan", () => {
  const enemies = Array.from(
    { length: 80 },
    (_, index) =>
      enemy(
        `enemy-${index}`,
        30 + ((index * 157) % 1540),
        30 + ((index * 83) % 900),
        5 + (index % 14),
        index % 23 === 0,
      ),
  );
  const primary = enemies[11];
  primary.isDead = false;

  for (let query = 0; query < 100; query += 1) {
    const x = 20 + ((query * 127) % 1560);
    const y = 20 + ((query * 181) % 920);

    assert.deepEqual(
      spatialSplashIds(
        enemies,
        primary,
        x,
        y,
        55,
      ),
      legacySplashIds(
        enemies,
        primary,
        x,
        y,
        55,
      ),
      `thermal query ${query} must preserve target order`,
    );
  }
});

test("thermal splash keeps strict radius semantics", () => {
  const primary = enemy("primary", 100, 100, 10);
  const exactEdge = enemy("edge", 163, 100, 8);
  const inside = enemy("inside", 162.9, 100, 8);
  const enemies = [primary, exactEdge, inside];

  assert.deepEqual(
    spatialSplashIds(
      enemies,
      primary,
      100,
      100,
      55,
    ),
    ["inside"],
  );
});

test("a minion inserted after splash query is not retroactively part of that same snapshot", () => {
  const primary = enemy("primary", 100, 100, 10);
  const existing = enemy("existing", 110, 100, 8);
  const index = buildEnemyIndex([primary, existing]);

  const snapshot = querySpatialIndex(
    index,
    100,
    100,
    55 + index.maxRadius,
  ).entries;

  const minion = enemy("new-minion", 105, 100, 7);
  insertSpatialIndexEntry(
    index,
    minion,
    2,
    minion.x,
    minion.y,
    minion.size,
  );

  assert.equal(
    snapshot.some((entry) => entry.item === minion),
    false,
  );
  assert.equal(
    querySpatialIndex(
      index,
      100,
      100,
      55 + index.maxRadius,
    ).entries.some((entry) => entry.item === minion),
    true,
  );
});

test("live enemy firing counts hostile projectiles once before the enemy pass", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  const loopStart = game.indexOf(
    "// 6. Enemies logic & Shoot mechanics",
  );
  const loopEnd = game.indexOf(
    "// Filter out off-screen or dead enemies",
    loopStart,
  );
  const loop = game.slice(loopStart, loopEnd);

  assert.match(
    loop,
    /const hostileProjectileBudgetState = \{[\s\S]*count: 0/,
  );
  assert.match(
    loop,
    /for \(const projectile of projectilesRef\.current\)/,
  );
  assert.match(
    loop,
    /if \(!projectile\.fromPlayer\)[\s\S]*hostileProjectileBudgetState\.count \+= 1/,
  );
  assert.match(
    loop,
    /shootFromEnemy\([\s\S]*enemy,[\s\S]*hostileProjectileBudgetState/,
  );
});

test("shootFromEnemy no longer filters the projectile array per Drone and updates local count after emission", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const start = game.indexOf(
    "const shootFromEnemy =",
  );
  const end = game.indexOf(
    "const getEnemyScoreReward =",
    start,
  );
  const shoot = game.slice(start, end);

  assert.match(
    shoot,
    /hostileBudgetState: \{ count: number \}/,
  );
  assert.match(
    shoot,
    /const hostileProjectileCount =\s*hostileBudgetState\.count/,
  );
  assert.doesNotMatch(
    shoot,
    /projectilesRef\.current\.filter/,
  );
  assert.match(
    shoot,
    /MAX_PROJECTILES - projectilesRef\.current\.length/,
  );
  assert.match(
    shoot,
    /hostileProjectileBudget - hostileProjectileCount/,
  );
  assert.match(
    shoot,
    /hostileBudgetState\.count \+= projectileCount/,
  );
});

test("live thermal splash uses indexed candidates in original enemy order without sqrt", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const start = game.indexOf(
    '// 2. Thermal Splash Area Damage application',
  );
  const end = game.indexOf(
    '// Check destruction of the directly-hit enemy',
    start,
  );
  const thermal = game.slice(start, end);

  assert.match(
    thermal,
    /querySpatialIndex\([\s\S]*enemyCollisionIndex/,
  );
  assert.match(
    thermal,
    /\.sort\([\s\S]*left\.order - right\.order/,
  );
  assert.match(
    thermal,
    /sdx \* sdx \+ sdy \* sdy <[\s\S]*radius \* radius/,
  );
  assert.doesNotMatch(
    thermal,
    /enemiesRef\.current\.forEach/,
  );
  assert.doesNotMatch(
    thermal,
    /Math\.sqrt/,
  );
});
