import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const contract = read("src/game/blackoutArchitectEnemyTypeMapping.ts");

test("J9E owns only pure EnemyType compatibility mapping and reads frozen authority", () => {
  assert.match(contract, /BlackoutArchitectChassisSelectionProjection/);
  assert.match(contract, /getBossChassisProfile/);
  assert.match(contract, /EnemyType\.BOSS_TITAN/);
  assert.match(contract, /ownsEnemyTypeCompatibilityMappingAuthority: true/);
  const livePaths = [
    "src/game/EnergySwarmGame.tsx",
    "src/game/runtimeMilestoneEncounter.ts",
    "src/game/infiniteRaidEscalation.ts",
    "src/game/bossChassis.ts",
    "src/game/blackoutArchitectChassisSelection.ts",
  ];
  for (const path of livePaths) {
    assert.doesNotMatch(read(path), /blackoutArchitectEnemyTypeMapping/, path);
  }
});

test("J9E does not import or own live gameplay configuration", () => {
  assert.doesNotMatch(contract, /setTimeout|setInterval|requestAnimationFrame|Math\.random/);
  assert.doesNotMatch(contract, /MAX_ENEMIES|MAX_PROJECTILES/);
  for (const forbidden of [
    "ownsChassisSelectionBindingAuthority",
    "ownsPhysicalChassisConfigurationAuthority",
    "ownsBossHealthAuthority",
    "ownsWeakpointHealthAuthority",
    "ownsCoordinateOrGeometryAuthority",
    "ownsDamageFormulaAuthority",
    "ownsVulnerabilityDurationAuthority",
    "ownsPhaseAuthority",
    "ownsAttackOrProjectileAuthority",
    "ownsSpawnOrMilestoneAuthority",
    "ownsRuntimeAdoptionAuthority",
    "ownsTimerOrClockAuthority",
    "ownsArenaMutationAuthority",
    "ownsHudAuthority",
    "ownsRewardOrEconomyAuthority",
    "ownsPersistenceAuthority",
    "ownsEntityOrProjectileCollectionAuthority",
    "ownsRandomnessAuthority",
    "ownsCapOrBudgetAuthority",
    "ownsFotonOrFormationAuthority",
  ]) {
    assert.match(contract, new RegExp(`${forbidden}: false`));
  }
});
