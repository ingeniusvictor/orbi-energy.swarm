import assert from "node:assert/strict";
import test from "node:test";

import {
  FOTON_DYSON_HALO_RED_ACCENT,
  FOTON_DYSON_HALO_RINGS,
  getUnlockedDysonHaloRingCount,
  getUnlockedDysonHaloRings,
} from "../src/game/fotonDysonHalo.ts";

test("Dyson halo unlocks one ring for 0-9 Orbi", () => {
  for (const count of [0, 1, 9]) {
    assert.equal(
      getUnlockedDysonHaloRingCount(count),
      1,
    );
  }
});

test("Dyson halo unlocks cyan plus emerald for 10-19 Orbi", () => {
  for (const count of [10, 14, 19]) {
    assert.equal(
      getUnlockedDysonHaloRingCount(count),
      2,
    );
  }
});

test("Dyson halo caps at three rings from 20 Orbi onward", () => {
  for (const count of [20, 30, 999]) {
    assert.equal(
      getUnlockedDysonHaloRingCount(count),
      3,
    );
  }
});

test("invalid or negative Orbi counts fail safe to the base cyan ring", () => {
  assert.equal(
    getUnlockedDysonHaloRingCount(Number.NaN),
    1,
  );
  assert.equal(
    getUnlockedDysonHaloRingCount(-100),
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

test("rings keep distinct slow orbital motion and detached radii", () => {
  const speeds = FOTON_DYSON_HALO_RINGS.map(
    (ring) => ring.angularVelocity,
  );
  assert.equal(new Set(speeds).size, 3);
  assert.ok(
    speeds.every(
      (speed) => Math.abs(speed) <= 0.24,
    ),
  );
  assert.deepEqual(
    FOTON_DYSON_HALO_RINGS.map((ring) => ring.radius),
    [0.93, 1, 1.07],
  );
});

test("unlocked ring helper returns no more than the canonical three descriptors", () => {
  assert.equal(getUnlockedDysonHaloRings(0).length, 1);
  assert.equal(getUnlockedDysonHaloRings(10).length, 2);
  assert.equal(getUnlockedDysonHaloRings(20).length, 3);
  assert.equal(getUnlockedDysonHaloRings(200).length, 3);
});
