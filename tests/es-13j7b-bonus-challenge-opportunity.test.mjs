import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/game/bonusChallengeOpportunity.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const cacheSource = readFileSync("src/game/runtimeProjectionBundleCache.ts", "utf8");
const descriptorSource = readFileSync("src/game/runtimeWaveDescriptor.ts", "utf8");
const sessionSource = readFileSync("src/game/infiniteSession.ts", "utf8");

test("J7B is pure opportunity-only and reuses frozen J7A/J6 authorities", () => {
  assert.match(source, /getBonusChallengeProfile/);
  assert.match(source, /resolveDynamicMidSectorEventOpportunity/);
  assert.match(source, /opportunityMode:\s*"OPPORTUNITY_ONLY"/);
  assert.match(source, /challengeId:\s*TIMED_SURVIVAL_PROFILE\.challengeId/);
  assert.match(source, /waveSlotPolicy:\s*"AVOID_J6_WAVE_2"/);
  assert.match(source, /j6WaveTwoOpportunity/);
  assert.doesNotMatch(source, /hashIdentity/);
  assert.doesNotMatch(source, /Math\.imul/);
});

test("J7B freezes the sparse sector cadence and no extra-wave model", () => {
  assert.match(source, /BONUS_CHALLENGE_MIN_INFINITE_SECTOR = 33/);
  assert.match(source, /BONUS_CHALLENGE_SECTOR_CADENCE = 10/);
  assert.match(source, /BONUS_CHALLENGE_SECTOR_OFFSET = 33/);
  assert.match(source, /BONUS_CHALLENGE_MIN_WAVE_COUNT = 4/);
  assert.match(source, /selectedWaveIndex:\s*j6OccupiesWaveTwo \? 3 : 2/);
  assert.doesNotMatch(source, /waveCount\s*\+/);
  assert.doesNotMatch(source, /insert/i);
});

test("J7B has no live adoption into runtime authorities", () => {
  for (const existingAuthority of [
    gameSource,
    cacheSource,
    descriptorSource,
    sessionSource,
  ]) {
    assert.doesNotMatch(existingAuthority, /bonusChallengeOpportunity/);
  }
});

test("J7B owns no timer RNG spawn combat economy HUD collection scan or cap authority", () => {
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
    /\.filter\(/,
    /\.find\(/,
    /\.reduce\(/,
    /\.forEach\(/,
    /MAX_ENEMIES/,
    /MAX_PROJECTILES/,
    /registerCombatDefeat/,
    /nanoCredits/,
    /scoreRef/,
    /waveTimeRemainingRef/,
  ]) {
    assert.doesNotMatch(source, forbidden);
  }

  for (const requiredFalse of [
    "ownsChallengeIdentityAuthority",
    "ownsChallengeExecutionAuthority",
    "ownsSectorAuthority",
    "ownsWaveAuthority",
    "ownsRecoveryAuthority",
    "ownsMilestoneAuthority",
    "ownsCompletionPolicyAuthority",
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

  assert.match(source, /ownsOpportunityEligibilityAuthority: true/);
  assert.match(source, /ownsExistingWaveSlotSelectionAuthority: true/);
});

test("opportunity metadata refuses unresolved live choices", () => {
  for (const requiredFalse of [
    "selectsExactDuration",
    "executesLiveChallenge",
    "mutatesRuntimeDescriptor",
    "startsTimer",
    "altersSpawnComposition",
    "altersArena",
    "awardsRewards",
  ]) {
    assert.match(source, new RegExp(`${requiredFalse}: false`));
  }
});
