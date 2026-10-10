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
    assert.equal(
      getUnlockedDysonHaloRingCount(count),
      1,
    );
  }
});

test("true collected-Orbi progression unlocks cyan plus emerald for 10-19", () => {
  for (const count of [10, 14, 19]) {
    assert.equal(
      getUnlockedDysonHaloRingCount(count),
      2,
    );
  }
});

test("true collected-Orbi progression caps at three rings from 20 onward", () => {
  for (const count of [20, 30, 999]) {
    assert.equal(
      getUnlockedDysonHaloRingCount(count),
      3,
    );
  }
});

test("live swarm size subtracts the free starting companion before ring thresholds", () => {
  assert.equal(getCollectedOrbiCountFromSwarmSize(0), 0);
  assert.equal(getCollectedOrbiCountFromSwarmSize(1), 0);
  assert.equal(getCollectedOrbiCountFromSwarmSize(10), 9);
  assert.equal(getCollectedOrbiCountFromSwarmSize(11), 10);
  assert.equal(getCollectedOrbiCountFromSwarmSize(21), 20);

  assert.equal(
    getUnlockedDysonHaloRingCountFromSwarmSize(1),
    1,
  );
  assert.equal(
    getUnlockedDysonHaloRingCountFromSwarmSize(10),
    1,
  );
  assert.equal(
    getUnlockedDysonHaloRingCountFromSwarmSize(11),
    2,
  );
  assert.equal(
    getUnlockedDysonHaloRingCountFromSwarmSize(20),
    2,
  );
  assert.equal(
    getUnlockedDysonHaloRingCountFromSwarmSize(21),
    3,
  );
});

test("invalid or negative counts fail safe to the base cyan ring", () => {
  assert.equal(
    getUnlockedDysonHaloRingCount(Number.NaN),
    1,
  );
  assert.equal(
    getUnlockedDysonHaloRingCount(-100),
    1,
  );
  assert.equal(
    getUnlockedDysonHaloRingCountFromSwarmSize(Number.NaN),
    1,
  );
});

test("ring palette is cyan, emerald and gold with shared red tactical accents", () => {
  assert.deepEqual(
    FOTON_DYSON_HALO_RINGS.map((ring) => ring.color),
    [0x22d3ee, 0x10b981, 0xfbbf24],
  );
  assert.ok(
    FOTON_DYSON_HALO_RINGS.every(
      (ring) =>
        ring.accentColor ===
        FOTON_DYSON_HALO_RED_ACCENT,
    ),
  );
  assert.equal(
    FOTON_DYSON_HALO_RED_ACCENT,
    0xef4444,
  );
});

test("rings share a compact Dyson-sphere radius but keep distinct slow orbital planes", () => {
  const speeds = FOTON_DYSON_HALO_RINGS.map(
    (ring) => ring.angularVelocity,
  );
  assert.equal(new Set(speeds).size, 3);
  assert.ok(
    speeds.every(
      (speed) => Math.abs(speed) <= 0.17,
    ),
  );

  const radii = FOTON_DYSON_HALO_RINGS.map(
    (ring) => ring.radius,
  );
  assert.ok(Math.max(...radii) - Math.min(...radii) <= 0.03);

  const tilts = FOTON_DYSON_HALO_RINGS.map(
    (ring) => ring.tilt.join(","),
  );
  assert.equal(new Set(tilts).size, 3);
});

test("every ring owns a mechanical rail, narrow energy conduit and sparse segmented language", () => {
  for (const ring of FOTON_DYSON_HALO_RINGS) {
    assert.ok(ring.railTubeRadius > ring.energyTubeRadius);
    assert.ok(ring.segmentArcFraction >= 0.5);
    assert.ok(ring.segmentArcFraction <= 0.6);
    assert.equal(ring.accentNodeCount, 3);
  }
});

test("unlocked ring helper returns no more than the canonical three descriptors", () => {
  assert.equal(getUnlockedDysonHaloRings(0).length, 1);
  assert.equal(getUnlockedDysonHaloRings(10).length, 2);
  assert.equal(getUnlockedDysonHaloRings(20).length, 3);
  assert.equal(getUnlockedDysonHaloRings(200).length, 3);
});
