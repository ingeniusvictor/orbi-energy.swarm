/**
 * WBE-01B/C/D — Three ORIGINAL ASTERIA foes running exclusively inside
 * the public Mundo Nuevo engine. Pure, time-bounded steering; the canonical
 * engine owns all projectiles, budgets, contacts, damage, ORBI hits and drops.
 */
import {
  selectAsteriaRailcutterSpawn,
  type RailcutterSpawn,
  type RailcutterViewport,
} from "./asteriaRailcutter";

export type AsteriaNewFoeId = "SKY_SPECTER" | "BEACON_PRISM" | "ION_SAIL";
export type SkySpecterPhase = "CLIMB" | "LOCK" | "DIVE" | "BREAK";
export interface SkySpecterAttack {
  readonly phase: SkySpecterPhase;
  readonly remainingMs:number;
  readonly dirX:number;
  readonly dirY:number;
  readonly flankSide: -1 | 1;
}
export type BeaconPrismPhase = "POSITION" | "MARK" | "COOLDOWN";
export interface BeaconPrismAttack {
  readonly phase: BeaconPrismPhase;
  readonly remainingMs:number;
  readonly targetX:number;
  readonly targetY:number;
}
export type IonSailPhase = "APPROACH" | "WARN" | "SWEEP" | "RECOVER";
export interface IonSailAttack {
  readonly phase: IonSailPhase;
  readonly remainingMs:number;
  readonly dirX:number;
  readonly dirY:number;
  readonly nextTrailMs:number;
}
export interface AsteriaFoeStep<T> {
  readonly x:number;readonly y:number;
  readonly vx:number;readonly vy:number;
  readonly attack:T;
  readonly fire?:boolean;
  readonly placeTrail?:boolean;
}
const FRAME_MS=16.6;
export const SKY_SPECTER_WARNING_MS=780;
export const SKY_SPECTER_DIVE_MS=480;
export const BEACON_PRISM_WARNING_MS=900;
export const BEACON_PRISM_FAN_RADIANS=.24;
export const ION_SAIL_WARNING_MS=720;
export const ION_SAIL_SWEEP_MS=1200;
export const ION_SAIL_TRAIL_LIFE_MS=850;
export const ION_SAIL_TRAIL_DAMAGE=5;
export const ION_SAIL_TRAIL_INTERVAL_MS=320;
const validate=(position:RailcutterSpawn,target:RailcutterSpawn,speed:number,dt:number)=>
  [position.x,position.y,target.x,target.y,speed,dt].every(Number.isFinite)&&
  speed>=0&&dt>=0&&dt<=100;
const unit=(x:number,y:number):{x:number;y:number}=>{
  const d=Math.hypot(x,y);
  return d>.00001?{x:x/d,y:y/d}:{x:-1,y:0};
};
export const createSkySpecterAttack=(flankSide:-1|1):SkySpecterAttack=>({
  phase:"CLIMB",remainingMs:0,dirX:-1,dirY:0,flankSide,
});
export const createBeaconPrismAttack=():BeaconPrismAttack=>({
  phase:"POSITION",remainingMs:0,targetX:0,targetY:0,
});
export const createIonSailAttack=():IonSailAttack=>({
  phase:"APPROACH",remainingMs:0,dirX:-1,dirY:0,nextTrailMs:0,
});

/**
 * Slots are mutually exclusive and never steal forced/miniboss spawns.
 * Railcutter already occupies n%5===3. One active of each new type,
 * deliberately escalating after the player learns the first encounter.
 */
export function resolveAsteriaNewFoe(
  worldRoute:boolean,mode:string,wave:number,ordinal:number,
  forced:boolean,miniboss:boolean,active:(type:AsteriaNewFoeId)=>boolean,
):AsteriaNewFoeId|null{
  if(!worldRoute||mode!=="CAMPAIGN"||forced||miniboss||
     !Number.isInteger(wave)||!Number.isInteger(ordinal)||ordinal<0)return null;
  const mod=ordinal%5;
  const candidate:AsteriaNewFoeId|null=
    wave>=2&&mod===1?"SKY_SPECTER":
    wave>=3&&mod===2?"BEACON_PRISM":
    wave>=4&&mod===4?"ION_SAIL":null;
  return candidate&&!active(candidate)?candidate:null;
}
export function selectAsteriaNewFoeSpawn(
  type:AsteriaNewFoeId,camera:RailcutterViewport,
  player:RailcutterSpawn,worldWidth:number,worldHeight:number,
  safetyRadius:number,
):RailcutterSpawn|null{
  if(type!=="SKY_SPECTER")return selectAsteriaRailcutterSpawn(
    camera,player,worldWidth,worldHeight,safetyRadius);
  const {cameraX,cameraY,viewportWidth,viewportHeight,zoom}=camera;
  if(![cameraX,cameraY,viewportWidth,viewportHeight,zoom,player.x,player.y,
    worldWidth,worldHeight,safetyRadius].every(Number.isFinite)||
    zoom<=0||viewportWidth<=0||viewportHeight<=0||safetyRadius<0)
    throw new RangeError("Invalid Skydive Specter spawn");
  // Prefer an actual vertical approach; fallback to regular safe candidate.
  const x=Math.max(16,Math.min(worldWidth-16,
    cameraX+viewportWidth/zoom*.8));
  const top=Math.max(16,Math.min(worldHeight-16,cameraY-90));
  const bottom=Math.max(16,Math.min(worldHeight-16,
    cameraY+viewportHeight/zoom+90));
  for(const y of [player.y>worldHeight/2?top:bottom,
    player.y>worldHeight/2?bottom:top]){
    if(Math.hypot(x-player.x,y-player.y)>=safetyRadius)
      return {x,y};
  }
  return selectAsteriaRailcutterSpawn(
    camera,player,worldWidth,worldHeight,safetyRadius);
}
export function stepSkySpecter(
  attack:SkySpecterAttack,pos:RailcutterSpawn,target:RailcutterSpawn,
  speed:number,dt:number,worldWidth=1600,worldHeight=960,
):AsteriaFoeStep<SkySpecterAttack>{
  if(!validate(pos,target,speed,dt)||!Number.isFinite(attack.remainingMs)||
     ![worldWidth,worldHeight].every(Number.isFinite)||
     worldWidth<=64||worldHeight<=64)
    throw new RangeError("Invalid Skydive Specter tick");
  const staticStep=(state:SkySpecterAttack):AsteriaFoeStep<SkySpecterAttack>=>({
    x:pos.x,y:pos.y,vx:0,vy:0,attack:state,
  });
  if(attack.phase==="CLIMB"){
    // The live campaign remains in 1600x960 legacy combat bounds.
    // Prevent a permanent CLIMB when ENERGY is near its right/top/bottom wall.
    const goalX=Math.max(32,Math.min(worldWidth-32,target.x+120));
    const goalY=Math.max(32,Math.min(worldHeight-32,
      target.y+attack.flankSide*190));
    const dx=goalX-pos.x;
    const dy=goalY-pos.y;
    if(Math.hypot(dx,dy)<55){
      const aim=unit(target.x-pos.x,target.y-pos.y);
      return staticStep({phase:"LOCK",remainingMs:SKY_SPECTER_WARNING_MS,
        dirX:aim.x,dirY:aim.y,flankSide:attack.flankSide});
    }
    const dir=unit(dx,dy);
    const vx=dir.x*speed*1.55,vy=dir.y*speed*1.55;
    return {x:pos.x+vx*dt/FRAME_MS,y:pos.y+vy*dt/FRAME_MS,vx,vy,attack};
  }
  if(attack.phase==="LOCK"){
    const remaining=attack.remainingMs-dt;
    return staticStep(remaining<=0?{...attack,phase:"DIVE",
      remainingMs:SKY_SPECTER_DIVE_MS}:{...attack,remainingMs:remaining});
  }
  if(attack.phase==="DIVE"){
    const frame=Math.min(dt,attack.remainingMs)/FRAME_MS;
    const vx=attack.dirX*Math.max(2,6*speed),vy=attack.dirY*Math.max(2,6*speed);
    return {x:pos.x+vx*frame,y:pos.y+vy*frame,vx,vy,
      attack:dt>=attack.remainingMs?{...attack,phase:"BREAK",remainingMs:1050}:
        {...attack,remainingMs:attack.remainingMs-dt}};
  }
  if(attack.phase==="BREAK"){
    const remaining=attack.remainingMs-dt;
    return staticStep(remaining<=0?createSkySpecterAttack(
      attack.flankSide===-1?1:-1):{...attack,remainingMs:remaining});
  }
  throw new Error("Unknown Skydive Specter phase");
}
export function stepBeaconPrism(
  attack:BeaconPrismAttack,pos:RailcutterSpawn,target:RailcutterSpawn,
  speed:number,dt:number,
):AsteriaFoeStep<BeaconPrismAttack>{
  if(!validate(pos,target,speed,dt)||!Number.isFinite(attack.remainingMs))
    throw new RangeError("Invalid Beacon Prism tick");
  const dx=target.x-pos.x,dy=target.y-pos.y,dist=Math.hypot(dx,dy);
  if(attack.phase==="POSITION"){
    if(dist>=190&&dist<=270)return {x:pos.x,y:pos.y,vx:0,vy:0,
      attack:{phase:"MARK",remainingMs:BEACON_PRISM_WARNING_MS,
        targetX:target.x,targetY:target.y}};
    const dir=unit(dx,dy),radial=dist>270?1:-1;
    const vx=dir.x*speed*radial,vy=dir.y*speed*radial;
    return {x:pos.x+vx*dt/FRAME_MS,y:pos.y+vy*dt/FRAME_MS,vx,vy,attack};
  }
  if(attack.phase==="MARK"){
    const remaining=attack.remainingMs-dt;
    if(remaining<=0)return {x:pos.x,y:pos.y,vx:0,vy:0,fire:true,
      attack:{...attack,phase:"COOLDOWN",remainingMs:1800}};
    return {x:pos.x,y:pos.y,vx:0,vy:0,attack:{...attack,remainingMs:remaining}};
  }
  if(attack.phase==="COOLDOWN"){
    const remaining=attack.remainingMs-dt;
    return {x:pos.x,y:pos.y,vx:0,vy:0,
      attack:remaining<=0?createBeaconPrismAttack():{...attack,remainingMs:remaining}};
  }
  throw new Error("Unknown Beacon Prism phase");
}
export function stepIonSail(
  attack:IonSailAttack,pos:RailcutterSpawn,target:RailcutterSpawn,
  speed:number,dt:number,
):AsteriaFoeStep<IonSailAttack>{
  if(!validate(pos,target,speed,dt)||!Number.isFinite(attack.remainingMs)||
     !Number.isFinite(attack.nextTrailMs))
    throw new RangeError("Invalid Ion Sail tick");
  const dir=unit(target.x-pos.x,target.y-pos.y);
  if(attack.phase==="APPROACH"){
    if(Math.hypot(target.x-pos.x,target.y-pos.y)<=290)return {
      x:pos.x,y:pos.y,vx:0,vy:0,
      attack:{phase:"WARN",remainingMs:ION_SAIL_WARNING_MS,
        dirX:dir.x,dirY:dir.y,nextTrailMs:0},
    };
    const vx=dir.x*speed*1.1,vy=dir.y*speed*1.1;
    return {x:pos.x+vx*dt/FRAME_MS,y:pos.y+vy*dt/FRAME_MS,vx,vy,attack};
  }
  if(attack.phase==="WARN"){
    const remaining=attack.remainingMs-dt;
    return {x:pos.x,y:pos.y,vx:0,vy:0,attack:remaining<=0?
      {...attack,phase:"SWEEP",remainingMs:ION_SAIL_SWEEP_MS,nextTrailMs:0}:
      {...attack,remainingMs:remaining}};
  }
  if(attack.phase==="SWEEP"){
    const active=Math.min(dt,attack.remainingMs);
    const vx=attack.dirX*Math.max(1.7,speed*2.4);
    const vy=attack.dirY*Math.max(1.7,speed*2.4);
    const remaining=attack.remainingMs-dt;
    return {x:pos.x+vx*active/FRAME_MS,y:pos.y+vy*active/FRAME_MS,vx,vy,
      placeTrail:attack.nextTrailMs<=0,
      attack:remaining<=0?
        {...attack,phase:"RECOVER",remainingMs:1300,nextTrailMs:0}:
        {...attack,remainingMs:remaining,nextTrailMs:
          attack.nextTrailMs<=0?ION_SAIL_TRAIL_INTERVAL_MS:attack.nextTrailMs-dt}};
  }
  if(attack.phase==="RECOVER"){
    const remaining=attack.remainingMs-dt;
    return {x:pos.x,y:pos.y,vx:0,vy:0,
      attack:remaining<=0?createIonSailAttack():{...attack,remainingMs:remaining}};
  }
  throw new Error("Unknown Ion Sail phase");
}
