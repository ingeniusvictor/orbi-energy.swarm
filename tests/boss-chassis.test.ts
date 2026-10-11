import assert from "node:assert/strict";
import test from "node:test";

import {
  getBossChassisAttackWeight,
  getBossChassisProfile,
} from "../src/game/bossChassis.ts";
import { WORM_SEGMENT_CAP } from "../src/game/wormSegmentPhysics.ts";
import { EnemyType } from "../src/game/types.ts";

test("Devourer chassis preserves historical weakpoint contract", () => {
  const profile = getBossChassisProfile("DEVOURER");

  assert.equal(profile.enemyType, EnemyType.BOSS_DEVOURER);
  assert.equal(profile.size, 45);
  assert.equal(profile.weakpoints.count, 3);
  assert.equal(profile.weakpoints.health, 120);
  assert.equal(profile.weakpoints.motion, "ORBITAL");
  assert.equal(profile.weakpoints.radiusX, 110);
  assert.equal(profile.weakpoints.radiusY, 110);
  assert.equal(profile.weakpoints.angularVelocityPerFrame, 0.015);
  assert.equal(profile.weakpoints.protectedDamageMultiplier, 0.25);
  assert.equal(profile.weakpoints.exposedDamageMultiplier, 2);
  assert.equal(profile.weakpoints.exposureDurationMs, 4000);
});

test("Titan Core is a fixed four-segment capital chassis", () => {
  const profile = getBossChassisProfile("TITAN_CORE");

  assert.equal(profile.enemyType, EnemyType.BOSS_TITAN);
  assert.equal(profile.weakpoints.count, 4);
  assert.equal(profile.weakpoints.motion, "ANCHORED");
  assert.equal(profile.weakpoints.angularVelocityPerFrame, 0);
  assert.ok(profile.weakpoints.health > 120);
  assert.ok(profile.weakpoints.protectedDamageMultiplier < 0.25);
  assert.ok(profile.weakpoints.exposureDurationMs > 4000);
  assert.ok(profile.size > 45);
});

test("Worm is a fixed six-segment serpentine chassis with bounded rewards", () => {
  const profile = getBossChassisProfile("WORM_SEGMENTS");

  assert.equal(profile.enemyType, EnemyType.BOSS_WORM);
  assert.equal(profile.weakpoints.count, WORM_SEGMENT_CAP);
  assert.equal(profile.weakpoints.count, 6);
  assert.equal(profile.weakpoints.motion, "SERPENTINE");
  assert.ok(profile.weakpoints.chainPhysics);
  assert.equal(profile.weakpoints.chainPhysics?.spacing, 42);
  assert.ok(profile.weakpoints.destructionReward);
  assert.equal(
    (profile.weakpoints.destructionReward?.score ?? 0) * profile.weakpoints.count,
    1500,
  );
  assert.equal(
    (profile.weakpoints.destructionReward?.nanoCredits ?? 0) * profile.weakpoints.count,
    6,
  );
});

test("boss chassis attack doctrines stay bounded without disabling attacks", () => {
  assert.ok(getBossChassisAttackWeight("TITAN_CORE", "orbital_shards", 0.8) > 0.8);
  assert.ok(getBossChassisAttackWeight("TITAN_CORE", "devourer_charge", 1) > 0);
  assert.ok(getBossChassisAttackWeight("WORM_SEGMENTS", "devourer_charge", 1) > 1);
  assert.ok(getBossChassisAttackWeight("WORM_SEGMENTS", "devourer_beam", 1) > 0);
  assert.equal(getBossChassisAttackWeight("DEVOURER", "gravity_well", 1.2), 1.2);
  assert.equal(getBossChassisAttackWeight(undefined, "gravity_well", 1.2), 1.2);
});
