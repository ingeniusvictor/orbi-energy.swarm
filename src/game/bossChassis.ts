import { EnemyType, type BossChassisId } from "./types";
import { BLACKOUT_DEVOURER_CANON } from "./waveDirector";

export type BossWeakpointMotion = "ORBITAL" | "ANCHORED";

export interface BossWeakpointProfile {
  count: number;
  health: number;
  collisionRadius: number;
  motion: BossWeakpointMotion;
  radiusX: number;
  radiusY: number;
  angularVelocityPerFrame: number;
  protectedDamageMultiplier: number;
  exposedDamageMultiplier: number;
  exposureDurationMs: number;
  hudLabel: string;
}

export interface BossChassisProfile {
  id: BossChassisId;
  enemyType: EnemyType;
  displayName: string;
  subtitle: string;
  color: string;
  size: number;
  baseHealth: number;
  introDurationMs: number;
  weakpoints: BossWeakpointProfile;
  attackWeights: Readonly<Record<string, number>>;
}

const PROFILES: Readonly<Record<BossChassisId, BossChassisProfile>> = {
  DEVOURER: {
    id: "DEVOURER",
    enemyType: EnemyType.BOSS_DEVOURER,
    displayName: BLACKOUT_DEVOURER_CANON.displayName,
    subtitle: BLACKOUT_DEVOURER_CANON.subtitle,
    color: "#ec4899",
    size: 45,
    baseHealth: BLACKOUT_DEVOURER_CANON.maxHealth,
    introDurationMs: BLACKOUT_DEVOURER_CANON.introDuration,
    weakpoints: {
      count: 3,
      health: 120,
      collisionRadius: 14,
      motion: "ORBITAL",
      radiusX: 110,
      radiusY: 110,
      angularVelocityPerFrame: 0.015,
      protectedDamageMultiplier: 0.25,
      exposedDamageMultiplier: 2,
      exposureDurationMs: 4000,
      hudLabel: "SHIELD NODES",
    },
    attackWeights: {},
  },
  TITAN_CORE: {
    id: "TITAN_CORE",
    enemyType: EnemyType.BOSS_TITAN,
    displayName: "Quantum Titan",
    subtitle: "Capital Guardian // Segmented Core",
    color: "#67e8f9",
    size: 62,
    baseHealth: 2400,
    introDurationMs: 4200,
    weakpoints: {
      count: 4,
      health: 180,
      collisionRadius: 16,
      motion: "ANCHORED",
      radiusX: 78,
      radiusY: 46,
      angularVelocityPerFrame: 0,
      protectedDamageMultiplier: 0.15,
      exposedDamageMultiplier: 2.25,
      exposureDurationMs: 6000,
      hudLabel: "CORE SEGMENTS",
    },
    attackWeights: {
      devourer_beam: 1.75,
      gravity_well: 1.25,
      orbital_shards: 2.15,
      blackout_sweep: 1.35,
      singularity_pulse: 1.8,
      rotating_eclipse_lanes: 1.55,
      devourer_charge: 0.25,
    },
  },
};

export const getBossChassisProfile = (
  chassis: BossChassisId,
): BossChassisProfile => PROFILES[chassis];

export const getBossChassisAttackWeight = (
  chassis: BossChassisId | undefined,
  attackId: string,
  baseWeight: number,
): number => {
  if (!chassis) return baseWeight;
  const override = PROFILES[chassis].attackWeights[attackId];
  return override === undefined ? baseWeight : Math.max(0.05, override);
};
