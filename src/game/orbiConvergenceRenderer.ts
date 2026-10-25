/** UX14-B — lightweight Canvas2D effect; bounded geometry, no per-frame particles. */
import type { OrbiMember } from "./types";
import type { ConvergencePoint, ConvergenceState } from "./orbiConvergence";
import { CONVERGENCE_BEAM_MS, CONVERGENCE_CHANNEL_MS, CONVERGENCE_RANGE } from "./orbiConvergence";

export function drawOrbiConvergence(
  ctx: CanvasRenderingContext2D,
  state: ConvergenceState,
  nowMs: number,
  leader: ConvergencePoint,
  swarm: readonly OrbiMember[],
  reduced: boolean,
) {
  if (state.channelUntilMs !== null) {
    const progress = Math.max(0, Math.min(1,
      1 - (state.channelUntilMs - nowMs) / CONVERGENCE_CHANNEL_MS));
    const count = Math.min(swarm.length, 24);
    const opacity = (reduced ? .17 : .40) * (.25 + progress * .75);
    ctx.save();
    ctx.lineCap = "round";
    ctx.shadowColor = "#67e8f9";
    ctx.shadowBlur = reduced ? 0 : 6;
    for (let i = 0; i < count; i++) {
      const unit = swarm[i];
      const tipX = unit.x + (leader.x - unit.x) * progress;
      const tipY = unit.y + (leader.y - unit.y) * progress;
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = i % 3 === 0 ? "#f8d67b" : "#67e8f9";
      ctx.lineWidth = 1 + progress;
      ctx.beginPath();
      ctx.moveTo(unit.x, unit.y);
      ctx.quadraticCurveTo(
        (unit.x + leader.x) * .5 + Math.sin(i * 2.37 + nowMs * .008) * 6,
        (unit.y + leader.y) * .5 + Math.cos(i * 1.77 + nowMs * .008) * 6,
        tipX, tipY,
      );
      ctx.stroke();
    }
    ctx.globalAlpha = opacity;
    ctx.shadowBlur = reduced ? 0 : 12;
    ctx.strokeStyle = "#ffe5a4";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(leader.x, leader.y, 20 + progress * 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const trail = state.trail;
  if (!trail) return;
  const age = nowMs - trail.firedAtMs;
  if (age < 0 || age >= CONVERGENCE_BEAM_MS) return;
  const fade = 1 - age / CONVERGENCE_BEAM_MS;
  const alpha = (reduced ? .19 : .45) * fade;
  const endX = trail.x + trail.dx * CONVERGENCE_RANGE;
  const endY = trail.y + trail.dy * CONVERGENCE_RANGE;
  const normalX = -trail.dy, normalY = trail.dx;
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "#4fe8ff";
  ctx.lineWidth = reduced ? 7 : 14;
  ctx.shadowColor = "#32dfff";
  ctx.shadowBlur = reduced ? 0 : 14;
  ctx.beginPath();
  ctx.moveTo(trail.x, trail.y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "#fff1bb";
  ctx.lineWidth = reduced ? 1.8 : 3.5;
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(trail.x, trail.y);
  // Exactly 16 procedural line segments, no texture allocations.
  for (let segment = 1; segment <= 16; segment++) {
    const t = segment / 16;
    const jag = segment === 16 ? 0 : Math.sin(segment * 17.1 + trail.firedAtMs * .017) * 4.5;
    ctx.lineTo(
      trail.x + trail.dx * CONVERGENCE_RANGE * t + normalX * jag,
      trail.y + trail.dy * CONVERGENCE_RANGE * t + normalY * jag,
    );
  }
  ctx.stroke();
  ctx.restore();
}
