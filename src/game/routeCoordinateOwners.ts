import type { Enemy, OrbiMember, Particle, Projectile, Resource } from "./types";
import type { LiveEnemyFormationDirectorState } from "./liveEnemyFormationDirector";
import {
  rebasePhysicalRouteFrame,
  type PhysicalRouteFrame,
} from "./physicalRouteSpace";

/**
 * UX15-C3A-3: a single transaction at a physics tick boundary.
 *
 * The adapter is intentionally NOT imported by EnergySwarmGame yet: C3B
 * must certify route-aware spawning, culling, bosses, hazards and radar before
 * enabling it in a normal WORLD_ROUTE run. The QA harness exercises actual
 * typed gameplay entities, rather than a background-only demonstration.
 */
export interface RouteMutablePoint { x: number; y: number }
export interface RouteMutableCamera { localX: number; localY: number }
export interface RouteLegacyCameraPositions {
  cameraX: number; targetX: number;
  cameraY: number; targetY: number;
  // lookAheadX and shakeX are relative SCREEN offsets, never rebase them.
}
export interface RouteCacheSlot { current: unknown }

export interface RouteCoordinateOwners {
  frame: PhysicalRouteFrame;
  player: RouteMutablePoint;
  camera: RouteMutableCamera;
  pointer: RouteMutablePoint | null;
  clickToMoveTarget: RouteMutablePoint | null;
  swarm: readonly OrbiMember[];
  enemies: readonly Enemy[];
  projectiles: readonly Projectile[];
  resources: readonly Resource[];
  particles: readonly Particle[];
  floatingTexts: readonly RouteMutablePoint[];
  hazardZones: readonly RouteMutablePoint[];
  shieldNodes: readonly RouteMutablePoint[];
  bossAttackTarget: RouteMutablePoint | null;
  boss: Enemy | null;
  architectQaBoss: Enemy | null;
  formationDirector: LiveEnemyFormationDirectorState;
  legacyCamera: RouteLegacyCameraPositions | null;
  /** Register every additional live world-space owner BEFORE authorizing C3B. */
  extraWorldAnchors: readonly RouteMutablePoint[];
  /** Cached indices must be rebuilt after the coordinate epoch changes. */
  invalidatedSpatialCaches: readonly RouteCacheSlot[];
}

export interface RouteRebasePermit {
  phase: "TICK_BOUNDARY";
  /** Never rebase during unresolved boss phases, attack callbacks or collision. */
  unresolvedBossPhase: false;
  /** Fail closed if an unregistered world-space system is active. */
  unregisteredWorldOwners: false;
}

export interface RouteCoordinateRebaseResult {
  frame: PhysicalRouteFrame;
  shiftedFields: number;
  shiftedUniqueObjects: number;
  invalidatedCaches: number;
}

/**
 * Preflight every writable coordinate, frame and camera, then commit all
 * translations with the same delta and increment originEpoch exactly once.
 * A shared boss/enemy, formation assignment or point is visited once by
 * (object, coordinate field), not by its number of registry aliases.
 *
 * NO timers, velocities, directions, IDs, damage, health, seed, RNG,
 * animation screen offsets or target IDs are translated.
 */
export function rebaseRouteCoordinateOwners(
  owners: RouteCoordinateOwners,
  deltaX: number,
  permit: RouteRebasePermit,
): RouteCoordinateRebaseResult {
  if (permit.phase !== "TICK_BOUNDARY" ||
      permit.unresolvedBossPhase !== false ||
      permit.unregisteredWorldOwners !== false) {
    throw new Error("Route origin transaction denied outside certified tick boundary");
  }
  const rebase = rebasePhysicalRouteFrame(owners.frame, deltaX);
  const changes: Array<{ owner: object; key: string; next: number }> = [];
  const seen = new WeakMap<object, Set<string>>();
  const unique = new Set<object>();
  const stage = (owner: object, key: string) => {
    let keys = seen.get(owner);
    if (!keys) { keys = new Set<string>(); seen.set(owner, keys); }
    if (keys.has(key)) return;
    const value: unknown = Reflect.get(owner, key);
    if (typeof value !== "number" || !Number.isFinite(value) ||
        !Number.isFinite(value - deltaX)) {
      throw new RangeError(`Invalid route coordinate ${key}`);
    }
    const descriptor = Object.getOwnPropertyDescriptor(owner, key);
    if (descriptor ? !(descriptor.writable || descriptor.set) :
        !Object.isExtensible(owner)) {
      throw new Error(`Non-writable route coordinate ${key}`);
    }
    keys.add(key);
    unique.add(owner);
    changes.push({ owner, key, next: value - deltaX });
  };
  const stagePoint = (point: RouteMutablePoint | null) => {
    if (point) stage(point, "x");
  };
  const stageActor = (actor: {x: number; y: number}) => stage(actor, "x");

  stagePoint(owners.player);
  stage(owners.camera, "localX");
  stagePoint(owners.pointer);
  stagePoint(owners.clickToMoveTarget);
  for (const member of owners.swarm) {
    stageActor(member);
    stage(member, "targetX");
  }
  // Boss refs are frequently aliases of an enemy in this exact array.
  for (const enemy of [...owners.enemies, owners.boss, owners.architectQaBoss]) {
    if (!enemy) continue;
    stageActor(enemy);
    if (enemy.enemyFormation) stage(enemy.enemyFormation, "anchorX");
  }
  for (const actor of owners.projectiles) stageActor(actor);
  for (const actor of owners.resources) stageActor(actor);
  for (const actor of owners.particles) stageActor(actor);
  for (const point of owners.floatingTexts) stagePoint(point);
  for (const point of owners.hazardZones) stagePoint(point);
  for (const point of owners.shieldNodes) stagePoint(point);
  stagePoint(owners.bossAttackTarget);
  for (const point of owners.extraWorldAnchors) stagePoint(point);
  if (owners.formationDirector.pending) {
    stage(owners.formationDirector.pending.common, "anchorX");
  }
  if (owners.legacyCamera) {
    stage(owners.legacyCamera, "cameraX");
    stage(owners.legacyCamera, "targetX");
  }

  // Siege telegraph states from the gameplay contract are immutable/frozen.
  // Replace them via the owning enemy rather than mutating frozen state.
  const replacementByTelegraph = new Map<
    NonNullable<Enemy["siegeVolleyTelegraph"]>,
    NonNullable<Enemy["siegeVolleyTelegraph"]>
  >();
  const enemyTelegraphWrites: Array<{enemy: Enemy; next: NonNullable<Enemy["siegeVolleyTelegraph"]>}> = [];
  for (const enemy of new Set([...owners.enemies, owners.boss, owners.architectQaBoss].filter(
    (value): value is Enemy => value !== null,
  ))) {
    const telegraph = enemy.siegeVolleyTelegraph;
    if (!telegraph || telegraph.targetX === null) continue;
    if (!Number.isFinite(telegraph.targetX) ||
        !Number.isFinite(telegraph.targetX - deltaX)) {
      throw new RangeError("Invalid siege telegraph target");
    }
    if (!Object.isExtensible(enemy) &&
        !Object.getOwnPropertyDescriptor(enemy, "siegeVolleyTelegraph")?.writable) {
      throw new Error("Non-writable siege telegraph owner");
    }
    let next = replacementByTelegraph.get(telegraph);
    if (!next) {
      next = Object.freeze({...telegraph, targetX: telegraph.targetX - deltaX});
      replacementByTelegraph.set(telegraph, next);
    }
    enemyTelegraphWrites.push({enemy, next});
  }
  for (const cache of owners.invalidatedSpatialCaches) {
    if (Object.isFrozen(cache)) throw new Error("Frozen spatial cache slot");
  }

  // Commit phase is arithmetic-free, cannot allocate a new world coordinate.
  for (const change of changes) Reflect.set(change.owner, change.key, change.next);
  for (const write of enemyTelegraphWrites) write.enemy.siegeVolleyTelegraph = write.next;
  for (const cache of owners.invalidatedSpatialCaches) cache.current = null;
  return {
    frame: rebase.nextFrame,
    shiftedFields: changes.length + replacementByTelegraph.size,
    shiftedUniqueObjects: unique.size,
    invalidatedCaches: owners.invalidatedSpatialCaches.length,
  };
}
