import { EnemyType, type InfiniteBossIdentity } from "./types";

export type InfiniteBossFamilyProfile = {
  identity: InfiniteBossIdentity;
  displayName: string;
  subtitle: string;
  color: string;
  supportEnemyType: EnemyType;
  supportMaxCount: number;
  supportCooldownMs: number;
  introDialogue: string;
  defeatLabel: string;
  defeatDialogue: string;
  attackWeights: Readonly<Record<string, number>>;
};

const FAMILY_ROTATION: readonly InfiniteBossIdentity[] = [
  "DEVOURER_ASCENDANT",
  "NULL_ARCHITECT",
  "RIFT_MATRIARCH",
  "SIEGE_CATHEDRAL",
] as const;

const PROFILES: Readonly<Record<InfiniteBossIdentity, InfiniteBossFamilyProfile>> = {
  DEVOURER_ASCENDANT: {
    identity: "DEVOURER_ASCENDANT",
    displayName: "Blackout Devourer Ascendant",
    subtitle: "Predator-Class Recurrence",
    color: "#ec4899",
    supportEnemyType: EnemyType.RIFT_HUNTER,
    supportMaxCount: 2,
    supportCooldownMs: 9000,
    introDialogue: "¡RECURRENCIA ASCENDENTE! El Blackout Devourer vuelve con cazadores de grieta.",
    defeatLabel: "DEVOURER ASCENDANT PURGED",
    defeatDialogue: "RECURRENCIA ASCENDENTE SELLADA. Reanudando Infinite Swarm.",
    attackWeights: {
      rotating_eclipse_lanes: 1.45,
      devourer_charge: 1.35,
      singularity_pulse: 1.2,
    },
  },
  NULL_ARCHITECT: {
    identity: "NULL_ARCHITECT",
    displayName: "Null Architect",
    subtitle: "Spatial-Control Intelligence",
    color: "#22d3ee",
    supportEnemyType: EnemyType.VOID_ANCHOR,
    supportMaxCount: 2,
    supportCooldownMs: 8500,
    introDialogue: "¡ARQUITECTURA NULA DETECTADA! El espacio de combate está siendo reescrito por anclas de vacío.",
    defeatLabel: "NULL ARCHITECT COLLAPSED",
    defeatDialogue: "MALLA NULA COLAPSADA. El espacio táctico vuelve a responder.",
    attackWeights: {
      gravity_well: 2.2,
      blackout_sweep: 1.85,
      singularity_pulse: 1.55,
      devourer_beam: 0.65,
      devourer_charge: 0.35,
    },
  },
  RIFT_MATRIARCH: {
    identity: "RIFT_MATRIARCH",
    displayName: "Rift Matriarch",
    subtitle: "Predictive Hunter Nexus",
    color: "#fb923c",
    supportEnemyType: EnemyType.RIFT_HUNTER,
    supportMaxCount: 3,
    supportCooldownMs: 6500,
    introDialogue: "¡MATRIZ DE CAZA ABIERTA! La Rift Matriarch está encadenando vectores predictivos.",
    defeatLabel: "RIFT MATRIARCH PURGED",
    defeatDialogue: "NEXO DE GRIETA CERRADO. Los vectores de caza se disipan.",
    attackWeights: {
      devourer_charge: 2.35,
      rotating_eclipse_lanes: 1.7,
      orbital_shards: 1.25,
      gravity_well: 0.55,
    },
  },
  SIEGE_CATHEDRAL: {
    identity: "SIEGE_CATHEDRAL",
    displayName: "Siege Cathedral",
    subtitle: "Artillery Geometry Engine",
    color: "#f472b6",
    supportEnemyType: EnemyType.SIEGE_PRISM,
    supportMaxCount: 2,
    supportCooldownMs: 8000,
    introDialogue: "¡CATEDRAL DE ASEDIO EN LÍNEA! Lee los corredores seguros antes del bombardeo geométrico.",
    defeatLabel: "SIEGE CATHEDRAL SILENCED",
    defeatDialogue: "ARTILLERÍA GEOMÉTRICA SILENCIADA. Corredores de escape restaurados.",
    attackWeights: {
      devourer_beam: 2.15,
      orbital_shards: 1.9,
      blackout_sweep: 1.8,
      rotating_eclipse_lanes: 1.5,
      devourer_charge: 0.3,
    },
  },
};

export const selectInfiniteBossIdentity = (
  sector: number,
): InfiniteBossIdentity => {
  const ordinal = Math.max(0, Math.floor(Math.max(25, sector) / 25) - 1);
  return FAMILY_ROTATION[ordinal % FAMILY_ROTATION.length];
};

export const getInfiniteBossFamilyProfile = (
  identity: InfiniteBossIdentity,
): InfiniteBossFamilyProfile => PROFILES[identity];

export const getInfiniteBossAttackWeight = (
  identity: InfiniteBossIdentity | undefined,
  attackId: string,
  baseWeight: number,
): number => {
  if (!identity) return baseWeight;
  const override = PROFILES[identity].attackWeights[attackId];
  return override === undefined ? baseWeight : Math.max(0.05, override);
};
