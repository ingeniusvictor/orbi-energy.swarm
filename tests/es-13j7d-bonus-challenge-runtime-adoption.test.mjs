import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/bonusChallengeRuntimeAdoption.ts",
  "utf8",
);
const cacheSource = readFileSync(
  "src/game/runtimeProjectionBundleCache.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const completionSource = readFileSync(
  "src/game/runtimeCompletionPolicy.ts",
  "utf8",
);

test("J7D reuses J7C through exactly one projection-cache seam after adaptive and J6", () => {
  assert.match(source, /resolveBonusChallengeTimeboxProjection/);
  assert.doesNotMatch(source, /resolveBonusChallengeOpportunity/);
  assert.doesNotMatch(source, /getBonusChallengeProfile/);

  assert.match(cacheSource, /applyBonusChallengeRuntimeAdoption/);
  assert.match(
    cacheSource,
    /applyAdaptiveInvasionToDescriptor[\s\S]*applyDynamicMidSectorEventRuntimeAdoption[\s\S]*applyBonusChallengeRuntimeAdoption[\s\S]*projectRuntimeCombatPressure[\s\S]*projectRuntimeMutatorEffects/,
  );
  assert.doesNotMatch(gameSource, /bonusChallengeRuntimeAdoption/);
});

test("J7D refuses to overwrite another completion authority", () => {
  assert.match(
    source,
    /descriptor\.completionPolicy\.type !== "BUDGET_AND_CLEAR"/,
  );
  assert.match(source, /return unchanged\(descriptor\)/);
  assert.match(source, /completionPolicy:\s*\{/);
  assert.match(source, /durationMs:\s*projection\.completionProjection\.durationMs/);
});

test("J7D owns no timer clock pause RNG collection scan cap budget combat economy or progression authority", () => {
  for (const forbidden of [
    "MAX_ENEMIES",
    "MAX_PROJECTILES",
    "setTimeout",
    "setInterval",
    "Math.random",
    "Date.now",
    "performance.now",
    "requestAnimationFrame",
    "useRef",
    "useState",
    "waveTimeRemainingRef",
    "enemiesRef",
    "projectilesRef",
    "resourcesRef",
    "spatialIndex",
    "registerCombatDefeat",
    "scoreRef",
    "nanoCredits",
    "enemyBudgetMultiplier",
    "projectileBudget",
  ]) {
    assert.equal(
      source.includes(forbidden),
      false,
      `unexpected J7D authority token: ${forbidden}`,
    );
  }

  assert.doesNotMatch(source, /\.push\(/);
  assert.doesNotMatch(source, /\.splice\(/);
  assert.doesNotMatch(source, /\.find\(/);
  assert.doesNotMatch(source, /\.filter\(/);
  assert.doesNotMatch(source, /\.map\(/);
  assert.doesNotMatch(source, /\.reduce\(/);
  assert.doesNotMatch(source, /new Map/);
  assert.doesNotMatch(source, /new Set/);
});

test("J7D leaves timer pause and completion execution in the existing game/runtime authority", () => {
  assert.match(gameSource, /const waveTimeRemainingRef = useRef\(0\)/);
  assert.match(
    gameSource,
    /waveTimeRemainingRef\.current =\s*[\s\S]*descriptor\.completionPolicy\.type === "TIMEBOX"[\s\S]*descriptor\.completionPolicy\.durationMs/,
  );
  assert.match(
    gameSource,
    /if \(shouldTickRuntimeTimer\(descriptor\)\) \{[\s\S]*waveTimeRemainingRef\.current -= delta/,
  );
  assert.match(
    gameSource,
    /if \(isPausedRef\.current \|\| isUpgradeSelectionOpenRef\.current\)/,
  );
  assert.match(completionSource, /descriptor\.completionPolicy\.type === "TIMEBOX"/);
  assert.match(completionSource, /snapshot\.remainingTimeMs <= 0/);
  assert.doesNotMatch(source, /runtimeCompletionPolicy/);
  assert.doesNotMatch(source, /EnergySwarmGame/);
});

test("projection cache exposes J7D metadata while preserving the existing projection authorities", () => {
  assert.match(
    cacheSource,
    /bonusChallengeAdoption:\s*Readonly<BonusChallengeRuntimeAdoption>\s*\|\s*null/,
  );
  assert.match(
    cacheSource,
    /bonusChallengeAdoption:\s*\n?\s*bonusChallengeProjection\.adoption/,
  );
  assert.match(cacheSource, /getRuntimeMutatedEnemyBudget\(descriptor\)/);
  assert.match(cacheSource, /projectInfiniteMilestoneEncounter\(descriptor\)/);
  assert.doesNotMatch(cacheSource, /MAX_ENEMIES|MAX_PROJECTILES/);
});

test("J7D authority contract has exactly two positive authorities", () => {
  assert.match(source, /ownsLiveAdoptionAuthority:\s*true/);
  assert.match(source, /ownsDescriptorCompletionOverlayAuthority:\s*true/);

  for (const requiredFalse of [
    "ownsChallengeProfileAuthority",
    "ownsOpportunitySelectionAuthority",
    "ownsDurationProjectionAuthority",
    "ownsLiveCompletionPolicyAuthority",
    "ownsTimerAuthority",
    "ownsCompletionCursorAuthority",
    "ownsClock",
    "ownsPauseAuthority",
    "ownsSpawnAuthority",
    "ownsArenaAuthority",
    "ownsProgressionAuthority",
    "ownsEntityCollection",
    "ownsProjectileCollection",
    "ownsDamageAuthority",
    "ownsDefeatAuthority",
    "ownsScoreAuthority",
    "ownsRewardAuthority",
    "ownsEconomyAuthority",
    "ownsHudAuthority",
    "ownsRandomness",
    "ownsHashAuthority",
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
