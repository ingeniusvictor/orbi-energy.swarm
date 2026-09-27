import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const game = readFileSync(
  new URL("../src/game/EnergySwarmGame.tsx", import.meta.url),
  "utf8",
);
const types = readFileSync(
  new URL("../src/game/types.ts", import.meta.url),
  "utf8",
);
const canvas = readFileSync(
  new URL("../src/game/EnergySwarmCanvas.tsx", import.meta.url),
  "utf8",
);

const section = (
  source: string,
  startMarker: string,
  endMarker: string,
) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(
    endMarker,
    start + startMarker.length,
  );
  assert.ok(start >= 0, `Missing start marker: ${startMarker}`);
  assert.ok(end > start, `Missing end marker: ${endMarker}`);
  return source.slice(start, end);
};

test("live runtime consumes cached milestone projection and deterministic miniboss gate", () => {
  assert.match(game, /getCachedRuntimeProjectionBundle/);
  assert.match(game, /createRuntimeMinibossGateState/);
  assert.match(game, /syncRuntimeMinibossGate/);
  assert.match(game, /stepRuntimeMinibossGate/);
  assert.match(game, /requestRuntimeMinibossSpawn/);
  assert.match(game, /markRuntimeMinibossSpawned/);
});

test("new runs reset the miniboss gate", () => {
  const start = section(
    game,
    "const startGame =",
    "// --- REBOOT GAME ON LOSS ---",
  );

  assert.match(
    start,
    /minibossGateRef\.current =[\s\S]*createRuntimeMinibossGateState\(\)/,
  );
});

test("only MINIBOSS milestone profiles reserve the final effective budget slot", () => {
  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(
    spawn,
    /milestoneEncounter\?\.kind === "MINIBOSS"/,
  );
  assert.match(
    spawn,
    /const effectiveEnemyBudget =[\s\S]*runtimeProjection\.enemyBudget/,
  );
  assert.match(
    spawn,
    /waveBudgetSpawnedRef\.current ===[\s\S]*effectiveEnemyBudget - 1/,
  );
  assert.doesNotMatch(
    spawn,
    /milestoneEncounter\?\.kind === "BOSS_REMATCH"/,
  );
});

test("final slot starts one telegraph and cannot increment budget before champion readiness", () => {
  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  const requestIndex = spawn.indexOf(
    "requestRuntimeMinibossSpawn",
  );
  const budgetIndex = spawn.indexOf(
    "waveBudgetSpawnedRef.current += 1",
  );

  assert.ok(requestIndex >= 0);
  assert.ok(budgetIndex > requestIndex);
  assert.match(
    spawn,
    /if \(request\.telegraphStarted\)[\s\S]*return;/,
  );
  assert.match(
    spawn,
    /if \(!request\.readyToSpawn\)[\s\S]*return;/,
  );
  assert.match(
    spawn,
    /MINIBOSS INBOUND \/\/ BLACKOUT WARDEN/,
  );
});

test("champion owns the final slot as a BLACKOUT_ELITE non-boss", () => {
  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(
    spawn,
    /spawningMiniboss && minibossProfile[\s\S]*minibossProfile\.enemyType/,
  );
  assert.match(
    spawn,
    /isBoss: false/,
  );
  assert.match(
    spawn,
    /milestoneKind:[\s\S]*"MINIBOSS"/,
  );
  assert.match(
    spawn,
    /markRuntimeMinibossSpawned/,
  );
});

test("existing pressure and mutators apply before bounded milestone stat multipliers", () => {
  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  const pressureIndex = spawn.indexOf(
    "combatPressure.enemyHealthMultiplier",
  );
  const milestoneIndex = spawn.indexOf(
    "health *= minibossProfile.healthMultiplier",
  );

  assert.ok(pressureIndex >= 0);
  assert.ok(milestoneIndex > pressureIndex);
  assert.match(
    spawn,
    /speed \*=[\s\S]*minibossProfile\.movementSpeedMultiplier/,
  );
  assert.match(
    spawn,
    /size \*= minibossProfile\.sizeMultiplier/,
  );
  assert.match(spawn, /color = "#fbbf24"/);
});

test("milestone champion never stacks random elite or ELITE_SUPPORT spawning", () => {
  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );

  assert.match(
    spawn,
    /const isElite =[\s\S]*!spawningMiniboss &&[\s\S]*Math\.random\(\) < effectiveEliteChance/,
  );
  assert.match(
    spawn,
    /if \([\s\S]*!spawningMiniboss &&[\s\S]*type === EnemyType\.BLACKOUT_ELITE[\s\S]*ELITE_SUPPORT/,
  );
});

test("miniboss movement multiplier also applies to Blackout Elite dash", () => {
  const physics = section(
    game,
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /const milestoneDashMultiplier =[\s\S]*enemy\.milestoneMovementSpeedMultiplier \?\?[\s\S]*1/,
  );
  const dashUses =
    physics.match(
      /simulationMutatorEffects\.enemySpeedMultiplier \*[\s\S]*milestoneDashMultiplier/g,
    ) ?? [];
  assert.ok(dashUses.length >= 1);
});

test("miniboss contact damage and reward multipliers are isolated enemy metadata", () => {
  assert.match(
    types,
    /milestoneContactDamageMultiplier\?: number/,
  );
  assert.match(
    types,
    /milestoneRewardMultiplier\?: number/,
  );

  const collisions = section(
    game,
    "const detectAndResolveCollisions =",
    "// --- SPAWN SPLITTED ENEMY PARTS ---",
  );
  assert.match(
    collisions,
    /enemy\.milestoneContactDamageMultiplier \?\?[\s\S]*1/,
  );

  const reward = section(
    game,
    "const getEnemyScoreReward",
    "// --- DETECT SINGLE-IMPACT COLLISION SWEEPS ---",
  );
  assert.match(
    reward,
    /enemy\.milestoneRewardMultiplier \?\? 1/,
  );

  const rewardCalls =
    collisions.match(/getEnemyScoreReward\(/g) ?? [];
  assert.equal(
    rewardCalls.length,
    2,
    "both direct and splash kill paths must use milestone-aware score rewards",
  );
});

test("BUDGET_AND_CLEAR still sees the champion because milestone enemies remain non-boss", () => {
  const transitions = section(
    game,
    "const handleWaveTransitions",
    "// --- SPAWN REGULAR ENEMY ---",
  );
  assert.match(
    transitions,
    /countLivingStandardEnemies\([\s\S]*enemiesRef\.current/,
  );

  const spawn = section(
    game,
    "const spawnEnemy =",
    "// --- SPAWN GIANT DEVOURER BOSS ---",
  );
  assert.match(spawn, /isBoss: false/);
});

test("miniboss gate synchronizes and advances from the active runtime descriptor each frame", () => {
  const physics = section(
    game,
    "const updateEnginePhysics =",
    "// --- COLLECT RESOURCES SCRIPT ---",
  );

  assert.match(
    physics,
    /simulationRuntimeProjection\.milestoneEncounter/,
  );
  assert.match(
    physics,
    /syncRuntimeMinibossGate\([\s\S]*simulationDescriptor\.descriptorId/,
  );
  assert.match(
    physics,
    /stepRuntimeMinibossGate\([\s\S]*delta/,
  );
});

test("Blackout Warden receives a persistent Canvas aura and label", () => {
  const drawing = section(
    canvas,
    "export function drawEnemiesList",
    "switch (enemy.type)",
  );

  assert.match(
    drawing,
    /enemy\.milestoneKind === "MINIBOSS"/,
  );
  assert.match(drawing, /BLACKOUT WARDEN/);
  assert.match(drawing, /#fbbf24/);
});

test("pre-spawn milestone warning renders above battlefield effects before radar", () => {
  const render = section(
    game,
    "const renderCanvasScene =",
    "// --- TOUCH AND COORDINATE POINTER MAPS ---",
  );

  const warningIndex = render.indexOf(
    "BLACKOUT WARDEN INBOUND",
  );
  const radarIndex = render.indexOf(
    "drawTacticalMinimap",
  );

  assert.ok(warningIndex >= 0);
  assert.ok(radarIndex > warningIndex);
});

test("campaign Devourer runtime remains isolated from miniboss metadata", () => {
  const boss = section(
    game,
    "const spawnBoss =",
    "const skipBossIntro =",
  );

  assert.doesNotMatch(
    boss,
    /minibossGateRef/,
  );
  assert.match(
    boss,
    /milestoneKind: isRematch \? "BOSS_REMATCH" : undefined/,
  );
  assert.match(
    boss,
    /const isRematch = rematchProfile !== null/,
  );
  assert.match(
    boss,
    /if \(!isRematch\)[\s\S]*bossAttempts/,
  );
  assert.match(
    boss,
    /BLACKOUT_DEVOURER_CANON\.maxHealth \*[\s\S]*\(rematchProfile\?\.healthMultiplier \?\? 1\)/,
  );
});
