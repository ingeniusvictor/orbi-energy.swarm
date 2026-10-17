import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const contract = read("src/game/blackoutArchitectProfileContract.ts");

const liveAuthorityPaths = [
  "src/game/types.ts",
  "src/game/bossChassis.ts",
  "src/game/infiniteBossFamily.ts",
  "src/game/runtimeMilestoneEncounter.ts",
  "src/game/runtimeBossRematchGate.ts",
  "src/game/runtimeMinibossGate.ts",
  "src/game/EnergySwarmGame.tsx",
];

test("J9A freezes exactly one pure Blackout Architect battlefield-control profile", () => {
  assert.match(contract, /"BLACKOUT_ARCHITECT"/);
  assert.match(contract, /displayName: "Blackout Architect"/);
  assert.match(contract, /family: "BATTLEFIELD_CONTROL"/);
  assert.match(contract, /profileMode: "PROFILE_ONLY"/);
  assert.match(contract, /encounterRole: "SPATIAL_CONTROL_CAPITAL"/);
  assert.match(contract, /phaseCompatibility: "MULTI_PHASE"/);
  assert.match(contract, /destructibleZoneCompatibility: "STRUCTURAL_ZONES"/);
  assert.match(contract, /affinityPressureCompatibility: "AFFINITY_PRESSURE"/);
  assert.match(contract, /formationPressureCompatibility: "FORMATION_PRESSURE"/);
  assert.match(
    contract,
    /battlefieldManipulationCompatibility: "ARENA_GEOMETRY_MANIPULATION"/,
  );
  assert.match(
    contract,
    /vulnerabilityCompatibility: "TELEGRAPHED_EXPOSURE_WINDOW"/,
  );
});

test("J9A remains profile-only and selects no live boss mechanics", () => {
  assert.doesNotMatch(contract, /^\s*import\s/m);
  assert.doesNotMatch(contract, /\bEnemyType\b/);
  assert.doesNotMatch(contract, /\bBossChassisId\b/);
  assert.doesNotMatch(contract, /\bMath\.random\b/);
  assert.doesNotMatch(contract, /\bsetTimeout\b|\bsetInterval\b|\brequestAnimationFrame\b/);
  assert.doesNotMatch(contract, /\bMAX_ENEMIES\b|\bMAX_PROJECTILES\b/);
  assert.doesNotMatch(contract, /\b\d+(?:\.\d+)?\b/);

  for (const selection of [
    "selectsEnemyType",
    "selectsBossChassis",
    "selectsExactHealth",
    "selectsExactPhaseCount",
    "selectsExactPhaseThresholds",
    "selectsExactDestructibleZoneCount",
    "selectsExactDestructibleZoneHealth",
    "selectsExactVulnerabilityDuration",
    "selectsAttackSet",
    "selectsAttackWeights",
    "selectsAttackCooldowns",
    "selectsSpawnCadence",
    "selectsMilestoneOrRematchAdoption",
    "selectsArenaGeometryImplementation",
  ]) {
    assert.match(contract, new RegExp(`${selection}: false`));
  }
});

test("J9A grants only profile-definition authority", () => {
  assert.match(contract, /ownsProfileDefinitionAuthority: true/);

  for (const authority of [
    "ownsEnemyTypeAuthority",
    "ownsBossChassisAuthority",
    "ownsRuntimeOrMilestoneAuthority",
    "ownsPhaseThresholdAuthority",
    "ownsDestructibleZoneRuntimeAuthority",
    "ownsVulnerabilityTimerAuthority",
    "ownsTimerOrClockAuthority",
    "ownsSpawnAuthority",
    "ownsArenaMutationAuthority",
    "ownsEntityOrProjectileCollectionAuthority",
    "ownsDamageFormulaAuthority",
    "ownsRewardOrEconomyAuthority",
    "ownsPersistenceAuthority",
    "ownsHudAuthority",
    "ownsRandomnessAuthority",
    "ownsCapOrBudgetAuthority",
    "ownsFotonOrFormationAuthority",
  ]) {
    assert.match(contract, new RegExp(`${authority}: false`));
  }
});

test("J9A is not adopted by existing live boss/runtime authorities", () => {
  for (const path of liveAuthorityPaths) {
    const source = read(path);
    assert.doesNotMatch(
      source,
      /blackoutArchitectProfileContract/,
      `${path} must not adopt the J9A profile contract`,
    );
  }

  assert.doesNotMatch(read("src/game/types.ts"), /BLACKOUT_ARCHITECT/);
  assert.doesNotMatch(read("src/game/bossChassis.ts"), /BLACKOUT_ARCHITECT/);
  assert.doesNotMatch(read("src/game/infiniteBossFamily.ts"), /BLACKOUT_ARCHITECT/);
});
