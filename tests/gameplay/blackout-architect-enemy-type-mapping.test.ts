import assert from "node:assert/strict";
import test from "node:test";
import {
  BLACKOUT_ARCHITECT_ENEMY_TYPE_MAPPING_AUTHORITY_CONTRACT,
  resolveBlackoutArchitectEnemyTypeMapping,
} from "../../src/game/blackoutArchitectEnemyTypeMapping";
import { resolveBlackoutArchitectChassisSelection } from "../../src/game/blackoutArchitectChassisSelection";
import { resolveBlackoutArchitectChassisCompatibility } from "../../src/game/blackoutArchitectChassisCompatibility";
import { EnemyType } from "../../src/game/types";

const selection = () => {
  const compatibility = resolveBlackoutArchitectChassisCompatibility({
    chassisId: "TITAN_CORE",
    weakpointCount: 4,
    weakpointMotion: "ANCHORED",
    angularVelocityPerFrame: 0,
  });
  assert.ok(compatibility);
  const selected = resolveBlackoutArchitectChassisSelection(compatibility);
  assert.ok(selected);
  return selected;
};

test("J9E maps frozen J9D selection to immutable descriptive EnemyType only", () => {
  const projection = resolveBlackoutArchitectEnemyTypeMapping(selection());
  assert.ok(projection);
  assert.equal(Object.isFrozen(projection), true);
  assert.deepEqual(projection, {
    bossId: "BLACKOUT_ARCHITECT",
    compatibilityMode: "COMPATIBILITY_ONLY",
    mappingMode: "MAPPING_ONLY",
    chassisId: "TITAN_CORE",
    enemyType: EnemyType.BOSS_TITAN,
  });
  assert.deepEqual(Object.keys(projection), [
    "bossId", "compatibilityMode", "mappingMode", "chassisId", "enemyType",
  ]);
});

test("J9E fails closed on null, malformed, padded, tampered or earlier-layer input", () => {
  const valid = selection();
  const { bindingMode: _ignored, ...missing } = valid;
  for (const bad of [
    null, undefined, [valid], "TITAN_CORE", missing,
    { ...valid, bossId: "BLACKOUT_ARCHITECT " },
    { ...valid, selectionMode: "COMPATIBILITY_ONLY" },
    { ...valid, bindingMode: "COMPATIBILITY_ONLY" },
    { ...valid, chassisId: "WORM_SEGMENTS" },
    { ...valid, enemyType: "BOSS_TITAN" },
    { ...valid, extra: true },
  ]) {
    assert.equal(resolveBlackoutArchitectEnemyTypeMapping(bad), null);
  }
});

test("J9E grants only mapping authority and no live configuration", () => {
  const positives = Object.entries(BLACKOUT_ARCHITECT_ENEMY_TYPE_MAPPING_AUTHORITY_CONTRACT)
    .filter(([, value]) => value)
    .map(([key]) => key);
  assert.deepEqual(positives, ["ownsEnemyTypeCompatibilityMappingAuthority"]);
  assert.equal(Object.isFrozen(BLACKOUT_ARCHITECT_ENEMY_TYPE_MAPPING_AUTHORITY_CONTRACT), true);
  const projected = resolveBlackoutArchitectEnemyTypeMapping(selection());
  assert.ok(projected);
  for (const forbidden of [
    "baseHealth", "health", "weakpoints", "exposureDurationMs",
    "attackWeights", "spawnTrigger", "raidEscalation", "rewardMultiplier",
    "introDurationMs", "damageMultiplier", "milestoneId",
  ]) assert.equal(forbidden in projected, false);
});
