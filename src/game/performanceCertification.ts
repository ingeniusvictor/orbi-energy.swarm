import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "./constants";
import {
  MAX_CANVAS_DPR,
  getCanvasBackingStoreSize,
} from "./canvasResolution";
import { getQualityConfig } from "./quality";
import { QualityPreset } from "./types";
import {
  classifyViewportComposition,
  type ViewportAuxiliaryDeckMode,
  type ViewportCompositionClass,
  type ViewportOrientation,
} from "./viewportComposition";

export interface PerformanceCertificationDeviceCase {
  id: string;
  label: string;
  width: number;
  height: number;
  coarsePointer: boolean;
  devicePixelRatio: number;
  expectedClass: ViewportCompositionClass;
  expectedOrientation: ViewportOrientation;
  expectedDeckMode: ViewportAuxiliaryDeckMode;
  expectedTouchControls: boolean;
  expectedLandscapeAdvisory: boolean;
}

export interface PerformanceCertificationProjection {
  device: PerformanceCertificationDeviceCase;
  preset: QualityPreset;
  viewportClass: ViewportCompositionClass;
  orientation: ViewportOrientation;
  auxiliaryDeckMode: ViewportAuxiliaryDeckMode;
  touchControlsRecommended: boolean;
  landscapeAdvisoryRecommended: boolean;
  effectiveUiDpr: number;
  canvasDpr: number;
  backingWidth: number;
  backingHeight: number;
  backingPixelCount: number;
  maxParticles: number;
  maxStars: number;
  drawNebula: boolean;
  drawPlanets: boolean;
  presetMaxDpr: number;
}

export const PERFORMANCE_CERTIFICATION_DEVICES:
  readonly PerformanceCertificationDeviceCase[] = [
    {
      id: "android-compact-landscape",
      label: "Compact Android landscape",
      width: 667,
      height: 375,
      coarsePointer: true,
      devicePixelRatio: 2.625,
      expectedClass: "PHONE_LANDSCAPE",
      expectedOrientation: "LANDSCAPE",
      expectedDeckMode: "STACKED",
      expectedTouchControls: true,
      expectedLandscapeAdvisory: false,
    },
    {
      id: "android-modern-landscape",
      label: "Modern Android landscape",
      width: 915,
      height: 412,
      coarsePointer: true,
      devicePixelRatio: 3,
      expectedClass: "TABLET_LANDSCAPE",
      expectedOrientation: "LANDSCAPE",
      expectedDeckMode: "SPLIT",
      expectedTouchControls: true,
      expectedLandscapeAdvisory: false,
    },
    {
      id: "android-narrow-portrait",
      label: "Narrow Android portrait",
      width: 412,
      height: 915,
      coarsePointer: true,
      devicePixelRatio: 2.75,
      expectedClass: "PHONE_PORTRAIT",
      expectedOrientation: "PORTRAIT",
      expectedDeckMode: "STACKED",
      expectedTouchControls: true,
      expectedLandscapeAdvisory: true,
    },
    {
      id: "tablet-landscape",
      label: "Tablet landscape",
      width: 1024,
      height: 768,
      coarsePointer: true,
      devicePixelRatio: 2,
      expectedClass: "TABLET_LANDSCAPE",
      expectedOrientation: "LANDSCAPE",
      expectedDeckMode: "SPLIT",
      expectedTouchControls: true,
      expectedLandscapeAdvisory: false,
    },
    {
      id: "tablet-portrait",
      label: "Tablet portrait",
      width: 820,
      height: 1180,
      coarsePointer: true,
      devicePixelRatio: 2,
      expectedClass: "TABLET_PORTRAIT",
      expectedOrientation: "PORTRAIT",
      expectedDeckMode: "SPLIT",
      expectedTouchControls: true,
      expectedLandscapeAdvisory: false,
    },
    {
      id: "laptop-16-10",
      label: "Laptop 16:10",
      width: 1440,
      height: 900,
      coarsePointer: false,
      devicePixelRatio: 1.25,
      expectedClass: "LAPTOP",
      expectedOrientation: "LANDSCAPE",
      expectedDeckMode: "RAILS",
      expectedTouchControls: false,
      expectedLandscapeAdvisory: false,
    },
    {
      id: "desktop-16-9",
      label: "Desktop 16:9",
      width: 1920,
      height: 1080,
      coarsePointer: false,
      devicePixelRatio: 1,
      expectedClass: "DESKTOP",
      expectedOrientation: "LANDSCAPE",
      expectedDeckMode: "RAILS",
      expectedTouchControls: false,
      expectedLandscapeAdvisory: false,
    },
    {
      id: "ultrawide",
      label: "Ultrawide",
      width: 2560,
      height: 1080,
      coarsePointer: false,
      devicePixelRatio: 1,
      expectedClass: "ULTRAWIDE",
      expectedOrientation: "LANDSCAPE",
      expectedDeckMode: "RAILS",
      expectedTouchControls: false,
      expectedLandscapeAdvisory: false,
    },
  ];

export const PERFORMANCE_CERTIFICATION_PRESETS:
  readonly QualityPreset[] = [
    QualityPreset.LOW,
    QualityPreset.MEDIUM,
    QualityPreset.HIGH,
    QualityPreset.ULTRA,
  ];

export const projectPerformanceCertificationCase = (
  device: PerformanceCertificationDeviceCase,
  preset: QualityPreset,
): PerformanceCertificationProjection => {
  const viewport = classifyViewportComposition({
    width: device.width,
    height: device.height,
    coarsePointer: device.coarsePointer,
    devicePixelRatio: device.devicePixelRatio,
  });
  const quality = getQualityConfig(preset);
  const backing = getCanvasBackingStoreSize(
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    device.devicePixelRatio,
    quality.maxDPR,
  );

  return {
    device,
    preset,
    viewportClass: viewport.className,
    orientation: viewport.orientation,
    auxiliaryDeckMode: viewport.auxiliaryDeckMode,
    touchControlsRecommended:
      viewport.touchControlsRecommended,
    landscapeAdvisoryRecommended:
      viewport.landscapeAdvisoryRecommended,
    effectiveUiDpr: viewport.effectiveDevicePixelRatio,
    canvasDpr: backing.dpr,
    backingWidth: backing.width,
    backingHeight: backing.height,
    backingPixelCount: backing.width * backing.height,
    maxParticles: quality.maxParticles,
    maxStars: quality.maxStars,
    drawNebula: quality.drawNebula,
    drawPlanets: quality.drawPlanets,
    presetMaxDpr: quality.maxDPR,
  };
};

export const buildPerformanceCertificationMatrix = () =>
  PERFORMANCE_CERTIFICATION_DEVICES.flatMap((device) =>
    PERFORMANCE_CERTIFICATION_PRESETS.map((preset) =>
      projectPerformanceCertificationCase(device, preset),
    ),
  );

export const PERFORMANCE_CERTIFICATION_MAX_CANVAS_DPR =
  MAX_CANVAS_DPR;
