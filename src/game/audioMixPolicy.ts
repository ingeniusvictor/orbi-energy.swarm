export type AudioMixLane =
  | "BGM"
  | "STANDARD"
  | "TACTICAL";

export interface AudioMixProfile {
  bgmGainMultiplier: number;
  standardSfxGainMultiplier: number;
  tacticalGainMultiplier: number;
}

const IDLE_AUDIO_MIX: AudioMixProfile = {
  bgmGainMultiplier: 1,
  standardSfxGainMultiplier: 1,
  tacticalGainMultiplier: 1,
};

const TACTICAL_AUDIO_MIX: AudioMixProfile = {
  bgmGainMultiplier: 0.35,
  standardSfxGainMultiplier: 0.55,
  tacticalGainMultiplier: 1,
};

export const projectAudioMixProfile = (
  tacticalCueActive: boolean,
): AudioMixProfile =>
  tacticalCueActive
    ? TACTICAL_AUDIO_MIX
    : IDLE_AUDIO_MIX;

export const getAudioMixMultiplier = (
  lane: AudioMixLane,
  tacticalCueActive: boolean,
): number => {
  const profile =
    projectAudioMixProfile(tacticalCueActive);

  if (lane === "BGM") {
    return profile.bgmGainMultiplier;
  }
  if (lane === "TACTICAL") {
    return profile.tacticalGainMultiplier;
  }
  return profile.standardSfxGainMultiplier;
};

export const extendTacticalPriorityWindow = (
  currentTime: number,
  existingUntil: number,
  durationSeconds: number,
): number => {
  const safeCurrentTime =
    Number.isFinite(currentTime)
      ? Math.max(0, currentTime)
      : 0;
  const safeExistingUntil =
    Number.isFinite(existingUntil)
      ? Math.max(0, existingUntil)
      : 0;
  const safeDuration =
    Number.isFinite(durationSeconds)
      ? Math.max(0, durationSeconds)
      : 0;

  return Math.max(
    safeExistingUntil,
    safeCurrentTime + safeDuration,
  );
};
