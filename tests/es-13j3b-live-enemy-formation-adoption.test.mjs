import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const gameSource = fs.readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const typesSource = fs.readFileSync("src/game/types.ts", "utf8");
const directorSource = fs.readFileSync("src/game/liveEnemyFormationDirector.ts", "utf8");
const playerFormationsSource = fs.readFileSync("src/game/formations.ts", "utf8");

const sliceBetween = (source, start, end) => {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing start marker: ${start}`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
};

test("J3B adopts J3A through one caller-owned director ref and Enemy metadata", () => {
  for (const symbol of [
    "createLiveEnemyFormationDirectorState",
    "projectLiveEnemyFormationMotion",
    "requestLiveEnemyFormationSpawn",
  ]) {
    assert.match(gameSource, new RegExp(`\\b${symbol}\\b`));
  }
  assert.match(
    gameSource,
    /enemyFormationDirectorRef\s*=\s*useRef\([\s\S]*?createLiveEnemyFormationDirectorState\(\)/,
  );
  assert.match(typesSource, /enemyFormation\?:\s*LiveEnemyFormationAssignment/);
  assert.doesNotMatch(gameSource, /enemyFormation(?:Map|Array|List)Ref/);
});

test("J3B formation assignment consumes the existing regular spawn seam and preserves caps", () => {
  const spawn = sliceBetween(
    gameSource,
    "const formationResolution =",
    "if (\n      !spawningMiniboss &&\n      type === EnemyType.BLACKOUT_ELITE",
  );
  assert.match(spawn, /spawnOrdinal:\s*waveBudgetSpawnedRef\.current/);
  assert.match(spawn, /Math\.min\([\s\S]*?MAX_ENEMIES[\s\S]*?descriptor\.spawn\.maxConcurrentEnemies/);
  assert.match(spawn, /- enemiesRef\.current\.length/);
  assert.match(spawn, /milestoneActive:\s*descriptor\.milestone !== null/);
  assert.doesNotMatch(spawn, /enemiesRef\.current\.(?:push|forEach|filter|map|reduce)\(/);
  assert.doesNotMatch(spawn, /projectilesRef\.current/);
});

test("J3B movement replaces only the legacy direct-slither branch for assigned members", () => {
  const movement = sliceBetween(
    gameSource,
    "// J3B: certified enemy formation routing replaces the existing",
    "// Restore original speed",
  );
  assert.match(movement, /projectLiveEnemyFormationMotion\(/);
  assert.match(movement, /nowMs:\s*timeElapsedRef\.current/);
  assert.match(movement, /enemy\.x = formationMotion\.x/);
  assert.match(movement, /enemy\.y = formationMotion\.y/);
  assert.match(movement, /enemy\.enemyFormation = undefined/);
  assert.match(movement, /enemy\.x \+= \(dx \/ dist\) \* enemy\.speed/);
  assert.doesNotMatch(movement, /requestAnimationFrame|setInterval|setTimeout|Date\.now|performance\.now/);
  assert.doesNotMatch(movement, /enemiesRef\.current\.(?:forEach|filter|map|reduce)\(/);
});

test("J3B route progress inherits pause/photo safety from simulation time ownership", () => {
  assert.match(
    gameSource,
    /renderCanvasScene\(\);\s*\/\/ Keep rendering for visual feedback, skip physics updates[\s\S]*?requestAnimationFrame\(gameLoop\);\s*return;[\s\S]*?timeElapsedRef\.current \+= delta/,
  );
  assert.match(gameSource, /nowMs:\s*timeElapsedRef\.current/);
  assert.doesNotMatch(directorSource, /Date\.now|performance\.now|requestAnimationFrame|setInterval|setTimeout/);
});

test("J3B fresh-run, wave-start and boss transitions reset director ownership", () => {
  const startGame = sliceBetween(gameSource, "const startGame = () => {", "const rebootGame =");
  assert.match(
    startGame,
    /enemyFormationDirectorRef\.current\s*=\s*createLiveEnemyFormationDirectorState\(\)/,
  );
  const waveStart = sliceBetween(
    gameSource,
    "// Start the wave!",
    "// Set up hazards if applicable",
  );
  assert.match(
    waveStart,
    /enemyFormationDirectorRef\.current\s*=\s*[\s\S]*?createLiveEnemyFormationDirectorState\(\)/,
  );
  const bossSpawn = sliceBetween(
    gameSource,
    "const spawnBoss = (",
    "const isRematch = rematchProfile !== null",
  );
  assert.match(
    bossSpawn,
    /enemyFormationDirectorRef\.current\s*=\s*createLiveEnemyFormationDirectorState\(\)/,
  );
});

test("J3B keeps player/FOTON formation authority separate", () => {
  assert.match(gameSource, /from "\.\/formations"/);
  assert.doesNotMatch(playerFormationsSource, /enemyFormation|EnemyFormation|PINCER|X_CROSS|SERPENTINE/);
  assert.doesNotMatch(
    directorSource,
    /from ["']\.\/(?:formations|formationCycle)["']/,
  );
  assert.doesNotMatch(
    directorSource,
    /\bFormationType\b|\bcalculateSwarmOffset\b|\bFORMATIONS\b/,
  );
});

test("J3B director remains bounded and does not own combat/economy/projectiles", () => {
  assert.match(directorSource, /LIVE_ENEMY_FORMATION_GROUP_SIZE = 2/);
  assert.match(directorSource, /ENEMY_FORMATION_ROUTE_EXTENT/);
  assert.doesNotMatch(
    directorSource,
    /MAX_ENEMIES|MAX_PROJECTILES|score|damage|health|projectile|nano|reward/i,
  );
});
