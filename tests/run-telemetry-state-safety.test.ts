import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

test("run counters use dedicated refs instead of mutating persistent stats", () => {
  assert.match(game, /runEnemiesDestroyedRef = useRef<number>\(0\)/);
  assert.match(game, /runResourcesCollectedRef = useRef<number>\(0\)/);

  assert.doesNotMatch(game, /stats\.totalEnemiesDestroyed\s*[+]?=/);
  assert.doesNotMatch(game, /stats\.totalResourcesCollected\s*[+]?=/);
});

test("new runs reset telemetry refs explicitly", () => {
  assert.match(game, /runEnemiesDestroyedRef\.current = 0/);
  assert.match(game, /runResourcesCollectedRef\.current = 0/);
});

test("persistent totals accumulate from run-local counters exactly once", () => {
  assert.match(
    game,
    /totalEnemiesDestroyed:\s*fresh\.totalEnemiesDestroyed \+ runEnemiesDestroyedRef\.current/,
  );
  assert.match(
    game,
    /totalResourcesCollected:\s*fresh\.totalResourcesCollected \+ runResourcesCollectedRef\.current/,
  );
});

test("result screen reads the completed run counter", () => {
  assert.match(
    game,
    /enemiesDestroyed=\{runEnemiesDestroyedRef\.current\}/,
  );
});
