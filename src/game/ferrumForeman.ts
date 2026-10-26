/** FERRUM-03 — Ferrite Foreman: native elite choreography only. */
import {selectFerrumFoeSpawn} from "./ferrumOriginalFoes";
import type {RailcutterSpawn,RailcutterViewport} from "./asteriaRailcutter";
export type ForemanStage="APPROACH"|"COMMAND"|"WARNING"|"SHOCK"|"EXPOSED";
export interface ForemanAttack{
 readonly stage:ForemanStage;readonly remainingMs:number;
 readonly facingX:number;readonly facingY:number;readonly sector:-1|0|1;
 readonly cycle:number;
}
export const FOREMAN_COMMAND_MS=900;
export const FOREMAN_WARNING_MS=1150;
export const FOREMAN_SHOCK_MS=520;
export const FOREMAN_EXPOSED_MS=1850;
export const FOREMAN_SECTOR_HALF_ANGLE=.24;
export const FOREMAN_SHOCK_RADIUS=240;
export const createForemanAttack=():ForemanAttack=>({
 stage:"APPROACH",remainingMs:0,facingX:-1,facingY:0,sector:0,cycle:0,
});
export function shouldSpawnForeman(route:boolean,mode:string,wave:number,
 ordinal:number,forced:boolean,miniboss:boolean,alive:boolean):boolean{
 return route&&mode==="CAMPAIGN"&&wave>=5&&Number.isInteger(wave)&&
   ordinal>=0&&Number.isInteger(ordinal)&&ordinal%12===0&&
   !forced&&!miniboss&&!alive;
}
export function selectForemanSpawn(camera:RailcutterViewport,player:RailcutterSpawn,
 width:number,height:number,safety:number){
 return selectFerrumFoeSpawn(camera,player,width,height,Math.max(safety,230));
}
export function stepForeman(a:ForemanAttack,pos:RailcutterSpawn,target:RailcutterSpawn,
 speed:number,dt:number){
 if(![a.remainingMs,a.facingX,a.facingY,pos.x,pos.y,target.x,target.y,speed,dt]
   .every(Number.isFinite)||dt<0||dt>100||speed<0)
   throw new RangeError("Invalid Foreman tick");
 const dx=target.x-pos.x,dy=target.y-pos.y,d=Math.hypot(dx,dy);
 const ux=d>1e-5?dx/d:-1,uy=d>1e-5?dy/d:0;
 const stop=(attack:ForemanAttack)=>({x:pos.x,y:pos.y,vx:0,vy:0,attack});
 if(a.stage==="APPROACH"){
   if(d<=270)return stop({...a,stage:"COMMAND",remainingMs:FOREMAN_COMMAND_MS,
    facingX:ux,facingY:uy});
   const vx=ux*speed,vy=uy*speed;
   return {x:pos.x+vx*dt/16.6,y:pos.y+vy*dt/16.6,vx,vy,
    attack:{...a,facingX:ux,facingY:uy}};
 }
 const left=a.remainingMs-dt;
 if(left>0)return stop({...a,remainingMs:left});
 if(a.stage==="COMMAND")return stop({...a,stage:"WARNING",
   remainingMs:FOREMAN_WARNING_MS,facingX:ux,facingY:uy});
 if(a.stage==="WARNING")return stop({...a,stage:"SHOCK",remainingMs:FOREMAN_SHOCK_MS});
 if(a.stage==="SHOCK")return stop({...a,stage:"EXPOSED",remainingMs:FOREMAN_EXPOSED_MS});
 return stop({...a,stage:"COMMAND",remainingMs:FOREMAN_COMMAND_MS,
  facingX:ux,facingY:uy,sector:a.sector===1?-1:(a.sector+1) as -1|0|1,
  cycle:a.cycle+1});
}
/** Three wide sectors with an exit gap; locked aim means never homing. */
export function foremanSectorHit(a:ForemanAttack,enemy:RailcutterSpawn,
 player:RailcutterSpawn):boolean{
 if(a.stage!=="SHOCK")return false;
 const dx=player.x-enemy.x,dy=player.y-enemy.y,d=Math.hypot(dx,dy);
 if(d>FOREMAN_SHOCK_RADIUS||d<32)return false;
 const delta=Math.atan2(dy,dx)-Math.atan2(a.facingY,a.facingX);
 const angle=Math.atan2(Math.sin(delta),Math.cos(delta));
 const sectorAngle=a.sector*.78;
 return Math.abs(angle-sectorAngle)<FOREMAN_SECTOR_HALF_ANGLE;
}
export const foremanDamageMultiplier=(a:ForemanAttack)=>
 a.stage==="EXPOSED"?1.95:a.stage==="COMMAND"||a.stage==="WARNING"?.58:1;
