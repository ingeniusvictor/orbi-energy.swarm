import type { Enemy } from "./types";
import {
  projectEvolvedSignatureBehavior,
  type EvolvedSignatureBehavior,
} from "./runtimeEnemySignatureBehavior";

export type EnemySignatureBehaviorCache = WeakMap<
  Enemy,
  EvolvedSignatureBehavior
>;

export const createEnemySignatureBehaviorCache =
  (): EnemySignatureBehaviorCache =>
    new WeakMap<Enemy, EvolvedSignatureBehavior>();

export const getCachedEvolvedSignatureBehavior = (
  cache: EnemySignatureBehaviorCache,
  enemy: Enemy,
): EvolvedSignatureBehavior => {
  const cached = cache.get(enemy);
  if (cached) {
    return cached;
  }

  const projected = projectEvolvedSignatureBehavior(
    enemy.evolvedSignature,
    enemy.evolvedSpecialIntensity,
  );
  cache.set(enemy, projected);
  return projected;
};
