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

export const FOTON_DYSON_HALO_RED_ACCENT = 0xff1744;

// Bright neon palette and a deliberately symmetric atomic triad. All rings
// share the same center and radius; the atom/Dyson silhouette is created by
// one common polar tilt separated into three 120-degree azimuth planes, never
// by offset/concentric geometry.
export const FOTON_DYSON_HALO_RINGS: readonly FotonDysonHaloRingDescriptor[] = [
  {
    id: "CYAN",
    unlockCollectedOrbi: 0,
    color: 0x00f5ff,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT,
    radius: 1.055,
    railTubeRadius: 0.044,
    energyTubeRadius: 0.018,
    tilt: [1.08, 0, 0],
    angularVelocity: 0.14,
    phase: 0,
    buildDurationMs: 620,
    accentNodeCount: 3,
    segmentArcFraction: 0.62,
  },
  {
    id: "EMERALD",
    unlockCollectedOrbi: 10,
    color: 0x00ff88,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT,
    radius: 1.055,
    railTubeRadius: 0.041,
    energyTubeRadius: 0.017,
    tilt: [1.08, 0, 2.094],
    angularVelocity: -0.115,
    phase: 2.094,
    buildDurationMs: 680,
    accentNodeCount: 3,
    segmentArcFraction: 0.6,
  },
  {
    id: "GOLD",
    unlockCollectedOrbi: 20,
    color: 0xffd740,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT,
    radius: 1.055,
    railTubeRadius: 0.042,
    energyTubeRadius: 0.018,
    tilt: [1.08, 0, 4.189],
    angularVelocity: 0.09,
    phase: 4.189,
    buildDurationMs: 740,
    accentNodeCount: 3,
    segmentArcFraction: 0.6,
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
