import { FormationType, FormationConfig } from "./types";

export const FORMATIONS: Record<FormationType, FormationConfig> = {
  [FormationType.LINE]: { type: FormationType.LINE, name: "Defensive Ring", description: "+25% Shield Resistance, +Circular Shield Guard | -10% Projectile Damage", spacing: 35, shieldMod: 0.25, damageMod: -0.10, projSpeedMod: 0, critChanceMod: 0, speedMod: 1 },
  [FormationType.CIRCLE]: { type: FormationType.CIRCLE, name: "Star Matrix", description: "+30% Damage, +15% Proj Speed | Compact five-point assault matrix", spacing: 45, shieldMod: -0.15, damageMod: 0.30, projSpeedMod: 0.15, critChanceMod: 0.05, speedMod: 1.1 },
  [FormationType.DELTA]: { type: FormationType.DELTA, name: "Dynamic Spiral", description: "+Orbital Area Fire, +Repel Near Enemies | High Spray Dispersion", spacing: 40, shieldMod: 0, damageMod: 0.10, projSpeedMod: -0.10, critChanceMod: 0.05, speedMod: 1 },
  [FormationType.SHIELD]: { type: FormationType.SHIELD, name: "Energy Halo", description: "+35% Range, +Precision Targeting | -15% Shield Resistance", spacing: 50, shieldMod: -0.15, damageMod: 0.15, projSpeedMod: 0.20, critChanceMod: 0.10, speedMod: 0.95 },
  [FormationType.V_SHAPE]: { type: FormationType.V_SHAPE, name: "X-Guard", description: "Four-axis close guard, strong crossfire cover | -10% Movement Speed", spacing: 30, shieldMod: 0.30, damageMod: 0, projSpeedMod: -0.05, critChanceMod: 0, speedMod: 0.90 },
  [FormationType.SCATTERED]: { type: FormationType.SCATTERED, name: "Float Walkers", description: "+25% Evasion, +20% Crit Chance | Loose Follow Cohesion", spacing: 60, shieldMod: 0.10, damageMod: 0, projSpeedMod: 0.10, critChanceMod: 0.20, speedMod: 1.15 },
};

export function calculateSwarmOffset(type: FormationType, index: number, total: number, time: number, mouseAngle: number): { x: number; y: number } {
  const config = FORMATIONS[type];
  const d = config.spacing;
  switch (type) {
    case FormationType.LINE: {
      const ringIndex = Math.floor(index / 10);
      const ringPosition = index % 10;
      const ringTotal = Math.max(1, Math.min(10, total - ringIndex * 10));
      const radius = (ringIndex + 1) * d * 1.1;
      const angle = (ringPosition / ringTotal) * Math.PI * 2 + time * 0.0012;
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    }
    case FormationType.CIRCLE: {
      // STAR MATRIX: repeated ten-vertex star shells, bounded for large swarms.
      const shell = Math.floor(index / 10);
      const point = index % 10;
      const shellOuter = Math.min(136, 78 + shell * 10);
      const radius = point % 2 === 0 ? shellOuter : shellOuter * 0.48;
      const angle = mouseAngle - Math.PI / 2 + point * (Math.PI / 5) + time * 0.0002;
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    }
    case FormationType.DELTA: {
      const angle = index * 0.4 + time * 0.003;
      const dist = 30 + index * 6;
      return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
    }
    case FormationType.SHIELD: {
      const theta = (index / Math.max(1, total)) * Math.PI * 2 - time * 0.0006;
      const radius = d * 2.2 + Math.sin(time * 0.002 + index) * 12;
      return { x: Math.cos(theta) * radius, y: Math.sin(theta) * radius };
    }
    case FormationType.V_SHAPE: {
      // X-GUARD: four diagonal arms with capped reach.
      const arm = index % 4;
      const rank = Math.floor(index / 4);
      const radius = Math.min(138, 42 + rank * 8);
      const angle = mouseAngle + Math.PI / 4 + arm * (Math.PI / 2);
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    }
    case FormationType.SCATTERED: {
      const organicAngle = index * 0.8 + Math.sin(time * 0.001 + index) * 0.6;
      const dist = 40 + index * 4 + Math.cos(time * 0.0015 + index) * 15;
      return { x: Math.cos(organicAngle) * dist, y: Math.sin(organicAngle) * dist };
    }
    default: return { x: 0, y: 0 };
  }
}
