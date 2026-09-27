import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";

export interface RuntimeCompletionSnapshot {
  remainingTimeMs: number;
  spawnedEnemyCount: number;
  livingEnemyCount: number;
  bossDefeated: boolean;
}

const nonNegativeFinite = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export const isRuntimeWaveComplete = (
  descriptor: RuntimeWaveDescriptor,
  snapshot: RuntimeCompletionSnapshot,
) => {
  switch (descriptor.completionPolicy.type) {
    case "TIMEBOX":
      return snapshot.remainingTimeMs <= 0;

    case "BOSS_DEFEAT":
      return snapshot.bossDefeated;

    case "BUDGET_AND_CLEAR": {
      const spawnedEnemyCount = Math.floor(
        nonNegativeFinite(snapshot.spawnedEnemyCount),
      );
      const livingEnemyCount = Math.floor(
        nonNegativeFinite(snapshot.livingEnemyCount),
      );

      return (
        spawnedEnemyCount >= descriptor.spawn.enemyBudget &&
        livingEnemyCount === 0
      );
    }
  }
};

export const shouldTickRuntimeTimer = (
  descriptor: RuntimeWaveDescriptor,
) => descriptor.completionPolicy.type === "TIMEBOX";
