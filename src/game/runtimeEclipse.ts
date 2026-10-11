import { EnemyType, type OrbiAffinity } from "./types";
import type { RuntimeMutatorEffectProfile } from "./runtimeMutatorEffects";

export const ECLIPSE_SOLAR_RECHARGE_MULTIPLIER = 0.82;
export const ECLIPSE_PARASITE_SPEED_MULTIPLIER = 1.12;

export interface RuntimeEclipseProfile {
  active: boolean;
  identity: "ECLIPSE" | null;
  visibilityScale: number;
  solarCooldownRecoveryMultiplier: number;
  parasiteSpeedMultiplier: number;
}

export const isRuntimeEclipseActive = (
  effects: RuntimeMutatorEffectProfile,
): boolean =>
  effects.sourceMode === "INFINITE" &&
  effects.activeMutators.includes("REDUCED_VISIBILITY");

export const projectRuntimeEclipse = (
  effects: RuntimeMutatorEffectProfile,
): RuntimeEclipseProfile => {
  const active = isRuntimeEclipseActive(effects);

  return {
    active,
    identity: active ? "ECLIPSE" : null,
    visibilityScale: active ? effects.visibilityScale : 1,
    solarCooldownRecoveryMultiplier: active
      ? ECLIPSE_SOLAR_RECHARGE_MULTIPLIER
      : 1,
    parasiteSpeedMultiplier: active
      ? ECLIPSE_PARASITE_SPEED_MULTIPLIER
      : 1,
  };
};

export const getEclipseSolarCooldownRecoveryMultiplier = (
  effects: RuntimeMutatorEffectProfile,
  affinity: OrbiAffinity | undefined,
): number =>
  isRuntimeEclipseActive(effects) && affinity === "solar"
    ? ECLIPSE_SOLAR_RECHARGE_MULTIPLIER
    : 1;

export const getEclipseEnemyMovementMultiplier = (
  effects: RuntimeMutatorEffectProfile,
  enemyType: EnemyType,
): number =>
  isRuntimeEclipseActive(effects) &&
  enemyType === EnemyType.PARASITE
    ? ECLIPSE_PARASITE_SPEED_MULTIPLIER
    : 1;
