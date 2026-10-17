import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const contract = read("src/game/blackoutArchitectStructuralTopology.ts");

const liveAuthorityPaths = [
  "src/game/types.ts",
  "src/game/bossChassis.ts",
  "src/game/infiniteBossFamily.ts",
  "src/game/runtimeMilestoneEncounter.ts",
  "src/game/runtimeBossRematchGate.ts",
  "src/game/runtimeMinibossGate.ts",
  "src/game/EnergySwarmGame.tsx",
];

test("J9B consumes only frozen J9A identity and freezes four cardinal anchors", () => {
  const imports = [...contract.matchAll(/^import .* from "([^"]+)";/gm)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, ["./blackoutArchitectProfileContract"]);

  for (const anchor of ["NORTH", "EAST", "SOUTH", "WEST"]) {
    assert.match(contract, new RegExp(`"${anchor}"`));
  }
  assert.match(contract, /topologyMode: "TOPOLOGY_ONLY"/);
  assert.match(contract, /coreExposureEligibility: coreExposureEligible \? "ELIGIBLE" : "LOCKED"/);
});

test("J9B exact facts fail closed on malformed or padded topology input", () => {
  assert.match(contract, /facts\.length !== BLACKOUT_ARCHITECT_STRUCTURAL_ANCHOR_IDS\.length/);
  assert.match(contract, /keys\.length !== 2/);
  assert.match(contract, /!keys\.includes\("anchorId"\)/);
  assert.match(contract, /!keys\.includes\("destroyed"\)/);
  assert.match(contract, /typeof record\.destroyed !== "boolean"/);
  assert.match(contract, /exactFacts\.filter\(\(fact\) => fact\.anchorId === anchorId\)\.length !== 1/);
});

test("J9B grants only topology and pure exposure-projection authority", () => {
  assert.match(contract, /ownsStructuralTopologyAuthority: true/);
  assert.match(contract, /ownsCoreExposureEligibilityProjectionAuthority: true/);

  for (const authority of [
    "ownsCoordinateOrGeometryAuthority",
    "ownsRenderingAuthority",
    "ownsAnchorHealthAuthority",
    "ownsDamageOrDefeatAuthority",
    "ownsBossHealthAuthority",
    "ownsPhaseAuthority",
    "ownsVulnerabilityDurationAuthority",
    "ownsEnemyTypeAuthority",
    "ownsBossChassisAuthority",
    "ownsAttackOrProjectileAuthority",
    "ownsSpawnOrMilestoneAuthority",
    "ownsRuntimeAdoptionAuthority",
    "ownsTimerOrClockAuthority",
    "ownsArenaMutationAuthority",
    "ownsHudAuthority",
    "ownsRewardOrEconomyAuthority",
    "ownsPersistenceAuthority",
    "ownsEntityOrProjectileCollectionAuthority",
    "ownsCapOrBudgetAuthority",
    "ownsFotonOrFormationAuthority",
  ]) {
    assert.match(contract, new RegExp(`${authority}: false`));
  }

  assert.doesNotMatch(contract, /setTimeout|setInterval|requestAnimationFrame|Math\.random/);
  assert.doesNotMatch(contract, /MAX_ENEMIES|MAX_PROJECTILES/);
});

test("J9B is not adopted by existing live boss/runtime authorities", () => {
  for (const path of liveAuthorityPaths) {
    const source = read(path);
    assert.doesNotMatch(
      source,
      /blackoutArchitectStructuralTopology/,
      `${path} must not adopt J9B topology`,
    );
  }
});
