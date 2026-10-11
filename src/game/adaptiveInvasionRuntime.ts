import { MAX_ENEMIES, MAX_PROJECTILES } from "./constants";
import { EnemyType } from "./types";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";
import {
  projectAdaptiveInvasion,
  type H4HostileArchetypeId,
} from "./adaptiveInvasion";

const H4_ARCHETYPE_TO_ENEMY: Readonly<
  Record<H4HostileArchetypeId, EnemyType>
> = Object.freeze({
  RIFT_HUNTER: EnemyType.RIFT_HUNTER,
  SIEGE_PRISM: EnemyType.SIEGE_PRISM,
  SWARM_REAVER: EnemyType.SWARM_REAVER,
  VOID_ANCHOR: EnemyType.VOID_ANCHOR,
  MINE_WEAVER: EnemyType.MINE_WEAVER,
  MIRROR_WARDEN: EnemyType.MIRROR_WARDEN,
});

const unique = <T>(values: readonly T[]) => [...new Set(values)];

/**
 * Converts the pure H4 pressure projection into one immutable runtime
 * descriptor. The projection is evaluated once per runtime-wave state and
 * thereafter consumed through the existing projection cache.
 */
export const applyAdaptiveInvasionToDescriptor = (
  descriptor: RuntimeWaveDescriptor,
  liveFollowerCount: number,
): RuntimeWaveDescriptor => {
  if (descriptor.sourceMode !== "INFINITE") return descriptor;

  const projection = projectAdaptiveInvasion(
    descriptor.sector,
    descriptor.waveNumber,
    liveFollowerCount,
    descriptor.source.seed ?? "orbi-h4-runtime",
  );

  const archetypeCount = Math.min(
    projection.unlockedArchetypes.length,
    projection.pressureRank >= 8 ? 3 : projection.pressureRank >= 5 ? 2 : 1,
  );
  const h4Enemies = projection.unlockedArchetypes
    .slice(-archetypeCount)
    .map((id) => H4_ARCHETYPE_TO_ENEMY[id]);
  const enemyComposition = unique([
    ...descriptor.spawn.enemyComposition,
    ...h4Enemies,
  ]);

  const swarmPressure = Math.max(0, Math.min(1, (liveFollowerCount - 10) / 20));
  const budgetMultiplier =
    projection.event?.recovery
      ? 0.88
      : Math.min(
          1.85,
          1 + projection.pressureRank * 0.055 + swarmPressure * 0.22,
        );
  const enemyBudget = Math.max(
    1,
    Math.round(descriptor.spawn.enemyBudget * budgetMultiplier),
  );
  const maxConcurrentEnemies = Math.max(
    8,
    Math.min(
      MAX_ENEMIES,
      descriptor.spawn.maxConcurrentEnemies + projection.concurrentEnemyBonus,
    ),
  );
  const spawnIntervalFrames = Math.max(
    20,
    Math.round(
      descriptor.spawn.spawnIntervalFrames * projection.spawnIntervalMultiplier,
    ),
  );

  const eventModifier = projection.event
    ? `H4_EVENT_${projection.event.id}`
    : null;

  return {
    ...descriptor,
    descriptorId: `${descriptor.descriptorId}:h4:${liveFollowerCount}`,
    display: {
      ...descriptor.display,
      description: projection.event
        ? `${descriptor.display.description} Survival event: ${projection.event.displayName}.`
        : descriptor.display.description,
      tacticalAdvice:
        projection.unlockedArchetypes.length > 0
          ? "Keep moving, prioritize specialist threats, and change formation before telegraphed control patterns overlap."
          : descriptor.display.tacticalAdvice,
    },
    spawn: {
      ...descriptor.spawn,
      enemyBudget,
      maxConcurrentEnemies,
      spawnIntervalFrames,
      enemyComposition,
    },
    modifiers: eventModifier
      ? unique([...descriptor.modifiers, eventModifier])
      : descriptor.modifiers,
    pressure: {
      ...descriptor.pressure,
      aggressionMultiplier: Math.min(
        2.5,
        descriptor.pressure.aggressionMultiplier *
          projection.attackRateMultiplier,
      ),
      projectileDensityMultiplier: Math.min(
        2.5,
        descriptor.pressure.projectileDensityMultiplier *
          projection.projectileDensityMultiplier,
      ),
    },
    fairness: descriptor.fairness
      ? {
          ...descriptor.fairness,
          minTelegraphMs: Math.max(
            descriptor.fairness.minTelegraphMs,
            projection.event?.telegraphMs ?? 900,
          ),
          maxSimultaneousHardControlSources: Math.min(
            2,
            Math.max(
              descriptor.fairness.maxSimultaneousHardControlSources,
              projection.event?.hardControlSources ?? 0,
            ),
          ),
          projectileBudget: Math.min(
            MAX_PROJECTILES,
            descriptor.fairness.projectileBudget,
          ),
        }
      : descriptor.fairness,
  };
};
