import assert from "node:assert/strict";
import test from "node:test";

import {
  BONUS_CHALLENGE_MAX_WAVE_COUNT,
  BONUS_CHALLENGE_MIN_INFINITE_SECTOR,
  BONUS_CHALLENGE_MIN_WAVE_COUNT,
  BONUS_CHALLENGE_OPPORTUNITY_AUTHORITY_CONTRACT,
  BONUS_CHALLENGE_SECTOR_CADENCE,
  BONUS_CHALLENGE_SECTOR_OFFSET,
  isBonusChallengeCadenceSector,
  resolveBonusChallengeOpportunity,
  type BonusChallengeOpportunityFacts,
} from "../../src/game/bonusChallengeOpportunity.ts";
import { resolveDynamicMidSectorEventOpportunity } from "../../src/game/dynamicMidSectorEventOpportunity.ts";
import {
  isRuntimeSiegeCadenceSector,
  isRuntimeTacticalCadenceSector,
  isRuntimeTacticalRecoverySector,
} from "../../src/game/runtimeTacticalEnemyAdoption.ts";

const factsFor = (
  overrides: Partial<BonusChallengeOpportunityFacts> = {},
): BonusChallengeOpportunityFacts => ({
  sourceMode: "INFINITE",
  sector: 33,
  waveIndex: 2,
  waveCount: 4,
  recoverySector: false,
  hasMilestone: false,
  seed: "infinite-seed-33",
  recipeId: "infinite-sector-33",
  ...overrides,
});

const resolveJ6SelectedWave = (
  facts: Omit<BonusChallengeOpportunityFacts, "waveIndex">,
): number | null => {
  for (let waveIndex = 2; waveIndex < facts.waveCount; waveIndex += 1) {
    const opportunity = resolveDynamicMidSectorEventOpportunity({
      ...facts,
      waveIndex,
    });
    if (opportunity) return opportunity.selectedWaveIndex;
  }
  return null;
};

const resolveJ7OpportunityForSector = (
  facts: Omit<BonusChallengeOpportunityFacts, "waveIndex">,
) => {
  const matches = [];
  for (let waveIndex = 1; waveIndex <= facts.waveCount; waveIndex += 1) {
    const opportunity = resolveBonusChallengeOpportunity({
      ...facts,
      waveIndex,
    });
    if (opportunity) matches.push(opportunity);
  }
  return matches;
};

test("J7B freezes the sparse Infinite cadence at 33 + 10k", () => {
  assert.equal(BONUS_CHALLENGE_MIN_INFINITE_SECTOR, 33);
  assert.equal(BONUS_CHALLENGE_SECTOR_CADENCE, 10);
  assert.equal(BONUS_CHALLENGE_SECTOR_OFFSET, 33);
  assert.equal(BONUS_CHALLENGE_MIN_WAVE_COUNT, 4);
  assert.equal(BONUS_CHALLENGE_MAX_WAVE_COUNT, 7);

  const firstSectors = [];
  for (let sector = 11; sector <= 103; sector += 1) {
    if (isBonusChallengeCadenceSector(sector)) firstSectors.push(sector);
  }

  assert.deepEqual(firstSectors, [33, 43, 53, 63, 73, 83, 93, 103]);
});

test("J7B sector cadence is disjoint from milestone recovery RIFT and SIEGE rhythms", () => {
  for (let sector = 33; sector <= 1003; sector += 10) {
    assert.equal(sector % 5 === 0, false, `milestone overlap at sector ${sector}`);
    assert.equal(
      isRuntimeTacticalRecoverySector(sector),
      false,
      `recovery overlap at sector ${sector}`,
    );
    assert.equal(
      isRuntimeTacticalCadenceSector(sector),
      false,
      `RIFT cadence overlap at sector ${sector}`,
    );
    assert.equal(
      isRuntimeSiegeCadenceSector(sector),
      false,
      `SIEGE cadence overlap at sector ${sector}`,
    );
  }
});

test("J7B selects exactly one existing interior slot and never collides with J6", () => {
  const sectors = [33, 43, 53, 63, 73, 83, 93, 103];
  const seeds = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta"];

  for (const sector of sectors) {
    for (let waveCount = 4; waveCount <= 7; waveCount += 1) {
      for (const seed of seeds) {
        const baseFacts = {
          sourceMode: "INFINITE" as const,
          sector,
          waveCount,
          recoverySector: false,
          hasMilestone: false,
          seed: `${seed}-${sector}-${waveCount}`,
          recipeId: `recipe-${sector}-${waveCount}`,
        };

        const j6SelectedWave = resolveJ6SelectedWave(baseFacts);
        assert.notEqual(j6SelectedWave, null);

        const j7Matches = resolveJ7OpportunityForSector(baseFacts);
        assert.equal(j7Matches.length, 1);

        const [j7] = j7Matches;
        assert.ok(j7);
        assert.equal(j7.challengeId, "TIMED_SURVIVAL");
        assert.equal(j7.opportunityMode, "OPPORTUNITY_ONLY");
        assert.equal(j7.sourceMode, "INFINITE");
        assert.equal(j7.sector, sector);
        assert.equal(j7.waveCount, waveCount);
        assert.equal(j7.waveIndex, j7.selectedWaveIndex);
        assert.equal(j7.waveSlotPolicy, "AVOID_J6_WAVE_2");
        assert.notEqual(j7.selectedWaveIndex, j6SelectedWave);
        assert.ok(j7.selectedWaveIndex === 2 || j7.selectedWaveIndex === 3);
        assert.equal(j7.j6OccupiesWaveTwo, j6SelectedWave === 2);
        assert.equal(j7.selectedWaveIndex, j6SelectedWave === 2 ? 3 : 2);
      }
    }
  }
});

test("J7B fails closed outside source cadence wave-count identity and protected boundaries", () => {
  for (const invalid of [
    factsFor({ sourceMode: "CAMPAIGN" }),
    factsFor({ sector: 32 }),
    factsFor({ sector: 34 }),
    factsFor({ sector: 43, recoverySector: true }),
    factsFor({ sector: 43, hasMilestone: true }),
    factsFor({ waveCount: 3 }),
    factsFor({ waveCount: 8 }),
    factsFor({ waveIndex: 1 }),
    factsFor({ waveIndex: 4 }),
    factsFor({ waveIndex: 0 }),
    factsFor({ waveIndex: 5 }),
    factsFor({ seed: "" }),
    factsFor({ seed: " seed" }),
    factsFor({ seed: "seed " }),
    factsFor({ recipeId: "" }),
    factsFor({ recipeId: " recipe" }),
    factsFor({ recipeId: "recipe " }),
  ]) {
    assert.equal(resolveBonusChallengeOpportunity(invalid), null);
  }
});

test("non-selected interior waves fail closed without mutating upstream facts", () => {
  const baseFacts = factsFor({ sector: 53, waveCount: 5 });
  const before = structuredClone(baseFacts);
  const matches = resolveJ7OpportunityForSector({
    sourceMode: baseFacts.sourceMode,
    sector: baseFacts.sector,
    waveCount: baseFacts.waveCount,
    recoverySector: baseFacts.recoverySector,
    hasMilestone: baseFacts.hasMilestone,
    seed: baseFacts.seed,
    recipeId: baseFacts.recipeId,
  });
  assert.equal(matches.length, 1);
  assert.deepEqual(baseFacts, before);
});

test("J7B owns only pure opportunity eligibility and existing-slot selection", () => {
  assert.deepEqual(BONUS_CHALLENGE_OPPORTUNITY_AUTHORITY_CONTRACT, {
    ownsOpportunityEligibilityAuthority: true,
    ownsExistingWaveSlotSelectionAuthority: true,
    ownsChallengeIdentityAuthority: false,
    ownsChallengeExecutionAuthority: false,
    ownsSectorAuthority: false,
    ownsWaveAuthority: false,
    ownsRecoveryAuthority: false,
    ownsMilestoneAuthority: false,
    ownsCompletionPolicyAuthority: false,
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
