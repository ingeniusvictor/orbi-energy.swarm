/**
 * UX11-E — deterministic, movement-only propulsion dash.
 *
 * No wall-clock, RAF, UI, damage immunity, resonance or particle ownership.
 * The game passes simulation time and frame delta; pause and hit-stop cannot
 * advance the dash or its cooldown. A dash never grants invulnerability.
 */
export const DASH_DURATION_MS = 180;
export const DASH_COOLDOWN_MS = 18_000;
export const DASH_SPEED_UNITS_PER_MS = 0.72;
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

/** Shared legacy/physical active-frame calculation; never uses wall time. */
const dashActiveFrameMs = (
  state: PropulsionDashState, frameEndMs: number, frameDeltaMs: number,
): number => {
  const start = state.activatedAtMs;
  return start === null ? 0 : Math.max(
    0,
    Math.min(frameEndMs, state.activeUntilMs) -
      Math.max(frameEndMs - frameDeltaMs, start),
  );
};

/**
 * UX15-C3B-2: exactly the existing Dash speed, duration and cooldown
 * but without the old WORLD_WIDTH=1600 X clamp. Retain certified vertical
 * boundaries and radius. The caller is responsible for normal gameplay
 * gates and adding physical route autoscroll separately.
 *
 * Legacy stepPropulsionDash remains unchanged for all existing modes.
 */
export const stepRoutePropulsionDash = (
  state: PropulsionDashState,
  frameEndMs: number,
  frameDeltaMs: number,
  position: DashVector,
  verticalBounds: {height:number; radius:number},
): DashStep => {
  assertTime(frameEndMs);
  if (!Number.isFinite(frameDeltaMs) || frameDeltaMs<0 ||
      !Number.isFinite(position.x) || !Number.isFinite(position.y) ||
      !Number.isFinite(verticalBounds.height) ||
      !Number.isFinite(verticalBounds.radius) ||
      verticalBounds.radius<0 ||
      verticalBounds.height<verticalBounds.radius*2) {
    throw new Error("Invalid route Dash step geometry or delta.");
  }
  const activeMs=dashActiveFrameMs(state,frameEndMs,frameDeltaMs);
  const nextX=position.x+state.direction.x*activeMs*DASH_SPEED_UNITS_PER_MS;
  const nextY=Math.max(verticalBounds.radius,Math.min(
    verticalBounds.height-verticalBounds.radius,
    position.y+state.direction.y*activeMs*DASH_SPEED_UNITS_PER_MS,
  ));
  if (!Number.isFinite(nextX)||!Number.isFinite(nextY))
    throw new RangeError("Invalid route Dash displacement");
  return {
    position:{x:nextX,y:nextY},
    moved:Math.hypot(nextX-position.x,nextY-position.y),
    activeDuringFrame:activeMs>0,
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
  const activeMs = dashActiveFrameMs(state,frameEndMs,frameDeltaMs);
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
