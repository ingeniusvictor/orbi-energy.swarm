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

test("EnergySwarmGame imports certified mutator projection and effective budget", () => {
  assert.match(game, /projectRuntimeMutatorEffects/);
  assert.match(game, /getRuntimeMutatedEnemyBudget/);
  assert.match(game, /runtimeMutatorEffects/);
});

test("DOUBLE_THREAT completion and spawning share one effective enemy budget", () => {
  const transitions = section(
    "const handleWaveTransitions",
    "// --- SPAWN REGULAR ENEMY ---",
  );

  assert.match(
    transitions,
    /const effectiveEnemyBudget =\s*getRuntimeMutatedEnemyBudget\(descriptor\)/,
  );
  assert.match(
    transitions,
    /completionDescriptor[\s\S]*enemyBudget: effectiveEnemyBudget/,
  );
  assert.match(
    transitions,
    /isRuntimeWaveComplete\([\s\S]*completionDescriptor/,
  );

  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /const simulationEnemyBudget =\s*getRuntimeMutatedEnemyBudget\([\s\S]*simulationDescriptor/,
  );

  const spawnChecks =
    physics.match(
      /waveBudgetSpawnedRef\.current < simulationEnemyBudget/g,
    ) ?? [];
  assert.equal(spawnChecks.length, 2);
  assert.doesNotMatch(
    physics,
    /waveBudgetSpawnedRef\.current < simulationDescriptor\.spawn\.enemyBudget/,
  );
});

test("ACCELERATED_ENEMIES multiplies regular spawn speed and elite dash speed", () => {
  const spawn = section(
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(
    spawn,
    /combatPressure\.enemyMovementSpeedMultiplier \*[\s\S]*mutatorEffects\.enemySpeedMultiplier/,
  );

  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /7\.5 \*[\s\S]*simulationMutatorEffects\.enemySpeedMultiplier/,
  );
});

test("REGENERATIVE_ENEMIES heals only living non-boss enemies and caps at maxHealth", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /!enemy\.isBoss &&[\s\S]*simulationMutatorEffects\.enemyRegenFractionPerSecond > 0/,
  );
  assert.match(
    physics,
    /enemy\.health = Math\.min\([\s\S]*enemy\.maxHealth,[\s\S]*enemy\.health \+/,
  );
  assert.match(
    physics,
    /enemy\.maxHealth \*[\s\S]*simulationMutatorEffects\.enemyRegenFractionPerSecond \*[\s\S]*\(delta \/ 1000\)/,
  );
});

test("FRAGILE_SWARM amplifies regular projectile/contact damage but not the Devourer path", () => {
  const collisions = section(
    "const detectAndResolveCollisions =",
    "// --- SPAWN SPLITTED ENEMY PARTS ---",
  );

  assert.match(
    collisions,
    /bossActiveRef\.current[\s\S]*\? 1[\s\S]*: mutatorEffects\.incomingDamageMultiplier/,
  );
  assert.match(
    collisions,
    /proj\.damage \*[\s\S]*regularIncomingDamageMultiplier/,
  );
  assert.match(
    collisions,
    /combatPressure\.contactDamageMultiplier \*[\s\S]*mutatorEffects\.incomingDamageMultiplier/,
  );
  assert.match(
    collisions,
    /damagePlayerFromBoss\(baseDamage, attackType\)/,
  );
});

test("FORMATION_DISRUPTION only reduces cohesion while a wave is active", () => {
  const physics = section(
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /if \(waveActiveRef\.current\) \{[\s\S]*followRate \*=[\s\S]*frameMutatorEffects\.formationCohesionMultiplier/,
  );
});

test("ELITE_BURST adds a bounded elite chance bonus", () => {
  const spawn = section(
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(
    spawn,
    /const effectiveEliteChance = Math\.min\([\s\S]*0\.75,[\s\S]*descriptor\.spawn\.eliteChance \+[\s\S]*mutatorEffects\.eliteChanceBonus/,
  );
  assert.match(
    spawn,
    /Math\.random\(\) < effectiveEliteChance/,
  );
});

test("split minions inherit accelerated movement only in Infinite Swarm", () => {
  const split = section(
    "const spawnMinionSplit =",
    "// --- DAMAGE PLAYER FROM BOSS SPECIFIC TELEMETRY ---",
  );

  assert.match(
    split,
    /combatPressure\.sourceMode === "INFINITE"[\s\S]*combatPressure\.enemyMovementSpeedMultiplier \*[\s\S]*mutatorEffects\.enemySpeedMultiplier/,
  );
});

test("campaign boss spawn remains outside mutator scaling", () => {
  const boss = section(
    "const spawnBoss =",
    "const skipBossIntro =",
  );

  assert.doesNotMatch(
    boss,
    /projectRuntimeMutatorEffects/,
  );
  assert.doesNotMatch(
    boss,
    /getRuntimeMutatedEnemyBudget/,
  );
  assert.match(
    boss,
    /BLACKOUT_DEVOURER_CANON\.maxHealth \*[\s\S]*\(rematchProfile\?\.healthMultiplier \?\? 1\)/,
  );
  assert.match(
    boss,
    /const isRematch = rematchProfile !== null/,
  );
});
