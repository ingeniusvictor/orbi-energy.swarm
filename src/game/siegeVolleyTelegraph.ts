export const SIEGE_VOLLEY_TELEGRAPH_MS = 700;
export const SIEGE_VOLLEY_TELEGRAPH_KIND = "SIEGE_VOLLEY" as const;
export const SIEGE_VOLLEY_SAFE_INTENT =
  "BREAK_ARTILLERY_ENVELOPE" as const;

export type SiegeVolleyPhase =
  | "IDLE"
  | "TELEGRAPH"
  | "COMMIT";

export interface SiegeVolleyTelegraphState {
  readonly phase: SiegeVolleyPhase;
  readonly remainingMs: number;
  readonly targetX: number | null;
  readonly targetY: number | null;
}

export interface SiegeVolleyBeginResult {
  readonly state: SiegeVolleyTelegraphState;
  readonly telegraphStarted: boolean;
}

export interface SiegeVolleyStepResult {
  readonly state: SiegeVolleyTelegraphState;
  readonly commitTriggered: boolean;
}

export interface SiegeVolleyAcknowledgeResult {
  readonly state: SiegeVolleyTelegraphState;
  readonly acknowledged: boolean;
}

export interface SiegeVolleyTelegraphProjection {
  readonly kind: typeof SIEGE_VOLLEY_TELEGRAPH_KIND;
  readonly safeIntent: typeof SIEGE_VOLLEY_SAFE_INTENT;
  readonly phase: SiegeVolleyPhase;
  readonly telegraphActive: boolean;
  readonly commitReady: boolean;
  readonly progress: number;
  readonly remainingMs: number;
  readonly targetX: number | null;
  readonly targetY: number | null;
}

export const SIEGE_VOLLEY_AUTHORITY_CONTRACT = Object.freeze({
  ownsSpawnAuthority: false,
  ownsEntityCollection: false,
  ownsProjectileCollection: false,
  ownsFullArrayScan: false,
  mayMutateGlobalCaps: false,
  mayCreateSupportEntities: false,
  ownsCooldownRandomness: false,
});

const freezeState = (
  state: SiegeVolleyTelegraphState,
): SiegeVolleyTelegraphState => Object.freeze(state);

const IDLE_STATE = freezeState({
  phase: "IDLE",
  remainingMs: 0,
  targetX: null,
  targetY: null,
});

const isFiniteCoordinate = (value: number): boolean =>
  Number.isFinite(value);

const isValidDelta = (deltaMs: number): boolean =>
  Number.isFinite(deltaMs) && deltaMs >= 0;

const clamp01 = (value: number): number =>
  Math.max(0, Math.min(1, value));

const freezeBeginResult = (
  state: SiegeVolleyTelegraphState,
  telegraphStarted: boolean,
): SiegeVolleyBeginResult =>
  Object.freeze({ state, telegraphStarted });

const freezeStepResult = (
  state: SiegeVolleyTelegraphState,
  commitTriggered: boolean,
): SiegeVolleyStepResult =>
  Object.freeze({ state, commitTriggered });

const freezeAcknowledgeResult = (
  state: SiegeVolleyTelegraphState,
  acknowledged: boolean,
): SiegeVolleyAcknowledgeResult =>
  Object.freeze({ state, acknowledged });

export const createSiegeVolleyTelegraphState =
  (): SiegeVolleyTelegraphState => IDLE_STATE;

export const beginSiegeVolleyTelegraph = (
  state: SiegeVolleyTelegraphState,
  targetX: number,
  targetY: number,
): SiegeVolleyBeginResult => {
  if (
    state.phase !== "IDLE" ||
    !isFiniteCoordinate(targetX) ||
    !isFiniteCoordinate(targetY)
  ) {
    return freezeBeginResult(state, false);
  }

  return freezeBeginResult(
    freezeState({
      phase: "TELEGRAPH",
      remainingMs: SIEGE_VOLLEY_TELEGRAPH_MS,
      targetX,
      targetY,
    }),
    true,
  );
};

export const stepSiegeVolleyTelegraph = (
  state: SiegeVolleyTelegraphState,
  deltaMs: number,
): SiegeVolleyStepResult => {
  if (!isValidDelta(deltaMs) || state.phase !== "TELEGRAPH") {
    return freezeStepResult(state, false);
  }

  if (deltaMs < state.remainingMs) {
    return freezeStepResult(
      freezeState({
        ...state,
        remainingMs: state.remainingMs - deltaMs,
      }),
      false,
    );
  }

  return freezeStepResult(
    freezeState({
      phase: "COMMIT",
      remainingMs: 0,
      targetX: state.targetX,
      targetY: state.targetY,
    }),
    true,
  );
};

export const acknowledgeSiegeVolleyCommit = (
  state: SiegeVolleyTelegraphState,
): SiegeVolleyAcknowledgeResult => {
  if (state.phase !== "COMMIT") {
    return freezeAcknowledgeResult(state, false);
  }

  return freezeAcknowledgeResult(IDLE_STATE, true);
};

export const projectSiegeVolleyTelegraph = (
  state: SiegeVolleyTelegraphState,
): SiegeVolleyTelegraphProjection => {
  const progress =
    state.phase === "IDLE"
      ? 0
      : state.phase === "COMMIT"
        ? 1
        : clamp01(
            1 -
              state.remainingMs /
                SIEGE_VOLLEY_TELEGRAPH_MS,
          );

  return Object.freeze({
    kind: SIEGE_VOLLEY_TELEGRAPH_KIND,
    safeIntent: SIEGE_VOLLEY_SAFE_INTENT,
    phase: state.phase,
    telegraphActive: state.phase === "TELEGRAPH",
    commitReady: state.phase === "COMMIT",
    progress,
    remainingMs: state.remainingMs,
    targetX: state.targetX,
    targetY: state.targetY,
  });
};
