import assert from "node:assert/strict";
import test from "node:test";

import {
  BLACKOUT_ARCHITECT_AUTHORITY_CONTRACT,
  BLACKOUT_ARCHITECT_PROFILE,
  BLACKOUT_ARCHITECT_UNRESOLVED_SELECTIONS,
  BOSS_EXPANSION_PROFILE_IDS,
  resolveBlackoutArchitectProfile,
} from "../../src/game/blackoutArchitectProfileContract";

test("J9A exposes one frozen canonical Blackout Architect profile", () => {
  assert.deepEqual(BOSS_EXPANSION_PROFILE_IDS, ["BLACKOUT_ARCHITECT"]);
  assert.equal(Object.isFrozen(BOSS_EXPANSION_PROFILE_IDS), true);
  assert.equal(Object.isFrozen(BLACKOUT_ARCHITECT_PROFILE), true);

  assert.deepEqual(BLACKOUT_ARCHITECT_PROFILE, {
    id: "BLACKOUT_ARCHITECT",
    displayName: "Blackout Architect",
    family: "BATTLEFIELD_CONTROL",
    profileMode: "PROFILE_ONLY",
    encounterRole: "SPATIAL_CONTROL_CAPITAL",
    phaseCompatibility: "MULTI_PHASE",
    destructibleZoneCompatibility: "STRUCTURAL_ZONES",
    affinityPressureCompatibility: "AFFINITY_PRESSURE",
    formationPressureCompatibility: "FORMATION_PRESSURE",
    battlefieldManipulationCompatibility: "ARENA_GEOMETRY_MANIPULATION",
    vulnerabilityCompatibility: "TELEGRAPHED_EXPOSURE_WINDOW",
  });
});

test("J9A lookup is canonical and fails closed for unsupported boss ids", () => {
  assert.equal(
    resolveBlackoutArchitectProfile("BLACKOUT_ARCHITECT"),
    BLACKOUT_ARCHITECT_PROFILE,
  );

  for (const unsupported of [
    "NULL_ARCHITECT",
    "DEVOURER_ASCENDANT",
    "HELIO_DEVOURER",
    "QUANTUM_LEVIATHAN",
    "",
    "blackout_architect",
  ]) {
    assert.equal(resolveBlackoutArchitectProfile(unsupported), null);
  }
});

test("J9A leaves every live-mechanic selection unresolved", () => {
  assert.equal(Object.isFrozen(BLACKOUT_ARCHITECT_UNRESOLVED_SELECTIONS), true);
  assert.deepEqual(BLACKOUT_ARCHITECT_UNRESOLVED_SELECTIONS, {
    selectsEnemyType: false,
    selectsBossChassis: false,
    selectsExactHealth: false,
    selectsExactPhaseCount: false,
    selectsExactPhaseThresholds: false,
    selectsExactDestructibleZoneCount: false,
    selectsExactDestructibleZoneHealth: false,
    selectsExactVulnerabilityDuration: false,
    selectsAttackSet: false,
    selectsAttackWeights: false,
    selectsAttackCooldowns: false,
    selectsSpawnCadence: false,
    selectsMilestoneOrRematchAdoption: false,
    selectsArenaGeometryImplementation: false,
  });
});

test("J9A grants exactly one positive authority: profile definition", () => {
  assert.equal(Object.isFrozen(BLACKOUT_ARCHITECT_AUTHORITY_CONTRACT), true);

  const positiveAuthorities = Object.entries(
    BLACKOUT_ARCHITECT_AUTHORITY_CONTRACT,
  )
    .filter(([, enabled]) => enabled)
    .map(([authority]) => authority);

  assert.deepEqual(positiveAuthorities, ["ownsProfileDefinitionAuthority"]);

  assert.deepEqual(BLACKOUT_ARCHITECT_AUTHORITY_CONTRACT, {
    ownsProfileDefinitionAuthority: true,
    ownsEnemyTypeAuthority: false,
    ownsBossChassisAuthority: false,
    ownsRuntimeOrMilestoneAuthority: false,
    ownsPhaseThresholdAuthority: false,
    ownsDestructibleZoneRuntimeAuthority: false,
    ownsVulnerabilityTimerAuthority: false,
    ownsTimerOrClockAuthority: false,
    ownsSpawnAuthority: false,
    ownsArenaMutationAuthority: false,
    ownsEntityOrProjectileCollectionAuthority: false,
    ownsDamageFormulaAuthority: false,
    ownsRewardOrEconomyAuthority: false,
    ownsPersistenceAuthority: false,
    ownsHudAuthority: false,
    ownsRandomnessAuthority: false,
    ownsCapOrBudgetAuthority: false,
    ownsFotonOrFormationAuthority: false,
  });
});
