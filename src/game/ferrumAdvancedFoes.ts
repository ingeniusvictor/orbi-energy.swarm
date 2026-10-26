/** FERRUM-02 C/D — mechanical control threats in the REAL Mundo Nuevo engine.
 * Pure attack choreography only; EnergySwarmGame retains player movement,
 * ORBI hits, projectile budgets, enemy damage/rewards and entity lifetime.
 */
import type {RailcutterSpawn} from "./asteriaRailcutter";
export type FoundryClawPhase="APPROACH"|"ANCHOR"|"TETHER"|"RETRACT";
export type OxideModulatorPhase="POSITION"|"ARMOR"|"RECHARGE";
export interface FoundryClawAttack {
  readonly phase:FoundryClawPhase;
  readonly remainingMs:number;
  readonly targetX:number;
  readonly targetY:number;
}
export interface OxideModulatorAttack {
  readonly phase:OxideModulatorPhase;
  readonly remainingMs:number;
  readonly pulseMs:number;
}
export interface AdvancedFerrumStep<T>{
  readonly x:number;readonly y:number;
  readonly vx:number;readonly vy:number;
  readonly attack:T;
  readonly tetherActive?:boolean;
  readonly armorPulse?:boolean;
}
export const FOUNDRY_CLAW_WARNING_MS=1050;
export const FOUNDRY_CLAW_TETHER_MS=850;
export const FOUNDRY_CLAW_TETHER_RANGE=310;
export const FOUNDRY_CLAW_PULL_MAX_PER_FRAME=.88;
export const OXIDE_ARMOR_RADIUS=195;
export const OXIDE_ARMOR_DURATION_MS=360;
export const OXIDE_ARMOR_MULTIPLIER=.64;
export const OXIDE_PULSE_INTERVAL_MS=220;
export const OXIDE_ACTIVE_MS=2050;
export const createFoundryClawAttack=():FoundryClawAttack=>({
  phase:"APPROACH",remainingMs:0,targetX:0,targetY:0,
});
export const createOxideModulatorAttack=():OxideModulatorAttack=>({
  phase:"POSITION",remainingMs:0,pulseMs:0,
});
const unit=(x:number,y:number)=>{
 const d=Math.hypot(x,y);
 return d>1e-5?{x:x/d,y:y/d}:{x:-1,y:0};
};
const valid=(pos:RailcutterSpawn,target:RailcutterSpawn,speed:number,dt:number)=>
 [pos.x,pos.y,target.x,target.y,speed,dt].every(Number.isFinite)&&
 dt>=0&&dt<=100&&speed>=0;
export function stepFoundryClaw(
 a:FoundryClawAttack,pos:RailcutterSpawn,target:RailcutterSpawn,
 speed:number,delta:number,
):AdvancedFerrumStep<FoundryClawAttack>{
 if(!valid(pos,target,speed,delta)||
    ![a.targetX,a.targetY,a.remainingMs].every(Number.isFinite)||
    !["APPROACH","ANCHOR","TETHER","RETRACT"].includes(a.phase))
   throw new RangeError("Invalid Foundry Claw tick");
 const to=unit(target.x-pos.x,target.y-pos.y);
 const dist=Math.hypot(target.x-pos.x,target.y-pos.y);
 const stop=(attack:FoundryClawAttack,tetherActive=false):AdvancedFerrumStep<FoundryClawAttack>=>({
   x:pos.x,y:pos.y,vx:0,vy:0,attack,tetherActive,
 });
 if(a.phase==="APPROACH"){
   if(dist<=235 && dist>=90) return stop({
      phase:"ANCHOR",remainingMs:FOUNDRY_CLAW_WARNING_MS,
      targetX:target.x,targetY:target.y,
   });
   const radial=dist>235?1:-1;
   const vx=to.x*speed*radial,vy=to.y*speed*radial;
   return {x:pos.x+vx*delta/16.6,y:pos.y+vy*delta/16.6,vx,vy,attack:a};
 }
 const remaining=a.remainingMs-delta;
 if(a.phase==="ANCHOR")
   return stop(remaining<=0?{...a,phase:"TETHER",remainingMs:FOUNDRY_CLAW_TETHER_MS}:
     {...a,remainingMs:remaining});
 if(a.phase==="TETHER")
   return stop(remaining<=0?{...a,phase:"RETRACT",remainingMs:1300}:
     {...a,remainingMs:remaining},remaining>0);
 return stop(remaining<=0?createFoundryClawAttack():{...a,remainingMs:remaining});
}
/** Small bounded impulse applied to the existing ENERGY position, not a
 * replacement movement motor. Continuous player movement and Dash still work.
 */
export function projectFoundryTetherPull(
 enemy:RailcutterSpawn,player:RailcutterSpawn,delta:number,
):{x:number;y:number}{
 if(!valid(enemy,player,1,delta))throw new RangeError("Invalid tether force");
 const dx=enemy.x-player.x,dy=enemy.y-player.y,d=Math.hypot(dx,dy);
 if(d<62||d>FOUNDRY_CLAW_TETHER_RANGE)return{x:0,y:0};
 const force=Math.min(FOUNDRY_CLAW_PULL_MAX_PER_FRAME,
   (d-62)/80)*delta/16.6;
 return{x:dx/d*force,y:dy/d*force};
}
export function stepOxideModulator(
 a:OxideModulatorAttack,pos:RailcutterSpawn,target:RailcutterSpawn,
 speed:number,delta:number,
):AdvancedFerrumStep<OxideModulatorAttack>{
 if(!valid(pos,target,speed,delta)||
   ![a.remainingMs,a.pulseMs].every(Number.isFinite)||
   !["POSITION","ARMOR","RECHARGE"].includes(a.phase))
   throw new RangeError("Invalid Oxide Modulator tick");
 const dx=target.x-pos.x,dy=target.y-pos.y,d=Math.hypot(dx,dy);
 const dir=unit(dx,dy);
 const stop=(attack:OxideModulatorAttack,armorPulse=false):AdvancedFerrumStep<OxideModulatorAttack>=>({
   x:pos.x,y:pos.y,vx:0,vy:0,attack,armorPulse,
 });
 if(a.phase==="POSITION"){
   if(d>=180&&d<=290)return stop({
     phase:"ARMOR",remainingMs:OXIDE_ACTIVE_MS,pulseMs:0,
   });
   const radial=d>290?1:-1;
   const vx=dir.x*speed*radial,vy=dir.y*speed*radial;
   return {x:pos.x+vx*delta/16.6,y:pos.y+vy*delta/16.6,vx,vy,attack:a};
 }
 if(a.phase==="ARMOR"){
   const remaining=a.remainingMs-delta;
   if(remaining<=0)return stop({phase:"RECHARGE",remainingMs:1550,pulseMs:0});
   const pulse=a.pulseMs<=0;
   return stop({...a,remainingMs:remaining,
     pulseMs:pulse?OXIDE_PULSE_INTERVAL_MS:
       Math.max(0,a.pulseMs-delta)},pulse);
 }
 const remaining=a.remainingMs-delta;
 return stop(remaining<=0?createOxideModulatorAttack():
   {...a,remainingMs:remaining});
}
export function oxideArmorDamageMultiplier(untilMs:number|undefined,nowMs:number):number{
 if(nowMs<0||!Number.isFinite(nowMs)||
   (untilMs!==undefined&&!Number.isFinite(untilMs)))
   throw new RangeError("Invalid Oxide armor state");
 return untilMs!==undefined&&untilMs>nowMs?OXIDE_ARMOR_MULTIPLIER:1;
}
export function shouldArmorOxideAlly(
 source:RailcutterSpawn,ally:RailcutterSpawn,allyBoss:boolean,sameEntity:boolean,
):boolean{
 if(![source.x,source.y,ally.x,ally.y].every(Number.isFinite))
   throw new RangeError("Invalid Oxide armor target");
 return !sameEntity&&!allyBoss&&Math.hypot(source.x-ally.x,source.y-ally.y)<=OXIDE_ARMOR_RADIUS;
}
