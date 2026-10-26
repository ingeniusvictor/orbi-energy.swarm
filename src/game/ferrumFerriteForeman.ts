/**
 * FERRUM-03 — Ferrite Foreman. Deterministic elite choreography on Mundo Nuevo.
 * No combat simulation is created: the game owns HP, ORBI, projectiles,
 * movement, enemy budgets, rewards and world switching.
 */
import type { RailcutterSpawn } from "./asteriaRailcutter";

export const FERRITE_FOREMAN_WARNING_MS=1150;
export const FERRITE_FOREMAN_COMMAND_MS=950;
export const FERRITE_FOREMAN_STRIKE_MS=480;
export const FERRITE_FOREMAN_EXPOSED_MS=1800;
export const FERRITE_FOREMAN_RECOVER_MS=1000;
export const FERRITE_FOREMAN_COMMAND_RADIUS=205;
export const FERRITE_FOREMAN_COMMAND_BOOST=1.18;
export const FERRITE_FOREMAN_COMMAND_DURATION_MS=1300;
export const FERRITE_FOREMAN_PROJECTILE_SPREAD=1.04;

export type FerriteForemanPhase="APPROACH"|"COMMAND"|"WARNING"|"STRIKE"|"EXPOSED"|"RECOVER";
export interface FerriteForemanAttack {
 readonly phase:FerriteForemanPhase;
 readonly remainingMs:number;
 readonly facingX:number;
 readonly facingY:number;
 readonly cycle:number;
}
export interface FerriteForemanStep {
 readonly x:number;readonly y:number;readonly vx:number;readonly vy:number;
 readonly attack:FerriteForemanAttack;
 readonly command?:boolean;
 readonly fire?:boolean;
 readonly expose?:boolean;
}
const unit=(x:number,y:number)=>{
 const d=Math.hypot(x,y);
 return d>1e-5?{x:x/d,y:y/d}:{x:-1,y:0};
};
export const createFerriteForemanAttack=():FerriteForemanAttack=>({
 phase:"APPROACH",remainingMs:0,facingX:-1,facingY:0,cycle:0,
});
/** Ordinary slot replacement. No boss-wave replacement or more than one alive. */
export function shouldSpawnFerriteForeman(
 selected:boolean,mode:string,wave:number,ordinal:number,
 forced:boolean,miniboss:boolean,alreadyAlive:boolean,
):boolean{
 return selected&&mode==="CAMPAIGN"&&
   Number.isInteger(wave)&&wave>=5&&wave<10&&
   Number.isInteger(ordinal)&&ordinal>=0&&ordinal%12===0&&
   !forced&&!miniboss&&!alreadyAlive;
}
export function stepFerriteForeman(
 a:FerriteForemanAttack,pos:RailcutterSpawn,target:RailcutterSpawn,
 speed:number,delta:number,
):FerriteForemanStep{
 if(![a.remainingMs,a.facingX,a.facingY,pos.x,pos.y,target.x,target.y,
   speed,delta].every(Number.isFinite)||delta<0||delta>100||speed<0||
   !["APPROACH","COMMAND","WARNING","STRIKE","EXPOSED","RECOVER"].includes(a.phase))
   throw new RangeError("Invalid Ferrite Foreman tick");
 const dir=unit(target.x-pos.x,target.y-pos.y);
 const standing=(attack:FerriteForemanAttack):FerriteForemanStep=>({
   x:pos.x,y:pos.y,vx:0,vy:0,attack,
 });
 if(a.phase==="APPROACH"){
   if(Math.hypot(target.x-pos.x,target.y-pos.y)<=265)
     return {...standing({...a,phase:"COMMAND",remainingMs:FERRITE_FOREMAN_COMMAND_MS,
       facingX:dir.x,facingY:dir.y}),command:true};
   const vx=dir.x*speed,vy=dir.y*speed;
   return {x:pos.x+vx*delta/16.6,y:pos.y+vy*delta/16.6,
     vx,vy,attack:{...a,facingX:dir.x,facingY:dir.y}};
 }
 const remaining=a.remainingMs-delta;
 if(a.phase==="COMMAND")
   return standing(remaining<=0?{...a,phase:"WARNING",
     remainingMs:FERRITE_FOREMAN_WARNING_MS,
     facingX:dir.x,facingY:dir.y}:{...a,remainingMs:remaining});
 if(a.phase==="WARNING"){
   if(remaining<=0)return {...standing({...a,phase:"STRIKE",
     remainingMs:FERRITE_FOREMAN_STRIKE_MS}),fire:true};
   return standing({...a,remainingMs:remaining});
 }
 if(a.phase==="STRIKE"){
   if(remaining<=0)return {...standing({...a,phase:"EXPOSED",
     remainingMs:FERRITE_FOREMAN_EXPOSED_MS}),expose:true};
   return standing({...a,remainingMs:remaining});
 }
 if(a.phase==="EXPOSED")
   return standing(remaining<=0?{...a,phase:"RECOVER",
     remainingMs:FERRITE_FOREMAN_RECOVER_MS}:{...a,remainingMs:remaining});
 if(remaining<=0)return {...standing({...a,phase:"COMMAND",cycle:a.cycle+1,
   remainingMs:FERRITE_FOREMAN_COMMAND_MS,
   facingX:dir.x,facingY:dir.y}),command:true};
 return standing({...a,remainingMs:remaining});
}
export function ferriteForemanDamageMultiplier(phase:FerriteForemanPhase):number{
 return phase==="EXPOSED"?1.85:phase==="COMMAND"||phase==="WARNING"?.60:1;
}
export function ferriteForemanSupports(
 foreman:RailcutterSpawn,ally:RailcutterSpawn,allyType:string,
):boolean{
 if(![foreman.x,foreman.y,ally.x,ally.y].every(Number.isFinite))
   throw new RangeError("Invalid Ferrite command link");
 return (allyType==="SHADE_GEAR"||allyType==="M9_WELDER") &&
   Math.hypot(foreman.x-ally.x,foreman.y-ally.y)<=FERRITE_FOREMAN_COMMAND_RADIUS;
}
export function ferriteSupportSpeed(
 untilMs:number|undefined,nowMs:number,speed:number,
):number{
 if(![nowMs,speed].every(Number.isFinite)||speed<0||
   (untilMs!==undefined&&!Number.isFinite(untilMs)))
   throw new RangeError("Invalid Ferrite speed projection");
 return speed*(untilMs!==undefined&&untilMs>nowMs?FERRITE_FOREMAN_COMMAND_BOOST:1);
}
