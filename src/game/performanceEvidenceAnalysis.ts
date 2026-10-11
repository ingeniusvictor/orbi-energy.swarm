import {
  FRAME_HEALTH_CRITICAL_FRAME_MS,
  FRAME_HEALTH_REQUIRED_PRESSURE_WINDOWS,
  FRAME_HEALTH_SLOW_FRAME_MS,
  FRAME_HEALTH_WINDOW_MS,
  type FrameHealthStatus,
} from "./frameHealthMonitor";
import type { PerformanceDiagnosticsSnapshot } from "./performanceDiagnostics";
import {
  PERFORMANCE_EVIDENCE_SAMPLE_INTERVAL_MS,
  PERFORMANCE_EVIDENCE_TARGET_SAMPLES,
  type PerformanceEvidenceCapture,
  type PerformanceEvidenceRuntimeMetadata,
} from "./performanceEvidenceRecorder";

export type PerformanceEvidenceScenario =
  | "BASELINE"
  | "GAIA_L1"
  | "GAIA_L2_PLUS";

export type PerformanceEvidenceTriage =
  | "INVALID"
  | "ENVIRONMENT_MISMATCH"
  | "INVESTIGATE"
  | "READY_FOR_MANUAL_REVIEW";

export interface NumericMetricSummary {
  min: number;
  max: number;
  mean: number;
  median: number;
  p95: number;
}

export interface PerformanceEvidenceMetricSummary {
  fps: NumericMetricSummary;
  averageFrameMs: NumericMetricSummary;
  averageCpuMs: NumericMetricSummary;
  averagePhysicsMs: NumericMetricSummary;
  averageRenderMs: NumericMetricSummary;
  averageOverheadMs: NumericMetricSummary;
  peakCpuMs: NumericMetricSummary;
  enemies: NumericMetricSummary;
  projectiles: NumericMetricSummary;
  particles: NumericMetricSummary;
  swarm: NumericMetricSummary;
}

export interface PerformanceEvidenceHealthSummary {
  HEALTHY: number;
  PRESSURED: number;
  CRITICAL: number;
  UNKNOWN: number;
  worstObserved: FrameHealthStatus | "UNKNOWN";
}

export interface PerformanceEvidenceScenarioAnalysis {
  scenario: PerformanceEvidenceScenario;
  valid: boolean;
  errors: string[];
  warnings: string[];
  complete: boolean;
  durationMs: number;
  sampleCount: number;
  qualityPreset: string | null;
  runtime: PerformanceEvidenceRuntimeMetadata;
  metrics: PerformanceEvidenceMetricSummary;
  health: PerformanceEvidenceHealthSummary;
  gaia: {
    activeSamples: number;
    minLevel: number;
    maxLevel: number;
    minCompletedCycles: number;
    maxCompletedCycles: number;
  };
}

export interface PerformanceEvidenceDelta {
  baselineMean: number;
  scenarioMean: number;
  absolute: number;
  percent: number | null;
}

export interface PerformanceEvidenceScenarioComparison {
  fps: PerformanceEvidenceDelta;
  averageFrameMs: PerformanceEvidenceDelta;
  averageCpuMs: PerformanceEvidenceDelta;
  averagePhysicsMs: PerformanceEvidenceDelta;
  averageRenderMs: PerformanceEvidenceDelta;
  averageOverheadMs: PerformanceEvidenceDelta;
  peakCpuMs: PerformanceEvidenceDelta;
  enemies: PerformanceEvidenceDelta;
  projectiles: PerformanceEvidenceDelta;
  particles: PerformanceEvidenceDelta;
  swarm: PerformanceEvidenceDelta;
  newlyObservedCritical: boolean;
}

export interface PerformanceEvidenceBundleReport {
  schemaVersion: 1;
  triage: PerformanceEvidenceTriage;
  manualWindowReviewRequired: true;
  note: string;
  engineThresholds: {
    frameHealthWindowMs: number;
    slowFrameMs: number;
    criticalFrameMs: number;
    requiredPressureWindows: number;
    evidenceSampleIntervalMs: number;
    evidenceTargetSamples: number;
  };
  environment: {
    comparable: boolean;
    mismatches: string[];
  };
  baseline: PerformanceEvidenceScenarioAnalysis | null;
  gaiaL1: PerformanceEvidenceScenarioAnalysis | null;
  gaiaL2Plus: PerformanceEvidenceScenarioAnalysis | null;
  comparisons: {
    gaiaL1VsBaseline: PerformanceEvidenceScenarioComparison | null;
    gaiaL2PlusVsBaseline: PerformanceEvidenceScenarioComparison | null;
  };
  errors: string[];
  warnings: string[];
}

const METRIC_KEYS = [
  "fps",
  "averageFrameMs",
  "averageCpuMs",
  "averagePhysicsMs",
  "averageRenderMs",
  "averageOverheadMs",
  "peakCpuMs",
  "enemies",
  "projectiles",
  "particles",
  "swarm",
] as const;

type MetricKey = (typeof METRIC_KEYS)[number];

const REQUIRED_NUMERIC_SAMPLE_FIELDS = [
  ...METRIC_KEYS,
  "physicsShare",
  "renderShare",
  "gaiaLevel",
  "gaiaCompletedCycles",
  "gaiaProgress",
  "gaiaRequired",
] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isFiniteNonNegative = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

const percentile = (values: readonly number[], rank: number) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil(rank * sorted.length) - 1),
  );
  return sorted[index];
};

const summarizeNumbers = (values: readonly number[]): NumericMetricSummary => {
  if (values.length === 0) {
    return { min: 0, max: 0, mean: 0, median: 0, p95: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle];
  const sum = sorted.reduce((total, value) => total + value, 0);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: sum / sorted.length,
    median,
    p95: percentile(sorted, 0.95),
  };
};

const summarizeMetric = (
  samples: readonly PerformanceDiagnosticsSnapshot[],
  key: MetricKey,
) => summarizeNumbers(samples.map((sample) => sample[key]));

const summarizeMetrics = (
  samples: readonly PerformanceDiagnosticsSnapshot[],
): PerformanceEvidenceMetricSummary => ({
  fps: summarizeMetric(samples, "fps"),
  averageFrameMs: summarizeMetric(samples, "averageFrameMs"),
  averageCpuMs: summarizeMetric(samples, "averageCpuMs"),
  averagePhysicsMs: summarizeMetric(samples, "averagePhysicsMs"),
  averageRenderMs: summarizeMetric(samples, "averageRenderMs"),
  averageOverheadMs: summarizeMetric(samples, "averageOverheadMs"),
  peakCpuMs: summarizeMetric(samples, "peakCpuMs"),
  enemies: summarizeMetric(samples, "enemies"),
  projectiles: summarizeMetric(samples, "projectiles"),
  particles: summarizeMetric(samples, "particles"),
  swarm: summarizeMetric(samples, "swarm"),
});

const summarizeHealth = (
  samples: readonly PerformanceDiagnosticsSnapshot[],
): PerformanceEvidenceHealthSummary => {
  const counts = {
    HEALTHY: 0,
    PRESSURED: 0,
    CRITICAL: 0,
    UNKNOWN: 0,
  };

  for (const sample of samples) {
    if (sample.frameHealthStatus === "HEALTHY") counts.HEALTHY += 1;
    else if (sample.frameHealthStatus === "PRESSURED") counts.PRESSURED += 1;
    else if (sample.frameHealthStatus === "CRITICAL") counts.CRITICAL += 1;
    else counts.UNKNOWN += 1;
  }

  const worstObserved: FrameHealthStatus | "UNKNOWN" =
    counts.CRITICAL > 0
      ? "CRITICAL"
      : counts.PRESSURED > 0
        ? "PRESSURED"
        : counts.HEALTHY > 0
          ? "HEALTHY"
          : "UNKNOWN";

  return { ...counts, worstObserved };
};

const validateSnapshot = (
  value: unknown,
  index: number,
  errors: string[],
) => {
  if (!isRecord(value)) {
    errors.push(`samples[${index}] is not an object`);
    return;
  }

  for (const key of REQUIRED_NUMERIC_SAMPLE_FIELDS) {
    if (!isFiniteNonNegative(value[key])) {
      errors.push(
        `samples[${index}].${key} must be a finite non-negative number`,
      );
    }
  }

  if (typeof value.gaiaActive !== "boolean") {
    errors.push(`samples[${index}].gaiaActive must be boolean`);
  }
  if (
    typeof value.qualityPreset !== "string" ||
    !["LOW", "MEDIUM", "HIGH", "ULTRA"].includes(value.qualityPreset)
  ) {
    errors.push(`samples[${index}].qualityPreset is invalid`);
  }
  if (
    value.frameHealthStatus !== undefined &&
    !["HEALTHY", "PRESSURED", "CRITICAL"].includes(
      String(value.frameHealthStatus),
    )
  ) {
    errors.push(`samples[${index}].frameHealthStatus is invalid`);
  }
};

export const parsePerformanceEvidenceCapture = (
  value: unknown,
): { capture: PerformanceEvidenceCapture | null; errors: string[] } => {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { capture: null, errors: ["capture root must be an object"] };
  }

  if (value.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  for (const key of ["startedAt", "endedAt"] as const) {
    if (typeof value[key] !== "string" || Number.isNaN(Date.parse(value[key]))) {
      errors.push(`${key} must be an ISO-compatible date string`);
    }
  }
  for (
    const key of [
      "durationMs",
      "sampleIntervalTargetMs",
      "targetSamples",
      "sampleCount",
    ] as const
  ) {
    if (!isFiniteNonNegative(value[key])) {
      errors.push(`${key} must be a finite non-negative number`);
    }
  }
  if (typeof value.complete !== "boolean") errors.push("complete must be boolean");

  if (!isRecord(value.runtime)) {
    errors.push("runtime metadata is missing or invalid");
  } else {
    for (const key of ["pageUrl", "userAgent"] as const) {
      if (typeof value.runtime[key] !== "string") {
        errors.push(`runtime.${key} must be a string`);
      }
    }
    for (
      const key of [
        "viewportWidth",
        "viewportHeight",
        "devicePixelRatio",
      ] as const
    ) {
      if (!isFiniteNonNegative(value.runtime[key])) {
        errors.push(`runtime.${key} must be a finite non-negative number`);
      }
    }
  }

  if (!Array.isArray(value.samples)) {
    errors.push("samples must be an array");
  } else {
    value.samples.forEach((sample, index) =>
      validateSnapshot(sample, index, errors),
    );
    if (
      typeof value.sampleCount === "number" &&
      value.sampleCount !== value.samples.length
    ) {
      errors.push("sampleCount must equal samples.length");
    }
  }

  return errors.length > 0
    ? { capture: null, errors }
    : {
        capture: value as unknown as PerformanceEvidenceCapture,
        errors: [],
      };
};

const analyzeScenario = (
  capture: PerformanceEvidenceCapture,
  scenario: PerformanceEvidenceScenario,
): PerformanceEvidenceScenarioAnalysis => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const samples = capture.samples;
  const activeSamples = samples.filter((sample) => sample.gaiaActive).length;
  const levels = samples.map((sample) => sample.gaiaLevel);
  const cycles = samples.map((sample) => sample.gaiaCompletedCycles);
  const minLevel = levels.length > 0 ? Math.min(...levels) : 0;
  const maxLevel = levels.length > 0 ? Math.max(...levels) : 0;
  const minCompletedCycles = cycles.length > 0 ? Math.min(...cycles) : 0;
  const maxCompletedCycles = cycles.length > 0 ? Math.max(...cycles) : 0;

  if (!capture.complete) {
    errors.push("capture is partial; complete evidence is required");
  }
  if (
    capture.targetSamples !== PERFORMANCE_EVIDENCE_TARGET_SAMPLES ||
    capture.sampleCount !== PERFORMANCE_EVIDENCE_TARGET_SAMPLES
  ) {
    errors.push(
      `capture must contain exactly ${PERFORMANCE_EVIDENCE_TARGET_SAMPLES} snapshots`,
    );
  }
  if (
    capture.sampleIntervalTargetMs !==
    PERFORMANCE_EVIDENCE_SAMPLE_INTERVAL_MS
  ) {
    errors.push(
      `sample interval target must be ${PERFORMANCE_EVIDENCE_SAMPLE_INTERVAL_MS} ms`,
    );
  }
  if (
    capture.durationMs <
    PERFORMANCE_EVIDENCE_TARGET_SAMPLES *
      PERFORMANCE_EVIDENCE_SAMPLE_INTERVAL_MS
  ) {
    errors.push("capture duration must cover at least 15000 ms");
  }

  const qualityPresets = new Set(
    samples.map((sample) => sample.qualityPreset),
  );
  if (qualityPresets.size !== 1) {
    errors.push("quality preset changed during capture");
  }

  if (scenario === "BASELINE") {
    if (activeSamples !== 0) errors.push("baseline contains active GAIA samples");
    if (maxLevel !== 0 || maxCompletedCycles !== 0) {
      errors.push("baseline GAIA level/cycle telemetry must remain zero");
    }
  } else if (scenario === "GAIA_L1") {
    if (activeSamples !== samples.length) {
      errors.push("GAIA L1 must remain active for every retained sample");
    }
    if (minLevel !== 1 || maxLevel !== 1) {
      errors.push("GAIA L1 capture must remain exactly level 1");
    }
    if (minCompletedCycles !== 1 || maxCompletedCycles !== 1) {
      errors.push("GAIA L1 capture must remain exactly at cycle 1");
    }
  } else {
    if (activeSamples !== samples.length) {
      errors.push("GAIA L2+ must remain active for every retained sample");
    }
    if (minLevel < 2 || minCompletedCycles < 2) {
      errors.push("GAIA L2+ must remain at level/cycle 2 or higher");
    }
  }

  const health = summarizeHealth(samples);
  if (health.UNKNOWN > 0) {
    warnings.push(
      `${health.UNKNOWN} snapshots do not include frame health status`,
    );
  }

  return {
    scenario,
    valid: errors.length === 0,
    errors,
    warnings,
    complete: capture.complete,
    durationMs: capture.durationMs,
    sampleCount: capture.sampleCount,
    qualityPreset: samples[0]?.qualityPreset ?? null,
    runtime: capture.runtime,
    metrics: summarizeMetrics(samples),
    health,
    gaia: {
      activeSamples,
      minLevel,
      maxLevel,
      minCompletedCycles,
      maxCompletedCycles,
    },
  };
};

const normalizePageLocation = (pageUrl: string) => {
  try {
    const url = new URL(pageUrl);
    return `${url.origin}${url.pathname}`;
  } catch {
    return pageUrl;
  }
};

const compareEnvironments = (
  baseline: PerformanceEvidenceScenarioAnalysis,
  others: readonly PerformanceEvidenceScenarioAnalysis[],
) => {
  const mismatches: string[] = [];

  for (const analysis of others) {
    const label = analysis.scenario;
    if (analysis.qualityPreset !== baseline.qualityPreset) {
      mismatches.push(`${label}: quality preset differs from baseline`);
    }
    if (
      analysis.runtime.viewportWidth !== baseline.runtime.viewportWidth ||
      analysis.runtime.viewportHeight !== baseline.runtime.viewportHeight
    ) {
      mismatches.push(`${label}: viewport differs from baseline`);
    }
    if (
      analysis.runtime.devicePixelRatio !==
      baseline.runtime.devicePixelRatio
    ) {
      mismatches.push(`${label}: devicePixelRatio differs from baseline`);
    }
    if (analysis.runtime.userAgent !== baseline.runtime.userAgent) {
      mismatches.push(`${label}: userAgent differs from baseline`);
    }
    if (
      normalizePageLocation(analysis.runtime.pageUrl) !==
      normalizePageLocation(baseline.runtime.pageUrl)
    ) {
      mismatches.push(`${label}: page location differs from baseline`);
    }
  }

  return { comparable: mismatches.length === 0, mismatches };
};

const delta = (
  baselineMean: number,
  scenarioMean: number,
): PerformanceEvidenceDelta => ({
  baselineMean,
  scenarioMean,
  absolute: scenarioMean - baselineMean,
  percent:
    Math.abs(baselineMean) > Number.EPSILON
      ? ((scenarioMean - baselineMean) / baselineMean) * 100
      : null,
});

const compareScenario = (
  baseline: PerformanceEvidenceScenarioAnalysis,
  scenario: PerformanceEvidenceScenarioAnalysis,
): PerformanceEvidenceScenarioComparison => ({
  fps: delta(baseline.metrics.fps.mean, scenario.metrics.fps.mean),
  averageFrameMs: delta(
    baseline.metrics.averageFrameMs.mean,
    scenario.metrics.averageFrameMs.mean,
  ),
  averageCpuMs: delta(
    baseline.metrics.averageCpuMs.mean,
    scenario.metrics.averageCpuMs.mean,
  ),
  averagePhysicsMs: delta(
    baseline.metrics.averagePhysicsMs.mean,
    scenario.metrics.averagePhysicsMs.mean,
  ),
  averageRenderMs: delta(
    baseline.metrics.averageRenderMs.mean,
    scenario.metrics.averageRenderMs.mean,
  ),
  averageOverheadMs: delta(
    baseline.metrics.averageOverheadMs.mean,
    scenario.metrics.averageOverheadMs.mean,
  ),
  peakCpuMs: delta(
    baseline.metrics.peakCpuMs.mean,
    scenario.metrics.peakCpuMs.mean,
  ),
  enemies: delta(baseline.metrics.enemies.mean, scenario.metrics.enemies.mean),
  projectiles: delta(
    baseline.metrics.projectiles.mean,
    scenario.metrics.projectiles.mean,
  ),
  particles: delta(
    baseline.metrics.particles.mean,
    scenario.metrics.particles.mean,
  ),
  swarm: delta(baseline.metrics.swarm.mean, scenario.metrics.swarm.mean),
  newlyObservedCritical:
    scenario.health.CRITICAL > baseline.health.CRITICAL,
});

const prefix = (label: string, values: readonly string[]) =>
  values.map((value) => `${label}: ${value}`);

export const analyzePerformanceEvidenceBundle = (input: {
  baseline: unknown;
  gaiaL1: unknown;
  gaiaL2Plus: unknown;
}): PerformanceEvidenceBundleReport => {
  const parsedBaseline = parsePerformanceEvidenceCapture(input.baseline);
  const parsedL1 = parsePerformanceEvidenceCapture(input.gaiaL1);
  const parsedL2 = parsePerformanceEvidenceCapture(input.gaiaL2Plus);

  const baseline = parsedBaseline.capture
    ? analyzeScenario(parsedBaseline.capture, "BASELINE")
    : null;
  const gaiaL1 = parsedL1.capture
    ? analyzeScenario(parsedL1.capture, "GAIA_L1")
    : null;
  const gaiaL2Plus = parsedL2.capture
    ? analyzeScenario(parsedL2.capture, "GAIA_L2_PLUS")
    : null;

  const errors = [
    ...prefix("BASELINE", parsedBaseline.errors),
    ...prefix("GAIA_L1", parsedL1.errors),
    ...prefix("GAIA_L2_PLUS", parsedL2.errors),
    ...(baseline ? prefix("BASELINE", baseline.errors) : []),
    ...(gaiaL1 ? prefix("GAIA_L1", gaiaL1.errors) : []),
    ...(gaiaL2Plus ? prefix("GAIA_L2_PLUS", gaiaL2Plus.errors) : []),
  ];
  const warnings = [
    ...(baseline ? prefix("BASELINE", baseline.warnings) : []),
    ...(gaiaL1 ? prefix("GAIA_L1", gaiaL1.warnings) : []),
    ...(gaiaL2Plus ? prefix("GAIA_L2_PLUS", gaiaL2Plus.warnings) : []),
  ];

  const environment =
    baseline && gaiaL1 && gaiaL2Plus
      ? compareEnvironments(baseline, [gaiaL1, gaiaL2Plus])
      : { comparable: false, mismatches: ["all three scenarios are required"] };

  const gaiaL1VsBaseline =
    baseline && gaiaL1 ? compareScenario(baseline, gaiaL1) : null;
  const gaiaL2PlusVsBaseline =
    baseline && gaiaL2Plus
      ? compareScenario(baseline, gaiaL2Plus)
      : null;

  let triage: PerformanceEvidenceTriage = "READY_FOR_MANUAL_REVIEW";
  if (errors.length > 0) triage = "INVALID";
  else if (!environment.comparable) triage = "ENVIRONMENT_MISMATCH";
  else if (
    gaiaL1VsBaseline?.newlyObservedCritical ||
    gaiaL2PlusVsBaseline?.newlyObservedCritical
  ) {
    triage = "INVESTIGATE";
  }

  return {
    schemaVersion: 1,
    triage,
    manualWindowReviewRequired: true,
    note:
      "500 ms evidence snapshots preserve the engine-reported health state but not exact 5 s window boundaries; final #202 certification still requires manual window and visual review.",
    engineThresholds: {
      frameHealthWindowMs: FRAME_HEALTH_WINDOW_MS,
      slowFrameMs: FRAME_HEALTH_SLOW_FRAME_MS,
      criticalFrameMs: FRAME_HEALTH_CRITICAL_FRAME_MS,
      requiredPressureWindows: FRAME_HEALTH_REQUIRED_PRESSURE_WINDOWS,
      evidenceSampleIntervalMs: PERFORMANCE_EVIDENCE_SAMPLE_INTERVAL_MS,
      evidenceTargetSamples: PERFORMANCE_EVIDENCE_TARGET_SAMPLES,
    },
    environment,
    baseline,
    gaiaL1,
    gaiaL2Plus,
    comparisons: {
      gaiaL1VsBaseline,
      gaiaL2PlusVsBaseline,
    },
    errors,
    warnings,
  };
};
