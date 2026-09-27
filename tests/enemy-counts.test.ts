import assert from "node:assert/strict";
import test from "node:test";

import {
  countActiveEvolvedEnemies,
  countLivingEnemies,
  countLivingStandardEnemies,
  countMinionsOfType,
} from "../src/game/enemyCounts.ts";
import { EnemyType, type Enemy } from "../src/game/types.ts";

const enemy = (
  id: string,
  overrides: Partial<Enemy> = {},
): Enemy => ({
  id,
  type: EnemyType.CRAWLER,
  x: 0,
  y: 0,
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

const enemies = [
  enemy("living"),
  enemy("dead", { isDead: true }),
  enemy("boss", {
    type: EnemyType.BOSS_DEVOURER,
    isBoss: true,
  }),
  enemy("evolved", {
    evolvedVariantId: "BULWARK_CRAWLER",
  }),
  enemy("dead-evolved", {
    isDead: true,
    evolvedVariantId: "PHASE_PARASITE",
  }),
  enemy("crawler-minion", {
    isMinion: true,
  }),
  enemy("drone-minion", {
    type: EnemyType.DRONE,
    isMinion: true,
  }),
];

test("living standard count preserves !dead && !boss semantics", () => {
  assert.equal(countLivingStandardEnemies(enemies), 4);
});

test("active evolved count preserves living non-boss evolved semantics", () => {
  assert.equal(countActiveEvolvedEnemies(enemies), 1);
});

test("minion count preserves enemy type and isMinion predicate", () => {
  assert.equal(
    countMinionsOfType(enemies, EnemyType.CRAWLER),
    1,
  );
  assert.equal(
    countMinionsOfType(enemies, EnemyType.DRONE),
    1,
  );
  assert.equal(
    countMinionsOfType(enemies, EnemyType.PARASITE),
    0,
  );
});

test("living count preserves !dead semantics including bosses", () => {
  assert.equal(countLivingEnemies(enemies), 5);
});

test("count helpers do not mutate source arrays or enemies", () => {
  const source = [...enemies];
  const snapshot = JSON.stringify(source);

  countLivingStandardEnemies(source);
  countActiveEvolvedEnemies(source);
  countMinionsOfType(source, EnemyType.CRAWLER);
  countLivingEnemies(source);

  assert.equal(JSON.stringify(source), snapshot);
  assert.deepEqual(source, enemies);
});
