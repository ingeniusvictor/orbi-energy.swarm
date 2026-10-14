import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const adoptionSource = readFileSync("src/game/runtimeTacticalEnemyAdoption.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const infiniteSectorSource = readFileSync("src/game/infiniteSectorDirector.ts", "utf8");
const infiniteWaveSource = readFileSync("src/game/infiniteWaveDirector.ts", "utf8");
const evolutionSource = readFileSync("src/game/runtimeEnemyEvolution.ts", "utf8");
const formationDirectorSource = readFileSync("src/game/liveEnemyFormationDirector.ts", "utf8");
const familySource = readFileSync("src/game/tacticalEnemyFamilies.ts", "utf8");

test("J4B live policy retains the certified J4A Warp Ambusher contract", () => {
  assert.match(adoptionSource, /J4B_LIVE_FAMILY_ID = "WARP_AMBUSHER"/);
  assert.match(adoptionSource, /EnemyType\.RIFT_HUNTER/);
  assert.match(familySource, /"WARP_AMBUSHER"/);
  assert.match(familySource, /EnemyType\.RIFT_HUNTER/);

  for (const forbidden of [
    /EnemyType\.SWARM_REAVER/,
    /EnemyType\.VOID_ANCHOR/,
    /EnemyType\.MINE_WEAVER/,
    /EnemyType\.MIRROR_WARDEN/,
  ]) {
    assert.doesNotMatch(adoptionSource, forbidden);
  }
});

test("J4B/J4C tactical policy is pure and owns no clock, RNG, collection, scan, spawn loop or cap authority", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /new Date/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /enemiesRef/,
    /projectilesRef/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /\.filter\(/,
    /\.reduce\(/,
    /\.forEach\(/,
    /new Map/,
    /new Set/,
  ]) {
    assert.doesNotMatch(adoptionSource, forbidden);
  }
});

test("Campaign remains disabled and J4B Infinite policy remains sparse/final-wave only", () => {
  assert.match(adoptionSource, /descriptor\.sourceMode !== "INFINITE"/);
  assert.match(adoptionSource, /J4B_TACTICAL_MIN_INFINITE_SECTOR = 26/);
  assert.match(adoptionSource, /J4B_TACTICAL_SECTOR_CADENCE = 4/);
  assert.match(adoptionSource, /descriptor\.sector % 5 === 0/);
  assert.match(adoptionSource, /\(sector - 1\) % 25 === 0/);
  assert.match(adoptionSource, /descriptor\.waveNumber !== descriptor\.waveCount/);
  assert.match(adoptionSource, /descriptor\.milestone !== null/);
  assert.match(adoptionSource, /Math\.floor\(descriptor\.spawn\.enemyBudget \/ 2\)/);
});

test("normal Infinite recipes and waves keep their existing base enemy composition authority", () => {
  const advancedTokens = [
    "RIFT_HUNTER",
    "SIEGE_PRISM",
    "SWARM_REAVER",
    "VOID_ANCHOR",
    "MINE_WEAVER",
    "MIRROR_WARDEN",
  ];

  for (const token of advancedTokens) {
    assert.doesNotMatch(infiniteSectorSource, new RegExp(`EnemyType\\.${token}`));
    assert.doesNotMatch(infiniteWaveSource, new RegExp(`EnemyType\\.${token}`));
  }

  assert.match(infiniteSectorSource, /const ENEMY_POOL = \[/);
  assert.match(infiniteWaveSource, /sectorRecipe\.enemyComposition/);
});

test("J4B/J4C uses the existing spawn seam and gives milestone/forced types precedence", () => {
  assert.match(gameSource, /resolveRuntimeTacticalEnemySpawn/);
  assert.match(
    gameSource,
    /const tacticalType =\s*!spawningMiniboss && !forcedType/,
  );
  assert.match(
    gameSource,
    /spawningMiniboss && minibossProfile[\s\S]*?minibossProfile\.enemyType[\s\S]*?: forcedType \|\|[\s\S]*?tacticalType \|\|/,
  );
  assert.match(gameSource, /spawnOrdinal:\s*waveBudgetSpawnedRef\.current/);
  assert.match(gameSource, /waveBudgetSpawnedRef\.current \+= 1/);
});

test("tactical replacement cannot stack generic evolved, elite or J3 formation pressure", () => {
  assert.doesNotMatch(evolutionSource, /EnemyType\.RIFT_HUNTER/);
  assert.doesNotMatch(evolutionSource, /EnemyType\.SIEGE_PRISM/);
  assert.match(
    gameSource,
    /const isElite =\s*!spawningMiniboss &&\s*!evolvedProfile &&\s*!tacticalType &&/,
  );

  assert.match(formationDirectorSource, /EnemyType\.CRAWLER/);
  assert.match(formationDirectorSource, /EnemyType\.SPLITTER/);
  assert.doesNotMatch(formationDirectorSource, /EnemyType\.RIFT_HUNTER/);
  assert.doesNotMatch(formationDirectorSource, /EnemyType\.SIEGE_PRISM/);
});

test("existing Warp Ambusher runtime retains the readable RIFT LOCK telegraph", () => {
  assert.match(gameSource, /EnemyType\.RIFT_HUNTER/);
  assert.match(gameSource, /addFloatingText\("RIFT LOCK"/);
  assert.match(gameSource, /enemy\.chargeTimer = 420/);
});

test("J4B/J4C changes no sector budget, cadence, projectile budget or tactical-family catalog", () => {
  for (const forbidden of [
    /enemyBudget\s*[+*-]=/,
    /maxConcurrentEnemies\s*[+*-]=/,
    /spawnIntervalFrames\s*[+*-]=/,
    /projectileBudget\s*[+*-]=/,
  ]) {
    assert.doesNotMatch(adoptionSource, forbidden);
  }

  assert.doesNotMatch(gameSource, /J4B_TACTICAL_MIN_INFINITE_SECTOR/);
  assert.doesNotMatch(gameSource, /J4B_TACTICAL_SECTOR_CADENCE/);
  assert.doesNotMatch(gameSource, /J4C_C_SIEGE_MIN_INFINITE_SECTOR/);
  assert.doesNotMatch(gameSource, /J4C_C_SIEGE_SECTOR_CADENCE/);
});
