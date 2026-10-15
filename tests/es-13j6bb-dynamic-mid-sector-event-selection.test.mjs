import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/dynamicMidSectorEventSelection.ts",
  "utf8",
);
const opportunitySource = readFileSync(
  "src/game/dynamicMidSectorEventOpportunity.ts",
  "utf8",
);
const identitySource = readFileSync(
  "src/game/dynamicMidSectorEventIdentity.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const sectorSource = readFileSync("src/game/infiniteSectorDirector.ts", "utf8");
const waveSource = readFileSync("src/game/infiniteWaveDirector.ts", "utf8");
const mutatorSource = readFileSync("src/game/infiniteMutatorDirector.ts", "utf8");
const effectsSource = readFileSync("src/game/runtimeMutatorEffects.ts", "utf8");
const environmentSource = readFileSync("src/game/runtimeEnvironmentalFields.ts", "utf8");

test("J6B-B is a pure selection contract that reuses only frozen J6A and J6B-A contracts", () => {
  assert.match(source, /from "\.\/dynamicMidSectorEventOpportunity"/);
  assert.match(source, /from "\.\/dynamicMidSectorEventIdentity"/);
  assert.doesNotMatch(source, /EnergySwarmGame/);
  assert.doesNotMatch(source, /infiniteSectorDirector/);
  assert.doesNotMatch(source, /infiniteWaveDirector/);
  assert.doesNotMatch(source, /infiniteMutatorDirector/);
  assert.doesNotMatch(source, /runtimeMutatorEffects/);
  assert.doesNotMatch(source, /runtimeEnvironmentalFields/);
});

test("J6B-B validates the exact current J6A fingerprint and canonical opportunity identity", () => {
  assert.match(source, /EXACT_IDENTITY_FINGERPRINT = \/\^\[0-9a-f\]\{8\}\$\//);
  assert.match(source, /opportunity\.kind !== "DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY"/);
  assert.match(source, /opportunity\.opportunityMode !== "OPPORTUNITY_ONLY"/);
  assert.match(source, /opportunity\.sourceMode !== "INFINITE"/);
  assert.match(source, /opportunity\.waveIndex !== opportunity\.selectedWaveIndex/);
  assert.match(
    source,
    /`j6a:\$\{opportunity\.sector\}:\$\{opportunity\.selectedWaveIndex\}:\$\{opportunity\.identityFingerprint\}`/,
  );
});

test("J6B-B derives selection only from the existing J6A fingerprint and frozen J6B-A list", () => {
  assert.match(
    source,
    /Number\.parseInt\(opportunity\.identityFingerprint, 16\) %\s*DYNAMIC_MID_SECTOR_EVENT_IDS\.length/,
  );
  assert.match(source, /selectionMode:\s*"SELECTION_ONLY"/);
  assert.match(source, /selectsEventIdentity:\s*true/);
  assert.match(source, /mapsToMutatorEffect:\s*false/);
  assert.match(source, /executesLiveEffect:\s*false/);

  for (const duplicatedIdentity of [
    /SOLAR_STORM/,
    /QUANTUM_RIFT/,
    /BLACKOUT_SURGE/,
    /CRYSTAL_RUSH/,
    /DYSON_ECLIPSE/,
  ]) {
    assert.doesNotMatch(source, duplicatedIdentity);
  }
});

test("J6B-B has no new RNG clock seed mapping execution combat economy scan cap or entity authority", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /\bseed\b/i,
    /recipeId/,
    /BiomeType/,
    /InfiniteMutator/,
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

  assert.match(source, /ownsEventSelectionAuthority: true/);

  for (const requiredFalse of [
    "ownsOpportunitySelectionAuthority",
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

test("J6B-B is not adopted by existing live authorities and leaves J6A/J6B-A ownership frozen", () => {
  for (const existingAuthority of [
    opportunitySource,
    identitySource,
    gameSource,
    sectorSource,
    waveSource,
    mutatorSource,
    effectsSource,
    environmentSource,
  ]) {
    assert.doesNotMatch(existingAuthority, /dynamicMidSectorEventSelection/);
  }

  assert.match(opportunitySource, /opportunityMode:\s*"OPPORTUNITY_ONLY"/);
  assert.match(identitySource, /identityMode:\s*"IDENTITY_ONLY"/);
  assert.match(mutatorSource, /directInfiniteMutatorSelection/);
  assert.match(effectsSource, /projectRuntimeMutatorEffects/);
  assert.match(environmentSource, /getReducedVisibilityOverlayProfile/);
  assert.match(environmentSource, /getResourceFieldProfile/);
});
