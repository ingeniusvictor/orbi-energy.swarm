import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const familySource = readFileSync("src/game/tacticalEnemyFamilies.ts", "utf8");
const typesSource = readFileSync("src/game/types.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const campaignSource = readFileSync("src/game/waveDirector.ts", "utf8");
const infiniteSource = readFileSync("src/game/infiniteSectorDirector.ts", "utf8");
const playerFormationsSource = readFileSync("src/game/formations.ts", "utf8");

const CERTIFIED_TYPES = [
  "RIFT_HUNTER",
  "SIEGE_PRISM",
  "SWARM_REAVER",
  "VOID_ANCHOR",
];

const CERTIFIED_FAMILIES = [
  "WARP_AMBUSHER",
  "ARTILLERY_CARRIER",
  "FORMATION_BREAKER",
  "JAMMER",
];

test("J4A formalizes a bounded four-family vocabulary on existing EnemyType values", () => {
  assert.match(familySource, /from ["']\.\/types["']/);
  assert.match(familySource, /TACTICAL_ENEMY_FAMILY_COUNT = 4/);

  for (const token of CERTIFIED_TYPES) {
    assert.match(typesSource, new RegExp(`\\b${token}\\b`));
    assert.match(familySource, new RegExp(`EnemyType\\.${token}`));
  }

  for (const token of CERTIFIED_FAMILIES) {
    assert.match(familySource, new RegExp(`"${token}"`));
  }
});

test("J4A intentionally does not certify mine or mirror semantics before their mechanics exist", () => {
  assert.match(typesSource, /\bMINE_WEAVER\b/);
  assert.match(typesSource, /\bMIRROR_WARDEN\b/);
  assert.doesNotMatch(familySource, /EnemyType\.MINE_WEAVER/);
  assert.doesNotMatch(familySource, /EnemyType\.MIRROR_WARDEN/);
  assert.doesNotMatch(familySource, /MINE_LAYER/);
  assert.doesNotMatch(familySource, /MIRROR_DRONE/);
});

test("J4A pure authority has no hidden time, randomness, rendering or side effects", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /new Date/,
    /performance\.now/,
    /requestAnimationFrame/,
    /cancelAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /localStorage/,
    /sessionStorage/,
    /new Audio/,
    /AudioContext/,
    /fetch\s*\(/,
    /canvas/i,
    /react/i,
  ]) {
    assert.doesNotMatch(familySource, forbidden);
  }
});

test("J4A owns no live enemy, projectile, spawn, scan, mode or global-cap authority", () => {
  for (const forbidden of [
    /EnergySwarmGame/,
    /runtimeWaveDescriptor/,
    /infiniteSectorDirector/,
    /waveDirector/,
    /enemiesRef/,
    /projectilesRef/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /enemyBudget/,
    /projectileBudget/,
    /maxConcurrentEnemies/,
    /spawnIntervalFrames/,
    /\bCAMPAIGN\b/,
    /\bINFINITE\b/,
  ]) {
    assert.doesNotMatch(familySource, forbidden);
  }

  for (const contractToken of [
    "ownsSpawnAuthority: false",
    "ownsEntityCollection: false",
    "ownsProjectileCollection: false",
    "ownsFullArrayScan: false",
    "mayMutateGlobalCaps: false",
    "mayCreateSupportEntities: false",
  ]) {
    assert.match(familySource, new RegExp(contractToken));
  }
});

test("J4A remains dormant: no live runtime or normal Campaign/Infinite selection adoption", () => {
  assert.doesNotMatch(gameSource, /tacticalEnemyFamilies/);

  for (const token of CERTIFIED_TYPES) {
    assert.doesNotMatch(campaignSource, new RegExp(`EnemyType\\.${token}`));
    assert.doesNotMatch(infiniteSource, new RegExp(`EnemyType\\.${token}`));
  }
});

test("J4A keeps J3 enemy formations and player/FOTON formations outside its ownership", () => {
  assert.doesNotMatch(
    familySource,
    /enemyFormation|EnemyFormation|liveEnemyFormationDirector|formationCycle|formations\.ts/,
  );
  assert.doesNotMatch(
    playerFormationsSource,
    /tacticalEnemyFamilies|WARP_AMBUSHER|ARTILLERY_CARRIER|FORMATION_BREAKER|JAMMER/,
  );
});

test("J4A encodes distinct tactical questions, telegraphs and counterplay rather than stat tuning", () => {
  for (const token of [
    "TIMING",
    "RANGE_CONTROL",
    "SWARM_COHESION",
    "CONTROL_SOURCE",
    "RIFT_LOCK",
    "SIEGE_VOLLEY",
    "REAVER_APPROACH",
    "ANCHOR_FIELD",
    "DODGE_AFTER_LOCK_COMMIT",
    "BREAK_ARTILLERY_ENVELOPE",
    "INTERCEPT_BEFORE_COHESION_BREAK",
    "EXIT_OR_DESTROY_CONTROL_SOURCE",
  ]) {
    assert.match(familySource, new RegExp(`"${token}"`));
  }

  for (const forbidden of [
    /healthMultiplier/,
    /damageMultiplier/,
    /movementSpeedMultiplier/,
    /attackRateMultiplier/,
    /projectileSpeedMultiplier/,
    /rewardMultiplier/,
    /scoreMultiplier/,
  ]) {
    assert.doesNotMatch(familySource, forbidden);
  }
});
