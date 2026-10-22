import { WORLD_HEIGHT, WORLD_WIDTH } from "./constants";
import { EnemyType, type Enemy } from "./types";
import {
  BLACKOUT_ARCHITECT_STANDALONE_COMBAT_BLUEPRINT as DESIGN,
  type ArchitectCardinal,
} from "./blackoutArchitectStandaloneCombatBlueprint";
import type {
  BlackoutArchitectEngineIdentityGuard,
  BlackoutArchitectEngineIdentityLifecycleOwner,
} from "./blackoutArchitectEngineIdentityLifecycle";

/**
 * ES-13J9L-B2B2B2B2C1: four real, engine-owned QA cardinal circles and their
 * independent initial health. NOT a collision, damage, attack or mode system.
 * These are deliberately NOT legacy boss shieldNodes nor Enemy entities.
 */
export interface BlackoutArchitectDevQaCardinalAnchor {
  readonly id: ArchitectCardinal;
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  readonly maxHealth: number;
  health: number;
}

export interface BlackoutArchitectDevQaCardinalGeometry {
  readonly mode: "DEV_QA_PHYSICAL_GEOMETRY_NO_HITS";
  readonly boss: Enemy;
  readonly guard: Readonly<BlackoutArchitectEngineIdentityGuard>;
  readonly anchors: readonly BlackoutArchitectDevQaCardinalAnchor[];
  readonly collisionAuthorized: false;
  readonly projectileConsumptionAuthorized: false;
  readonly healthMutationAuthorized: false;
  readonly coreOrAttackAuthorized: false;
  readonly productionRoutingAuthorized: false;
}

export const BLACKOUT_ARCHITECT_DEV_QA_CARDINAL_AUTHORITY = Object.freeze({
  ownsEngineOwnedCardinalCirclePlacement: true,
  ownsIndependentInitialAnchorDurability: true,
  ownsQaOnlyPresentationGeometry: true,
  ownsCollisionOrDamageAuthority: false,
  ownsProjectileConsumptionAuthority: false,
  ownsAnchorHealthMutationAuthority: false,
  ownsBossCoreHealthAuthority: false,
  ownsAttacksOrPhasesAuthority: false,
  ownsLegacyShieldNodeAuthority: false,
  ownsEntityOrProjectileCollectionAuthority: false,
  ownsAutomaticSpawnOrProductionRoutingAuthority: false,
  ownsRewardsOrPersistenceAuthority: false,
  ownsClockOrRandomnessAuthority: false,
  ownsFotonOrFormationAuthority: false,
  ownsCapOrBudgetAuthority: false,
} as const);

const finite = (value: number): boolean =>
  typeof value === "number" && Number.isFinite(value) && !Object.is(value, -0);

/**
 * Constructs the cardinal state only for an authenticated, already-installed
 * exact boss object and private run guard. DEV gating and teardown remain with
 * EnergySwarmGame, never with untrusted callers or the old Titan chassis.
 *
 * The four sealed circles expose real mutable HP state for a future separately
 * authorized transaction, but THIS phase has no health writer or hit loop.
 */
export const createBlackoutArchitectDevQaCardinalGeometry = (
  owner: BlackoutArchitectEngineIdentityLifecycleOwner | null,
  guard: Readonly<BlackoutArchitectEngineIdentityGuard> | null,
  boss: Enemy | null,
  installedBoss: Enemy | null,
  enemies: readonly Enemy[],
  explicitDevQaOptIn: boolean,
): Readonly<BlackoutArchitectDevQaCardinalGeometry> | null => {
  try {
    if (explicitDevQaOptIn !== true || !owner || !guard || !boss ||
        boss.type !== EnemyType.BOSS_ARCHITECT ||
        boss.architectBossIdentity !== "BLACKOUT_ARCHITECT" ||
        boss.bossChassis !== undefined ||
        boss.infiniteBossIdentity !== undefined ||
        !owner.isCurrent(guard, boss, installedBoss, enemies) ||
        !finite(boss.x) || !finite(boss.y) ||
        DESIGN.bossId !== "BLACKOUT_ARCHITECT" ||
        DESIGN.balanceStatus !== "PROVISIONAL_UNTUNED" ||
        DESIGN.anchors.length !== 4) return null;

    const ids = new Set<ArchitectCardinal>();
    const anchors: BlackoutArchitectDevQaCardinalAnchor[] = [];
    for (const proposed of DESIGN.anchors) {
      const { id, offsetX, offsetY, proposedCollisionRadius: radius, proposedHealth: hp } = proposed;
      if ((id !== "NORTH" && id !== "EAST" && id !== "SOUTH" && id !== "WEST") ||
          ids.has(id) || !finite(offsetX) || !finite(offsetY) ||
          !finite(radius) || radius <= 0 || !finite(hp) || hp <= 0) return null;
      const x = boss.x + offsetX;
      const y = boss.y + offsetY;
      if (!finite(x) || !finite(y) ||
          x - radius < 0 || x + radius > WORLD_WIDTH ||
          y - radius < 0 || y + radius > WORLD_HEIGHT) return null;
      ids.add(id);
      anchors.push(Object.seal({ id, x, y, radius, maxHealth: hp, health: hp }));
    }
    if (ids.size !== 4 || anchors.length !== 4 ||
        !["NORTH", "EAST", "SOUTH", "WEST"].every(id => ids.has(id as ArchitectCardinal))) return null;
    for (let a = 0; a < anchors.length; a++) {
      for (let b = a + 1; b < anchors.length; b++) {
        const dx = anchors[a].x - anchors[b].x;
        const dy = anchors[a].y - anchors[b].y;
        if (Math.hypot(dx, dy) <= anchors[a].radius + anchors[b].radius) return null;
      }
    }

    return Object.freeze({
      mode: "DEV_QA_PHYSICAL_GEOMETRY_NO_HITS",
      boss,
      guard,
      anchors: Object.freeze(anchors),
      collisionAuthorized: false,
      projectileConsumptionAuthorized: false,
      healthMutationAuthorized: false,
      coreOrAttackAuthorized: false,
      productionRoutingAuthorized: false,
    });
  } catch {
    return null;
  }
};
