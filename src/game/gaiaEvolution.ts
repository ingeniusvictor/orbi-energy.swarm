import { acquisitionsForLevel, getEvo8VisualStage, ORBI_MAX_EVOLUTION_LEVEL } from "./orbiEvolution";
import {
  ORBI_GAIA_REQUIRED_FOLLOWER_IDS,
} from "./orbiEnergyCanon";
import type { OrbiEnergyId } from "./types";

export interface GaiaEvolutionState {
  cycleMask: number;
  gaiaLevel: number;
  completedCycles: number;
}

export interface GaiaProgressUpdate {
  state: GaiaEvolutionState;
  accepted: boolean;
  duplicate: boolean;
  cycleCompleted: boolean;
  progressCount: number;
  requiredCount: number;
  energyId: OrbiEnergyId;
}

export interface GaiaCombatScale {
  damageMultiplier: number;
  cooldownMultiplier: number;
  shieldSupportMultiplier: number;
  incomingDamageMultiplier: number;
  size: number;
  evolutionStage: number;
}

export const GAIA_REQUIRED_ENERGY_COUNT =
  ORBI_GAIA_REQUIRED_FOLLOWER_IDS.length;

const REQUIRED_INDEX = new Map<OrbiEnergyId, number>(
  ORBI_GAIA_REQUIRED_FOLLOWER_IDS.map((id, index) => [id, index]),
);

const REQUIRED_MASK =
  (1 << GAIA_REQUIRED_ENERGY_COUNT) - 1;

const countBits = (value: number) => {
  let count = 0;
  let remaining = value >>> 0;
  while (remaining !== 0) {
    count += remaining & 1;
    remaining >>>= 1;
  }
  return count;
};

export const getGaiaProgressCount = (
  state: GaiaEvolutionState,
) => countBits(state.cycleMask);

/** First full nine-energy set creates E1; further full sets are matching GAIA essences. */
export const getGaiaLevelForCompletedCycles = (cycles: number): number => {
  if (!Number.isFinite(cycles) || cycles < 1) return 0;
  let level = 1;
  for (let next = 2; next <= ORBI_MAX_EVOLUTION_LEVEL; next += 1) {
    if (cycles < acquisitionsForLevel(next)) break;
    level = next;
  }
  return level;
};

export const createGaiaEvolutionState = (): GaiaEvolutionState => ({
  cycleMask: 0,
  gaiaLevel: 0,
  completedCycles: 0,
});

/**
 * Registers one acquired canonical follower energy toward GAIA synthesis.
 * ENERGY is the neutral permanent leader, not a synthesis ingredient.
 * GAIA requires the nine separately collectible energies (including the
 * photovoltaic ORBI FOTON). Duplicate energies in one cycle are ignored.
 */
export const registerGaiaEnergy = (
  current: GaiaEvolutionState,
  energyId: OrbiEnergyId,
): GaiaProgressUpdate => {
  const bitIndex = REQUIRED_INDEX.get(energyId);
  if (bitIndex === undefined) {
    return {
      state: current,
      accepted: false,
      duplicate: false,
      cycleCompleted: false,
      progressCount: countBits(current.cycleMask),
      requiredCount: GAIA_REQUIRED_ENERGY_COUNT,
      energyId,
    };
  }

  const bit = 1 << bitIndex;
  if ((current.cycleMask & bit) !== 0) {
    return {
      state: current,
      accepted: true,
      duplicate: true,
      cycleCompleted: false,
      progressCount: countBits(current.cycleMask),
      requiredCount: GAIA_REQUIRED_ENERGY_COUNT,
      energyId,
    };
  }

  const nextMask = current.cycleMask | bit;
  const progressCount = countBits(nextMask);
  if (nextMask === REQUIRED_MASK) {
    const state: GaiaEvolutionState = {
      cycleMask: 0,
      gaiaLevel: getGaiaLevelForCompletedCycles(current.completedCycles + 1),
      completedCycles: current.completedCycles + 1,
    };
    return {
      state,
      accepted: true,
      duplicate: false,
      cycleCompleted: true,
      progressCount: GAIA_REQUIRED_ENERGY_COUNT,
      requiredCount: GAIA_REQUIRED_ENERGY_COUNT,
      energyId,
    };
  }

  return {
    state: {
      ...current,
      cycleMask: nextMask,
    },
    accepted: true,
    duplicate: false,
    cycleCompleted: false,
    progressCount,
    requiredCount: GAIA_REQUIRED_ENERGY_COUNT,
    energyId,
  };
};

/** GAIA level is capped at E8 even if the lifetime synthesis counter grows. */
export const getGaiaCombatScale = (
  level: number,
): GaiaCombatScale => {
  const safeLevel = Math.max(1, Math.min(ORBI_MAX_EVOLUTION_LEVEL, Math.floor(level || 1)));
  const steps = safeLevel - 1;

  return {
    damageMultiplier: Math.min(2.2, 1 + steps * 0.12),
    cooldownMultiplier: Math.max(0.62, 1 - steps * 0.035),
    shieldSupportMultiplier: Math.min(2.5, 1 + steps * 0.14),
    incomingDamageMultiplier: Math.max(0.75, 0.92 - steps * 0.015),
    size: Math.min(10.5, 7.2 + steps * 0.22),
    evolutionStage: getEvo8VisualStage(safeLevel),
  };
};
