import assert from "node:assert/strict";
import test from "node:test";

import {
  DYNAMIC_MID_SECTOR_EVENT_IDENTITY_AUTHORITY_CONTRACT,
  DYNAMIC_MID_SECTOR_EVENT_IDENTITY_PROFILE_COUNT,
  DYNAMIC_MID_SECTOR_EVENT_IDENTITY_PROFILES,
  DYNAMIC_MID_SECTOR_EVENT_IDS,
  getDynamicMidSectorEventIdentityProfile,
} from "../../src/game/dynamicMidSectorEventIdentity.ts";

const EXPECTED_IDS = [
  "SOLAR_STORM",
  "QUANTUM_RIFT",
  "BLACKOUT_SURGE",
  "CRYSTAL_RUSH",
  "DYSON_ECLIPSE",
] as const;

test("J6B-A exposes exactly five frozen environmental event identities", () => {
  assert.equal(DYNAMIC_MID_SECTOR_EVENT_IDENTITY_PROFILE_COUNT, 5);
  assert.deepEqual(DYNAMIC_MID_SECTOR_EVENT_IDS, EXPECTED_IDS);
  assert.equal(Object.isFrozen(DYNAMIC_MID_SECTOR_EVENT_IDS), true);
  assert.equal(Object.isFrozen(DYNAMIC_MID_SECTOR_EVENT_IDENTITY_PROFILES), true);

  assert.deepEqual(
    DYNAMIC_MID_SECTOR_EVENT_IDENTITY_PROFILES.map((profile) => profile.eventId),
    EXPECTED_IDS,
  );

  for (const profile of DYNAMIC_MID_SECTOR_EVENT_IDENTITY_PROFILES) {
    assert.equal(Object.isFrozen(profile), true);
    assert.equal(profile.family, "ENVIRONMENTAL_IDENTITY");
    assert.equal(profile.identityMode, "IDENTITY_ONLY");
  }
});

test("supported identity lookup is exact deterministic and identity-only", () => {
  const expectedNames = new Map([
    ["SOLAR_STORM", "Solar Storm"],
    ["QUANTUM_RIFT", "Quantum Rift"],
    ["BLACKOUT_SURGE", "Blackout Surge"],
    ["CRYSTAL_RUSH", "Crystal Rush"],
    ["DYSON_ECLIPSE", "Dyson Eclipse"],
  ] as const);

  for (const eventId of EXPECTED_IDS) {
    const first = getDynamicMidSectorEventIdentityProfile(eventId);
    const second = getDynamicMidSectorEventIdentityProfile(eventId);
    assert.ok(first);
    assert.equal(second, first);
    assert.equal(first.eventId, eventId);
    assert.equal(first.displayName, expectedNames.get(eventId));
    assert.equal(first.identityMode, "IDENTITY_ONLY");
    assert.equal(first.selectsOpportunity, false);
    assert.equal(first.selectsEvent, false);
    assert.equal(first.mapsToMutatorEffect, false);
    assert.equal(first.executesLiveEffect, false);
  }
});

test("unsupported padded and empty event identifiers fail closed", () => {
  for (const unsupported of [
    "",
    " ",
    "SOLAR_STORM ",
    " SOLAR_STORM",
    "solar_storm",
    "SWARM_DISTRESS_CALL",
    "CONVOY_DEFENSE",
    "VOID_HUNT",
    "ELITE_INCURSION",
    "MIRROR_SWARM",
    "METEOR_DEBRIS_FIELD",
    "SINGULARITY_EVENT",
    "__proto__",
  ]) {
    assert.equal(getDynamicMidSectorEventIdentityProfile(unsupported), null);
  }
});

test("identity profiles own no opportunity selection mapping execution or live authority", () => {
  assert.deepEqual(DYNAMIC_MID_SECTOR_EVENT_IDENTITY_AUTHORITY_CONTRACT, {
    ownsOpportunitySelectionAuthority: false,
    ownsEventSelectionAuthority: false,
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
});