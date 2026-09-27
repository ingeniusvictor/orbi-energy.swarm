export const MAX_CANVAS_DPR = 2;

const normalizeMaxDpr = (maxDpr: number | undefined | null) => {
  if (!Number.isFinite(maxDpr) || !maxDpr || maxDpr <= 0) {
    return MAX_CANVAS_DPR;
  }
  return Math.min(MAX_CANVAS_DPR, Math.max(1, maxDpr));
};

export const normalizeCanvasDpr = (
  rawDpr: number | undefined | null,
  maxDpr: number | undefined | null = MAX_CANVAS_DPR,
) => {
  const effectiveMaxDpr = normalizeMaxDpr(maxDpr);
  if (!Number.isFinite(rawDpr) || !rawDpr || rawDpr <= 0) return 1;
  return Math.min(effectiveMaxDpr, Math.max(1, rawDpr));
};

export const getCanvasBackingStoreSize = (
  logicalWidth: number,
  logicalHeight: number,
  rawDpr: number | undefined | null,
  maxDpr: number | undefined | null = MAX_CANVAS_DPR,
) => {
  const dpr = normalizeCanvasDpr(rawDpr, maxDpr);
  return {
    dpr,
    width: Math.round(logicalWidth * dpr),
    height: Math.round(logicalHeight * dpr),
  };
};
