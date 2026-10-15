import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/dynamicMidSectorEventRuntimeAdoption.ts",
  "utf8",
);
const cacheSource = readFileSync(
  "src/game/runtimeProjectionBundleCache.ts",
  "utf8",
);
const gameSource = readFileSync(
  "src/game/EnergySwarmGame.tsx",
  "utf8",
);
const effectsSource = readFileSync(
  "src/game/runtimeMutatorEffects.ts",
  "utf8",
);
const environmentalSource = readFileSync(
  "src/game/runtimeEnvironmentalFields.ts",
  "utf8",
);
const stormSource = readFileSync(
  "src/game/runtimeElectricalStorm.ts",
  "utf8",
);

test("J6B-D reuses the frozen J6A J6B-B J6B-C chain and one projection-cache seam", () => {
  assert.match(source, /resolveDynamicMidSectorEventOpportunity/);
  assert.match(source, /resolveDynamicMidSectorEventSelection/);
  assert.match(source, /resolveDynamicMidSectorEventEffectMapping/);
  assert.match(cacheSource, /applyDynamicMidSectorEventRuntimeAdoption/);
  assert.match(
    cacheSource,
    /applyAdaptiveInvasionToDescriptor[\s\S]*applyDynamicMidSectorEventRuntimeAdoption[\s\S]*projectRuntimeCombatPressure[\s\S]*projectRuntimeMutatorEffects/,
  );
  assert.doesNotMatch(gameSource, /dynamicMidSectorEventRuntimeAdoption/);
});

test("J6B-D owns no environmental tuning clock RNG entity collection scan cap budget or economy authority", () => {
  for (const forbidden of [
    "MAX_ENEMIES",
    "MAX_PROJECTILES",
    "setTimeout",
    "setInterval",
    "Math.random",
    "Date.now",
    "performance.now",
    "requestAnimationFrame",
    "enemiesRef",
    "projectilesRef",
    "resourcesRef",
    "spatialIndex",
    "enemyBudgetMultiplier",
    "projectileBudget",
    "baseDamage",
    "strikeRadius",
    "visibilityScale:",
    "magneticDriftStrength:",
    "resourceFieldInstability:",
    "electricalStormIntensity:",
    "score",
    "reward",
    "nanoCredits",
  ]) {
    assert.equal(
      source.includes(forbidden),
      false,
      `unexpected J6B-D authority token: ${forbidden}`,
    );
  }

  assert.doesNotMatch(source, /runtimeEnvironmentalFields/);
  assert.doesNotMatch(source, /runtimeElectricalStorm/);
  assert.doesNotMatch(source, /EnergySwarmGame/);
  assert.doesNotMatch(source, /\.push\(/);
  assert.doesNotMatch(source, /\.splice\(/);
  assert.doesNotMatch(source, /\.find\(/);
  assert.doesNotMatch(source, /\.filter\(/);
  assert.doesNotMatch(source, /\.map\(/);
  assert.doesNotMatch(source, /new Map/);
  assert.doesNotMatch(source, /new Set/);
});

test("J6B-D maps only through existing mutator semantics and does not duplicate their magnitudes", () => {
  assert.match(effectsSource, /ELECTRICAL_STORM:[\s\S]*electricalStormIntensity:\s*1/);
  assert.match(effectsSource, /REDUCED_VISIBILITY:[\s\S]*visibilityScale:\s*0\.7/);
  assert.match(effectsSource, /MAGNETIC_DRIFT:[\s\S]*magneticDriftStrength:\s*0\.18/);
  assert.match(effectsSource, /UNSTABLE_RESOURCE_FIELDS:[\s\S]*resourceFieldInstability:\s*0\.3/);
  assert.match(environmentalSource, /getReducedVisibilityOverlayProfile/);
  assert.match(environmentalSource, /getResourceFieldProfile/);
  assert.match(stormSource, /initialDelayMs:\s*3200/);
  assert.match(stormSource, /Math\.max\([\s\S]*1200,[\s\S]*fairnessTelegraphMs/);

  for (const magnitude of ["0.7", "0.18", "0.3", "3200", "1200"]) {
    assert.equal(
      source.includes(magnitude),
      false,
      `J6B-D must not copy runtime tuning magnitude ${magnitude}`,
    );
  }
});

test("J6B-D explicitly freezes current-wave lifecycle and fail-closed DYSON behavior without mutable runtime state", () => {
  assert.match(source, /adoptionMode:\s*"CURRENT_WAVE_ONLY"/);
  assert.match(source, /mappingStatus === "UNMAPPED"/);
  assert.match(source, /mappedMutator:\s*null/);
  assert.match(source, /addsMappedMutator:\s*false/);
  assert.match(source, /appliesExistingMutatorSemantics:\s*false/);
  assert.match(source, /ownsLifecycleTimer:\s*false/);
  assert.match(source, /mutatesRecipe:\s*false/);
  assert.match(source, /mutatesSession:\s*false/);
  assert.match(source, /mutatesEnvironmentDirectly:\s*false/);
  assert.doesNotMatch(source, /useRef|useState|class\s+/);
});

test("projection cache exposes adoption metadata but preserves existing authority ordering", () => {
  assert.match(
    cacheSource,
    /dynamicEventAdoption:\s*Readonly<DynamicMidSectorEventRuntimeAdoption>\s*\|\s*null/,
  );
  assert.match(
    cacheSource,
    /dynamicEventAdoption:\s*\n?\s*dynamicEventProjection\.adoption/,
  );
  assert.match(cacheSource, /getRuntimeMutatedEnemyBudget\(descriptor\)/);
  assert.match(cacheSource, /projectInfiniteMilestoneEncounter\(descriptor\)/);
  assert.doesNotMatch(cacheSource, /MAX_ENEMIES|MAX_PROJECTILES/);
});
