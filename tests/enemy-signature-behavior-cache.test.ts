import assert from "node:assert/strict";
import test from "node:test";

import {
  createEnemySignatureBehaviorCache,
  getCachedEvolvedSignatureBehavior,
} from "../src/game/enemySignatureBehaviorCache.ts";
import { projectEvolvedSignatureBehavior } from "../src/game/runtimeEnemySignatureBehavior.ts";
import {
  EnemyType,
  type Enemy,
} from "../src/game/types.ts";

const makeEnemy = (
  overrides: Partial<Enemy> = {},
): Enemy => ({
  id: "enemy-cache-test",
  type: EnemyType.DRONE,
  x: 100,
  y: 100,
  vx: 0,
  vy: 0,
  size: 16,
  speed: 1,
  health: 10,
  maxHealth: 10,
  color: "#fff",
  flashTicks: 0,
  contactDamage: 5,
  isDead: false,
  evolvedSignature: "LANCE_VOLLEY",
  evolvedSpecialIntensity: 0.4,
  ...overrides,
});

test("first cache access exactly matches the canonical projector", () => {
  const cache = createEnemySignatureBehaviorCache();
  const subject = makeEnemy();
  assert.deepEqual(
    getCachedEvolvedSignatureBehavior(cache, subject),
    projectEvolvedSignatureBehavior(
      subject.evolvedSignature,
      subject.evolvedSpecialIntensity,
    ),
  );
});

test("repeated access returns the same projected object reference", () => {
  const cache = createEnemySignatureBehaviorCache();
  const subject = makeEnemy();
  const first =
    getCachedEvolvedSignatureBehavior(cache, subject);
  const second =
    getCachedEvolvedSignatureBehavior(cache, subject);
  assert.equal(second, first);
});

test("different enemy identities never alias", () => {
  const cache = createEnemySignatureBehaviorCache();
  const first = getCachedEvolvedSignatureBehavior(
    cache,
    makeEnemy({ id: "enemy-a" }),
  );
  const second = getCachedEvolvedSignatureBehavior(
    cache,
    makeEnemy({ id: "enemy-b" }),
  );
  assert.notEqual(first, second);
  assert.deepEqual(first, second);
});

test("neutral enemies remain neutral through the cache", () => {
  const cache = createEnemySignatureBehaviorCache();
  const subject = makeEnemy({
    type: EnemyType.CRAWLER,
    evolvedSignature: undefined,
    evolvedSpecialIntensity: undefined,
  });
  const cached =
    getCachedEvolvedSignatureBehavior(cache, subject);

  assert.equal(cached.signature, null);
  assert.equal(cached.intensity, 0);
  assert.equal(cached.projectilePushbackMultiplier, 1);
  assert.equal(cached.droneVolleyProjectileCount, 1);
  assert.equal(cached.splitterExtraMinions, 0);
});

test("all evolved signature families preserve canonical behavior", () => {
  const cases = [
    ["ARMORED_MOMENTUM", 0.35],
    ["PHASE_LUNGE", 0.3],
    ["LANCE_VOLLEY", 0.4],
    ["BROOD_RELEASE", 0.5],
    ["NULL_PULSE", 0.45],
  ] as const;

  for (const [signature, intensity] of cases) {
    const cache = createEnemySignatureBehaviorCache();
    const subject = makeEnemy({
      evolvedSignature: signature,
      evolvedSpecialIntensity: intensity,
    });
    assert.deepEqual(
      getCachedEvolvedSignatureBehavior(cache, subject),
      projectEvolvedSignatureBehavior(
        signature,
        intensity,
      ),
    );
  }
});

test("fresh cache recomputes equivalent behavior from immutable spawn metadata", () => {
  const subject = makeEnemy();
  const first = getCachedEvolvedSignatureBehavior(
    createEnemySignatureBehaviorCache(),
    subject,
  );
  const second = getCachedEvolvedSignatureBehavior(
    createEnemySignatureBehaviorCache(),
    subject,
  );

  assert.notEqual(first, second);
  assert.deepEqual(first, second);
});
