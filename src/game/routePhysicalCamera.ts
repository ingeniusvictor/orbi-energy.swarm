import type { RouteLocalPoint } from "./physicalRouteSpace";

/**
 * UX15-C3A-1 — pure physical camera projection for a future opt-in route run.
 * Does NOT import or mutate EnergySwarmGame. Legacy 1600x960 camera remains
 * authoritative in ordinary Campaign, Score Attack, and currently World Route.
 */
export const ROUTE_PHYSICAL_CAMERA_ANCHOR_X = 0.42;
export const ROUTE_PHYSICAL_CAMERA_SMOOTHING_MS = 125;
export const ROUTE_PHYSICAL_WORLD_HEIGHT = 960;
export const ROUTE_PHYSICAL_MIN_ZOOM = 0.70;
export const ROUTE_PHYSICAL_MAX_ZOOM = 1.08;

export interface RoutePhysicalViewport {
  readonly width: number;
  readonly height: number;
  readonly zoom: number;
}

export interface RoutePhysicalCamera {
  readonly localX: number;
  readonly localY: number;
}

export interface RouteCameraProjection {
  readonly camera: RoutePhysicalCamera;
  readonly playerScreenX: number;
  readonly playerScreenY: number;
  readonly visibleLocalLeft: number;
  readonly visibleLocalRight: number;
  readonly visibleLocalTop: number;
  readonly visibleLocalBottom: number;
}

const clamp = (value: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(value, hi));

const validFinite = (value: number): boolean => Number.isFinite(value);

const assertViewport = (view: RoutePhysicalViewport): void => {
  if (![view.width, view.height, view.zoom].every(validFinite) ||
      view.width <= 0 || view.height <= 0 ||
      view.zoom < ROUTE_PHYSICAL_MIN_ZOOM ||
      view.zoom > ROUTE_PHYSICAL_MAX_ZOOM) {
    throw new RangeError("Invalid route physical camera viewport");
  }
};
const assertPoint = (point: RouteLocalPoint): void => {
  if (![point.x, point.y].every(validFinite))
    throw new RangeError("Invalid local route position");
};

export function screenToRouteLocal(
  screen: RouteLocalPoint,
  camera: RoutePhysicalCamera,
  viewport: RoutePhysicalViewport,
): RouteLocalPoint {
  assertViewport(viewport);
  assertPoint(screen);
  assertPoint({x:camera.localX,y:camera.localY});
  return {
    x: camera.localX + screen.x / viewport.zoom,
    y: camera.localY + screen.y / viewport.zoom,
  };
}

export function routeLocalToScreen(
  local: RouteLocalPoint,
  camera: RoutePhysicalCamera,
  viewport: RoutePhysicalViewport,
): RouteLocalPoint {
  assertViewport(viewport);
  assertPoint(local);
  assertPoint({x:camera.localX,y:camera.localY});
  return {
    x: (local.x - camera.localX) * viewport.zoom,
    y: (local.y - camera.localY) * viewport.zoom,
  };
}

/** No WORLD_WIDTH clamp. X follows the actual physical player and can be
 * negative after rebasing; only Y is still bounded by the certified 960
 * gameplay units. Full route-boss envelopes are deliberately deferred. */
export function stepRoutePhysicalCamera(
  previous: RoutePhysicalCamera,
  player: RouteLocalPoint,
  viewport: RoutePhysicalViewport,
  simulatedDeltaMs: number,
  options?: {
    readonly anchorX?: number;
    readonly worldHeight?: number;
    readonly smoothingMs?: number;
  },
): RouteCameraProjection {
  assertViewport(viewport);
  assertPoint(player);
  assertPoint({x:previous.localX,y:previous.localY});
  if (!Number.isFinite(simulatedDeltaMs) || simulatedDeltaMs < 0 ||
      simulatedDeltaMs > 50 + 1e-7) {
    throw new RangeError("Physical camera requires bounded simulation delta");
  }

  const anchorX = options?.anchorX ?? ROUTE_PHYSICAL_CAMERA_ANCHOR_X;
  const worldHeight = options?.worldHeight ?? ROUTE_PHYSICAL_WORLD_HEIGHT;
  const smoothingMs = options?.smoothingMs ?? ROUTE_PHYSICAL_CAMERA_SMOOTHING_MS;
  if (![anchorX, worldHeight, smoothingMs].every(validFinite) ||
      anchorX <= 0 || anchorX >= 1 || worldHeight <= 0 ||
      smoothingMs <= 0) {
    throw new RangeError("Invalid physical camera settings");
  }
  const desiredLocalX = player.x - (viewport.width * anchorX) / viewport.zoom;
  const maxCameraY = Math.max(0, worldHeight - viewport.height / viewport.zoom);
  const desiredLocalY = clamp(
    player.y - viewport.height / (2 * viewport.zoom),
    0,
    maxCameraY,
  );
  // Smooth following uses simulation delta only: on pause, do not move even if
  // React/UI re-renders this projection.
  const blend = simulatedDeltaMs === 0
    ? 0 : 1 - Math.exp(-simulatedDeltaMs / smoothingMs);
  const camera = {
    localX: previous.localX + (desiredLocalX - previous.localX) * blend,
    localY: clamp(
      previous.localY + (desiredLocalY - previous.localY) * blend,
      0,
      maxCameraY,
    ),
  };
  const screen = routeLocalToScreen(player, camera, viewport);
  return {
    camera,
    playerScreenX: screen.x,
    playerScreenY: screen.y,
    visibleLocalLeft: camera.localX,
    visibleLocalRight: camera.localX + viewport.width / viewport.zoom,
    visibleLocalTop: camera.localY,
    visibleLocalBottom: camera.localY + viewport.height / viewport.zoom,
  };
}

/** Pure helper for future C3A-3 atomic camera+actor rebase. No UI mutation. */
export function shiftRoutePhysicalCamera(
  camera: RoutePhysicalCamera,
  deltaX: number,
): RoutePhysicalCamera {
  assertPoint({x:camera.localX,y:camera.localY});
  if (!Number.isFinite(deltaX)) throw new RangeError("Invalid camera rebase");
  return {
    localX: camera.localX - deltaX,
    localY: camera.localY,
  };
}
