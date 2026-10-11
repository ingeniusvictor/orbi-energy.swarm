import type { PerformanceDiagnosticsSnapshot } from "./performanceDiagnostics";

export const PERFORMANCE_EVIDENCE_SAMPLE_INTERVAL_MS = 500;
export const PERFORMANCE_EVIDENCE_TARGET_SAMPLES = 30;

export type PerformanceEvidenceRecorderStatus =
  | "IDLE"
  | "RECORDING"
  | "READY";

export interface PerformanceEvidenceRecorderState {
  status: PerformanceEvidenceRecorderStatus;
  startedAtMs: number | null;
  skipNextSnapshot: boolean;
  samples: PerformanceDiagnosticsSnapshot[];
}

export interface PerformanceEvidenceRuntimeMetadata {
  pageUrl: string;
  userAgent: string;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
}

export interface PerformanceEvidenceCapture {
  schemaVersion: 1;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  sampleIntervalTargetMs: number;
  targetSamples: number;
  sampleCount: number;
  complete: boolean;
  runtime: PerformanceEvidenceRuntimeMetadata;
  samples: PerformanceDiagnosticsSnapshot[];
}

export const createPerformanceEvidenceRecorderState =
  (): PerformanceEvidenceRecorderState => ({
    status: "IDLE",
    startedAtMs: null,
    skipNextSnapshot: false,
    samples: [],
  });

export const startPerformanceEvidenceRecording = (
  startedAtMs: number,
): PerformanceEvidenceRecorderState => ({
  status: "RECORDING",
  startedAtMs,
  skipNextSnapshot: true,
  samples: [],
});

export const appendPerformanceEvidenceSample = (
  state: PerformanceEvidenceRecorderState,
  snapshot: PerformanceDiagnosticsSnapshot,
): PerformanceEvidenceRecorderState => {
  if (state.status !== "RECORDING") return state;

  // F4 can begin between two existing 500 ms diagnostics windows. The first
  // snapshot after the hotkey may therefore contain a small pre-start slice.
  // Discard it once; stepPerformanceDiagnostics resets its own accumulator
  // after producing that snapshot, so every retained sample is post-start.
  if (state.skipNextSnapshot) {
    return {
      ...state,
      skipNextSnapshot: false,
    };
  }

  if (state.samples.length >= PERFORMANCE_EVIDENCE_TARGET_SAMPLES) {
    return {
      ...state,
      status: "READY",
      samples: state.samples.slice(0, PERFORMANCE_EVIDENCE_TARGET_SAMPLES),
    };
  }

  const samples = [...state.samples, snapshot].slice(
    0,
    PERFORMANCE_EVIDENCE_TARGET_SAMPLES,
  );
  return {
    ...state,
    status:
      samples.length >= PERFORMANCE_EVIDENCE_TARGET_SAMPLES
        ? "READY"
        : "RECORDING",
    samples,
  };
};

export const buildPerformanceEvidenceCapture = (
  state: PerformanceEvidenceRecorderState,
  endedAtMs: number,
  runtime: PerformanceEvidenceRuntimeMetadata,
): PerformanceEvidenceCapture | null => {
  if (state.startedAtMs === null || state.samples.length === 0) {
    return null;
  }

  const safeEnd = Math.max(state.startedAtMs, endedAtMs);
  const samples = state.samples.slice(0, PERFORMANCE_EVIDENCE_TARGET_SAMPLES);
  return {
    schemaVersion: 1,
    startedAt: new Date(state.startedAtMs).toISOString(),
    endedAt: new Date(safeEnd).toISOString(),
    durationMs: safeEnd - state.startedAtMs,
    sampleIntervalTargetMs: PERFORMANCE_EVIDENCE_SAMPLE_INTERVAL_MS,
    targetSamples: PERFORMANCE_EVIDENCE_TARGET_SAMPLES,
    sampleCount: samples.length,
    complete: samples.length === PERFORMANCE_EVIDENCE_TARGET_SAMPLES,
    runtime,
    samples,
  };
};

export const getBrowserPerformanceEvidenceMetadata =
  (): PerformanceEvidenceRuntimeMetadata => ({
    pageUrl:
      typeof window === "undefined" ? "" : window.location.href,
    userAgent:
      typeof navigator === "undefined" ? "" : navigator.userAgent,
    viewportWidth:
      typeof window === "undefined" ? 0 : window.innerWidth,
    viewportHeight:
      typeof window === "undefined" ? 0 : window.innerHeight,
    devicePixelRatio:
      typeof window === "undefined" ? 1 : window.devicePixelRatio || 1,
  });

export const serializePerformanceEvidence = (
  capture: PerformanceEvidenceCapture,
) => JSON.stringify(capture, null, 2);

export const getPerformanceEvidenceFilename = (
  capture: PerformanceEvidenceCapture,
) => {
  const stamp = capture.startedAt
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .replace("Z", "");
  return `orbi-gaia-evidence_${stamp}_${capture.complete ? "complete" : "partial"}.json`;
};

export const downloadPerformanceEvidence = (
  capture: PerformanceEvidenceCapture,
) => {
  if (typeof document === "undefined" || typeof URL === "undefined") {
    return false;
  }

  const blob = new Blob([serializePerformanceEvidence(capture)], {
    type: "application/json;charset=utf-8",
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = getPerformanceEvidenceFilename(capture);
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
  return true;
};
