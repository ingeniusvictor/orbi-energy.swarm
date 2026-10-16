import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("src/game/bonusChallengeContract.ts", "utf8");
const gameSource = readFileSync("src/game/EnergySwarmGame.tsx", "utf8");
const descriptorSource = readFileSync("src/game/runtimeWaveDescriptor.ts", "utf8");
const completionSource = readFileSync("src/game/runtimeCompletionPolicy.ts", "utf8");
const sessionSource = readFileSync("src/game/infiniteSession.ts", "utf8");

test("J7A is a standalone profile-only contract with no imports", () => {
  assert.doesNotMatch(source, /^import\s/m);
  assert.match(source, /profileMode:\s*"PROFILE_ONLY"/);
  assert.match(source, /family:\s*"RHYTHM_BREAKER"/);
  assert.match(source, /objective:\s*"SURVIVE_UNTIL_TIME_EXPIRES"/);
  assert.match(source, /completionCompatibility:\s*"TIMEBOX"/);
  assert.match(source, /minMs:\s*20000/);
  assert.match(source, /maxMs:\s*40000/);
  assert.doesNotMatch(source, /35000/);
});

test("J7A activates only Timed Survival and leaves other roadmap candidates uncontracted", () => {
  assert.match(source, /"TIMED_SURVIVAL"/);

  for (const deferredCandidate of [
    /PRECISION/,
    /RESCUE/,
    /COLLECTION/,
    /EVASIVE_CORRIDOR/,
    /PURSUIT/,
    /AFFINITY_PUZZLE/,
    /OBSTACLE_NAVIGATION/,
    /SURVIVAL_WITHOUT_FIRING/,
  ]) {
    assert.doesNotMatch(source, deferredCandidate);
  }
});

test("J7A has no live adoption into runtime authorities", () => {
  for (const existingAuthority of [
    gameSource,
    descriptorSource,
    completionSource,
    sessionSource,
  ]) {
    assert.doesNotMatch(existingAuthority, /bonusChallengeContract/);
  }

  assert.match(completionSource, /case "TIMEBOX"/);
  assert.match(completionSource, /shouldTickRuntimeTimer/);
  assert.match(gameSource, /descriptor\.completionPolicy\.durationMs/);
  assert.match(gameSource, /if \(isPausedRef\.current \|\| isUpgradeSelectionOpenRef\.current\)/);
});

test("J7A owns no cadence live timer spawn combat economy HUD scan RNG or cap authority", () => {
  for (const forbidden of [
    /Math\.random/,
    /Date\.now/,
    /performance\.now/,
    /requestAnimationFrame/,
    /setTimeout/,
    /setInterval/,
    /RuntimeWaveDescriptor/,
    /EnergySwarmGame/,
    /EnemyType/,
    /BiomeType/,
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
    "ownsOpportunitySelectionAuthority",
    "ownsChallengeSelectionAuthority",
    "ownsLiveAdoptionAuthority",
    "ownsDescriptorMutationAuthority",
    "ownsCompletionPolicyAuthority",
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

test("profile metadata explicitly refuses unresolved J7A live decisions", () => {
  for (const requiredFalse of [
    "requiresFiringRestriction",
    "requiresObjectiveEntities",
    "requiresCollectibles",
    "requiresArenaGeometry",
    "selectsOpportunity",
    "selectsCadence",
    "selectsSourceMode",
    "choosesExactDuration",
    "executesLiveChallenge",
    "mutatesRuntimeDescriptor",
    "awardsRewards",
    "appliesFailurePenalty",
  ]) {
    assert.match(source, new RegExp(`${requiredFalse}: false`));
  }
});
