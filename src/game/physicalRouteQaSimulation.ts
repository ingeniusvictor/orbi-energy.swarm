import {
  advancePhysicalRouteFrame,
  createPhysicalRouteFrame,
  planRouteOriginShift,
  rebasePhysicalRouteFrame,
  shiftRouteLocalPoint,
  type PhysicalRouteFrame,
  type RouteLocalPoint,
} from "./physicalRouteSpace";
import {
  ROUTE_PHYSICAL_CAMERA_ANCHOR_X,
  shiftRoutePhysicalCamera,
  stepRoutePhysicalCamera,
  type RoutePhysicalCamera,
  type RoutePhysicalViewport,
} from "./routePhysicalCamera";
import { createRouteCursor } from "./worldRouteCore";
import {
  canAdvanceRoute,
  ROUTE_QA_SPEED_UNITS_PER_SECOND,
  stepRouteClock,
  type RouteRunGates,
} from "./worldRouteClock";

/**
 * UX15-C3A-2 — one genuine local player and one physical following camera.
 * This is an ISOLATED world traversal QA scene, not an EnergySwarmGame run.
 *
 * Only two spatial owners exist here: leader + camera. Atomic rebasing of
 * enemies / projectiles / ORBI / boss belongs to UX15-C3A-3 and C3B.
 */
export const ROUTE_PHYSICAL_QA_MANUAL_SPEED = 165;
export const ROUTE_PHYSICAL_QA_VERTICAL_MARGIN = 42;
export const ROUTE_PHYSICAL_QA_SEED = "asteria-physical-qa";

export interface PhysicalRouteQaState {
  readonly frame: PhysicalRouteFrame;
  readonly player: RouteLocalPoint;
  readonly camera: RoutePhysicalCamera;
  readonly rebases: number;
  readonly physicsTicks: number;
}

export interface PhysicalRouteQaInput {
  readonly x: number;
  readonly y: number;
}

export function createPhysicalRouteQaState(
  viewport: RoutePhysicalViewport,
  seed = ROUTE_PHYSICAL_QA_SEED,
): PhysicalRouteQaState {
  const player = { x: 800, y: 480 };
  const camera = {
    localX: player.x - viewport.width * ROUTE_PHYSICAL_CAMERA_ANCHOR_X / viewport.zoom,
    localY: Math.max(0, player.y - viewport.height / (2 * viewport.zoom)),
  };
  // Validate viewport using the certified projection routine. Invalid zoom
  // or impossible sizes must not leak a half-constructed QA simulation.
  stepRoutePhysicalCamera(camera, player, viewport, 0);
  return {
    frame: createPhysicalRouteFrame(createRouteCursor(seed)),
    player,
    camera,
    rebases: 0,
    physicsTicks: 0,
  };
}

export function stepPhysicalRouteQa(
  state: PhysicalRouteQaState,
  deltaMs: number,
  manualInput: PhysicalRouteQaInput,
  viewport: RoutePhysicalViewport,
  gates: RouteRunGates,
): PhysicalRouteQaState {
  if (!Number.isFinite(deltaMs) || deltaMs < 0 ||
      !Number.isFinite(manualInput.x) || !Number.isFinite(manualInput.y)) {
    throw new RangeError("Invalid physical QA delta or direction");
  }
  if (!canAdvanceRoute(gates) || deltaMs === 0) return state;

  const dt = Math.min(50,deltaMs);
  const nextCursor = stepRouteClock(
    state.frame.cursor,
    dt,
    ROUTE_QA_SPEED_UNITS_PER_SECOND,
    gates,
  );
  const advancement = advancePhysicalRouteFrame(state.frame,nextCursor);

  // Manual input is a real addition to physical position; the scenery does
  // NOT impersonate it. Diagonal normalization prevents speed exploits.
  const length = Math.hypot(manualInput.x,manualInput.y);
  const norm = length > 1 ? 1 / length : 1;
  const manualDx = manualInput.x * norm * ROUTE_PHYSICAL_QA_MANUAL_SPEED * dt / 1000;
  const manualDy = manualInput.y * norm * ROUTE_PHYSICAL_QA_MANUAL_SPEED * dt / 1000;
  let player = {
    x: state.player.x + advancement.movedX + manualDx,
    y: Math.max(ROUTE_PHYSICAL_QA_VERTICAL_MARGIN,
      Math.min(960 - ROUTE_PHYSICAL_QA_VERTICAL_MARGIN,state.player.y + manualDy)),
  };
  let camera = stepRoutePhysicalCamera(
    state.camera,player,viewport,dt,
  ).camera;
  let frame = advancement.frame;
  let rebases = state.rebases;
  const deltaX = planRouteOriginShift(frame,player.x);
  if (deltaX !== null) {
    // C3A-2 owns ONLY player and camera, both shifted on the same tick.
    // Future C3A-3 must replace this with an atomic all-entities adapter.
    frame = rebasePhysicalRouteFrame(frame,deltaX).nextFrame;
    player = shiftRouteLocalPoint(player,deltaX);
    camera = shiftRoutePhysicalCamera(camera,deltaX);
    rebases++;
  }
  return {
    frame,
    player,
    camera,
    rebases,
    physicsTicks: state.physicsTicks + 1,
  };
}
