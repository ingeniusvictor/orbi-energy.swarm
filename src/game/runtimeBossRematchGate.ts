import type { InfiniteMilestoneEncounterProfile } from "./runtimeMilestoneEncounter";

export type RuntimeBossRematchGatePhase =
  | "IDLE"
  | "TELEGRAPH"
  | "READY"
  | "SPAWNED"
  | "DEFEATED";

export interface RuntimeBossRematchGateState {
  descriptorId: string | null;
  phase: RuntimeBossRematchGatePhase;
  remainingMs: number;
}

export interface RuntimeBossRematchRequest {
  state: RuntimeBossRematchGateState;
  telegraphStarted: boolean;
  readyToSpawn: boolean;
}

export interface RuntimeBossRematchEligibility {
  spawnedEnemyCount: number;
  effectiveEnemyBudget: number;
  livingRegularEnemyCount: number;
}

export const createRuntimeBossRematchGateState =
  (): RuntimeBossRematchGateState => ({
    descriptorId: null,
    phase: "IDLE",
    remainingMs: 0,
  });

const asBossRematch = (
  profile: InfiniteMilestoneEncounterProfile | null,
) => (profile?.kind === "BOSS_REMATCH" ? profile : null);

export const syncRuntimeBossRematchGate = (
  state: RuntimeBossRematchGateState,
  descriptorId: string,
  profile: InfiniteMilestoneEncounterProfile | null,
): RuntimeBossRematchGateState => {
  const rematch = asBossRematch(profile);

  if (!rematch) {
    return createRuntimeBossRematchGateState();
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

export const isRuntimeBossRematchEligible = (
  profile: InfiniteMilestoneEncounterProfile | null,
  eligibility: RuntimeBossRematchEligibility,
) => {
  if (profile?.kind !== "BOSS_REMATCH") {
    return false;
  }

  return (
    eligibility.spawnedEnemyCount >=
      eligibility.effectiveEnemyBudget &&
    eligibility.livingRegularEnemyCount === 0
  );
};

export const requestRuntimeBossRematch = (
  state: RuntimeBossRematchGateState,
  profile: Extract<
    InfiniteMilestoneEncounterProfile,
    { kind: "BOSS_REMATCH" }
  >,
  eligibility: RuntimeBossRematchEligibility,
): RuntimeBossRematchRequest => {
  if (
    state.phase === "SPAWNED" ||
    state.phase === "DEFEATED"
  ) {
    return {
      state,
      telegraphStarted: false,
      readyToSpawn: false,
    };
  }

  if (
    !isRuntimeBossRematchEligible(
      profile,
      eligibility,
    )
  ) {
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

export const stepRuntimeBossRematchGate = (
  state: RuntimeBossRematchGateState,
  deltaMs: number,
): RuntimeBossRematchGateState => {
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

export const markRuntimeBossRematchSpawned = (
  state: RuntimeBossRematchGateState,
): RuntimeBossRematchGateState => {
  if (state.phase !== "READY") {
    return state;
  }

  return {
    ...state,
    phase: "SPAWNED",
    remainingMs: 0,
  };
};

export const markRuntimeBossRematchDefeated = (
  state: RuntimeBossRematchGateState,
): RuntimeBossRematchGateState => {
  if (
    state.phase !== "SPAWNED" &&
    state.phase !== "DEFEATED"
  ) {
    return state;
  }

  return {
    ...state,
    phase: "DEFEATED",
    remainingMs: 0,
  };
};

export const isRuntimeBossRematchResolved = (
  state: RuntimeBossRematchGateState,
  profile: InfiniteMilestoneEncounterProfile | null,
) =>
  profile?.kind !== "BOSS_REMATCH" ||
  state.phase === "DEFEATED";
