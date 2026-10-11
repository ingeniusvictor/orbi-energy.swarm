import { EnemyType, type BossChassisId, type BossEncounterStage } from "./types";

export const TITAN_RAID_INTERVAL = 200;
export const TITAN_RAID_FIRST_SECTOR = 200;

export interface InfiniteRaidEscalationProfile {
  chassis: Extract<BossChassisId, "TITAN_CORE">;
  stage: Extract<BossEncounterStage, "RAID_ESCALATION">;
  enemyType: EnemyType.BOSS_TITAN;
  healthMultiplier: number;
  damageMultiplier: number;
  attackRateMultiplier: number;
  rewardMultiplier: number;
  telegraphMs: number;
}

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

export const projectTitanRaidEscalation = (
  sector: number,
  fairnessTelegraphMs = 0,
): InfiniteRaidEscalationProfile | null => {
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
