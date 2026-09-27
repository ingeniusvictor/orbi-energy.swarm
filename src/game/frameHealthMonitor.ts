import { QualityPreset } from "./types";

export type FrameHealthStatus =
  | "HEALTHY"
  | "PRESSURED"
  | "CRITICAL";

export interface FrameHealthWindow {
  status: FrameHealthStatus;
  sampleCount: number;
  elapsedMs: number;
  averageDeltaMs: number;
  p95DeltaMs: number;
  slowFrameRatio: number;
  consecutivePressuredWindows: number;
  recommendedPreset?: QualityPreset;
}

export interface FrameHealthState {
  samples: number[];
  elapsedMs: number;
  consecutivePressuredWindows: number;
  lastWindow?: FrameHealthWindow;
}

export const FRAME_HEALTH_WINDOW_MS = 5000;
export const FRAME_HEALTH_SLOW_FRAME_MS = 24;
export const FRAME_HEALTH_CRITICAL_FRAME_MS = 33.4;
export const FRAME_HEALTH_REQUIRED_PRESSURE_WINDOWS = 2;
const MAX_SAMPLE_DELTA_MS = 100;

export const createFrameHealthState = (): FrameHealthState => ({
  samples: [],
  elapsedMs: 0,
  consecutivePressuredWindows: 0,
});

const percentile = (values: number[], percentileRank: number) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(
      0,
      Math.ceil(percentileRank * sorted.length) - 1,
    ),
  );
  return sorted[index];
};

export const recommendLowerQualityPreset = (
  preset: QualityPreset,
): QualityPreset | undefined => {
  switch (preset) {
    case QualityPreset.ULTRA:
      return QualityPreset.HIGH;
    case QualityPreset.HIGH:
      return QualityPreset.MEDIUM;
    case QualityPreset.MEDIUM:
      return QualityPreset.LOW;
    case QualityPreset.LOW:
    default:
      return undefined;
  }
};

export const classifyFrameHealthWindow = (
  samples: readonly number[],
): Omit<
  FrameHealthWindow,
  "elapsedMs" | "consecutivePressuredWindows" | "recommendedPreset"
> => {
  const finiteSamples = samples
    .filter(
      (sample) =>
        typeof sample === "number" &&
        Number.isFinite(sample) &&
        sample > 0,
    )
    .map((sample) =>
      Math.min(MAX_SAMPLE_DELTA_MS, sample),
    );

  if (finiteSamples.length === 0) {
    return {
      status: "HEALTHY",
      sampleCount: 0,
      averageDeltaMs: 0,
      p95DeltaMs: 0,
      slowFrameRatio: 0,
    };
  }

  const averageDeltaMs =
    finiteSamples.reduce((sum, sample) => sum + sample, 0) /
    finiteSamples.length;
  const p95DeltaMs = percentile(finiteSamples, 0.95);
  const slowFrames = finiteSamples.filter(
    (sample) => sample >= FRAME_HEALTH_SLOW_FRAME_MS,
  ).length;
  const criticalFrames = finiteSamples.filter(
    (sample) => sample >= FRAME_HEALTH_CRITICAL_FRAME_MS,
  ).length;
  const slowFrameRatio = slowFrames / finiteSamples.length;
  const criticalFrameRatio =
    criticalFrames / finiteSamples.length;

  let status: FrameHealthStatus = "HEALTHY";
  if (
    p95DeltaMs >= FRAME_HEALTH_CRITICAL_FRAME_MS ||
    criticalFrameRatio >= 0.2 ||
    slowFrameRatio >= 0.4
  ) {
    status = "CRITICAL";
  } else if (
    p95DeltaMs >= FRAME_HEALTH_SLOW_FRAME_MS ||
    slowFrameRatio >= 0.15
  ) {
    status = "PRESSURED";
  }

  return {
    status,
    sampleCount: finiteSamples.length,
    averageDeltaMs,
    p95DeltaMs,
    slowFrameRatio,
  };
};

export const resetFrameHealthState = (
  state: FrameHealthState,
): FrameHealthState => ({
  samples: [],
  elapsedMs: 0,
  consecutivePressuredWindows:
    state.consecutivePressuredWindows,
  lastWindow: state.lastWindow,
});

export const stepFrameHealthMonitor = (
  state: FrameHealthState,
  deltaMs: number,
  preset: QualityPreset,
): {
  state: FrameHealthState;
  completedWindow?: FrameHealthWindow;
} => {
  if (
    typeof deltaMs !== "number" ||
    !Number.isFinite(deltaMs) ||
    deltaMs <= 0
  ) {
    return { state };
  }

  const safeDelta = Math.min(
    MAX_SAMPLE_DELTA_MS,
    deltaMs,
  );
  const elapsedMs = state.elapsedMs + safeDelta;
  const samples = [...state.samples, safeDelta];

  if (elapsedMs < FRAME_HEALTH_WINDOW_MS) {
    return {
      state: {
        ...state,
        elapsedMs,
        samples,
      },
    };
  }

  const classified =
    classifyFrameHealthWindow(samples);
  const pressured =
    classified.status !== "HEALTHY";
  const consecutivePressuredWindows = pressured
    ? state.consecutivePressuredWindows + 1
    : 0;
  const recommendedPreset =
    pressured &&
    consecutivePressuredWindows >=
      FRAME_HEALTH_REQUIRED_PRESSURE_WINDOWS
      ? recommendLowerQualityPreset(preset)
      : undefined;

  const completedWindow: FrameHealthWindow = {
    ...classified,
    elapsedMs,
    consecutivePressuredWindows,
    ...(recommendedPreset
      ? { recommendedPreset }
      : {}),
  };

  return {
    completedWindow,
    state: {
      samples: [],
      elapsedMs: 0,
      consecutivePressuredWindows,
      lastWindow: completedWindow,
    },
  };
};
