import assert from "node:assert/strict";
import test from "node:test";

import {
  BONUS_CHALLENGE_AUTHORITY_CONTRACT,
  BONUS_CHALLENGE_DURATION_WINDOW_MS,
  BONUS_CHALLENGE_IDS,
  BONUS_CHALLENGE_PROFILE_COUNT,
  BONUS_CHALLENGE_PROFILES,
  getBonusChallengeProfile,
} from "../../src/game/bonusChallengeContract.ts";

test("J7A exposes exactly one frozen Timed Survival profile", () => {
  assert.deepEqual(BONUS_CHALLENGE_IDS, ["TIMED_SURVIVAL"]);
  assert.equal(BONUS_CHALLENGE_PROFILE_COUNT, 1);
  assert.equal(Object.isFrozen(BONUS_CHALLENGE_IDS), true);
  assert.equal(Object.isFrozen(BONUS_CHALLENGE_PROFILES), true);
  assert.equal(Object.isFrozen(BONUS_CHALLENGE_DURATION_WINDOW_MS), true);

  const profile = BONUS_CHALLENGE_PROFILES[0];
  assert.ok(profile);
  assert.equal(Object.isFrozen(profile), true);
  assert.equal(profile.challengeId, "TIMED_SURVIVAL");
  assert.equal(profile.displayName, "Timed Survival");
  assert.equal(profile.family, "RHYTHM_BREAKER");
  assert.equal(profile.profileMode, "PROFILE_ONLY");
  assert.equal(profile.objective, "SURVIVE_UNTIL_TIME_EXPIRES");
  assert.equal(profile.completionCompatibility, "TIMEBOX");
  assert.equal(profile.durationWindowMs, BONUS_CHALLENGE_DURATION_WINDOW_MS);
  assert.deepEqual(profile.durationWindowMs, {
    minMs: 20000,
    maxMs: 40000,
  });
});

test("Timed Survival profile is semantic-only and freezes no unresolved live choice", () => {
  const profile = getBonusChallengeProfile("TIMED_SURVIVAL");
  assert.ok(profile);

  assert.equal(profile.requiresFiringRestriction, false);
  assert.equal(profile.requiresObjectiveEntities, false);
  assert.equal(profile.requiresCollectibles, false);
  assert.equal(profile.requiresArenaGeometry, false);
  assert.equal(profile.selectsOpportunity, false);
  assert.equal(profile.selectsCadence, false);
  assert.equal(profile.selectsSourceMode, false);
  assert.equal(profile.choosesExactDuration, false);
  assert.equal(profile.executesLiveChallenge, false);
  assert.equal(profile.mutatesRuntimeDescriptor, false);
  assert.equal(profile.awardsRewards, false);
  assert.equal(profile.appliesFailurePenalty, false);
});

test("unsupported padded and deferred challenge identifiers fail closed", () => {
  for (const unsupported of [
    "",
    " ",
    "TIMED_SURVIVAL ",
    " TIMED_SURVIVAL",
    "timed_survival",
    "PRECISION",
    "RESCUE",
    "COLLECTION",
    "EVASIVE_CORRIDOR",
    "PURSUIT",
    "AFFINITY_PUZZLE",
    "OBSTACLE_NAVIGATION",
    "SURVIVAL_WITHOUT_FIRING",
    "__proto__",
  ]) {
    assert.equal(getBonusChallengeProfile(unsupported), null);
  }
});

test("J7A contract owns no selection live timing spawn combat economy HUD scan RNG or cap authority", () => {
  assert.deepEqual(BONUS_CHALLENGE_AUTHORITY_CONTRACT, {
    ownsOpportunitySelectionAuthority: false,
    ownsChallengeSelectionAuthority: false,
    ownsLiveAdoptionAuthority: false,
    ownsDescriptorMutationAuthority: false,
    ownsCompletionPolicyAuthority: false,
    ownsTimerAuthority: false,
    ownsClock: false,
    ownsPauseAuthority: false,
    ownsSpawnAuthority: false,
    ownsArenaAuthority: false,
    ownsProgressionAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
    ownsHudAuthority: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });
});

test("profile lookup is deterministic and returns the frozen canonical object", () => {
  const first = getBonusChallengeProfile("TIMED_SURVIVAL");
  const second = getBonusChallengeProfile("TIMED_SURVIVAL");
  assert.ok(first);
  assert.equal(second, first);
  assert.equal(first, BONUS_CHALLENGE_PROFILES[0]);
});
