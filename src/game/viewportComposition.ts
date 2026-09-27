export type ViewportCompositionClass =
  | "PHONE_PORTRAIT"
  | "PHONE_LANDSCAPE"
  | "TABLET_PORTRAIT"
  | "TABLET_LANDSCAPE"
  | "LAPTOP"
  | "DESKTOP"
  | "ULTRAWIDE";

export type ViewportOrientation =
  | "PORTRAIT"
  | "LANDSCAPE";

export type ViewportShellDensity =
  | "COMPACT"
  | "BALANCED"
  | "EXPANDED";

export type ViewportAuxiliaryDeckMode =
  | "STACKED"
  | "SPLIT"
  | "RAILS";

export interface ViewportCompositionInput {
  width: number;
  height: number;
  coarsePointer: boolean;
  devicePixelRatio?: number;
}

export interface ViewportCompositionProfile {
  className: ViewportCompositionClass;
  orientation: ViewportOrientation;
  width: number;
  height: number;
  aspectRatio: number;
  shortLandscape: boolean;
  compactTouchLandscape: boolean;
  touchControlsRecommended: boolean;
  landscapeAdvisoryRecommended: boolean;
  shellDensity: ViewportShellDensity;
  auxiliaryDeckMode: ViewportAuxiliaryDeckMode;
  stagePriority: "PRIMARY";
  effectiveDevicePixelRatio: number;
}

const finiteDimension = (
  value: number,
  fallback: number,
) =>
  Number.isFinite(value) && value > 0
    ? Math.max(1, Math.floor(value))
    : fallback;

const normalizeUiDpr = (value?: number) =>
  Number.isFinite(value) && (value ?? 0) > 0
    ? Math.min(2, Math.max(1, value ?? 1))
    : 1;

export const classifyViewportComposition = (
  input: ViewportCompositionInput,
): ViewportCompositionProfile => {
  const width = finiteDimension(input.width, 800);
  const height = finiteDimension(input.height, 480);
  const aspectRatio = width / height;
  const orientation: ViewportOrientation =
    width >= height ? "LANDSCAPE" : "PORTRAIT";

  let className: ViewportCompositionClass;

  if (width < 720) {
    className =
      orientation === "PORTRAIT"
        ? "PHONE_PORTRAIT"
        : "PHONE_LANDSCAPE";
  } else if (width < 1280) {
    className =
      orientation === "PORTRAIT"
        ? "TABLET_PORTRAIT"
        : "TABLET_LANDSCAPE";
  } else if (
    width >= 2000 &&
    aspectRatio >= 2
  ) {
    className = "ULTRAWIDE";
  } else if (width < 1600) {
    className = "LAPTOP";
  } else {
    className = "DESKTOP";
  }

  const shortLandscape =
    orientation === "LANDSCAPE" &&
    height <= 620;
  const compactTouchLandscape =
    orientation === "LANDSCAPE" &&
    height <= 520 &&
    input.coarsePointer;

  const touchControlsRecommended =
    input.coarsePointer &&
    width < 1280;

  const landscapeAdvisoryRecommended =
    className === "PHONE_PORTRAIT" &&
    input.coarsePointer &&
    width <= 540;

  const auxiliaryDeckMode:
    ViewportAuxiliaryDeckMode =
      width < 720
        ? "STACKED"
        : width < 1280
          ? "SPLIT"
          : "RAILS";

  const shellDensity: ViewportShellDensity =
    className === "PHONE_PORTRAIT" ||
    className === "PHONE_LANDSCAPE" ||
    shortLandscape
      ? "COMPACT"
      : className === "ULTRAWIDE" ||
          (className === "DESKTOP" &&
            height >= 900)
        ? "EXPANDED"
        : "BALANCED";

  return {
    className,
    orientation,
    width,
    height,
    aspectRatio,
    shortLandscape,
    compactTouchLandscape,
    touchControlsRecommended,
    landscapeAdvisoryRecommended,
    shellDensity,
    auxiliaryDeckMode,
    stagePriority: "PRIMARY",
    effectiveDevicePixelRatio:
      normalizeUiDpr(input.devicePixelRatio),
  };
};
