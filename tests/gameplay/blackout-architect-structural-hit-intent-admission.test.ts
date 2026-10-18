import assert from "node:assert/strict";
import test from "node:test";
import {
  BLACKOUT_ARCHITECT_STRUCTURAL_HIT_INTENT_ADMISSION_AUTHORITY_CONTRACT,
  resolveBlackoutArchitectStructuralHitIntentAdmission,
} from "../../src/game/blackoutArchitectStructuralHitIntentAdmission";
import {
  resolveBlackoutArchitectStructuralTargetEligibility,
} from "../../src/game/blackoutArchitectStructuralTargetEligibility";
import { EnemyType } from "../../src/game/types";

const IDS = ["NORTH", "EAST", "SOUTH", "WEST"] as const;
const exactMapping = () => ({
  bossId: "BLACKOUT_ARCHITECT",
  compatibilityMode: "COMPATIBILITY_ONLY",
  mappingMode: "MAPPING_ONLY",
  chassisId: "TITAN_CORE",
  enemyType: EnemyType.BOSS_TITAN,
});
const eligibleFromMask = (mask: number) => {
  const facts = IDS.map((anchorId, i) => ({
    anchorId,
    destroyed: (mask & (1 << i)) !== 0,
  }));
  const result = resolveBlackoutArchitectStructuralTargetEligibility(exactMapping(), facts);
  assert.ok(result);
  return result;
};

test("J9G admits only structurally eligible explicit intents across all 16 states", () => {
  for (let mask = 0; mask < 16; mask++) {
    const eligibility = eligibleFromMask(mask);
    for (let index = 0; index < IDS.length; index++) {
      const intent = { targetKind: "ANCHOR", anchorId: IDS[index] };
      const result = resolveBlackoutArchitectStructuralHitIntentAdmission(eligibility, intent);
      assert.ok(result);
      assert.equal(Object.isFrozen(result), true);
      assert.equal(Object.isFrozen(result.intent), true);
      assert.deepEqual(result, {
        bossId: "BLACKOUT_ARCHITECT",
        admissionMode: "HIT_INTENT_ONLY",
        chassisId: "TITAN_CORE",
        enemyType: EnemyType.BOSS_TITAN,
        intent,
        disposition: (mask & (1 << index)) !== 0 ? "DENY" : "ADMIT",
      });
    }
    const core = resolveBlackoutArchitectStructuralHitIntentAdmission(eligibility, { targetKind: "CORE" });
    assert.ok(core);
    assert.equal(Object.isFrozen(core.intent), true);
    assert.deepEqual(core.intent, { targetKind: "CORE" });
    assert.equal(core.disposition, mask === 15 ? "ADMIT" : "DENY");
    assert.equal(Object.keys(core).length, 6);
  }
});

test("J9G fails closed for malformed, padded and unsupported hit intents", () => {
  const eligibility = eligibleFromMask(0);
  for (const invalid of [
    null, undefined, [], {}, "", 12, ["CORE"],
    { targetKind: "CORE", anchorId: "NORTH" },
    { targetKind: "CORE", extra: true },
    { targetKind: "CORE " },
    { targetKind: "ANCHOR" },
    { targetKind: "ANCHOR", anchorId: "CORE" },
    { targetKind: "ANCHOR", anchorId: "NORTH " },
    { targetKind: "ANCHOR", anchorId: "north" },
    { targetKind: "ANCHOR", anchorId: null },
    { targetKind: "ANCHOR", anchorId: "NORTH", health: 1 },
    { targetKind: "ANCHOR", anchorId: "NORTH", damage: 5 },
    { targetKind: "CORE", [Symbol("extra")]: true },
  ]) assert.equal(resolveBlackoutArchitectStructuralHitIntentAdmission(eligibility, invalid), null);
});

test("J9G fails closed on malformed, tampered or internally contradictory J9F projections", () => {
  const valid = eligibleFromMask(0);
  const destroyed = eligibleFromMask(15);
  const { enemyType: _omitted, ...missing } = valid;
  for (const invalid of [
    null, undefined, "", [], {}, missing,
    { ...valid, bossId: "BLACKOUT_ARCHITECT " },
    { ...valid, eligibilityMode: "TOPOLOGY_ONLY" },
    { ...valid, chassisId: "DEVOURER" },
    { ...valid, enemyType: EnemyType.BOSS_DEVOURER },
    { ...valid, coreTargetEligibility: "ELIGIBLE" },
    { ...destroyed, coreTargetEligibility: "LOCKED" },
    { ...valid, anchorTargets: [] },
    { ...valid, anchorTargets: valid.anchorTargets.slice(1) },
    { ...valid, anchorTargets: [...valid.anchorTargets, valid.anchorTargets[0]] },
    { ...valid, anchorTargets: [...valid.anchorTargets].reverse() },
    { ...valid, anchorTargets: [valid.anchorTargets[0], valid.anchorTargets[0], ...valid.anchorTargets.slice(2)] },
    { ...valid, anchorTargets: [{ ...valid.anchorTargets[0], hp: 100 }, ...valid.anchorTargets.slice(1)] },
    { ...valid, anchorTargets: [{ ...valid.anchorTargets[0], targetEligibility: "LOCKED" }, ...valid.anchorTargets.slice(1)] },
    { ...valid, anchorTargets: [{ ...valid.anchorTargets[0], anchorId: "UNKNOWN" }, ...valid.anchorTargets.slice(1)] },
    { ...valid, anchorTargets: [{ ...valid.anchorTargets[0], targetEligibility: "INELIGIBLE" }, ...valid.anchorTargets.slice(1)] },
    { ...valid, extra: true },
    { ...valid, [Symbol("extra")]: true },
  ]) assert.equal(
    resolveBlackoutArchitectStructuralHitIntentAdmission(invalid, { targetKind: "CORE" }),
    null,
  );
});

test("J9G grants only abstract intent admission, never damage or runtime state", () => {
  const contract = BLACKOUT_ARCHITECT_STRUCTURAL_HIT_INTENT_ADMISSION_AUTHORITY_CONTRACT;
  assert.equal(Object.isFrozen(contract), true);
  assert.deepEqual(Object.entries(contract).filter(([, v]) => v).map(([name]) => name), [
    "ownsAbstractStructuralHitIntentAdmissionAuthority",
  ]);
  const result = resolveBlackoutArchitectStructuralHitIntentAdmission(eligibleFromMask(0), {
    targetKind: "ANCHOR", anchorId: "NORTH",
  });
  assert.ok(result);
  for (const forbidden of [
    "health", "damage", "damageMultiplier", "collision", "position",
    "weakpoints", "attackWeights", "exposureDurationMs", "timer", "phase",
    "spawnTrigger", "raidEscalation", "rewardMultiplier", "hitbox", "budget",
  ]) assert.equal(forbidden in result, false);
  assert.equal(Object.isFrozen(result.intent), true);
});
