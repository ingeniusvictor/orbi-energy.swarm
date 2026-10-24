import { FormationType, FormationConfig } from "./types";

export const FORMATIONS: Record<FormationType, FormationConfig> = {
  [FormationType.LINE]: { type: FormationType.LINE, name: "Defensive Ring", description: "+25% Shield Resistance, +Circular Shield Guard | -10% Projectile Damage", spacing: 35, shieldMod: 0.25, damageMod: -0.10, projSpeedMod: 0, critChanceMod: 0, speedMod: 1 },
  [FormationType.CIRCLE]: { type: FormationType.CIRCLE, name: "Star Matrix", description: "+30% Damage, +15% Proj Speed | Open five-point assault matrix", spacing: 45, shieldMod: -0.15, damageMod: 0.30, projSpeedMod: 0.15, critChanceMod: 0.05, speedMod: 1.1 },
  [FormationType.DELTA]: { type: FormationType.DELTA, name: "Dynamic Spiral", description: "+Orbital Area Fire, +Repel Near Enemies | High Spray Dispersion", spacing: 40, shieldMod: 0, damageMod: 0.10, projSpeedMod: -0.10, critChanceMod: 0.05, speedMod: 1 },
  [FormationType.SHIELD]: { type: FormationType.SHIELD, name: "Energy Halo", description: "+35% Range, +Precision Targeting | -15% Shield Resistance", spacing: 50, shieldMod: -0.15, damageMod: 0.15, projSpeedMod: 0.20, critChanceMod: 0.10, speedMod: 0.95 },
  [FormationType.V_SHAPE]: { type: FormationType.V_SHAPE, name: "X-Guard", description: "Open four-axis cross guard | -10% Movement Speed", spacing: 30, shieldMod: 0.30, damageMod: 0, projSpeedMod: -0.05, critChanceMod: 0, speedMod: 0.90 },
  [FormationType.SCATTERED]: { type: FormationType.SCATTERED, name: "Concentric Delta", description: "Triangular layered formation | Previous passive modifiers unchanged", spacing: 60, shieldMod: 0.10, damageMod: 0, projSpeedMod: 0.10, critChanceMod: 0.20, speedMod: 1.15 },
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
      // EV-F01: preserve ten-point star identity while widening every shell.
      // Previously only +10 per ring and capped outer radius at 136; shells
      // collapsed onto one another with 20-30 companions.
      const shell = Math.floor(index / 10);
      const point = index % 10;
      // The H3 contract caps orbital offsets at 140 world units. Use
      // staggered shell rotations to increase clearance without extending
      // beyond that reach (including 48/64 member diagnostic scenarios).
      const outerRadii = [94, 127, 139];
      const innerRadii = [57, 92, 113];
      const safeShell = Math.min(shell, 2);
      const radius = point % 2 === 0 ? outerRadii[safeShell] : innerRadii[safeShell];
      const shellRotation = [0, -0.18, 0.14][shell % 3] +
        Math.max(0, shell - 2) * 0.26;
      const angle = mouseAngle - Math.PI / 2 + point * (Math.PI / 5) +
        shellRotation + time * 0.0002;
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
      // Four wide diagonal arms, with alternating lanes to prevent
      // companions piling onto the same four narrow radial tracks.
      const arm = index % 4;
      const lane = Math.floor(index / 4) % 2;
      const rank = Math.floor(index / 8);
      const radius = Math.min(138, 42 + rank * 32);
      const perpendicular = lane === 0 ? -17 : 17;
      const angle = mouseAngle + Math.PI / 4 + arm * (Math.PI / 2);
      return {
        x: Math.cos(angle) * radius - Math.sin(angle) * perpendicular,
        y: Math.sin(angle) * radius + Math.cos(angle) * perpendicular,
      };
    }
    case FormationType.SCATTERED: {
      // EV-F08: Delta Concéntrica remains mapped to the saved SCATTERED ID.
      // A 3/9/18 occupancy schedule avoids squeezing ten large E8 bodies
      // onto the shortest triangle. Its three aligned outlines preserve the
      // concentric-delta silhouette at 10, 20 and 30 companions.
      //
      // Max vertex radius 155 is inside the 160-unit soft leash; the former
      // 172-unit outer shell could contract dynamically and collide with the
      // 130-unit inner outline. Static 30-E8 nominal min centre separation:
      // >=31.9 units, against 2 * 14 solid wing tip radius + 2 margin.
      // Selecting permanent slot indices prevents recruits from moving all
      // existing followers whenever the partial shell grows.
      const safeIndex = Math.max(0, Math.floor(index));
      const shell = safeIndex < 3 ? 0 : safeIndex < 12 ? 1 : 2;
      const shellStart = [0, 3, 12][shell];
      const shellCapacity = [3, 9, 18][shell];
      const local = (safeIndex - shellStart) % shellCapacity;
      const slots = [
        [0, 1, 2],
        [0, 3, 6, 1, 4, 7, 2, 5, 8],
        [0, 6, 12, 3, 9, 15, 1, 7, 13, 4, 10, 16, 2, 8, 14, 5, 11, 17],
      ];
      const slot = slots[shell][local];
      const radius = [35, 95, 155][shell];
      const phase = [0, 0.72, 0.8][shell];
      const perimeterPosition = ((slot + phase) / shellCapacity) * 3;
      const side = Math.floor(perimeterPosition) % 3;
      const fraction = perimeterPosition - Math.floor(perimeterPosition);
      const rotation = mouseAngle * 0.15;
      const vertex = (corner: number) => {
        const angle = -Math.PI / 2 + corner * (Math.PI * 2 / 3) + rotation;
        return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
      };
      const from = vertex(side);
      const to = vertex((side + 1) % 3);
      return {
        x: from.x + (to.x - from.x) * fraction,
        y: from.y + (to.y - from.y) * fraction,
      };
    }
    default: return { x: 0, y: 0 };
  }
}
