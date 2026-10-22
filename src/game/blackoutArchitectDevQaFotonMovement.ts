import { PLAYER_BASE_SPEED, WORLD_BOUNDS } from "./constants";
import type { TouchDirectionState } from "./touchControls";

/**
 * C4: pure and exclusive FOTON QA movement projection.
 * No engine references, global clock, enemies, enemy AI, score, rewards,
 * player abilities, formation mutations, or actual gameplay mode changes.
 */
export interface BlackoutArchitectQaFotonPosition {
  readonly x: number;
  readonly y: number;
}
export interface BlackoutArchitectQaFotonStep {
  readonly x: number;
  readonly y: number;
  readonly dx: number;
  readonly dy: number;
  readonly source: "KEYBOARD" | "TOUCH_PAD" | "NONE";
}

export const BLACKOUT_ARCHITECT_DEV_QA_FOTON_MOVEMENT_AUTHORITY = Object.freeze({
  ownsBoundedDevQaFotonNavigation: true,
  ownsKeyboardAndTouchDirectionProjection: true,
  ownsNormalGameplayFotonMovement: false,
  ownsPlayerAbilitiesOrDamage: false,
  ownsSwarmOrCompanionMovement: false,
  ownsEnemyOrBossAi: false,
  ownsArchitectAttackExecution: false,
  ownsWorldSimulationOrWaveTick: false,
  ownsModeRoutingOrRewards: false,
  ownsGlobalRandomnessOrClock: false,
  ownsGlobalCapacityChange: false,
} as const);

const finite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const keys = ["W", "A", "S", "D", "ARROWUP", "ARROWDOWN", "ARROWLEFT", "ARROWRIGHT"] as const;

export function stepBlackoutArchitectDevQaFotonMovement(
  current: Readonly<BlackoutArchitectQaFotonPosition> | null,
  heldKeys: Readonly<Record<string, boolean | undefined>> | null,
  touch: Readonly<TouchDirectionState> | null,
  deltaMs: number,
  formationSpeedMod: number,
): Readonly<BlackoutArchitectQaFotonStep> | null {
  if (!current || !heldKeys || !touch ||
      !finite(current.x) || !finite(current.y) ||
      current.x < WORLD_BOUNDS.minX || current.x > WORLD_BOUNDS.maxX ||
      current.y < WORLD_BOUNDS.minY || current.y > WORLD_BOUNDS.maxY ||
      !finite(deltaMs) || deltaMs < 0 || deltaMs > 33.2 ||
      !finite(formationSpeedMod) || formationSpeedMod <= 0 || formationSpeedMod > 2) return null;

  for (const key of keys) {
    if (heldKeys[key] !== undefined && typeof heldKeys[key] !== "boolean") return null;
  }
  for (const key of ["UP", "DOWN", "LEFT", "RIGHT"] as const) {
    if (typeof touch[key] !== "boolean") return null;
  }

  let dx = Number(heldKeys.D === true || heldKeys.ARROWRIGHT === true) -
    Number(heldKeys.A === true || heldKeys.ARROWLEFT === true);
  let dy = Number(heldKeys.S === true || heldKeys.ARROWDOWN === true) -
    Number(heldKeys.W === true || heldKeys.ARROWUP === true);

  let source: BlackoutArchitectQaFotonStep["source"] = "NONE";
  if (dx !== 0 || dy !== 0) {
    source = "KEYBOARD";
  } else {
    dx = Number(touch.RIGHT) - Number(touch.LEFT);
    dy = Number(touch.DOWN) - Number(touch.UP);
    if (dx !== 0 || dy !== 0) source = "TOUCH_PAD";
  }

  const length = Math.hypot(dx, dy);
  const stepDistance = PLAYER_BASE_SPEED * formationSpeedMod * deltaMs / 16.6;
  if (!finite(stepDistance) || !finite(length)) return null;
  const mx = length > 0 ? dx / length * stepDistance : 0;
  const my = length > 0 ? dy / length * stepDistance : 0;
  const x = Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, current.x + mx));
  const y = Math.max(WORLD_BOUNDS.minY, Math.min(WORLD_BOUNDS.maxY, current.y + my));
  if (!finite(x) || !finite(y)) return null;
  return Object.freeze({ x, y, dx: x - current.x, dy: y - current.y, source });
}
