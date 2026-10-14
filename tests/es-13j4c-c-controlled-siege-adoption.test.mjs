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
const bossFamilySource = readFileSync("src/game/infiniteBossFamily.ts", "utf8");
const siegeIntegrationSource = readFileSync("src/game/liveSiegeVolleyIntegration.ts", "utf8");

test("J4C-C adopts only the certified Artillery Carrier family in addition to J4B", () => {
  assert.match(adoptionSource, /J4B_LIVE_FAMILY_ID = "WARP_AMBUSHER"/);
  assert.match(adoptionSource, /J4C_C_LIVE_FAMILY_ID = "ARTILLERY_CARRIER"/);
  assert.match(adoptionSource, /EnemyType\.RIFT_HUNTER/);
  assert.match(adoptionSource, /EnemyType\.SIEGE_PRISM/);
  assert.match(familySource, /"ARTILLERY_CARRIER"/);
  assert.match(familySource, /EnemyType\.SIEGE_PRISM/);

  for (const forbidden of [
    /EnemyType\.SWARM_REAVER/,
    /EnemyType\.VOID_ANCHOR/,
    /EnemyType\.MINE_WEAVER/,
    /EnemyType\.MIRROR_WARDEN/,
  ]) {
    assert.doesNotMatch(adoptionSource, forbidden);
  }
});

test("J4C-C uses the HIGH_PRESSURE counterphase and preserves common exclusion gates", () => {
  assert.match(adoptionSource, /J4C_C_SIEGE_MIN_INFINITE_SECTOR = 51/);
  assert.match(adoptionSource, /J4C_C_SIEGE_SECTOR_CADENCE = 8/);
  assert.match(adoptionSource, /J4C_C_SIEGE_SECTOR_OFFSET = 52/);
  assert.match(adoptionSource, /descriptor\.sourceMode !== "INFINITE"/);
  assert.match(adoptionSource, /descriptor\.sector % 5 === 0/);
  assert.match(adoptionSource, /\(sector - 1\) % 25 === 0/);
  assert.match(adoptionSource, /descriptor\.waveNumber !== descriptor\.waveCount/);
  assert.match(adoptionSource, /descriptor\.milestone !== null/);
  assert.match(adoptionSource, /Math\.floor\(descriptor\.spawn\.enemyBudget \/ 2\)/);
});

test("J4C-C adds no clock, RNG, collection, scan or cap authority", () => {
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
    /enemyBudget\s*[+*-]=/,
    /maxConcurrentEnemies\s*[+*-]=/,
    /spawnIntervalFrames\s*[+*-]=/,
    /projectileBudget\s*[+*-]=/,
  ]) {
    assert.doesNotMatch(adoptionSource, forbidden);
  }
});

test("normal Infinite composition remains baseline-owned rather than catalog-expanded", () => {
  for (const token of [
    "RIFT_HUNTER",
    "SIEGE_PRISM",
    "SWARM_REAVER",
    "VOID_ANCHOR",
    "MINE_WEAVER",
    "MIRROR_WARDEN",
  ]) {
    assert.doesNotMatch(infiniteSectorSource, new RegExp(`EnemyType\\.${token}`));
    assert.doesNotMatch(infiniteWaveSource, new RegExp(`EnemyType\\.${token}`));
  }

  assert.match(infiniteSectorSource, /const ENEMY_POOL = \[/);
  assert.match(infiniteWaveSource, /sectorRecipe\.enemyComposition/);
});

test("SIEGE tactical replacement stays outside evolved, elite and J3 formation authorities", () => {
  assert.doesNotMatch(evolutionSource, /EnemyType\.SIEGE_PRISM/);
  assert.doesNotMatch(formationDirectorSource, /EnemyType\.SIEGE_PRISM/);
  assert.match(
    gameSource,
    /const isElite =\s*!spawningMiniboss &&\s*!evolvedProfile &&\s*!tacticalType &&/,
  );
  assert.match(
    gameSource,
    /const tacticalType =\s*!spawningMiniboss && !forcedType[\s\S]*?resolveRuntimeTacticalEnemySpawn/,
  );
});

test("J4C-B Siege volley contract remains the only live SIEGE projectile path", () => {
  assert.match(gameSource, /stepLiveSiegeVolley/);
  assert.match(gameSource, /acknowledgeLiveSiegeVolleyShot/);
  assert.match(gameSource, /enemy\.type === EnemyType\.SIEGE_PRISM/);
  assert.match(gameSource, /enemy\.shootCooldown = 150 \+ Math\.random\(\) \* 70/);
  assert.match(gameSource, /enemy\.type === EnemyType\.SIEGE_PRISM \? 4\.0/);
  assert.match(gameSource, /enemy\.type === EnemyType\.SIEGE_PRISM \? 3/);
  assert.match(gameSource, /enemy\.type === EnemyType\.SIEGE_PRISM \? 0\.12/);
  assert.match(siegeIntegrationSource, /LIVE_SIEGE_VOLLEY_FIRE_RANGE/);
});

test("SIEGE_CATHEDRAL support composition/count/cooldown remains frozen", () => {
  assert.match(
    bossFamilySource,
    /SIEGE_CATHEDRAL:[\s\S]*?supportEnemyType: EnemyType\.SIEGE_PRISM,[\s\S]*?supportMaxCount: 2,[\s\S]*?supportCooldownMs: 8000,/,
  );
});

test("runtime main loop does not gain sector-policy or second-director authority", () => {
  assert.doesNotMatch(gameSource, /J4C_C_SIEGE_MIN_INFINITE_SECTOR/);
  assert.doesNotMatch(gameSource, /J4C_C_SIEGE_SECTOR_CADENCE/);
  assert.doesNotMatch(gameSource, /J4C_C_SIEGE_SECTOR_OFFSET/);
  assert.doesNotMatch(gameSource, /ARTILLERY_CARRIER/);
});
