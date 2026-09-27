import type { RuntimeMutatorEffectProfile } from "./runtimeMutatorEffects";

export interface VisibilityOverlayProfile {
  innerRadius: number;
  outerRadius: number;
  outerAlpha: number;
}

export interface ResourceFieldProfile {
  attractionRadiusMultiplier: number;
  attractionSpeedMultiplier: number;
  driftXPerFrame: number;
  driftYPerFrame: number;
}

const clamp = (
  value: number,
  min: number,
  max: number,
) => Math.min(max, Math.max(min, value));

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const phaseFor = (key: string) =>
  (hashString(key) / 4294967296) * Math.PI * 2;

export const getReducedVisibilityOverlayProfile = (
  effects: RuntimeMutatorEffectProfile,
  viewportWidth: number,
  viewportHeight: number,
): VisibilityOverlayProfile | null => {
  if (effects.visibilityScale >= 0.999) {
    return null;
  }

  const minDimension = Math.max(
    1,
    Math.min(viewportWidth, viewportHeight),
  );
  const scale = clamp(effects.visibilityScale, 0.6, 1);

  const innerRadius = Math.max(
    110,
    minDimension * 0.32 * scale,
  );
  const outerRadius = Math.max(
    innerRadius + 110,
    minDimension * 0.65 * scale,
  );
  const outerAlpha = clamp(
    (1 - scale) * 1.6,
    0,
    0.58,
  );

  return {
    innerRadius,
    outerRadius,
    outerAlpha,
  };
};

export const getResourceFieldProfile = (
  effects: RuntimeMutatorEffectProfile,
  timeMs: number,
  resourceId: string,
): ResourceFieldProfile => {
  const instability = clamp(
    effects.resourceFieldInstability,
    0,
    0.4,
  );
  const magneticStrength = clamp(
    effects.magneticDriftStrength,
    0,
    0.25,
  );
  const phase = phaseFor(resourceId);

  const slowWave = Math.sin(
    timeMs * 0.0017 + phase,
  );
  const crossWave = Math.cos(
    timeMs * 0.0012 + phase * 0.73,
  );

  const attractionRadiusMultiplier = clamp(
    1 - instability * 0.2 +
      slowWave * instability * 0.12,
    0.82,
    1.08,
  );

  const attractionSpeedMultiplier = clamp(
    1 + crossWave * instability * 0.42,
    0.82,
    1.18,
  );

  return {
    attractionRadiusMultiplier,
    attractionSpeedMultiplier,
    driftXPerFrame:
      magneticStrength === 0
        ? 0
        : crossWave * magneticStrength * 2,
    driftYPerFrame:
      magneticStrength === 0
        ? 0
        : slowWave * magneticStrength * 1.5,
  };
};
