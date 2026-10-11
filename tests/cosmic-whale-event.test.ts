import assert from "node:assert/strict";
import test from "node:test";

import {
  COSMIC_WHALE_CYCLE_MS,
  COSMIC_WHALE_WINDOW_DURATION_MS,
  COSMIC_WHALE_WINDOW_START_MS,
  projectCosmicWhaleEvent,
} from "../src/game/cosmicWhaleEvent.ts";

const midpointForCycle = (cycleIndex: number) =>
  cycleIndex * COSMIC_WHALE_CYCLE_MS +
  COSMIC_WHALE_WINDOW_START_MS +
  COSMIC_WHALE_WINDOW_DURATION_MS / 2;

const projectAt = (timeMs: number, enabled = true) =>
  projectCosmicWhaleEvent({
    timeMs,
    viewportWidth: 1280,
    viewportHeight: 720,
    enabled,
  });

test("Cosmic Whale stays absent when disabled or outside its passage window", () => {
  assert.equal(projectAt(midpointForCycle(0), false), null);
  assert.equal(projectAt(0), null);
  assert.equal(
    projectAt(COSMIC_WHALE_WINDOW_START_MS - 1),
    null,
  );
  assert.equal(
    projectAt(
      COSMIC_WHALE_WINDOW_START_MS +
        COSMIC_WHALE_WINDOW_DURATION_MS +
        1,
    ),
    null,
  );
});

test("passage starts and ends fully faded with the whale outside the viewport", () => {
  const start = projectAt(COSMIC_WHALE_WINDOW_START_MS);
  const end = projectAt(
    COSMIC_WHALE_WINDOW_START_MS +
      COSMIC_WHALE_WINDOW_DURATION_MS,
  );

  assert.ok(start);
  assert.ok(end);
  assert.equal(start.alpha, 0);
  assert.equal(end.alpha, 0);
  assert.ok(start.x < 0 || start.x > 1280);
  assert.ok(end.x < 0 || end.x > 1280);
});

test("active projection is finite, bounded and deterministic", () => {
  const timeMs = midpointForCycle(3);
  const first = projectAt(timeMs);
  const second = projectAt(timeMs);

  assert.ok(first);
  assert.deepEqual(second, first);
  assert.ok(first.progress >= 0 && first.progress <= 1);
  assert.ok(first.alpha >= 0 && first.alpha <= 0.36);
  assert.ok(first.scale >= 0.78 && first.scale <= 1.12);
  assert.ok(first.y >= 0 && first.y <= 720);
  assert.ok(first.direction === 1 || first.direction === -1);

  for (const value of [
    first.x,
    first.y,
    first.scale,
    first.alpha,
    first.tilt,
    first.tailPhase,
    first.bodyWidth,
    first.bodyHeight,
  ]) {
    assert.equal(Number.isFinite(value), true);
  }
});

test("different cycles vary the visual passage without consuming random state", () => {
  const signatures = new Set<string>();

  for (let cycle = 0; cycle < 8; cycle += 1) {
    const profile = projectAt(midpointForCycle(cycle));
    assert.ok(profile);
    signatures.add(
      [
        profile.direction,
        profile.y.toFixed(3),
        profile.scale.toFixed(3),
        profile.tilt.toFixed(4),
      ].join(":"),
    );
  }

  assert.ok(signatures.size >= 4);
});

test("long-run projection never emits NaN or Infinity", () => {
  for (let cycle = 0; cycle <= 1000; cycle += 17) {
    const profile = projectAt(midpointForCycle(cycle));
    assert.ok(profile);

    for (const value of Object.values(profile)) {
      if (typeof value === "number") {
        assert.equal(Number.isFinite(value), true);
      }
    }
  }
});

test("invalid projection inputs fail neutral", () => {
  assert.equal(
    projectCosmicWhaleEvent({
      timeMs: Number.NaN,
      viewportWidth: 1280,
      viewportHeight: 720,
      enabled: true,
    }),
    null,
  );
  assert.equal(
    projectCosmicWhaleEvent({
      timeMs: 50_000,
      viewportWidth: Number.POSITIVE_INFINITY,
      viewportHeight: 720,
      enabled: true,
    }),
    null,
  );
});
