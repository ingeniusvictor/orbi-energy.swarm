/**
 * UX11-E — deterministic, movement-only propulsion dash.
 *
 * No wall-clock, RAF, UI, damage immunity, resonance or particle ownership.
 * The game passes simulation time and frame delta; pause and hit-stop cannot
 * advance the dash or its cooldown. A dash never grants invulnerability.
 */
export const DASH_DURATION_MS = 180;
export const DASH_COOLDOWN_MS = 10_000;
export const DASH_SPEED_UNITS_PER_MS = 0.85;
export const DASH_PLAYER_RADIUS = 16;

export interface DashVector { x: number; y: number }
export interface PropulsionDashState {
  activatedAtMs: number | null;
  activeUntilMs: number;
  cooldownUntilMs: number;
  direction: DashVector;
}
export interface PropulsionDashProjection {
  active: boolean;
  canActivate: boolean;
  remainingMs: number;
  cooldownRemainingMs: number;
  progress: number;
}
export interface DashBounds { width: number; height: number; radius: number }
export interface DashStep {
  position: DashVector;
  moved: number;
  activeDuringFrame: boolean;
}

export const createPropulsionDashState = (): PropulsionDashState => ({
  activatedAtMs: null,
  activeUntilMs: 0,
  cooldownUntilMs: 0,
  direction: { x: 0, y: 0 },
});

const assertTime = (nowMs: number) => {
  if (!Number.isFinite(nowMs) || nowMs < 0) {
    throw new Error("Dash simulation time must be finite and non-negative.");
  }
};

export const projectPropulsionDash = (
  state: PropulsionDashState,
  nowMs: number,
): PropulsionDashProjection => {
  assertTime(nowMs);
  const active = state.activatedAtMs !== null && nowMs < state.activeUntilMs;
  const remainingMs = active ? Math.max(0, state.activeUntilMs - nowMs) : 0;
  return {
    active,
    canActivate: !active && nowMs >= state.cooldownUntilMs,
    remainingMs,
    cooldownRemainingMs: Math.max(0, state.cooldownUntilMs - nowMs),
    progress: active ? 1 - remainingMs / DASH_DURATION_MS : 0,
  };
};

export const activatePropulsionDash = (
  state: PropulsionDashState,
  nowMs: number,
  direction: DashVector,
): { state: PropulsionDashState; activated: boolean } => {
  assertTime(nowMs);
  const magnitude = Math.hypot(direction.x, direction.y);
  if (!projectPropulsionDash(state, nowMs).canActivate ||
      !Number.isFinite(magnitude) || magnitude < 0.001) {
    return { state, activated: false };
  }
  return {
    activated: true,
    state: {
      activatedAtMs: nowMs,
      activeUntilMs: nowMs + DASH_DURATION_MS,
      cooldownUntilMs: nowMs + DASH_COOLDOWN_MS,
      direction: { x: direction.x / magnitude, y: direction.y / magnitude },
    },
  };
};

/** Sweep displacement only through the active portion of this physics frame;
 * never teleport across pauses, frame skips or world boundaries. */
export const stepPropulsionDash = (
  state: PropulsionDashState,
  frameEndMs: number,
  frameDeltaMs: number,
  position: DashVector,
  bounds: DashBounds,
): DashStep => {
  assertTime(frameEndMs);
  if (!Number.isFinite(frameDeltaMs) || frameDeltaMs < 0 ||
      !Number.isFinite(position.x) || !Number.isFinite(position.y) ||
      !Number.isFinite(bounds.width) || !Number.isFinite(bounds.height) ||
      !Number.isFinite(bounds.radius) || bounds.radius < 0 ||
      bounds.width < bounds.radius * 2 || bounds.height < bounds.radius * 2) {
    throw new Error("Invalid dash step geometry or delta.");
  }
  const start = state.activatedAtMs;
  const activeMs = start === null ? 0 : Math.max(
    0,
    Math.min(frameEndMs, state.activeUntilMs) -
      Math.max(frameEndMs - frameDeltaMs, start),
  );
  const nextX = Math.max(bounds.radius, Math.min(
    bounds.width - bounds.radius,
    position.x + state.direction.x * activeMs * DASH_SPEED_UNITS_PER_MS,
  ));
  const nextY = Math.max(bounds.radius, Math.min(
    bounds.height - bounds.radius,
    position.y + state.direction.y * activeMs * DASH_SPEED_UNITS_PER_MS,
  ));
  return {
    position: { x: nextX, y: nextY },
    moved: Math.hypot(nextX - position.x, nextY - position.y),
    activeDuringFrame: activeMs > 0,
  };
};
