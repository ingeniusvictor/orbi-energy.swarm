import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

test("live game imports stable in-place compaction helper", () => {
  assert.match(
    game,
    /import \{ compactArrayInPlace \} from "\.\/arrayCompaction"/,
  );
});

test("floating text cleanup avoids per-frame filter allocation", () => {
  assert.match(
    game,
    /compactArrayInPlace\([\s\S]*floatingTextsRef\.current,[\s\S]*t\.life > 0/,
  );
  assert.doesNotMatch(
    game,
    /floatingTextsRef\.current\s*=\s*floatingTextsRef\.current\.filter/,
  );
});

test("normal enemy cleanup compacts in place with the same dead and world-bound predicates", () => {
  assert.match(
    game,
    /compactArrayInPlace\([\s\S]*enemiesRef\.current,[\s\S]*enemy\.isDead[\s\S]*enemy\.x < -200[\s\S]*enemy\.x > WORLD_WIDTH \+ 200[\s\S]*enemy\.y < -200[\s\S]*enemy\.y > WORLD_HEIGHT \+ 200/,
  );
});

test("projectile cleanup compacts in place with identical life and bounds semantics", () => {
  assert.match(
    game,
    /compactArrayInPlace\([\s\S]*projectilesRef\.current,[\s\S]*projectile\.life > 0[\s\S]*projectile\.x >= -50[\s\S]*projectile\.x <= WORLD_WIDTH \+ 50[\s\S]*projectile\.y >= -50[\s\S]*projectile\.y <= WORLD_HEIGHT \+ 50/,
  );
  assert.doesNotMatch(
    game,
    /projectilesRef\.current\s*=\s*projectilesRef\.current\.filter/,
  );
});

test("particle cleanup is allocation-free in both normal and cinematic paths", () => {
  const particleCompactions =
    game.match(
      /compactArrayInPlace\([\s\S]{0,120}particlesRef\.current/g,
    ) ?? [];

  assert.ok(particleCompactions.length >= 2);
  assert.doesNotMatch(
    game,
    /particlesRef\.current\s*=\s*particlesRef\.current\.filter/,
  );
});

test("boss defeat enemy cleanup also preserves the live array identity", () => {
  assert.match(
    game,
    /compactArrayInPlace\([\s\S]*enemiesRef\.current,[\s\S]*enemy\.isBoss/,
  );
});
