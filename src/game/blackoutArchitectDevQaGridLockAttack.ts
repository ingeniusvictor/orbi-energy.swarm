import { EnemyType, type Enemy } from "./types";
import { WORLD_BOUNDS } from "./constants";
import type {
  BlackoutArchitectEngineIdentityGuard,
  BlackoutArchitectEngineIdentityLifecycleOwner,
} from "./blackoutArchitectEngineIdentityLifecycle";

export type ArchitectGridLockPhase = "TELEGRAPH" | "ACTIVE" | "RECOVERY";

export interface BlackoutArchitectDevQaGridLockState {
  readonly mode: "DEV_QA_GRID_LOCK_PHYSICAL";
  readonly boss: Enemy;
  readonly guard: Readonly<BlackoutArchitectEngineIdentityGuard>;
  phase: ArchitectGridLockPhase;
  remainingMs: number;
  cycle: number;
  hitRegistered: boolean;
  qaHullHealth: number;
  readonly qaHullMaxHealth: 100;
}

export interface BlackoutArchitectDevQaGridLockEvent {
  readonly phase: ArchitectGridLockPhase;
  readonly cycle: number;
  readonly damageApplied: number;
  readonly qaHullHealth: number;
  readonly qaHullDepleted: boolean;
  readonly hitOnceThisCycle: boolean;
}

export const BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_CONFIG = Object.freeze({
  telegraphMs: 1400,
  activeMs: 850,
  recoveryMs: 6600,
  halfWidth: 18,
  extent: 380,
  playerCollisionRadius: 10,
  initialQaHull: 100,
  damagePerCycle: 20,
  projectileBudget: 0,
} as const);

export const BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_AUTHORITY = Object.freeze({
  ownsDevOnlyWorldSpacePhysicalAttack: true,
  ownsTelegraphActiveRecoveryTiming: true,
  ownsSingleCycleQaHullCollisionAndDamage: true,
  ownsNormalFotonShieldOrHealth: false,
  ownsLegacyBossChassisOrShieldNodes: false,
  ownsBossProjectileCollection: false,
  ownsOtherArchitectAttackPatterns: false,
  ownsNormalEnemyAIOrWaveTiming: false,
  ownsNormalDeathScoreRewardsOrProgression: false,
  ownsGlobalRandomnessOrTimer: false,
  ownsGlobalEntityOrProjectileCapacity: false,
  ownsPersistenceOrProductionModeRouting: false,
} as const);

const finite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && !Object.is(value, -0);

const attested = (
  owner: BlackoutArchitectEngineIdentityLifecycleOwner | null,
  guard: Readonly<BlackoutArchitectEngineIdentityGuard> | null,
  boss: Enemy | null,
  installedBoss: Enemy | null,
  enemies: readonly Enemy[],
): boss is Enemy => !!owner && !!guard && !!boss &&
  boss === installedBoss && boss.type === EnemyType.BOSS_ARCHITECT &&
  boss.architectBossIdentity === "BLACKOUT_ARCHITECT" &&
  boss.bossChassis === undefined && boss.infiniteBossIdentity === undefined &&
  owner.isCurrent(guard,boss,installedBoss,enemies);

/** Only the game engine installs this object after a real C1 QA admission. */
export const createBlackoutArchitectDevQaGridLockState = (
  owner: BlackoutArchitectEngineIdentityLifecycleOwner | null,
  guard: Readonly<BlackoutArchitectEngineIdentityGuard> | null,
  boss: Enemy | null,
  installedBoss: Enemy | null,
  enemies: readonly Enemy[],
  explicitDevQa: boolean,
): BlackoutArchitectDevQaGridLockState | null => {
  try {
    if (explicitDevQa !== true || !attested(owner,guard,boss,installedBoss,enemies) ||
        !finite(boss.x) || !finite(boss.y) ||
        boss.x < WORLD_BOUNDS.minX || boss.x > WORLD_BOUNDS.maxX ||
        boss.y < WORLD_BOUNDS.minY || boss.y > WORLD_BOUNDS.maxY) return null;
    return Object.seal({
      mode: "DEV_QA_GRID_LOCK_PHYSICAL",
      boss,
      guard: guard!,
      phase: "TELEGRAPH" as ArchitectGridLockPhase,
      remainingMs: BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_CONFIG.telegraphMs,
      cycle: 1,
      hitRegistered: false,
      qaHullHealth: BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_CONFIG.initialQaHull,
      qaHullMaxHealth: 100 as const,
    });
  } catch {
    return null;
  }
};

/**
 * C5 engine-owned mutation: one deterministic time step and at most one
 * separate-QA-hull hit per active attack cycle, even at the lane intersection.
 * No normal FOTON shield/score/AI/projectile state is ever touched.
 */
export const stepBlackoutArchitectDevQaGridLock = (
  owner: BlackoutArchitectEngineIdentityLifecycleOwner | null,
  guard: Readonly<BlackoutArchitectEngineIdentityGuard> | null,
  state: BlackoutArchitectDevQaGridLockState | null,
  activeQaState: BlackoutArchitectDevQaGridLockState | null,
  boss: Enemy | null,
  installedBoss: Enemy | null,
  enemies: readonly Enemy[],
  player: Readonly<{x:number;y:number}> | null,
  deltaMs: number,
): Readonly<BlackoutArchitectDevQaGridLockEvent> | null => {
  try {
    if (!state || state !== activeQaState || !player ||
        !attested(owner,guard,boss,installedBoss,enemies) ||
        state.mode !== "DEV_QA_GRID_LOCK_PHYSICAL" ||
        state.boss !== boss || state.guard !== guard ||
        !finite(boss.x) || !finite(boss.y) ||
        !finite(player.x) || !finite(player.y) ||
        player.x < WORLD_BOUNDS.minX || player.x > WORLD_BOUNDS.maxX ||
        player.y < WORLD_BOUNDS.minY || player.y > WORLD_BOUNDS.maxY ||
        !finite(deltaMs) || deltaMs < 0 || deltaMs > 33.2 ||
        !finite(state.remainingMs) || state.remainingMs <= 0 ||
        !Number.isSafeInteger(state.cycle) || state.cycle <= 0 ||
        typeof state.hitRegistered !== "boolean" ||
        !finite(state.qaHullHealth) || state.qaHullHealth < 0 ||
        state.qaHullHealth > 100 || state.qaHullMaxHealth !== 100 ||
        (state.phase !== "TELEGRAPH" && state.phase !== "ACTIVE" &&
         state.phase !== "RECOVERY")) return null;

    const c = BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_CONFIG;
    const upperBound = state.phase === "TELEGRAPH" ? c.telegraphMs :
      state.phase === "ACTIVE" ? c.activeMs : c.recoveryMs;
    if (state.remainingMs > upperBound) return null;

    let damageApplied = 0;
    if (state.phase === "ACTIVE" && deltaMs > 0 &&
        !state.hitRegistered && state.qaHullHealth > 0) {
      const dx = Math.abs(player.x - boss.x);
      const dy = Math.abs(player.y - boss.y);
      const hitVertical = dx <= c.halfWidth + c.playerCollisionRadius &&
        dy <= c.extent + c.playerCollisionRadius;
      const hitHorizontal = dy <= c.halfWidth + c.playerCollisionRadius &&
        dx <= c.extent + c.playerCollisionRadius;
      if (hitVertical || hitHorizontal) {
        // Unified, single impact even if FOTON overlaps both physical axes.
        damageApplied = Math.min(c.damagePerCycle, state.qaHullHealth);
        state.qaHullHealth = Math.max(0,state.qaHullHealth - damageApplied);
        state.hitRegistered = true;
      }
    }

    if (deltaMs >= state.remainingMs) {
      if (state.phase === "TELEGRAPH") {
        state.phase = "ACTIVE";
        state.remainingMs = c.activeMs;
        state.hitRegistered = false;
      } else if (state.phase === "ACTIVE") {
        state.phase = "RECOVERY";
        state.remainingMs = c.recoveryMs;
      } else {
        if (state.cycle >= Number.MAX_SAFE_INTEGER) return null;
        state.cycle += 1;
        state.phase = "TELEGRAPH";
        state.remainingMs = c.telegraphMs;
        state.hitRegistered = false;
      }
    } else {
      state.remainingMs -= deltaMs;
    }
    return Object.freeze({
      phase: state.phase,
      cycle: state.cycle,
      damageApplied,
      qaHullHealth: state.qaHullHealth,
      qaHullDepleted: state.qaHullHealth === 0,
      hitOnceThisCycle: state.hitRegistered,
    });
  } catch {
    return null;
  }
};
