export const WORM_SEGMENT_CAP = 6;
export const WORM_PHYSICS_BASE_FRAME_MS = 1000 / 60;
export const WORM_PHYSICS_SUBSTEP_MS = 1000 / 120;

export interface WormSegmentKinematicState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface WormSegmentLeader {
  x: number;
  y: number;
}

export interface WormSegmentPhysicsConfig {
  spacing: number;
  stiffnessPerFrame: number;
  dampingPerFrame: number;
  maxSpeedPerFrame: number;
  maxCorrectionPerFrame: number;
  maxSubstepMs: number;
  maxDeltaMs: number;
}

export const DEFAULT_WORM_SEGMENT_PHYSICS: Readonly<WormSegmentPhysicsConfig> = {
  spacing: 42,
  stiffnessPerFrame: 0.2,
  dampingPerFrame: 0.82,
  maxSpeedPerFrame: 16,
  maxCorrectionPerFrame: 12,
  maxSubstepMs: WORM_PHYSICS_SUBSTEP_MS,
  maxDeltaMs: 100,
};

const clampMagnitude = (x: number, y: number, max: number) => {
  const magnitude = Math.hypot(x, y);
  if (magnitude <= max || magnitude <= 1e-9) return { x, y };
  const scale = max / magnitude;
  return { x: x * scale, y: y * scale };
};

const finiteOr = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

export const createWormSegmentChain = (
  requestedCount: number,
  leader: WormSegmentLeader,
  config: WormSegmentPhysicsConfig = DEFAULT_WORM_SEGMENT_PHYSICS,
): WormSegmentKinematicState[] => {
  const count = Math.max(0, Math.min(WORM_SEGMENT_CAP, Math.floor(requestedCount)));
  const originX = finiteOr(leader.x, 0);
  const originY = finiteOr(leader.y, 0);

  return Array.from({ length: count }, (_, index) => ({
    id: `worm-segment-${index + 1}`,
    x: originX - config.spacing * (index + 1),
    y: originY,
    vx: 0,
    vy: 0,
  }));
};

export const removeWormSegment = (
  segments: readonly WormSegmentKinematicState[],
  segmentId: string,
): WormSegmentKinematicState[] =>
  segments
    .filter((segment) => segment.id !== segmentId)
    .map((segment) => ({ ...segment }));

export const stepWormSegmentChainInPlace = (
  segments: WormSegmentKinematicState[],
  leader: WormSegmentLeader,
  deltaMs: number,
  config: WormSegmentPhysicsConfig = DEFAULT_WORM_SEGMENT_PHYSICS,
): void => {
  if (segments.length > WORM_SEGMENT_CAP) {
    segments.length = WORM_SEGMENT_CAP;
  }

  const leaderX = finiteOr(leader.x, 0);
  const leaderY = finiteOr(leader.y, 0);
  for (const segment of segments) {
    segment.x = finiteOr(segment.x, leaderX);
    segment.y = finiteOr(segment.y, leaderY);
    segment.vx = finiteOr(segment.vx, 0);
    segment.vy = finiteOr(segment.vy, 0);
  }

  if (segments.length === 0 || !Number.isFinite(deltaMs) || deltaMs <= 0) {
    return;
  }

  const effectiveDelta = Math.min(config.maxDeltaMs, deltaMs);
  const steps = Math.max(1, Math.ceil(effectiveDelta / config.maxSubstepMs));
  const substepMs = effectiveDelta / steps;
  const frameScale = substepMs / WORM_PHYSICS_BASE_FRAME_MS;
  const damping = Math.pow(config.dampingPerFrame, frameScale);
  const maxCorrection = config.maxCorrectionPerFrame * frameScale;
  const maxSpeed = config.maxSpeedPerFrame;

  for (let step = 0; step < steps; step += 1) {
    let targetX = leaderX;
    let targetY = leaderY;

    for (const segment of segments) {
      let dx = segment.x - targetX;
      let dy = segment.y - targetY;
      const distance = Math.hypot(dx, dy);

      if (distance <= 1e-6) {
        dx = -1;
        dy = 0;
      } else {
        dx /= distance;
        dy /= distance;
      }

      const desiredX = targetX + dx * config.spacing;
      const desiredY = targetY + dy * config.spacing;
      const correction = clampMagnitude(
        desiredX - segment.x,
        desiredY - segment.y,
        maxCorrection,
      );

      segment.vx =
        (segment.vx + correction.x * config.stiffnessPerFrame * frameScale) *
        damping;
      segment.vy =
        (segment.vy + correction.y * config.stiffnessPerFrame * frameScale) *
        damping;

      const boundedVelocity = clampMagnitude(segment.vx, segment.vy, maxSpeed);
      segment.vx = boundedVelocity.x;
      segment.vy = boundedVelocity.y;
      segment.x += segment.vx * frameScale;
      segment.y += segment.vy * frameScale;

      targetX = segment.x;
      targetY = segment.y;
    }
  }
};

export const stepWormSegmentChain = (
  segments: readonly WormSegmentKinematicState[],
  leader: WormSegmentLeader,
  deltaMs: number,
  config: WormSegmentPhysicsConfig = DEFAULT_WORM_SEGMENT_PHYSICS,
): WormSegmentKinematicState[] => {
  const next = segments
    .slice(0, WORM_SEGMENT_CAP)
    .map((segment) => ({ ...segment }));
  stepWormSegmentChainInPlace(next, leader, deltaMs, config);
  return next;
};
