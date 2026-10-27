/**
 * PYRA-01B — Ember Skater / Brasero Móvil.
 * Original skating AI. The canonical enemy controller owns HP, death, reward,
 * contact and the single-budget temporary heat remnant; no parallel timer.
 */
import {selectAsteriaRailcutterSpawn,
  type RailcutterSpawn,type RailcutterViewport} from "./asteriaRailcutter";
export type EmberStage="GLIDE"|"WARNING"|"HOT"|"COOL";
export interface EmberSkaterAttack{
  readonly stage:EmberStage;
  readonly remainingMs:number;
  readonly lockedX:number;
  readonly lockedY:number;
  readonly side:-1|1;
  readonly cycle:number;
}
export interface EmberSkaterStep {
  readonly attack:EmberSkaterAttack;
  readonly x:number;readonly y:number;
  readonly vx:number;readonly vy:number;
  readonly releaseHeat:boolean;
  readonly warned:boolean;
}
export const EMBER_WARN_MS=1080;
export const EMBER_HEAT_MS=720;
export const EMBER_PATCH_LIFE_MS=1450;
export const EMBER_PATCH_DAMAGE=8;
export const EMBER_PATCH_RADIUS=14;
export const createEmberSkaterAttack=():EmberSkaterAttack=>({
  stage:"GLIDE",remainingMs:0,lockedX:0,lockedY:0,side:1,cycle:0,
});
export function shouldSpawnEmberSkater(enabled:boolean,mode:string,wave:number,
  ordinal:number,forced:boolean,miniboss:boolean,living:boolean):boolean{
  return enabled&&mode==="CAMPAIGN"&&Number.isSafeInteger(wave)&&wave>=1&&
    Number.isSafeInteger(ordinal)&&ordinal>=0&&ordinal%5===1&&
    !forced&&!miniboss&&!living;
}
export function selectEmberSkaterSpawn(cam:RailcutterViewport,
  player:RailcutterSpawn,width:number,height:number,safe:number):
  RailcutterSpawn|null{
  return selectAsteriaRailcutterSpawn(cam,player,width,height,Math.max(safe,180));
}
export function stepEmberSkater(a:EmberSkaterAttack,pos:RailcutterSpawn,
  player:RailcutterSpawn,speed:number,dt:number):EmberSkaterStep{
  if(![a.remainingMs,a.lockedX,a.lockedY,pos.x,pos.y,player.x,player.y,speed,dt]
    .every(Number.isFinite)||dt<0||dt>100||speed<0||
    !["GLIDE","WARNING","HOT","COOL"].includes(a.stage))
    throw new RangeError("Invalid Ember Skater step");
  const dx=player.x-pos.x,dy=player.y-pos.y;
  const dist=Math.hypot(dx,dy);
  const inv=dist>1e-6?1/dist:0;
  const ux=dist>1e-6?dx*inv:-1,uy=dist>1e-6?dy*inv:0;
  const stop=(attack:EmberSkaterAttack,releaseHeat=false,warned=false):
    EmberSkaterStep=>({attack,x:pos.x,y:pos.y,vx:0,vy:0,releaseHeat,warned});
  if(a.stage==="GLIDE"){
    if(dist<225&&dist>55){
      return stop({...a,stage:"WARNING",remainingMs:EMBER_WARN_MS,
        lockedX:pos.x,lockedY:pos.y},false,true);
    }
    const sx=(ux*.68-uy*a.side*.72)*speed;
    const sy=(uy*.68+ux*a.side*.72)*speed;
    return {attack:a,x:pos.x+sx*dt/16.6,y:pos.y+sy*dt/16.6,
      vx:sx,vy:sy,releaseHeat:false,warned:false};
  }
  const remain=a.remainingMs-dt;
  if(a.stage==="WARNING"){
    return remain<=0
      ?stop({...a,stage:"HOT",remainingMs:EMBER_HEAT_MS},true)
      :stop({...a,remainingMs:remain});
  }
  if(a.stage==="HOT"){
    const sx=-ux*speed*1.8+uy*speed*.42*a.side;
    const sy=-uy*speed*1.8-ux*speed*.42*a.side;
    return {attack:remain<=0?{...a,stage:"COOL",remainingMs:820}:{
        ...a,remainingMs:remain},
      x:pos.x+sx*Math.min(dt,a.remainingMs)/16.6,
      y:pos.y+sy*Math.min(dt,a.remainingMs)/16.6,
      vx:sx,vy:sy,releaseHeat:false,warned:false};
  }
  return remain<=0?stop({...a,stage:"GLIDE",remainingMs:0,
    side:a.side===1?-1:1,cycle:a.cycle+1}):stop({...a,remainingMs:remain});
}
