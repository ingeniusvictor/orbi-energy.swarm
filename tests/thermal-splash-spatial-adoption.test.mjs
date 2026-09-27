import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

const start = game.indexOf(
  "// 2. Thermal Splash Area Damage application",
);
const end = game.indexOf(
  "// Cascading destruction check for splash-damaged targets",
  start,
);
assert.ok(start >= 0);
assert.ok(end > start);
const splash = game.slice(start, end + 800);

test("thermal splash keeps its historical radius and damage ratio", () => {
  assert.match(splash, /const splashRadius = 55/);
  assert.match(
    splash,
    /const splashDamage = damageToApply \* 0\.45/,
  );
});

test("thermal splash uses one certified all-collision traversal", () => {
  assert.match(
    splash,
    /findAllCollidingSpatialItems\([\s\S]*enemyCollisionIndex,[\s\S]*proj\.x,[\s\S]*proj\.y,[\s\S]*splashRadius/,
  );
});

test("thermal splash excludes the primary hit and already-dead targets", () => {
  assert.match(
    splash,
    /\(otherEnemy\) =>[\s\S]*otherEnemy !== enemy &&[\s\S]*!otherEnemy\.isDead/,
  );
});

test("thermal splash no longer builds query-filter-sort intermediate arrays", () => {
  assert.doesNotMatch(splash, /querySpatialIndex/);
  assert.doesNotMatch(splash, /\.filter\(/);
  assert.doesNotMatch(splash, /\.sort\(/);
});

test("thermal splash still iterates deterministic spatial entries for damage", () => {
  assert.match(
    splash,
    /splashCandidates\.forEach\(\(\{ item: otherEnemy \}\) =>/,
  );
  assert.match(
    splash,
    /otherEnemy\.health -= splashDamage/,
  );
  assert.match(
    splash,
    /otherEnemy\.flashTicks = 4/,
  );
});

test("obsolete raw spatial query import is removed from game runtime", () => {
  assert.doesNotMatch(
    game,
    /\bquerySpatialIndex\b/,
  );
});
