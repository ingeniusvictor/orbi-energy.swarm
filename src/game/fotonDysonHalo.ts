export interface FotonDysonHaloRingDescriptor {
  id: "CYAN" | "EMERALD" | "GOLD";
  unlockOrbi: number;
  color: number;
  accentColor: number;
  radius: number;
  tubeRadius: number;
  tilt: readonly [number, number, number];
  angularVelocity: number;
  phase: number;
  buildDurationMs: number;
  accentNodeCount: number;
}

export const FOTON_DYSON_HALO_RED_ACCENT = 0xef4444;

export const FOTON_DYSON_HALO_RINGS: readonly FotonDysonHaloRingDescriptor[] = [
  {
    id: "CYAN",
    unlockOrbi: 0,
    color: 0x22d3ee,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT,
    radius: 0.93,
    tubeRadius: 0.018,
    tilt: [1.0, 0.18, 0.25],
    angularVelocity: 0.24,
    phase: 0,
    buildDurationMs: 620,
    accentNodeCount: 3,
  },
  {
    id: "EMERALD",
    unlockOrbi: 10,
    color: 0x10b981,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT,
    radius: 1.0,
    tubeRadius: 0.019,
    tilt: [-0.76, 0.62, -0.44],
    angularVelocity: -0.18,
    phase: 2.05,
    buildDurationMs: 680,
    accentNodeCount: 3,
  },
  {
    id: "GOLD",
    unlockOrbi: 20,
    color: 0xfbbf24,
    accentColor: FOTON_DYSON_HALO_RED_ACCENT,
    radius: 1.07,
    tubeRadius: 0.02,
    tilt: [0.44, -0.94, 0.62],
    angularVelocity: 0.14,
    phase: 4.1,
    buildDurationMs: 740,
    accentNodeCount: 3,
  },
] as const;

const normalizeOrbiCount = (orbiCount: number) => {
  if (!Number.isFinite(orbiCount)) return 0;
  return Math.max(0, Math.floor(orbiCount));
};

export const getUnlockedDysonHaloRingCount = (
  orbiCount: number,
): number => {
  const normalized = normalizeOrbiCount(orbiCount);
  if (normalized >= 20) return 3;
  if (normalized >= 10) return 2;
  return 1;
};

export const getUnlockedDysonHaloRings = (
  orbiCount: number,
): readonly FotonDysonHaloRingDescriptor[] =>
  FOTON_DYSON_HALO_RINGS.slice(
    0,
    getUnlockedDysonHaloRingCount(orbiCount),
  );
