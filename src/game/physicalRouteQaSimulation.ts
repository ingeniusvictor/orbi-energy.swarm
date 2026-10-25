import {
  advancePhysicalRouteFrame,
  createPhysicalRouteFrame,
  planRouteOriginShift,
  type PhysicalRouteFrame,
  type RouteLocalPoint,
} from "./physicalRouteSpace";
import {
  ROUTE_PHYSICAL_CAMERA_ANCHOR_X,
  stepRoutePhysicalCamera,
  type RoutePhysicalCamera,
  type RoutePhysicalViewport,
} from "./routePhysicalCamera";
import { createRouteCursor } from "./worldRouteCore";
import { rebaseRouteCoordinateOwners } from "./routeCoordinateOwners";
import { createRouteQaEncounter, stepRouteQaEncounter, type RouteQaEncounter } from "./routePhysicalQaEncounter";
import { createRouteDynamicQaState, stepRouteDynamicQaEncounter, type RouteDynamicQaState } from "./routeDynamicEncounter";
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
  readonly encounter: RouteQaEncounter;
  readonly dynamic: RouteDynamicQaState | null;
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
  enableDynamicQa = false,
): PhysicalRouteQaState {
  const player = { x: 800, y: 480 };
  const camera = {
    localX: player.x - viewport.width * ROUTE_PHYSICAL_CAMERA_ANCHOR_X / viewport.zoom,
    localY: Math.max(0, player.y - viewport.height / (2 * viewport.zoom)),
  };
  // Validate viewport using the certified projection routine. Invalid zoom
  // or impossible sizes must not leak a half-constructed QA simulation.
  stepRoutePhysicalCamera(camera, player, viewport, 0);
  const encounter=createRouteQaEncounter(player);
  // C3B-1 is a separate opt-in. The C3A-3 lab keeps its fixed actors and
  // previous snapshots/tests unchanged unless this flag is explicitly true.
  if(enableDynamicQa){
    encounter.enemies=[];
    encounter.projectiles=[];
    encounter.resources=[];
  }
  return {
    frame: createPhysicalRouteFrame(createRouteCursor(seed)),
    player,
    camera,
    encounter,
    dynamic:enableDynamicQa?createRouteDynamicQaState():null,
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
  let encounter = stepRouteQaEncounter(state.encounter, player);
  let dynamic=state.dynamic;
  if(dynamic){
    const next=stepRouteDynamicQaEncounter(
      encounter,dynamic,player,camera,viewport,dt,frame.cursor.simulatedMs,
    );
    encounter=next.encounter;
    dynamic=next.dynamic;
  }
  let rebases = state.rebases;
  const deltaX = planRouteOriginShift(frame,player.x);
  if (deltaX !== null) {
    // C3A-3: one atomic rebase for all controlled encounter owners.
    // Clone first: previous simulation snapshots remain immutable to tests/UI.
    encounter = structuredClone(encounter);
    const transaction = rebaseRouteCoordinateOwners({
      ...encounter, frame, player, camera,
    },deltaX,{
      phase:"TICK_BOUNDARY",unresolvedBossPhase:false,unregisteredWorldOwners:false,
    });
    frame = transaction.frame;
    rebases++;
  }
  return {
    frame,
    player,
    camera,
    encounter,
    dynamic,
    rebases,
    physicsTicks: state.physicsTicks + 1,
  };
}
