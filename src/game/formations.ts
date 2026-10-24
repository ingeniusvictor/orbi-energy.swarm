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
      const radius = 52 + rank * 34;
      const perpendicular = lane === 0 ? -18 : 18;
      const angle = mouseAngle + Math.PI / 4 + arm * (Math.PI / 2);
      return {
        x: Math.cos(angle) * radius - Math.sin(angle) * perpendicular,
        y: Math.sin(angle) * radius + Math.cos(angle) * perpendicular,
      };
    }
    case FormationType.SCATTERED: {
      // Compatibility: keep the serialized key SCATTERED, but its geometry
      // is now a deterministic layered delta, never organic scatter.
      // Ten followers per triangular perimeter; successive shells grow.
      const shell = Math.floor(index / 10);
      const countInShell = Math.max(1, Math.min(10, total - shell * 10));
      const point = index % 10;
      const radius = 88 + shell * 42;
      const perimeterPosition = (point / countInShell) * 3;
      const side = Math.min(2, Math.floor(perimeterPosition));
      const fraction = perimeterPosition - side;
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
