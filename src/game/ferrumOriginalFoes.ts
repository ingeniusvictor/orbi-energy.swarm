/** FERRUM original machine attackers on Mundo Nuevo's canonical budget. */
import {selectAsteriaRailcutterSpawn,type RailcutterSpawn,
 type RailcutterViewport} from "./asteriaRailcutter";
export type FerrumFoe="SHADE_GEAR"|"M9_WELDER"|"FOUNDRY_CLAW"|"OXIDE_MODULATOR";
export type ShadePhase="SEEK"|"SPARK"|"ROLL"|"BRAKE"|"SECOND_ROLL"|"RECOVER";
export type WelderPhase="POSITION"|"WARN"|"ARC"|"RECOVER";
export interface ShadeGearAttack{
 readonly phase:ShadePhase;readonly remainingMs:number;
 readonly dx:number;readonly dy:number;readonly side:-1|1;
}
export interface M9WelderAttack{
 readonly phase:WelderPhase;readonly remainingMs:number;
 readonly lockedX:number;readonly lockedY:number;
}
export interface FerrumStep<A>{
 readonly x:number;readonly y:number;readonly vx:number;readonly vy:number;
 readonly attack:A; readonly fire?:boolean;
}
export const SHADE_GEAR_SPARK_MS=840;
export const SHADE_GEAR_BRAKE_MS=650;
export const M9_WELDER_WARN_MS=1100;
export const M9_WELDER_ARC_MS=650;
export const M9_WELDER_PROJECTILE_SPEED=3.2;
const unit=(x:number,y:number)=>{
 const m=Math.hypot(x,y);return m>1e-6?{x:x/m,y:y/m}:{x:-1,y:0};
};
const validate=(a:RailcutterSpawn,b:RailcutterSpawn,speed:number,dt:number)=>
 [a.x,a.y,b.x,b.y,speed,dt].every(Number.isFinite)&&
 speed>=0&&dt>=0&&dt<=100;
export const createShadeGearAttack=():ShadeGearAttack=>({
 phase:"SEEK",remainingMs:0,dx:-1,dy:0,side:1,
});
export const createM9WelderAttack=():M9WelderAttack=>({
 phase:"POSITION",remainingMs:0,lockedX:0,lockedY:0,
});
/** One active of each type, no miniboss/forced interference, no extra enemy. */
export function resolveFerrumFoe(
 enabled:boolean,mode:string,wave:number,ordinal:number,
 forced:boolean,miniboss:boolean,active:(type:FerrumFoe)=>boolean,
):FerrumFoe|null{
 if(!enabled||mode!=="CAMPAIGN"||forced||miniboss||
   !Number.isInteger(wave)||!Number.isInteger(ordinal)||wave<1||ordinal<0)
   return null;
 const mod=ordinal%5;
 const type:FerrumFoe|null=wave>=4&&mod===0?"OXIDE_MODULATOR":
   wave>=3&&mod===4?"FOUNDRY_CLAW":
   wave>=2&&mod===2?"M9_WELDER":
   mod===1||mod===3?"SHADE_GEAR":null;
 return type&&!active(type)?type:null;
}
export function selectFerrumFoeSpawn(camera:RailcutterViewport,player:RailcutterSpawn,
 width:number,height:number,safetyRadius:number):RailcutterSpawn|null{
 return selectAsteriaRailcutterSpawn(camera,player,width,height,Math.max(170,safetyRadius));
}
export function stepShadeGear(
 a:ShadeGearAttack,pos:RailcutterSpawn,target:RailcutterSpawn,speed:number,dt:number,
):FerrumStep<ShadeGearAttack>{
 if(!validate(pos,target,speed,dt)||!Number.isFinite(a.remainingMs)||
   !["SEEK","SPARK","ROLL","BRAKE","SECOND_ROLL","RECOVER"].includes(a.phase))
   throw new RangeError("Invalid Shade Gear step");
 const stop=(attack:ShadeGearAttack):FerrumStep<ShadeGearAttack>=>({
   x:pos.x,y:pos.y,vx:0,vy:0,attack,
 });
 const toward=unit(target.x-pos.x,target.y-pos.y);
 if(a.phase==="SEEK"){
   if(Math.hypot(target.x-pos.x,target.y-pos.y)<265)
     return stop({...a,phase:"SPARK",remainingMs:SHADE_GEAR_SPARK_MS,
       dx:toward.x,dy:toward.y});
   const tangent={x:-toward.y*a.side,y:toward.x*a.side};
   const vector=unit(toward.x*.78+tangent.x*.55,toward.y*.78+tangent.y*.55);
   const vx=vector.x*speed,vy=vector.y*speed;
   return {x:pos.x+vx*dt/16.6,y:pos.y+vy*dt/16.6,vx,vy,attack:a};
 }
 if(a.phase==="SPARK"){
   const rem=a.remainingMs-dt;
   return stop(rem<=0?{...a,phase:"ROLL",remainingMs:490}:{...a,remainingMs:rem});
 }
 if(a.phase==="ROLL"||a.phase==="SECOND_ROLL"){
   const vx=a.dx*speed*(a.phase==="ROLL"?4.0:3.15);
   const vy=a.dy*speed*(a.phase==="ROLL"?4.0:3.15);
   const active=Math.min(dt,a.remainingMs);
   const rem=a.remainingMs-dt;
   return {x:pos.x+vx*active/16.6,y:pos.y+vy*active/16.6,vx,vy,
     attack:rem<=0?(a.phase==="ROLL"
      ?{...a,phase:"BRAKE",remainingMs:SHADE_GEAR_BRAKE_MS,
         dx:toward.x,dy:toward.y}
      :{...a,phase:"RECOVER",remainingMs:1100})
      :{...a,remainingMs:rem}};
 }
 if(a.phase==="BRAKE"){
   const rem=a.remainingMs-dt;
   return stop(rem<=0?{...a,phase:"SECOND_ROLL",remainingMs:370}:
     {...a,remainingMs:rem});
 }
 const rem=a.remainingMs-dt;
 return stop(rem<=0?{...createShadeGearAttack(),side:a.side===1?-1:1}:
   {...a,remainingMs:rem});
}
export function stepM9Welder(
 a:M9WelderAttack,pos:RailcutterSpawn,target:RailcutterSpawn,
 speed:number,dt:number,
):FerrumStep<M9WelderAttack>{
 if(!validate(pos,target,speed,dt)||!Number.isFinite(a.remainingMs)||
   !["POSITION","WARN","ARC","RECOVER"].includes(a.phase))
   throw new RangeError("Invalid M9 Welder step");
 const stop=(attack:M9WelderAttack,fire=false):FerrumStep<M9WelderAttack>=>({
   x:pos.x,y:pos.y,vx:0,vy:0,attack,fire,
 });
 const toward=unit(target.x-pos.x,target.y-pos.y);
 const dist=Math.hypot(target.x-pos.x,target.y-pos.y);
 if(a.phase==="POSITION"){
   if(dist<235&&dist>140)
     return stop({phase:"WARN",remainingMs:M9_WELDER_WARN_MS,
       lockedX:target.x,lockedY:target.y});
   const direction=dist>235?1:-1;
   const vx=toward.x*speed*direction,vy=toward.y*speed*direction;
   return {x:pos.x+vx*dt/16.6,y:pos.y+vy*dt/16.6,vx,vy,attack:a};
 }
 if(a.phase==="WARN"){
   const rem=a.remainingMs-dt;
   return stop(rem<=0?{...a,phase:"ARC",remainingMs:M9_WELDER_ARC_MS}:
     {...a,remainingMs:rem},rem<=0);
 }
 if(a.phase==="ARC"){
   const rem=a.remainingMs-dt;
   return stop(rem<=0?{...a,phase:"RECOVER",remainingMs:1450}:
     {...a,remainingMs:rem});
 }
 const rem=a.remainingMs-dt;
 return stop(rem<=0?createM9WelderAttack():{...a,remainingMs:rem});
}
