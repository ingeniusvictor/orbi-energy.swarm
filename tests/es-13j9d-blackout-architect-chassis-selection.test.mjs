import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const contract = read("src/game/blackoutArchitectChassisSelection.ts");

const liveAuthorityPaths = [
  "src/game/types.ts",
  "src/game/bossChassis.ts",
  "src/game/infiniteRaidEscalation.ts",
  "src/game/infiniteBossFamily.ts",
  "src/game/runtimeMilestoneEncounter.ts",
  "src/game/runtimeBossRematchGate.ts",
  "src/game/EnergySwarmGame.tsx",
];

test("J9D consumes only frozen J9C compatibility projection authority", () => {
  const imports = [...contract.matchAll(/from "([^"]+)";/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, ["./blackoutArchitectChassisCompatibility"]);
  assert.doesNotMatch(contract, /from "\.\/bossChassis"/);
  assert.doesNotMatch(contract, /from "\.\/types"/);

  assert.match(contract, /record\.bossId !== "BLACKOUT_ARCHITECT"/);
  assert.match(contract, /record\.compatibilityMode !== "COMPATIBILITY_ONLY"/);
  assert.match(
    contract,
    /record\.chassisId !== BLACKOUT_ARCHITECT_COMPATIBLE_CHASSIS_IDS\[0\]/,
  );
  assert.match(contract, /record\.structuralAnchorCount !== 4/);
});

test("J9D fails closed on malformed padded or tampered J9C projections", () => {
  assert.match(contract, /keys\.length !== 4/);
  assert.match(contract, /!keys\.includes\("bossId"\)/);
  assert.match(contract, /!keys\.includes\("compatibilityMode"\)/);
  assert.match(contract, /!keys\.includes\("chassisId"\)/);
  assert.match(contract, /!keys\.includes\("structuralAnchorCount"\)/);
  assert.match(contract, /if \(!compatibility\)/);
});

test("J9D grants only composite chassis selection binding authority", () => {
  assert.match(contract, /ownsBossChassisSelectionBindingAuthority: true/);
  for (const authority of [
    "ownsChassisCompatibilityAuthority",
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

  assert.match(contract, /selectionMode: "SELECTION_ONLY"/);
  assert.match(contract, /bindingMode: "BINDING_ONLY"/);
  assert.doesNotMatch(
    contract,
    /exposureDurationMs|6000|collisionRadius|radiusX|radiusY|protectedDamageMultiplier|exposedDamageMultiplier|introDurationMs|attackWeights|destructionReward|EnemyType/,
  );
  assert.doesNotMatch(
    contract,
    /setTimeout|setInterval|requestAnimationFrame|Date\.now|performance\.now|Math\.random/,
  );
});

test("J9D is not adopted by existing live boss runtime authorities", () => {
  for (const path of liveAuthorityPaths) {
    const source = read(path);
    assert.doesNotMatch(
      source,
      /blackoutArchitectChassisSelection/,
      `${path} must not adopt J9D selection`,
    );
  }
});
