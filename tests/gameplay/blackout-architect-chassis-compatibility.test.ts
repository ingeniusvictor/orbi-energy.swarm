import assert from "node:assert/strict";
import test from "node:test";

import {
  BLACKOUT_ARCHITECT_CHASSIS_COMPATIBILITY_AUTHORITY_CONTRACT,
  BLACKOUT_ARCHITECT_COMPATIBLE_CHASSIS_IDS,
  resolveBlackoutArchitectChassisCompatibility,
} from "../../src/game/blackoutArchitectChassisCompatibility";
import { getBossChassisProfile } from "../../src/game/bossChassis";
import type { BossChassisId } from "../../src/game/types";

const factsFor = (chassisId: BossChassisId) => {
  const chassis = getBossChassisProfile(chassisId);
  return {
    chassisId,
    weakpointCount: chassis.weakpoints.count,
    weakpointMotion: chassis.weakpoints.motion,
    angularVelocityPerFrame: chassis.weakpoints.angularVelocityPerFrame,
  };
};

test("J9C freezes TITAN_CORE as the sole structurally compatible existing chassis", () => {
  assert.equal(Object.isFrozen(BLACKOUT_ARCHITECT_COMPATIBLE_CHASSIS_IDS), true);
  assert.deepEqual(BLACKOUT_ARCHITECT_COMPATIBLE_CHASSIS_IDS, ["TITAN_CORE"]);

  const projection = resolveBlackoutArchitectChassisCompatibility(
    factsFor("TITAN_CORE"),
  );
  assert.ok(projection);
  assert.equal(Object.isFrozen(projection), true);
  assert.deepEqual(projection, {
    bossId: "BLACKOUT_ARCHITECT",
    compatibilityMode: "COMPATIBILITY_ONLY",
    chassisId: "TITAN_CORE",
    structuralAnchorCount: 4,
  });
  assert.deepEqual(Object.keys(projection), [
    "bossId",
    "compatibilityMode",
    "chassisId",
    "structuralAnchorCount",
  ]);
});

test("J9C rejects existing chassis that do not match the frozen four-anchor topology", () => {
  assert.equal(
    resolveBlackoutArchitectChassisCompatibility(factsFor("DEVOURER")),
    null,
  );
  assert.equal(
    resolveBlackoutArchitectChassisCompatibility(factsFor("WORM_SEGMENTS")),
    null,
  );
});

test("J9C fails closed on mismatched mutated missing or padded descriptor facts", () => {
  const valid = factsFor("TITAN_CORE");
  const { angularVelocityPerFrame: _omitted, ...missingAngularVelocity } = valid;

  for (const malformed of [
    { ...valid, chassisId: "TITAN_CORE " },
    { ...valid, weakpointCount: 3 },
    { ...valid, weakpointMotion: "ORBITAL" },
    { ...valid, angularVelocityPerFrame: 0.01 },
    { ...valid, exposureDurationMs: 6000 },
    missingAngularVelocity,
    null,
    [valid],
    "TITAN_CORE",
  ]) {
    assert.equal(resolveBlackoutArchitectChassisCompatibility(malformed), null);
  }
});

test("J9C grants exactly one positive authority and no live adoption authority", () => {
  assert.equal(
    Object.isFrozen(BLACKOUT_ARCHITECT_CHASSIS_COMPATIBILITY_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    BLACKOUT_ARCHITECT_CHASSIS_COMPATIBILITY_AUTHORITY_CONTRACT,
  )
    .filter(([, enabled]) => enabled)
    .map(([authority]) => authority);

  assert.deepEqual(positiveAuthorities, ["ownsChassisCompatibilityAuthority"]);
});
