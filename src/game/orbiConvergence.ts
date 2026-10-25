/**
 * UX14-B — deterministic simulation-time ORBI Convergence.
 * Target geometry and admission are pure; the legacy live collision pipeline
 * remains the sole authority for HP, deaths, loot, scoring and boss phases.
 */
export const CONVERGENCE_MIN_ORBIS = 8;
export const CONVERGENCE_MAX_RESONANCE = 100;
export const CONVERGENCE_CHANNEL_MS = 800;
export const CONVERGENCE_COOLDOWN_MS = 60_000;
export const CONVERGENCE_BEAM_MS = 280;
export const CONVERGENCE_RANGE = 600;
export const CONVERGENCE_WIDTH = 22;
export const CONVERGENCE_MAX_HITS = 6;
export const CONVERGENCE_FALLOFF = [1, .85, .70, .60, .50, .40] as const;

export interface ConvergencePoint { x: number; y: number }
export interface ConvergenceTarget extends ConvergencePoint {
  id: string;
  size: number;
  isDead?: boolean;
  health?: number;
}
export interface ConvergenceSelection {
  dx: number;
  dy: number;
  targets: ConvergenceTarget[];
}
export interface ConvergenceTrail extends ConvergencePoint {
  dx: number;
  dy: number;
  firedAtMs: number;
}
export interface ConvergenceState {
  channelUntilMs: number | null;
  waveKey: string | null;
  usedWaveKey: string | null;
  cooldownUntilMs: number;
  trail: ConvergenceTrail | null;
}
export interface ConvergenceAdmission {
  nowMs: number;
  waveKey: string;
  orbiCount: number;
  resonance: number;
  overdriveActive: boolean;
  gameplayActive: boolean;
  targetAvailable: boolean;
}

export const createConvergenceState = (): ConvergenceState => ({
  channelUntilMs: null,
  waveKey: null,
  usedWaveKey: null,
  cooldownUntilMs: 0,
  trail: null,
});

export const isConvergenceChanneling = (state: ConvergenceState) =>
  state.channelUntilMs !== null;

export function canActivateConvergence(state: ConvergenceState, event: ConvergenceAdmission): boolean {
  return Number.isFinite(event.nowMs) && event.nowMs >= 0 &&
    event.waveKey.length > 0 &&
    event.gameplayActive && event.targetAvailable && !event.overdriveActive &&
    event.orbiCount >= CONVERGENCE_MIN_ORBIS &&
    event.resonance >= CONVERGENCE_MAX_RESONANCE &&
    !isConvergenceChanneling(state) &&
    state.usedWaveKey !== event.waveKey &&
    event.nowMs >= state.cooldownUntilMs;
}

export function activateConvergence(state: ConvergenceState, event: ConvergenceAdmission): ConvergenceState | null {
  if (!canActivateConvergence(state, event)) return null;
  return {
    ...state,
    channelUntilMs: event.nowMs + CONVERGENCE_CHANNEL_MS,
    waveKey: event.waveKey,
    usedWaveKey: event.waveKey,
    cooldownUntilMs: event.nowMs + CONVERGENCE_COOLDOWN_MS,
    trail: null,
  };
}

export function cancelConvergence(state: ConvergenceState): ConvergenceState {
  return { ...state, channelUntilMs: null, waveKey: null };
}

export function finishConvergence(
  state: ConvergenceState,
  nowMs: number,
  origin: ConvergencePoint,
  aim: Pick<ConvergenceSelection, "dx" | "dy"> | null,
): ConvergenceState {
  if (!isConvergenceChanneling(state)) return state;
  return {
    ...cancelConvergence(state),
    trail: aim ? { ...origin, dx: aim.dx, dy: aim.dy, firedAtMs: nowMs } : null,
  };
}

export function projectConvergence(
  state: ConvergenceState, nowMs: number, waveKey: string,
  orbiCount: number, resonance: number, overdriveActive: boolean, gameplayActive: boolean,
  targetAvailable: boolean,
) {
  return {
    channeling: isConvergenceChanneling(state),
    chargeProgress: state.channelUntilMs === null ? 0 :
      Math.max(0, Math.min(1, 1 - (state.channelUntilMs - nowMs) / CONVERGENCE_CHANNEL_MS)),
    channelRemainingMs: Math.max(0, (state.channelUntilMs ?? nowMs) - nowMs),
    cooldownRemainingMs: Math.max(0, state.cooldownUntilMs - nowMs),
    usedThisWave: state.usedWaveKey === waveKey,
    canActivate: canActivateConvergence(state, {
      nowMs, waveKey, orbiCount, resonance, overdriveActive, gameplayActive, targetAvailable,
    }),
  };
}

/** One shot only: nearest live threat first, circle-vs-finite-ray, unique IDs,
 * ordered along the beam, with no farther-than-range or frame-by-frame scanning.
 */
export function selectConvergenceTargets(
  origin: ConvergencePoint,
  enemies: readonly ConvergenceTarget[],
): ConvergenceSelection | null {
  let nearest: ConvergenceTarget | null = null;
  let nearestDist2 = CONVERGENCE_RANGE * CONVERGENCE_RANGE;
  for (const enemy of enemies) {
    if (enemy.isDead || (enemy.health !== undefined && enemy.health <= 0)) continue;
    const rx = enemy.x - origin.x, ry = enemy.y - origin.y;
    const d2 = rx * rx + ry * ry;
    if (d2 <= nearestDist2 && (d2 < nearestDist2 || !nearest || enemy.id < nearest.id)) {
      nearest = enemy;
      nearestDist2 = d2;
    }
  }
  if (!nearest || nearestDist2 < 1e-8) return null;
  const d = Math.sqrt(nearestDist2);
  const dx = (nearest.x - origin.x) / d;
  const dy = (nearest.y - origin.y) / d;
  const hits: Array<{ enemy: ConvergenceTarget; entry: number }> = [];
  const seen = new Set<string>();
  for (const enemy of enemies) {
    if (seen.has(enemy.id) || enemy.isDead ||
        (enemy.health !== undefined && enemy.health <= 0)) continue;
    const rx = enemy.x - origin.x, ry = enemy.y - origin.y;
    const along = rx * dx + ry * dy;
    const radius = Math.max(0, enemy.size) + CONVERGENCE_WIDTH / 2;
    if (along < -radius || along > CONVERGENCE_RANGE + radius) continue;
    const cross = rx * dy - ry * dx;
    if (Math.abs(cross) > radius) continue;
    // Entry point on the expanded hit circle along the finite segment.
    const entry = along - Math.sqrt(Math.max(0, radius * radius - cross * cross));
    const exit = along + Math.sqrt(Math.max(0, radius * radius - cross * cross));
    if (exit < 0 || entry > CONVERGENCE_RANGE) continue;
    seen.add(enemy.id);
    hits.push({ enemy, entry: Math.max(0, entry) });
  }
  hits.sort((a, b) => a.entry - b.entry || a.enemy.id.localeCompare(b.enemy.id));
  return { dx, dy, targets: hits.slice(0, CONVERGENCE_MAX_HITS).map(x => x.enemy) };
}
export const convergenceBaseDamage = (orbiCount: number) =>
  22 + 1.25 * Math.min(Math.max(0, orbiCount), 24);
export const convergenceHitDamage = (orbiCount: number, hitIndex: number) =>
  convergenceBaseDamage(orbiCount) * (CONVERGENCE_FALLOFF[hitIndex] ?? 0);

/** Preserve phase gates; the live resolver applies existing boss weakpoint rules. */
export function capConvergenceBossDamage(
  damage: number, health: number, maxHealth: number, phase: number,
): number {
  if (!Number.isFinite(damage) || maxHealth <= 0 || health <= 0) return 0;
  const phaseFloor = phase <= 1 ? maxHealth * .70 : phase === 2 ? maxHealth * .35 : 0;
  return Math.max(0, Math.min(damage, maxHealth * .015, health - phaseFloor));
}
