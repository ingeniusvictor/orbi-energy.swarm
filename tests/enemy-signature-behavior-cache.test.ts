import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createEnemySignatureBehaviorCache,
} from "../src/game/enemySignatureBehaviorCache.ts";
import {
  projectEvolvedSignatureBehavior,
} from "../src/game/runtimeEnemySignatureBehavior.ts";
import {
  EnemyType,
  type Enemy,
} from "../src/game/types.ts";

const enemy = (
  id: string,
  signature?: Enemy["evolvedSignature"],
  intensity?: number,
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
  size: 8,
  color: "#fff",
  shootCooldown: 0,
  pulseCooldown: 0,
  contactDamageCooldown: 0,
  isDead: false,
  isBoss: false,
  flashTicks: 0,
  evolvedSignature: signature,
  evolvedSpecialIntensity: intensity,
});

test("same enemy identity projects signature behavior only once", () => {
  let projections = 0;
  const cache = createEnemySignatureBehaviorCache(
    (signature, intensity) => {
      projections += 1;
      return projectEvolvedSignatureBehavior(
        signature,
        intensity,
      );
    },
  );
  const evolved = enemy(
    "phase",
    "PHASE_LUNGE",
    0.4,
  );

  const first = cache.get(evolved);
  const second = cache.get(evolved);
  const third = cache.get(evolved);

  assert.equal(projections, 1);
  assert.equal(first, second);
  assert.equal(second, third);
  assert.deepEqual(
    first,
    projectEvolvedSignatureBehavior(
      "PHASE_LUNGE",
      0.4,
    ),
  );
});

test("different enemy identities remain independently cached", () => {
  let projections = 0;
  const cache = createEnemySignatureBehaviorCache(
    (signature, intensity) => {
      projections += 1;
      return projectEvolvedSignatureBehavior(
        signature,
        intensity,
      );
    },
  );

  const firstEnemy = enemy(
    "one",
    "LANCE_VOLLEY",
    0.3,
  );
  const secondEnemy = enemy(
    "two",
    "LANCE_VOLLEY",
    0.3,
  );

  const first = cache.get(firstEnemy);
  const second = cache.get(secondEnemy);

  assert.equal(projections, 2);
  assert.deepEqual(first, second);
  assert.notEqual(first, second);
});

test("neutral enemies retain the exact certified neutral projection", () => {
  const cache =
    createEnemySignatureBehaviorCache();
  const neutral = enemy("neutral");

  assert.deepEqual(
    cache.get(neutral),
    projectEvolvedSignatureBehavior(
      undefined,
      undefined,
    ),
  );
});

test("all evolved signatures retain certified behavior through the cache", () => {
  const cache =
    createEnemySignatureBehaviorCache();
  const cases = [
    ["ARMORED_MOMENTUM", 0.6],
    ["PHASE_LUNGE", 0.6],
    ["LANCE_VOLLEY", 0.6],
    ["BROOD_RELEASE", 0.6],
    ["NULL_PULSE", 0.6],
  ] as const;

  for (const [signature, intensity] of cases) {
    const subject = enemy(
      signature,
      signature,
      intensity,
    );
    assert.deepEqual(
      cache.get(subject),
      projectEvolvedSignatureBehavior(
        signature,
        intensity,
      ),
    );
  }
});

test("live runtime has no direct signature projector calls in hot gameplay paths", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.doesNotMatch(
    game,
    /projectEvolvedSignatureBehavior\(/,
  );

  const cacheReads =
    game.match(
      /enemySignatureBehaviorCacheRef\.current\.get\(enemy\)/g,
    ) ?? [];

  assert.equal(
    cacheReads.length,
    4,
    "AI, enemy shooting, pushback and Splitter release must share one per-enemy cache",
  );
});

test("evolved signature and intensity are assigned at spawn and never mutated later", () => {
  const game = readFileSync(
    new URL(
      "../src/game/EnergySwarmGame.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(
    game,
    /evolvedSignature:\s*evolvedProfile\?\.signature/,
  );
  assert.match(
    game,
    /evolvedSpecialIntensity:\s*[\s\S]*evolvedProfile\?\.specialIntensity/,
  );
  assert.doesNotMatch(
    game,
    /\.evolvedSignature\s*=|\.evolvedSpecialIntensity\s*=/,
  );
});
