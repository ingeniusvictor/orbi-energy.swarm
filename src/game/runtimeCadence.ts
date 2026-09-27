export const BASELINE_FRAME_MS = 16.6;
export const HISTORICAL_HUD_SYNC_FRAMES = 10;
export const HUD_SYNC_INTERVAL_MS =
  BASELINE_FRAME_MS * HISTORICAL_HUD_SYNC_FRAMES;

export const getFrameUnits = (
  deltaMs: number,
): number => {
  if (
    typeof deltaMs !== "number" ||
    !Number.isFinite(deltaMs) ||
    deltaMs <= 0
  ) {
    return 0;
  }

  return deltaMs / BASELINE_FRAME_MS;
};

export const decayFrameTicks = (
  value: number,
  deltaMs: number,
): number => {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return 0;
  }

  return Math.max(
    0,
    value - getFrameUnits(deltaMs),
  );
};

export const projectFrameDamping = (
  perBaselineFrameMultiplier: number,
  deltaMs: number,
): number => {
  if (
    typeof perBaselineFrameMultiplier !== "number" ||
    !Number.isFinite(perBaselineFrameMultiplier)
  ) {
    return 1;
  }

  const boundedMultiplier = Math.min(
    1,
    Math.max(0, perBaselineFrameMultiplier),
  );
  const frameUnits = getFrameUnits(deltaMs);

  if (frameUnits <= 0) {
    return 1;
  }

  return Math.pow(
    boundedMultiplier,
    frameUnits,
  );
};

export const projectFrameProbability = (
  probabilityPerBaselineFrame: number,
  deltaMs: number,
): number => {
  if (
    typeof probabilityPerBaselineFrame !== "number" ||
    !Number.isFinite(probabilityPerBaselineFrame)
  ) {
    return 0;
  }

  const probability = Math.min(
    1,
    Math.max(0, probabilityPerBaselineFrame),
  );
  const frameUnits = getFrameUnits(deltaMs);

  if (frameUnits <= 0 || probability <= 0) {
    return 0;
  }
  if (probability >= 1) {
    return 1;
  }

  return 1 -
    Math.pow(1 - probability, frameUnits);
};

export interface CadenceAccumulatorStep {
  nextAccumulatorMs: number;
  shouldFlush: boolean;
}

export const stepCadenceAccumulator = (
  accumulatorMs: number,
  deltaMs: number,
  intervalMs: number = HUD_SYNC_INTERVAL_MS,
): CadenceAccumulatorStep => {
  const safeAccumulator =
    typeof accumulatorMs === "number" &&
    Number.isFinite(accumulatorMs) &&
    accumulatorMs > 0
      ? accumulatorMs
      : 0;
  const safeDelta =
    typeof deltaMs === "number" &&
    Number.isFinite(deltaMs) &&
    deltaMs > 0
      ? deltaMs
      : 0;
  const safeInterval =
    typeof intervalMs === "number" &&
    Number.isFinite(intervalMs) &&
    intervalMs > 0
      ? intervalMs
      : HUD_SYNC_INTERVAL_MS;

  const next = safeAccumulator + safeDelta;
  if (next < safeInterval) {
    return {
      nextAccumulatorMs: next,
      shouldFlush: false,
    };
  }

  return {
    nextAccumulatorMs:
      next % safeInterval,
    shouldFlush: true,
  };
};
