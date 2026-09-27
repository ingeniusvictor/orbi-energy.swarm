import assert from "node:assert/strict";
import test from "node:test";

import {
  PERFORMANCE_DIAGNOSTICS_WINDOW_MS,
  createPerformanceDiagnosticsState,
  stepPerformanceDiagnostics,
} from "../src/game/performanceDiagnostics.ts";
import { QualityPreset } from "../src/game/types.ts";

const sample = (overrides = {}) => ({
  frameMs: 16.6,
  loopCpuMs: 10,
  physicsMs: 6,
  renderMs: 3,
  enemies: 40,
  projectiles: 80,
  particles: 120,
  swarm: 18,
  qualityPreset: QualityPreset.HIGH,
  frameHealthStatus: "HEALTHY",
  ...overrides,
});

test("diagnostics window remains silent before 500ms", () => {
  let state = createPerformanceDiagnosticsState();
  let snapshot;

  for (let index = 0; index < 10; index += 1) {
    const next = stepPerformanceDiagnostics(
      state,
      sample(),
    );
    state = next.state;
    snapshot = next.snapshot;
  }

  assert.equal(snapshot, undefined);
  assert.ok(state.elapsedMs < PERFORMANCE_DIAGNOSTICS_WINDOW_MS);
});

test("diagnostics emits a bounded 0.5s aggregate snapshot", () => {
  let state = createPerformanceDiagnosticsState();
  let snapshot;

  for (let index = 0; index < 40; index += 1) {
    const next = stepPerformanceDiagnostics(
      state,
      sample(),
    );
    state = next.state;
    if (next.snapshot) {
      snapshot = next.snapshot;
      break;
    }
  }

  assert.ok(snapshot);
  assert.ok(snapshot.fps > 59 && snapshot.fps < 61);
  assert.equal(snapshot.averageCpuMs, 10);
  assert.equal(snapshot.averagePhysicsMs, 6);
  assert.equal(snapshot.averageRenderMs, 3);
  assert.equal(snapshot.averageOverheadMs, 1);
  assert.equal(snapshot.peakCpuMs, 10);
  assert.equal(snapshot.physicsShare, 0.6);
  assert.equal(snapshot.renderShare, 0.3);
  assert.equal(snapshot.enemies, 40);
  assert.equal(snapshot.projectiles, 80);
  assert.equal(snapshot.particles, 120);
  assert.equal(snapshot.swarm, 18);
  assert.equal(snapshot.qualityPreset, QualityPreset.HIGH);
  assert.equal(snapshot.frameHealthStatus, "HEALTHY");
});

test("snapshot resets its aggregation window after emission", () => {
  let state = createPerformanceDiagnosticsState();

  for (let index = 0; index < 40; index += 1) {
    const next = stepPerformanceDiagnostics(
      state,
      sample(),
    );
    state = next.state;
    if (next.snapshot) {
      break;
    }
  }

  assert.deepEqual(
    state,
    createPerformanceDiagnosticsState(),
  );
});

test("CPU phase timing is clamped to total loop work", () => {
  let state = createPerformanceDiagnosticsState();
  let snapshot;

  for (let index = 0; index < 40; index += 1) {
    const next = stepPerformanceDiagnostics(
      state,
      sample({
        loopCpuMs: 5,
        physicsMs: 8,
        renderMs: 9,
      }),
    );
    state = next.state;
    if (next.snapshot) {
      snapshot = next.snapshot;
      break;
    }
  }

  assert.ok(snapshot);
  assert.equal(snapshot.averageCpuMs, 5);
  assert.equal(snapshot.averagePhysicsMs, 5);
  assert.equal(snapshot.averageRenderMs, 0);
  assert.equal(snapshot.averageOverheadMs, 0);
});

test("latest entity counts and health status win within a window", () => {
  let state = createPerformanceDiagnosticsState();
  let snapshot;

  for (let index = 0; index < 40; index += 1) {
    const next = stepPerformanceDiagnostics(
      state,
      sample({
        enemies: index,
        projectiles: index * 2,
        particles: index * 3,
        frameHealthStatus:
          index >= 30 ? "CRITICAL" : "HEALTHY",
      }),
    );
    state = next.state;
    if (next.snapshot) {
      snapshot = next.snapshot;
      break;
    }
  }

  assert.ok(snapshot);
  assert.ok(snapshot.enemies >= 30);
  assert.equal(snapshot.projectiles, snapshot.enemies * 2);
  assert.equal(snapshot.particles, snapshot.enemies * 3);
  assert.equal(snapshot.frameHealthStatus, "CRITICAL");
});

test("invalid zero frame samples fail closed", () => {
  const state = createPerformanceDiagnosticsState();
  const next = stepPerformanceDiagnostics(
    state,
    sample({
      frameMs: 0,
      loopCpuMs: Number.NaN,
    }),
  );

  assert.deepEqual(next.state, state);
  assert.equal(next.snapshot, undefined);
});
