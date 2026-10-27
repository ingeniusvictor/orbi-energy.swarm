/**
 * PYRA-04 — Cinerita / Cinderling. A quick obsidian hopper that locks a
 * landing zone before leaping, releases exactly one four-way cinder burst,
 * then opens a brief vulnerable cooling window.
 *
 * Pure state/geometry: the native game owns the actor, bullets, health, score
 * and all collision / capacity checks. No extra entities or clocks.
 */
import {selectAsteriaRailcutterSpawn,type RailcutterSpawn,
  type RailcutterViewport} from "./asteriaRailcutter";
export type CinderlingStage="HUNT"|"MARK"|"LEAP"|"BURST"|"COOL";
export interface CinderlingAttack {
  readonly stage:CinderlingStage;
  readonly remainingMs:number;
  readonly targetX:number;
  readonly targetY:number;
  readonly lockedAngle:number;
  readonly cycles:number;
}
export interface CinderlingPoint{readonly x:number;readonly y:number}
export interface CinderlingStep {
  readonly attack:CinderlingAttack;
  readonly x:number;readonly y:number;readonly vx:number;readonly vy:number;
  readonly warned:boolean;readonly fired:boolean;readonly cooled:boolean;
}
export const CINDERLING_WARN_MS=1040;
export const CINDERLING_LEAP_MS=560;
export const CINDERLING_BURST_MS=340;
export const CINDERLING_COOL_MS=1350;
export const CINDERLING_LEAP_SPEED=6.25;
export const CINDERLING_CINDER_SPEED=1.82;
export const CINDERLING_CINDER_DAMAGE=7;
export const CINDERLING_CINDER_LIFE_MS=1650;
export const CINDERLING_BURST_LIMIT=4;
export const CINDERLING_COOL_DAMAGE_MULTIPLIER=1.6;
export const createCinderlingAttack=():CinderlingAttack=>({
  stage:"HUNT",remainingMs:0,targetX:0,targetY:0,
  lockedAngle:0,cycles:0,
});
export const shouldSpawnCinderling=(isPyra:boolean,mode:string,wave:number,
  ordinal:number,forced:boolean,miniboss:boolean,living:boolean):boolean=>
  isPyra&&mode==="CAMPAIGN"&&Number.isSafeInteger(wave)&&wave>=4&&
  Number.isSafeInteger(ordinal)&&ordinal>=0&&ordinal%5===2&&
  !forced&&!miniboss&&!living;
export function selectCinderlingSpawn(camera:RailcutterViewport,
  player:RailcutterSpawn,width:number,height:number,safety:number):
  RailcutterSpawn|null{
  return selectAsteriaRailcutterSpawn(camera,player,width,height,Math.max(safety,185));
}
export function projectCinderlingBurst(x:number,y:number,lockedAngle:number):
  readonly {x:number;y:number;vx:number;vy:number}[]{
  if(![x,y,lockedAngle].every(Number.isFinite))
    throw new RangeError("Invalid cinder burst");
  // Four cardinal rays; diagonal lanes remain free throughout.
  return Array.from({length:CINDERLING_BURST_LIMIT},(_,i)=>{
    const angle=lockedAngle+i*Math.PI/2;
    return {x,y,vx:Math.cos(angle)*CINDERLING_CINDER_SPEED,
      vy:Math.sin(angle)*CINDERLING_CINDER_SPEED};
  });
}
export function cinderlingDamageMultiplier(a:CinderlingAttack):number{
  return a.stage==="COOL"?CINDERLING_COOL_DAMAGE_MULTIPLIER:1;
}
export function stepCinderling(a:CinderlingAttack,pos:CinderlingPoint,
  player:CinderlingPoint,speed:number,deltaMs:number):CinderlingStep{
  if(![a.remainingMs,a.targetX,a.targetY,a.lockedAngle,a.cycles,
    pos.x,pos.y,player.x,player.y,speed,deltaMs].every(Number.isFinite)||
    deltaMs<0||deltaMs>100||speed<0||!Number.isSafeInteger(a.cycles)||
    !["HUNT","MARK","LEAP","BURST","COOL"].includes(a.stage))
    throw new RangeError("Invalid Cinderling tick");
  const deltaX=player.x-pos.x,deltaY=player.y-pos.y;
  const distance=Math.hypot(deltaX,deltaY);
  const angle=Math.atan2(deltaY,deltaX);
  const stay=(attack:CinderlingAttack,
    warned=false,fired=false,cooled=false):CinderlingStep=>({
    attack,x:pos.x,y:pos.y,vx:0,vy:0,warned,fired,cooled,
  });
  if(a.stage==="HUNT"){
    if(distance>=95&&distance<=185){
      return stay({...a,stage:"MARK",remainingMs:CINDERLING_WARN_MS,
        targetX:player.x,targetY:player.y,lockedAngle:angle},true);
    }
    // Follow or retreat until a genuine, feasible leap distance is reached.
    const direction=distance>185?1:-1;
    const vx=Math.cos(angle)*speed*direction*1.15;
    const vy=Math.sin(angle)*speed*direction*1.15;
    return {attack:a,x:pos.x+vx*deltaMs/16.6,y:pos.y+vy*deltaMs/16.6,
      vx,vy,warned:false,fired:false,cooled:false};
  }
  const left=a.remainingMs-deltaMs;
  if(a.stage==="MARK"){
    return left>0?stay({...a,remainingMs:left}):
      stay({...a,stage:"LEAP",remainingMs:CINDERLING_LEAP_MS});
  }
  if(a.stage==="LEAP"){
    // The warning locks a WORLD position; never home on a moving player.
    const dx=a.targetX-pos.x,dy=a.targetY-pos.y;
    const distanceToLock=Math.hypot(dx,dy);
    const travel=Math.min(distanceToLock,
      CINDERLING_LEAP_SPEED*Math.min(deltaMs,a.remainingMs)/16.6);
    const vx=distanceToLock>1e-6?dx/distanceToLock*CINDERLING_LEAP_SPEED:0;
    const vy=distanceToLock>1e-6?dy/distanceToLock*CINDERLING_LEAP_SPEED:0;
    return {attack:left>0?{...a,remainingMs:left}:{
      ...a,stage:"BURST" as const,remainingMs:CINDERLING_BURST_MS},
      x:pos.x+(distanceToLock>1e-6?dx/distanceToLock*travel:0),
      y:pos.y+(distanceToLock>1e-6?dy/distanceToLock*travel:0),
      vx:travel>0?vx:0,vy:travel>0?vy:0,
      warned:false,fired:left<=0,cooled:false};
  }
  if(a.stage==="BURST")
    return left>0?stay({...a,remainingMs:left}):
      stay({...a,stage:"COOL",remainingMs:CINDERLING_COOL_MS},false,false,true);
  return left>0?stay({...a,remainingMs:left}):
    stay({...a,stage:"HUNT",remainingMs:0,cycles:a.cycles+1});
}
