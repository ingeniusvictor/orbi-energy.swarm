import { FormationType, FormationConfig } from "./types";

export const FORMATIONS: Record<FormationType, FormationConfig> = {
  [FormationType.LINE]: {
    type: FormationType.LINE,
    name: "Defensive Ring",
    description: "+25% Shield Resistance, +Circular Shield Guard | -10% Projectile Damage",
    spacing: 35,
    shieldMod: 0.25,
    damageMod: -0.10,
    projSpeedMod: 0.0,
    critChanceMod: 0.0,
    speedMod: 1.0
  },
  [FormationType.CIRCLE]: {
    type: FormationType.CIRCLE,
    name: "Arrowhead V",
    description: "+30% Damage, +15% Proj Speed | Reduced Side Protection",
    spacing: 45,
    shieldMod: -0.15,
    damageMod: 0.30,
    projSpeedMod: 0.15,
    critChanceMod: 0.05,
    speedMod: 1.1
  },
  [FormationType.DELTA]: {
    type: FormationType.DELTA,
    name: "Dynamic Spiral",
    description: "+Orbital Area Fire, +Repel Near Enemies | High Spray Dispersion",
    spacing: 40,
    shieldMod: 0.0,
    damageMod: 0.10,
    projSpeedMod: -0.10,
    critChanceMod: 0.05,
    speedMod: 1.0
  },
  [FormationType.SHIELD]: {
    type: FormationType.SHIELD,
    name: "Energy Halo",
    description: "+35% Range, +Precision Targeting | -15% Shield Resistance",
    spacing: 50,
    shieldMod: -0.15,
    damageMod: 0.15,
    projSpeedMod: 0.20,
    critChanceMod: 0.10,
    speedMod: 0.95
  },
  [FormationType.V_SHAPE]: {
    type: FormationType.V_SHAPE,
    name: "Front Shield",
    description: "Great Frontal Cover, Proj Absorption | -10% Movement Speed",
    spacing: 30,
    shieldMod: 0.30,
    damageMod: 0.0,
    projSpeedMod: -0.05,
    critChanceMod: 0.0,
    speedMod: 0.90
  },
  [FormationType.SCATTERED]: {
    type: FormationType.SCATTERED,
    name: "Float Walkers",
    description: "+25% Evasion, +20% Crit Chance | Loose Follow Cohesion",
    spacing: 60,
    shieldMod: 0.10,
    damageMod: 0.0,
    projSpeedMod: 0.10,
    critChanceMod: 0.20,
    speedMod: 1.15
  }
};

/**
 * Calculates target offsets relative to the Foton leader based on active formation structure.
 */
export function calculateSwarmOffset(
  type: FormationType,
  index: number,
  total: number,
  time: number,
  mouseAngle: number
): { x: number; y: number } {
  const config = FORMATIONS[type];
  const d = config.spacing;

  switch (type) {
    case FormationType.LINE: {
      // 1. DEFENSIVE RING: Concentric orbiting rings protecting the core
      const ringIndex = Math.floor(index / 10);
      const ringPosition = index % 10;
      const ringTotal = Math.min(10, total - ringIndex * 10);
      const radius = (ringIndex + 1) * d * 1.1;
      const angle = (ringPosition / ringTotal) * Math.PI * 2 + time * 0.0012;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    }

    case FormationType.CIRCLE: {
      // 2. ARROWHEAD V: Standard tight V formation flying backward from target angle
      const side = index % 2 === 0 ? 1 : -1;
      const depth = Math.floor(index / 2) + 1;
      const spreadAngle = mouseAngle + Math.PI; // Winging back
      const wingAngle = spreadAngle + (Math.PI / 4) * side;

      const dist = depth * d * 0.95;
      return {
        x: Math.cos(wingAngle) * dist,
        y: Math.sin(wingAngle) * dist
      };
    }

    case FormationType.DELTA: {
      // 3. DYNAMIC SPIRAL: Spiral trailing vector
      const angle = index * 0.4 + time * 0.003;
      const dist = 30 + index * 6;
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist
      };
    }

    case FormationType.SHIELD: {
      // 4. ENERGY HALO: Wide protective hexagon cluster with increased scanning range
      const theta = (index / total) * Math.PI * 2 - time * 0.0006;
      const radius = d * 2.2 + Math.sin(time * 0.002 + index) * 12;
      return {
        x: Math.cos(theta) * radius,
        y: Math.sin(theta) * radius
      };
    }

    case FormationType.V_SHAPE: {
      // 5. FRONT SHIELD: Heavy wedge pushing *towards* the pointer target
      const side = index % 2 === 0 ? 1 : -1;
      const row = Math.floor(index / 2);
      
      // Rotate V so it points forward towards mouseAngle
      const forwardAngle = mouseAngle;
      const wingLeftRight = forwardAngle + Math.PI / 2 * side;
      // offset a bit backwards as the row increases to form a wedge
      const fx = Math.cos(forwardAngle) * (20 - row * 10);
      const fy = Math.sin(forwardAngle) * (20 - row * 10);
      const wx = Math.cos(wingLeftRight) * (row + 1) * d * 0.7;
      const wy = Math.sin(wingLeftRight) * (row + 1) * d * 0.7;
      return {
        x: fx + wx,
        y: fy + wy
      };
    }

    case FormationType.SCATTERED: {
      // 6. FLOAT WALKERS: Loose scattered sine-wave trail with high critical strike chances
      const organicAngle = index * 0.8 + Math.sin(time * 0.001 + index) * 0.6;
      const dist = 40 + index * 4 + Math.cos(time * 0.0015 + index) * 15;
      return {
        x: Math.cos(organicAngle) * dist,
        y: Math.sin(organicAngle) * dist
      };
    }

    default:
      return { x: 0, y: 0 };
  }
}
