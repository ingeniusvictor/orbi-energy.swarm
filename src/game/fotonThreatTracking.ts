import {
  findNearestSpatialItem,
  type SpatialIndex,
} from "./spatialIndex";
import type { Enemy } from "./types";

export interface FotonThreatSelection {
  id: string;
  x: number;
  y: number;
  isBoss: boolean;
  enemy?: Enemy;
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

const toSelection = (
  enemy: Enemy,
): FotonThreatSelection => ({
  id: enemy.id,
  x: enemy.x,
  y: enemy.y,
  isBoss: enemy.isBoss,
  enemy,
});

export const selectFotonThreat = (
  enemyIndex: SpatialIndex<Enemy>,
  boss: Enemy | null,
  playerX: number,
  playerY: number,
  currentTarget: Enemy | null,
  maxRange = FOTON_THREAT_MAX_RANGE,
): FotonThreatSelection | null => {
  if (boss && !boss.isDead) {
    return toSelection(boss);
  }

  const nearest = findNearestSpatialItem(
    enemyIndex,
    playerX,
    playerY,
    maxRange,
    (enemy) => !enemy.isDead && !enemy.isBoss,
  );

  if (!nearest.item) {
    return null;
  }

  if (
    currentTarget &&
    !currentTarget.isDead &&
    !currentTarget.isBoss
  ) {
    const currentDistanceSquared = distanceSquared(
      currentTarget.x,
      currentTarget.y,
      playerX,
      playerY,
    );
    const maxRangeSquared = maxRange * maxRange;
    const retainThresholdSquared =
      nearest.distanceSquared *
      RETAIN_DISTANCE_RATIO *
      RETAIN_DISTANCE_RATIO;

    if (
      currentDistanceSquared < maxRangeSquared &&
      currentDistanceSquared <= retainThresholdSquared
    ) {
      return toSelection(currentTarget);
    }
  }

  return toSelection(nearest.item);
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
