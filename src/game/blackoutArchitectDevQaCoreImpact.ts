import { EnemyType, type Enemy, type Projectile } from "./types";
import { BLACKOUT_ARCHITECT_STANDALONE_COMBAT_BLUEPRINT as DESIGN } from "./blackoutArchitectStandaloneCombatBlueprint";
import type {
  BlackoutArchitectEngineIdentityGuard,
  BlackoutArchitectEngineIdentityLifecycleOwner,
} from "./blackoutArchitectEngineIdentityLifecycle";
import type {
  BlackoutArchitectDevQaCardinalGeometry,
} from "./blackoutArchitectDevQaCardinalGeometry";

export interface BlackoutArchitectDevQaCoreImpact {
  readonly kind: "ARCHITECT_CORE_HIT";
  readonly damageApplied: number;
  readonly remainingHealth: number;
  readonly coreDisabled: boolean;
  readonly shotConsumed: true;
}

export const BLACKOUT_ARCHITECT_DEV_QA_CORE_IMPACT_AUTHORITY = Object.freeze({
  ownsGuardedQaCoreHitAfterCardinals: true,
  ownsRealIndependentCoreHpMutation: true,
  ownsSingleQaProjectileConsumption: true,
  ownsDevQaTerminalSignal: true,
  ownsBossAIOrAttacksAuthority: false,
  ownsBossPhaseOrExposureAuthority: false,
  ownsLegacyBossChassisAuthority: false,
  ownsLegacyShieldNodeAuthority: false,
  ownsAutomaticCampaignOrInfiniteRoutingAuthority: false,
  ownsRewardsScoreOrStatsAuthority: false,
  ownsGlobalProjectileOrEnemyListAuthority: false,
  ownsRandomnessOrGameClockAuthority: false,
  ownsPlayerMovementOrFotonAuthority: false,
  ownsGlobalCapacityAuthority: false,
} as const);

const finite = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n) && !Object.is(n, -0);

/**
 * C3. A real core-health collision, but exclusively inside the frozen Vite
 * DEV QA diagnostic. The four separately owned cardinal circles MUST have
 * already reached zero through C2. Same actual engine-owned player shot.
 *
 * A zero-health result must be followed immediately by game-owner QA teardown:
 * the historic identity owner requires health>0 on every isCurrent check.
 */
export const resolveBlackoutArchitectDevQaCoreImpact = (
  owner: BlackoutArchitectEngineIdentityLifecycleOwner | null,
  guard: Readonly<BlackoutArchitectEngineIdentityGuard> | null,
  geometry: Readonly<BlackoutArchitectDevQaCardinalGeometry> | null,
  boss: Enemy | null,
  enemies: readonly Enemy[],
  projectile: Projectile | null,
  activeQaProjectile: Projectile | null,
): Readonly<BlackoutArchitectDevQaCoreImpact> | null => {
  try {
    if (!owner || !guard || !geometry || !boss || !projectile ||
        projectile !== activeQaProjectile || geometry.boss !== boss ||
        geometry.guard !== guard ||
        boss.type !== EnemyType.BOSS_ARCHITECT ||
        boss.architectBossIdentity !== "BLACKOUT_ARCHITECT" ||
        boss.isBoss !== true || boss.isDead !== false ||
        boss.bossChassis !== undefined ||
        boss.infiniteBossIdentity !== undefined ||
        geometry.mode !== "DEV_QA_PHYSICAL_GEOMETRY_NO_HITS" ||
        !Array.isArray(geometry.anchors) || geometry.anchors.length !== 4 ||
        !owner.isCurrent(guard,boss,boss,enemies) ||
        !finite(boss.x) || !finite(boss.y) ||
        !finite(boss.size) || boss.size !== DESIGN.core.proposedVisualSize ||
        !finite(boss.health) || !finite(boss.maxHealth) ||
        boss.health <= 0 || boss.maxHealth !== DESIGN.core.proposedMaxHealth ||
        boss.health > boss.maxHealth ||
        projectile.fromPlayer !== true ||
        !finite(projectile.x) || !finite(projectile.y) ||
        !finite(projectile.vx) || !finite(projectile.vy) ||
        !finite(projectile.size) || projectile.size <= 0 || projectile.size > 16 ||
        !finite(projectile.damage) || projectile.damage <= 0 || projectile.damage > 100 ||
        !finite(projectile.life) || projectile.life <= 0) return null;

    const ids = new Set<string>();
    for (const anchor of geometry.anchors) {
      if (anchor.id !== "NORTH" && anchor.id !== "EAST" &&
          anchor.id !== "SOUTH" && anchor.id !== "WEST") return null;
      if (ids.has(anchor.id)) return null;
      ids.add(anchor.id);
      if (!finite(anchor.health) || anchor.health !== 0 ||
          !finite(anchor.maxHealth) || anchor.maxHealth <= 0 ||
          !finite(anchor.x) || !finite(anchor.y) ||
          !finite(anchor.radius) || anchor.radius <= 0) return null;
    }
    if (ids.size !== 4) return null;

    const distance = Math.hypot(projectile.x-boss.x,projectile.y-boss.y);
    if (!Number.isFinite(distance) || distance >= boss.size+projectile.size) return null;
    const damage = Math.min(boss.health,projectile.damage);
    if (!finite(damage) || damage <= 0) return null;

    // Exactly one write to the existing real boss object and one shot consume.
    projectile.life = 0;
    boss.health = Math.max(0,boss.health-damage);
    return Object.freeze({
      kind: "ARCHITECT_CORE_HIT",
      damageApplied: damage,
      remainingHealth: boss.health,
      coreDisabled: boss.health === 0,
      shotConsumed: true,
    });
  } catch {
    return null;
  }
};
