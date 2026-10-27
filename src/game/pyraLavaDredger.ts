/**
 * PYRA-03 — Draga de Lava / Lava Dredger.
 * Heavy iron-basalter: a direction-locked charge with finite heat residue,
 * frontal slag plating and a lateral reactor window. Pure combat director.
 */
import {selectAsteriaRailcutterSpawn,type RailcutterSpawn,
 type RailcutterViewport} from "./asteriaRailcutter";
export type DredgerStage="APPROACH"|"WARN"|"CHARGE"|"EXPOSED"|"RECOVER";
export interface LavaDredgerAttack{
  readonly stage:DredgerStage;
  readonly remainingMs:number;
  readonly facingAngle:number;
  readonly cycle:number;
  readonly emittedTrails:number;
}
export interface DredgerPoint{readonly x:number;readonly y:number}
export interface DredgerStep{
  readonly attack:LavaDredgerAttack;
  readonly x:number;readonly y:number;readonly vx:number;readonly vy:number;
  readonly warned:boolean;readonly charged:boolean;
  readonly trail:boolean;readonly exposed:boolean;
}
export const DREDGER_WARNING_MS=1120;
export const DREDGER_CHARGE_MS=800;
export const DREDGER_EXPOSED_MS=2200;
export const DREDGER_RECOVER_MS=920;
export const DREDGER_TRAIL_INTERVAL_MS=200;
export const DREDGER_TRAIL_CAP=3;
export const DREDGER_TRAIL_LIFE_MS=1350;
export const DREDGER_TRAIL_DAMAGE=9;
export const DREDGER_CONTACT_DAMAGE=14;
export const DREDGER_CHARGE_SPEED=3.5;
export const DREDGER_CHARGE_RADIUS=36;
export const createLavaDredgerAttack=():LavaDredgerAttack=>({
  stage:"APPROACH",remainingMs:0,facingAngle:0,cycle:0,emittedTrails:0,
});
export function shouldSpawnLavaDredger(pyra:boolean,mode:string,wave:number,
  ordinal:number,forced:boolean,miniboss:boolean,alreadyActive:boolean):boolean{
  return pyra&&mode==="CAMPAIGN"&&Number.isSafeInteger(wave)&&wave>=3&&
    Number.isSafeInteger(ordinal)&&ordinal>=0&&ordinal%5===0&&
    !forced&&!miniboss&&!alreadyActive;
}
export function selectLavaDredgerSpawn(camera:RailcutterViewport,
  player:RailcutterSpawn,width:number,height:number,safety:number):
  RailcutterSpawn|null{
  return selectAsteriaRailcutterSpawn(camera,player,width,height,Math.max(230,safety));
}
export const dredgerChargeContact=(a:LavaDredgerAttack,boss:DredgerPoint,
  target:DredgerPoint):boolean=>
  a.stage==="CHARGE"&&Math.hypot(boss.x-target.x,boss.y-target.y)<
  DREDGER_CHARGE_RADIUS;
export function dredgerDamageMultiplier(a:LavaDredgerAttack,
  boss:DredgerPoint,shot:DredgerPoint):number{
  if(![boss.x,boss.y,shot.x,shot.y,a.facingAngle].every(Number.isFinite))
    throw new RangeError("Invalid Dredger damage direction");
  if(a.stage==="EXPOSED")return 2.15;
  const angle=Math.atan2(shot.y-boss.y,shot.x-boss.x);
  const frontal=Math.cos(angle-a.facingAngle)>.56;
  return frontal?.48:1.65;
}
export function stepLavaDredger(a:LavaDredgerAttack,
  pos:DredgerPoint,player:DredgerPoint,speed:number,deltaMs:number):DredgerStep{
  if(![a.remainingMs,a.facingAngle,a.cycle,a.emittedTrails,
    pos.x,pos.y,player.x,player.y,speed,deltaMs].every(Number.isFinite)||
    deltaMs<0||deltaMs>100||speed<0||
    !["APPROACH","WARN","CHARGE","EXPOSED","RECOVER"].includes(a.stage))
    throw new RangeError("Invalid Lava Dredger step");
  const dx=player.x-pos.x,dy=player.y-pos.y;
  const dist=Math.hypot(dx,dy),angle=Math.atan2(dy,dx);
  const stop=(attack:LavaDredgerAttack,flags:Partial<DredgerStep>={}):DredgerStep=>({
    attack,x:pos.x,y:pos.y,vx:0,vy:0,trail:false,
    warned:false,charged:false,exposed:false,...flags,
  });
  if(a.stage==="APPROACH"){
    if(dist>=165&&dist<=440)
      return stop({...a,stage:"WARN",remainingMs:DREDGER_WARNING_MS,
        facingAngle:angle,emittedTrails:0},{warned:true});
    const approach=dist>440?1:-1;
    const vx=Math.cos(angle)*speed*approach*.65;
    const vy=Math.sin(angle)*speed*approach*.65;
    return {attack:a,x:pos.x+vx*deltaMs/16.6,y:pos.y+vy*deltaMs/16.6,
      vx,vy,trail:false,warned:false,charged:false,exposed:false};
  }
  const remaining=a.remainingMs-deltaMs;
  if(a.stage==="WARN")return remaining>0?stop({...a,remainingMs:remaining}):
    stop({...a,stage:"CHARGE",remainingMs:DREDGER_CHARGE_MS},{charged:true});
  if(a.stage==="CHARGE"){
    const elapsed=Math.min(deltaMs,a.remainingMs);
    const vx=Math.cos(a.facingAngle)*DREDGER_CHARGE_SPEED;
    const vy=Math.sin(a.facingAngle)*DREDGER_CHARGE_SPEED;
    const elapsedTotal=DREDGER_CHARGE_MS-Math.max(0,remaining);
    const nextTrailCount=Math.min(DREDGER_TRAIL_CAP,
      Math.floor(elapsedTotal/DREDGER_TRAIL_INTERVAL_MS));
    const spawnTrail=nextTrailCount>a.emittedTrails;
    const attack=remaining>0?{...a,remainingMs:remaining,
      emittedTrails:nextTrailCount}:{
      ...a,stage:"EXPOSED" as const,remainingMs:DREDGER_EXPOSED_MS,
      emittedTrails:nextTrailCount,
    };
    return {attack,x:pos.x+vx*elapsed/16.6,
      y:pos.y+vy*elapsed/16.6,vx,vy,trail:spawnTrail,
      warned:false,charged:false,exposed:remaining<=0};
  }
  if(a.stage==="EXPOSED")return remaining>0?stop({...a,remainingMs:remaining}):
    stop({...a,stage:"RECOVER",remainingMs:DREDGER_RECOVER_MS});
  return remaining>0?stop({...a,remainingMs:remaining}):
    stop({...a,stage:"APPROACH",remainingMs:0,cycle:a.cycle+1});
}
