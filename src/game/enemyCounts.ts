import { EnemyType, type Enemy } from "./types";

export const countLivingStandardEnemies = (
  enemies: readonly Enemy[],
) => {
  let count = 0;
  for (const enemy of enemies) {
    if (!enemy.isDead && !enemy.isBoss) {
      count += 1;
    }
  }
  return count;
};

export const countActiveEvolvedEnemies = (
  enemies: readonly Enemy[],
) => {
  let count = 0;
  for (const enemy of enemies) {
    if (
      !enemy.isDead &&
      !enemy.isBoss &&
      Boolean(enemy.evolvedVariantId)
    ) {
      count += 1;
    }
  }
  return count;
};

export const countMinionsOfType = (
  enemies: readonly Enemy[],
  enemyType: EnemyType,
) => {
  let count = 0;
  for (const enemy of enemies) {
    if (
      enemy.type === enemyType &&
      enemy.isMinion
    ) {
      count += 1;
    }
  }
  return count;
};

export const countLivingEnemies = (
  enemies: readonly Enemy[],
) => {
  let count = 0;
  for (const enemy of enemies) {
    if (!enemy.isDead) {
      count += 1;
    }
  }
  return count;
};
