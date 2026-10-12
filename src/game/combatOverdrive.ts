/**
 * Pure ES-13J2A ORBI Overdrive state contract.
 *
 * This module deliberately owns no wall clock, RAF, rendering, audio, storage,
 * React state, random numbers, entity arrays or combat tuning. Callers supply
 * simulation time and the already-certified Combat Resonance readiness signal.
 */

export const OVERDRIVE_DURATION_MS = 8_000;
export const OVERDRIVE_REENTRY_LOCK_MS = 4_000;

export interface CombatOverdriveState {
  active: boolean;
  activatedAtMs: number | null;
  endsAtMs: number | null;
  reentryAllowedAtMs: number;
}

export interface CombatOverdriveProjection {
  active: boolean;
  canActivate: boolean;
  remainingMs: number;
  remainingRatio: number;
  reentryLocked: boolean;
  reentryRemainingMs: number;
}

export interface CombatOverdriveActivationEvent {
  occurredAtMs: number;
  overdriveReady: boolean;
}

export interface CombatOverdriveActivationResolution {
  state: CombatOverdriveState;
  projection: CombatOverdriveProjection;
  activated: boolean;
  consumeResonance: boolean;
}

export const createCombatOverdriveState = (): CombatOverdriveState => ({
  active: false,
  activatedAtMs: null,
  endsAtMs: null,
  reentryAllowedAtMs: 0,
});

export const resetCombatOverdriveState = createCombatOverdriveState;

const assertSimulationTime = (nowMs: number) => {
  if (!Number.isFinite(nowMs) || nowMs < 0) {
    throw new Error("Combat Overdrive time must be finite and non-negative.");
  }
};

export const advanceCombatOverdrive = (
  state: CombatOverdriveState,
  nowMs: number,
): CombatOverdriveState => {
  assertSimulationTime(nowMs);

  if (!state.active || state.endsAtMs === null || nowMs < state.endsAtMs) {
    return state;
  }

  return {
    ...state,
    active: false,
    activatedAtMs: null,
    endsAtMs: null,
  };
};

export const projectCombatOverdrive = (
  state: CombatOverdriveState,
  nowMs: number,
  overdriveReady: boolean,
): CombatOverdriveProjection => {
  assertSimulationTime(nowMs);
  const current = advanceCombatOverdrive(state, nowMs);

  const remainingMs =
    current.active && current.endsAtMs !== null
      ? Math.max(0, current.endsAtMs - nowMs)
      : 0;
  const reentryLocked =
    !current.active && nowMs < current.reentryAllowedAtMs;
  const reentryRemainingMs = reentryLocked
    ? Math.max(0, current.reentryAllowedAtMs - nowMs)
    : 0;

  return {
    active: current.active,
    canActivate: Boolean(overdriveReady) && !current.active && !reentryLocked,
    remainingMs,
    remainingRatio: current.active
      ? Math.min(1, Math.max(0, remainingMs / OVERDRIVE_DURATION_MS))
      : 0,
    reentryLocked,
    reentryRemainingMs,
  };
};

export const activateCombatOverdrive = (
  inputState: CombatOverdriveState,
  event: CombatOverdriveActivationEvent,
): CombatOverdriveActivationResolution => {
  assertSimulationTime(event.occurredAtMs);
  const state = advanceCombatOverdrive(inputState, event.occurredAtMs);
  const projection = projectCombatOverdrive(
    state,
    event.occurredAtMs,
    event.overdriveReady,
  );

  if (!projection.canActivate) {
    return {
      state,
      projection,
      activated: false,
      consumeResonance: false,
    };
  }

  const activatedState: CombatOverdriveState = {
    active: true,
    activatedAtMs: event.occurredAtMs,
    endsAtMs: event.occurredAtMs + OVERDRIVE_DURATION_MS,
    reentryAllowedAtMs:
      event.occurredAtMs + OVERDRIVE_DURATION_MS + OVERDRIVE_REENTRY_LOCK_MS,
  };

  return {
    state: activatedState,
    projection: projectCombatOverdrive(
      activatedState,
      event.occurredAtMs,
      false,
    ),
    activated: true,
    consumeResonance: true,
  };
};
