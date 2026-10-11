import type {
  OrbiAttackShape,
  OrbiAttackSignature,
  OrbiEnergyId,
} from "./types";

export interface OrbiAttackProfile {
  signature: OrbiAttackSignature;
  energyId: OrbiEnergyId;
  shape: OrbiAttackShape;
  speedMultiplier: number;
  damageMultiplier: number;
  projectileSize: number;
  cooldownFrames: number;
  lifetimeMs: number;
  pushMultiplier: number;
  slowDurationMs: number;
  splashRadius: number;
  splashDamageMultiplier: number;
  magneticPullRadius: number;
  magneticPullStrength: number;
  supportShieldRestore: number;
  criticalChance: number;
  criticalDamageMultiplier: number;
  echoAngleRadians: number;
  echoDamageMultiplier: number;
}

export const ORBI_ATTACK_PROFILES: Readonly<
  Record<OrbiAttackSignature, OrbiAttackProfile>
> = {
  FOTON_LANCE: {
    signature: "FOTON_LANCE",
    energyId: "FOTON",
    shape: "LANCE",
    speedMultiplier: 1.45,
    damageMultiplier: 1.1,
    projectileSize: 2.2,
    cooldownFrames: 56,
    lifetimeMs: 1400,
    pushMultiplier: 1.0,
    slowDurationMs: 0,
    splashRadius: 0,
    splashDamageMultiplier: 0,
    magneticPullRadius: 0,
    magneticPullStrength: 0,
    supportShieldRestore: 0,
    criticalChance: 0,
    criticalDamageMultiplier: 1,
    echoAngleRadians: 0,
    echoDamageMultiplier: 0,
  },
  HYDRO_PULSE: {
    signature: "HYDRO_PULSE",
    energyId: "HYDRO",
    shape: "RIPPLE",
    speedMultiplier: 0.82,
    damageMultiplier: 0.9,
    projectileSize: 4.4,
    cooldownFrames: 70,
    lifetimeMs: 1700,
    pushMultiplier: 0.65,
    slowDurationMs: 3000,
    splashRadius: 0,
    splashDamageMultiplier: 0,
    magneticPullRadius: 0,
    magneticPullStrength: 0,
    supportShieldRestore: 0,
    criticalChance: 0,
    criticalDamageMultiplier: 1,
    echoAngleRadians: 0,
    echoDamageMultiplier: 0,
  },
  AERO_CRESCENT: {
    signature: "AERO_CRESCENT",
    energyId: "AERO",
    shape: "CRESCENT",
    speedMultiplier: 1.72,
    damageMultiplier: 0.82,
    projectileSize: 4.8,
    cooldownFrames: 45,
    lifetimeMs: 1150,
    pushMultiplier: 2.75,
    slowDurationMs: 0,
    splashRadius: 0,
    splashDamageMultiplier: 0,
    magneticPullRadius: 0,
    magneticPullStrength: 0,
    supportShieldRestore: 0,
    criticalChance: 0,
    criticalDamageMultiplier: 1,
    echoAngleRadians: 0,
    echoDamageMultiplier: 0,
  },
  TERMO_BURST: {
    signature: "TERMO_BURST",
    energyId: "TERMO",
    shape: "PLASMA",
    speedMultiplier: 0.96,
    damageMultiplier: 1.08,
    projectileSize: 4.4,
    cooldownFrames: 68,
    lifetimeMs: 1450,
    pushMultiplier: 1.0,
    slowDurationMs: 0,
    splashRadius: 58,
    splashDamageMultiplier: 0.45,
    magneticPullRadius: 0,
    magneticPullStrength: 0,
    supportShieldRestore: 0,
    criticalChance: 0,
    criticalDamageMultiplier: 1,
    echoAngleRadians: 0,
    echoDamageMultiplier: 0,
  },
  MAGNE_ARC: {
    signature: "MAGNE_ARC",
    energyId: "MAGNE",
    shape: "ARC",
    speedMultiplier: 1.16,
    damageMultiplier: 0.92,
    projectileSize: 3.2,
    cooldownFrames: 62,
    lifetimeMs: 1400,
    pushMultiplier: 0.7,
    slowDurationMs: 0,
    splashRadius: 0,
    splashDamageMultiplier: 0,
    magneticPullRadius: 62,
    magneticPullStrength: 5.5,
    supportShieldRestore: 0,
    criticalChance: 0,
    criticalDamageMultiplier: 1,
    echoAngleRadians: 0,
    echoDamageMultiplier: 0,
  },
  ATON_PARTICLE: {
    signature: "ATON_PARTICLE",
    energyId: "ATON",
    shape: "PARTICLE",
    speedMultiplier: 0.72,
    damageMultiplier: 2.05,
    projectileSize: 5.0,
    cooldownFrames: 82,
    lifetimeMs: 1800,
    pushMultiplier: 1.35,
    slowDurationMs: 0,
    splashRadius: 32,
    splashDamageMultiplier: 0.24,
    magneticPullRadius: 0,
    magneticPullStrength: 0,
    supportShieldRestore: 0,
    criticalChance: 0,
    criticalDamageMultiplier: 1,
    echoAngleRadians: 0,
    echoDamageMultiplier: 0,
  },
  KINETRIX_LANCE: {
    signature: "KINETRIX_LANCE",
    energyId: "KINETRIX",
    shape: "KINETIC",
    speedMultiplier: 1.92,
    damageMultiplier: 0.95,
    projectileSize: 2.4,
    cooldownFrames: 40,
    lifetimeMs: 1050,
    pushMultiplier: 2.0,
    slowDurationMs: 0,
    splashRadius: 0,
    splashDamageMultiplier: 0,
    magneticPullRadius: 0,
    magneticPullStrength: 0,
    supportShieldRestore: 0,
    criticalChance: 0.18,
    criticalDamageMultiplier: 1.8,
    echoAngleRadians: 0,
    echoDamageMultiplier: 0,
  },
  H2NOVA_CELL: {
    signature: "H2NOVA_CELL",
    energyId: "H2NOVA",
    shape: "CELL",
    speedMultiplier: 1.0,
    damageMultiplier: 0.72,
    projectileSize: 4.2,
    cooldownFrames: 76,
    lifetimeMs: 1550,
    pushMultiplier: 0.6,
    slowDurationMs: 0,
    splashRadius: 0,
    splashDamageMultiplier: 0,
    magneticPullRadius: 0,
    magneticPullStrength: 0,
    supportShieldRestore: 0.22,
    criticalChance: 0,
    criticalDamageMultiplier: 1,
    echoAngleRadians: 0,
    echoDamageMultiplier: 0,
  },
  QUANTUM_PHASE: {
    signature: "QUANTUM_PHASE",
    energyId: "QUANTUM",
    shape: "PHASE",
    speedMultiplier: 1.22,
    damageMultiplier: 0.9,
    projectileSize: 3.3,
    cooldownFrames: 74,
    lifetimeMs: 1350,
    pushMultiplier: 0.85,
    slowDurationMs: 0,
    splashRadius: 0,
    splashDamageMultiplier: 0,
    magneticPullRadius: 0,
    magneticPullStrength: 0,
    supportShieldRestore: 0,
    criticalChance: 0.22,
    criticalDamageMultiplier: 2.25,
    echoAngleRadians: 0.075,
    echoDamageMultiplier: 0.55,
  },
  GAIA_SYNTHESIS: {
    signature: "GAIA_SYNTHESIS",
    energyId: "GAIA",
    shape: "SYNTHESIS",
    speedMultiplier: 1.12,
    damageMultiplier: 1.35,
    projectileSize: 5.6,
    cooldownFrames: 54,
    lifetimeMs: 1550,
    pushMultiplier: 1.3,
    slowDurationMs: 900,
    splashRadius: 46,
    splashDamageMultiplier: 0.3,
    magneticPullRadius: 40,
    magneticPullStrength: 2.8,
    supportShieldRestore: 0.3,
    criticalChance: 0.12,
    criticalDamageMultiplier: 1.6,
    echoAngleRadians: 0,
    echoDamageMultiplier: 0,
  },
};

export const getOrbiAttackProfile = (
  signature: OrbiAttackSignature,
): OrbiAttackProfile => ORBI_ATTACK_PROFILES[signature];

export const getFallbackAttackSignatureForAffinity = (
  affinity: string,
): OrbiAttackSignature => {
  switch (affinity) {
    case "hydro": return "HYDRO_PULSE";
    case "wind": return "AERO_CRESCENT";
    case "thermal": return "TERMO_BURST";
    case "magnetic": return "MAGNE_ARC";
    case "nuclear": return "ATON_PARTICLE";
    case "kinetic": return "KINETRIX_LANCE";
    case "hydrogen": return "H2NOVA_CELL";
    case "quantum": return "QUANTUM_PHASE";
    case "gaia": return "GAIA_SYNTHESIS";
    case "solar":
    default:
      return "FOTON_LANCE";
  }
};
