import assert from "node:assert/strict";
import test from "node:test";

import {
  BASELINE_FRAME_MS,
  HUD_SYNC_INTERVAL_MS,
  decayFrameTicks,
  getFrameUnits,
  projectFrameDamping,
  projectFrameProbability,
  stepCadenceAccumulator,
} from "../src/game/runtimeCadence.ts";

const approx = (
  actual: number,
  expected: number,
  epsilon = 1e-10,
) => {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `expected ${actual} ≈ ${expected}`,
  );
};

test("historical 60 Hz baseline maps to exactly one frame unit", () => {
  assert.equal(BASELINE_FRAME_MS, 16.6);
  assert.equal(
    getFrameUnits(BASELINE_FRAME_MS),
    1,
  );
  assert.equal(
    HUD_SYNC_INTERVAL_MS,
    166,
  );
});

test("90 and 120 Hz frame units scale by elapsed time", () => {
  approx(
    getFrameUnits(BASELINE_FRAME_MS * (2 / 3)),
    2 / 3,
  );
  approx(
    getFrameUnits(BASELINE_FRAME_MS / 2),
    0.5,
  );
});

test("frame tick decay preserves real-time duration across 60/90/120 Hz", () => {
  const initial = 12;

  const at60 = decayFrameTicks(
    initial,
    BASELINE_FRAME_MS,
  );
  assert.equal(at60, 11);

  let at120 = initial;
  for (let index = 0; index < 2; index += 1) {
    at120 = decayFrameTicks(
      at120,
      BASELINE_FRAME_MS / 2,
    );
  }
  approx(at120, 11);

  let at90 = initial;
  for (let index = 0; index < 3; index += 1) {
    at90 = decayFrameTicks(
      at90,
      BASELINE_FRAME_MS * (2 / 3),
    );
  }
  approx(at90, 10);
});

test("delta-aware damping preserves the 60 Hz multiplier over equal real time", () => {
  const baselineMultiplier = 0.82;

  assert.equal(
    projectFrameDamping(
      baselineMultiplier,
      BASELINE_FRAME_MS,
    ),
    baselineMultiplier,
  );

  const halfFrame =
    projectFrameDamping(
      baselineMultiplier,
      BASELINE_FRAME_MS / 2,
    );
  approx(
    halfFrame * halfFrame,
    baselineMultiplier,
  );

  const ninetyHzStep =
    projectFrameDamping(
      baselineMultiplier,
      BASELINE_FRAME_MS * (2 / 3),
    );
  approx(
    ninetyHzStep *
      ninetyHzStep *
      ninetyHzStep,
    baselineMultiplier * baselineMultiplier,
  );
});

test("delta-aware probability preserves the historical event probability over equal real time", () => {
  const baselineProbability = 0.4;

  assert.equal(
    projectFrameProbability(
      baselineProbability,
      BASELINE_FRAME_MS,
    ),
    baselineProbability,
  );

  const halfFrame =
    projectFrameProbability(
      baselineProbability,
      BASELINE_FRAME_MS / 2,
    );
  approx(
    1 - Math.pow(1 - halfFrame, 2),
    baselineProbability,
  );

  const ninetyHzStep =
    projectFrameProbability(
      baselineProbability,
      BASELINE_FRAME_MS * (2 / 3),
    );
  const threeNinetyHzFrames =
    1 - Math.pow(1 - ninetyHzStep, 3);
  const twoBaselineFrames =
    1 - Math.pow(1 - baselineProbability, 2);
  approx(
    threeNinetyHzFrames,
    twoBaselineFrames,
  );
});

test("HUD cadence flushes at the same real-time interval at 60/90/120 Hz", () => {
  const run = (
    delta: number,
    frames: number,
  ) => {
    let accumulator = 0;
    let flushes = 0;

    for (let index = 0; index < frames; index += 1) {
      const step = stepCadenceAccumulator(
        accumulator,
        delta,
      );
      accumulator = step.nextAccumulatorMs;
      if (step.shouldFlush) {
        flushes += 1;
      }
    }

    return { accumulator, flushes };
  };

  assert.equal(
    run(BASELINE_FRAME_MS, 10).flushes,
    1,
  );
  assert.equal(
    run(BASELINE_FRAME_MS / 2, 20).flushes,
    1,
  );
  assert.equal(
    run(
      BASELINE_FRAME_MS * (2 / 3),
      15,
    ).flushes,
    1,
  );
});

test("cadence helpers fail safe for malformed inputs", () => {
  assert.equal(getFrameUnits(Number.NaN), 0);
  assert.equal(getFrameUnits(-1), 0);
  assert.equal(
    decayFrameTicks(Number.NaN, 16.6),
    0,
  );
  assert.equal(
    projectFrameDamping(
      Number.NaN,
      16.6,
    ),
    1,
  );
  assert.equal(
    projectFrameProbability(
      Number.NaN,
      16.6,
    ),
    0,
  );

  const step = stepCadenceAccumulator(
    Number.NaN,
    Number.NaN,
    Number.NaN,
  );
  assert.equal(step.shouldFlush, false);
  assert.equal(step.nextAccumulatorMs, 0);
});
