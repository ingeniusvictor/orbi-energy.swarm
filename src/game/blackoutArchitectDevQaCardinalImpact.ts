import { EnemyType, type Enemy, type Projectile } from "./types";
import type {
  BlackoutArchitectEngineIdentityGuard,
  BlackoutArchitectEngineIdentityLifecycleOwner,
} from "./blackoutArchitectEngineIdentityLifecycle";
import type {
  BlackoutArchitectDevQaCardinalGeometry,
  BlackoutArchitectDevQaCardinalAnchor,
} from "./blackoutArchitectDevQaCardinalGeometry";

export interface BlackoutArchitectQaAnchorImpact {
  readonly kind: "CARDINAL_HIT";
  readonly anchorId: BlackoutArchitectDevQaCardinalAnchor["id"];
  readonly damageApplied: number;
  readonly remainingHealth: number;
  readonly destroyed: boolean;
  readonly shotConsumed: true;
}

export const BLACKOUT_ARCHITECT_DEV_QA_IMPACT_AUTHORITY = Object.freeze({
  ownsAuthenticatedQaCardinalCollision: true,
  ownsSingleRealQaProjectileConsumption: true,
  ownsCardinalHealthAndDestroyMutation: true,
  ownsCoreDamageOrPhaseAuthority: false,
  ownsBossAiOrAttackAuthority: false,
  ownsLegacyShieldNodeAuthority: false,
  ownsProductionOrModeRoutingAuthority: false,
  ownsRewardsOrPersistenceAuthority: false,
  ownsGlobalEntityOrProjectileCollectionAuthority: false,
  ownsRngOrGlobalClockAuthority: false,
  ownsFotonOrFormationAuthority: false,
  ownsGlobalCapOrBudgetAuthority: false,
} as const);

const finite = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n) && !Object.is(n, -0);

/**
 * A single already-fired, engine-held QA projectile against four *real* C1
 * cardinal circles. Returns null on miss or invalid/stale ownership.
 *
 * This is called only by the DEV-only frozen-world QA projectile step;
 * legacy shield nodes and legacy spatial collision flow are not invoked.
 * Ownership proof is exact reference equality against the engine's one active
 * QA shot plus the private installed Architect run/encounter identity guard.
 */
export function resolveBlackoutArchitectDevQaCardinalImpact(
  owner: BlackoutArchitectEngineIdentityLifecycleOwner | null,
  guard: Readonly<BlackoutArchitectEngineIdentityGuard> | null,
  geometry: Readonly<BlackoutArchitectDevQaCardinalGeometry> | null,
  installedBoss: Enemy | null,
  enemies: readonly Enemy[],
  projectile: Projectile | null,
  activeQaProjectile: Projectile | null,
): Readonly<BlackoutArchitectQaAnchorImpact> | null {
  try {
    if (!owner || !guard || !geometry || !installedBoss || !projectile ||
        projectile !== activeQaProjectile ||
        geometry.boss !== installedBoss || geometry.guard !== guard ||
        installedBoss.type !== EnemyType.BOSS_ARCHITECT ||
        installedBoss.architectBossIdentity !== "BLACKOUT_ARCHITECT" ||
        geometry.mode !== "DEV_QA_PHYSICAL_GEOMETRY_NO_HITS" ||
        !Array.isArray(geometry.anchors) || geometry.anchors.length !== 4 ||
        !owner.isCurrent(guard, installedBoss, installedBoss, enemies) ||
        projectile.fromPlayer !== true ||
        !finite(projectile.x) || !finite(projectile.y) ||
        !finite(projectile.vx) || !finite(projectile.vy) ||
        !finite(projectile.size) || projectile.size <= 0 || projectile.size > 16 ||
        !finite(projectile.damage) || projectile.damage <= 0 || projectile.damage > 100 ||
        !finite(projectile.life) || projectile.life <= 0) return null;

    let touched: BlackoutArchitectDevQaCardinalAnchor | null = null;
    const unique = new Set<string>();
    for (const anchor of geometry.anchors) {
      if (anchor.id !== "NORTH" && anchor.id !== "EAST" &&
          anchor.id !== "SOUTH" && anchor.id !== "WEST") return null;
      if (unique.has(anchor.id)) return null;
      unique.add(anchor.id);
      if (!finite(anchor.x) || !finite(anchor.y) ||
          !finite(anchor.radius) || anchor.radius <= 0 ||
          !finite(anchor.health) || !finite(anchor.maxHealth) ||
          anchor.maxHealth <= 0 || anchor.health < 0 ||
          anchor.health > anchor.maxHealth) return null;
      if (anchor.health === 0) continue; // destroyed cardinal: never absorb another shot
      const distance = Math.hypot(projectile.x - anchor.x, projectile.y - anchor.y);
      const radius = projectile.size + anchor.radius;
      if (!Number.isFinite(distance) || !Number.isFinite(radius)) return null;
      if (distance < radius) {
        if (touched !== null) return null; // overlapping targets must not double-consume
        touched = anchor;
      }
    }
    if (unique.size !== 4 || touched === null) return null;

    const damage = Math.min(projectile.damage, touched.health);
    if (!finite(damage) || damage <= 0) return null;

    // Exclusive C2 QA transaction: one projectile, one anchored HP write.
    projectile.life = 0;
    touched.health = Math.max(0, touched.health - damage);
    return Object.freeze({
      kind: "CARDINAL_HIT",
      anchorId: touched.id,
      damageApplied: damage,
      remainingHealth: touched.health,
      destroyed: touched.health === 0,
      shotConsumed: true,
    });
  } catch {
    return null;
  }
}
