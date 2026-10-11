export const COSMIC_WHALE_CYCLE_MS = 135_000;
export const COSMIC_WHALE_WINDOW_START_MS = 42_000;
export const COSMIC_WHALE_WINDOW_DURATION_MS = 24_000;

export interface CosmicWhaleProjectionInput {
  timeMs: number;
  viewportWidth: number;
  viewportHeight: number;
  enabled: boolean;
}

export interface CosmicWhaleVisualProfile {
  cycleIndex: number;
  progress: number;
  direction: 1 | -1;
  x: number;
  y: number;
  scale: number;
  alpha: number;
  tilt: number;
  tailPhase: number;
  bodyWidth: number;
  bodyHeight: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const hashUnit = (value: number) => {
  let x = Math.floor(value) | 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  x ^= x >>> 16;
  return (x >>> 0) / 0xffffffff;
};

const fadeEnvelope = (progress: number) => {
  const fadeIn = clamp(progress / 0.14, 0, 1);
  const fadeOut = clamp((1 - progress) / 0.14, 0, 1);
  return Math.min(fadeIn, fadeOut);
};

export const projectCosmicWhaleEvent = ({
  timeMs,
  viewportWidth,
  viewportHeight,
  enabled,
}: CosmicWhaleProjectionInput): CosmicWhaleVisualProfile | null => {
  if (!enabled || !Number.isFinite(timeMs) || timeMs < 0) return null;
  if (!Number.isFinite(viewportWidth) || !Number.isFinite(viewportHeight)) {
    return null;
  }

  const width = Math.max(1, viewportWidth);
  const height = Math.max(1, viewportHeight);
  const cycleIndex = Math.floor(timeMs / COSMIC_WHALE_CYCLE_MS);
  const cycleTime = timeMs - cycleIndex * COSMIC_WHALE_CYCLE_MS;

  if (
    cycleTime < COSMIC_WHALE_WINDOW_START_MS ||
    cycleTime >
      COSMIC_WHALE_WINDOW_START_MS + COSMIC_WHALE_WINDOW_DURATION_MS
  ) {
    return null;
  }

  const progress = clamp(
    (cycleTime - COSMIC_WHALE_WINDOW_START_MS) /
      COSMIC_WHALE_WINDOW_DURATION_MS,
    0,
    1,
  );

  const directionSeed = hashUnit(cycleIndex * 17 + 5);
  const altitudeSeed = hashUnit(cycleIndex * 31 + 11);
  const scaleSeed = hashUnit(cycleIndex * 47 + 19);
  const motionSeed = hashUnit(cycleIndex * 61 + 23);
  const direction: 1 | -1 = directionSeed >= 0.5 ? 1 : -1;
  const scale = 0.78 + scaleSeed * 0.34;
  const bodyWidth = 250 * scale;
  const bodyHeight = 76 * scale;
  const travelMargin = bodyWidth * 0.72 + 36;
  const travelSpan = width + travelMargin * 2;
  const linearX = -travelMargin + travelSpan * progress;
  const x = direction === 1 ? linearX : width - linearX;
  const baseY = height * (0.22 + altitudeSeed * 0.48);
  const y = clamp(
    baseY +
      Math.sin(progress * Math.PI * 2 + motionSeed * Math.PI * 2) *
        18 *
        scale,
    bodyHeight * 0.7,
    height - bodyHeight * 0.7,
  );
  const alpha = fadeEnvelope(progress) * 0.36;
  const tilt =
    (motionSeed - 0.5) * 0.1 +
    Math.sin(progress * Math.PI * 2) * 0.025;

  return {
    cycleIndex,
    progress,
    direction,
    x,
    y,
    scale,
    alpha,
    tilt,
    tailPhase: timeMs * 0.0012 + motionSeed * Math.PI * 2,
    bodyWidth,
    bodyHeight,
  };
};
