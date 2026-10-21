import { WORLD_WIDTH, WORLD_HEIGHT, MAX_PROJECTILES, MAX_ENEMIES } from "./constants";

/**
 * ES-13J9L-B2B2B2B1 — standalone PROVISIONAL DESIGN BLUEPRINT.
 * No live engine identity, actual boss object, physical anchors, hit, or damage.
 * Values are newly proposed/tunable, not inherited Titan/Devourer balance.
 */
export type ArchitectCardinal = "NORTH" | "EAST" | "SOUTH" | "WEST";

export interface ArchitectBlueprintAnchor {
  readonly id: ArchitectCardinal;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly proposedHealth: number;
  readonly proposedCollisionRadius: number;
}

export interface ArchitectBlueprintAttackIdea {
  readonly id: "GRID_LOCK" | "VECTOR_TIDE" | "SECTOR_WALL";
  readonly minimumPhase: 1 | 2 | 3;
  readonly proposedTelegraphMs: number;
  readonly proposedRecoveryMs: number;
  readonly proposedProjectileBudget: number;
}

export const BLACKOUT_ARCHITECT_STANDALONE_BLUEPRINT_AUTHORITY = Object.freeze({
  ownsProvisionalDesignBlueprintOnly: true,
  ownsEngineEncounterIssuanceAuthority: false,
  ownsAuthenticatedLiveBossIdentityAuthority: false,
  ownsEngineRunEpochAuthority: false,
  ownsPhysicalCardinalGeometryAuthority: false,
  ownsAnchorDurabilityMutationAuthority: false,
  ownsCollisionOrHitProvenanceAuthority: false,
  ownsProjectileConsumptionAuthority: false,
  ownsGlobalReplayPreventionAuthority: false,
  ownsBossHealthOrDamageMutationAuthority: false,
  ownsBossSpawnAuthority: false,
  ownsBossAIOrAttackExecutionAuthority: false,
  ownsBossPhaseOrExposureTimerAuthority: false,
  ownsRuntimeOrModeRoutingAuthority: false,
  ownsRenderingOrHudAuthority: false,
  ownsRewardsOrPersistenceAuthority: false,
  ownsEntityOrProjectileCollectionAuthority: false,
  ownsRandomnessOrTimersAuthority: false,
  ownsFotonOrFormationAuthority: false,
  ownsGlobalCapOrBudgetAuthority: false,
} as const);

const anchors: readonly ArchitectBlueprintAnchor[] = Object.freeze([
  Object.freeze({ id: "NORTH", offsetX: 0, offsetY: -106, proposedHealth: 135, proposedCollisionRadius: 13 }),
  Object.freeze({ id: "EAST", offsetX: 116, offsetY: 0, proposedHealth: 135, proposedCollisionRadius: 13 }),
  Object.freeze({ id: "SOUTH", offsetX: 0, offsetY: 106, proposedHealth: 135, proposedCollisionRadius: 13 }),
  Object.freeze({ id: "WEST", offsetX: -116, offsetY: 0, proposedHealth: 135, proposedCollisionRadius: 13 }),
]);

const phaseThresholds = Object.freeze([
  Object.freeze({ enterPhase: 2 as const, atOrBelowCoreHealthFraction: 0.68 }),
  Object.freeze({ enterPhase: 3 as const, atOrBelowCoreHealthFraction: 0.32 }),
]);

const attackIdeas: readonly ArchitectBlueprintAttackIdea[] = Object.freeze([
  Object.freeze({ id: "GRID_LOCK", minimumPhase: 1, proposedTelegraphMs: 1400, proposedRecoveryMs: 6600, proposedProjectileBudget: 0 }),
  Object.freeze({ id: "VECTOR_TIDE", minimumPhase: 2, proposedTelegraphMs: 1700, proposedRecoveryMs: 7500, proposedProjectileBudget: 6 }),
  Object.freeze({ id: "SECTOR_WALL", minimumPhase: 3, proposedTelegraphMs: 1900, proposedRecoveryMs: 9000, proposedProjectileBudget: 8 }),
]);

export const BLACKOUT_ARCHITECT_STANDALONE_COMBAT_BLUEPRINT = Object.freeze({
  bossId: "BLACKOUT_ARCHITECT",
  family: "BATTLEFIELD_CONTROL",
  blueprintMode: "BLUEPRINT_ONLY",
  balanceStatus: "PROVISIONAL_UNTUNED",
  core: Object.freeze({
    proposedMaxHealth: 1920,
    proposedVisualSize: 58,
    proposedExposureDurationMs: 3700,
  }),
  anchors,
  phaseThresholds,
  attackIdeas,
  proposedMaxProjectilesPerAttack: 8,
  /** Existing global caps are read-only bounds, never changed here. */
  globalLimitsObserved: Object.freeze({
    maxEnemies: MAX_ENEMIES,
    maxProjectiles: MAX_PROJECTILES,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
  }),
} as const);

export interface ArchitectHypotheticalAnchor {
  readonly id: ArchitectCardinal;
  readonly x: number;
  readonly y: number;
  readonly proposedHealth: number;
  readonly proposedCollisionRadius: number;
}

export interface ArchitectHypotheticalGeometryProjection {
  readonly bossId: "BLACKOUT_ARCHITECT";
  readonly projectionMode: "HYPOTHETICAL_COORDINATES_ONLY";
  readonly anchorCenters: readonly ArchitectHypotheticalAnchor[];
  readonly authenticPhysicalGeometry: false;
  readonly collisionAuthorized: false;
  readonly damageAuthorized: false;
  readonly projectileConsumptionAuthorized: false;
  readonly liveBossIssued: false;
}

const safeCoordinate = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && !Object.is(value, -0);

/**
 * Pure candidate coordinates in the existing world. No entity/anchor is
 * allocated in the actual game and no collision is resolved.
 */
export const projectBlackoutArchitectHypotheticalAnchors = (
  center: unknown,
): Readonly<ArchitectHypotheticalGeometryProjection> | null => {
  try {
    if (center === null || typeof center !== "object" || Array.isArray(center)) return null;
    const proto = Object.getPrototypeOf(center);
    if (proto !== Object.prototype && proto !== null) return null;
    const keys = Reflect.ownKeys(center);
    if (keys.length !== 2 || !keys.includes("x") || !keys.includes("y")) return null;
    const xd = Object.getOwnPropertyDescriptor(center, "x");
    const yd = Object.getOwnPropertyDescriptor(center, "y");
    if (!xd || !yd || !("value" in xd) || !("value" in yd)) return null;
    const x: unknown = xd.value;
    const y: unknown = yd.value;
    if (!safeCoordinate(x) || !safeCoordinate(y)) return null;
    if (x < 0 || x > WORLD_WIDTH || y < 0 || y > WORLD_HEIGHT) return null;

    const projected = anchors.map((anchor) => {
      const ax = x + anchor.offsetX;
      const ay = y + anchor.offsetY;
      const radius = anchor.proposedCollisionRadius;
      if (!Number.isFinite(ax) || !Number.isFinite(ay) ||
          ax - radius < 0 || ax + radius > WORLD_WIDTH ||
          ay - radius < 0 || ay + radius > WORLD_HEIGHT) return null;
      return Object.freeze({
        id: anchor.id,
        x: ax,
        y: ay,
        proposedHealth: anchor.proposedHealth,
        proposedCollisionRadius: radius,
      });
    });
    if (projected.some((item) => item === null)) return null;
    return Object.freeze({
      bossId: "BLACKOUT_ARCHITECT",
      projectionMode: "HYPOTHETICAL_COORDINATES_ONLY",
      anchorCenters: Object.freeze(projected as ArchitectHypotheticalAnchor[]),
      authenticPhysicalGeometry: false,
      collisionAuthorized: false,
      damageAuthorized: false,
      projectileConsumptionAuthorized: false,
      liveBossIssued: false,
    });
  } catch {
    return null;
  }
};
