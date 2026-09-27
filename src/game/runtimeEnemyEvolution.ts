import {
  getInfiniteProgressionTier,
  type InfiniteProgressionTier,
} from "./infiniteSectorDirector";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";
import {
  EnemyType,
  type EvolvedEnemySignature,
  type EvolvedEnemyVariantId,
} from "./types";

export type {
  EvolvedEnemySignature,
  EvolvedEnemyVariantId,
} from "./types";

export interface EvolvedEnemyVariantProfile {
  id: EvolvedEnemyVariantId;
  baseEnemyType: EnemyType;
  displayName: string;
  signature: EvolvedEnemySignature;
  healthMultiplier: number;
  movementSpeedMultiplier: number;
  contactDamageMultiplier: number;
  attackRateMultiplier: number;
  projectileSpeedMultiplier: number;
  specialIntensity: number;
  rewardMultiplier: number;
}

export interface RuntimeEnemyEvolutionPolicy {
  sourceMode: RuntimeWaveDescriptor["sourceMode"];
  tier: InfiniteProgressionTier | null;
  enabled: boolean;
  evolutionChance: number;
  maxConcurrentEvolvedEnemies: number;
  eligibleEnemyTypes: readonly EnemyType[];
}

export interface RuntimeEnemyEvolutionSpawnInput {
  descriptor: RuntimeWaveDescriptor;
  enemyType: EnemyType;
  spawnOrdinal: number;
  activeEvolvedEnemies: number;
}

const ELIGIBLE_EVOLUTION_ENEMIES = [
  EnemyType.CRAWLER,
  EnemyType.PARASITE,
  EnemyType.DRONE,
  EnemyType.SPLITTER,
  EnemyType.DISRUPTOR,
] as const;

export const EVOLVED_ENEMY_VARIANTS: Readonly<
  Partial<Record<EnemyType, EvolvedEnemyVariantProfile>>
> = Object.freeze({
  [EnemyType.CRAWLER]: Object.freeze({
    id: "BULWARK_CRAWLER",
    baseEnemyType: EnemyType.CRAWLER,
    displayName: "Bulwark Crawler",
    signature: "ARMORED_MOMENTUM",
    healthMultiplier: 1.45,
    movementSpeedMultiplier: 0.86,
    contactDamageMultiplier: 1.2,
    attackRateMultiplier: 1,
    projectileSpeedMultiplier: 1,
    specialIntensity: 0.35,
    rewardMultiplier: 1.35,
  }),
  [EnemyType.PARASITE]: Object.freeze({
    id: "PHASE_PARASITE",
    baseEnemyType: EnemyType.PARASITE,
    displayName: "Phase Parasite",
    signature: "PHASE_LUNGE",
    healthMultiplier: 1.1,
    movementSpeedMultiplier: 1.18,
    contactDamageMultiplier: 1.1,
    attackRateMultiplier: 1,
    projectileSpeedMultiplier: 1,
    specialIntensity: 0.3,
    rewardMultiplier: 1.3,
  }),
  [EnemyType.DRONE]: Object.freeze({
    id: "LANCE_DRONE",
    baseEnemyType: EnemyType.DRONE,
    displayName: "Lance Drone",
    signature: "LANCE_VOLLEY",
    healthMultiplier: 1.12,
    movementSpeedMultiplier: 0.95,
    contactDamageMultiplier: 1,
    attackRateMultiplier: 1.12,
    projectileSpeedMultiplier: 1.25,
    specialIntensity: 0.4,
    rewardMultiplier: 1.35,
  }),
  [EnemyType.SPLITTER]: Object.freeze({
    id: "BROOD_SPLITTER",
    baseEnemyType: EnemyType.SPLITTER,
    displayName: "Brood Splitter",
    signature: "BROOD_RELEASE",
    healthMultiplier: 1.2,
    movementSpeedMultiplier: 0.95,
    contactDamageMultiplier: 1.1,
    attackRateMultiplier: 1,
    projectileSpeedMultiplier: 1,
    specialIntensity: 0.5,
    rewardMultiplier: 1.4,
  }),
  [EnemyType.DISRUPTOR]: Object.freeze({
    id: "NULL_DISRUPTOR",
    baseEnemyType: EnemyType.DISRUPTOR,
    displayName: "Null Disruptor",
    signature: "NULL_PULSE",
    healthMultiplier: 1.18,
    movementSpeedMultiplier: 1,
    contactDamageMultiplier: 1.05,
    attackRateMultiplier: 1.15,
    projectileSpeedMultiplier: 1.1,
    specialIntensity: 0.45,
    rewardMultiplier: 1.4,
  }),
});

const TIER_POLICY: Readonly<
  Record<
    InfiniteProgressionTier,
    Pick<
      RuntimeEnemyEvolutionPolicy,
      "enabled" | "evolutionChance" | "maxConcurrentEvolvedEnemies"
    >
  >
> = Object.freeze({
  MASTERY: Object.freeze({
    enabled: false,
    evolutionChance: 0,
    maxConcurrentEvolvedEnemies: 0,
  }),
  ADVANCED_COMBINATION: Object.freeze({
    enabled: true,
    evolutionChance: 0.12,
    maxConcurrentEvolvedEnemies: 1,
  }),
  HIGH_PRESSURE: Object.freeze({
    enabled: true,
    evolutionChance: 0.2,
    maxConcurrentEvolvedEnemies: 2,
  }),
  ENDLESS_ENDGAME: Object.freeze({
    enabled: true,
    evolutionChance: 0.28,
    maxConcurrentEvolvedEnemies: 3,
  }),
});

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const deterministicUnitInterval = (value: string) =>
  hashString(value) / 4294967296;

const isValidSpawnOrdinal = (value: number) =>
  Number.isInteger(value) && value >= 0;

const normalizeActiveEvolvedEnemies = (value: number) =>
  Number.isInteger(value) && value >= 0 ? value : null;

export const getRuntimeEnemyEvolutionPolicy = (
  descriptor: RuntimeWaveDescriptor,
): RuntimeEnemyEvolutionPolicy => {
  if (descriptor.sourceMode !== "INFINITE") {
    return {
      sourceMode: "CAMPAIGN",
      tier: null,
      enabled: false,
      evolutionChance: 0,
      maxConcurrentEvolvedEnemies: 0,
      eligibleEnemyTypes: [],
    };
  }

  const tier = getInfiniteProgressionTier(descriptor.sector);
  const tierPolicy = TIER_POLICY[tier];

  return {
    sourceMode: "INFINITE",
    tier,
    ...tierPolicy,
    eligibleEnemyTypes: tierPolicy.enabled
      ? ELIGIBLE_EVOLUTION_ENEMIES
      : [],
  };
};

export const selectEvolvedEnemyVariant = (
  descriptor: RuntimeWaveDescriptor,
  enemyType: EnemyType,
  spawnOrdinal: number,
): EvolvedEnemyVariantProfile | null => {
  const policy = getRuntimeEnemyEvolutionPolicy(descriptor);

  if (
    !policy.enabled ||
    !isValidSpawnOrdinal(spawnOrdinal) ||
    !policy.eligibleEnemyTypes.includes(enemyType)
  ) {
    return null;
  }

  const profile = EVOLVED_ENEMY_VARIANTS[enemyType];
  if (!profile) {
    return null;
  }

  const roll = deterministicUnitInterval(
    [
      descriptor.descriptorId,
      descriptor.source.seed ?? "no-seed",
      descriptor.sector,
      descriptor.waveNumber,
      enemyType,
      spawnOrdinal,
      "enemy-evolution",
    ].join(":"),
  );

  return roll < policy.evolutionChance ? profile : null;
};

export const resolveEvolvedEnemySpawn = (
  input: RuntimeEnemyEvolutionSpawnInput,
): EvolvedEnemyVariantProfile | null => {
  const policy = getRuntimeEnemyEvolutionPolicy(input.descriptor);
  const activeEvolvedEnemies = normalizeActiveEvolvedEnemies(
    input.activeEvolvedEnemies,
  );

  if (
    !policy.enabled ||
    activeEvolvedEnemies === null ||
    activeEvolvedEnemies >= policy.maxConcurrentEvolvedEnemies
  ) {
    return null;
  }

  return selectEvolvedEnemyVariant(
    input.descriptor,
    input.enemyType,
    input.spawnOrdinal,
  );
};
