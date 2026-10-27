/**
 * PYRA-02 — Lanzaescoria / Slag Spear.
 * A direction-locked, announced lance that can be intercepted by native ORBI
 * projectiles, then forks exactly once at a bounded distance.
 * Pure timing / geometry helpers — original game owns all collision and rewards.
 */
import {selectAsteriaRailcutterSpawn,type RailcutterSpawn,
 type RailcutterViewport} from "./asteriaRailcutter";
export type SlagStage="POSITION"|"WARN"|"FIRE"|"RECOVER";
export interface SlagSpearAttack {
  readonly stage:SlagStage;
  readonly remainingMs:number;
  readonly lockedX:number;readonly lockedY:number;
  readonly lockedAngle:number;readonly cycle:number;
}
export interface SlagSpearStep {
  readonly attack:SlagSpearAttack;
  readonly x:number;readonly y:number;
  readonly vx:number;readonly vy:number;
  readonly warned:boolean;readonly fire:boolean;
}
export interface SlagSpearPoint{readonly x:number;readonly y:number}
export const SLAG_WARNING_MS=1150;
export const SLAG_RECOVER_MS=1600;
export const SLAG_LANCE_SPEED=1.95;
export const SLAG_LANCE_DAMAGE=12;
export const SLAG_LANCE_DISTANCE=245;
export const SLAG_LANCE_LIFE_MS=3400;
export const SLAG_FRAGMENT_SPEED=2.4;
export const SLAG_FRAGMENT_DAMAGE=6;
export const SLAG_FRAGMENT_LIFE_MS=1400;
export const SLAG_FRAGMENT_ANGLE=.35;
export const createSlagSpearAttack=():SlagSpearAttack=>({
  stage:"POSITION",remainingMs:0,lockedX:0,lockedY:0,
  lockedAngle:0,cycle:0,
});
export const shouldSpawnSlagSpear=(pyra:boolean,mode:string,wave:number,
  ordinal:number,forced:boolean,miniboss:boolean,active:boolean):boolean=>
  pyra&&mode==="CAMPAIGN"&&Number.isSafeInteger(wave)&&wave>=2&&
  Number.isSafeInteger(ordinal)&&ordinal>=0&&ordinal%5===3&&
  !forced&&!miniboss&&!active;
export function selectSlagSpearSpawn(cam:RailcutterViewport,
  player:RailcutterSpawn,width:number,height:number,safety:number):
  RailcutterSpawn|null{
  return selectAsteriaRailcutterSpawn(cam,player,width,height,Math.max(safety,190));
}
export function stepSlagSpear(a:SlagSpearAttack,pos:SlagSpearPoint,
  player:SlagSpearPoint,speed:number,deltaMs:number):SlagSpearStep{
  if(![a.remainingMs,a.lockedAngle,a.lockedX,a.lockedY,
    pos.x,pos.y,player.x,player.y,speed,deltaMs].every(Number.isFinite)||
    deltaMs<0||deltaMs>100||speed<0||!["POSITION","WARN","FIRE","RECOVER"].includes(a.stage))
    throw new RangeError("Invalid Slag Spear step");
  const dx=player.x-pos.x,dy=player.y-pos.y;
  const dist=Math.hypot(dx,dy),angle=Math.atan2(dy,dx);
  const stop=(attack:SlagSpearAttack,fire=false,warned=false):SlagSpearStep=>({
    attack,x:pos.x,y:pos.y,vx:0,vy:0,fire,warned,
  });
  if(a.stage==="POSITION"){
    if(dist>=170&&dist<=420)
      return stop({...a,stage:"WARN",remainingMs:SLAG_WARNING_MS,
        lockedX:player.x,lockedY:player.y,lockedAngle:angle},false,true);
    const direction=dist>420?1:-1;
    const vx=Math.cos(angle)*speed*direction*.9;
    const vy=Math.sin(angle)*speed*direction*.9;
    return {attack:a,x:pos.x+vx*deltaMs/16.6,y:pos.y+vy*deltaMs/16.6,
      vx,vy,fire:false,warned:false};
  }
  const remaining=a.remainingMs-deltaMs;
  if(a.stage==="WARN")
    return stop(remaining>0?{...a,remainingMs:remaining}:
      {...a,stage:"FIRE",remainingMs:1},remaining<=0);
  if(a.stage==="FIRE")
    return stop({...a,stage:"RECOVER",remainingMs:SLAG_RECOVER_MS});
  return stop(remaining>0?{...a,remainingMs:remaining}:
    {...a,stage:"POSITION",remainingMs:0,cycle:a.cycle+1});
}
/** Two strictly finite child fragments; never re-split fragments. */
export function projectSlagFragments(x:number,y:number,vx:number,vy:number):
  readonly {x:number;y:number;vx:number;vy:number}[]{
  if(![x,y,vx,vy].every(Number.isFinite))throw new RangeError("Invalid lance split");
  const angle=Math.atan2(vy,vx);
  return [-SLAG_FRAGMENT_ANGLE,SLAG_FRAGMENT_ANGLE].map(offset=>({
    x,y,vx:Math.cos(angle+offset)*SLAG_FRAGMENT_SPEED,
    vy:Math.sin(angle+offset)*SLAG_FRAGMENT_SPEED,
  }));
}
/** ORBI intercepts the lance through the existing projectile collision pass. */
export const interceptSlagLance=(shot:SlagSpearPoint,shotRadius:number,
  lance:SlagSpearPoint,lanceRadius:number):boolean=>{
  if(![shot.x,shot.y,shotRadius,lance.x,lance.y,lanceRadius].every(Number.isFinite)||
    shotRadius<0||lanceRadius<0)return false;
  return Math.hypot(shot.x-lance.x,shot.y-lance.y)<=shotRadius+lanceRadius;
};
