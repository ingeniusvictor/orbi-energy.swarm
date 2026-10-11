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
  standoffY: number;
}

export const BOSS_PURSUIT_PROFILES = {
  1: { speedPerFrame: 0.9, standoffY: 250, deadZone: 26 },
  2: { speedPerFrame: 1.2, standoffY: 195, deadZone: 24 },
  3: { speedPerFrame: 1.5, standoffY: 140, deadZone: 20 },
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const getProfile = (phase: number) => {
  if (phase >= 3) return BOSS_PURSUIT_PROFILES[3];
  if (phase === 2) return BOSS_PURSUIT_PROFILES[2];
  return BOSS_PURSUIT_PROFILES[1];
};

/**
 * Constant-time idle pursuit for the Blackout Devourer.
 *
 * The boss follows the player's live position while preserving a vertical
 * standoff that shrinks by phase. Active attack movement/telegraphs remain
 * owned by the existing boss AI; callers use this projection only for the
 * non-charge movement branch.
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

  const targetX = clamp(input.playerX, minX, maxX);
  const targetY = clamp(input.playerY - profile.standoffY, minY, maxY);
  const dx = targetX - input.bossX;
  const dy = targetY - input.bossY;
  const distance = Math.hypot(dx, dy);

  if (distance <= profile.deadZone || distance === 0 || safeDelta === 0) {
    return {
      x: clamp(input.bossX, minX, maxX),
      y: clamp(input.bossY, minY, maxY),
      targetX,
      targetY,
      speedPerFrame: profile.speedPerFrame,
      standoffY: profile.standoffY,
    };
  }

  const frameScale = safeDelta / 16.6;
  const travel = Math.min(
    Math.max(0, distance - profile.deadZone),
    profile.speedPerFrame * frameScale,
  );
  const inverseDistance = 1 / distance;

  return {
    x: clamp(input.bossX + dx * inverseDistance * travel, minX, maxX),
    y: clamp(input.bossY + dy * inverseDistance * travel, minY, maxY),
    targetX,
    targetY,
    speedPerFrame: profile.speedPerFrame,
    standoffY: profile.standoffY,
  };
};
