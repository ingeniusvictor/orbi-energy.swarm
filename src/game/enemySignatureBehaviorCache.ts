import type { Enemy } from "./types";
import {
  projectEvolvedSignatureBehavior,
  type EvolvedSignatureBehavior,
} from "./runtimeEnemySignatureBehavior";

export interface EnemySignatureBehaviorCache {
  get: (enemy: Enemy) => EvolvedSignatureBehavior;
}

export const createEnemySignatureBehaviorCache = (
  projector: (
    signature: Enemy["evolvedSignature"],
    intensity: Enemy["evolvedSpecialIntensity"],
  ) => EvolvedSignatureBehavior =
    projectEvolvedSignatureBehavior,
): EnemySignatureBehaviorCache => {
  const cache = new WeakMap<
    Enemy,
    EvolvedSignatureBehavior
  >();

  return {
    get(enemy) {
      const cached = cache.get(enemy);
      if (cached) {
        return cached;
      }

      const behavior = projector(
        enemy.evolvedSignature,
        enemy.evolvedSpecialIntensity,
      );
      cache.set(enemy, behavior);
      return behavior;
    },
  };
};
