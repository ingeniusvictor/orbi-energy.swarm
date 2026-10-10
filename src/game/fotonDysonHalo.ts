export interface FotonDysonHaloRingDescriptor {
  id: "CYAN" | "EMERALD" | "GOLD";
  unlockCollectedOrbi: number;
  color: number;
  accentColor: number;
  radius: number;
  railTubeRadius: number;
  energyTubeRadius: number;
  tilt: readonly [number, number, number];
  angularVelocity: number;
  phase: number;
  buildDurationMs: number;
  accentNodeCount: number;
  segmentArcFraction: number;
}

export const FOTON_DYSON_HALO_RED_ACCENT = 0xef4444;

// The three rings intentionally occupy nearly the same orbital radius. Their
// visual separation comes from strongly different orbital planes, matching an
// atomic / compact Dyson-sphere silhouette instead of concentric circles.
export const FOTON_DYSON_HALO_RINGS: readonly FotonDysonHaloRingDescriptor[] = [
  {
    id: "CYAN",
    unlockCollectedOrbi: 0,
    color: 0x22d3ee,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT,
    radius: 1.04,
    railTubeRadius: 0.046,
    energyTubeRadius: 0.012,
    tilt: [0.08, 0.03, 0.12],
    angularVelocity: 0.17,
    phase: 0,
    buildDurationMs: 620,
    accentNodeCount: 3,
    segmentArcFraction: 0.58,
  },
  {
    id: "EMERALD",
    unlockCollectedOrbi: 10,
    color: 0x10b981,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT,
    radius: 1.055,
    railTubeRadius: 0.039,
    energyTubeRadius: 0.011,
    tilt: [0.96, 0.34, -0.48],
    angularVelocity: -0.13,
    phase: 2.05,
    buildDurationMs: 680,
    accentNodeCount: 3,
    segmentArcFraction: 0.56,
  },
  {
    id: "GOLD",
    unlockCollectedOrbi: 20,
    color: 0xfbbf24,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT,
    radius: 1.07,
    railTubeRadius: 0.041,
    energyTubeRadius: 0.012,
    tilt: [-0.88, -0.44, 0.68],
    angularVelocity: 0.1,
    phase: 4.1,
    buildDurationMs: 740,
    accentNodeCount: 3,
    segmentArcFraction: 0.54,
  },
] as const;

const normalizeCount = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
};

/**
 * Gameplay currently supplies the live swarm member count. The first member
 * is granted automatically at run start and is not a collected Orbi, so halo
 * progression must subtract that initial companion before applying 10-Orbi
 * construction thresholds.
 */
export const getCollectedOrbiCountFromSwarmSize = (
  swarmMemberCount: number,
): number => Math.max(0, normalizeCount(swarmMemberCount) - 1);

export const getUnlockedDysonHaloRingCountFromSwarmSize = (
  swarmMemberCount: number,
): number => {
  const collected =
    getCollectedOrbiCountFromSwarmSize(swarmMemberCount);
  if (collected >= 20) return 3;
  if (collected >= 10) return 2;
  return 1;
};

// Retained for focused unit tests and future callers that already have a true
// collected-Orbi counter.
export const getUnlockedDysonHaloRingCount = (
  collectedOrbiCount: number,
): number => {
  const collected = normalizeCount(collectedOrbiCount);
  if (collected >= 20) return 3;
  if (collected >= 10) return 2;
  return 1;
};

export const getUnlockedDysonHaloRings = (
  collectedOrbiCount: number,
): readonly FotonDysonHaloRingDescriptor[] =>
  FOTON_DYSON_HALO_RINGS.slice(
    0,
    getUnlockedDysonHaloRingCount(collectedOrbiCount),
  );
