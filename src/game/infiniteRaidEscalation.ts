import { EnemyType, type BossChassisId, type BossEncounterStage } from "./types";

export const TITAN_RAID_INTERVAL = 200;
export const TITAN_RAID_FIRST_SECTOR = 200;
export const WORM_RAID_INTERVAL = 200;
export const WORM_RAID_FIRST_SECTOR = 300;

interface InfiniteRaidEscalationBase {
  stage: Extract<BossEncounterStage, "RAID_ESCALATION">;
  healthMultiplier: number;
  damageMultiplier: number;
  attackRateMultiplier: number;
  rewardMultiplier: number;
  telegraphMs: number;
}

export interface TitanRaidEscalationProfile extends InfiniteRaidEscalationBase {
  chassis: Extract<BossChassisId, "TITAN_CORE">;
  enemyType: EnemyType.BOSS_TITAN;
}

export interface WormRaidEscalationProfile extends InfiniteRaidEscalationBase {
  chassis: Extract<BossChassisId, "WORM_SEGMENTS">;
  enemyType: EnemyType.BOSS_WORM;
}

export type InfiniteRaidEscalationProfile =
  | TitanRaidEscalationProfile
  | WormRaidEscalationProfile;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const round = (value: number, digits = 3) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export const hasTitanRaidEscalation = (sector: number) =>
  Number.isInteger(sector) &&
  sector >= TITAN_RAID_FIRST_SECTOR &&
  sector % TITAN_RAID_INTERVAL === 0;

export const hasWormRaidEscalation = (sector: number) =>
  Number.isInteger(sector) &&
  sector >= WORM_RAID_FIRST_SECTOR &&
  (sector - WORM_RAID_FIRST_SECTOR) % WORM_RAID_INTERVAL === 0;

export const projectTitanRaidEscalation = (
  sector: number,
  fairnessTelegraphMs = 0,
): TitanRaidEscalationProfile | null => {
  if (!hasTitanRaidEscalation(sector)) return null;

  const progression = Math.log2(Math.max(1, sector / TITAN_RAID_FIRST_SECTOR));

  return {
    chassis: "TITAN_CORE",
    stage: "RAID_ESCALATION",
    enemyType: EnemyType.BOSS_TITAN,
    healthMultiplier: round(clamp(1 + progression * 0.12, 1, 1.6)),
    damageMultiplier: round(clamp(1.12 + progression * 0.07, 1.12, 1.55)),
    attackRateMultiplier: round(clamp(1.05 + progression * 0.05, 1.05, 1.35)),
    rewardMultiplier: round(clamp(2 + progression * 0.2, 2, 3)),
    telegraphMs: Math.max(2600, fairnessTelegraphMs),
  };
};

export const projectWormRaidEscalation = (
  sector: number,
  fairnessTelegraphMs = 0,
): WormRaidEscalationProfile | null => {
  if (!hasWormRaidEscalation(sector)) return null;

  const progression = Math.log2(Math.max(1, sector / WORM_RAID_FIRST_SECTOR));

  return {
    chassis: "WORM_SEGMENTS",
    stage: "RAID_ESCALATION",
    enemyType: EnemyType.BOSS_WORM,
    healthMultiplier: round(clamp(1 + progression * 0.1, 1, 1.5)),
    damageMultiplier: round(clamp(1.08 + progression * 0.065, 1.08, 1.48)),
    attackRateMultiplier: round(clamp(1.08 + progression * 0.045, 1.08, 1.34)),
    rewardMultiplier: round(clamp(1.85 + progression * 0.18, 1.85, 2.8)),
    telegraphMs: Math.max(2500, fairnessTelegraphMs),
  };
};

export const projectInfiniteRaidEscalation = (
  sector: number,
  fairnessTelegraphMs = 0,
): InfiniteRaidEscalationProfile | null =>
  projectTitanRaidEscalation(sector, fairnessTelegraphMs) ??
  projectWormRaidEscalation(sector, fairnessTelegraphMs);

export type BossRematchDefeatAction =
  | "SPAWN_RAID_ESCALATION"
  | "RESOLVE_GATE";

export const resolveBossRematchDefeatAction = (
  stage: BossEncounterStage | undefined,
  raidEscalation: InfiniteRaidEscalationProfile | null | undefined,
): BossRematchDefeatAction =>
  (stage ?? "PRIMARY") === "PRIMARY" && raidEscalation
    ? "SPAWN_RAID_ESCALATION"
    : "RESOLVE_GATE";
