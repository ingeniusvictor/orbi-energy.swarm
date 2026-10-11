import assert from "node:assert/strict";
import test from "node:test";

import {
  PERFORMANCE_EVIDENCE_TARGET_SAMPLES,
  appendPerformanceEvidenceSample,
  buildPerformanceEvidenceCapture,
  createPerformanceEvidenceRecorderState,
  getPerformanceEvidenceFilename,
  serializePerformanceEvidence,
  startPerformanceEvidenceRecording,
} from "../src/game/performanceEvidenceRecorder.ts";
import type { PerformanceDiagnosticsSnapshot } from "../src/game/performanceDiagnostics.ts";
import { QualityPreset } from "../src/game/types.ts";

const snapshot = (index = 0): PerformanceDiagnosticsSnapshot => ({
  fps: 60 - index * 0.1,
  averageFrameMs: 16.7 + index * 0.01,
  averageCpuMs: 7 + index * 0.01,
  averagePhysicsMs: 2,
  averageRenderMs: 3,
  averageOverheadMs: 2,
  peakCpuMs: 9 + index * 0.02,
  physicsShare: 2 / 7,
  renderShare: 3 / 7,
  enemies: 80 + index,
  projectiles: 40 + index,
  particles: 120,
  swarm: 25,
  gaiaActive: true,
  gaiaLevel: 2,
  gaiaCompletedCycles: 2,
  gaiaProgress: index % 8,
  gaiaRequired: 8,
  qualityPreset: QualityPreset.HIGH,
  frameHealthStatus: "HEALTHY",
});

const runtime = {
  pageUrl: "https://example.test/orbi",
  userAgent: "test-agent",
  viewportWidth: 1920,
  viewportHeight: 1080,
  devicePixelRatio: 1,
};

test("evidence recorder starts empty and only records while active", () => {
  const idle = createPerformanceEvidenceRecorderState();
  assert.equal(idle.status, "IDLE");
  assert.equal(idle.samples.length, 0);
  assert.equal(appendPerformanceEvidenceSample(idle, snapshot()), idle);

  const recording = startPerformanceEvidenceRecording(1_000);
  assert.equal(recording.status, "RECORDING");
  assert.equal(recording.startedAtMs, 1_000);
  assert.equal(recording.samples.length, 0);
});

test("evidence recorder becomes READY at exactly 30 snapshots and never grows beyond the cap", () => {
  let state = startPerformanceEvidenceRecording(1_000);

  for (let index = 0; index < PERFORMANCE_EVIDENCE_TARGET_SAMPLES; index += 1) {
    state = appendPerformanceEvidenceSample(state, snapshot(index));
  }

  assert.equal(PERFORMANCE_EVIDENCE_TARGET_SAMPLES, 30);
  assert.equal(state.status, "READY");
  assert.equal(state.samples.length, 30);

  const afterExtra = appendPerformanceEvidenceSample(state, snapshot(999));
  assert.equal(afterExtra, state);
  assert.equal(afterExtra.samples.length, 30);
});

test("partial and complete captures are labeled without fabricating duration", () => {
  let partialState = startPerformanceEvidenceRecording(10_000);
  for (let index = 0; index < 5; index += 1) {
    partialState = appendPerformanceEvidenceSample(partialState, snapshot(index));
  }
  const partial = buildPerformanceEvidenceCapture(
    partialState,
    12_500,
    runtime,
  );
  assert.ok(partial);
  assert.equal(partial.complete, false);
  assert.equal(partial.sampleCount, 5);
  assert.equal(partial.durationMs, 2_500);

  let completeState = startPerformanceEvidenceRecording(20_000);
  for (let index = 0; index < 30; index += 1) {
    completeState = appendPerformanceEvidenceSample(completeState, snapshot(index));
  }
  const complete = buildPerformanceEvidenceCapture(
    completeState,
    35_000,
    runtime,
  );
  assert.ok(complete);
  assert.equal(complete.complete, true);
  assert.equal(complete.sampleCount, 30);
  assert.equal(complete.durationMs, 15_000);
  assert.equal(complete.targetSamples, 30);
  assert.equal(complete.sampleIntervalTargetMs, 500);
});

test("evidence serialization retains GAIA and entity-pressure fields", () => {
  let state = startPerformanceEvidenceRecording(0);
  state = appendPerformanceEvidenceSample(state, snapshot(3));
  const capture = buildPerformanceEvidenceCapture(state, 500, runtime);
  assert.ok(capture);

  const serialized = serializePerformanceEvidence(capture);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.schemaVersion, 1);
  assert.equal(parsed.samples[0].gaiaActive, true);
  assert.equal(parsed.samples[0].gaiaLevel, 2);
  assert.equal(parsed.samples[0].enemies, 83);
  assert.equal(parsed.runtime.pageUrl, runtime.pageUrl);
  assert.match(getPerformanceEvidenceFilename(capture), /partial\.json$/);
});
