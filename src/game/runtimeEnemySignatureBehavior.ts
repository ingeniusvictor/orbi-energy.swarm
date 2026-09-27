import type { EvolvedEnemySignature } from "./types";

export interface EvolvedSignatureBehavior {
  signature: EvolvedEnemySignature | null;
  intensity: number;
  projectilePushbackMultiplier: number;
  parasiteLungeAmplitudeMultiplier: number;
  parasiteLungeFrequencyMultiplier: number;
  droneVolleyProjectileCount: 1 | 2;
  droneVolleySpreadRadians: number;
  splitterExtraMinions: 0 | 1;
  disruptDurationMultiplier: number;
}

export const NEUTRAL_EVOLVED_SIGNATURE_BEHAVIOR: EvolvedSignatureBehavior =
  Object.freeze({
    signature: null,
    intensity: 0,
    projectilePushbackMultiplier: 1,
    parasiteLungeAmplitudeMultiplier: 1,
    parasiteLungeFrequencyMultiplier: 1,
    droneVolleyProjectileCount: 1,
    droneVolleySpreadRadians: 0,
    splitterExtraMinions: 0,
    disruptDurationMultiplier: 1,
  });

const clamp = (
  value: number,
  min: number,
  max: number,
) => Math.min(max, Math.max(min, value));

const round = (value: number, digits = 3) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const normalizeIntensity = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value)
    ? clamp(value, 0, 0.6)
    : 0;

const neutralFor = (
  signature: EvolvedEnemySignature | null,
  intensity: number,
): EvolvedSignatureBehavior => ({
  ...NEUTRAL_EVOLVED_SIGNATURE_BEHAVIOR,
  signature,
  intensity,
});

export const projectEvolvedSignatureBehavior = (
  signature: EvolvedEnemySignature | null | undefined,
  specialIntensity: number | null | undefined,
): EvolvedSignatureBehavior => {
  const intensity = normalizeIntensity(specialIntensity);

  if (!signature || intensity <= 0) {
    return neutralFor(signature ?? null, intensity);
  }

  switch (signature) {
    case "ARMORED_MOMENTUM":
      return {
        ...neutralFor(signature, intensity),
        projectilePushbackMultiplier: round(
          clamp(1 - intensity * 0.9, 0.55, 1),
        ),
      };

    case "PHASE_LUNGE":
      return {
        ...neutralFor(signature, intensity),
        parasiteLungeAmplitudeMultiplier: round(
          clamp(1 + intensity * 0.7, 1, 1.42),
        ),
        parasiteLungeFrequencyMultiplier: round(
          clamp(1 + intensity * 0.35, 1, 1.21),
        ),
      };

    case "LANCE_VOLLEY":
      return {
        ...neutralFor(signature, intensity),
        droneVolleyProjectileCount: 2,
        droneVolleySpreadRadians: round(
          clamp(0.04 + intensity * 0.08, 0.04, 0.09),
        ),
      };

    case "BROOD_RELEASE":
      return {
        ...neutralFor(signature, intensity),
        splitterExtraMinions:
          intensity >= 0.25 ? 1 : 0,
      };

    case "NULL_PULSE":
      return {
        ...neutralFor(signature, intensity),
        disruptDurationMultiplier: round(
          clamp(1 + intensity * 0.4, 1, 1.24),
        ),
      };

    default:
      return neutralFor(null, 0);
  }
};
