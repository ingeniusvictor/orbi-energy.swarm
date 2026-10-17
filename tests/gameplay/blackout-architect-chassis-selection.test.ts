import assert from "node:assert/strict";
import test from "node:test";

import {
  BLACKOUT_ARCHITECT_CHASSIS_SELECTION_AUTHORITY_CONTRACT,
  resolveBlackoutArchitectChassisSelection,
} from "../../src/game/blackoutArchitectChassisSelection";
import { resolveBlackoutArchitectChassisCompatibility } from "../../src/game/blackoutArchitectChassisCompatibility";

const compatibleProjection = () =>
  resolveBlackoutArchitectChassisCompatibility({
    chassisId: "TITAN_CORE",
    weakpointCount: 4,
    weakpointMotion: "ANCHORED",
    angularVelocityPerFrame: 0,
  });

test("J9D binds BLACKOUT_ARCHITECT to TITAN_CORE from frozen J9C compatibility only", () => {
  const compatibility = compatibleProjection();
  assert.ok(compatibility);

  const selection = resolveBlackoutArchitectChassisSelection(compatibility);
  assert.ok(selection);
  assert.equal(Object.isFrozen(selection), true);
  assert.deepEqual(selection, {
    bossId: "BLACKOUT_ARCHITECT",
    selectionMode: "SELECTION_ONLY",
    bindingMode: "BINDING_ONLY",
    chassisId: "TITAN_CORE",
  });
  assert.deepEqual(Object.keys(selection), [
    "bossId",
    "selectionMode",
    "bindingMode",
    "chassisId",
  ]);
});

test("J9D fails closed on null malformed missing padded or tampered J9C projections", () => {
  const valid = compatibleProjection();
  assert.ok(valid);
  const { structuralAnchorCount: _omitted, ...missingStructuralCount } = valid;

  for (const malformed of [
    null,
    [valid],
    "TITAN_CORE",
    missingStructuralCount,
    { ...valid, bossId: "BLACKOUT_ARCHITECT " },
    { ...valid, compatibilityMode: "SELECTION_ONLY" },
    { ...valid, chassisId: "DEVOURER" },
    { ...valid, structuralAnchorCount: 3 },
    { ...valid, enemyType: "BOSS_TITAN" },
  ]) {
    assert.equal(resolveBlackoutArchitectChassisSelection(malformed), null);
  }
});

test("J9D selection projection does not inherit J9C or Titan runtime configuration", () => {
  const compatibility = compatibleProjection();
  assert.ok(compatibility);
  const selection = resolveBlackoutArchitectChassisSelection(compatibility);
  assert.ok(selection);

  for (const forbidden of [
    "compatibilityMode",
    "structuralAnchorCount",
    "enemyType",
    "exposureDurationMs",
    "health",
    "weakpoints",
    "attackWeights",
    "rewardMultiplier",
    "spawnTrigger",
  ]) {
    assert.equal(forbidden in selection, false);
  }
});

test("J9D grants exactly one positive composite authority", () => {
  assert.equal(
    Object.isFrozen(BLACKOUT_ARCHITECT_CHASSIS_SELECTION_AUTHORITY_CONTRACT),
    true,
  );

  const positiveAuthorities = Object.entries(
    BLACKOUT_ARCHITECT_CHASSIS_SELECTION_AUTHORITY_CONTRACT,
  )
    .filter(([, enabled]) => enabled)
    .map(([authority]) => authority);

  assert.deepEqual(positiveAuthorities, [
    "ownsBossChassisSelectionBindingAuthority",
  ]);
});
