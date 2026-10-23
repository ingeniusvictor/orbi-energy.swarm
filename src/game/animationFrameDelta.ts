/** Actual rAF timestamp can be slightly older than performance.now() read
 * just before scheduling a callback. Never let this negative origin skew
 * corrupt simulation elapsed time or crash strict Overdrive projections.
 * Positive deltas and the existing >100ms tab-switch clamp remain unchanged. */
export const nonNegativeAnimationFrameDelta = (
  elapsedMs: number,
): number => Number.isFinite(elapsedMs) && elapsedMs > 0 ? elapsedMs : 0;
