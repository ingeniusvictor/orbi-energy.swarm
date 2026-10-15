import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/dynamicMidSectorEventIdentity.ts",
  "utf8",
);
const opportunitySource = readFileSync(
  "src/game/dynamicMidSectorEventOpportunity.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const sectorSource = readFileSync("src/game/infiniteSectorDirector.ts", "utf8");
const waveSource = readFileSync("src/game/infiniteWaveDirector.ts", "utf8");
const mutatorSource = readFileSync("src/game/infiniteMutatorDirector.ts", "utf8");
const effectsSource = readFileSync("src/game/runtimeMutatorEffects.ts", "utf8");
const environmentSource = readFileSync("src/game/runtimeEnvironmentalFields.ts", "utf8");

test("J6B-A is a standalone identity-only contract with no imports", () => {
  assert.doesNotMatch(source, /^import\s/m);
  assert.match(source, /identityMode:\s*"IDENTITY_ONLY"/);
  assert.match(source, /family:\s*"ENVIRONMENTAL_IDENTITY"/);
  assert.match(source, /selectsOpportunity:\s*false/);
  assert.match(source, /selectsEvent:\s*false/);
  assert.match(source, /mapsToMutatorEffect:\s*false/);
  assert.match(source, /executesLiveEffect:\s*false/);
});

test("J6B-A contains exactly the five activated event identities", () => {
  for (const eventId of [
    "SOLAR_STORM",
    "QUANTUM_RIFT",
    "BLACKOUT_SURGE",
    "CRYSTAL_RUSH",
    "DYSON_ECLIPSE",
  ]) {
    assert.match(source, new RegExp(`"${eventId}"`));
  }

  for (const deferredEventId of [
    /SWARM_DISTRESS_CALL/,
    /CONVOY_DEFENSE/,
    /VOID_HUNT/,
    /ELITE_INCURSION/,
    /MIRROR_SWARM/,
    /METEOR_DEBRIS_FIELD/,
    /SINGULARITY_EVENT/,
  ]) {
    assert.doesNotMatch(source, deferredEventId);
  }
});

test("J6B-A does not adopt into J6A or existing live authorities", () => {
  for (const existingAuthority of [
    opportunitySource,
    gameSource,
    sectorSource,
    waveSource,
    mutatorSource,
    effectsSource,
    environmentSource,
  ]) {
    assert.doesNotMatch(existingAuthority, /dynamicMidSectorEventIdentity/);
  }
});

test("J6B-A owns no selection environment combat economy scan timing RNG or cap authority", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /EnergySwarmGame/,
    /RuntimeWaveDescriptor/,
    /InfiniteMutator/,
    /BiomeType/,
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
    "ownsOpportunitySelectionAuthority",
    "ownsEventSelectionAuthority",
    "ownsEventExecutionAuthority",
    "ownsMutatorMappingAuthority",
    "ownsEnvironmentAuthority",
    "ownsSpawnAuthority",
    "ownsProgressionAuthority",
    "ownsEntityCollection",
    "ownsProjectileCollection",
    "ownsDamageAuthority",
    "ownsDefeatAuthority",
    "ownsScoreAuthority",
    "ownsRewardAuthority",
    "ownsEconomyAuthority",
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

test("existing J6A and environmental authorities retain their frozen ownership", () => {
  assert.match(opportunitySource, /OPPORTUNITY_ONLY/);
  assert.match(mutatorSource, /directInfiniteMutatorSelection/);
  assert.match(effectsSource, /projectRuntimeMutatorEffects/);
  assert.match(environmentSource, /getReducedVisibilityOverlayProfile/);
  assert.match(environmentSource, /getResourceFieldProfile/);
});