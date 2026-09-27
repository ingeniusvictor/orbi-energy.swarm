export interface FotonTacticalPose {
  facingAngle: number;
  scanAngle: number;
  shellPulse: number;
  lensOffsetX: number;
  lensOffsetY: number;
}

export interface FotonTacticalDrawOptions {
  x: number;
  y: number;
  time: number;
  pointerX: number;
  pointerY: number;
}

export const projectFotonTacticalPose = (
  time: number,
  x: number,
  y: number,
  pointerX: number,
  pointerY: number,
): FotonTacticalPose => {
  const dx = pointerX - x;
  const dy = pointerY - y;
  const facingAngle = Math.atan2(dy, dx);
  const scanAngle = time * 0.0018;
  const shellPulse =
    1 + Math.sin(time * 0.0042) * 0.025;
  const lensTravel = 1.6;

  return {
    facingAngle,
    scanAngle,
    shellPulse,
    lensOffsetX:
      Math.cos(facingAngle) * lensTravel,
    lensOffsetY:
      Math.sin(facingAngle) * lensTravel,
  };
};

const arcStroke = (
  ctx: CanvasRenderingContext2D,
  radius: number,
  start: number,
  end: number,
  color: string,
  width: number,
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(0, 0, radius, start, end);
  ctx.stroke();
};

export const drawFotonTacticalAvatar = (
  ctx: CanvasRenderingContext2D,
  options: FotonTacticalDrawOptions,
) => {
  const pose = projectFotonTacticalPose(
    options.time,
    options.x,
    options.y,
    options.pointerX,
    options.pointerY,
  );

  ctx.save();
  ctx.translate(options.x, options.y);
  ctx.scale(pose.shellPulse, pose.shellPulse);

  // Soft command-core aura. Kept as flat fills to avoid per-frame gradient
  // allocations in the gameplay hot path.
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#22d3ee";
  ctx.beginPath();
  ctx.arc(0, 0, 18.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Mechanical top/bottom modules inspired by the GLB silhouette.
  ctx.fillStyle = "#78716c";
  ctx.fillRect(-3.4, -17.2, 6.8, 5);
  ctx.fillRect(-3.2, 12.2, 6.4, 5);
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(-2.1, -18.3, 4.2, 2);
  ctx.fillStyle = "#8b5cf6";
  ctx.fillRect(-2.1, 16.1, 4.2, 1.5);

  // Metallic spherical shell.
  ctx.shadowColor = "rgba(34,211,238,0.45)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#a8a29e";
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, 13.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Dark segmented seams.
  arcStroke(
    ctx,
    11.8,
    -2.95,
    -1.55,
    "#475569",
    2.3,
  );
  arcStroke(
    ctx,
    11.8,
    -1.35,
    0.05,
    "#d6d3d1",
    2.7,
  );
  arcStroke(
    ctx,
    11.8,
    0.25,
    1.58,
    "#7c3aed",
    2.2,
  );
  arcStroke(
    ctx,
    11.8,
    1.82,
    2.85,
    "#67e8f9",
    2.2,
  );

  // Additional shell plates give the miniature the same plated-body read
  // as the menu GLB without using a texture.
  ctx.strokeStyle = "#57534e";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-11.2, -4.5);
  ctx.lineTo(-6.5, -7.8);
  ctx.lineTo(-2.7, -12.1);
  ctx.moveTo(10.8, -4.1);
  ctx.lineTo(6.4, -7.4);
  ctx.lineTo(2.8, -12);
  ctx.moveTo(-10.8, 4.5);
  ctx.lineTo(-6.2, 7.7);
  ctx.lineTo(-2.9, 11.9);
  ctx.moveTo(10.8, 4.5);
  ctx.lineTo(6.2, 7.8);
  ctx.lineTo(2.8, 11.9);
  ctx.stroke();

  // Central aperture collar.
  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(0, 0, 8.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, 0, 7.1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#7c3aed";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 5.3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#020617";
  ctx.beginPath();
  ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
  ctx.fill();

  // Directional optical core. The lens shifts inside the aperture rather than
  // rotating the whole avatar, preserving the spherical GLB identity.
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(
    pose.lensOffsetX * 0.42,
    pose.lensOffsetY * 0.42,
    2.2,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.fillStyle = "#020617";
  ctx.beginPath();
  ctx.arc(
    pose.lensOffsetX * 0.65,
    pose.lensOffsetY * 0.65,
    1.35,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.fillStyle = "#67e8f9";
  ctx.beginPath();
  ctx.arc(
    pose.lensOffsetX,
    pose.lensOffsetY,
    0.9,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(
    pose.lensOffsetX - 0.35,
    pose.lensOffsetY - 0.45,
    0.35,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Thin rotating command scan accent.
  ctx.strokeStyle = "rgba(103,232,249,0.68)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(
    0,
    0,
    16.1,
    pose.scanAngle,
    pose.scanAngle + Math.PI * 0.52,
  );
  ctx.stroke();

  ctx.strokeStyle = "rgba(245,158,11,0.58)";
  ctx.beginPath();
  ctx.arc(
    0,
    0,
    16.1,
    pose.scanAngle + Math.PI,
    pose.scanAngle + Math.PI * 1.32,
  );
  ctx.stroke();

  ctx.restore();
};
