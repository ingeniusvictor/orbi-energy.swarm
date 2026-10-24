import type { OrbiEnergyId } from "./types";

/**
 * EVO8 v0.2 — deterministic energy-matching evolution contract.
 *
 * ENERGY is the neutral protagonist (never a collectible energy).
 * FOTON names the independent photovoltaic collectible energy.
 *
 * Pure and side-effect free: no combat, stats, RNG, input, storage or rendering
 * is modified by importing these helpers.
 */
export const ORBI_MAX_EVOLUTION_LEVEL = 8 as const;
export const ORBI_FINAL_FORM_TOTAL_ACQUISITIONS = 29 as const;

export type OrbiEvolutionLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type OrbiVisualStage = 1 | 2 | 3 | 4;

export const EVO8_COLLECTIBLE_ENERGIES: readonly OrbiEnergyId[] = [
  "HYDRO", "AERO", "TERMO", "MAGNE", "ATON",
  "KINETRIX", "H2NOVA", "QUANTUM", "FOTON",
] as const;

export interface OrbiEvolutionProgress {
  energyId: OrbiEnergyId;
  level: OrbiEvolutionLevel;
  /** Matching acquisitions made AFTER the last level-up. */
  matchingCoresAtLevel: number;
}

export interface OrbiEvolutionUpdate {
  progress: OrbiEvolutionProgress;
  matched: boolean;
  levelUp: boolean;
  capped: boolean;
  visualStageChanged: boolean;
}

const asLevel = (n: number): OrbiEvolutionLevel =>
  Math.max(1, Math.min(ORBI_MAX_EVOLUTION_LEVEL, Math.floor(Number.isFinite(n) ? n : 1))) as OrbiEvolutionLevel;

/** E1 is the first acquisition, followed by the triangular 1+2+...+7 rule. */
export const acquisitionsForLevel = (level: number): number => {
  const safe = asLevel(level);
  return 1 + ((safe - 1) * safe) / 2;
};

export const coresUntilNextLevel = (progress: OrbiEvolutionProgress): number =>
  progress.level === ORBI_MAX_EVOLUTION_LEVEL
    ? 0
    : progress.level - progress.matchingCoresAtLevel;

/** Full-body art only changes at E1 / E3 / E5 / E8. */
export const getEvo8VisualStage = (level: number): OrbiVisualStage => {
  const safe = asLevel(level);
  return safe >= 8 ? 4 : safe >= 5 ? 3 : safe >= 3 ? 2 : 1;
};

/** E6, E7 and E8 gain 2, 4 and 6 extra wings, respectively. */
export const getEvo8WingCount = (level: number): 0 | 2 | 4 | 6 => {
  const safe = asLevel(level);
  return safe >= 8 ? 6 : safe === 7 ? 4 : safe === 6 ? 2 : 0;
};

/** Sanitizes legacy or saved progress without minting levels beyond E8. */
export const normalizeOrbiEvolutionProgress = (progress: OrbiEvolutionProgress): OrbiEvolutionProgress => {
  const level = asLevel(progress.level);
  const cores = Number.isFinite(progress.matchingCoresAtLevel) ? Math.floor(progress.matchingCoresAtLevel) : 0;
  return {
    energyId: progress.energyId,
    level,
    matchingCoresAtLevel: level === 8 ? 0 : Math.max(0, Math.min(level - 1, cores)),
  };
};

export const createOrbiEvolutionProgress = (energyId: OrbiEnergyId): OrbiEvolutionProgress => ({
  energyId,
  level: 1,
  matchingCoresAtLevel: 0,
});

/** Never consolidate HYDRO into AERO, and never evolve an E8 past the cap. */
export const applyMatchingEnergyCore = (
  previous: OrbiEvolutionProgress,
  acquiredEnergyId: OrbiEnergyId,
): OrbiEvolutionUpdate => {
  const current = normalizeOrbiEvolutionProgress(previous);
  if (acquiredEnergyId !== current.energyId || !EVO8_COLLECTIBLE_ENERGIES.includes(current.energyId)) {
    return { progress: current, matched: false, levelUp: false, capped: current.level === 8, visualStageChanged: false };
  }
  if (current.level === 8) {
    return { progress: current, matched: true, levelUp: false, capped: true, visualStageChanged: false };
  }
  const nextCoreCount = current.matchingCoresAtLevel + 1;
  const levelUp = nextCoreCount === current.level;
  const nextLevel = levelUp ? asLevel(current.level + 1) : current.level;
  return {
    progress: {
      energyId: current.energyId,
      level: nextLevel,
      matchingCoresAtLevel: levelUp ? 0 : nextCoreCount,
    },
    matched: true,
    levelUp,
    capped: nextLevel === 8,
    visualStageChanged: levelUp && getEvo8VisualStage(nextLevel) !== getEvo8VisualStage(current.level),
  };
};
