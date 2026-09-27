import assert from "node:assert/strict";
import test from "node:test";

import {
  FRAME_HEALTH_REQUIRED_PRESSURE_WINDOWS,
  FRAME_HEALTH_WINDOW_MS,
  classifyFrameHealthWindow,
  createFrameHealthState,
  recommendLowerQualityPreset,
  resetFrameHealthState,
  stepFrameHealthMonitor,
} from "../src/game/frameHealthMonitor.ts";
import { QualityPreset } from "../src/game/types.ts";

const fillWindow = (
  deltaMs: number,
  preset: QualityPreset,
  state = createFrameHealthState(),
) => {
  let current = state;
  let completed:
    | ReturnType<typeof stepFrameHealthMonitor>["completedWindow"]
    | undefined;

  for (
    let elapsed = 0;
    elapsed < FRAME_HEALTH_WINDOW_MS + deltaMs;
    elapsed += deltaMs
  ) {
    const next = stepFrameHealthMonitor(
      current,
      deltaMs,
      preset,
    );
    current = next.state;
    if (next.completedWindow) {
      completed = next.completedWindow;
      break;
    }
  }

  assert.ok(completed);
  return {
    state: current,
    window: completed,
  };
};

test("60 Hz-like cadence is healthy", () => {
  const { window } = fillWindow(
    16.6,
    QualityPreset.HIGH,
  );

  assert.equal(window.status, "HEALTHY");
  assert.ok(window.averageDeltaMs < 17);
  assert.ok(window.p95DeltaMs < 17);
  assert.equal(window.slowFrameRatio, 0);
  assert.equal(window.recommendedPreset, undefined);
});

test("90 and 120 Hz cadences remain healthy", () => {
  for (const delta of [11.1, 8.3]) {
    const { window } = fillWindow(
      delta,
      QualityPreset.ULTRA,
    );
    assert.equal(window.status, "HEALTHY");
    assert.equal(window.recommendedPreset, undefined);
  }
});

test("moderate sustained slow frames classify as pressured", () => {
  const samples = Array.from(
    { length: 120 },
    (_, index) => (index % 5 === 0 ? 26 : 16.6),
  );
  const window = classifyFrameHealthWindow(samples);

  assert.equal(window.status, "PRESSURED");
  assert.ok(window.slowFrameRatio >= 0.15);
});

test("heavy frame loss classifies as critical", () => {
  const samples = Array.from(
    { length: 120 },
    (_, index) => (index % 3 === 0 ? 40 : 18),
  );
  const window = classifyFrameHealthWindow(samples);

  assert.equal(window.status, "CRITICAL");
  assert.ok(window.p95DeltaMs >= 33.4);
});

test("one pressured window does not recommend a downgrade", () => {
  const first = fillWindow(
    26,
    QualityPreset.HIGH,
  );

  assert.equal(first.window.status, "PRESSURED");
  assert.equal(
    first.window.consecutivePressuredWindows,
    1,
  );
  assert.equal(
    first.window.recommendedPreset,
    undefined,
  );
});

test("two pressured windows recommend exactly one lower tier", () => {
  let state = createFrameHealthState();
  let window;

  for (
    let count = 0;
    count < FRAME_HEALTH_REQUIRED_PRESSURE_WINDOWS;
    count += 1
  ) {
    const next = fillWindow(
      26,
      QualityPreset.HIGH,
      state,
    );
    state = next.state;
    window = next.window;
  }

  assert.ok(window);
  assert.equal(window.status, "PRESSURED");
  assert.equal(
    window.consecutivePressuredWindows,
    FRAME_HEALTH_REQUIRED_PRESSURE_WINDOWS,
  );
  assert.equal(
    window.recommendedPreset,
    QualityPreset.MEDIUM,
  );
});

test("healthy recovery resets the consecutive pressure counter", () => {
  const pressured = fillWindow(
    26,
    QualityPreset.HIGH,
  );
  const recovered = fillWindow(
    16.6,
    QualityPreset.HIGH,
    pressured.state,
  );

  assert.equal(recovered.window.status, "HEALTHY");
  assert.equal(
    recovered.window.consecutivePressuredWindows,
    0,
  );
  assert.equal(
    recovered.window.recommendedPreset,
    undefined,
  );
});

test("quality recommendation steps down one tier and never below LOW", () => {
  assert.equal(
    recommendLowerQualityPreset(QualityPreset.ULTRA),
    QualityPreset.HIGH,
  );
  assert.equal(
    recommendLowerQualityPreset(QualityPreset.HIGH),
    QualityPreset.MEDIUM,
  );
  assert.equal(
    recommendLowerQualityPreset(QualityPreset.MEDIUM),
    QualityPreset.LOW,
  );
  assert.equal(
    recommendLowerQualityPreset(QualityPreset.LOW),
    undefined,
  );
});

test("LOW pressure remains advisory without a lower preset", () => {
  let state = createFrameHealthState();

  const first = fillWindow(
    40,
    QualityPreset.LOW,
    state,
  );
  state = first.state;
  const second = fillWindow(
    40,
    QualityPreset.LOW,
    state,
  );

  assert.equal(second.window.status, "CRITICAL");
  assert.equal(
    second.window.recommendedPreset,
    undefined,
  );
});

test("invalid deltas fail closed without mutating state", () => {
  const state = createFrameHealthState();

  for (const delta of [
    0,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ]) {
    const next = stepFrameHealthMonitor(
      state,
      delta,
      QualityPreset.HIGH,
    );
    assert.deepEqual(next.state, state);
    assert.equal(next.completedWindow, undefined);
  }
});

test("monitor clamps pathological active deltas to its safe sample ceiling", () => {
  const state = createFrameHealthState();
  const next = stepFrameHealthMonitor(
    state,
    500,
    QualityPreset.HIGH,
  );

  assert.equal(next.state.samples[0], 100);
  assert.equal(next.state.elapsedMs, 100);
});

test("reset clears sampling and sustained-pressure continuity", () => {
  let state = createFrameHealthState();
  state = stepFrameHealthMonitor(
    state,
    26,
    QualityPreset.HIGH,
  ).state;

  const reset = resetFrameHealthState({
    ...state,
    consecutivePressuredWindows: 1,
    lastWindow: {
      status: "PRESSURED",
      sampleCount: 100,
      elapsedMs: 5000,
      averageDeltaMs: 26,
      p95DeltaMs: 26,
      slowFrameRatio: 1,
      consecutivePressuredWindows: 1,
    },
  });

  assert.deepEqual(reset.samples, []);
  assert.equal(reset.elapsedMs, 0);
  assert.equal(reset.consecutivePressuredWindows, 0);
  assert.equal(reset.lastWindow, undefined);
});
