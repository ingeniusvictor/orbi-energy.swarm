import type { RuntimeCombatPressureProjection } from "./runtimeCombatPressure";
import type { RuntimeMutatorEffectProfile } from "./runtimeMutatorEffects";

export interface ElectricalStormConfig {
  initialDelayMs: number;
  intervalMs: number;
  telegraphMs: number;
  strikeRadius: number;
  baseDamage: number;
}

export interface ElectricalStormRuntimeState {
  phase: "DORMANT" | "COOLDOWN" | "TELEGRAPH";
  remainingMs: number;
  targetX: number | null;
  targetY: number | null;
  strikeSerial: number;
}

export interface ElectricalStormStepResult {
  state: ElectricalStormRuntimeState;
  telegraphStarted: boolean;
  strikeTriggered: boolean;
  strikeTarget:
    | { x: number; y: number }
    | null;
}

const clamp = (
  value: number,
  min: number,
  max: number,
) => Math.min(max, Math.max(min, value));

export const createElectricalStormRuntimeState =
  (): ElectricalStormRuntimeState => ({
    phase: "DORMANT",
    remainingMs: 0,
    targetX: null,
    targetY: null,
    strikeSerial: 0,
  });

export const getElectricalStormConfig = (
  effects: RuntimeMutatorEffectProfile,
  pressure: RuntimeCombatPressureProjection,
): ElectricalStormConfig | null => {
  if (
    effects.sourceMode !== "INFINITE" ||
    effects.electricalStormIntensity <= 0
  ) {
    return null;
  }

  const intensity = clamp(
    effects.electricalStormIntensity,
    0,
    1,
  );
  const hazardIntensity = clamp(
    pressure.hazardIntensity,
    0,
    1,
  );
  const fairnessTelegraphMs =
    pressure.minTelegraphMs ?? 0;

  return {
    initialDelayMs: 3200,
    intervalMs: Math.round(
      clamp(
        7000 - hazardIntensity * 2000,
        4800,
        7000,
      ),
    ),
    telegraphMs: Math.max(
      1200,
      fairnessTelegraphMs,
    ),
    strikeRadius: 78 + intensity * 14,
    baseDamage: 7 + hazardIntensity * 5,
  };
};

export const stepElectricalStormRuntime = (
  current: ElectricalStormRuntimeState,
  deltaMs: number,
  config: ElectricalStormConfig | null,
  target: { x: number; y: number },
): ElectricalStormStepResult => {
  if (!config) {
    return {
      state: createElectricalStormRuntimeState(),
      telegraphStarted: false,
      strikeTriggered: false,
      strikeTarget: null,
    };
  }

  const safeDelta = Math.max(0, deltaMs);

  if (current.phase === "DORMANT") {
    return {
      state: {
        phase: "COOLDOWN",
        remainingMs: config.initialDelayMs,
        targetX: null,
        targetY: null,
        strikeSerial: current.strikeSerial,
      },
      telegraphStarted: false,
      strikeTriggered: false,
      strikeTarget: null,
    };
  }

  if (current.phase === "COOLDOWN") {
    const remainingMs =
      current.remainingMs - safeDelta;

    if (remainingMs > 0) {
      return {
        state: {
          ...current,
          remainingMs,
        },
        telegraphStarted: false,
        strikeTriggered: false,
        strikeTarget: null,
      };
    }

    return {
      state: {
        phase: "TELEGRAPH",
        remainingMs: config.telegraphMs,
        targetX: target.x,
        targetY: target.y,
        strikeSerial: current.strikeSerial,
      },
      telegraphStarted: true,
      strikeTriggered: false,
      strikeTarget: null,
    };
  }

  const remainingMs =
    current.remainingMs - safeDelta;

  if (remainingMs > 0) {
    return {
      state: {
        ...current,
        remainingMs,
      },
      telegraphStarted: false,
      strikeTriggered: false,
      strikeTarget: null,
    };
  }

  const strikeTarget =
    current.targetX !== null &&
    current.targetY !== null
      ? {
          x: current.targetX,
          y: current.targetY,
        }
      : {
          x: target.x,
          y: target.y,
        };

  return {
    state: {
      phase: "COOLDOWN",
      remainingMs: config.intervalMs,
      targetX: null,
      targetY: null,
      strikeSerial: current.strikeSerial + 1,
    },
    telegraphStarted: false,
    strikeTriggered: true,
    strikeTarget,
  };
};
