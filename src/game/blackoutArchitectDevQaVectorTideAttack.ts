import { EnemyType, type Enemy } from "./types";
import { WORLD_BOUNDS } from "./constants";
import type {
  BlackoutArchitectEngineIdentityGuard,
  BlackoutArchitectEngineIdentityLifecycleOwner,
} from "./blackoutArchitectEngineIdentityLifecycle";

export type ArchitectVectorTidePhase = "TELEGRAPH" | "ACTIVE" | "RECOVERY";
export interface ArchitectVectorTideBolt {
  readonly id: number;
  readonly vx: number;
  readonly vy: number;
  x: number;
  y: number;
  spent: boolean;
}
export interface BlackoutArchitectDevQaVectorTideState {
  readonly mode: "DEV_QA_VECTOR_TIDE_PHYSICAL";
  readonly boss: Enemy;
  readonly guard: Readonly<BlackoutArchitectEngineIdentityGuard>;
  readonly bolts: readonly ArchitectVectorTideBolt[];
  phase: ArchitectVectorTidePhase;
  remainingMs: number;
  cycle: number;
  qaHullHealth: number;
  readonly qaHullMaxHealth: 100;
}
export interface ArchitectVectorTideStepResult {
  readonly phase: ArchitectVectorTidePhase;
  readonly cycle: number;
  readonly hits: number;
  readonly damageApplied: number;
  readonly qaHullHealth: number;
  readonly qaHullDepleted: boolean;
}
export const BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG = Object.freeze({
  telegraphMs: 1700,
  activeMs: 1600,
  recoveryMs: 7500,
  projectileBudget: 6,
  projectileRadius: 12,
  playerRadius: 10,
  projectileSpeed: 0.20, // world units per millisecond; deterministic
  damagePerProjectile: 10,
  initialQaHull: 100,
} as const);
export const BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_AUTHORITY = Object.freeze({
  ownsSixAuthenticQaPhysicalHazards: true,
  ownsDeterministicTelegraphActiveRecovery: true,
  ownsIndependentQaHullHits: true,
  ownsGlobalProjectileCollection: false,
  ownsLegacyEnemyOrBossDamage: false,
  ownsGlobalShieldOrFotonAbilities: false,
  ownsNormalCombatWaveOrScore: false,
  ownsRandomnessOrGlobalTimer: false,
  ownsProductionModeRouting: false,
  ownsOtherArchitectAttackPatterns: false,
  ownsRewardsOrPersistence: false,
  ownsGlobalProjectileOrEnemyCapacity: false,
} as const);
const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && !Object.is(v,-0);
const authenticated = (
  owner: BlackoutArchitectEngineIdentityLifecycleOwner | null,
  guard: Readonly<BlackoutArchitectEngineIdentityGuard> | null,
  candidate: Enemy | null,
  boss: Enemy | null,
  enemies: readonly Enemy[],
): candidate is Enemy =>
  !!owner && !!guard && !!candidate && candidate === boss &&
  candidate.type === EnemyType.BOSS_ARCHITECT &&
  candidate.architectBossIdentity === "BLACKOUT_ARCHITECT" &&
  candidate.infiniteBossIdentity === undefined &&
  candidate.bossChassis === undefined &&
  owner.isCurrent(guard,candidate,boss,enemies);

const createBolts = (x:number,y:number): readonly ArchitectVectorTideBolt[] => {
  // Original fixed six-direction fan, not random or global projectile entities.
  const directions = [
    [1,0],[0.5,Math.sqrt(3)/2],[-0.5,Math.sqrt(3)/2],
    [-1,0],[-0.5,-Math.sqrt(3)/2],[0.5,-Math.sqrt(3)/2],
  ] as const;
  return Object.freeze(directions.map(([dx,dy],id)=>Object.seal({
    id, x, y,
    vx:dx*BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG.projectileSpeed,
    vy:dy*BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG.projectileSpeed,
    spent:false,
  })));
};
export const createBlackoutArchitectDevQaVectorTideState = (
  owner: BlackoutArchitectEngineIdentityLifecycleOwner | null,
  guard: Readonly<BlackoutArchitectEngineIdentityGuard> | null,
  boss: Enemy | null,
  installedBoss: Enemy | null,
  enemies: readonly Enemy[],
  explicitDevQa: boolean,
): BlackoutArchitectDevQaVectorTideState | null => {
  try {
    if (explicitDevQa !== true || !authenticated(owner,guard,boss,installedBoss,enemies) ||
        !finite(boss.x) || !finite(boss.y) ||
        boss.x < WORLD_BOUNDS.minX || boss.x > WORLD_BOUNDS.maxX ||
        boss.y < WORLD_BOUNDS.minY || boss.y > WORLD_BOUNDS.maxY) return null;
    return Object.seal({
      mode:"DEV_QA_VECTOR_TIDE_PHYSICAL" as const, boss, guard:guard!,
      bolts:createBolts(boss.x,boss.y),
      phase:"TELEGRAPH" as ArchitectVectorTidePhase,
      remainingMs:BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG.telegraphMs,
      cycle:1,qaHullHealth:100,qaHullMaxHealth:100 as const,
    });
  } catch { return null; }
};
/**
 * Exclusive DEV QA attack step. Each one of exactly six engine-owned hazard
 * circles can hit the independent QA hull ONCE per active attack cycle.
 * No writes to player shots, legacy boss entities, scores, shields or timers.
 */
export const stepBlackoutArchitectDevQaVectorTide = (
  owner: BlackoutArchitectEngineIdentityLifecycleOwner | null,
  guard: Readonly<BlackoutArchitectEngineIdentityGuard> | null,
  state: BlackoutArchitectDevQaVectorTideState | null,
  current: BlackoutArchitectDevQaVectorTideState | null,
  boss: Enemy | null,
  installedBoss: Enemy | null,
  enemies: readonly Enemy[],
  foton: Readonly<{x:number;y:number}> | null,
  deltaMs: number,
): Readonly<ArchitectVectorTideStepResult> | null => {
  try {
    if (!state || state !== current || !foton ||
        !authenticated(owner,guard,boss,installedBoss,enemies) ||
        state.boss !== boss || state.guard !== guard ||
        state.mode !== "DEV_QA_VECTOR_TIDE_PHYSICAL" ||
        !finite(boss.x) || !finite(boss.y) ||
        !finite(foton.x) || !finite(foton.y) ||
        foton.x < WORLD_BOUNDS.minX || foton.x > WORLD_BOUNDS.maxX ||
        foton.y < WORLD_BOUNDS.minY || foton.y > WORLD_BOUNDS.maxY ||
        !finite(deltaMs) || deltaMs < 0 || deltaMs > 33.2 ||
        !Number.isSafeInteger(state.cycle) || state.cycle <= 0 ||
        !finite(state.qaHullHealth) || state.qaHullHealth < 0 || state.qaHullHealth > 100 ||
        state.qaHullMaxHealth !== 100 || !finite(state.remainingMs) ||
        state.remainingMs <= 0 ||
        (state.phase !== "TELEGRAPH" && state.phase !== "ACTIVE" && state.phase !== "RECOVERY") ||
        !Array.isArray(state.bolts) ||
        state.bolts.length !== BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG.projectileBudget) return null;

    const expectedMaximum = state.phase === "TELEGRAPH"
      ? BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG.telegraphMs
      : state.phase === "ACTIVE"
      ? BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG.activeMs
      : BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG.recoveryMs;
    if (state.remainingMs > expectedMaximum) return null;
    const unique = new Set<number>();
    for (const bolt of state.bolts) {
      if (!bolt || !Number.isSafeInteger(bolt.id) ||
          bolt.id < 0 || bolt.id >= 6 || unique.has(bolt.id) ||
          !finite(bolt.x) || !finite(bolt.y) ||
          !finite(bolt.vx) || !finite(bolt.vy) ||
          !finite(Math.hypot(bolt.vx,bolt.vy)) ||
          Math.abs(Math.hypot(bolt.vx,bolt.vy) - BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG.projectileSpeed) > 1e-8 ||
          typeof bolt.spent !== "boolean") return null;
      unique.add(bolt.id);
    }
    if (unique.size !== 6) return null;
    const c = BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG;
    let hits=0, damageApplied=0;
    if (state.phase === "ACTIVE" && deltaMs > 0) {
      for (const bolt of state.bolts) {
        if (bolt.spent) continue;
        bolt.x += bolt.vx * deltaMs;
        bolt.y += bolt.vy * deltaMs;
        if (bolt.x < WORLD_BOUNDS.minX || bolt.x > WORLD_BOUNDS.maxX ||
            bolt.y < WORLD_BOUNDS.minY || bolt.y > WORLD_BOUNDS.maxY) {
          bolt.spent=true;
          continue;
        }
        if (state.qaHullHealth > 0 &&
            Math.hypot(bolt.x-foton.x,bolt.y-foton.y) <= c.projectileRadius+c.playerRadius) {
          const damage=Math.min(c.damagePerProjectile,state.qaHullHealth);
          state.qaHullHealth=Math.max(0,state.qaHullHealth-damage);
          damageApplied+=damage;
          hits+=1;
          bolt.spent=true;
        }
      }
    }

    if (deltaMs >= state.remainingMs) {
      if (state.phase === "TELEGRAPH") {
        state.phase="ACTIVE";
        state.remainingMs=c.activeMs;
        for (const bolt of state.bolts) {
          bolt.x=boss.x;bolt.y=boss.y;bolt.spent=false;
        }
      } else if (state.phase === "ACTIVE") {
        state.phase="RECOVERY";
        state.remainingMs=c.recoveryMs;
      } else {
        if (state.cycle >= Number.MAX_SAFE_INTEGER) return null;
        state.cycle+=1;state.phase="TELEGRAPH";
        state.remainingMs=c.telegraphMs;
        for (const bolt of state.bolts) {
          bolt.x=boss.x;bolt.y=boss.y;bolt.spent=false;
        }
      }
    } else state.remainingMs-=deltaMs;

    return Object.freeze({
      phase:state.phase,cycle:state.cycle,hits,damageApplied,
      qaHullHealth:state.qaHullHealth,
      qaHullDepleted:state.qaHullHealth===0,
    });
  } catch { return null; }
};
