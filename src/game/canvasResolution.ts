export const MAX_CANVAS_DPR = 2;

export const normalizeCanvasDpr = (
  rawDpr: number | undefined | null,
  presetMaxDpr: number = MAX_CANVAS_DPR,
) => {
  const safePresetCap =
    Number.isFinite(presetMaxDpr) && presetMaxDpr > 0
      ? Math.min(MAX_CANVAS_DPR, Math.max(1, presetMaxDpr))
      : MAX_CANVAS_DPR;

  if (!Number.isFinite(rawDpr) || !rawDpr || rawDpr <= 0) return 1;
  return Math.min(safePresetCap, Math.max(1, rawDpr));
};

export const getCanvasBackingStoreSize = (
  logicalWidth: number,
  logicalHeight: number,
  rawDpr: number | undefined | null,
  presetMaxDpr: number = MAX_CANVAS_DPR,
) => {
  const dpr = normalizeCanvasDpr(rawDpr, presetMaxDpr);
  return {
    dpr,
    width: Math.round(logicalWidth * dpr),
    height: Math.round(logicalHeight * dpr),
  };
};
