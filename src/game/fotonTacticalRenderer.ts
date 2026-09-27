export interface FotonTacticalPose {
  facingAngle: number;
  scanAngle: number;
  shellPulse: number;
  lensOffsetX: number;
  lensOffsetY: number;
}

export type FotonIntegrityStatus =
  | "HEALTHY"
  | "PRESSURED"
  | "CRITICAL";

export interface FotonIntegrityVisual {
  ratio: number;
  status: FotonIntegrityStatus;
  color: string;
  coreColor: string;
}

export interface FotonTacticalDrawOptions {
  x: number;
  y: number;
  time: number;
  pointerX: number;
  pointerY: number;
  shieldRatio?: number;
  damageHighlightStrength?: number;
}

export const projectFotonIntegrityVisual = (
  shieldRatio: number,
): FotonIntegrityVisual => {
  const ratio = Number.isFinite(shieldRatio)
    ? Math.max(0, Math.min(1, shieldRatio))
    : 0;

  if (ratio < 0.33) {
    return {
      ratio,
      status: "CRITICAL",
      color: "#fb7185",
      coreColor: "#f43f5e",
    };
  }

  if (ratio < 0.66) {
    return {
      ratio,
      status: "PRESSURED",
      color: "#fbbf24",
      coreColor: "#f59e0b",
    };
  }

  return {
    ratio,
    status: "HEALTHY",
    color: "#67e8f9",
    coreColor: "#22d3ee",
  };
};

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
  const integrity = projectFotonIntegrityVisual(
    options.shieldRatio ?? 1,
  );
  const damageHighlightStrength = Number.isFinite(
    options.damageHighlightStrength,
  )
    ? Math.max(
        0,
        Math.min(1, options.damageHighlightStrength ?? 0),
      )
    : 0;

  ctx.save();
  ctx.translate(options.x, options.y);
  ctx.scale(pose.shellPulse, pose.shellPulse);

  // Real integrity ring: slate track + current shield arc.
  ctx.strokeStyle = "rgba(30,41,59,0.9)";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, 0, 19.1, 0, Math.PI * 2);
  ctx.stroke();

  if (integrity.ratio > 0) {
    ctx.strokeStyle = integrity.color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      19.1,
      -Math.PI / 2,
      -Math.PI / 2 +
        Math.PI * 2 * integrity.ratio,
    );
    ctx.stroke();
  }

  // Soft command-core aura follows real integrity state. Kept as flat fills
  // to avoid per-frame gradient allocations in the gameplay hot path.
  const criticalPulse =
    integrity.status === "CRITICAL"
      ? 0.04 +
        (Math.sin(options.time * 0.01) + 1) * 0.025
      : 0;
  ctx.globalAlpha = 0.14 + criticalPulse;
  ctx.fillStyle = integrity.color;
  ctx.beginPath();
  ctx.arc(0, 0, 17.8, 0, Math.PI * 2);
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

  if (damageHighlightStrength > 0) {
    ctx.save();
    ctx.globalAlpha =
      damageHighlightStrength * 0.42;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, 13.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

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

  ctx.fillStyle = integrity.coreColor;
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
