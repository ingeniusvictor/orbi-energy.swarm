import { QualityPreset } from "./types";

/**
 * Pure ES-13J2D-A presentation projection for ORBI Overdrive.
 *
 * This module owns no clocks, rendering, audio, storage, React state, random
 * numbers, particles or entity arrays. Callers provide the already-certified
 * Overdrive active state / remaining ratio and the existing quality preset.
 */

export const OVERDRIVE_ACTIVATION_PULSE_RATIO_WINDOW = 0.06;
export const MAX_OVERDRIVE_PRESENTATION_RINGS = 3;

export interface CombatOverdrivePresentationInput {
  active: boolean;
  remainingRatio: number;
  qualityPreset: QualityPreset;
}

export interface CombatOverdrivePresentationProjection {
  active: boolean;
  overlayAlpha: number;
  swarmHaloAlpha: number;
  ringCount: number;
  activationPulse: number;
}

interface ActivePresentationProfile {
  overlayAlpha: number;
  swarmHaloAlpha: number;
  ringCount: number;
}

const ACTIVE_PRESENTATION_PROFILES: Record<
  QualityPreset,
  ActivePresentationProfile
> = {
  [QualityPreset.LOW]: {
    overlayAlpha: 0.025,
    swarmHaloAlpha: 0.18,
    ringCount: 1,
  },
  [QualityPreset.MEDIUM]: {
    overlayAlpha: 0.04,
    swarmHaloAlpha: 0.26,
    ringCount: 2,
  },
  [QualityPreset.HIGH]: {
    overlayAlpha: 0.055,
    swarmHaloAlpha: 0.34,
    ringCount: 2,
  },
  [QualityPreset.ULTRA]: {
    overlayAlpha: 0.065,
    swarmHaloAlpha: 0.38,
    ringCount: MAX_OVERDRIVE_PRESENTATION_RINGS,
  },
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const assertRemainingRatio = (remainingRatio: number) => {
  if (!Number.isFinite(remainingRatio)) {
    throw new Error("Overdrive presentation remaining ratio must be finite.");
  }
};

export const projectCombatOverdrivePresentation = (
  input: CombatOverdrivePresentationInput,
): CombatOverdrivePresentationProjection => {
  assertRemainingRatio(input.remainingRatio);

  if (!input.active) {
    return {
      active: false,
      overlayAlpha: 0,
      swarmHaloAlpha: 0,
      ringCount: 0,
      activationPulse: 0,
    };
  }

  const remainingRatio = clamp01(input.remainingRatio);
  const profile =
    ACTIVE_PRESENTATION_PROFILES[input.qualityPreset] ??
    ACTIVE_PRESENTATION_PROFILES[QualityPreset.MEDIUM];
  const pulseStart = 1 - OVERDRIVE_ACTIVATION_PULSE_RATIO_WINDOW;
  const activationPulse = clamp01(
    (remainingRatio - pulseStart) /
      OVERDRIVE_ACTIVATION_PULSE_RATIO_WINDOW,
  );

  return {
    active: true,
    overlayAlpha: clamp01(profile.overlayAlpha),
    swarmHaloAlpha: clamp01(profile.swarmHaloAlpha),
    ringCount: Math.min(
      MAX_OVERDRIVE_PRESENTATION_RINGS,
      Math.max(0, Math.trunc(profile.ringCount)),
    ),
    activationPulse,
  };
};
