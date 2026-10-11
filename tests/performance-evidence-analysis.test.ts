import assert from "node:assert/strict";
import test from "node:test";

import {
  analyzePerformanceEvidenceBundle,
  parsePerformanceEvidenceCapture,
} from "../src/game/performanceEvidenceAnalysis.ts";
import type { PerformanceDiagnosticsSnapshot } from "../src/game/performanceDiagnostics.ts";
import type { PerformanceEvidenceCapture } from "../src/game/performanceEvidenceRecorder.ts";
import { QualityPreset } from "../src/game/types.ts";

const runtime = {
  pageUrl: "https://ingeniusvictor.github.io/orbi-energy.swarm/",
  userAgent: "ORBI-test-browser",
  viewportWidth: 1920,
  viewportHeight: 1080,
  devicePixelRatio: 1,
};

const makeSnapshot = (
  scenario: "baseline" | "l1" | "l2",
  index: number,
  options: {
    cpuOffset?: number;
    health?: "HEALTHY" | "PRESSURED" | "CRITICAL";
  } = {},
): PerformanceDiagnosticsSnapshot => {
  const level = scenario === "baseline" ? 0 : scenario === "l1" ? 1 : 2;
  const cycles = level;
  const cpuOffset = options.cpuOffset ?? 0;

  return {
    fps: 60 - cpuOffset,
    averageFrameMs: 16.67 + cpuOffset * 0.2,
    averageCpuMs: 6 + cpuOffset,
    averagePhysicsMs: 1.5 + cpuOffset * 0.2,
    averageRenderMs: 2.5 + cpuOffset * 0.4,
    averageOverheadMs: 2 + cpuOffset * 0.4,
    peakCpuMs: 8 + cpuOffset,
    physicsShare: 0.25,
    renderShare: 0.4,
    enemies: 100 + (index % 3),
    projectiles: 48 + (index % 2),
    particles: 90,
    swarm: 24,
    gaiaActive: level > 0,
    gaiaLevel: level,
    gaiaCompletedCycles: cycles,
    gaiaProgress: index % 8,
    gaiaRequired: 8,
    qualityPreset: QualityPreset.HIGH,
    frameHealthStatus: options.health ?? "HEALTHY",
  };
};

const makeCapture = (
  scenario: "baseline" | "l1" | "l2",
  options: {
    cpuOffset?: number;
    criticalFromIndex?: number;
    viewportWidth?: number;
    complete?: boolean;
    sampleCount?: number;
  } = {},
): PerformanceEvidenceCapture => {
  const count = options.sampleCount ?? 30;
  const samples = Array.from({ length: count }, (_, index) =>
    makeSnapshot(scenario, index, {
      cpuOffset: options.cpuOffset,
      health:
        options.criticalFromIndex !== undefined &&
        index >= options.criticalFromIndex
          ? "CRITICAL"
          : "HEALTHY",
    }),
  );

  return {
    schemaVersion: 1,
    startedAt: "2026-10-11T05:00:00.000Z",
    endedAt: "2026-10-11T05:00:15.500Z",
    durationMs: 15_500,
    sampleIntervalTargetMs: 500,
    targetSamples: 30,
    sampleCount: count,
    complete: options.complete ?? count === 30,
    runtime: {
      ...runtime,
      viewportWidth: options.viewportWidth ?? runtime.viewportWidth,
    },
    samples,
  };
};

test("analyzer validates complete comparable baseline, L1 and L2+ captures", () => {
  const report = analyzePerformanceEvidenceBundle({
    baseline: makeCapture("baseline"),
    gaiaL1: makeCapture("l1", { cpuOffset: 1 }),
    gaiaL2Plus: makeCapture("l2", { cpuOffset: 2 }),
  });

  assert.equal(report.triage, "READY_FOR_MANUAL_REVIEW");
  assert.equal(report.manualWindowReviewRequired, true);
  assert.equal(report.environment.comparable, true);
  assert.equal(report.errors.length, 0);
  assert.equal(report.engineThresholds.frameHealthWindowMs, 5000);
  assert.equal(report.engineThresholds.slowFrameMs, 24);
  assert.equal(report.engineThresholds.criticalFrameMs, 33.4);
  assert.equal(report.engineThresholds.requiredPressureWindows, 2);
  assert.equal(report.engineThresholds.evidenceTargetSamples, 30);

  assert.equal(report.baseline?.health.HEALTHY, 30);
  assert.equal(report.gaiaL1?.gaia.minLevel, 1);
  assert.equal(report.gaiaL2Plus?.gaia.minLevel, 2);
  assert.equal(
    report.comparisons.gaiaL1VsBaseline?.averageCpuMs.absolute,
    1,
  );
  assert.equal(
    report.comparisons.gaiaL2PlusVsBaseline?.averageCpuMs.absolute,
    2,
  );
});

test("analyzer flags environment mismatch without pretending captures are comparable", () => {
  const report = analyzePerformanceEvidenceBundle({
    baseline: makeCapture("baseline"),
    gaiaL1: makeCapture("l1", { viewportWidth: 1440 }),
    gaiaL2Plus: makeCapture("l2"),
  });

  assert.equal(report.triage, "ENVIRONMENT_MISMATCH");
  assert.equal(report.environment.comparable, false);
  assert.match(report.environment.mismatches.join("\n"), /viewport/);
});

test("new GAIA critical health observations route evidence to INVESTIGATE", () => {
  const report = analyzePerformanceEvidenceBundle({
    baseline: makeCapture("baseline"),
    gaiaL1: makeCapture("l1", { criticalFromIndex: 20 }),
    gaiaL2Plus: makeCapture("l2"),
  });

  assert.equal(report.triage, "INVESTIGATE");
  assert.equal(report.baseline?.health.CRITICAL, 0);
  assert.equal(report.gaiaL1?.health.CRITICAL, 10);
  assert.equal(
    report.comparisons.gaiaL1VsBaseline?.newlyObservedCritical,
    true,
  );
});

test("partial or short captures are invalid for certification analysis", () => {
  const report = analyzePerformanceEvidenceBundle({
    baseline: makeCapture("baseline", {
      complete: false,
      sampleCount: 10,
    }),
    gaiaL1: makeCapture("l1"),
    gaiaL2Plus: makeCapture("l2"),
  });

  assert.equal(report.triage, "INVALID");
  assert.match(report.errors.join("\n"), /complete evidence is required/);
  assert.match(report.errors.join("\n"), /exactly 30 snapshots/);
});

test("scenario identity rejects GAIA telemetry in baseline evidence", () => {
  const report = analyzePerformanceEvidenceBundle({
    baseline: makeCapture("l1"),
    gaiaL1: makeCapture("l1"),
    gaiaL2Plus: makeCapture("l2"),
  });

  assert.equal(report.triage, "INVALID");
  assert.match(report.errors.join("\n"), /baseline contains active GAIA/);
});

test("parser rejects malformed evidence before metric analysis", () => {
  const parsed = parsePerformanceEvidenceCapture({
    schemaVersion: 99,
    samples: [],
  });

  assert.equal(parsed.capture, null);
  assert.ok(parsed.errors.length > 0);
  assert.match(parsed.errors.join("\n"), /schemaVersion/);
});
