import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  "src/game/bonusChallengeTimeboxProjection.ts",
  "utf8",
);
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const cacheSource = readFileSync(
  "src/game/runtimeProjectionBundleCache.ts",
  "utf8",
);
const descriptorSource = readFileSync(
  "src/game/runtimeWaveDescriptor.ts",
  "utf8",
);
const completionSource = readFileSync(
  "src/game/runtimeCompletionPolicy.ts",
  "utf8",
);
const sessionSource = readFileSync("src/game/infiniteSession.ts", "utf8");

test("J7C is pure and derives profile plus opportunity from frozen J7A/J7B", () => {
  assert.match(source, /getBonusChallengeProfile/);
  assert.match(source, /BONUS_CHALLENGE_DURATION_WINDOW_MS/);
  assert.match(source, /resolveBonusChallengeOpportunity/);
  assert.match(source, /projectionMode:\s*"PROJECTION_ONLY"/);
  assert.match(source, /BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS = 30000/);
  assert.match(source, /TIMED_SURVIVAL_DURATION_MIDPOINT_MS/);
  assert.match(source, /completionCompatibility !== "TIMEBOX"/);
  assert.doesNotMatch(source, /BONUS_CHALLENGE_MIN_INFINITE_SECTOR/);
  assert.doesNotMatch(source, /BONUS_CHALLENGE_SECTOR_CADENCE/);
  assert.doesNotMatch(source, /resolveDynamicMidSectorEventOpportunity/);
});

test("J7C has no live adoption into runtime authorities", () => {
  for (const existingAuthority of [
    gameSource,
    cacheSource,
    descriptorSource,
    completionSource,
    sessionSource,
  ]) {
    assert.doesNotMatch(existingAuthority, /bonusChallengeTimeboxProjection/);
  }
});

test("J7C does not import live runtime timing descriptor or Campaign tuning authority", () => {
  for (const forbiddenImport of [
    /EnergySwarmGame/,
    /runtimeProjectionBundleCache/,
    /runtimeWaveDescriptor/,
    /runtimeCompletionPolicy/,
    /infiniteSession/,
    /waveDirector/,
    /WAVES/,
  ]) {
    assert.doesNotMatch(source, forbiddenImport);
  }
});

test("J7C owns no clock timer spawn combat economy HUD collection scan RNG or cap authority", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /EnemyType/,
    /enemiesRef/,
    /projectilesRef/,
    /waveTimeRemainingRef/,
    /\.filter\(/,
    /\.find\(/,
    /\.reduce\(/,
    /\.forEach\(/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /registerCombatDefeat/,
    /nanoCredits/,
    /scoreRef/,
  ]) {
    assert.doesNotMatch(source, forbidden);
  }

  for (const requiredFalse of [
    "ownsOpportunityEligibilityAuthority",
    "ownsExistingWaveSlotSelectionAuthority",
    "ownsChallengeIdentityAuthority",
    "ownsLiveChallengeExecutionAuthority",
    "ownsLiveCompletionPolicyAuthority",
    "ownsDescriptorMutationAuthority",
    "ownsTimerAuthority",
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

  assert.match(source, /ownsExactDurationProjectionAuthority: true/);
  assert.match(source, /ownsCompletionProjectionAuthority: true/);
});

test("J7C projection metadata refuses live execution choices", () => {
  assert.match(source, /selectsExactDuration:\s*true/);
  assert.match(source, /projectsTimeboxCompletion:\s*true/);

  for (const requiredFalse of [
    "executesLiveChallenge",
    "mutatesRuntimeDescriptor",
    "startsTimer",
    "ticksTimer",
    "resetsTimer",
    "ownsPauseLifecycle",
    "altersSpawnComposition",
    "altersArena",
    "changesProgression",
    "awardsScore",
    "awardsRewards",
    "changesEconomy",
    "changesHud",
  ]) {
    assert.match(source, new RegExp(`${requiredFalse}: false`));
  }
});
