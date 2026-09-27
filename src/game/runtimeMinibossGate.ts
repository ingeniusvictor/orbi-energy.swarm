import type { InfiniteMilestoneEncounterProfile } from "./runtimeMilestoneEncounter";

export type RuntimeMinibossGatePhase =
  | "IDLE"
  | "TELEGRAPH"
  | "READY"
  | "SPAWNED";

export interface RuntimeMinibossGateState {
  descriptorId: string | null;
  phase: RuntimeMinibossGatePhase;
  remainingMs: number;
}

export interface RuntimeMinibossSpawnRequest {
  state: RuntimeMinibossGateState;
  telegraphStarted: boolean;
  readyToSpawn: boolean;
}

export const createRuntimeMinibossGateState =
  (): RuntimeMinibossGateState => ({
    descriptorId: null,
    phase: "IDLE",
    remainingMs: 0,
  });

export const syncRuntimeMinibossGate = (
  state: RuntimeMinibossGateState,
  descriptorId: string,
  profile: InfiniteMilestoneEncounterProfile | null,
): RuntimeMinibossGateState => {
  const miniboss =
    profile?.kind === "MINIBOSS" ? profile : null;

  if (!miniboss) {
    return createRuntimeMinibossGateState();
  }

  if (state.descriptorId !== descriptorId) {
    return {
      descriptorId,
      phase: "IDLE",
      remainingMs: 0,
    };
  }

  return state;
};

export const stepRuntimeMinibossGate = (
  state: RuntimeMinibossGateState,
  deltaMs: number,
): RuntimeMinibossGateState => {
  if (state.phase !== "TELEGRAPH") {
    return state;
  }

  const remainingMs =
    state.remainingMs - Math.max(0, deltaMs);

  if (remainingMs > 0) {
    return {
      ...state,
      remainingMs,
    };
  }

  return {
    ...state,
    phase: "READY",
    remainingMs: 0,
  };
};

export const requestRuntimeMinibossSpawn = (
  state: RuntimeMinibossGateState,
  profile: Extract<
    InfiniteMilestoneEncounterProfile,
    { kind: "MINIBOSS" }
  >,
): RuntimeMinibossSpawnRequest => {
  if (state.phase === "SPAWNED") {
    return {
      state,
      telegraphStarted: false,
      readyToSpawn: false,
    };
  }

  if (state.phase === "READY") {
    return {
      state,
      telegraphStarted: false,
      readyToSpawn: true,
    };
  }

  if (state.phase === "TELEGRAPH") {
    return {
      state,
      telegraphStarted: false,
      readyToSpawn: false,
    };
  }

  return {
    state: {
      ...state,
      phase: "TELEGRAPH",
      remainingMs: profile.telegraphMs,
    },
    telegraphStarted: true,
    readyToSpawn: false,
  };
};

export const markRuntimeMinibossSpawned = (
  state: RuntimeMinibossGateState,
): RuntimeMinibossGateState => ({
  ...state,
  phase: "SPAWNED",
  remainingMs: 0,
});
