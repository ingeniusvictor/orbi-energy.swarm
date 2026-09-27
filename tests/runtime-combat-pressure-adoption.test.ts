import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);

const section = (
  startMarker: string,
  endMarker: string,
) => {
  const start = game.indexOf(startMarker);
  const end = game.indexOf(
    endMarker,
    start + startMarker.length,
  );
  assert.ok(start >= 0, `Missing start marker: ${startMarker}`);
  assert.ok(end > start, `Missing end marker: ${endMarker}`);
  return game.slice(start, end);
};

test("live runtime imports the certified combat-pressure projection", () => {
  assert.match(game, /projectRuntimeCombatPressure/);
  assert.match(game, /runtimeCombatPressure/);
  assert.match(game, /getCurrentCombatPressure/);
});

test("regular enemy spawn adopts projected health and movement without direct pressure math", () => {
  const spawn = section(
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(
    spawn,
    /projectRuntimeCombatPressure\(descriptor\)/,
  );
  assert.match(
    spawn,
    /combatPressure\.enemyHealthMultiplier/,
  );
  assert.match(
    spawn,
    /combatPressure\.enemyMovementSpeedMultiplier/,
  );
  assert.match(spawn, /15 \* healthMultiplier/);
  assert.match(
    spawn,
    /biomeCfg\.enemySpeedMultiplier \* movementSpeedMultiplier/,
  );
  assert.doesNotMatch(
    spawn,
    /descriptor\.pressure\.statMultiplier/,
  );
  assert.doesNotMatch(
    spawn,
    /descriptor\.pressure\.aggressionMultiplier/,
  );
});

test("spawn safety adopts fairness without weakening the legacy 150-unit floor", () => {
  const spawn = section(
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(
    spawn,
    /Math\.max\([\s\S]*150,[\s\S]*combatPressure\.spawnSafetyRadius/,
  );
  assert.match(
    spawn,
    /Math\.max\([\s\S]*300,[\s\S]*spawnSafetyRadius \* 2/,
  );
});

test("hostile projectile creation obeys the projected fairness budget", () => {
  const shoot = section(
    "const shootFromEnemy =",
    "// --- DETECT SINGLE-IMPACT COLLISION SWEEPS ---",
  );

  assert.match(
    shoot,
    /hostileProjectileCount/,
  );
  assert.match(
    shoot,
    /combatPressure\.projectileBudget \?\? MAX_PROJECTILES/,
  );
  assert.match(
    shoot,
    /hostileProjectileCount >= hostileProjectileBudget/,
  );
});

test("non-boss contact damage uses projected pressure while Devourer damage remains untouched", () => {
  const collisions = section(
    "const detectAndResolveCollisions =",
    "// --- SPAWN SPLITTED ENEMY PARTS ---",
  );

  assert.match(
    collisions,
    /baseDamage \*[\s\S]*combatPressure\.contactDamageMultiplier/,
  );
  assert.match(
    collisions,
    /damagePlayerFromBoss\(baseDamage, attackType\)/,
  );
});

test("split minions scale only after the runtime enters Infinite Swarm", () => {
  const split = section(
    "const spawnMinionSplit =",
    "// --- DAMAGE PLAYER FROM BOSS SPECIFIC TELEMETRY ---",
  );

  assert.match(
    split,
    /combatPressure\.sourceMode === "INFINITE"/,
  );
  assert.match(
    split,
    /health: 12 \* splitHealthMultiplier/,
  );
  assert.match(
    split,
    /speed: 1\.1 \* splitSpeedMultiplier/,
  );
});

test("enemy attack timer consumes projected attack-rate pressure", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /simulationCombatPressure\.enemyAttackRateMultiplier/,
  );
  assert.match(
    physics,
    /enemy\.shootCooldown -=[\s\S]*simulationCombatPressure\.enemyAttackRateMultiplier/,
  );
});

test("Nano pickup value adopts infinite reward pressure while retaining the existing biome multiplier", () => {
  const collect = section(
    "const triggerResourceCollect =",
    "// --- SHOOT TRIGGER FROM SWARM FOLLOWER ---",
  );

  assert.match(
    collect,
    /getCurrentCombatPressure\(\)/,
  );
  assert.match(
    collect,
    /getBiomeConfig\(activeBiome\)\.crystalValueMultiplier/,
  );
  assert.match(
    collect,
    /combatPressure\.resourceValueMultiplier/,
  );
  assert.match(
    collect,
    /runNanoCreditsEarnedRef\.current \+= val/,
  );
});

test("boss runtime is excluded from the new pressure-scaling paths", () => {
  const spawnBoss = section(
    "const spawnBoss =",
    "const skipBossIntro =",
  );

  assert.doesNotMatch(
    spawnBoss,
    /projectRuntimeCombatPressure/,
  );
  assert.match(
    spawnBoss,
    /BLACKOUT_DEVOURER_CANON\.maxHealth \*[\s\S]*\(rematchProfile\?\.healthMultiplier \?\? 1\)/,
  );
  assert.doesNotMatch(
    spawnBoss,
    /projectRuntimeCombatPressure/,
  );
});
