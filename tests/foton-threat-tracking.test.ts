import assert from "node:assert/strict";
import test from "node:test";

import {
  FOTON_THREAT_MAX_RANGE,
  FOTON_THREAT_REFRESH_MS,
  projectFotonThreatDirection,
  selectFotonThreat,
} from "../src/game/fotonThreatTracking.ts";
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

test("threat tracking cadence stays low frequency", () => {
  assert.equal(FOTON_THREAT_REFRESH_MS, 160);
});

test("active boss has visual gaze priority over nearer regular enemies", () => {
  const regular = enemy("near", 50, 0);
  const boss = enemy("boss", 500, 0, {
    type: EnemyType.BOSS_DEVOURER,
    isBoss: true,
  });

  const threat = selectFotonThreat(
    [regular, boss],
    0,
    0,
    null,
  );

  assert.equal(threat?.id, "boss");
  assert.equal(threat?.isBoss, true);
});

test("nearest living enemy is selected inside bounded range", () => {
  const threat = selectFotonThreat(
    [
      enemy("far", 500, 0),
      enemy("near", 100, 0),
      enemy("dead", 20, 0, { isDead: true }),
    ],
    0,
    0,
    null,
  );

  assert.equal(threat?.id, "near");
});

test("current target is retained across small distance changes", () => {
  const threat = selectFotonThreat(
    [
      enemy("current", 115, 0),
      enemy("new", 100, 0),
    ],
    0,
    0,
    "current",
  );

  assert.equal(threat?.id, "current");
});

test("current target is replaced when another threat is clearly closer", () => {
  const threat = selectFotonThreat(
    [
      enemy("current", 300, 0),
      enemy("new", 100, 0),
    ],
    0,
    0,
    "current",
  );

  assert.equal(threat?.id, "new");
});

test("threats outside range do not control Foton gaze", () => {
  const threat = selectFotonThreat(
    [enemy("outside", FOTON_THREAT_MAX_RANGE + 20, 0)],
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
  assert.equal(direction.x, 0.6);
  assert.equal(direction.y, 0.8);
});

test("no threat produces a neutral gaze request", () => {
  assert.equal(
    projectFotonThreatDirection(0, 0, null),
    null,
  );
});
