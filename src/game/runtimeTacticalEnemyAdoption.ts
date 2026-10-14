import { getTacticalEnemyFamilyProfileById } from "./tacticalEnemyFamilies";
import { EnemyType } from "./types";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";

export const J4B_TACTICAL_MIN_INFINITE_SECTOR = 26;
export const J4B_TACTICAL_SECTOR_CADENCE = 4;
export const J4B_TACTICAL_SECTOR_OFFSET = 10;
export const J4B_LIVE_FAMILY_ID = "WARP_AMBUSHER" as const;

export type RuntimeTacticalEnemyAdoptionDisabledReason =
  | "CAMPAIGN_DISABLED"
  | "BELOW_MIN_SECTOR"
  | "MILESTONE_SECTOR"
  | "RECOVERY_SECTOR"
  | "OFF_CADENCE"
  | "NON_FINAL_WAVE"
  | "MILESTONE_WAVE"
  | "INSUFFICIENT_BUDGET";

export interface RuntimeTacticalEnemyAdoptionPolicy {
  sourceMode: RuntimeWaveDescriptor["sourceMode"];
  enabled: boolean;
  familyId: typeof J4B_LIVE_FAMILY_ID | null;
  enemyType: EnemyType | null;
  triggerSpawnOrdinal: number | null;
  disabledReason: RuntimeTacticalEnemyAdoptionDisabledReason | null;
}

export interface RuntimeTacticalEnemySpawnInput {
  descriptor: RuntimeWaveDescriptor;
  spawnOrdinal: number;
}

const WARP_AMBUSHER_PROFILE =
  getTacticalEnemyFamilyProfileById(J4B_LIVE_FAMILY_ID);

if (
  !WARP_AMBUSHER_PROFILE ||
  WARP_AMBUSHER_PROFILE.enemyType !== EnemyType.RIFT_HUNTER
) {
  throw new Error("J4B requires the certified Warp Ambusher family contract.");
}

export const isRuntimeTacticalRecoverySector = (sector: number): boolean =>
  Number.isInteger(sector) &&
  sector > 11 &&
  (sector - 1) % 25 === 0;

export const isRuntimeTacticalCadenceSector = (sector: number): boolean =>
  Number.isInteger(sector) &&
  sector >= J4B_TACTICAL_MIN_INFINITE_SECTOR &&
  (sector - J4B_TACTICAL_SECTOR_OFFSET) %
    J4B_TACTICAL_SECTOR_CADENCE ===
    0;

const disabledPolicy = (
  descriptor: RuntimeWaveDescriptor,
  disabledReason: RuntimeTacticalEnemyAdoptionDisabledReason,
): RuntimeTacticalEnemyAdoptionPolicy => ({
  sourceMode: descriptor.sourceMode,
  enabled: false,
  familyId: null,
  enemyType: null,
  triggerSpawnOrdinal: null,
  disabledReason,
});

export const getRuntimeTacticalEnemyAdoptionPolicy = (
  descriptor: RuntimeWaveDescriptor,
): RuntimeTacticalEnemyAdoptionPolicy => {
  if (descriptor.sourceMode !== "INFINITE") {
    return disabledPolicy(descriptor, "CAMPAIGN_DISABLED");
  }

  if (descriptor.sector < J4B_TACTICAL_MIN_INFINITE_SECTOR) {
    return disabledPolicy(descriptor, "BELOW_MIN_SECTOR");
  }

  if (descriptor.sector % 5 === 0) {
    return disabledPolicy(descriptor, "MILESTONE_SECTOR");
  }

  if (isRuntimeTacticalRecoverySector(descriptor.sector)) {
    return disabledPolicy(descriptor, "RECOVERY_SECTOR");
  }

  if (!isRuntimeTacticalCadenceSector(descriptor.sector)) {
    return disabledPolicy(descriptor, "OFF_CADENCE");
  }

  if (descriptor.waveNumber !== descriptor.waveCount) {
    return disabledPolicy(descriptor, "NON_FINAL_WAVE");
  }

  if (descriptor.milestone !== null) {
    return disabledPolicy(descriptor, "MILESTONE_WAVE");
  }

  if (
    !Number.isInteger(descriptor.spawn.enemyBudget) ||
    descriptor.spawn.enemyBudget < 3
  ) {
    return disabledPolicy(descriptor, "INSUFFICIENT_BUDGET");
  }

  return {
    sourceMode: "INFINITE",
    enabled: true,
    familyId: J4B_LIVE_FAMILY_ID,
    enemyType: WARP_AMBUSHER_PROFILE.enemyType,
    triggerSpawnOrdinal: Math.floor(descriptor.spawn.enemyBudget / 2),
    disabledReason: null,
  };
};

export const resolveRuntimeTacticalEnemySpawn = (
  input: RuntimeTacticalEnemySpawnInput,
): EnemyType | null => {
  if (!Number.isInteger(input.spawnOrdinal) || input.spawnOrdinal < 0) {
    return null;
  }

  const policy = getRuntimeTacticalEnemyAdoptionPolicy(input.descriptor);

  if (
    !policy.enabled ||
    policy.enemyType === null ||
    policy.triggerSpawnOrdinal === null ||
    input.spawnOrdinal !== policy.triggerSpawnOrdinal
  ) {
    return null;
  }

  return policy.enemyType;
};
