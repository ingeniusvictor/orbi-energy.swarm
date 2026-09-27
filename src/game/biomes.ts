import { BiomeType, BiomeConfig } from "./types";

export const BIOMES: Record<BiomeType, BiomeConfig> = {
  [BiomeType.SOLAR_PLAINS]: {
    type: BiomeType.SOLAR_PLAINS,
    name: "Solar Fields",
    description: "Amber grids. Extreme photon radiation. Double Nano Credit crystal yields!",
    bgColor: "#140e02",
    gridColor: "rgba(245, 158, 11, 0.12)",
    particleColor: "#f59e0b",
    enemySpawnRate: 140, // frames between spawns
    enemySpeedMultiplier: 1.0,
    crystalValueMultiplier: 2.0,
    nebulaColors: ["#f59e0b", "#d97706", "#78350f"]
  },
  [BiomeType.DEEP_WATER]: {
    type: BiomeType.DEEP_WATER,
    name: "Hydro Gardens",
    description: "Ocean depths. Entangling current slows all entities, but doubles player shield regeneration!",
    bgColor: "#020f14",
    gridColor: "rgba(6, 182, 212, 0.15)",
    particleColor: "#06b6d4",
    enemySpawnRate: 150,
    enemySpeedMultiplier: 0.8, // slower movement in deep waters
    crystalValueMultiplier: 1.0,
    nebulaColors: ["#06b6d4", "#0891b2", "#164e63"]
  },
  [BiomeType.CYBER_VOID]: {
    type: BiomeType.CYBER_VOID,
    name: "Wind Skylands",
    description: "High altitude gaseous pressure fields. Swarm weapon cycle rates increased by 25%!",
    bgColor: "#06140d",
    gridColor: "rgba(16, 185, 129, 0.13)",
    particleColor: "#10b981",
    enemySpawnRate: 130,
    enemySpeedMultiplier: 1.15, // wind sweeps
    crystalValueMultiplier: 1.2,
    nebulaColors: ["#10b981", "#059669", "#064e3b"]
  },
  [BiomeType.ACID_SWAMP]: {
    type: BiomeType.ACID_SWAMP,
    name: "Thermal Forge",
    description: "Magma orbits. Overheated engines boost projectile and contact damage outputs!",
    bgColor: "#140303",
    gridColor: "rgba(239, 68, 68, 0.15)",
    particleColor: "#ef4444",
    enemySpawnRate: 110, // faster spawn danger
    enemySpeedMultiplier: 1.1,
    crystalValueMultiplier: 1.5,
    nebulaColors: ["#ef4444", "#dc2626", "#7f1d1d"]
  },
  [BiomeType.MAGMA_CHAMBER]: {
    type: BiomeType.MAGMA_CHAMBER,
    name: "Reactor Prime",
    description: "Unstable atomic grid. Higher score multipliers, but warning: enemy counts spawn faster!",
    bgColor: "#110214",
    gridColor: "rgba(139, 92, 246, 0.15)",
    particleColor: "#8b5cf6",
    enemySpawnRate: 90, // Fast intense action
    enemySpeedMultiplier: 1.2,
    crystalValueMultiplier: 2.5,
    nebulaColors: ["#8b5cf6", "#7c3aed", "#4c1d95"]
  },
  [BiomeType.QUANTUM_NEXUS]: {
    type: BiomeType.QUANTUM_NEXUS,
    name: "Quantum Sanctuary",
    description: "Multidimensional nexus. Reality shifts offer increased item magnet range and high critical hits!",
    bgColor: "#14020a",
    gridColor: "rgba(236, 72, 153, 0.15)",
    particleColor: "#ec4899",
    enemySpawnRate: 120,
    enemySpeedMultiplier: 1.0,
    crystalValueMultiplier: 1.8,
    nebulaColors: ["#ec4899", "#db2777", "#831843"]
  }
};

/**
 * Gets a biome configuration or fallback.
 */
export function getBiomeConfig(type: BiomeType): BiomeConfig {
  return BIOMES[type] || BIOMES[BiomeType.SOLAR_PLAINS];
}

/**
 * Returns list of biomes in rotation order.
 */
export const BIOME_ROTATION = [
  BiomeType.SOLAR_PLAINS,
  BiomeType.DEEP_WATER,
  BiomeType.CYBER_VOID,
  BiomeType.ACID_SWAMP,
  BiomeType.MAGMA_CHAMBER,
  BiomeType.QUANTUM_NEXUS
];
