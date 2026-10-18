import assert from "node:assert/strict";
import test from "node:test";
import {
  BLACKOUT_ARCHITECT_STRUCTURAL_TARGET_ELIGIBILITY_AUTHORITY_CONTRACT,
  resolveBlackoutArchitectStructuralTargetEligibility,
} from "../../src/game/blackoutArchitectStructuralTargetEligibility";
import { resolveBlackoutArchitectEnemyTypeMapping } from "../../src/game/blackoutArchitectEnemyTypeMapping";
import { resolveBlackoutArchitectChassisSelection } from "../../src/game/blackoutArchitectChassisSelection";
import { resolveBlackoutArchitectChassisCompatibility } from "../../src/game/blackoutArchitectChassisCompatibility";
import { EnemyType } from "../../src/game/types";

const mapping = () => {
  const compatibility = resolveBlackoutArchitectChassisCompatibility({
    chassisId: "TITAN_CORE",
    weakpointCount: 4,
    weakpointMotion: "ANCHORED",
    angularVelocityPerFrame: 0,
  });
  assert.ok(compatibility);
  const selection = resolveBlackoutArchitectChassisSelection(compatibility);
  assert.ok(selection);
  const resolved = resolveBlackoutArchitectEnemyTypeMapping(selection);
  assert.ok(resolved);
  return resolved;
};
const facts = (destroyed: readonly string[] = []) =>
  ["NORTH", "EAST", "SOUTH", "WEST"].map((anchorId) => ({
    anchorId,
    destroyed: destroyed.includes(anchorId),
  }));

test("J9F exposes all four intact anchors and keeps core LOCKED", () => {
  const result = resolveBlackoutArchitectStructuralTargetEligibility(mapping(), facts());
  assert.ok(result);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.anchorTargets), true);
  assert.ok(result.anchorTargets.every(Object.isFrozen));
  assert.deepEqual(result, {
    bossId: "BLACKOUT_ARCHITECT",
    eligibilityMode: "ELIGIBILITY_ONLY",
    chassisId: "TITAN_CORE",
    enemyType: EnemyType.BOSS_TITAN,
    anchorTargets: ["NORTH", "EAST", "SOUTH", "WEST"].map((anchorId) => ({
      anchorId, targetEligibility: "ELIGIBLE",
    })),
    coreTargetEligibility: "LOCKED",
  });
});

test("J9F never exposes destroyed anchor as eligible, unlocks core only after all four", () => {
  const ids = ["NORTH", "EAST", "SOUTH", "WEST"];
  for (let count = 0; count <= 4; count++) {
    const state = resolveBlackoutArchitectStructuralTargetEligibility(mapping(), facts(ids.slice(0, count)).reverse());
    assert.ok(state);
    assert.equal(state.coreTargetEligibility, count === 4 ? "ELIGIBLE" : "LOCKED");
    assert.deepEqual(
      state.anchorTargets.map(({ anchorId, targetEligibility }) => [anchorId, targetEligibility]),
      ids.map((anchorId, i) => [anchorId, i < count ? "INELIGIBLE" : "ELIGIBLE"]),
    );
  }
});

test("J9F fails closed on malformed, padded, duplicate and missing J9B anchor facts", () => {
  const valid = facts();
  for (const bad of [
    null, undefined, "", {}, [], valid.slice(1),
    [...valid, { anchorId: "NORTH", destroyed: false }],
    [valid[0], valid[0], valid[2], valid[3]],
    [{ anchorId: "UNKNOWN", destroyed: false }, ...valid.slice(1)],
    [{ anchorId: "NORTH ", destroyed: false }, ...valid.slice(1)],
    [{ anchorId: "NORTH", destroyed: 0 }, ...valid.slice(1)],
    [{ anchorId: "NORTH", destroyed: false, hp: 100 }, ...valid.slice(1)],
  ]) assert.equal(resolveBlackoutArchitectStructuralTargetEligibility(mapping(), bad), null);
});

test("J9F fails closed on malformed or forged J9E mappings", () => {
  const valid = mapping();
  const { enemyType: _discard, ...missing } = valid;
  for (const bad of [
    null, undefined, [valid], "BOSS_TITAN", missing,
    { ...valid, bossId: "BLACKOUT_ARCHITECT " },
    { ...valid, compatibilityMode: "SELECTION_ONLY" },
    { ...valid, mappingMode: "BINDING_ONLY" },
    { ...valid, chassisId: "DEVOURER" },
    { ...valid, enemyType: EnemyType.BOSS_DEVOURER },
    { ...valid, extra: true },
  ]) assert.equal(resolveBlackoutArchitectStructuralTargetEligibility(bad, facts()), null);
});

test("J9F grants one positive authority and never carries runtime configuration", () => {
  const a = BLACKOUT_ARCHITECT_STRUCTURAL_TARGET_ELIGIBILITY_AUTHORITY_CONTRACT;
  assert.equal(Object.isFrozen(a), true);
  assert.deepEqual(Object.entries(a).filter(([, v]) => v).map(([key]) => key), [
    "ownsStructuralTargetEligibilityProjectionAuthority",
  ]);
  const result = resolveBlackoutArchitectStructuralTargetEligibility(mapping(), facts());
  assert.ok(result);
  for (const forbidden of [
    "health", "weakpoints", "damageMultiplier", "exposureDurationMs",
    "phaseThresholds", "attackWeights", "spawnTrigger", "raidEscalation",
    "rewardMultiplier", "timer", "position", "coordinates",
  ]) assert.equal(forbidden in result, false);
});
