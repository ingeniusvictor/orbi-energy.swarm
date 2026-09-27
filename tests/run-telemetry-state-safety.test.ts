import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const runPersistence = readFileSync(
  new URL("../src/game/runPersistence.ts", import.meta.url),
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
    /enemiesDestroyed:\s*runEnemiesDestroyedRef\.current/,
  );
  assert.match(
    game,
    /resourcesCollected:\s*runResourcesCollectedRef\.current/,
  );
  assert.match(
    runPersistence,
    /fresh\.totalEnemiesDestroyed \+[\s\S]*integerNonNegative\(input\.enemiesDestroyed\)/,
  );
  assert.match(
    runPersistence,
    /fresh\.totalResourcesCollected \+[\s\S]*integerNonNegative\(input\.resourcesCollected\)/,
  );
  assert.match(
    runPersistence,
    /commitTelemetry = !nextLedger\.telemetryCommitted/,
  );
});

test("result screen reads the completed run counter", () => {
  assert.match(
    game,
    /enemiesDestroyed=\{runEnemiesDestroyedRef\.current\}/,
  );
});
