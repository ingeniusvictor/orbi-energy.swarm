import {
  acknowledgeSiegeVolleyCommit,
  beginSiegeVolleyTelegraph,
  createSiegeVolleyTelegraphState,
  projectSiegeVolleyTelegraph,
  stepSiegeVolleyTelegraph,
  type SiegeVolleyTelegraphProjection,
  type SiegeVolleyTelegraphState,
} from "./siegeVolleyTelegraph";

export const LIVE_SIEGE_VOLLEY_FIRE_RANGE = 320;

export const LIVE_SIEGE_VOLLEY_AUTHORITY_CONTRACT = Object.freeze({
  ownsEnemyCollection: false,
  ownsProjectileCollection: false,
  ownsSpawnAuthority: false,
  ownsProjectileBudget: false,
  ownsCooldownRandomness: false,
  ownsFullArrayScan: false,
  mayMutateGlobalCaps: false,
});

export interface LiveSiegeVolleyStepInput {
  readonly state?: SiegeVolleyTelegraphState;
  readonly deltaMs: number;
  readonly cooldownReady: boolean;
  readonly targetX: number;
  readonly targetY: number;
  readonly targetInRange: boolean;
}

export interface LiveSiegeVolleyStepResult {
  readonly state?: SiegeVolleyTelegraphState;
  readonly telegraphStarted: boolean;
  readonly commitReady: boolean;
}

export interface LiveSiegeVolleyAcknowledgeResult {
  readonly state?: SiegeVolleyTelegraphState;
  readonly acknowledged: boolean;
}

const freezeStepResult = (
  state: SiegeVolleyTelegraphState | undefined,
  telegraphStarted: boolean,
  commitReady: boolean,
): LiveSiegeVolleyStepResult =>
  Object.freeze({ state, telegraphStarted, commitReady });

const freezeAcknowledgeResult = (
  state: SiegeVolleyTelegraphState | undefined,
  acknowledged: boolean,
): LiveSiegeVolleyAcknowledgeResult =>
  Object.freeze({ state, acknowledged });

export const stepLiveSiegeVolley = (
  input: LiveSiegeVolleyStepInput,
): LiveSiegeVolleyStepResult => {
  const currentState = input.state;

  if (!currentState || currentState.phase === "IDLE") {
    if (!input.cooldownReady || !input.targetInRange) {
      return freezeStepResult(undefined, false, false);
    }

    const started = beginSiegeVolleyTelegraph(
      createSiegeVolleyTelegraphState(),
      input.targetX,
      input.targetY,
    );

    return started.telegraphStarted
      ? freezeStepResult(started.state, true, false)
      : freezeStepResult(undefined, false, false);
  }

  if (currentState.phase === "TELEGRAPH") {
    const stepped = stepSiegeVolleyTelegraph(
      currentState,
      input.deltaMs,
    );
    return freezeStepResult(
      stepped.state,
      false,
      stepped.state.phase === "COMMIT",
    );
  }

  return freezeStepResult(currentState, false, true);
};

export const acknowledgeLiveSiegeVolleyShot = (
  state: SiegeVolleyTelegraphState | undefined,
  shotCommitted: boolean,
): LiveSiegeVolleyAcknowledgeResult => {
  if (!shotCommitted || !state || state.phase !== "COMMIT") {
    return freezeAcknowledgeResult(state, false);
  }

  const acknowledged = acknowledgeSiegeVolleyCommit(state);
  return acknowledged.acknowledged
    ? freezeAcknowledgeResult(undefined, true)
    : freezeAcknowledgeResult(state, false);
};

export const projectLiveSiegeVolleyTelegraph = (
  state: SiegeVolleyTelegraphState,
): SiegeVolleyTelegraphProjection =>
  projectSiegeVolleyTelegraph(state);
