import { EnemyType, type BossChassisId } from "./types";
import {
  DEFAULT_WORM_SEGMENT_PHYSICS,
  WORM_SEGMENT_CAP,
  type WormSegmentPhysicsConfig,
} from "./wormSegmentPhysics";
import { BLACKOUT_DEVOURER_CANON } from "./waveDirector";

export type BossWeakpointMotion = "ORBITAL" | "ANCHORED" | "SERPENTINE";

export interface BossWeakpointDestructionReward {
  score: number;
  nanoCredits: number;
}

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
  chainPhysics?: Readonly<WormSegmentPhysicsConfig>;
  destructionReward?: Readonly<BossWeakpointDestructionReward>;
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
  PYRA_SOLFERNAX: {
    id:"PYRA_SOLFERNAX",enemyType:EnemyType.BOSS_SOLFERNAX,
    displayName:"Solfernax",
    subtitle:"PYRA // Living Reactor of the Magma Core",
    color:"#f97316",size:64,baseHealth:2200,introDurationMs:4200,
    weakpoints:{
      count:0,health:0,collisionRadius:0,motion:"ANCHORED",
      radiusX:0,radiusY:0,angularVelocityPerFrame:0,
      protectedDamageMultiplier:.82,exposedDamageMultiplier:2.55,
      exposureDurationMs:2600,hudLabel:"MOLTEN CORE",
    },attackWeights:{},
  },
  FERRUM_OMEGA: {
    id:"FERRUM_OMEGA",enemyType:EnemyType.BOSS_OMEGA,
    displayName:"Omega Foundry",
    subtitle:"FERRUM // Walking Assembly Sovereign",
    color:"#fb923c",size:65,baseHealth:2500,introDurationMs:4100,
    weakpoints:{
      count:0,health:0,collisionRadius:0,motion:"ANCHORED",
      radiusX:0,radiusY:0,angularVelocityPerFrame:0,
      protectedDamageMultiplier:0.78,exposedDamageMultiplier:2.5,
      exposureDurationMs:2450,hudLabel:"UPPER REACTOR",
    },attackWeights:{},
  },
  ASTERIA_ARCHON: {
    id: "ASTERIA_ARCHON",enemyType: EnemyType.BOSS_ARCHON,
    displayName: "Threshold Archon",
    subtitle: "ASTERIA // Sovereign of the Orbital Threshold",
    color: "#facc15",size:55,baseHealth:1800,introDurationMs:3900,
    weakpoints: {
      count:0,health:0,collisionRadius:0,motion:"ANCHORED",
      radiusX:0,radiusY:0,angularVelocityPerFrame:0,
      protectedDamageMultiplier:0.7,exposedDamageMultiplier:2.35,
      exposureDurationMs:2800,hudLabel:"ORBITAL RINGS",
    },
    attackWeights:{},
  },
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
  WORM_SEGMENTS: {
    id: "WORM_SEGMENTS",
    enemyType: EnemyType.BOSS_WORM,
    displayName: "Rift Worm",
    subtitle: "Serpentine Raid // Break the Chain",
    color: "#c084fc",
    size: 44,
    baseHealth: 2100,
    introDurationMs: 3900,
    weakpoints: {
      count: WORM_SEGMENT_CAP,
      health: 145,
      collisionRadius: 15,
      motion: "SERPENTINE",
      radiusX: DEFAULT_WORM_SEGMENT_PHYSICS.spacing,
      radiusY: 0,
      angularVelocityPerFrame: 0,
      protectedDamageMultiplier: 0.18,
      exposedDamageMultiplier: 2.1,
      exposureDurationMs: 5200,
      hudLabel: "WORM SEGMENTS",
      chainPhysics: DEFAULT_WORM_SEGMENT_PHYSICS,
      destructionReward: {
        score: 250,
        nanoCredits: 1,
      },
    },
    attackWeights: {
      devourer_beam: 0.8,
      gravity_well: 1.15,
      orbital_shards: 1.25,
      blackout_sweep: 1.7,
      singularity_pulse: 1.35,
      rotating_eclipse_lanes: 1.85,
      devourer_charge: 1.9,
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
