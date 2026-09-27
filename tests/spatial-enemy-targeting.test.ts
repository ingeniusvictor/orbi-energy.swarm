import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ENEMY_SPATIAL_CELL_SIZE,
  buildSpatialIndex,
  findNearestSpatialItem,
} from "../src/game/spatialIndex.ts";
import type { Enemy } from "../src/game/types.ts";
import { EnemyType } from "../src/game/types.ts";

const enemy = (
  id: string,
  x: number,
  y: number,
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
  size: 8,
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

const legacyNearest = (
  enemies: Enemy[],
  x: number,
  y: number,
  maxRange: number,
) => {
  let nearest: Enemy | null = null;
  let minDistanceSquared = Number.POSITIVE_INFINITY;

  for (const candidate of enemies) {
    if (candidate.isDead) continue;
    const dx = candidate.x - x;
    const dy = candidate.y - y;
    const distanceSquared = dx * dx + dy * dy;
    if (distanceSquared < minDistanceSquared) {
      minDistanceSquared = distanceSquared;
      nearest = candidate;
    }
  }

  return nearest &&
    minDistanceSquared < maxRange * maxRange
    ? nearest
    : null;
};

test("spatial nearest target matches legacy full scan across deterministic layouts", () => {
  const enemies = Array.from(
    { length: 80 },
    (_, index) => {
      const x = 45 + ((index * 173) % 1510);
      const y = 35 + ((index * 97) % 890);
      return enemy(
        `enemy-${index}`,
        x,
        y,
        index % 17 === 0,
      );
    },
  );
  const index = buildEnemyIndex(enemies);

  for (let query = 0; query < 120; query += 1) {
    const x = 20 + ((query * 137) % 1560);
    const y = 20 + ((query * 211) % 920);
    const maxRange = query % 2 === 0 ? 300 : 400;
    const expected = legacyNearest(
      enemies,
      x,
      y,
      maxRange,
    );
    const actual = findNearestSpatialItem(
      index,
      x,
      y,
      maxRange,
      (entry) => !entry.isDead,
    );

    assert.equal(
      actual.item?.id ?? null,
      expected?.id ?? null,
      `query ${query} must preserve legacy target selection`,
    );
  }
});

test("equal-distance ties preserve original enemy-array order", () => {
  const enemies = [
    enemy("first", 90, 100),
    enemy("second", 110, 100),
  ];
  const index = buildEnemyIndex(enemies);
  const result = findNearestSpatialItem(
    index,
    100,
    100,
    300,
  );

  assert.equal(result.item?.id, "first");
});

test("dead enemies remain ineligible", () => {
  const enemies = [
    enemy("dead-nearest", 101, 100, true),
    enemy("living", 120, 100),
  ];
  const result = findNearestSpatialItem(
    buildEnemyIndex(enemies),
    100,
    100,
    300,
  );

  assert.equal(result.item?.id, "living");
});

test("legacy strict weapon range excludes a target exactly on the boundary", () => {
  const enemies = [enemy("edge", 400, 100)];
  const result = findNearestSpatialItem(
    buildEnemyIndex(enemies),
    100,
    100,
    300,
  );

  assert.equal(result.item, null);
});

test("cell boundaries do not lose valid targets", () => {
  const cell = ENEMY_SPATIAL_CELL_SIZE;
  const enemies = [
    enemy("across-cell", cell + 1, cell + 1),
  ];
  const result = findNearestSpatialItem(
    buildEnemyIndex(enemies),
    cell - 1,
    cell - 1,
    10,
  );

  assert.equal(result.item?.id, "across-cell");
});

test("spatial query reduces candidate checks on dispersed max-density populations", () => {
  const enemies: Enemy[] = [];
  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 10; column += 1) {
      enemies.push(
        enemy(
          `grid-${row}-${column}`,
          60 + column * 160,
          55 + row * 120,
        ),
      );
    }
  }

  const result = findNearestSpatialItem(
    buildEnemyIndex(enemies),
    100,
    100,
    300,
  );

  assert.ok(result.item);
  assert.ok(
    result.candidateChecks < enemies.length / 2,
    `expected fewer than 40 checks, got ${result.candidateChecks}`,
  );
});

test("invalid range fails closed", () => {
  const index = buildEnemyIndex([
    enemy("candidate", 100, 100),
  ]);

  for (const range of [
    0,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ]) {
    const result = findNearestSpatialItem(
      index,
      100,
      100,
      range,
    );
    assert.equal(result.item, null);
    assert.equal(result.candidateChecks, 0);
  }
});

test("live swarm targeting uses one lazy spatial index and no full enemy scan", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  const shootStart = game.indexOf(
    "// --- SHOOT TRIGGER FROM SWARM FOLLOWER ---",
  );
  const shootEnd = game.indexOf(
    "// --- SHOOT AI TRIGGER FROM ENEMY DRONE ---",
    shootStart,
  );
  const shoot = game.slice(shootStart, shootEnd);

  assert.match(
    shoot,
    /enemyIndex: SpatialIndex<Enemy>/,
  );
  assert.match(shoot, /findNearestSpatialItem\(/);
  assert.match(shoot, /300[\s\S]*FormationType\.SHIELD[\s\S]*100/);
  assert.doesNotMatch(
    shoot,
    /enemiesRef\.current\.forEach/,
  );
  assert.doesNotMatch(
    shoot,
    /Math\.sqrt\(dx \* dx \+ dy \* dy\)/,
  );
  assert.match(
    shoot,
    /Math\.sqrt\(nearest\.distanceSquared\)/,
  );

  const passStart = game.indexOf(
    "// 4. Align and smooth swarm followers",
  );
  const passEnd = game.indexOf(
    "// 4.1. Spatial Grid Separation Pass",
    passStart,
  );
  const pass = game.slice(passStart, passEnd);

  assert.match(
    pass,
    /let targetingEnemyIndex: SpatialIndex<Enemy> \| null =\s*null/,
  );
  assert.match(
    pass,
    /targetingEnemyIndex \?\?= buildSpatialIndex\(/,
  );
  assert.match(
    pass,
    /shootFromSwarm\(member, targetingEnemyIndex\)/,
  );
});
