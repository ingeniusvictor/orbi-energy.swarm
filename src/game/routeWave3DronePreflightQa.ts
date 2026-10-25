import { createCampaignRuntimeWaveDescriptor } from "./runtimeWaveDescriptor";
import { projectRuntimeCombatPressure } from "./runtimeCombatPressure";
import { EnemyType, type Enemy, type Projectile } from "./types";
import type { RouteLocalPoint } from "./physicalRouteSpace";
import { ROUTE_WAVE1_LEGACY_FRAME_MS } from "./routeWave1Qa";
import { getRouteWorldRect, ROUTE_PROJECTILE_CULL_MARGIN } from "./routeDynamicEncounter";
import type { RoutePhysicalCamera, RoutePhysicalViewport } from "./routePhysicalCamera";

/**
 * C3B-10: isolated DRONE authority audit. These projections are NEVER adopted
 * by a runtime wave, and never inserted into the encounter or shot arrays.
 * In particular, a projected plasma shot is NOT player damage certification.
 */
export const DRONE_PREFLIGHT_ID = "route-wave3-drone-preflight";
export const DRONE_PREFLIGHT_FIRE_RADIUS = 320;
export const DRONE_PREFLIGHT_STANDOFF_NEAR = 120;
export const DRONE_PREFLIGHT_STANDOFF_FAR = 180;
export const DRONE_PREFLIGHT_PROJECTILE_DAMAGE = 12;
export const DRONE_PREFLIGHT_PROJECTILE_LIFE_MS = 2500;
export const DRONE_PREFLIGHT_PROJECTILE_SPEED_FRAME = 2.2;

export function inspectDroneLockAuthority() {
  const d = createCampaignRuntimeWaveDescriptor(3);
  if (d.sourceMode !== "CAMPAIGN" || d.waveNumber !== 3 ||
      d.source.campaignWaveId !== "drone_lock" ||
      d.spawn.enemyBudget !== 22 || d.spawn.maxConcurrentEnemies !== 14 ||
      d.spawn.spawnIntervalFrames !== 95 || d.spawn.eliteChance !== .1 ||
      d.spawn.enemyComposition.length !== 2 ||
      d.spawn.enemyComposition[0] !== EnemyType.DRONE ||
      d.spawn.enemyComposition[1] !== EnemyType.CRAWLER ||
      d.modifiers.length !== 1 ||
      d.modifiers[0] !== "DRONE_TARGETING_DENSITY" ||
      d.completionPolicy.type !== "TIMEBOX" ||
      d.completionPolicy.durationMs !== 45_000 ||
      d.milestone !== null) {
    throw new Error("Unreviewed Drone Lock canonical authority");
  }
  return d;
}

const finitePoint = (p: RouteLocalPoint) =>
  Number.isFinite(p.x) && Number.isFinite(p.y);
const certifiedDrone = (e: Enemy) =>
  e.id === DRONE_PREFLIGHT_ID && e.type === EnemyType.DRONE &&
  !e.isDead && !e.isBoss && !e.evolvedVariantId &&
  !e.enemyFormation && !e.milestoneKind &&
  Number.isFinite(e.x) && Number.isFinite(e.y) &&
  Number.isFinite(e.speed) && e.speed > 0;

/** The QA sample is a fixed fraction, NOT production Math.random. */
export function makeDroneLockPreflightActor(
  at: RouteLocalPoint, cooldownSample = .5,
): Enemy {
  const d = inspectDroneLockAuthority();
  if (!finitePoint(at) || !Number.isFinite(cooldownSample) ||
      cooldownSample < 0 || cooldownSample >= 1)
    throw new RangeError("Invalid preflight drone input");
  const pressure = projectRuntimeCombatPressure(d);
  const hp = 20 * pressure.enemyHealthMultiplier;
  return {
    id: DRONE_PREFLIGHT_ID, type: EnemyType.DRONE,
    x: at.x, y: at.y, vx: 0, vy: 0,
    health: hp, maxHealth: hp, size: 11,
    speed: .7 * pressure.enemyMovementSpeedMultiplier *
      1000 / ROUTE_WAVE1_LEGACY_FRAME_MS,
    color: "#a855f7", shootCooldown: (80 + cooldownSample * 80) * .6,
    pulseCooldown: 120, contactDamageCooldown: 0,
    isDead: false, isBoss: false, flashTicks: 0,
  };
}

/** Follows the REAL DRONE 120/180 stand-off bands and lateral cosine.
 * Legacy lateral +0.8cos(t*.003) is per update (not delta-scaled);
 * we retain that limitation explicitly rather than inventing new physics.
 */
export function projectDroneLockPreflightMotion(
  actor: Enemy, target: RouteLocalPoint, deltaMs: number, nowMs: number,
  slowFactor = 1,
): RouteLocalPoint {
  if (!certifiedDrone(actor) || !finitePoint(target) ||
      ![deltaMs,nowMs,slowFactor].every(Number.isFinite) ||
      deltaMs < 0 || deltaMs > 50 || nowMs < 0 ||
      slowFactor < 0 || slowFactor > 1)
    throw new RangeError("Uncertified Drone Lock movement");
  if (deltaMs === 0) return {x: actor.x, y: actor.y};
  const dx = target.x - actor.x, dy = target.y - actor.y;
  const dist = Math.hypot(dx,dy);
  const direction = dist > DRONE_PREFLIGHT_STANDOFF_FAR ? 1 :
    dist < DRONE_PREFLIGHT_STANDOFF_NEAR ? -1 : 0;
  const progress = dist > 0 ? direction * actor.speed * slowFactor * deltaMs / 1000 / dist : 0;
  return {
    x: actor.x + dx * progress + Math.cos(nowMs * .003) * .8,
    y: actor.y + dy * progress,
  };
}

/** Only a projected hostile shot: no live spawn, RNG, damage or ownership.
 * Production's 320-unit strict radius and one neutral-signature plasma
 * shot are respected. Velocity converts 2.2 units/16.6ms to units/second.
 */
export function projectDroneLockPreflightShot(
  actor: Enemy, target: RouteLocalPoint, ordinal: number, availableSlots: number,
): Projectile | null {
  inspectDroneLockAuthority();
  if (!certifiedDrone(actor) || !finitePoint(target) ||
      !Number.isSafeInteger(ordinal) || ordinal < 0 ||
      !Number.isSafeInteger(availableSlots) || availableSlots < 0)
    throw new RangeError("Uncertified Drone Lock projectile");
  if (availableSlots === 0) return null;
  const dx = target.x - actor.x, dy = target.y - actor.y;
  const dist2 = dx * dx + dy * dy;
  if (!(dist2 > 0 && dist2 < DRONE_PREFLIGHT_FIRE_RADIUS ** 2))
    return null;
  const angle = Math.atan2(dy,dx);
  const speed = DRONE_PREFLIGHT_PROJECTILE_SPEED_FRAME *
    1000 / ROUTE_WAVE1_LEGACY_FRAME_MS;
  return {
    id:`route-wave3-preflight-shot-${ordinal}`,
    x:actor.x, y:actor.y,
    vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
    damage:DRONE_PREFLIGHT_PROJECTILE_DAMAGE,
    color:"#f43f5e",size:3.5,fromPlayer:false,
    life:DRONE_PREFLIGHT_PROJECTILE_LIFE_MS,
    maxLife:DRONE_PREFLIGHT_PROJECTILE_LIFE_MS,
  };
}

/** Read-only position integration for collision/culling audits. The route
 * combat pipeline does NOT consume these samples in C3B-10.
 */
export function projectDroneLockPreflightProjectileMotion(
  shot: Projectile, deltaMs: number,
): Projectile {
  if (!shot.id.startsWith("route-wave3-preflight-shot-") ||
      shot.fromPlayer || ![shot.x,shot.y,shot.vx,shot.vy,
        shot.life,shot.maxLife,deltaMs].every(Number.isFinite) ||
      deltaMs < 0 || deltaMs > 50 ||
      shot.life < 0 || shot.maxLife !== DRONE_PREFLIGHT_PROJECTILE_LIFE_MS)
    throw new RangeError("Uncertified preflight plasma motion");
  return {
    ...shot,
    x:shot.x+shot.vx*deltaMs/1000,
    y:shot.y+shot.vy*deltaMs/1000,
    life:Math.max(0,shot.life-deltaMs),
  };
}

/** The game's hostile-core test uses a strict (16 + projectile.size)
 * circle, without speculative swept collision. C3B-10 reports a possible
 * contact only; it does not consume shields, health, score or resources.
 */
export function inspectDroneLockPreflightContact(
  shot: Projectile, player: RouteLocalPoint,
): boolean {
  if (!shot.id.startsWith("route-wave3-preflight-shot-") ||
      shot.fromPlayer || shot.size !== 3.5 || !finitePoint(player) ||
      !Number.isFinite(shot.x) || !Number.isFinite(shot.y))
    throw new RangeError("Uncertified preflight contact");
  const dx=shot.x-player.x,dy=shot.y-player.y;
  return shot.life>0 && dx*dx+dy*dy<(16+shot.size)**2;
}

/** QA's finite camera replaces the legacy fixed 1600x900 map. This is
 * a culling PROPOSAL only, not proof that the live drone projectile
 * migration is finished. Never silently cull a coordinate owner.
 */
export function inspectDroneLockPreflightCulling(
  shot: Projectile, camera: RoutePhysicalCamera,
  viewport: RoutePhysicalViewport,
): "KEEP" | "EXPIRED" | "OUTSIDE_ROUTE_VIEW" {
  if (!shot.id.startsWith("route-wave3-preflight-shot-") ||
      shot.fromPlayer || ![shot.x,shot.y,shot.life].every(Number.isFinite))
    throw new RangeError("Uncertified preflight culling");
  if (shot.life<=0) return "EXPIRED";
  const rect=getRouteWorldRect(camera,viewport);
  const margin=ROUTE_PROJECTILE_CULL_MARGIN;
  return shot.x<rect.left-margin || shot.x>rect.right+margin ||
    shot.y<rect.top-margin || shot.y>rect.bottom+margin
    ? "OUTSIDE_ROUTE_VIEW" : "KEEP";
}
