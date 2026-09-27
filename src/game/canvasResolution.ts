export const MAX_CANVAS_DPR = 2;

export const normalizeCanvasDpr = (rawDpr: number | undefined | null) => {
  if (!Number.isFinite(rawDpr) || !rawDpr || rawDpr <= 0) return 1;
  return Math.min(MAX_CANVAS_DPR, Math.max(1, rawDpr));
};

export const getCanvasBackingStoreSize = (
  logicalWidth: number,
  logicalHeight: number,
  rawDpr: number | undefined | null,
) => {
  const dpr = normalizeCanvasDpr(rawDpr);
  return {
    dpr,
    width: Math.round(logicalWidth * dpr),
    height: Math.round(logicalHeight * dpr),
  };
};
