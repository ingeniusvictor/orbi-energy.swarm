import type {
  OrbiAffinity,
  OrbiAttackSignature,
  OrbiCombatRole,
  OrbiEnergyId,
} from "./types";

export interface OrbiEnergyDefinition {
  id: OrbiEnergyId;
  displayName: string;
  energyLabel: string;
  affinity: OrbiAffinity;
  color: string;
  combatRole: OrbiCombatRole;
  attackSignature: OrbiAttackSignature;
  loreRole: string;
  collectibleFollower: boolean;
  gaiaPrerequisite: boolean;
}

/** ENERGY commands the swarm but is not an elemental follower. */
export const ORBI_PROTAGONIST_ID = "ENERGY" as const;

export const ORBI_ENERGY_CANON: readonly OrbiEnergyDefinition[] = [
  {
    id: "FOTON",
    displayName: "FOTON",
    energyLabel: "Energía Fotovoltaica",
    affinity: "solar",
    color: "#7cff56",
    combatRole: "beam",
    attackSignature: "FOTON_LANCE",
    loreRole: "ORBI fotovoltaico coleccionable · panel solar verde y lanza de luz",
    collectibleFollower: true,
    gaiaPrerequisite: true,
  },
  {
    id: "HYDRO",
    displayName: "HYDRO",
    energyLabel: "Energía Hidroeléctrica",
    affinity: "hydro",
    color: "#38bdf8",
    combatRole: "pulse",
    attackSignature: "HYDRO_PULSE",
    loreRole: "Control de flujo · ralentización y contención",
    collectibleFollower: true,
    gaiaPrerequisite: true,
  },
  {
    id: "AERO",
    displayName: "AERO",
    energyLabel: "Energía Eólica",
    affinity: "wind",
    color: "#e7f4ff",
    combatRole: "rapid",
    attackSignature: "AERO_CRESCENT",
    loreRole: "Movilidad · dispersión y empuje aerodinámico",
    collectibleFollower: true,
    gaiaPrerequisite: true,
  },
  {
    id: "TERMO",
    displayName: "TERMO",
    energyLabel: "Energía Térmica",
    affinity: "thermal",
    color: "#ff5a36",
    combatRole: "pulse",
    attackSignature: "TERMO_BURST",
    loreRole: "Calor concentrado · explosión y daño de área",
    collectibleFollower: true,
    gaiaPrerequisite: true,
  },
  {
    id: "MAGNE",
    displayName: "MAGNE",
    energyLabel: "Energía Electromagnética",
    affinity: "magnetic",
    color: "#dde7f2",
    combatRole: "arc",
    attackSignature: "MAGNE_ARC",
    loreRole: "Control magnético · atracción y agrupamiento",
    collectibleFollower: true,
    gaiaPrerequisite: true,
  },
  {
    id: "ATON",
    displayName: "ATON",
    energyLabel: "Energía Atómica",
    affinity: "nuclear",
    color: "#ff4db8",
    combatRole: "beam",
    attackSignature: "ATON_PARTICLE",
    loreRole: "Potencia atómica · daño pesado y degradación progresiva",
    collectibleFollower: true,
    gaiaPrerequisite: true,
  },
  {
    id: "KINETRIX",
    displayName: "KINETRIX",
    energyLabel: "Energía Cinética",
    affinity: "kinetic",
    color: "#facc15",
    combatRole: "rapid",
    attackSignature: "KINETRIX_LANCE",
    loreRole: "Impulso cinético · velocidad, combos y críticos",
    collectibleFollower: true,
    gaiaPrerequisite: true,
  },
  {
    id: "H2NOVA",
    displayName: "H2NOVA",
    energyLabel: "Hidrógeno Verde",
    affinity: "hydrogen",
    color: "#38d9ed",
    combatRole: "support",
    attackSignature: "H2NOVA_CELL",
    loreRole: "Reserva H₂ · escudos, restauración y soporte energético",
    collectibleFollower: true,
    gaiaPrerequisite: true,
  },
  {
    id: "QUANTUM",
    displayName: "QUANTUM",
    energyLabel: "Energía Cuántica",
    affinity: "quantum",
    color: "#ba53ff",
    combatRole: "arc",
    attackSignature: "QUANTUM_PHASE",
    loreRole: "Manipulación espacial · duplicación y fase cuántica",
    collectibleFollower: true,
    gaiaPrerequisite: true,
  },
  {
    id: "GAIA",
    displayName: "GAIA",
    energyLabel: "Síntesis de las Nueve Energías",
    affinity: "gaia",
    color: "#72cf4f",
    combatRole: "support",
    attackSignature: "GAIA_SYNTHESIS",
    loreRole: "Fusión total · atacante/defensor, barrera y fortificación",
    collectibleFollower: false,
    gaiaPrerequisite: false,
  },
] as const;

const BY_ID = new Map<OrbiEnergyId, OrbiEnergyDefinition>(
  ORBI_ENERGY_CANON.map((definition) => [definition.id, definition]),
);

const BY_AFFINITY = new Map<OrbiAffinity, OrbiEnergyDefinition>(
  ORBI_ENERGY_CANON.map((definition) => [definition.affinity, definition]),
);

export const ORBI_BASE_ENERGY_IDS = ORBI_ENERGY_CANON
  .filter((definition) => definition.gaiaPrerequisite)
  .map((definition) => definition.id) as readonly OrbiEnergyId[];

export const ORBI_COLLECTIBLE_ENERGY_IDS = ORBI_ENERGY_CANON
  .filter((definition) => definition.collectibleFollower)
  .map((definition) => definition.id) as readonly OrbiEnergyId[];

export const ORBI_GAIA_REQUIRED_FOLLOWER_IDS = ORBI_ENERGY_CANON
  .filter(
    (definition) =>
      definition.gaiaPrerequisite,
  )
  .map((definition) => definition.id) as readonly OrbiEnergyId[];

export const getOrbiEnergyDefinition = (
  id: OrbiEnergyId,
): OrbiEnergyDefinition => {
  const definition = BY_ID.get(id);
  if (!definition) {
    throw new Error(`Unknown ORBI energy id: ${id}`);
  }
  return definition;
};

export const getOrbiEnergyByAffinity = (
  affinity: OrbiAffinity,
): OrbiEnergyDefinition => {
  const definition = BY_AFFINITY.get(affinity);
  if (!definition) {
    throw new Error(`Unknown ORBI affinity: ${affinity}`);
  }
  return definition;
};

export const getCollectibleEnergyDefinition = (
  id: OrbiEnergyId,
): OrbiEnergyDefinition => {
  const definition = getOrbiEnergyDefinition(id);
  if (!definition.collectibleFollower) {
    throw new Error(`${id} is not a normal collectible follower`);
  }
  return definition;
};

export const createShuffledCollectibleEnergyCycle = (
  random: () => number = Math.random,
): OrbiEnergyId[] => {
  const cycle = [...ORBI_COLLECTIBLE_ENERGY_IDS];
  for (let index = cycle.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const hold = cycle[index];
    cycle[index] = cycle[swapIndex];
    cycle[swapIndex] = hold;
  }
  return cycle;
};
