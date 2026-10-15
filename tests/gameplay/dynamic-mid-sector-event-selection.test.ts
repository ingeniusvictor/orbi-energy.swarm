import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveDynamicMidSectorEventOpportunity,
  type DynamicMidSectorEventOpportunity,
} from "../../src/game/dynamicMidSectorEventOpportunity.ts";
import {
  DYNAMIC_MID_SECTOR_EVENT_IDS,
  type DynamicMidSectorEventId,
} from "../../src/game/dynamicMidSectorEventIdentity.ts";
import {
  DYNAMIC_MID_SECTOR_EVENT_SELECTION_AUTHORITY_CONTRACT,
  resolveDynamicMidSectorEventSelection,
} from "../../src/game/dynamicMidSectorEventSelection.ts";

const createOpportunity = (
  overrides: Partial<DynamicMidSectorEventOpportunity> = {},
): DynamicMidSectorEventOpportunity => {
  const sector = overrides.sector ?? 37;
  const waveCount = overrides.waveCount ?? 5;
  const selectedWaveIndex = overrides.selectedWaveIndex ?? 3;
  const waveIndex = overrides.waveIndex ?? selectedWaveIndex;
  const identityFingerprint = overrides.identityFingerprint ?? "00000002";

  return {
    kind: overrides.kind ?? "DYNAMIC_MID_SECTOR_EVENT_OPPORTUNITY",
    opportunityMode: overrides.opportunityMode ?? "OPPORTUNITY_ONLY",
    sourceMode: overrides.sourceMode ?? "INFINITE",
    sector,
    waveIndex,
    waveCount,
    selectedWaveIndex,
    opportunityId:
      overrides.opportunityId ??
      `j6a:${sector}:${selectedWaveIndex}:${identityFingerprint}`,
    identityFingerprint,
    selectsEventIdentity: overrides.selectsEventIdentity ?? false,
    appliesLiveEffect: overrides.appliesLiveEffect ?? false,
    mutatesEnvironment: overrides.mutatesEnvironment ?? false,
    mutatesMutators: overrides.mutatesMutators ?? false,
    spawnsEntities: overrides.spawnsEntities ?? false,
    awardsRewards: overrides.awardsRewards ?? false,
  };
};

const resolveMalformed = (overrides: Record<string, unknown>) =>
  resolveDynamicMidSectorEventSelection({
    ...createOpportunity(),
    ...overrides,
  } as unknown as DynamicMidSectorEventOpportunity);

test("J6B-B deterministically maps the existing fingerprint onto exactly the five frozen J6B-A IDs", () => {
  const expected: readonly DynamicMidSectorEventId[] = [
    "SOLAR_STORM",
    "QUANTUM_RIFT",
    "BLACKOUT_SURGE",
    "CRYSTAL_RUSH",
    "DYSON_ECLIPSE",
  ];

  assert.deepEqual(DYNAMIC_MID_SECTOR_EVENT_IDS, expected);

  for (let selectionIndex = 0; selectionIndex < expected.length; selectionIndex += 1) {
    const identityFingerprint = selectionIndex.toString(16).padStart(8, "0");
    const selection = resolveDynamicMidSectorEventSelection(
      createOpportunity({ identityFingerprint }),
    );

    assert.ok(selection);
    assert.equal(selection.selectionIndex, selectionIndex);
    assert.equal(selection.eventId, expected[selectionIndex]);
    assert.equal(selection.selectionMode, "SELECTION_ONLY");
    assert.equal(selection.kind, "DYNAMIC_MID_SECTOR_EVENT_SELECTION");
    assert.equal(Object.isFrozen(selection), true);
  }
});

test("identical valid opportunity metadata produces identical immutable selection metadata", () => {
  const opportunity = createOpportunity({ identityFingerprint: "deadbeef" });
  const first = resolveDynamicMidSectorEventSelection(opportunity);
  const second = resolveDynamicMidSectorEventSelection(opportunity);

  assert.ok(first);
  assert.ok(second);
  assert.deepEqual(second, first);
  assert.equal(first.opportunityId, opportunity.opportunityId);
  assert.equal(first.identityFingerprint, opportunity.identityFingerprint);
  assert.equal(first.sourceMode, "INFINITE");
  assert.equal(first.selectsOpportunity, false);
  assert.equal(first.selectsEventIdentity, true);
  assert.equal(first.mapsToMutatorEffect, false);
  assert.equal(first.executesLiveEffect, false);
  assert.equal(first.mutatesEnvironment, false);
  assert.equal(first.spawnsEntities, false);
  assert.equal(first.awardsRewards, false);
});

test("an actual frozen J6A opportunity is accepted without recomputing seed or clock authority", () => {
  const opportunities = Array.from({ length: 5 }, (_, index) =>
    resolveDynamicMidSectorEventOpportunity({
      sourceMode: "INFINITE",
      sector: 47,
      waveIndex: index + 1,
      waveCount: 5,
      recoverySector: false,
      hasMilestone: false,
      seed: "j6bb-integration-seed",
      recipeId: "sector-47-j6bb",
    }),
  ).filter((opportunity) => opportunity !== null);

  assert.equal(opportunities.length, 1);
  const opportunity = opportunities[0];
  assert.ok(opportunity);

  const selection = resolveDynamicMidSectorEventSelection(opportunity);
  assert.ok(selection);
  assert.equal(selection.opportunityId, opportunity.opportunityId);
  assert.equal(selection.identityFingerprint, opportunity.identityFingerprint);
  assert.equal(DYNAMIC_MID_SECTOR_EVENT_IDS.includes(selection.eventId), true);
});

test("null malformed mode source and bounded wave metadata fail closed", () => {
  assert.equal(resolveDynamicMidSectorEventSelection(null), null);
  assert.equal(resolveDynamicMidSectorEventSelection(undefined), null);

  for (const malformed of [
    { kind: "DYNAMIC_EVENT" },
    { opportunityMode: "SELECTION_ONLY" },
    { sourceMode: "CAMPAIGN" },
    { sector: 10 },
    { sector: 11.5 },
    { waveCount: 2 },
    { waveCount: 8 },
    { waveCount: 4.5 },
    { waveIndex: 1, selectedWaveIndex: 1 },
    { waveIndex: 5, selectedWaveIndex: 5 },
    { waveIndex: 3, selectedWaveIndex: 2 },
    { waveIndex: 2.5, selectedWaveIndex: 2.5 },
  ]) {
    assert.equal(resolveMalformed(malformed), null);
  }
});

test("fingerprint and opportunity identity must match the exact current J6A canonical form", () => {
  for (const identityFingerprint of [
    "",
    "0000000",
    "000000000",
    "DEADBEEF",
    "deadbeeG",
    " deadbee",
    "deadbeef ",
    "0xdeadbe",
  ]) {
    assert.equal(
      resolveDynamicMidSectorEventSelection(
        createOpportunity({ identityFingerprint }),
      ),
      null,
      identityFingerprint,
    );
  }

  for (const opportunityId of [
    "j6a:37:3:deadbeef",
    "j6a:37:2:00000002",
    "j6a:38:3:00000002",
    " j6a:37:3:00000002",
    "j6a:37:3:00000002 ",
    "J6A:37:3:00000002",
  ]) {
    assert.equal(
      resolveDynamicMidSectorEventSelection(createOpportunity({ opportunityId })),
      null,
      opportunityId,
    );
  }
});

test("tampered J6A live-authority flags fail closed rather than being normalized", () => {
  for (const flag of [
    "selectsEventIdentity",
    "appliesLiveEffect",
    "mutatesEnvironment",
    "mutatesMutators",
    "spawnsEntities",
    "awardsRewards",
  ]) {
    assert.equal(resolveMalformed({ [flag]: true }), null, flag);
  }
});

test("J6B-B owns only pure event selection and no execution live combat economy environment timing scan or cap authority", () => {
  assert.deepEqual(DYNAMIC_MID_SECTOR_EVENT_SELECTION_AUTHORITY_CONTRACT, {
    ownsOpportunitySelectionAuthority: false,
    ownsEventSelectionAuthority: true,
    ownsEventExecutionAuthority: false,
    ownsMutatorMappingAuthority: false,
    ownsEnvironmentAuthority: false,
    ownsSpawnAuthority: false,
    ownsProgressionAuthority: false,
    ownsEntityCollection: false,
    ownsProjectileCollection: false,
    ownsDamageAuthority: false,
    ownsDefeatAuthority: false,
    ownsScoreAuthority: false,
    ownsRewardAuthority: false,
    ownsEconomyAuthority: false,
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
    Object.isFrozen(DYNAMIC_MID_SECTOR_EVENT_SELECTION_AUTHORITY_CONTRACT),
    true,
  );
});
