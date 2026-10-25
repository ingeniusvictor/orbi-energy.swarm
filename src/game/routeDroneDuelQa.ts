import type { Enemy, Projectile } from "./types";
import type { RouteLocalPoint } from "./physicalRouteSpace";
import type { RoutePhysicalCamera, RoutePhysicalViewport } from "./routePhysicalCamera";
import { ROUTE_WAVE1_LEGACY_FRAME_MS } from "./routeWave1Qa";
import {
  makeDroneLockPreflightActor,
  projectDroneLockPreflightMotion,
  projectDroneLockPreflightShot,
  projectDroneLockPreflightProjectileMotion,
  inspectDroneLockPreflightContact,
  inspectDroneLockPreflightCulling,
} from "./routeWave3DronePreflightQa";

/**
 * UX15-C3B-11: ONE ordinary physical DRONE, exclusively inside a separately
 * owned QA duel. No Wave3 spawn director, ORBI targeting, production damage,
 * rewards, bosses, evolved drones, or public game modes are connected here.
 */
export const ROUTE_DRONE_DUEL_PROJECTILE_CAP = 6;
export const ROUTE_DRONE_DUEL_SHIELD_START = 100;
export const ROUTE_DRONE_DUEL_COOLDOWN_RESET = 135; // 100 + fixed QA roll .5 * 70
export type RouteDroneDuelStatus = "DISARMED" | "ACTIVE";
export interface RouteDroneDuelQaState {
  readonly status: RouteDroneDuelStatus;
  readonly actor: Enemy | null;
  readonly projectiles: readonly Projectile[];
  readonly shield: number;
  readonly fired: number;
  readonly hits: number;
  readonly expired: number;
  readonly culled: number;
}

export const createRouteDroneDuelQaState = (): RouteDroneDuelQaState => ({
  status:"DISARMED",actor:null,projectiles:[],
  shield:ROUTE_DRONE_DUEL_SHIELD_START,
  fired:0,hits:0,expired:0,culled:0,
});

/** Only an explicit QA action AFTER Parasite Drift is gated may arm the duel.
 * Normal campaign DRONE enemies and Wave3 budget remain entirely disabled.
 */
export function armRouteDroneDuelQa(
  state:RouteDroneDuelQaState,
  player:RouteLocalPoint,
  wave2Gated:boolean,
):RouteDroneDuelQaState {
  if(!wave2Gated)throw new Error("Drone duel denied while Wave3 is not gated");
  if(state.status!=="DISARMED"||state.actor||state.projectiles.length)
    throw new Error("Drone duel requires a clean disarmed QA state");
  if(![player.x,player.y].every(Number.isFinite))
    throw new RangeError("Invalid drone duel position");
  return {
    ...state,status:"ACTIVE",
    actor:makeDroneLockPreflightActor({x:player.x+260,y:player.y}),
  };
}

/** Integrates the canonical DRONE's original radial stand-off, lateral drift,
 * neutral cooldown and hostile plasma as REAL moving coordinates in the QA
 * duel. Contact subtracts the 12-unit canonical projectile damage from ONLY
 * the local QA shield, not the game's CombatBridge shield or FOTON life.
 */
export function stepRouteDroneDuelQa(
  prior:RouteDroneDuelQaState,
  player:RouteLocalPoint,
  camera:RoutePhysicalCamera,
  viewport:RoutePhysicalViewport,
  deltaMs:number,
  nowMs:number,
):RouteDroneDuelQaState {
  if(![deltaMs,nowMs,player.x,player.y].every(Number.isFinite)||
      deltaMs<0||deltaMs>50||nowMs<0)
    throw new RangeError("Invalid drone duel tick");
  if(prior.status==="DISARMED"){
    if(prior.actor||prior.projectiles.length)throw new Error("Disarmed drone leaked owners");
    return prior;
  }
  if(!prior.actor)throw new Error("Active drone duel missing actor");
  if(deltaMs===0)return prior;
  const motion=projectDroneLockPreflightMotion(prior.actor,player,deltaMs,nowMs);
  let actor:Enemy={...prior.actor,...motion,
    shootCooldown:prior.actor.shootCooldown-deltaMs/ROUTE_WAVE1_LEGACY_FRAME_MS};
  let fired=prior.fired, hits=prior.hits, expired=prior.expired,culled=prior.culled;
  const projectiles:Projectile[]=prior.projectiles.map(p=>({...p}));
  if(actor.shootCooldown<=0){
    // Production resets the ordinary DRONE's cooldown even if the target is
    // out of its strict <320 radius or the 6-slot QA budget is exhausted.
    actor={...actor,shootCooldown:ROUTE_DRONE_DUEL_COOLDOWN_RESET};
    const shot=projectDroneLockPreflightShot(actor,player,fired,
      ROUTE_DRONE_DUEL_PROJECTILE_CAP-projectiles.length);
    if(shot){projectiles.push(shot);fired++;}
  }
  const surviving:Projectile[]=[];
  let shield=prior.shield;
  for(const shot of projectiles){
    const next=projectDroneLockPreflightProjectileMotion(shot,deltaMs);
    if(inspectDroneLockPreflightContact(next,player)){
      hits++;
      shield=Math.max(0,shield-next.damage);
      continue;
    }
    const cull=inspectDroneLockPreflightCulling(next,camera,viewport);
    if(cull==="EXPIRED"){expired++;continue;}
    if(cull==="OUTSIDE_ROUTE_VIEW"){culled++;continue;}
    surviving.push(next);
  }
  return {...prior,actor,projectiles:surviving,shield,fired,hits,expired,culled};
}
