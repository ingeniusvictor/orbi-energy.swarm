import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";

/**
 * UX02: horizontal expansion of the actual world, not a CSS stretch.
 * Height remains the original 480 world-view pixels, preserving ship,
 * projectile and hazard sizes. The *additional* width exposes more world.
 * The compact HUD is outside the stage and consumes 42/45 visual CSS pixels.
 * Sizing follows the same visual viewport as UX01's fullscreen stage.
 */
export const projectPanoramicCanvasViewport = ({
  width,
  height,
  immersive,
}: {
  width: number;
  height: number;
  immersive: boolean;
}): { width: number; height: number } => {
  if (!immersive || !Number.isFinite(width) || !Number.isFinite(height) ||
      width <= 0 || height <= 0) {
    return { width: CANVAS_WIDTH, height: CANVAS_HEIGHT };
  }
  const hud = height <= 390 ? 42 : 45;
  const stageHeight = Math.max(1, height - hud);
  return {
    // A wider viewport draws more *world*, never scales one world unit
    // differently on X/Y; keep a fixed 480-unit vertical field of view.
    width: Math.max(1, Math.round(CANVAS_HEIGHT * width / stageHeight)),
    height: CANVAS_HEIGHT,
  };
};
