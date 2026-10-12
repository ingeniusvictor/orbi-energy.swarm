import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const eclipse = readFileSync(
  new URL("../src/game/runtimeEclipse.ts", import.meta.url),
  "utf8",
);

test("runtime adopts the pure Eclipse helpers at the existing hot-path seams", () => {
  assert.match(
    game,
    /getEclipseSolarCooldownRecoveryMultiplier\(\s*frameMutatorEffects,\s*member\.affinity,?\s*\)/s,
  );
  assert.match(
    game,
    /getEclipseEnemyMovementMultiplier\(\s*simulationMutatorEffects,\s*enemy\.type,?\s*\)/s,
  );
  assert.match(game, /enemy\.type === EnemyType\.PARASITE/);
  assert.match(game, /getReducedVisibilityOverlayProfile/);
});

test("Eclipse extends H6 instead of creating a parallel event scheduler or renderer", () => {
  assert.match(eclipse, /activeMutators\.includes\("REDUCED_VISIBILITY"\)/);
  assert.doesNotMatch(game, /eclipseTimerRef/);
  assert.doesNotMatch(game, /createEclipseRuntimeState/);
  assert.doesNotMatch(game, /setInterval\([^)]*ECLIPSE/i);
  assert.doesNotMatch(game, /drawEclipseOverlay/);
});

test("Eclipse pressure stays affinity/type scoped instead of mutating global speed authority", () => {
  assert.match(eclipse, /affinity === "solar"/);
  assert.match(eclipse, /enemyType === EnemyType\.PARASITE/);
  assert.doesNotMatch(eclipse, /enemySpeedMultiplier\s*=/);
});
