import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/dynamicMidSectorEventEffectMapping.ts",
  "utf8",
);
const identitySource = readFileSync(
  "src/game/dynamicMidSectorEventIdentity.ts",
  "utf8",
);
const selectionSource = readFileSync(
  "src/game/dynamicMidSectorEventSelection.ts",
  "utf8",
);
const sectorSource = readFileSync("src/game/infiniteSectorDirector.ts", "utf8");
const effectsSource = readFileSync("src/game/runtimeMutatorEffects.ts", "utf8");
const environmentSource = readFileSync(
  "src/game/runtimeEnvironmentalFields.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const mutatorDirectorSource = readFileSync(
  "src/game/infiniteMutatorDirector.ts",
  "utf8",
);

test("J6B-C depends only on frozen identity selection and Infinite mutator vocabulary, never runtime effect application", () => {
  assert.match(source, /from "\.\/dynamicMidSectorEventIdentity"/);
  assert.match(source, /from "\.\/dynamicMidSectorEventSelection"/);
  assert.match(source, /import type \{ InfiniteMutator \} from "\.\/infiniteSectorDirector"/);
  assert.doesNotMatch(source, /runtimeMutatorEffects/);
  assert.doesNotMatch(source, /runtimeEnvironmentalFields/);
  assert.doesNotMatch(source, /infiniteMutatorDirector/);
  assert.doesNotMatch(source, /EnergySwarmGame/);
});

test("J6B-C freezes exactly four pre-existing environmental compatibility mappings and one explicit unmapped identity", () => {
  assert.match(source, /SOLAR_STORM:\s*"ELECTRICAL_STORM"/);
  assert.match(source, /QUANTUM_RIFT:\s*"MAGNETIC_DRIFT"/);
  assert.match(source, /BLACKOUT_SURGE:\s*"REDUCED_VISIBILITY"/);
  assert.match(source, /CRYSTAL_RUSH:\s*"UNSTABLE_RESOURCE_FIELDS"/);
  assert.match(source, /DYSON_ECLIPSE:\s*null/);
  assert.match(source, /mappingStatus:\s*"UNMAPPED"/);
  assert.match(source, /mappedMutator:\s*null/);
  assert.match(source, /mappingStatus:\s*"MAPPED"/);
  assert.match(source, /mappingMode:\s*"COMPATIBILITY_ONLY"/);
});

test("the four mapped semantics already exist with bounded frozen runtime magnitudes, which J6B-C does not copy", () => {
  assert.match(
    effectsSource,
    /ELECTRICAL_STORM:\s*\{\s*electricalStormIntensity:\s*1,?\s*\}/s,
  );
  assert.match(
    effectsSource,
    /MAGNETIC_DRIFT:\s*\{\s*magneticDriftStrength:\s*0\.18,?\s*\}/s,
  );
  assert.match(
    effectsSource,
    /REDUCED_VISIBILITY:\s*\{\s*visibilityScale:\s*0\.7,?\s*\}/s,
  );
  assert.match(
    effectsSource,
    /UNSTABLE_RESOURCE_FIELDS:\s*\{\s*resourceFieldInstability:\s*0\.3,?\s*\}/s,
  );

  for (const forbiddenMagnitude of [
    /electricalStormIntensity/,
    /magneticDriftStrength/,
    /visibilityScale/,
    /resourceFieldInstability/,
  ]) {
    assert.doesNotMatch(source, forbiddenMagnitude);
  }
});

test("J6B-C revalidates the exact frozen J6B-B selection identity instead of trusting forged metadata", () => {
  assert.match(source, /selection\.kind !== "DYNAMIC_MID_SECTOR_EVENT_SELECTION"/);
  assert.match(source, /selection\.selectionMode !== "SELECTION_ONLY"/);
  assert.match(source, /selection\.sourceMode !== "INFINITE"/);
  assert.match(source, /EXACT_IDENTITY_FINGERPRINT = \/\^\[0-9a-f\]\{8\}\$\//);
  assert.match(
    source,
    /Number\.parseInt\(selection\.identityFingerprint, 16\) %\s*DYNAMIC_MID_SECTOR_EVENT_IDS\.length/,
  );
  assert.match(
    source,
    /selection\.eventId !== DYNAMIC_MID_SECTOR_EVENT_IDS\[expectedSelectionIndex\]/,
  );
  assert.match(
    source,
    /`j6a:\$\{selection\.sector\}:\$\{selection\.waveIndex\}:\$\{selection\.identityFingerprint\}`/,
  );
});

test("J6B-C has no runtime mutation RNG clock seed recipe combat economy scan cap or entity authority", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /\bseed\b/i,
    /recipeId/,
    /projectRuntimeMutatorEffects/,
    /getReducedVisibilityOverlayProfile/,
    /getResourceFieldProfile/,
    /directInfiniteMutatorSelection/,
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

  assert.match(source, /ownsCompatibilityMappingAuthority:\s*true/);
  assert.match(source, /ownsMutatorMappingAuthority:\s*true/);

  for (const requiredFalse of [
    "ownsOpportunitySelectionAuthority",
    "ownsEventSelectionAuthority",
    "ownsMutatorApplicationAuthority",
    "ownsEventExecutionAuthority",
    "ownsEnvironmentAuthority",
    "ownsRecipeAuthority",
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
    "mayMutateEnvironment",
    "mayMutateGlobalCaps",
    "mayCreateEntities",
    "mayRemoveEntities",
  ]) {
    assert.match(source, new RegExp(`${requiredFalse}: false`));
  }

  assert.match(source, /appliesMutatorEffect:\s*false/);
  assert.match(source, /executesLiveEffect:\s*false/);
  assert.match(source, /mutatesEnvironment:\s*false/);
});

test("J6B-C is not adopted by existing live authorities and leaves J6B-A/J6B-B contracts frozen", () => {
  for (const existingAuthority of [
    identitySource,
    selectionSource,
    sectorSource,
    effectsSource,
    environmentSource,
    gameSource,
    mutatorDirectorSource,
  ]) {
    assert.doesNotMatch(existingAuthority, /dynamicMidSectorEventEffectMapping/);
  }

  assert.match(identitySource, /identityMode:\s*"IDENTITY_ONLY"/);
  assert.match(selectionSource, /selectionMode:\s*"SELECTION_ONLY"/);
  assert.match(selectionSource, /mapsToMutatorEffect:\s*false/);
  assert.match(effectsSource, /projectRuntimeMutatorEffects/);
  assert.match(environmentSource, /getReducedVisibilityOverlayProfile/);
  assert.match(environmentSource, /getResourceFieldProfile/);
});
