import assert from "node:assert/strict";
import test from "node:test";

import {
  BONUS_CHALLENGE_DURATION_WINDOW_MS,
  getBonusChallengeProfile,
} from "../../src/game/bonusChallengeContract.ts";
import {
  resolveBonusChallengeOpportunity,
  type BonusChallengeOpportunityFacts,
} from "../../src/game/bonusChallengeOpportunity.ts";
import {
  BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS,
  BONUS_CHALLENGE_TIMEBOX_PROJECTION_AUTHORITY_CONTRACT,
  resolveBonusChallengeTimeboxProjection,
} from "../../src/game/bonusChallengeTimeboxProjection.ts";
import { WAVES } from "../../src/game/waveDirector.ts";

const factsFor = (
  overrides: Partial<BonusChallengeOpportunityFacts> = {},
): BonusChallengeOpportunityFacts => ({
  sourceMode: "INFINITE",
  sector: 33,
  waveIndex: 2,
  waveCount: 4,
  recoverySector: false,
  hasMilestone: false,
  seed: "j7c-seed-33",
  recipeId: "j7c-recipe-33",
  ...overrides,
});

const resolveEligibleFacts = (
  sector: number,
  waveCount: number,
  seed: string,
): BonusChallengeOpportunityFacts => {
  for (let waveIndex = 2; waveIndex < waveCount; waveIndex += 1) {
    const facts = factsFor({
      sector,
      waveIndex,
      waveCount,
      seed: `${seed}-${sector}-${waveCount}`,
      recipeId: `recipe-${sector}-${waveCount}`,
    });
    if (resolveBonusChallengeOpportunity(facts)) return facts;
  }

  throw new Error(`No J7B opportunity for sector ${sector} / ${waveCount}.`);
};

test("J7C freezes the exact Timed Survival duration at the J7A midpoint", () => {
  const profile = getBonusChallengeProfile("TIMED_SURVIVAL");
  assert.ok(profile);

  const midpoint =
    (BONUS_CHALLENGE_DURATION_WINDOW_MS.minMs +
      BONUS_CHALLENGE_DURATION_WINDOW_MS.maxMs) /
    2;

  assert.equal(BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS, 30000);
  assert.equal(BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS, midpoint);
  assert.ok(
    BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS >= profile.durationWindowMs.minMs,
  );
  assert.ok(
    BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS <= profile.durationWindowMs.maxMs,
  );

  const minimumCampaignDurationMs = Math.min(...WAVES.map((wave) => wave.duration));
  assert.equal(minimumCampaignDurationMs, 35000);
  assert.ok(
    BONUS_CHALLENGE_TIMED_SURVIVAL_DURATION_MS < minimumCampaignDurationMs,
  );
});

test("J7C projects immutable TIMEBOX metadata only for the frozen J7B opportunity", () => {
  for (const sector of [33, 43, 53, 63, 73]) {
    for (let waveCount = 4; waveCount <= 7; waveCount += 1) {
      const facts = resolveEligibleFacts(sector, waveCount, "projection");
      const before = structuredClone(facts);
      const opportunity = resolveBonusChallengeOpportunity(facts);
      const projection = resolveBonusChallengeTimeboxProjection(facts);

      assert.ok(opportunity);
      assert.ok(projection);
      assert.equal(Object.isFrozen(projection), true);
      assert.equal(Object.isFrozen(projection.completionProjection), true);
      assert.equal(projection.kind, "BONUS_CHALLENGE_TIMEBOX_PROJECTION");
      assert.equal(projection.projectionMode, "PROJECTION_ONLY");
      assert.equal(projection.challengeId, "TIMED_SURVIVAL");
      assert.equal(projection.sourceMode, "INFINITE");
      assert.equal(projection.objective, "SURVIVE_UNTIL_TIME_EXPIRES");
      assert.equal(projection.sector, opportunity.sector);
      assert.equal(projection.waveIndex, opportunity.waveIndex);
      assert.equal(projection.waveCount, opportunity.waveCount);
      assert.equal(projection.selectedWaveIndex, opportunity.selectedWaveIndex);
      assert.equal(projection.opportunityId, opportunity.opportunityId);
      assert.equal(projection.exactDurationMs, 30000);
      assert.deepEqual(projection.completionProjection, {
        type: "TIMEBOX",
        durationMs: 30000,
      });
      assert.equal(projection.selectsExactDuration, true);
      assert.equal(projection.projectsTimeboxCompletion, true);
      assert.equal(projection.executesLiveChallenge, false);
      assert.equal(projection.mutatesRuntimeDescriptor, false);
      assert.equal(projection.startsTimer, false);
      assert.equal(projection.ticksTimer, false);
      assert.equal(projection.resetsTimer, false);
      assert.equal(projection.ownsPauseLifecycle, false);
      assert.equal(projection.altersSpawnComposition, false);
      assert.equal(projection.altersArena, false);
      assert.equal(projection.changesProgression, false);
      assert.equal(projection.awardsScore, false);
      assert.equal(projection.awardsRewards, false);
      assert.equal(projection.changesEconomy, false);
      assert.equal(projection.changesHud, false);
      assert.deepEqual(facts, before);
    }
  }
});

test("J7C is deterministic and reuses one frozen completion projection", () => {
  const facts = resolveEligibleFacts(83, 6, "deterministic");
  const first = resolveBonusChallengeTimeboxProjection(facts);
  const second = resolveBonusChallengeTimeboxProjection(facts);

  assert.ok(first);
  assert.ok(second);
  assert.deepEqual(second, first);
  assert.equal(second.completionProjection, first.completionProjection);
});

test("J7C fails closed whenever the frozen J7B opportunity does not resolve", () => {
  const selectedFacts = resolveEligibleFacts(43, 5, "fail-closed");
  const nonSelectedWave = selectedFacts.waveIndex === 2 ? 3 : 2;

  for (const invalid of [
    factsFor({ sourceMode: "CAMPAIGN" }),
    factsFor({ sector: 34 }),
    factsFor({ sector: 43, recoverySector: true }),
    factsFor({ sector: 43, hasMilestone: true }),
    factsFor({ waveCount: 3 }),
    factsFor({ waveCount: 8 }),
    factsFor({ seed: "" }),
    factsFor({ seed: " seed" }),
    factsFor({ recipeId: "recipe " }),
    { ...selectedFacts, waveIndex: nonSelectedWave },
  ]) {
    assert.equal(resolveBonusChallengeOpportunity(invalid), null);
    assert.equal(resolveBonusChallengeTimeboxProjection(invalid), null);
  }
});

test("J7C owns only exact-duration and completion-projection authority", () => {
  assert.deepEqual(BONUS_CHALLENGE_TIMEBOX_PROJECTION_AUTHORITY_CONTRACT, {
    ownsExactDurationProjectionAuthority: true,
    ownsCompletionProjectionAuthority: true,
    ownsOpportunityEligibilityAuthority: false,
    ownsExistingWaveSlotSelectionAuthority: false,
    ownsChallengeIdentityAuthority: false,
    ownsLiveChallengeExecutionAuthority: false,
    ownsLiveCompletionPolicyAuthority: false,
    ownsDescriptorMutationAuthority: false,
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
    ownsHashAuthority: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });
});
