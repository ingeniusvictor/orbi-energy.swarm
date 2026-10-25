/**
 * UX15-B pure preview projection: route space -> bounded 2D screen coordinates.
 * The live 1600x960 battle remains untouched; this is a QA adapter only.
 */
export interface RoutePreviewPlayer { manualX: number; y: number }
export interface RoutePreviewViewport { width: number; height: number; zoom: number }
export interface RoutePreviewCamera {
  anchorScreenX: number;
  playerScreenX: number;
  playerScreenY: number;
  viewportWidth: number;
  viewportHeight: number;
  zoom: number;
  visibleWorldLeft: number;
  visibleWorldRight: number;
}

const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));

export function projectRoutePreviewCamera(
  player: RoutePreviewPlayer,
  viewport: RoutePreviewViewport,
): RoutePreviewCamera {
  if (![viewport.width, viewport.height, viewport.zoom,
        player.manualX, player.y].every(Number.isFinite) ||
      viewport.width <= 0 || viewport.height <= 0 ||
      viewport.zoom < 0.7 || viewport.zoom > 1.08) {
    throw new RangeError("Invalid world route camera projection");
  }
  const anchorScreenX = viewport.width * 0.41;
  return {
    anchorScreenX,
    playerScreenX: anchorScreenX + player.manualX * viewport.zoom,
    playerScreenY: viewport.height / 2 + (player.y - 240) * viewport.zoom,
    viewportWidth: viewport.width,
    viewportHeight: viewport.height,
    zoom: viewport.zoom,
    visibleWorldLeft: -anchorScreenX / viewport.zoom,
    visibleWorldRight: (viewport.width - anchorScreenX) / viewport.zoom,
  };
}

export function stepRoutePreviewPlayer(
  player: RoutePreviewPlayer,
  movement: { x: number; y: number },
  deltaMs: number,
  viewport: Pick<RoutePreviewViewport, "width" | "height">,
  running: boolean,
): RoutePreviewPlayer {
  if (!running || deltaMs <= 0) return player;
  if (![player.manualX, player.y, movement.x, movement.y,
        deltaMs, viewport.width, viewport.height].every(Number.isFinite) ||
      deltaMs < 0 || viewport.width <= 0 || viewport.height <= 0) {
    throw new RangeError("Invalid preview movement");
  }
  const dt = Math.min(deltaMs, 50) / 1000;
  const magnitude = Math.hypot(movement.x, movement.y);
  if (magnitude < 0.001) return player;
  const intensity = Math.min(1, magnitude);
  const step = 170 * dt * intensity / magnitude;
  return {
    manualX: clamp(player.manualX + movement.x * step, -viewport.width * .23, viewport.width * .28),
    y: clamp(player.y + movement.y * step, 35, 445),
  };
}
