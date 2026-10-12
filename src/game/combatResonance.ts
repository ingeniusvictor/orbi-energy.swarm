/**
 * Pure ES-13 combat-resonance contract.
 *
 * This module deliberately owns no clocks, rendering, audio, storage, React state,
 * random numbers or entity scans. Live gameplay supplies defeat/damage events and
 * decides when to render the projected chain, tier and multiplier.
 */
import type { OrbiAffinity } from "./types";

export const COMBAT_CHAIN_WINDOW_MS = 2200;
export const MAX_COMBAT_CHAIN = 999;
export const MAX_RESONANCE = 100;
export const DAMAGE_BREAK_RESONANCE_PENALTY = 35;
export const RESONANCE_AFFINITY_MEMORY = 4;

export type ResonanceTier =
  | "QUIET"
  | "SYNCED"
  | "HARMONIC"
  | "SURGING"
  | "OVERDRIVE_READY";

export interface CombatResonanceState {
  chain: number;
  bestChain: number;
  resonance: number;
  lastDefeatAtMs: number | null;
  affinityTrail: OrbiAffinity[];
  diversityMilestone: 0 | 3 | 4;
}

export interface CombatResonanceProjection {
  tier: ResonanceTier;
  chainMultiplier: number;
  resonanceBonus: number;
  scoreMultiplier: number;
  overdriveReady: boolean;
}

export interface CombatResonanceDefeatEvent {
  occurredAtMs: number;
  baseScore: number;
  affinity?: OrbiAffinity;
  isElite?: boolean;
  isBoss?: boolean;
}

export interface CombatResonanceResolution {
  state: CombatResonanceState;
  projection: CombatResonanceProjection;
  resonanceGain: number;
  diversityMilestoneReached: 0 | 3 | 4;
  awardedScore: number;
}

export const createCombatResonanceState = (): CombatResonanceState => ({
  chain: 0,
  bestChain: 0,
  resonance: 0,
  lastDefeatAtMs: null,
  affinityTrail: [],
  diversityMilestone: 0,
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const resolveTier = (resonance: number): ResonanceTier => {
  if (resonance >= MAX_RESONANCE) return "OVERDRIVE_READY";
  if (resonance >= 75) return "SURGING";
  if (resonance >= 50) return "HARMONIC";
  if (resonance >= 25) return "SYNCED";
  return "QUIET";
};

const resolveChainMultiplier = (chain: number) => {
  if (chain >= 40) return 1.7;
  if (chain >= 20) return 1.5;
  if (chain >= 10) return 1.25;
  if (chain >= 5) return 1.1;
  return 1;
};

const resolveResonanceBonus = (tier: ResonanceTier) => {
  switch (tier) {
    case "SYNCED":
      return 0.05;
    case "HARMONIC":
      return 0.1;
    case "SURGING":
      return 0.2;
    case "OVERDRIVE_READY":
      return 0.3;
    default:
      return 0;
  }
};

export const projectCombatResonance = (
  state: CombatResonanceState,
): CombatResonanceProjection => {
  const tier = resolveTier(state.resonance);
  const chainMultiplier = resolveChainMultiplier(state.chain);
  const resonanceBonus = resolveResonanceBonus(tier);
  const scoreMultiplier = Math.min(2, chainMultiplier + resonanceBonus);

  return {
    tier,
    chainMultiplier,
    resonanceBonus,
    scoreMultiplier,
    overdriveReady: state.resonance >= MAX_RESONANCE,
  };
};

const resetExpiredChain = (
  state: CombatResonanceState,
  nowMs: number,
): CombatResonanceState => {
  if (
    state.lastDefeatAtMs === null ||
    nowMs - state.lastDefeatAtMs <= COMBAT_CHAIN_WINDOW_MS
  ) {
    return state;
  }

  return {
    ...state,
    chain: 0,
    lastDefeatAtMs: null,
    affinityTrail: [],
    diversityMilestone: 0,
  };
};

export const expireCombatChain = (
  state: CombatResonanceState,
  nowMs: number,
): CombatResonanceState => {
  if (!Number.isFinite(nowMs) || nowMs < 0) {
    throw new Error("Combat resonance time must be a finite non-negative value.");
  }
  return resetExpiredChain(state, nowMs);
};

const getAffinityGain = (
  affinity: OrbiAffinity | undefined,
  previousAffinity: OrbiAffinity | undefined,
) => {
  if (!affinity) return 3;
  if (!previousAffinity) return 4;
  return affinity === previousAffinity ? 4 : 7;
};

const projectAffinityTrail = (
  state: CombatResonanceState,
  affinity: OrbiAffinity | undefined,
) => {
  if (!affinity) return state.affinityTrail;
  return [...state.affinityTrail, affinity].slice(-RESONANCE_AFFINITY_MEMORY);
};

const resolveDiversityMilestone = (
  previousMilestone: 0 | 3 | 4,
  trail: OrbiAffinity[],
): 0 | 3 | 4 => {
  const uniqueAffinities = new Set(trail).size;
  if (previousMilestone < 4 && uniqueAffinities >= 4) return 4;
  if (previousMilestone < 3 && uniqueAffinities >= 3) return 3;
  return 0;
};

const getDiversityBonus = (milestone: 0 | 3 | 4) => {
  if (milestone === 4) return 12;
  if (milestone === 3) return 8;
  return 0;
};

export const registerCombatResonanceDefeat = (
  inputState: CombatResonanceState,
  event: CombatResonanceDefeatEvent,
): CombatResonanceResolution => {
  if (!Number.isFinite(event.occurredAtMs) || event.occurredAtMs < 0) {
    throw new Error("Combat resonance defeat time must be finite and non-negative.");
  }
  if (!Number.isFinite(event.baseScore) || event.baseScore < 0) {
    throw new Error("Combat resonance base score must be finite and non-negative.");
  }

  const state = resetExpiredChain(inputState, event.occurredAtMs);
  const previousAffinity = state.affinityTrail.at(-1);
  const affinityTrail = projectAffinityTrail(state, event.affinity);
  const diversityMilestoneReached = resolveDiversityMilestone(
    state.diversityMilestone,
    affinityTrail,
  );

  const affinityGain = getAffinityGain(event.affinity, previousAffinity);
  const eliteGain = event.isElite ? 4 : 0;
  const bossGain = event.isBoss ? 10 : 0;
  const resonanceGain =
    affinityGain +
    eliteGain +
    bossGain +
    getDiversityBonus(diversityMilestoneReached);

  const chain = Math.min(MAX_COMBAT_CHAIN, state.chain + 1);
  const nextState: CombatResonanceState = {
    chain,
    bestChain: Math.max(state.bestChain, chain),
    resonance: clamp(state.resonance + resonanceGain, 0, MAX_RESONANCE),
    lastDefeatAtMs: event.occurredAtMs,
    affinityTrail,
    diversityMilestone:
      diversityMilestoneReached === 0
        ? state.diversityMilestone
        : diversityMilestoneReached,
  };

  const projection = projectCombatResonance(nextState);

  return {
    state: nextState,
    projection,
    resonanceGain,
    diversityMilestoneReached,
    awardedScore: Math.round(event.baseScore * projection.scoreMultiplier),
  };
};

export const applyCombatResonanceDamageBreak = (
  state: CombatResonanceState,
): CombatResonanceState => ({
  ...state,
  chain: 0,
  resonance: Math.max(0, state.resonance - DAMAGE_BREAK_RESONANCE_PENALTY),
  lastDefeatAtMs: null,
  affinityTrail: [],
  diversityMilestone: 0,
});
