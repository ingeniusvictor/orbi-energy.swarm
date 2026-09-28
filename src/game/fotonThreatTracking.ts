import type { Enemy } from "./types";

export interface FotonThreatSelection {
  id: string;
  x: number;
  y: number;
  isBoss: boolean;
}

export interface FotonThreatDirection {
  x: number;
  y: number;
}

export const FOTON_THREAT_REFRESH_MS = 160;
export const FOTON_THREAT_MAX_RANGE = 680;
const RETAIN_DISTANCE_RATIO = 1.35;

const distanceSquared = (
  ax: number,
  ay: number,
  bx: number,
  by: number,
) => {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
};

export const selectFotonThreat = (
  enemies: readonly Enemy[],
  playerX: number,
  playerY: number,
  currentTargetId: string | null,
  maxRange = FOTON_THREAT_MAX_RANGE,
): FotonThreatSelection | null => {
  let boss: Enemy | null = null;
  let current: Enemy | null = null;
  let nearest: Enemy | null = null;
  let nearestDistanceSquared = Number.POSITIVE_INFINITY;
  const maxRangeSquared = maxRange * maxRange;

  for (const enemy of enemies) {
    if (enemy.isDead) continue;

    if (enemy.isBoss) {
      boss = enemy;
      break;
    }

    const d2 = distanceSquared(
      enemy.x,
      enemy.y,
      playerX,
      playerY,
    );

    if (enemy.id === currentTargetId) {
      current = enemy;
    }

    if (
      d2 < maxRangeSquared &&
      d2 < nearestDistanceSquared
    ) {
      nearest = enemy;
      nearestDistanceSquared = d2;
    }
  }

  if (boss) {
    return {
      id: boss.id,
      x: boss.x,
      y: boss.y,
      isBoss: true,
    };
  }

  if (!nearest) {
    return null;
  }

  if (current) {
    const currentDistanceSquared = distanceSquared(
      current.x,
      current.y,
      playerX,
      playerY,
    );
    const retainThresholdSquared =
      nearestDistanceSquared *
      RETAIN_DISTANCE_RATIO *
      RETAIN_DISTANCE_RATIO;

    if (
      currentDistanceSquared <= maxRangeSquared &&
      currentDistanceSquared <= retainThresholdSquared
    ) {
      return {
        id: current.id,
        x: current.x,
        y: current.y,
        isBoss: false,
      };
    }
  }

  return {
    id: nearest.id,
    x: nearest.x,
    y: nearest.y,
    isBoss: false,
  };
};

export const projectFotonThreatDirection = (
  playerX: number,
  playerY: number,
  threat: FotonThreatSelection | null,
): FotonThreatDirection | null => {
  if (!threat) return null;

  const dx = threat.x - playerX;
  const dy = threat.y - playerY;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared <= 0.0001) {
    return null;
  }

  const invLength = 1 / Math.sqrt(lengthSquared);
  return {
    x: dx * invLength,
    y: dy * invLength,
  };
};
