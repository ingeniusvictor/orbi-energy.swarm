import assert from "node:assert/strict";
import test from "node:test";

import {
  FOTON_THREAT_MAX_RANGE,
  FOTON_THREAT_REFRESH_MS,
  projectFotonThreatDirection,
  selectFotonThreat,
} from "../src/game/fotonThreatTracking.ts";
import {
  buildSpatialIndex,
  ENEMY_SPATIAL_CELL_SIZE,
} from "../src/game/spatialIndex.ts";
import { EnemyType, type Enemy } from "../src/game/types.ts";

const enemy = (
  id: string,
  x: number,
  y: number,
  overrides: Partial<Enemy> = {},
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
  size: 10,
  color: "#fff",
  shootCooldown: 0,
  pulseCooldown: 0,
  contactDamageCooldown: 0,
  isDead: false,
  isBoss: false,
  flashTicks: 0,
  ...overrides,
});

const enemyIndex = (enemies: readonly Enemy[]) =>
  buildSpatialIndex(enemies, {
    cellSize: ENEMY_SPATIAL_CELL_SIZE,
    getX: (item) => item.x,
    getY: (item) => item.y,
    getRadius: (item) => item.size,
    include: (item) => !item.isDead,
  });

test("threat tracking cadence stays low frequency", () => {
  assert.equal(FOTON_THREAT_REFRESH_MS, 160);
});

test("active boss ref has visual gaze priority over nearer regular enemies", () => {
  const regular = enemy("near", 50, 0);
  const boss = enemy("boss", 500, 0, {
    type: EnemyType.BOSS_DEVOURER,
    isBoss: true,
  });

  const threat = selectFotonThreat(
    enemyIndex([regular, boss]),
    boss,
    0,
    0,
    null,
  );

  assert.equal(threat?.id, "boss");
  assert.equal(threat?.isBoss, true);
  assert.equal(threat?.enemy, boss);
});

test("nearest living enemy is selected from the spatial index inside bounded range", () => {
  const near = enemy("near", 100, 0);
  const threat = selectFotonThreat(
    enemyIndex([
      enemy("far", 500, 0),
      near,
      enemy("dead", 20, 0, { isDead: true }),
    ]),
    null,
    0,
    0,
    null,
  );

  assert.equal(threat?.id, "near");
  assert.equal(threat?.enemy, near);
});

test("current target object is retained across small distance changes", () => {
  const current = enemy("current", 115, 0);
  const next = enemy("new", 100, 0);
  const threat = selectFotonThreat(
    enemyIndex([current, next]),
    null,
    0,
    0,
    current,
  );

  assert.equal(threat?.id, "current");
  assert.equal(threat?.enemy, current);
});

test("current target is replaced when another indexed threat is clearly closer", () => {
  const current = enemy("current", 300, 0);
  const next = enemy("new", 100, 0);
  const threat = selectFotonThreat(
    enemyIndex([current, next]),
    null,
    0,
    0,
    current,
  );

  assert.equal(threat?.id, "new");
  assert.equal(threat?.enemy, next);
});

test("threats outside range do not control Foton gaze", () => {
  const threat = selectFotonThreat(
    enemyIndex([
      enemy("outside", FOTON_THREAT_MAX_RANGE + 20, 0),
    ]),
    null,
    0,
    0,
    null,
  );

  assert.equal(threat, null);
});

test("projected gaze direction is normalized", () => {
  const direction = projectFotonThreatDirection(
    0,
    0,
    {
      id: "enemy",
      x: 3,
      y: 4,
      isBoss: false,
    },
  );

  assert.ok(direction);
  assert.ok(Math.abs(direction.x - 0.6) < 1e-12);
  assert.ok(Math.abs(direction.y - 0.8) < 1e-12);
});

test("no threat produces a neutral gaze request", () => {
  assert.equal(
    projectFotonThreatDirection(0, 0, null),
    null,
  );
});
