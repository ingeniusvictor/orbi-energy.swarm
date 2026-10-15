import assert from "node:assert/strict";
import test from "node:test";

import {
  DYNAMIC_EVENT_MAX_WAVE_COUNT,
  DYNAMIC_EVENT_MIN_WAVE_COUNT,
  DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY_AUTHORITY_CONTRACT,
  resolveDynamicMidSectorEventOpportunity,
  type DynamicMidSectorEventOpportunityFacts,
} from "../../src/game/dynamicMidSectorEventOpportunity.ts";

const createFacts = (
  overrides: Partial<DynamicMidSectorEventOpportunityFacts> = {},
): DynamicMidSectorEventOpportunityFacts => ({
  sourceMode: "INFINITE",
  sector: 37,
  waveIndex: 2,
  waveCount: 3,
  recoverySector: false,
  hasMilestone: false,
  seed: "orbi-infinite",
  recipeId: "sector-37-example",
  ...overrides,
});

const resolveAllWaves = (
  overrides: Partial<DynamicMidSectorEventOpportunityFacts> = {},
) => {
  const waveCount = overrides.waveCount ?? 5;
  return Array.from({ length: waveCount }, (_, index) =>
    resolveDynamicMidSectorEventOpportunity(
      createFacts({
        waveCount,
        waveIndex: index + 1,
        ...overrides,
      }),
    ),
  );
};

test("wave count 3 exposes exactly the only interior wave 2", () => {
  const projections = resolveAllWaves({ waveCount: 3 });
  const opportunities = projections.filter((projection) => projection !== null);

  assert.equal(opportunities.length, 1);
  assert.ok(opportunities[0]);
  assert.equal(opportunities[0].waveIndex, 2);
  assert.equal(opportunities[0].selectedWaveIndex, 2);
  assert.equal(opportunities[0].opportunityMode, "OPPORTUNITY_ONLY");
  assert.equal(opportunities[0].kind, "DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY");
});

test("every certified wave count resolves exactly one deterministic interior opportunity", () => {
  for (
    let waveCount = DYNAMIC_EVENT_MIN_WAVE_COUNT;
    waveCount <= DYNAMIC_EVENT_MAX_WAVE_COUNT;
    waveCount += 1
  ) {
    const projections = resolveAllWaves({
      sector: 40 + waveCount,
      waveCount,
      seed: `seed-${waveCount}`,
      recipeId: `recipe-${waveCount}`,
    });
    const opportunities = projections.filter((projection) => projection !== null);

    assert.equal(opportunities.length, 1, `waveCount=${waveCount}`);
    const opportunity = opportunities[0];
    assert.ok(opportunity);
    assert.ok(opportunity.waveIndex > 1);
    assert.ok(opportunity.waveIndex < waveCount);
    assert.equal(opportunity.waveIndex, opportunity.selectedWaveIndex);
  }
});

test("identical sector identity is deterministic across repeated evaluation", () => {
  const first = resolveAllWaves({
    waveCount: 7,
    sector: 88,
    seed: "deterministic-seed",
    recipeId: "sector-88-deterministic",
  }).find((projection) => projection !== null);
  const second = resolveAllWaves({
    waveCount: 7,
    sector: 88,
    seed: "deterministic-seed",
    recipeId: "sector-88-deterministic",
  }).find((projection) => projection !== null);

  assert.ok(first);
  assert.ok(second);
  assert.deepEqual(second, first);
  assert.equal(Object.isFrozen(first), true);
  assert.match(first.opportunityId, /^j6a:88:[2-6]:[0-9a-f]{8}$/);
  assert.match(first.identityFingerprint, /^[0-9a-f]{8}$/);
});

test("different stable sector identities remain independently bounded to one opportunity", () => {
  const identities = [
    { sector: 41, seed: "alpha", recipeId: "recipe-alpha" },
    { sector: 41, seed: "beta", recipeId: "recipe-alpha" },
    { sector: 42, seed: "alpha", recipeId: "recipe-alpha" },
    { sector: 41, seed: "alpha", recipeId: "recipe-beta" },
  ];

  const resolved = identities.map((identity) => {
    const opportunities = resolveAllWaves({
      ...identity,
      waveCount: 6,
    }).filter((projection) => projection !== null);
    assert.equal(opportunities.length, 1);
    assert.ok(opportunities[0]);
    return opportunities[0];
  });

  assert.equal(new Set(resolved.map((item) => item.opportunityId)).size >= 2, true);
});

test("Campaign recovery milestone first and final waves fail closed", () => {
  assert.equal(
    resolveDynamicMidSectorEventOpportunity(createFacts({ sourceMode: "CAMPAIGN" })),
    null,
  );
  assert.equal(
    resolveDynamicMidSectorEventOpportunity(createFacts({ recoverySector: true })),
    null,
  );
  assert.equal(
    resolveDynamicMidSectorEventOpportunity(createFacts({ hasMilestone: true })),
    null,
  );
  assert.equal(
    resolveDynamicMidSectorEventOpportunity(
      createFacts({ waveCount: 5, waveIndex: 1 }),
    ),
    null,
  );
  assert.equal(
    resolveDynamicMidSectorEventOpportunity(
      createFacts({ waveCount: 5, waveIndex: 5 }),
    ),
    null,
  );
});

test("invalid numeric facts fail closed", () => {
  const invalid: Partial<DynamicMidSectorEventOpportunityFacts>[] = [
    { sector: 10 },
    { sector: 11.5 },
    { sector: Number.NaN },
    { waveCount: 2 },
    { waveCount: 8 },
    { waveCount: 3.5 },
    { waveIndex: 0 },
    { waveIndex: 4, waveCount: 3 },
    { waveIndex: 1.5 },
    { waveIndex: Number.POSITIVE_INFINITY },
  ];

  for (const overrides of invalid) {
    assert.equal(
      resolveDynamicMidSectorEventOpportunity(createFacts(overrides)),
      null,
    );
  }
});

test("empty whitespace and non-canonical stable identity strings fail closed", () => {
  for (const seed of ["", " ", "\t", " seed", "seed "]) {
    assert.equal(
      resolveDynamicMidSectorEventOpportunity(createFacts({ seed })),
      null,
    );
  }
  for (const recipeId of ["", " ", "\t", " recipe", "recipe "]) {
    assert.equal(
      resolveDynamicMidSectorEventOpportunity(createFacts({ recipeId })),
      null,
    );
  }
});

test("J6A output carries no event identity or live effect authority", () => {
  const opportunity = resolveDynamicMidSectorEventOpportunity(createFacts());
  assert.ok(opportunity);
  assert.equal(opportunity.selectsEventIdentity, false);
  assert.equal(opportunity.appliesLiveEffect, false);
  assert.equal(opportunity.mutatesEnvironment, false);
  assert.equal(opportunity.mutatesMutators, false);
  assert.equal(opportunity.spawnsEntities, false);
  assert.equal(opportunity.awardsRewards, false);
});

test("J6A authority contract owns no live event runtime combat economy environment timing scan or cap authority", () => {
  assert.deepEqual(DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY_AUTHORITY_CONTRACT, {
    ownsEventIdentityAuthority: false,
    ownsEventExecutionAuthority: false,
    ownsSectorAuthority: false,
    ownsWaveAuthority: false,
    ownsRecoveryAuthority: false,
    ownsMilestoneAuthority: false,
    ownsSpawnAuthority: false,
    ownsProgressionAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
    ownsMutatorAuthority: false,
    ownsEnvironmentAuthority: false,
    ownsClock: false,
    ownsRandomness: false,
    ownsFullArrayScan: false,
    mayLookupEntities: false,
    mayMutateEntities: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });
  assert.equal(
    Object.isFrozen(DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY_AUTHORITY_CONTRACT),
    true,
  );
});
