import type { CombatOverdrivePresentationProjection } from "./combatOverdrivePresentation";

interface RenderPoint {
  x: number;
  y: number;
}

/**
 * Direct Canvas2D adoption for the certified J2D-A presentation projection.
 * Owns no clocks, entity arrays, particles, React state or gameplay tuning.
 */
export const drawCombatOverdriveFieldOverlay = (
  ctx: CanvasRenderingContext2D,
  projection: CombatOverdrivePresentationProjection,
  viewportWidth: number,
  viewportHeight: number,
) => {
  if (!projection.active || projection.overlayAlpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = projection.overlayAlpha;
  ctx.fillStyle = "#155e75";
  ctx.fillRect(0, 0, viewportWidth, viewportHeight);
  ctx.restore();
};

export const drawCombatOverdriveSwarmHalo = (
  ctx: CanvasRenderingContext2D,
  projection: CombatOverdrivePresentationProjection,
  center: RenderPoint,
) => {
  if (!projection.active || projection.swarmHaloAlpha <= 0) return;

  const pulse = projection.activationPulse;
  const baseRadius = 28 + pulse * 10;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = projection.swarmHaloAlpha * (0.35 + pulse * 0.2);
  ctx.fillStyle = "#0891b2";
  ctx.beginPath();
  ctx.arc(center.x, center.y, baseRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 1.25 + pulse;
  for (let index = 0; index < projection.ringCount; index += 1) {
    ctx.globalAlpha =
      projection.swarmHaloAlpha * Math.max(0.22, 0.82 - index * 0.18);
    ctx.strokeStyle = index % 2 === 0 ? "#67e8f9" : "#fbbf24";
    ctx.beginPath();
    ctx.arc(
      center.x,
      center.y,
      baseRadius + 12 + index * 14,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }
  ctx.restore();
};
