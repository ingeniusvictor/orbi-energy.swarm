import { EnemyType } from "./types";
import type { RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";

export type InfiniteMilestoneEncounterProfile =
  | {
      kind: "MINIBOSS";
      milestoneId: string;
      sector: number;
      waveNumber: number;
      spawnTrigger: "REPLACE_FINAL_BUDGET_SLOT";
      completionMode: "BUDGET_AND_CLEAR";
      enemyType: EnemyType.BLACKOUT_ELITE;
      healthMultiplier: number;
      movementSpeedMultiplier: number;
      contactDamageMultiplier: number;
      sizeMultiplier: number;
      rewardMultiplier: number;
      telegraphMs: number;
      campaignTelemetryMode: "ISOLATED";
    }
  | {
      kind: "BOSS_REMATCH";
      milestoneId: string;
      sector: number;
      waveNumber: number;
      spawnTrigger: "AFTER_REGULAR_BUDGET_CLEAR";
      completionMode: "BOSS_DEFEAT_AFTER_BUDGET";
      enemyType: EnemyType.BOSS_DEVOURER;
      healthMultiplier: number;
      damageMultiplier: number;
      attackRateMultiplier: number;
      rewardMultiplier: number;
      telegraphMs: number;
      campaignTelemetryMode: "ISOLATED";
      campaignVictoryCheckpoint: false;
    };

const clamp = (
  value: number,
  min: number,
  max: number,
) => Math.min(max, Math.max(min, value));

const round = (value: number, digits = 3) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export const projectInfiniteMilestoneEncounter = (
  descriptor: RuntimeWaveDescriptor,
): InfiniteMilestoneEncounterProfile | null => {
  if (
    descriptor.sourceMode !== "INFINITE" ||
    !descriptor.milestone ||
    descriptor.waveNumber !== descriptor.waveCount
  ) {
    return null;
  }

  const fairnessTelegraphMs =
    descriptor.fairness?.minTelegraphMs ?? 0;

  if (descriptor.milestone.kind === "MINIBOSS") {
    const progression =
      Math.log2(Math.max(1, descriptor.sector / 5));

    return {
      kind: "MINIBOSS",
      milestoneId: descriptor.milestone.id,
      sector: descriptor.sector,
      waveNumber: descriptor.waveNumber,
      spawnTrigger: "REPLACE_FINAL_BUDGET_SLOT",
      completionMode: "BUDGET_AND_CLEAR",
      enemyType: EnemyType.BLACKOUT_ELITE,
      healthMultiplier: round(
        clamp(2.4 + progression * 0.18, 2.4, 4),
      ),
      movementSpeedMultiplier: round(
        clamp(1.04 + progression * 0.015, 1.04, 1.2),
      ),
      contactDamageMultiplier: round(
        clamp(1.3 + progression * 0.025, 1.3, 1.55),
      ),
      sizeMultiplier: round(
        clamp(1.5 + progression * 0.02, 1.5, 1.75),
      ),
      rewardMultiplier: round(
        clamp(1.5 + progression * 0.08, 1.5, 2.25),
      ),
      telegraphMs: Math.max(
        1300,
        fairnessTelegraphMs,
      ),
      campaignTelemetryMode: "ISOLATED",
    };
  }

  if (descriptor.milestone.kind === "BOSS_REMATCH") {
    const progression =
      Math.log2(Math.max(1, descriptor.sector / 25));

    return {
      kind: "BOSS_REMATCH",
      milestoneId: descriptor.milestone.id,
      sector: descriptor.sector,
      waveNumber: descriptor.waveNumber,
      spawnTrigger: "AFTER_REGULAR_BUDGET_CLEAR",
      completionMode: "BOSS_DEFEAT_AFTER_BUDGET",
      enemyType: EnemyType.BOSS_DEVOURER,
      healthMultiplier: round(
        clamp(1.2 + progression * 0.16, 1.2, 2.25),
      ),
      damageMultiplier: round(
        clamp(1.1 + progression * 0.09, 1.1, 1.7),
      ),
      attackRateMultiplier: round(
        clamp(1.05 + progression * 0.07, 1.05, 1.5),
      ),
      rewardMultiplier: round(
        clamp(2.5 + progression * 0.18, 2.5, 4),
      ),
      telegraphMs: Math.max(
        2200,
        fairnessTelegraphMs,
      ),
      campaignTelemetryMode: "ISOLATED",
      campaignVictoryCheckpoint: false,
    };
  }

  return null;
};
