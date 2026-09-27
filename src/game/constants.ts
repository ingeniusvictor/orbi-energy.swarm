export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 480; // Keep a flexible 5:3 responsive aspect ratio
export const WORLD_WIDTH = 1600;
export const WORLD_HEIGHT = 960;

export const WORLD_BOUNDS = {
  minX: 8,
  minY: 8,
  maxX: WORLD_WIDTH - 8,
  maxY: WORLD_HEIGHT - 8,
};

export const MAX_SWARM_MEMBERS = 100;
export const MAX_ENEMIES = 80;
export const MAX_PROJECTILES = 120;
export const MAX_PARTICLES: Record<string, number> = {
  LOW: 100,
  MEDIUM: 300,
  HIGH: 800
};
export const MAX_RESOURCES = 60;

export const PLAYER_BASE_SPEED = 2.8;
export const PLAYER_HIT_COOLDOWN = 1000; // Invincibility frame in ms
export const SHIELD_MAX = 100;

export const UPGRADES = [
  { id: "hydrogen_deflector", name: "Hydrogen Deflector", cost: 15, desc: "+15% Max Shield & +20% Shield Regen Rate", level: 0 },
  { id: "quantum_core", name: "Quantum Core", cost: 25, desc: "Swarm capacity +12 per level (36/48/60 Max) & +10% follow speed", level: 0 },
  { id: "fusion_resonator", name: "Fusion Resonator", cost: 40, desc: "Increases Fusion energy generation by +40%", level: 0 },
  { id: "nano_catalyst", name: "Nano Catalyst", cost: 20, desc: "Swarms harvest resources from +30% longer distance", level: 0 },
  { id: "mitosis_relic", name: "Mitosis Relic", cost: 60, desc: "Critical shoots have a 10% chance to duplicate bullet", level: 0 }
];

export const UPGRADE_REWARD_WAVES = [2, 4, 6, 8];

