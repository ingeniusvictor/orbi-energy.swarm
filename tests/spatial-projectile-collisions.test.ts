import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ENEMY_SPATIAL_CELL_SIZE,
  buildSpatialIndex,
  findFirstCollidingSpatialItem,
  insertSpatialIndexEntry,
  relocateSpatialIndexEntry,
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

const legacyFirstCollision = (
  enemies: Enemy[],
  x: number,
  y: number,
  projectileRadius: number,
) => {
  for (const candidate of enemies) {
    if (candidate.isDead) continue;
    const dx = x - candidate.x;
    const dy = y - candidate.y;
    const radius =
      candidate.size + projectileRadius;
    if (dx * dx + dy * dy < radius * radius) {
      return candidate;
    }
  }
  return null;
};

test("spatial first-hit lookup matches legacy array-order collision semantics", () => {
  const enemies = Array.from(
    { length: 80 },
    (_, index) =>
      enemy(
        `enemy-${index}`,
        30 + ((index * 151) % 1540),
        30 + ((index * 89) % 900),
        5 + (index % 12),
        index % 19 === 0,
      ),
  );
  const index = buildEnemyIndex(enemies);

  for (let query = 0; query < 180; query += 1) {
    const x = 10 + ((query * 113) % 1580);
    const y = 10 + ((query * 179) % 940);
    const projectileRadius = 2 + (query % 4);

    const expected = legacyFirstCollision(
      enemies,
      x,
      y,
      projectileRadius,
    );
    const actual = findFirstCollidingSpatialItem(
      index,
      x,
      y,
      projectileRadius,
      (entry) => !entry.isDead,
    );

    assert.equal(
      actual.item?.id ?? null,
      expected?.id ?? null,
      `query ${query} must preserve first-hit order`,
    );
  }
});

test("first colliding array entry wins even when a later target is closer", () => {
  const enemies = [
    enemy("first-in-array", 109, 100, 8),
    enemy("closer-but-later", 102, 100, 8),
  ];
  const result = findFirstCollidingSpatialItem(
    buildEnemyIndex(enemies),
    100,
    100,
    4,
  );

  assert.equal(
    result.item?.id,
    "first-in-array",
  );
  assert.equal(result.entry?.order, 0);
});

test("collision radius stays strict at the exact boundary", () => {
  const enemies = [enemy("edge", 112, 100, 8)];
  const result = findFirstCollidingSpatialItem(
    buildEnemyIndex(enemies),
    100,
    100,
    4,
  );

  assert.equal(result.item, null);
});

test("dead targets remain ineligible", () => {
  const enemies = [
    enemy("dead", 100, 100, 8, true),
    enemy("living", 103, 100, 8),
  ];
  const result = findFirstCollidingSpatialItem(
    buildEnemyIndex(enemies),
    100,
    100,
    4,
  );

  assert.equal(result.item?.id, "living");
});

test("relocation moves an indexed enemy immediately after pushback", () => {
  const target = enemy("pushback", 100, 100, 8);
  const index = buildEnemyIndex([target]);

  assert.equal(
    findFirstCollidingSpatialItem(
      index,
      100,
      100,
      3,
    ).item?.id,
    "pushback",
  );

  target.x = 500;
  target.y = 500;
  assert.equal(
    relocateSpatialIndexEntry(
      index,
      0,
      target.x,
      target.y,
      target.size,
    ),
    true,
  );

  assert.equal(
    findFirstCollidingSpatialItem(
      index,
      100,
      100,
      3,
    ).item,
    null,
  );
  assert.equal(
    findFirstCollidingSpatialItem(
      index,
      500,
      500,
      3,
    ).item?.id,
    "pushback",
  );
});

test("new Splitter minions can be inserted for later projectiles in the same sweep", () => {
  const parent = enemy("parent", 100, 100, 12);
  const index = buildEnemyIndex([parent]);
  const minion = enemy("minion", 420, 420, 7);

  insertSpatialIndexEntry(
    index,
    minion,
    1,
    minion.x,
    minion.y,
    minion.size,
  );

  const result = findFirstCollidingSpatialItem(
    index,
    420,
    420,
    3,
  );

  assert.equal(result.item?.id, "minion");
  assert.equal(result.entry?.order, 1);
});

test("dispersed max-density collision query checks only local candidates", () => {
  const enemies: Enemy[] = [];
  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 10; column += 1) {
      enemies.push(
        enemy(
          `grid-${row}-${column}`,
          60 + column * 160,
          55 + row * 120,
          10,
        ),
      );
    }
  }

  const result = findFirstCollidingSpatialItem(
    buildEnemyIndex(enemies),
    100,
    100,
    4,
  );

  assert.ok(
    result.candidateChecks < 10,
    `expected a local query, got ${result.candidateChecks} candidates`,
  );
});

test("live collision sweep builds one index and removes the O(P×E) loop", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const start = game.indexOf(
    "const detectAndResolveCollisions = () =>",
  );
  const end = game.indexOf(
    "// --- SPAWN SPLITTED ENEMY PARTS ---",
    start,
  );
  const collision = game.slice(start, end);

  assert.match(
    collision,
    /const enemyCollisionIndex = buildSpatialIndex\(/,
  );
  assert.match(
    collision,
    /findFirstCollidingSpatialItem\(/,
  );
  assert.doesNotMatch(
    collision,
    /for \(let i = 0; i < enemiesRef\.current\.length; i\+\+\)/,
  );
});

test("shield nodes retain priority over spatial enemy collision", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const projectileStart = game.indexOf(
    "// 1. PROJECTILES vs ENEMIES / PLAYER",
  );
  const shieldCheck = game.indexOf(
    "if (hitShieldNode) return;",
    projectileStart,
  );
  const enemyLookup = game.indexOf(
    "findFirstCollidingSpatialItem(",
    projectileStart,
  );

  assert.ok(shieldCheck >= 0);
  assert.ok(enemyLookup > shieldCheck);
});

test("live direct-hit pushback relocates the indexed target before later projectiles", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const push = game.indexOf(
    "enemy.x += Math.cos(projAngle) * pushFactor;",
  );
  const relocate = game.indexOf(
    "relocateSpatialIndexEntry(",
    push,
  );
  const hydro = game.indexOf(
    "// 1. Hydro Slow status effect",
    push,
  );

  assert.ok(push >= 0);
  assert.ok(relocate > push);
  assert.ok(hydro > relocate);
});

test("Splitter spawn inserts the new enemy into the active collision index", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const spawnStart = game.indexOf(
    "const spawnMinionSplit =",
  );
  const spawnEnd = game.indexOf(
    "const spawnSplitterMinions =",
    spawnStart,
  );
  const spawn = game.slice(spawnStart, spawnEnd);

  assert.match(spawn, /const minion: Enemy =/);
  assert.match(
    spawn,
    /enemiesRef\.current\.push\(minion\)/,
  );
  assert.match(
    spawn,
    /if \(collisionEnemyIndexRef\.current\)/,
  );
  assert.match(
    spawn,
    /insertSpatialIndexEntry\(/,
  );
});
