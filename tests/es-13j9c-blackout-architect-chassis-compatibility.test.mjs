import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const contract = read("src/game/blackoutArchitectChassisCompatibility.ts");

const liveAuthorityPaths = [
  "src/game/types.ts",
  "src/game/bossChassis.ts",
  "src/game/infiniteRaidEscalation.ts",
  "src/game/infiniteBossFamily.ts",
  "src/game/runtimeMilestoneEncounter.ts",
  "src/game/runtimeBossRematchGate.ts",
  "src/game/EnergySwarmGame.tsx",
];

test("J9C consumes only frozen J9A J9B and pure chassis descriptor facts", () => {
  const imports = [...contract.matchAll(/from "([^"]+)";/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "./blackoutArchitectProfileContract",
    "./blackoutArchitectStructuralTopology",
    "./bossChassis",
  ]);

  assert.match(contract, /"TITAN_CORE"/);
  assert.match(contract, /getBossChassisProfile\("TITAN_CORE"\)/);
  assert.match(
    contract,
    /record\.weakpointCount !== BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS\.length/,
  );
  assert.match(contract, /record\.weakpointMotion !== "ANCHORED"/);
  assert.match(contract, /record\.angularVelocityPerFrame !== 0/);
});

test("J9C fails closed on malformed padded or mutated compatibility facts", () => {
  assert.match(contract, /keys\.length !== 4/);
  assert.match(contract, /!keys\.includes\("chassisId"\)/);
  assert.match(contract, /!keys\.includes\("weakpointCount"\)/);
  assert.match(contract, /!keys\.includes\("weakpointMotion"\)/);
  assert.match(contract, /!keys\.includes\("angularVelocityPerFrame"\)/);
  assert.match(contract, /chassis\.weakpoints\.count !== fact\.weakpointCount/);
  assert.match(contract, /chassis\.weakpoints\.motion !== fact\.weakpointMotion/);
  assert.match(
    contract,
    /chassis\.weakpoints\.angularVelocityPerFrame !== fact\.angularVelocityPerFrame/,
  );
});

test("J9C owns compatibility only and imports no live inherited configuration", () => {
  assert.match(contract, /ownsChassisCompatibilityAuthority: true/);
  for (const authority of [
    "ownsBossChassisSelectionAuthority",
    "ownsEnemyTypeAuthority",
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
    assert.match(contract, new RegExp(`${authority}: false`));
  }

  assert.doesNotMatch(
    contract,
    /exposureDurationMs|6000|collisionRadius|radiusX|radiusY|protectedDamageMultiplier|exposedDamageMultiplier|introDurationMs|attackWeights|destructionReward/,
  );
  assert.doesNotMatch(
    contract,
    /setTimeout|setInterval|requestAnimationFrame|Date\.now|performance\.now|Math\.random/,
  );
});

test("J9C is not adopted by existing live boss runtime authorities", () => {
  for (const path of liveAuthorityPaths) {
    const source = read(path);
    assert.doesNotMatch(
      source,
      /blackoutArchitectChassisCompatibility/,
      `${path} must not adopt J9C compatibility`,
    );
  }
});
