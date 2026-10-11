import assert from "node:assert/strict";
import test from "node:test";

import {
  FOTON_DYSON_HALO_RED_ACCENT,
  FOTON_DYSON_HALO_RINGS,
  getCollectedOrbiCountFromSwarmSize,
  getUnlockedDysonHaloRingCount,
  getUnlockedDysonHaloRingCountFromSwarmSize,
  getUnlockedDysonHaloRings,
} from "../src/game/fotonDysonHalo.ts";

test("true collected-Orbi progression unlocks one ring for 0-9", () => {
  for (const count of [0, 1, 9]) {
    assert.equal(getUnlockedDysonHaloRingCount(count), 1);
  }
});

test("true collected-Orbi progression unlocks cyan plus emerald for 10-19", () => {
  for (const count of [10, 14, 19]) {
    assert.equal(getUnlockedDysonHaloRingCount(count), 2);
  }
});

test("true collected-Orbi progression caps at three rings from 20 onward", () => {
  for (const count of [20, 30, 999]) {
    assert.equal(getUnlockedDysonHaloRingCount(count), 3);
  }
});

test("swarm-size helper never subtracts a phantom starting companion", () => {
  assert.equal(getCollectedOrbiCountFromSwarmSize(0), 0);
  assert.equal(getCollectedOrbiCountFromSwarmSize(1), 1);
  assert.equal(getCollectedOrbiCountFromSwarmSize(9), 9);
  assert.equal(getCollectedOrbiCountFromSwarmSize(10), 10);
  assert.equal(getCollectedOrbiCountFromSwarmSize(20), 20);

  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(1), 1);
  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(9), 1);
  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(10), 2);
  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(19), 2);
  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(20), 3);
});

test("invalid or negative counts fail safe to the base cyan ring", () => {
  assert.equal(getUnlockedDysonHaloRingCount(Number.NaN), 1);
  assert.equal(getUnlockedDysonHaloRingCount(-100), 1);
  assert.equal(getUnlockedDysonHaloRingCountFromSwarmSize(Number.NaN), 1);
});

test("ring palette is bright neon cyan emerald and gold with red tactical accents", () => {
  assert.deepEqual(
    FOTON_DYSON_HALO_RINGS.map((ring) => ring.color),
    [0x00f5ff, 0x00ff88, 0xffd740],
  );
  assert.ok(
    FOTON_DYSON_HALO_RINGS.every(
      (ring) => ring.accentColor === FOTON_DYSON_HALO_RED_ACCENT,
    ),
  );
  assert.equal(FOTON_DYSON_HALO_RED_ACCENT, 0xff1744);
});

test("rings share one exact Dyson-sphere radius and form a symmetric atomic triad", () => {
  const [cyan, emerald, gold] = FOTON_DYSON_HALO_RINGS;
  assert.equal(cyan.radius, emerald.radius);
  assert.equal(emerald.radius, gold.radius);

  assert.deepEqual(cyan.tilt, [1.08, 0, 0]);
  assert.deepEqual(emerald.tilt, [1.08, 0, 2.094]);
  assert.deepEqual(gold.tilt, [1.08, 0, 4.189]);

  assert.equal(cyan.tilt[0], emerald.tilt[0]);
  assert.equal(emerald.tilt[0], gold.tilt[0]);
  assert.equal(cyan.tilt[1], 0);
  assert.equal(emerald.tilt[1], 0);
  assert.equal(gold.tilt[1], 0);
  assert.ok(Math.abs((emerald.tilt[2] - cyan.tilt[2]) - 2.094) < 0.002);
  assert.ok(Math.abs((gold.tilt[2] - emerald.tilt[2]) - 2.095) < 0.002);
  assert.ok(Math.abs((Math.PI * 2 - gold.tilt[2]) - 2.094) < 0.002);

  assert.ok(Math.abs(emerald.phase - 2.094) < 0.001);
  assert.ok(Math.abs(gold.phase - 4.189) < 0.001);
});

test("rings keep distinct slow orbital velocities", () => {
  const speeds = FOTON_DYSON_HALO_RINGS.map((ring) => ring.angularVelocity);
  assert.equal(new Set(speeds).size, 3);
  assert.ok(speeds.every((speed) => Math.abs(speed) <= 0.14));
});

test("every ring owns a mechanical rail, brighter energy conduit and segmented language", () => {
  for (const ring of FOTON_DYSON_HALO_RINGS) {
    assert.ok(ring.railTubeRadius > ring.energyTubeRadius);
    assert.ok(ring.energyTubeRadius >= 0.017);
    assert.ok(ring.segmentArcFraction >= 0.6);
    assert.ok(ring.segmentArcFraction <= 0.62);
    assert.equal(ring.accentNodeCount, 3);
  }
});

test("unlocked ring helper returns no more than the canonical three descriptors", () => {
  assert.equal(getUnlockedDysonHaloRings(0).length, 1);
  assert.equal(getUnlockedDysonHaloRings(10).length, 2);
  assert.equal(getUnlockedDysonHaloRings(20).length, 3);
  assert.equal(getUnlockedDysonHaloRings(200).length, 3);
});
