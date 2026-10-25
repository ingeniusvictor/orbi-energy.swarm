import { MAX_ENEMIES } from "./constants";
import { createCampaignRuntimeWaveDescriptor, type RuntimeWaveDescriptor } from "./runtimeWaveDescriptor";
import { projectRuntimeCombatPressure } from "./runtimeCombatPressure";
import { ROUTE_QA_ENEMY_CAP,projectRouteViewportSpawn } from "./routeDynamicEncounter";
import { ROUTE_WAVE1_LEGACY_FRAME_MS,ROUTE_WAVE1_QA_ENEMY_PREFIX } from "./routeWave1Qa";
import type { RouteLocalPoint } from "./physicalRouteSpace";
import type { RoutePhysicalCamera,RoutePhysicalViewport } from "./routePhysicalCamera";
import type { RouteQaEncounter } from "./routePhysicalQaEncounter";
import { EnemyType,type Enemy } from "./types";

/** Phase-one certification for ordinary CRAWLER/PARASITE only.
 * The production 5% elite roll and cosmetic intermission remain unlicensed:
 * this lab never converts elite enemies into ordinary equivalents silently. */
export const ROUTE_WAVE2_QA_KEY="CAMPAIGN_QA:parasite_drift";
export const ROUTE_WAVE2_QA_ENEMY_PREFIX="route-wave2-";
export const ROUTE_WAVE2_START_MS=35_000;
export const ROUTE_WAVE2_PARASITE_SURGE=1.4;
export const ROUTE_WAVE2_PARASITE_LUNGE=1.5;
export const ROUTE_WAVE2_PARASITE_FREQUENCY=.015;
export type RouteWave2Status="PENDING"|"ACTIVE"|"GATED_WAVE3";
export interface RouteWave2QaState {
 readonly descriptor:RuntimeWaveDescriptor;
 readonly waveKey:typeof ROUTE_WAVE2_QA_KEY;
 readonly status:RouteWave2Status;
 readonly spawned:number;
 readonly spawnedParasites:number;
 readonly heldForCap:number;
 readonly heldForSafety:number;
 readonly nextSpawnAtMs:number;
 readonly uncertifiedEliteRollsSuppressed:number;
}
export const createRouteWave2QaState=():RouteWave2QaState=>({
 descriptor:createCampaignRuntimeWaveDescriptor(2),
 waveKey:ROUTE_WAVE2_QA_KEY,status:"PENDING",
 spawned:0,spawnedParasites:0,heldForCap:0,heldForSafety:0,
 nextSpawnAtMs:ROUTE_WAVE2_START_MS+110*ROUTE_WAVE1_LEGACY_FRAME_MS,
 uncertifiedEliteRollsSuppressed:0,
});
export const routeWave2DurationMs=(wave:RouteWave2QaState):number=>{
 const policy=wave.descriptor.completionPolicy;
 if(policy.type!=="TIMEBOX")throw new Error("Unsupported Wave2 completion");
 return policy.durationMs;
};
export const routeWave2RemainingMs=(wave:RouteWave2QaState,nowMs:number)=>{
 if(!Number.isFinite(nowMs)||nowMs<0)throw new RangeError("Invalid Wave2 clock");
 return Math.max(0,routeWave2DurationMs(wave)-Math.max(0,nowMs-ROUTE_WAVE2_START_MS));
};
export const countWave2Live=(encounter:RouteQaEncounter)=>
 encounter.enemies.filter(e=>e.id.startsWith(ROUTE_WAVE2_QA_ENEMY_PREFIX)
   &&!e.isDead&&e.health>0).length;

export const isRouteWave2OrdinaryEnemy=(e:Enemy)=>
 !e.isBoss&&!e.evolvedVariantId&&!e.enemyFormation&&
 (e.type===EnemyType.CRAWLER||e.type===EnemyType.PARASITE);

/** Real base PARASITE speed 1.8/frame, PARASITE_SPEED_SURGE ×1.4,
 * baseline biome 1 (an explicitly limited QA assumption).
 * Original health 8×1.15; CRAWLER 15×1.15 and deterministic roll.
 * No production RNG, evolved signatures, formations or elites. */
export function makeRouteWave2Enemy(
  type:EnemyType.CRAWLER|EnemyType.PARASITE,
  ordinal:number,point:RouteLocalPoint,
  descriptor:RuntimeWaveDescriptor,
):Enemy {
 const pressure=projectRuntimeCombatPressure(descriptor);
 const parasite=type===EnemyType.PARASITE;
 const samples=[.1,.3,.5,.7,.9];
 const frameSpeed=parasite?1.8*(descriptor.modifiers.includes("PARASITE_SPEED_SURGE")
   ?ROUTE_WAVE2_PARASITE_SURGE:1)
   :(.8+.6*samples[ordinal%samples.length]);
 const speed=frameSpeed*pressure.enemyMovementSpeedMultiplier/
   ROUTE_WAVE1_LEGACY_FRAME_MS*1000;
 const health=(parasite?8:15)*pressure.enemyHealthMultiplier;
 return {id:`${ROUTE_WAVE2_QA_ENEMY_PREFIX}${ordinal}`,
   type,x:point.x,y:point.y,vx:0,vy:0,
   health,maxHealth:health,speed,size:parasite?8:10,
   color:parasite?"#f43f5e":"#ef4444",shootCooldown:0,
   pulseCooldown:0,contactDamageCooldown:0,
   isDead:false,isBoss:false,flashTicks:0};
}

/** The stock Wave2 composition is [PARASITE, CRAWLER]. Production uses
 * Math.random() and 5% elite probability. These are deliberately not
 * represented as certified outcomes; round-robin sampling is QA-only. */
export function stepRouteWave2Qa(
 previous:RouteWave2QaState,
 encounter:RouteQaEncounter,
 player:RouteLocalPoint,camera:RoutePhysicalCamera,
 viewport:RoutePhysicalViewport,nowMs:number,
):{wave:RouteWave2QaState;encounter:RouteQaEncounter}{
 if(!Number.isFinite(nowMs)||nowMs<0)throw new RangeError("Invalid Wave2 clock");
 const d=previous.descriptor;
 if(d.sourceMode!=="CAMPAIGN"||d.waveNumber!==2||
   d.source.campaignWaveId!=="parasite_drift"||
   d.spawn.enemyBudget!==18||d.spawn.maxConcurrentEnemies!==12||
   d.spawn.spawnIntervalFrames!==110||d.spawn.eliteChance!==.05||
   d.modifiers.length!==1||d.modifiers[0]!=="PARASITE_SPEED_SURGE"||
   d.spawn.enemyComposition.length!==2||
   d.spawn.enemyComposition[0]!==EnemyType.PARASITE||
   d.spawn.enemyComposition[1]!==EnemyType.CRAWLER||
   d.milestone!==null||d.completionPolicy.type!=="TIMEBOX"||
   encounter.boss!==null||encounter.architectQaBoss!==null||
   encounter.hazardZones.length>0||
   encounter.enemies.some(e=>!isRouteWave2OrdinaryEnemy(e))){
   throw new Error("Uncertified Wave2 descriptor/enemy/hazard");
 }
 if(previous.status==="GATED_WAVE3")return {wave:previous,encounter};
 if(nowMs<ROUTE_WAVE2_START_MS)return {wave:previous,encounter};
 if(nowMs>=ROUTE_WAVE2_START_MS+d.completionPolicy.durationMs)
   return {wave:{...previous,status:"GATED_WAVE3"},encounter};
 let wave=previous.status==="PENDING"
   ?{...previous,status:"ACTIVE" as const}:previous;
 if(nowMs<wave.nextSpawnAtMs||wave.spawned>=d.spawn.enemyBudget)
   return {wave,encounter};
 // Count real wave actors across the boundary; never overfill global 12-cap.
 const active=encounter.enemies.filter(e=>!e.isDead&&e.health>0).length;
 const cap=Math.min(d.spawn.maxConcurrentEnemies,ROUTE_QA_ENEMY_CAP,MAX_ENEMIES);
 if(active>=cap||encounter.enemies.length>=cap){
   return {wave:{...wave,heldForCap:wave.heldForCap+1},encounter};
 }
 const ordinal=wave.spawned;
 const side=(["TOP","RIGHT","BOTTOM","LEFT"] as const)[ordinal%4];
 const lane=(ordinal%3+2)/7;
 const radius=Math.max(150,projectRuntimeCombatPressure(d).spawnSafetyRadius);
 const point=projectRouteViewportSpawn(camera,viewport,player,side,lane,radius);
 if(!point)return {wave:{...wave,heldForSafety:wave.heldForSafety+1},encounter};
 const type=d.spawn.enemyComposition[ordinal%d.spawn.enemyComposition.length];
 if(type!==EnemyType.CRAWLER&&type!==EnemyType.PARASITE)
   throw new Error("Uncertified Wave2 enemy roll");
 const enemy=makeRouteWave2Enemy(type,ordinal,point,d);
 wave={...wave,spawned:ordinal+1,
   spawnedParasites:wave.spawnedParasites+(type===EnemyType.PARASITE?1:0),
   // Each QA composition draw skips the uncertified elite probability.
   uncertifiedEliteRollsSuppressed:wave.uncertifiedEliteRollsSuppressed+1,
   nextSpawnAtMs:Math.max(nowMs,wave.nextSpawnAtMs)+
     d.spawn.spawnIntervalFrames*ROUTE_WAVE1_LEGACY_FRAME_MS};
 return {wave,encounter:{...encounter,enemies:[...encounter.enemies,enemy]}};
}

/** Canonical PARASITE twitch lunge (time*0.015 + absolute physical x),
 * converted from legacy 16.6ms steps. Its phase uses global worldX so a
 * 512-unit floating-origin rebase cannot rotate the sine unexpectedly. */
export function projectRouteParasiteMotion(
 enemy:Enemy,player:RouteLocalPoint,deltaMs:number,nowMs:number,
 worldOriginOffsetX:number,slowFactor:number,
):RouteLocalPoint{
 if(enemy.type!==EnemyType.PARASITE||!isRouteWave2OrdinaryEnemy(enemy)||
   [enemy.x,enemy.y,player.x,player.y,deltaMs,nowMs,worldOriginOffsetX,slowFactor]
     .some(x=>!Number.isFinite(x))||deltaMs<0||deltaMs>50||slowFactor<0)
   throw new RangeError("Invalid physical PARASITE movement");
 const dx=player.x-enemy.x,dy=player.y-enemy.y;
 const dist=Math.hypot(dx,dy)||1;
 const dt=deltaMs/1000;
 const lunge=Math.sin(nowMs*ROUTE_WAVE2_PARASITE_FREQUENCY+
   enemy.x+worldOriginOffsetX)*ROUTE_WAVE2_PARASITE_LUNGE*
   deltaMs/ROUTE_WAVE1_LEGACY_FRAME_MS;
 return {x:enemy.x+dx/dist*enemy.speed*slowFactor*dt+lunge,
   y:enemy.y+dy/dist*enemy.speed*slowFactor*dt};
}
