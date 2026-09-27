import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ENEMY_SPATIAL_CELL_SIZE,
  buildSpatialIndex,
  findAllCollidingSpatialItems,
} from "../src/game/spatialIndex.ts";
import {
  EnemyType,
  type Enemy,
} from "../src/game/types.ts";

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

const legacyContactIds = (
  enemies: Enemy[],
  x: number,
  y: number,
  playerRadius = 16,
) =>
  enemies
    .filter((candidate) => {
      if (candidate.isDead) return false;
      const dx = x - candidate.x;
      const dy = y - candidate.y;
      const radius = playerRadius + candidate.size;
      return dx * dx + dy * dy < radius * radius;
    })
    .map((candidate) => candidate.id);

test("ordered spatial contact set matches legacy full scan across dense queries", () => {
  const enemies = Array.from(
    { length: 180 },
    (_, index) =>
      enemy(
        `enemy-${index}`,
        20 + ((index * 173) % 1560),
        20 + ((index * 97) % 920),
        5 + (index % 15),
        index % 31 === 0,
      ),
  );
  const index = buildEnemyIndex(enemies);

  for (let query = 0; query < 150; query += 1) {
    const x = 16 + ((query * 127) % 1568);
    const y = 16 + ((query * 181) % 928);

    const spatialIds = findAllCollidingSpatialItems(
      index,
      x,
      y,
      16,
      (candidate) => !candidate.isDead,
    ).entries.map((entry) => entry.item.id);

    assert.deepEqual(
      spatialIds,
      legacyContactIds(enemies, x, y),
      `contact query ${query} must preserve legacy set and order`,
    );
  }
});

test("multi-collision query preserves strict edge semantics", () => {
  const exactEdge = enemy("edge", 124, 100, 8);
  const inside = enemy("inside", 123.99, 100, 8);
  const outside = enemy("outside", 124.01, 100, 8);
  const index = buildEnemyIndex([
    exactEdge,
    inside,
    outside,
  ]);

  const result = findAllCollidingSpatialItems(
    index,
    100,
    100,
    16,
  );

  assert.deepEqual(
    result.entries.map((entry) => entry.item.id),
    ["inside"],
  );
});

test("multi-collision query returns original array order, not bucket traversal order", () => {
  const enemies = [
    enemy("first", 130, 130, 20),
    enemy("second", 118, 118, 20),
    enemy("third", 125, 125, 20),
  ];
  const index = buildEnemyIndex(enemies);

  const result = findAllCollidingSpatialItems(
    index,
    120,
    120,
    16,
  );

  assert.deepEqual(
    result.entries.map((entry) => entry.item.id),
    ["first", "second", "third"],
  );
});

test("spatial contact candidate checks remain local in a large spread battlefield", () => {
  const enemies = Array.from(
    { length: 400 },
    (_, index) =>
      enemy(
        `enemy-${index}`,
        20 + ((index * 211) % 1560),
        20 + ((index * 379) % 920),
        8,
      ),
  );
  const index = buildEnemyIndex(enemies);

  const result = findAllCollidingSpatialItems(
    index,
    800,
    480,
    16,
  );

  assert.ok(
    result.candidateChecks < enemies.length / 4,
    `expected local query, got ${result.candidateChecks} checks for ${enemies.length} enemies`,
  );
});

test("invalid multi-collision queries fail closed", () => {
  const index = buildEnemyIndex([
    enemy("one", 100, 100),
  ]);

  for (const [x, y, radius] of [
    [Number.NaN, 100, 16],
    [100, Number.POSITIVE_INFINITY, 16],
    [100, 100, -1],
  ]) {
    const result = findAllCollidingSpatialItems(
      index,
      x,
      y,
      radius,
    );
    assert.deepEqual(result.entries, []);
    assert.equal(result.candidateChecks, 0);
  }
});

test("live player contact uses the spatial index rather than a full enemy sweep", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  const start = game.indexOf(
    "// 2. ENEMIES CONTACT DAMAGE vs PLAYER CORE",
  );
  const end = game.indexOf(
    "collisionEnemyIndexRef.current = null",
    start,
  );
  assert.ok(start >= 0 && end > start);
  const contact = game.slice(start, end);

  assert.match(
    contact,
    /findAllCollidingSpatialItems\([\s\S]*enemyCollisionIndex/,
  );
  assert.doesNotMatch(
    contact,
    /enemiesRef\.current\.forEach|Math\.sqrt/,
  );
  assert.match(
    contact,
    /playerContactCandidates\.forEach/,
  );
});

test("hostile projectile to player collision uses squared distance", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  const start = game.indexOf(
    "// Enemy projectiles vs Player core",
  );
  const end = game.indexOf(
    "// 2. ENEMIES CONTACT DAMAGE vs PLAYER CORE",
    start,
  );
  assert.ok(start >= 0 && end > start);
  const section = game.slice(start, end);

  assert.match(
    section,
    /dx \* dx \+ dy \* dy </,
  );
  assert.match(
    section,
    /playerProjectileCollisionRadius \*[\s\S]*playerProjectileCollisionRadius/,
  );
  assert.doesNotMatch(section, /Math\.sqrt/);
});

test("boss shield-node projectile collision uses squared distance", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  const start = game.indexOf(
    "// First check if hitting any Boss Shield Nodes",
  );
  const end = game.indexOf(
    "if (hitShieldNode) return;",
    start,
  );
  assert.ok(start >= 0 && end > start);
  const section = game.slice(start, end);

  assert.match(
    section,
    /shieldCollisionRadius = 14 \+ proj\.size/,
  );
  assert.match(
    section,
    /ndx \* ndx \+ ndy \* ndy </,
  );
  assert.doesNotMatch(section, /Math\.sqrt/);
});
