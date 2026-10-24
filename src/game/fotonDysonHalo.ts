export interface FotonDysonHaloRingDescriptor {
  id: "CYAN" | "EMERALD" | "GOLD";
  unlockCollectedOrbi: number;
  color: number;
  accentColor: number;
  radius: number;
  railTubeRadius: number;
  energyTubeRadius: number;
  planeNormal: readonly [number, number, number];
  angularVelocity: number;
  phase: number;
  buildDurationMs: number;
  accentNodeCount: number;
  segmentArcFraction: number;
}

/**
 * UX11-A reversible presentation gate.
 * Keep descriptors, unlock milestones and the runtime untouched so Dyson can
 * be reimagined later. This flag does not change shielding, combat, collection,
 * Golden Core awards or the independent ORBI Overdrive halo.
 */
export const FOTON_DYSON_HALO_DISPLAY_ENABLED = false;

export const FOTON_DYSON_HALO_RED_ACCENT = 0xff1744;

// Symmetric true-plane atomic triad. Pairwise plane-normal dot products are
// -0.125, so the three equal-radius rings cannot collapse into one plane.
export const FOTON_DYSON_HALO_RINGS: readonly FotonDysonHaloRingDescriptor[] = [
  {
    id: "CYAN", unlockCollectedOrbi: 0, color: 0x00f5ff,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT, radius: 1.055,
    railTubeRadius: 0.044, energyTubeRadius: 0.018,
    planeNormal: [0.8660254, 0, 0.5], angularVelocity: 0.14, phase: 0,
    buildDurationMs: 620, accentNodeCount: 3, segmentArcFraction: 0.62,
  },
  {
    id: "EMERALD", unlockCollectedOrbi: 10, color: 0x00ff88,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT, radius: 1.055,
    railTubeRadius: 0.041, energyTubeRadius: 0.017,
    planeNormal: [-0.4330127, 0.75, 0.5], angularVelocity: -0.115, phase: 2.094,
    buildDurationMs: 680, accentNodeCount: 3, segmentArcFraction: 0.6,
  },
  {
    id: "GOLD", unlockCollectedOrbi: 20, color: 0xffd740,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT, radius: 1.055,
    railTubeRadius: 0.042, energyTubeRadius: 0.018,
    planeNormal: [-0.4330127, -0.75, 0.5], angularVelocity: 0.09, phase: 4.189,
    buildDurationMs: 740, accentNodeCount: 3, segmentArcFraction: 0.6,
  },
] as const;

const normalizeCount = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
};

export const getCollectedOrbiCountFromSwarmSize = (swarmMemberCount: number): number =>
  normalizeCount(swarmMemberCount);

export const getUnlockedDysonHaloRingCountFromSwarmSize = (swarmMemberCount: number): number => {
  const collected = getCollectedOrbiCountFromSwarmSize(swarmMemberCount);
  if (collected >= 20) return 3;
  if (collected >= 10) return 2;
  return 1;
};

export const getUnlockedDysonHaloRingCount = (collectedOrbiCount: number): number => {
  const collected = normalizeCount(collectedOrbiCount);
  if (collected >= 20) return 3;
  if (collected >= 10) return 2;
  return 1;
};

export const getUnlockedDysonHaloRings = (collectedOrbiCount: number): readonly FotonDysonHaloRingDescriptor[] =>
  FOTON_DYSON_HALO_RINGS.slice(0, getUnlockedDysonHaloRingCount(collectedOrbiCount));
