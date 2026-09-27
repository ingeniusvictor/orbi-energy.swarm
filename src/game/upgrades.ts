
export type UpgradeCategory = "OFFENSE" | "DEFENSE" | "SWARM" | "TACTICAL" | "FUSION";

export interface UpgradeDefinition {
  id: string;
  name: string;
  category: UpgradeCategory;
  description: string;
  icon: string;
  affectedAffinity?: "solar" | "hydro" | "wind" | "thermal" | "none";
  maxStacks: number;
}

export const MID_RUN_UPGRADES: UpgradeDefinition[] = [
  {
    id: "solar_overcharge",
    name: "Solar Overcharge",
    category: "OFFENSE",
    description: "Increases Solar elemental damage by +25% and enhances projectile glow density.",
    icon: "☀️",
    affectedAffinity: "solar",
    maxStacks: 3
  },
  {
    id: "hydro_regenesis",
    name: "Hydro Regenesis",
    category: "DEFENSE",
    description: "Adds mild passive shield regeneration (+0.6/sec) and improves Hydro slowdown intensity by +20%.",
    icon: "💧",
    affectedAffinity: "hydro",
    maxStacks: 3
  },
  {
    id: "wind_acceleration",
    name: "Wind Acceleration",
    category: "OFFENSE",
    description: "Increases Wind followers' rate of fire by +20% and projectile velocity by +25%.",
    icon: "💨",
    affectedAffinity: "wind",
    maxStacks: 3
  },
  {
    id: "thermal_expansion",
    name: "Thermal Expansion",
    category: "OFFENSE",
    description: "Increases heavy explosion splash radius by +30% and enhances fiery blast visuals.",
    icon: "🔥",
    affectedAffinity: "thermal",
    maxStacks: 3
  },
  {
    id: "nuclear_density",
    name: "Nuclear Density",
    category: "OFFENSE",
    description: "Increases raw physical kinetic damage by +25% with safe hit-stop dampening.",
    icon: "☢️",
    affectedAffinity: "none",
    maxStacks: 3
  },
  {
    id: "quantum_fracture",
    name: "Quantum Fracture",
    category: "OFFENSE",
    description: "Improves overall swarm critical strike chance by +8% up to a strict safe probability cap.",
    icon: "⚡",
    affectedAffinity: "none",
    maxStacks: 3
  },
  {
    id: "foton_integrity",
    name: "Foton Integrity",
    category: "DEFENSE",
    description: "Increases maximum shield capacity by +30 units and instantly restores +50 shield on purchase.",
    icon: "🛡️",
    affectedAffinity: "none",
    maxStacks: 3
  },
  {
    id: "swarm_cohesion",
    name: "Swarm Cohesion",
    category: "SWARM",
    description: "Enhances swarm leash pull force by +30% and reduces electromagnetic disruption recovery duration by 50%.",
    icon: "🧲",
    affectedAffinity: "none",
    maxStacks: 2
  },
  {
    id: "formation_synchronizer",
    name: "Formation Synchronizer",
    category: "TACTICAL",
    description: "Reduces the formation shifting cooldown duration by -40% (down to a safe minimum frame threshold).",
    icon: "🔄",
    affectedAffinity: "none",
    maxStacks: 2
  },
  {
    id: "core_magnetism",
    name: "Core Magnetism",
    category: "SWARM",
    description: "Expands Foton's gravitational magnetism attraction radius for resources by +100 pixels.",
    icon: "🧲",
    affectedAffinity: "none",
    maxStacks: 2
  },
  {
    id: "fusion_resonance",
    name: "Fusion Resonance",
    category: "FUSION",
    description: "Amplifies fusion energy generation speed by +25% when feeding energy cores.",
    icon: "🔮",
    affectedAffinity: "none",
    maxStacks: 3
  },
  {
    id: "command_velocity",
    name: "Command Velocity",
    category: "TACTICAL",
    description: "Increases ORBI FOTON's manual propulsion thruster speed by +15% without tearing camera sync.",
    icon: "🚀",
    affectedAffinity: "none",
    maxStacks: 3
  },
  {
    id: "mitotic_mitosis",
    name: "Mitotic Mitosis",
    category: "SWARM",
    description: "Follower projectiles have a +25% chance per stack to duplicate, doubling firepower without increasing permanent capacity.",
    icon: "🧬",
    affectedAffinity: "none",
    maxStacks: 2
  },
  {
    id: "swarm_overscale",
    name: "Swarm Overscale",
    category: "SWARM",
    description: "Increases swarm cohesion and follow recovery speed by +25% per stack, preventing lag or stray followers.",
    icon: "🌌",
    affectedAffinity: "none",
    maxStacks: 2
  }
];

/**
 * Generates three distinct mid-run upgrade choices based on current stats, active upgrades, and swarm composition.
 */
export function generateUpgradeChoices(
  activeUpgrades: Record<string, number>,
  hasSolar: boolean,
  hasHydro: boolean,
  hasWind: boolean,
  hasThermal: boolean
): UpgradeDefinition[] {
  // 1. Filter out upgrades that have already hit their maximum stacks
  let pool = MID_RUN_UPGRADES.filter((up) => {
    const currentStacks = activeUpgrades[up.id] || 0;
    return currentStacks < up.maxStacks;
  });

  // 2. Adjust pool based on swarm elemental affinity composition
  pool = pool.filter((up) => {
    if (up.affectedAffinity === "solar" && !hasSolar) return false;
    if (up.affectedAffinity === "hydro" && !hasHydro) return false;
    if (up.affectedAffinity === "wind" && !hasWind) return false;
    if (up.affectedAffinity === "thermal" && !hasThermal) return false;
    return true;
  });

  // If the filtered pool is too small because the player has very few affinities, fallback to include them or make sure we have at least 5 options
  if (pool.length < 3) {
    pool = MID_RUN_UPGRADES.filter((up) => {
      const currentStacks = activeUpgrades[up.id] || 0;
      return currentStacks < up.maxStacks;
    });
  }

  // Shuffle pool
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  const selected: UpgradeDefinition[] = [];

  for (const item of shuffled) {
    if (selected.length >= 3) break;

    // Rule: Avoid showing 3 items of the exact same category
    if (selected.length === 2) {
      const cat0 = selected[0].category;
      const cat1 = selected[1].category;
      if (item.category === cat0 && item.category === cat1) {
        continue; // skip to keep categories distinct
      }
    }

    selected.push(item);
  }

  // If we still don't have 3, backfill with whatever is not in selected
  if (selected.length < 3) {
    for (const item of MID_RUN_UPGRADES) {
      if (selected.length >= 3) break;
      if (!selected.some(s => s.id === item.id)) {
        selected.push(item);
      }
    }
  }

  return selected;
}

/**
 * Helper to display values before/after choice
 */
export function getUpgradeValueTransition(
  id: string,
  currentLevel: number
): { before: string; after: string } {
  switch (id) {
    case "solar_overcharge":
      return {
        before: `+${currentLevel * 25}% Solar DMG`,
        after: `+${(currentLevel + 1) * 25}% Solar DMG`
      };
    case "hydro_regenesis":
      return {
        before: currentLevel === 0 ? "No Regen" : `+${(currentLevel * 0.6).toFixed(1)}/s & +${currentLevel * 20}% slow`,
        after: `+${((currentLevel + 1) * 0.6).toFixed(1)}/s & +${(currentLevel + 1) * 20}% slow`
      };
    case "wind_acceleration":
      return {
        before: `+${currentLevel * 20}% Fire Rate`,
        after: `+${(currentLevel + 1) * 20}% Fire Rate`
      };
    case "thermal_expansion":
      return {
        before: `+${currentLevel * 30}% Area`,
        after: `+${(currentLevel + 1) * 30}% Area`
      };
    case "nuclear_density":
      return {
        before: `+${currentLevel * 25}% Heavy Kinetic`,
        after: `+${(currentLevel + 1) * 25}% Heavy Kinetic`
      };
    case "quantum_fracture":
      return {
        before: `${currentLevel * 8}% Crit Chance`,
        after: `${(currentLevel + 1) * 8}% Crit Chance`
      };
    case "foton_integrity":
      return {
        before: `+${currentLevel * 30} Max Shield`,
        after: `+${(currentLevel + 1) * 30} Max Shield`
      };
    case "swarm_cohesion":
      return {
        before: `+${currentLevel * 30}% Cohesion, -${currentLevel * 50}% Disrupt`,
        after: `+${(currentLevel + 1) * 30}% Cohesion, -${(currentLevel + 1) * 50}% Disrupt`
      };
    case "formation_synchronizer":
      return {
        before: `-${currentLevel * 40}% Cooldown`,
        after: `-${(currentLevel + 1) * 40}% Cooldown`
      };
    case "core_magnetism":
      return {
        before: `+${currentLevel * 100}px Radius`,
        after: `+${(currentLevel + 1) * 100}px Radius`
      };
    case "fusion_resonance":
      return {
        before: `+${currentLevel * 25}% Energy`,
        after: `+${(currentLevel + 1) * 25}% Energy`
      };
    case "command_velocity":
      return {
        before: `+${currentLevel * 15}% Speed`,
        after: `+${(currentLevel + 1) * 15}% Speed`
      };
    case "mitotic_mitosis":
      return {
        before: `+${currentLevel * 25}% Proj Dup`,
        after: `+${(currentLevel + 1) * 25}% Proj Dup`
      };
    case "swarm_overscale":
      return {
        before: `+${currentLevel * 25}% Cohesion Speed`,
        after: `+${(currentLevel + 1) * 25}% Cohesion Speed`
      };
    default:
      return { before: "0", after: "0" };
  }
}
