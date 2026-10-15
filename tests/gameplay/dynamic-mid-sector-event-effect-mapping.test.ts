import assert from "node:assert/strict";
import test from "node:test";

import {
  DYNAMIC_MID_SECTOR_EVENT_IDS,
  type DynamicMidSectorEventId,
} from "../../src/game/dynamicMidSectorEventIdentity.ts";
import type { DynamicMidSectorEventSelection } from "../../src/game/dynamicMidSectorEventSelection.ts";
import {
  DYNAMIC_MID_SECTOR_EVENT_EFFECT_MAPPING_AUTHORITY_CONTRACT,
  resolveDynamicMidSectorEventEffectMapping,
} from "../../src/game/dynamicMidSectorEventEffectMapping.ts";
import type { InfiniteMutator } from "../../src/game/infiniteSectorDirector.ts";

const createSelection = (
  selectionIndex = 0,
  overrides: Partial<DynamicMidSectorEventSelection> = {},
): DynamicMidSectorEventSelection => {
  const sector = overrides.sector ?? 37;
  const waveIndex = overrides.waveIndex ?? 3;
  const waveCount = overrides.waveCount ?? 5;
  const identityFingerprint =
    overrides.identityFingerprint ?? selectionIndex.toString(16).padStart(8, "0");
  const eventId =
    overrides.eventId ??
    DYNAMIC_MID_SECTOR_EVENT_IDS[selectionIndex] ??
    DYNAMIC_MID_SECTOR_EVENT_IDS[0];

  return {
    kind: overrides.kind ?? "DYNAMIC_MID_SECTOR_EVENT_SELECTION",
    selectionMode: overrides.selectionMode ?? "SELECTION_ONLY",
    sourceMode: overrides.sourceMode ?? "INFINITE",
    sector,
    waveIndex,
    waveCount,
    opportunityId:
      overrides.opportunityId ??
      `j6a:${sector}:${waveIndex}:${identityFingerprint}`,
    identityFingerprint,
    selectionIndex: overrides.selectionIndex ?? selectionIndex,
    eventId,
    selectsOpportunity: overrides.selectsOpportunity ?? false,
    selectsEventIdentity: overrides.selectsEventIdentity ?? true,
    mapsToMutatorEffect: overrides.mapsToMutatorEffect ?? false,
    executesLiveEffect: overrides.executesLiveEffect ?? false,
    mutatesEnvironment: overrides.mutatesEnvironment ?? false,
    spawnsEntities: overrides.spawnsEntities ?? false,
    awardsRewards: overrides.awardsRewards ?? false,
  };
};

const resolveMalformed = (overrides: Record<string, unknown>) =>
  resolveDynamicMidSectorEventEffectMapping({
    ...createSelection(),
    ...overrides,
  } as unknown as DynamicMidSectorEventSelection);

test("J6B-C freezes exactly four existing compatibility mappings and leaves DYSON_ECLIPSE unmapped", () => {
  const expected: readonly [
    DynamicMidSectorEventId,
    "MAPPED" | "UNMAPPED",
    InfiniteMutator | null,
  ][] = [
    ["SOLAR_STORM", "MAPPED", "ELECTRICAL_STORM"],
    ["QUANTUM_RIFT", "MAPPED", "MAGNETIC_DRIFT"],
    ["BLACKOUT_SURGE", "MAPPED", "REDUCED_VISIBILITY"],
    ["CRYSTAL_RUSH", "MAPPED", "UNSTABLE_RESOURCE_FIELDS"],
    ["DYSON_ECLIPSE", "UNMAPPED", null],
  ];

  assert.deepEqual(DYNAMIC_MID_SECTOR_EVENT_IDS, expected.map(([eventId]) => eventId));

  expected.forEach(([eventId, mappingStatus, mappedMutator], selectionIndex) => {
    const selection = createSelection(selectionIndex);
    const mapping = resolveDynamicMidSectorEventEffectMapping(selection);

    assert.ok(mapping);
    assert.equal(mapping.eventId, eventId);
    assert.equal(mapping.mappingStatus, mappingStatus);
    assert.equal(mapping.mappedMutator, mappedMutator);
    assert.equal(mapping.mapsToMutatorEffect, mappingStatus === "MAPPED");
    assert.equal(mapping.mappingMode, "COMPATIBILITY_ONLY");
    assert.equal(mapping.kind, "DYNAMIC_MID_SECTOR_EVENT_EFFECT_MAPPING");
    assert.equal(mapping.appliesMutatorEffect, false);
    assert.equal(mapping.executesLiveEffect, false);
    assert.equal(mapping.mutatesEnvironment, false);
    assert.equal(mapping.spawnsEntities, false);
    assert.equal(mapping.awardsRewards, false);
    assert.equal(Object.isFrozen(mapping), true);
  });
});

test("valid compatibility projection is deterministic immutable and preserves frozen source identity", () => {
  const selection = createSelection(2, {
    sector: 47,
    waveIndex: 4,
    waveCount: 6,
    identityFingerprint: "deadbeed",
    opportunityId: "j6a:47:4:deadbeed",
    selectionIndex: 2,
    eventId: "BLACKOUT_SURGE",
  });
  const first = resolveDynamicMidSectorEventEffectMapping(selection);
  const second = resolveDynamicMidSectorEventEffectMapping(selection);

  assert.ok(first);
  assert.ok(second);
  assert.deepEqual(second, first);
  assert.equal(first.sourceMode, "INFINITE");
  assert.equal(first.sector, selection.sector);
  assert.equal(first.waveIndex, selection.waveIndex);
  assert.equal(first.waveCount, selection.waveCount);
  assert.equal(first.opportunityId, selection.opportunityId);
  assert.equal(first.identityFingerprint, selection.identityFingerprint);
  assert.equal(first.selectionIndex, selection.selectionIndex);
  assert.equal(first.eventId, selection.eventId);
  assert.equal(first.selectsOpportunity, false);
  assert.equal(first.selectsEventIdentity, false);
});

test("null malformed mode source and bounded wave metadata fail closed", () => {
  assert.equal(resolveDynamicMidSectorEventEffectMapping(null), null);
  assert.equal(resolveDynamicMidSectorEventEffectMapping(undefined), null);

  for (const malformed of [
    { kind: "DYNAMIC_MID_SECTOR_EVENT" },
    { selectionMode: "IDENTITY_ONLY" },
    { sourceMode: "CAMPAIGN" },
    { sector: 10 },
    { sector: 11.5 },
    { waveCount: 2 },
    { waveCount: 8 },
    { waveCount: 4.5 },
    { waveIndex: 1 },
    { waveIndex: 5 },
    { waveIndex: 2.5 },
  ]) {
    assert.equal(resolveMalformed(malformed), null);
  }
});

test("J6B-C requires the exact frozen fingerprint opportunity identity selection index and event identity", () => {
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
      resolveDynamicMidSectorEventEffectMapping(
        createSelection(0, { identityFingerprint }),
      ),
      null,
      identityFingerprint,
    );
  }

  for (const opportunityId of [
    "j6a:37:2:00000000",
    "j6a:38:3:00000000",
    " j6a:37:3:00000000",
    "j6a:37:3:00000000 ",
    "J6A:37:3:00000000",
  ]) {
    assert.equal(
      resolveDynamicMidSectorEventEffectMapping(
        createSelection(0, { opportunityId }),
      ),
      null,
      opportunityId,
    );
  }

  for (const selectionIndex of [-1, 5, 1.5]) {
    assert.equal(resolveMalformed({ selectionIndex }), null, String(selectionIndex));
  }

  assert.equal(
    resolveDynamicMidSectorEventEffectMapping(
      createSelection(0, { selectionIndex: 1 }),
    ),
    null,
  );
  assert.equal(
    resolveDynamicMidSectorEventEffectMapping(
      createSelection(0, { eventId: "QUANTUM_RIFT" }),
    ),
    null,
  );
  assert.equal(resolveMalformed({ eventId: "UNKNOWN_EVENT" }), null);
});

test("tampered J6B-B authority flags fail closed instead of being normalized", () => {
  const tamperedFlags: readonly [string, boolean][] = [
    ["selectsOpportunity", true],
    ["selectsEventIdentity", false],
    ["mapsToMutatorEffect", true],
    ["executesLiveEffect", true],
    ["mutatesEnvironment", true],
    ["spawnsEntities", true],
    ["awardsRewards", true],
  ];

  for (const [flag, value] of tamperedFlags) {
    assert.equal(resolveMalformed({ [flag]: value }), null, flag);
  }
});

test("J6B-C owns compatibility mapping only and no mutator application live environment recipe combat economy timing scan cap or entity authority", () => {
  assert.deepEqual(DYNAMIC_MID_SECTOR_EVENT_EFFECT_MAPPING_AUTHORITY_CONTRACT, {
    ownsOpportunitySelectionAuthority: false,
    ownsEventSelectionAuthority: false,
    ownsCompatibilityMappingAuthority: true,
    ownsMutatorMappingAuthority: true,
    ownsMutatorApplicationAuthority: false,
    ownsEventExecutionAuthority: false,
    ownsEnvironmentAuthority: false,
    ownsRecipeAuthority: false,
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
    mayMutateEnvironment: false,
    mayMutateGlobalCaps: false,
    mayCreateEntities: false,
    mayRemoveEntities: false,
  });
  assert.equal(
    Object.isFrozen(DYNAMIC_MID_SECTOR_EVENT_EFFECT_MAPPING_AUTHORITY_CONTRACT),
    true,
  );
});
