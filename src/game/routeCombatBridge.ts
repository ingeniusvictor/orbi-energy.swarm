import {
  ENEMY_SPATIAL_CELL_SIZE,
  buildSpatialIndex,
  findFirstCollidingSpatialItem,
  findNearestSpatialItem,
} from "./spatialIndex";
import {
  createPropulsionDashState,
  type DashVector,
  type PropulsionDashState,
} from "./propulsionDash";
import { DASH_PLAYER_RADIUS } from "./propulsionDash";
import type { RouteLocalPoint } from "./physicalRouteSpace";
import type { RouteQaEncounter } from "./routePhysicalQaEncounter";

/** UX15-C3B-2: live-engine *core* adapters certified in opt-in route QA only.
 * This state is not GameStats, has no persistence and cannot issue rewards. */
export const ROUTE_BRIDGE_INITIAL_SHIELD=100;
export const ROUTE_BRIDGE_CONTACT_DAMAGE=8;
export const ROUTE_BRIDGE_CONTACT_COOLDOWN_MS=1_000;
export const ROUTE_BRIDGE_NEAREST_RANGE=1200;

export interface RouteCombatBridgeState {
  readonly dash: PropulsionDashState;
  readonly lastDashDirection: DashVector;
  readonly shield: number;
  readonly contactHits: number;
  readonly lastContactAtMs: number | null;
  readonly nearestDistance: number | null;
  readonly spatialEnemyCount: number;
  readonly spatialCandidateChecks: number;
}

export function createRouteCombatBridgeState(): RouteCombatBridgeState {
  return {
    dash:createPropulsionDashState(),
    lastDashDirection:{x:1,y:0},
    shield:ROUTE_BRIDGE_INITIAL_SHIELD,
    contactHits:0,lastContactAtMs:null,
    nearestDistance:null,spatialEnemyCount:0,spatialCandidateChecks:0,
  };
}

export function resolveRouteDashDirection(
  input: DashVector,
  previous: DashVector,
): DashVector {
  for(const value of [input.x,input.y,previous.x,previous.y]){
    if(!Number.isFinite(value))throw new RangeError("Invalid Dash direction");
  }
  const magnitude=Math.hypot(input.x,input.y);
  if(magnitude>0.001)return {x:input.x/magnitude,y:input.y/magnitude};
  return previous;
}

/** One ephemeral index per physics tick. Never store it across floating-origin
 * epochs; index coordinates are snapshots, not mutable actor references.
 * The query/overlap code is the SAME spatialIndex used in EnergySwarmGame. */
export function stepRouteCombatBridge(
  encounter:RouteQaEncounter,
  previous:RouteCombatBridgeState,
  player:RouteLocalPoint,
  nowMs:number,
):RouteCombatBridgeState {
  if(!Number.isFinite(nowMs)||nowMs<0||
     !Number.isFinite(player.x)||!Number.isFinite(player.y))
    throw new RangeError("Invalid route combat-bridge clock/position");
  // No boss phases, telegraphs or registered hazards have been certified.
  if(encounter.boss!==null || encounter.architectQaBoss!==null ||
     encounter.hazardZones.length>0 && encounter.hazardZones.some(
       zone=>zone.r!==undefined && zone.r>0,
     ) ||
     encounter.enemies.some(enemy=>enemy.isBoss)){
    throw new Error("Uncertified boss/hazard encounter is denied by C3B2 gate");
  }
  const liveEnemies=encounter.enemies.filter(e=>!e.isDead&&e.health>0);
  const index=buildSpatialIndex(liveEnemies,{
    cellSize:ENEMY_SPATIAL_CELL_SIZE,
    getX:e=>e.x,getY:e=>e.y,getRadius:e=>e.size,
  });
  const nearest=findNearestSpatialItem(
    index,player.x,player.y,ROUTE_BRIDGE_NEAREST_RANGE,
  );
  const overlap=findFirstCollidingSpatialItem(
    index,player.x,player.y,DASH_PLAYER_RADIUS,
  );
  const ready=previous.lastContactAtMs===null ||
    nowMs-previous.lastContactAtMs>=ROUTE_BRIDGE_CONTACT_COOLDOWN_MS;
  const collided=overlap.item!==null&&ready&&previous.shield>0;
  return {
    ...previous,
    shield:collided?Math.max(0,previous.shield-ROUTE_BRIDGE_CONTACT_DAMAGE):
      previous.shield,
    contactHits:previous.contactHits+(collided?1:0),
    lastContactAtMs:collided?nowMs:previous.lastContactAtMs,
    nearestDistance:nearest.item?Math.sqrt(nearest.distanceSquared):null,
    spatialEnemyCount:index.size,
    spatialCandidateChecks:nearest.candidateChecks+overlap.candidateChecks,
  };
}
