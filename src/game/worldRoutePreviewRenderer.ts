import { ASTERIA_WORLD_ID, getRouteWindow, stableRouteHash, type RouteCursor } from "./worldRouteCore";
import { projectRoutePreviewCamera, type RoutePreviewPlayer } from "./worldRouteCamera";

/** UX15-B Canvas2D engineering mock-up. NOT final ASTERIA art or gameplay. */
const W = 800, H = 480;
const contrast = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

const drawRidge = (
  ctx: CanvasRenderingContext2D,
  shift: number, y: number, amplitude: number, spacing: number,
  color: string, seed: string,
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-spacing, H);
  for (let i = -2; i <= Math.ceil(W / spacing) + 3; i++) {
    const jitter = (stableRouteHash(seed + ":" + i) % 100) / 100;
    const x = i * spacing - ((shift % spacing) + spacing) % spacing;
    ctx.lineTo(x, y - (jitter - .32) * amplitude);
    ctx.lineTo(x + spacing * .55, y + (jitter - .40) * amplitude);
  }
  ctx.lineTo(W + spacing, H);
  ctx.closePath();
  ctx.fill();
};

const drawSection = (
  ctx: CanvasRenderingContext2D,
  x: number, right: number, centerX: number,
  kind: string, accent: string, variant: number,
) => {
  const width = right - x;
  if (right < -40 || x > W + 40 || width <= 0) return;

  // Distant architecture changes with each deterministic segment; all props
  // remain entirely non-collidable and behind the real battle plane.
  ctx.save();
  ctx.globalAlpha = .63;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  const towerSpacing = 160 + variant * 16;
  const first = Math.max(0, Math.floor(-x / towerSpacing));
  const last = Math.min(Math.ceil(width / towerSpacing), Math.ceil((W - x) / towerSpacing));
  for (let j = first; j <= last; j++) {
    const sx = x + (j + .5) * towerSpacing;
    if (sx < 0 || sx > W) continue;
    const tall = 38 + stableRouteHash(kind + ":" + j + ":" + variant) % 55;
    const towerBase = 280;
    ctx.fillStyle = "#0d2842";
    ctx.fillRect(sx - 15, towerBase - tall, 30, tall);
    ctx.strokeRect(sx - 15, towerBase - tall, 30, tall);
    ctx.beginPath();ctx.moveTo(sx, towerBase - tall);ctx.lineTo(sx, towerBase - tall - 16);ctx.stroke();
    ctx.fillStyle = accent;
    ctx.fillRect(sx - 4, towerBase - tall - 3, 8, 4);
  }
  if (kind === "CANYON_SKY") {
    ctx.fillStyle = "#162945";
    ctx.beginPath();ctx.moveTo(x, 280);
    ctx.lineTo(x + width * .2, 170);ctx.lineTo(x + width * .38, 255);
    ctx.lineTo(x + width * .72, 125);ctx.lineTo(right, 278);
    ctx.closePath();ctx.fill();
  }
  if (kind === "ARRIVAL_GATE" || kind === "TRANSIT_VISTA") {
    const portalX = contrast(x + width * .63, -200, W + 200);
    ctx.strokeStyle = accent;ctx.lineWidth = 5;
    ctx.beginPath();ctx.ellipse(portalX, 245, 40, 87, 0, 0, Math.PI * 2);ctx.stroke();
    ctx.globalAlpha = .19;ctx.fillStyle = accent;
    ctx.beginPath();ctx.ellipse(portalX, 245, 36, 80, 0, 0, Math.PI * 2);ctx.fill();
  }
  if (kind === "RELAY_SPAN") {
    ctx.strokeStyle = accent;ctx.lineWidth = 2;
    ctx.beginPath();ctx.moveTo(Math.max(0, x), 170);
    ctx.lineTo(Math.min(W, right), 170);ctx.stroke();
  }
  if (kind === "SIGNAL_BREACH") {
    ctx.strokeStyle = "#ec5566";ctx.lineWidth = 3;
    const bx = contrast(x + width * .45, -10, W + 10);
    ctx.beginPath();ctx.moveTo(bx - 15, 130);ctx.lineTo(bx + 7, 187);
    ctx.lineTo(bx - 5, 222);ctx.lineTo(bx + 28, 290);ctx.stroke();
  }

  // The route itself is broad and visually guided, not a solid collision wall.
  ctx.globalAlpha = .42;
  ctx.fillStyle = "#064364";
  ctx.fillRect(Math.max(0, x), 326, Math.max(0, Math.min(W, right) - Math.max(0, x)), 46);
  ctx.strokeStyle = accent;ctx.lineWidth = 2;
  for (const y of [321, 380]) {
    ctx.beginPath();ctx.moveTo(Math.max(0, x), y);
    ctx.lineTo(Math.min(W, right), y);ctx.stroke();
  }
  ctx.globalAlpha = .9;
  for (let j = Math.max(0, Math.floor(-x / 86)); j <= Math.min(120, Math.ceil((W - x) / 86)); j++) {
    const sx = x + j * 86;
    if (sx < 0 || sx >= W) continue;
    ctx.fillStyle = accent;
    ctx.fillRect(sx, 344, 27, 2);
  }
  ctx.globalAlpha = .9;
  if (x > -30 && x < W + 30) {
    ctx.strokeStyle = accent; ctx.lineWidth = 2;
    ctx.beginPath();ctx.moveTo(x, 160);ctx.lineTo(x, 393);ctx.stroke();
    ctx.fillStyle = "#a9d3e4";ctx.font = "10px monospace";
    ctx.fillText(kind.replaceAll("_"," "), x + 8, 397);
  }
  ctx.restore();
};

/**
 * Fixed 800x480 logical canvas, viewport resized by CSS only, no WebGL contexts
 * and no detached scenery objects held after each frame. Segment culling bounded.
 */
export function drawWorldRouteQaScene(
  ctx: CanvasRenderingContext2D, cursor: RouteCursor,
  player: RoutePreviewPlayer,
): void {
  if (cursor.worldId !== ASTERIA_WORLD_ID) throw new RangeError("Unexpected QA world");
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#030c24");
  sky.addColorStop(.44, "#17375b");
  sky.addColorStop(.75, "#285c83");
  sky.addColorStop(1, "#060e26");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

  const cam = projectRoutePreviewCamera(player, {width: W, height: H, zoom: 1});
  const window = getRouteWindow(cursor, 1, 2);
  // Parallax uses segment-local displacement. The loop is capped and
  // independent of total absolute route distance.
  const parallax = cursor.segmentOrdinal * 47 + cursor.offset;
  for (let i = 0; i < 85; i++) {
    const ux = stableRouteHash(`asteria-star-${i}`) % W;
    const uy = stableRouteHash(`asteria-star-y-${i}`) % 265;
    const speed = (i % 4 + 1) * .035;
    const sx = ((ux - parallax * speed) % W + W) % W;
    ctx.globalAlpha = .25 + (i % 5) * .12;
    ctx.fillStyle = "#dbf4ff";
    ctx.fillRect(sx, uy, i % 7 === 0 ? 2 : 1, 1);
  }
  ctx.globalAlpha = 1;

  const glow = ctx.createRadialGradient(420, 115, 15, 420, 115, 195);
  glow.addColorStop(0,"rgba(80,224,255,.20)");
  glow.addColorStop(1,"rgba(65,104,216,0)");
  ctx.fillStyle = glow;ctx.fillRect(180, 0, 520, 300);
  ctx.fillStyle = "#426f93";
  ctx.beginPath();ctx.arc(650 - parallax * .004 % 45, 103, 73, 0, Math.PI * 2);ctx.fill();
  ctx.strokeStyle = "rgba(141,213,244,.28)";ctx.lineWidth = 8;
  ctx.beginPath();ctx.ellipse(650 - parallax * .004 % 45, 103, 99, 22, -.28, 0, Math.PI*2);ctx.stroke();

  drawRidge(ctx, parallax * .11, 259, 98, 138, "#1b344f", "far");
  drawRidge(ctx, parallax * .25, 292, 76, 92, "#10283f", "near");

  for (const visible of window) {
    const start = cam.anchorScreenX + visible.startRelative;
    const end = cam.anchorScreenX + visible.endRelative;
    drawSection(ctx, start, end, cam.anchorScreenX,
      visible.segment.kind, visible.segment.accent, visible.segment.decorationVariant);
  }

  // Energy is a gold instrumentation marker only: no simulated attacks/ORBIs.
  const x = cam.playerScreenX, y = cam.playerScreenY;
  ctx.save();
  ctx.shadowBlur = 24;ctx.shadowColor = "#fbbf24";
  ctx.fillStyle = "#f5b547"; ctx.strokeStyle = "#ffe7a0"; ctx.lineWidth = 2;
  ctx.beginPath();ctx.arc(x, y, 16, 0, Math.PI*2);ctx.fill();ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#11243d";
  ctx.beginPath();ctx.arc(x - 6, y - 3, 3.5, 0, Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x + 6, y - 3, 3.5, 0, Math.PI*2);ctx.fill();
  ctx.strokeStyle = "rgba(240,236,180,.63)";
  ctx.beginPath();ctx.arc(x, y, 26, -.55, .55);ctx.stroke();
  ctx.restore();

  // QA coordinate guides never turn into active collision/attack systems.
  ctx.strokeStyle = "rgba(62,221,255,.22)";ctx.lineWidth = 1;
  ctx.setLineDash([6,9]);
  ctx.beginPath();ctx.moveTo(0, 240);ctx.lineTo(W, 240);ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(3,16,36,.55)";ctx.fillRect(11,11,205,26);
  ctx.fillStyle = "#c7e9f4";ctx.font = "bold 13px monospace";
  ctx.fillText("ASTERIA · ROUTE QA", 21, 29);
  ctx.restore();
}
