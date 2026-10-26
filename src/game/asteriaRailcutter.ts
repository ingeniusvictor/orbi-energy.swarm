/**
 * WBE-01A — RAILCUTTER. Real gameplay-only ASTERIA enemy.
 * Pure frame tick: the existing world engine still owns damage, ORBI hits,
 * rewards, drops, contact and enemy/projectile budgets.
 */
export const RAILCUTTER_APPROACH_DISTANCE = 200;
export const RAILCUTTER_AIM_MS = 850;
export const RAILCUTTER_CHARGE_MS = 420;
export const RAILCUTTER_RECOVER_MS = 900;
export const RAILCUTTER_CHARGE_SPEED = 7.2; // legacy units per 16.6ms
export const RAILCUTTER_TELEGRAPH_LENGTH = 230;
export const RAILCUTTER_SAFE_SPAWN_RADIUS = 170;

export type RailcutterPhase = "APPROACH" | "AIM" | "CHARGE" | "RECOVER";
export interface RailcutterAttack {
  readonly phase: RailcutterPhase;
  readonly remainingMs: number;
  readonly directionX: number;
  readonly directionY: number;
}
export const createRailcutterAttack = ():RailcutterAttack=>({
  phase:"APPROACH",remainingMs:0,directionX:-1,directionY:0,
});
export interface RailcutterStep {
  readonly x:number;
  readonly y:number;
  readonly vx:number;
  readonly vy:number;
  readonly attack:RailcutterAttack;
}
export interface RailcutterSpawn {
  readonly x:number;
  readonly y:number;
}
export interface RailcutterViewport {
  readonly cameraX:number;
  readonly cameraY:number;
  readonly viewportWidth:number;
  readonly viewportHeight:number;
  readonly zoom:number;
}

/** Keep the existing campaign spawn budget exactly unchanged: replace only
 * eligible ordinary spawns while in actual Mundo Nuevo / ASTERIA. Neither
 * other campaign modes nor Infinite inherit these characters automatically.
 */
export function shouldSpawnAsteriaRailcutter(
  worldRoute:boolean,mode:string,wave:number,spawnOrdinal:number,
  forced:boolean,miniboss:boolean,alreadyActive:boolean,
):boolean {
  return worldRoute&&mode==="CAMPAIGN"&&
    Number.isInteger(wave)&&wave>=2&&
    Number.isInteger(spawnOrdinal)&&spawnOrdinal>=0&&
    spawnOrdinal%5===3&&!forced&&!miniboss&&!alreadyActive;
}

/** Select from four safe sides of the CURRENT visible world. Return null
 * instead of violating the player's safety radius on a cramped viewport.
 */
export function selectAsteriaRailcutterSpawn(
  camera:RailcutterViewport,player:RailcutterSpawn,
  worldWidth:number,worldHeight:number,safetyRadius=RAILCUTTER_SAFE_SPAWN_RADIUS,
):RailcutterSpawn|null {
  const {cameraX,cameraY,viewportWidth,viewportHeight,zoom}=camera;
  if(![cameraX,cameraY,viewportWidth,viewportHeight,zoom,
       player.x,player.y,worldWidth,worldHeight,safetyRadius].every(Number.isFinite)||
       zoom<=0||viewportWidth<=0||viewportHeight<=0||
       worldWidth<=0||worldHeight<=0||safetyRadius<0)
    throw new RangeError("Invalid RAILCUTTER spawn viewport");
  const right=cameraX+viewportWidth/zoom+90;
  const left=cameraX-90;
  const top=cameraY-90;
  const bottom=cameraY+viewportHeight/zoom+90;
  const cx=cameraX+viewportWidth/zoom*.5;
  const cy=cameraY+viewportHeight/zoom*.5;
  const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
  const candidates=[
    {x:right,y:cy},{x:cx,y:top},{x:cx,y:bottom},{x:left,y:cy},
  ].map(p=>({x:clamp(p.x,16,worldWidth-16),
             y:clamp(p.y,16,worldHeight-16)}));
  for(const candidate of candidates){
    const dx=candidate.x-player.x,dy=candidate.y-player.y;
    if(dx*dx+dy*dy>=safetyRadius*safetyRadius)return candidate;
  }
  return null;
}

export function stepAsteriaRailcutter(
  attack:RailcutterAttack,position:RailcutterSpawn,
  target:RailcutterSpawn,speed:number,deltaMs:number,
):RailcutterStep {
  if(![position.x,position.y,target.x,target.y,speed,deltaMs,
      attack.remainingMs,attack.directionX,attack.directionY].every(Number.isFinite)||
    deltaMs<0||deltaMs>100||speed<0)
    throw new RangeError("Invalid RAILCUTTER physics tick");
  const dx=target.x-position.x,dy=target.y-position.y;
  const dist=Math.hypot(dx,dy);
  const dirX=dist>.0001?dx/dist:attack.directionX;
  const dirY=dist>.0001?dy/dist:attack.directionY;
  const ticks=deltaMs/16.6;
  if(attack.phase==="APPROACH"){
    if(dist<=RAILCUTTER_APPROACH_DISTANCE){
      return {x:position.x,y:position.y,vx:0,vy:0,
        attack:{phase:"AIM",remainingMs:RAILCUTTER_AIM_MS,
          directionX:dirX,directionY:dirY}};
    }
    return {x:position.x+dirX*speed*ticks,y:position.y+dirY*speed*ticks,
      vx:dirX*speed,vy:dirY*speed,attack};
  }
  if(attack.phase==="AIM"){
    const remaining=attack.remainingMs-deltaMs;
    if(remaining<=0)return {x:position.x,y:position.y,vx:0,vy:0,
      attack:{...attack,phase:"CHARGE",remainingMs:RAILCUTTER_CHARGE_MS}};
    return {x:position.x,y:position.y,vx:0,vy:0,
      attack:{...attack,remainingMs:remaining}};
  }
  if(attack.phase==="CHARGE"){
    const chargeSpeed=RAILCUTTER_CHARGE_SPEED*Math.min(1.5,Math.max(.25,speed));
    const activeMs=Math.min(deltaMs,attack.remainingMs);
    const nextX=position.x+attack.directionX*chargeSpeed*(activeMs/16.6);
    const nextY=position.y+attack.directionY*chargeSpeed*(activeMs/16.6);
    const remaining=attack.remainingMs-deltaMs;
    return {x:nextX,y:nextY,
      vx:attack.directionX*chargeSpeed,vy:attack.directionY*chargeSpeed,
      attack:remaining<=0
        ?{...attack,phase:"RECOVER",remainingMs:RAILCUTTER_RECOVER_MS}
        :{...attack,remainingMs:remaining}};
  }
  if(attack.phase==="RECOVER"){
    const remaining=attack.remainingMs-deltaMs;
    return {x:position.x,y:position.y,vx:0,vy:0,
      attack:remaining<=0?createRailcutterAttack():
        {...attack,remainingMs:remaining}};
  }
  throw new Error("Uncertified RAILCUTTER phase");
}
