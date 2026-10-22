import { EnemyType, type Enemy } from "./types";
import { WORLD_BOUNDS } from "./constants";
import type {
  BlackoutArchitectEngineIdentityGuard,
  BlackoutArchitectEngineIdentityLifecycleOwner,
} from "./blackoutArchitectEngineIdentityLifecycle";

export type ArchitectSectorWallPhase = "TELEGRAPH" | "ACTIVE" | "RECOVERY";
export interface ArchitectSectorWallSegment {
  readonly id: number;
  readonly directionX: number;
  readonly directionY: number;
  x: number;
  y: number;
  hitRegistered: boolean;
}
export interface BlackoutArchitectDevQaSectorWallState {
  readonly mode: "DEV_QA_SECTOR_WALL_PHYSICAL";
  readonly boss: Enemy;
  readonly guard: Readonly<BlackoutArchitectEngineIdentityGuard>;
  readonly segments: readonly ArchitectSectorWallSegment[];
  phase: ArchitectSectorWallPhase;
  remainingMs: number;
  cycle: number;
  qaHullHealth: number;
  readonly qaHullMaxHealth: 100;
}
export interface ArchitectSectorWallStepResult {
  readonly phase: ArchitectSectorWallPhase;
  readonly cycle: number;
  readonly hits: number;
  readonly damageApplied: number;
  readonly qaHullHealth: number;
  readonly qaHullDepleted: boolean;
}
export const BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG = Object.freeze({
  telegraphMs: 1900,
  activeMs: 1500,
  recoveryMs: 9000,
  segmentBudget: 8,
  startDistance: 74,
  radialSpeed: 0.16, // world units/ms
  segmentHalfLength: 46,
  segmentHalfWidth: 9,
  playerRadius: 10,
  damagePerSegment: 12,
  initialQaHull: 100,
} as const);
export const BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_AUTHORITY = Object.freeze({
  ownsEightPhysicalDevQaWallSegments: true,
  ownsDeterministicWallMotionAndTimers: true,
  ownsSeparateQaHullDamage: true,
  ownsOtherArchitectPatterns: false,
  ownsGlobalProjectilesOrEnemies: false,
  ownsNormalFotonHealthOrShield: false,
  ownsGameScoreOrRewards: false,
  ownsRngOrGlobalClock: false,
  ownsCampaignInfiniteOrScoreAttack: false,
  ownsLegacyBossDamageOrDeath: false,
  ownsFotonOrSwarmMovement: false,
  ownsGlobalCapsOrPersistence: false,
} as const);
const finite=(v:unknown):v is number=>typeof v==="number"&&Number.isFinite(v)&&!Object.is(v,-0);
const directions: readonly (readonly [number,number])[] = Object.freeze(
  Array.from({length:8},(_,i)=>Object.freeze([
    Math.cos(i*Math.PI/4), Math.sin(i*Math.PI/4)
  ] as const))
);
const authenticated=(
  owner:BlackoutArchitectEngineIdentityLifecycleOwner|null,
  guard:Readonly<BlackoutArchitectEngineIdentityGuard>|null,
  boss:Enemy|null,installedBoss:Enemy|null,enemies:readonly Enemy[],
):boss is Enemy=>!!owner&&!!guard&&!!boss&&boss===installedBoss&&
  boss.type===EnemyType.BOSS_ARCHITECT&&
  boss.architectBossIdentity==="BLACKOUT_ARCHITECT"&&
  boss.bossChassis===undefined&&boss.infiniteBossIdentity===undefined&&
  owner.isCurrent(guard,boss,installedBoss,enemies);

const createSegments=(x:number,y:number):readonly ArchitectSectorWallSegment[]=>
  Object.freeze(directions.map(([dx,dy],id)=>Object.seal({
    id,directionX:dx,directionY:dy,
    x:x+dx*BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG.startDistance,
    y:y+dy*BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG.startDistance,
    hitRegistered:false,
  })));

export const createBlackoutArchitectDevQaSectorWallState=(
  owner:BlackoutArchitectEngineIdentityLifecycleOwner|null,
  guard:Readonly<BlackoutArchitectEngineIdentityGuard>|null,
  boss:Enemy|null,installedBoss:Enemy|null,enemies:readonly Enemy[],
  explicitDevQa:boolean,
):BlackoutArchitectDevQaSectorWallState|null=>{
  try {
    if(explicitDevQa!==true||
       !authenticated(owner,guard,boss,installedBoss,enemies)||
       !finite(boss.x)||!finite(boss.y)||
       boss.x<WORLD_BOUNDS.minX||boss.x>WORLD_BOUNDS.maxX||
       boss.y<WORLD_BOUNDS.minY||boss.y>WORLD_BOUNDS.maxY) return null;
    return Object.seal({
      mode:"DEV_QA_SECTOR_WALL_PHYSICAL" as const,boss,guard:guard!,
      segments:createSegments(boss.x,boss.y),
      phase:"TELEGRAPH" as ArchitectSectorWallPhase,
      remainingMs:BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG.telegraphMs,
      cycle:1,qaHullHealth:100,qaHullMaxHealth:100 as const,
    });
  } catch {return null;}
};

/**
 * Eight tangent line segments sweep radially outwards in the authenticated
 * frozen DEV QA encounter. Every separate segment may collide at most once
 * per ACTIVE cycle. Never writes normal player shields or entity collections.
 */
export const stepBlackoutArchitectDevQaSectorWall=(
  owner:BlackoutArchitectEngineIdentityLifecycleOwner|null,
  guard:Readonly<BlackoutArchitectEngineIdentityGuard>|null,
  state:BlackoutArchitectDevQaSectorWallState|null,
  activeState:BlackoutArchitectDevQaSectorWallState|null,
  boss:Enemy|null,installedBoss:Enemy|null,enemies:readonly Enemy[],
  foton:Readonly<{x:number;y:number}>|null,deltaMs:number,
):Readonly<ArchitectSectorWallStepResult>|null=>{
  try {
    if(!state||state!==activeState||!foton||
       !authenticated(owner,guard,boss,installedBoss,enemies)||
       state.boss!==boss||state.guard!==guard||
       state.mode!=="DEV_QA_SECTOR_WALL_PHYSICAL"||
       !finite(boss.x)||!finite(boss.y)||
       !finite(foton.x)||!finite(foton.y)||
       foton.x<WORLD_BOUNDS.minX||foton.x>WORLD_BOUNDS.maxX||
       foton.y<WORLD_BOUNDS.minY||foton.y>WORLD_BOUNDS.maxY||
       !finite(deltaMs)||deltaMs<0||deltaMs>33.2||
       !Number.isSafeInteger(state.cycle)||state.cycle<=0||
       !finite(state.qaHullHealth)||state.qaHullHealth<0||state.qaHullHealth>100||
       state.qaHullMaxHealth!==100||
       !finite(state.remainingMs)||state.remainingMs<=0||
       (state.phase!=="TELEGRAPH"&&state.phase!=="ACTIVE"&&state.phase!=="RECOVERY")||
       !Array.isArray(state.segments)||
       state.segments.length!==BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG.segmentBudget) return null;
    const c=BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG;
    const phaseLimit=state.phase==="TELEGRAPH"?c.telegraphMs:
      state.phase==="ACTIVE"?c.activeMs:c.recoveryMs;
    if(state.remainingMs>phaseLimit) return null;
    const ids=new Set<number>();
    for(const wall of state.segments){
      if(!wall||!Number.isSafeInteger(wall.id)||
         wall.id<0||wall.id>=c.segmentBudget||ids.has(wall.id)||
         !finite(wall.x)||!finite(wall.y)||
         !finite(wall.directionX)||!finite(wall.directionY)||
         Math.abs(wall.directionX-directions[wall.id][0])>1e-10||
         Math.abs(wall.directionY-directions[wall.id][1])>1e-10||
         typeof wall.hitRegistered!=="boolean"||
         // Restricted deterministic sweep envelope, including out-of-world
         // edges that the Canvas clips harmlessly.
         Math.hypot(wall.x-boss.x,wall.y-boss.y)>c.startDistance+c.activeMs*c.radialSpeed+0.001 ||
         Math.abs((wall.x-boss.x)*wall.directionY-(wall.y-boss.y)*wall.directionX)>0.001 ||
         (wall.x-boss.x)*wall.directionX+(wall.y-boss.y)*wall.directionY<c.startDistance-0.001) return null;
      ids.add(wall.id);
    }
    if(ids.size!==c.segmentBudget) return null;
    let hits=0,damageApplied=0;
    if(state.phase==="ACTIVE"&&deltaMs>0){
      for(const wall of state.segments){
        // The final active tick may cross a phase boundary; never move past
        // the fixed, physically attested wall-sweep envelope.
        const activeStepMs=Math.min(deltaMs,state.remainingMs);
        wall.x+=wall.directionX*c.radialSpeed*activeStepMs;
        wall.y+=wall.directionY*c.radialSpeed*activeStepMs;
        if(wall.hitRegistered||state.qaHullHealth===0)continue;
        // Oriented finite tangent-segment rectangle plus FOTON collision radius.
        const relX=foton.x-wall.x,relY=foton.y-wall.y;
        const along= Math.abs(-wall.directionY*relX+wall.directionX*relY);
        const outward=Math.abs(wall.directionX*relX+wall.directionY*relY);
        if(along<=c.segmentHalfLength+c.playerRadius&&
           outward<=c.segmentHalfWidth+c.playerRadius){
          const damage=Math.min(c.damagePerSegment,state.qaHullHealth);
          state.qaHullHealth=Math.max(0,state.qaHullHealth-damage);
          wall.hitRegistered=true;
          hits++;damageApplied+=damage;
        }
      }
    }
    if(deltaMs>=state.remainingMs){
      if(state.phase==="TELEGRAPH"){
        state.phase="ACTIVE";state.remainingMs=c.activeMs;
        for(const wall of state.segments){
          wall.x=boss.x+wall.directionX*c.startDistance;
          wall.y=boss.y+wall.directionY*c.startDistance;
          wall.hitRegistered=false;
        }
      }else if(state.phase==="ACTIVE"){
        state.phase="RECOVERY";state.remainingMs=c.recoveryMs;
      }else{
        if(state.cycle>=Number.MAX_SAFE_INTEGER)return null;
        state.cycle+=1;state.phase="TELEGRAPH";state.remainingMs=c.telegraphMs;
        for(const wall of state.segments){
          wall.x=boss.x+wall.directionX*c.startDistance;
          wall.y=boss.y+wall.directionY*c.startDistance;
          wall.hitRegistered=false;
        }
      }
    }else state.remainingMs-=deltaMs;
    return Object.freeze({
      phase:state.phase,cycle:state.cycle,hits,damageApplied,
      qaHullHealth:state.qaHullHealth,qaHullDepleted:state.qaHullHealth===0,
    });
  }catch{return null;}
};
