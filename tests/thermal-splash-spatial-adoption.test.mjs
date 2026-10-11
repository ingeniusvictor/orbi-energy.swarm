import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const profiles = readFileSync(
  new URL("../src/game/orbiAttackProfiles.ts", import.meta.url),
  "utf8",
);

const start = game.indexOf(
  "// TERMO, ATON and future GAIA synthesis attacks share one bounded",
);
const end = game.indexOf(
  "// Cascading destruction check for splash-damaged targets",
  start,
);
assert.ok(start >= 0);
assert.ok(end > start);
const splash = game.slice(start, end + 800);

test("TERMO splash keeps the certified 45-percent ratio while gaining profile-driven radius", () => {
  assert.match(
    profiles,
    /TERMO_BURST:[\s\S]*splashRadius: 58,[\s\S]*splashDamageMultiplier: 0\.45/,
  );
  assert.match(
    splash,
    /const splashRadius = proj\.splashRadius \?\? 0/,
  );
  assert.match(
    splash,
    /damageToApply \* \(proj\.splashDamageMultiplier \?\? 0\)/,
  );
});

test("profile-driven splash uses one certified all-collision traversal", () => {
  assert.match(
    splash,
    /findAllCollidingSpatialItems\([\s\S]*enemyCollisionIndex,[\s\S]*proj\.x,[\s\S]*proj\.y,[\s\S]*splashRadius/,
  );
});

test("splash excludes the primary hit and already-dead targets", () => {
  assert.match(
    splash,
    /\(otherEnemy\) =>[\s\S]*otherEnemy !== enemy &&[\s\S]*!otherEnemy\.isDead/,
  );
});

test("splash still avoids query-filter-sort intermediate arrays", () => {
  assert.doesNotMatch(splash, /querySpatialIndex/);
  assert.doesNotMatch(splash, /\.filter\(/);
  assert.doesNotMatch(splash, /\.sort\(/);
});

test("splash still iterates deterministic spatial entries for damage", () => {
  assert.match(
    splash,
    /splashCandidates\.forEach\(\(\{ item: otherEnemy \}\) =>/,
  );
  assert.match(splash, /otherEnemy\.health -= splashDamage/);
  assert.match(splash, /otherEnemy\.flashTicks = 4/);
});

test("obsolete raw spatial query import remains removed from game runtime", () => {
  assert.doesNotMatch(game, /\bquerySpatialIndex\b/);
});
