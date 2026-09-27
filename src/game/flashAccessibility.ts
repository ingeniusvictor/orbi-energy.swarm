export type FlashIntensityMode =
  | "FULL"
  | "REDUCED";

export interface FlashAccessibilityProfile {
  mode: FlashIntensityMode;
  screenOverlayOpacity: number;
  screenOverlayFlickers: boolean;
  fotonFullFlicker: boolean;
  friendlyWhiteFlashStrength: number;
  enemyWhiteFlashStrength: number;
}

const FULL_FLASH_PROFILE: FlashAccessibilityProfile = {
  mode: "FULL",
  screenOverlayOpacity: 1,
  screenOverlayFlickers: true,
  fotonFullFlicker: true,
  friendlyWhiteFlashStrength: 1,
  enemyWhiteFlashStrength: 1,
};

const REDUCED_FLASH_PROFILE: FlashAccessibilityProfile = {
  mode: "REDUCED",
  screenOverlayOpacity: 0.2,
  screenOverlayFlickers: false,
  fotonFullFlicker: false,
  friendlyWhiteFlashStrength: 0.18,
  enemyWhiteFlashStrength: 0.18,
};

export const normalizeFlashIntensityMode = (
  value: unknown,
): FlashIntensityMode =>
  value === "FULL" || value === "REDUCED"
    ? value
    : "REDUCED";

export const projectFlashAccessibility = (
  value: unknown,
): FlashAccessibilityProfile =>
  normalizeFlashIntensityMode(value) === "FULL"
    ? FULL_FLASH_PROFILE
    : REDUCED_FLASH_PROFILE;
