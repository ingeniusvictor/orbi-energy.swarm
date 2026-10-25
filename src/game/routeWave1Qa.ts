import { MAX_ENEMIES } from "./constants";
import { createCampaignRuntimeWaveDescriptor, type RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";
import { projectRuntimeCombatPressure } from "./runtimeCombatPressure";
import {
  ROUTE_QA_ENEMY_CAP,
  projectRouteViewportSpawn,
} from "./routeDynamicEncounter";
import type { RouteLocalPoint } from "./physicalRouteSpace";
import type { RoutePhysicalCamera, RoutePhysicalViewport } from "./routePhysicalCamera";
import type { RouteQaEncounter } from "./routePhysicalQaEncounter";
import { EnemyType, type Enemy } from "./types";

/**
 * UX15-C3B-7. Wave 1 is the ONLY certified campaign encounter in physical
 * QA. Real RuntimeWaveDescriptor is authoritative; no wave-2 approximation.
 */
export const ROUTE_WAVE1_SCOUT_TIMES_MS=[500,2000,3500,5000] as const;
export const ROUTE_WAVE1_LEGACY_FRAME_MS=16.6;
export const ROUTE_WAVE1_ORIGINAL_MIN_SPEED_FRAME=.8;
export const ROUTE_WAVE1_ORIGINAL_SPEED_SPREAD_FRAME=.6;
export const ROUTE_WAVE1_QA_ENEMY_PREFIX="route-wave1-scout-";
export const ROUTE_WAVE1_QA_KEY="CAMPAIGN_QA:scout_signal";

export type RouteWave1Status="ACTIVE"|"GATED_NEXT_WAVE";
export interface RouteWave1QaState {
  readonly descriptor:RuntimeWaveDescriptor;
  readonly waveKey:typeof ROUTE_WAVE1_QA_KEY;
  readonly spawned:number;
  readonly spawnAttempts:number;
  readonly heldForConcurrentCap:number;
  readonly heldForSafety:number;
  readonly nextSpawnAtMs:number;
  readonly status:RouteWave1Status;
}
export const createRouteWave1QaState=():RouteWave1QaState=>({
  descriptor:createCampaignRuntimeWaveDescriptor(1),
  waveKey:ROUTE_WAVE1_QA_KEY,
  spawned:0,spawnAttempts:0,heldForConcurrentCap:0,heldForSafety:0,
  nextSpawnAtMs:ROUTE_WAVE1_SCOUT_TIMES_MS[0],status:"ACTIVE",
});

export const countRouteWave1Active=(encounter:RouteQaEncounter):number=>
  encounter.enemies.filter(e=>e.id.startsWith(ROUTE_WAVE1_QA_ENEMY_PREFIX)&&
    !e.isDead&&e.health>0).length;

export const projectRouteWave1RemainingMs=(state:RouteWave1QaState,nowMs:number)=>{
  if(!Number.isFinite(nowMs)||nowMs<0)throw new RangeError("Invalid wave-1 clock");
  const completion=state.descriptor.completionPolicy;
  if(completion.type!=="TIMEBOX")throw new Error("Non-timeboxed wave-1 descriptor");
  return Math.max(0,completion.durationMs-nowMs);
};

/**
 * Official campaign wave #1 pacing, adapted to camera-relative physical
 * space: 500/2000/3500/5000 ms, then 140 frames * 16.6 ms, budget 12,
 * concurrent 8. Only standard CRAWLER is permitted. Original random speed
 * [.8..1.4] units/frame has a deterministic, bounded QA sample per scout;
 * game RNG is NEVER called and gameplay seed/state never changes.
 */
export function stepRouteWave1Qa(
  previous:RouteWave1QaState,
  encounter:RouteQaEncounter,
  player:RouteLocalPoint,
  camera:RoutePhysicalCamera,
  viewport:RoutePhysicalViewport,
  nowMs:number,
):{wave:RouteWave1QaState;encounter:RouteQaEncounter} {
  if(!Number.isFinite(nowMs)||nowMs<0)throw new RangeError("Invalid wave-1 clock");
  const d=previous.descriptor;
  if(d.sourceMode!=="CAMPAIGN"||d.waveNumber!==1||
    d.source.campaignWaveId!=="scout_signal"||
    d.completionPolicy.type!=="TIMEBOX"||
    d.spawn.enemyComposition.length!==1||
    d.spawn.enemyComposition[0]!==EnemyType.CRAWLER||
    d.spawn.eliteChance!==0||d.milestone!==null||d.modifiers.length!==0||
    encounter.boss!==null||encounter.architectQaBoss!==null||
    encounter.hazardZones.length!==0||
    encounter.enemies.some(e=>e.isBoss||e.type!==EnemyType.CRAWLER)){
    throw new Error("Uncertified wave descriptor, enemy or hazard in physical QA");
  }
  if(previous.status!=="ACTIVE")return {wave:previous,encounter};
  if(nowMs>=d.completionPolicy.durationMs)
    return {wave:{...previous,status:"GATED_NEXT_WAVE"},encounter};
  if(previous.spawned>=d.spawn.enemyBudget||nowMs<previous.nextSpawnAtMs)
    return {wave:previous,encounter};
  const cap=Math.min(d.spawn.maxConcurrentEnemies,ROUTE_QA_ENEMY_CAP,MAX_ENEMIES);
  const active=countRouteWave1Active(encounter);
  if(active>=cap || encounter.enemies.length>=Math.min(ROUTE_QA_ENEMY_CAP,MAX_ENEMIES)){
    return {wave:{...previous,spawnAttempts:previous.spawnAttempts+1,
      heldForConcurrentCap:previous.heldForConcurrentCap+1},encounter};
  }
  const ordinal=previous.spawned;
  const side=(["TOP","RIGHT","BOTTOM","LEFT"] as const)[ordinal%4];
  const fraction=side==="TOP"||side==="BOTTOM"
    ? .42+((ordinal%3)-1)*.10
    : .24+((ordinal*7)%11)/11*.48;
  const pressure=projectRuntimeCombatPressure(d);
  const point=projectRouteViewportSpawn(
    camera,viewport,player,side,fraction,Math.max(150,pressure.spawnSafetyRadius),
  );
  if(!point)return {wave:{...previous,
    spawnAttempts:previous.spawnAttempts+1,
    heldForSafety:previous.heldForSafety+1},encounter};
  const samples=[.1,.3,.5,.7,.9] as const;
  const originalSpeed=ROUTE_WAVE1_ORIGINAL_MIN_SPEED_FRAME+
    ROUTE_WAVE1_ORIGINAL_SPEED_SPREAD_FRAME*samples[ordinal%samples.length];
  const health=15*pressure.enemyHealthMultiplier;
  const speed=originalSpeed/ROUTE_WAVE1_LEGACY_FRAME_MS*1000*
    pressure.enemyMovementSpeedMultiplier;
  const crawler:Enemy={
    id:`${ROUTE_WAVE1_QA_ENEMY_PREFIX}${ordinal}`,type:EnemyType.CRAWLER,
    x:point.x,y:point.y,vx:0,vy:0,
    health,maxHealth:health,speed,size:10,color:"#ef4444",
    shootCooldown:0,pulseCooldown:0,contactDamageCooldown:0,
    isDead:false,isBoss:false,flashTicks:0,
  };
  const spawned=ordinal+1;
  const periodMs=d.spawn.spawnIntervalFrames*ROUTE_WAVE1_LEGACY_FRAME_MS;
  const nextSpawnAtMs=spawned<ROUTE_WAVE1_SCOUT_TIMES_MS.length
    ? ROUTE_WAVE1_SCOUT_TIMES_MS[spawned]
    : spawned===ROUTE_WAVE1_SCOUT_TIMES_MS.length
      ? 5500+periodMs
      : Math.max(previous.nextSpawnAtMs,nowMs)+periodMs;
  return {
    wave:{...previous,spawned,
      spawnAttempts:previous.spawnAttempts+1,
      nextSpawnAtMs},
    encounter:{...encounter,enemies:[...encounter.enemies,crawler]},
  };
}
