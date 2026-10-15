import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/dynamicMidSectorEventOpportunity.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const descriptorSource = readFileSync("src/game/runtimeWaveDescriptor.ts", "utf8");
const sectorSource = readFileSync("src/game/infiniteSectorDirector.ts", "utf8");
const waveSource = readFileSync("src/game/infiniteWaveDirector.ts", "utf8");
const mutatorSource = readFileSync("src/game/infiniteMutatorDirector.ts", "utf8");
const environmentSource = readFileSync("src/game/runtimeEnvironmentalFields.ts", "utf8");

test("J6A is a pure standalone opportunity contract with type-only descriptor reuse and no live adoption", () => {
  assert.match(
    source,
    /^import type \{ RuntimeWaveSourceMode \} from "\.\/runtimeWaveDescriptor";/m,
  );
  assert.doesNotMatch(source, /^import(?! type)\s/m);
  assert.doesNotMatch(source, /EnergySwarmGame/);

  for (const existingAuthority of [
    gameSource,
    descriptorSource,
    sectorSource,
    waveSource,
    mutatorSource,
    environmentSource,
  ]) {
    assert.doesNotMatch(existingAuthority, /dynamicMidSectorEventOpportunity/);
  }
});

test("J6A is Infinite-only and bounded to the certified 3 through 7 wave range", () => {
  assert.match(source, /sourceMode !== "INFINITE"/);
  assert.match(source, /DYNAMIC_EVENT_MIN_WAVE_COUNT = 3/);
  assert.match(source, /DYNAMIC_EVENT_MAX_WAVE_COUNT = 7/);
  assert.match(source, /!Number\.isInteger\(facts\.sector\)/);
  assert.match(source, /facts\.sector < 11/);
  assert.match(source, /!Number\.isInteger\(facts\.waveCount\)/);
  assert.match(source, /!Number\.isInteger\(facts\.waveIndex\)/);
  assert.match(source, /facts\.waveIndex === 1/);
  assert.match(source, /facts\.waveIndex === facts\.waveCount/);
  assert.match(source, /facts\.recoverySector \|\| facts\.hasMilestone/);
});

test("J6A selects one interior wave from stable sector identity rather than current wave identity", () => {
  assert.match(
    source,
    /const identity = `\$\{seed\}\\u0000\$\{recipeId\}\\u0000\$\{sector\}\\u0000\$\{waveCount\}`/,
  );
  assert.match(source, /const interiorWaveCount = waveCount - 2/);
  assert.match(
    source,
    /selectedWaveIndex: 2 \+ \(identityHash % interiorWaveCount\)/,
  );
  assert.match(source, /facts\.waveIndex !== selectedWaveIndex/);
  assert.doesNotMatch(source, /waveIndex.*hashIdentity|hashIdentity.*waveIndex/s);
});

test("J6A emits opportunity-only metadata and contains no event vocabulary or live effects", () => {
  assert.match(source, /opportunityMode:\s*"OPPORTUNITY_ONLY"/);
  assert.match(source, /kind:\s*"DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY"/);
  assert.match(source, /selectsEventIdentity:\s*false/);
  assert.match(source, /appliesLiveEffect:\s*false/);
  assert.match(source, /mutatesEnvironment:\s*false/);
  assert.match(source, /mutatesMutators:\s*false/);

  for (const deferredEventIdentity of [
    /SOLAR_STORM/,
    /QUANTUM_RIFT/,
    /BLACKOUT_SURGE/,
    /CRYSTAL_RUSH/,
    /DYSON_ECLIPSE/,
    /SWARM_DISTRESS_CALL/,
    /CONVOY_DEFENSE/,
    /VOID_HUNT/,
    /ELITE_INCURSION/,
    /MIRROR_SWARM/,
    /SINGULARITY_EVENT/,
  ]) {
    assert.doesNotMatch(source, deferredEventIdentity);
  }
});

test("J6A owns no live event environment combat economy scan timing RNG or cap authority", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /enemiesRef/,
    /projectilesRef/,
    /EnemyType/,
    /enemyId/i,
    /\.filter\(/,
    /\.find\(/,
    /\.reduce\(/,
    /\.forEach\(/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /registerCombatDefeat/,
    /registerCombatResonanceDefeat/,
    /nanoCredits/,
    /dropChance/,
    /isDead\s*=/,
    /\.health\s*[-+*/]?=/,
  ]) {
    assert.doesNotMatch(source, forbidden);
  }

  for (const requiredFalse of [
    "ownsEventIdentityAuthority",
    "ownsEventExecutionAuthority",
    "ownsSectorAuthority",
    "ownsWaveAuthority",
    "ownsRecoveryAuthority",
    "ownsMilestoneAuthority",
    "ownsSpawnAuthority",
    "ownsProgressionAuthority",
    "ownsEntityCollection",
    "ownsProjectileCollection",
    "ownsDamageAuthority",
    "ownsDefeatAuthority",
    "ownsScoreAuthority",
    "ownsRewardAuthority",
    "ownsEconomyAuthority",
    "ownsMutatorAuthority",
    "ownsEnvironmentAuthority",
    "ownsClock",
    "ownsRandomness",
    "ownsFullArrayScan",
    "mayLookupEntities",
    "mayMutateEntities",
    "mayMutateGlobalCaps",
    "mayCreateEntities",
    "mayRemoveEntities",
  ]) {
    assert.match(source, new RegExp(`${requiredFalse}: false`));
  }
});

test("existing Infinite and environmental authorities retain their frozen ownership", () => {
  assert.match(descriptorSource, /export interface RuntimeWaveDescriptor/);
  assert.match(sectorSource, /recoverySector:\s*boolean/);
  assert.match(waveSource, /waveIndex/);
  assert.match(mutatorSource, /directInfiniteMutatorSelection/);
  assert.match(environmentSource, /deriveRuntimeEnvironmentalEffects/);
});
