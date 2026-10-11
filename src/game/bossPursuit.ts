export interface BossPursuitBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface BossPursuitInput {
  bossX: number;
  bossY: number;
  playerX: number;
  playerY: number;
  phase: number;
  deltaMs: number;
  bounds: BossPursuitBounds;
  margin?: number;
}

export interface BossPursuitProjection {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speedPerFrame: number;
  standoffDistance: number;
}

export const BOSS_PURSUIT_PROFILES = {
  1: { speedPerFrame: 1.8, standoffDistance: 160, deadZone: 16, catchupDistance: 420, catchupMultiplier: 1.25 },
  2: { speedPerFrame: 2.5, standoffDistance: 115, deadZone: 14, catchupDistance: 360, catchupMultiplier: 1.3 },
  3: { speedPerFrame: 3.3, standoffDistance: 75, deadZone: 12, catchupDistance: 300, catchupMultiplier: 1.35 },
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const getProfile = (phase: number) => {
  if (phase >= 3) return BOSS_PURSUIT_PROFILES[3];
  if (phase === 2) return BOSS_PURSUIT_PROFILES[2];
  return BOSS_PURSUIT_PROFILES[1];
};

/**
 * Constant-time pursuit for the Blackout Devourer.
 * Outside dedicated charge movement, the boss closes toward Foton from any
 * direction until it reaches a phase-scaled radial standoff. Long-range
 * catch-up prevents stationary firing while bounded delta preserves telegraphs.
 */
export const projectBossPursuit = (
  input: BossPursuitInput,
): BossPursuitProjection => {
  const profile = getProfile(input.phase);
  const safeDelta = Number.isFinite(input.deltaMs)
    ? clamp(input.deltaMs, 0, 50)
    : 0;
  const margin = Math.max(0, input.margin ?? 40);
  const minX = input.bounds.minX + margin;
  const maxX = input.bounds.maxX - margin;
  const minY = input.bounds.minY + margin;
  const maxY = input.bounds.maxY - margin;

  const playerX = clamp(input.playerX, minX, maxX);
  const playerY = clamp(input.playerY, minY, maxY);
  const toPlayerX = playerX - input.bossX;
  const toPlayerY = playerY - input.bossY;
  const playerDistance = Math.hypot(toPlayerX, toPlayerY);

  if (playerDistance === 0 || playerDistance <= profile.standoffDistance || safeDelta === 0) {
    const x = clamp(input.bossX, minX, maxX);
    const y = clamp(input.bossY, minY, maxY);
    return { x, y, targetX: x, targetY: y, speedPerFrame: profile.speedPerFrame, standoffDistance: profile.standoffDistance };
  }

  const inversePlayerDistance = 1 / playerDistance;
  const directionX = toPlayerX * inversePlayerDistance;
  const directionY = toPlayerY * inversePlayerDistance;
  const closeDistance = playerDistance - profile.standoffDistance;
  const targetX = clamp(input.bossX + directionX * closeDistance, minX, maxX);
  const targetY = clamp(input.bossY + directionY * closeDistance, minY, maxY);
  const dx = targetX - input.bossX;
  const dy = targetY - input.bossY;
  const distance = Math.hypot(dx, dy);

  if (distance <= profile.deadZone || distance === 0) {
    return {
      x: clamp(input.bossX, minX, maxX),
      y: clamp(input.bossY, minY, maxY),
      targetX,
      targetY,
      speedPerFrame: profile.speedPerFrame,
      standoffDistance: profile.standoffDistance,
    };
  }

  const frameScale = safeDelta / 16.6;
  const catchupMultiplier = playerDistance >= profile.catchupDistance ? profile.catchupMultiplier : 1;
  const travel = Math.min(
    Math.max(0, distance - profile.deadZone),
    profile.speedPerFrame * catchupMultiplier * frameScale,
  );
  const inverseDistance = 1 / distance;

  return {
    x: clamp(input.bossX + dx * inverseDistance * travel, minX, maxX),
    y: clamp(input.bossY + dy * inverseDistance * travel, minY, maxY),
    targetX,
    targetY,
    speedPerFrame: profile.speedPerFrame,
    standoffDistance: profile.standoffDistance,
  };
};
