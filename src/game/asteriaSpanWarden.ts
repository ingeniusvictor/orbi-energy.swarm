/**
 * WBE-01E — SPAN WARDEN. Pure elite behavior for real Mundo Nuevo.
 * The existing game owns spawn budgets, bullets, damage, ORBI and drops.
 */
import {
  selectAsteriaRailcutterSpawn,
  type RailcutterSpawn,
  type RailcutterViewport,
} from "./asteriaRailcutter";

export type SpanWardenPhase = "APPROACH" | "GUARD" | "WINDUP" | "STRIKE" | "EXPOSED";
export interface SpanWardenAttack {
  readonly phase: SpanWardenPhase;
  readonly remainingMs: number;
  readonly facingX: number;
  readonly facingY: number;
  readonly strikeSide: -1 | 1;
}
export interface SpanWardenStep {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly attack: SpanWardenAttack;
  readonly fire?: boolean;
}
export const SPAN_WARDEN_GUARD_MS=1050;
export const SPAN_WARDEN_WARNING_MS=950;
export const SPAN_WARDEN_STRIKE_MS=470;
export const SPAN_WARDEN_EXPOSED_MS=1550;
export const SPAN_WARDEN_PROJECTILE_SPREAD=1.12;
export const SPAN_WARDEN_SAFE_RADIUS=210;
export const SPAN_WARDEN_FRONT_DOT=Math.cos(Math.PI*0.38);
const unit=(x:number,y:number):{x:number;y:number}=>{
  const d=Math.hypot(x,y);
  return d>1e-5?{x:x/d,y:y/d}:{x:-1,y:0};
};
export const createSpanWardenAttack=():SpanWardenAttack=>({
  phase:"APPROACH",remainingMs:0,facingX:-1,facingY:0,strikeSide:1,
});
/** A single elite can substitute an ordinary budget slot per wave, at wave 5+.
 * The final miniboss/milestone slot is never replaced. No additional spawning.
 */
export function shouldSpawnSpanWarden(
  worldRoute:boolean,mode:string,wave:number,ordinal:number,
  forced:boolean,miniboss:boolean,alreadyActive:boolean,
):boolean{
  return worldRoute&&mode==="CAMPAIGN"&&
    Number.isInteger(wave)&&wave>=5&&
    Number.isInteger(ordinal)&&ordinal>=0&&ordinal%10===0&&
    !forced&&!miniboss&&!alreadyActive;
}
export function selectSpanWardenSpawn(
  camera:RailcutterViewport,player:RailcutterSpawn,
  worldWidth:number,worldHeight:number,safetyRadius=SPAN_WARDEN_SAFE_RADIUS,
):RailcutterSpawn|null{
  return selectAsteriaRailcutterSpawn(
    camera,player,worldWidth,worldHeight,Math.max(SPAN_WARDEN_SAFE_RADIUS,safetyRadius),
  );
}
export function stepSpanWarden(
  attack:SpanWardenAttack,position:RailcutterSpawn,target:RailcutterSpawn,
  speed:number,deltaMs:number,
):SpanWardenStep{
  if(![attack.remainingMs,attack.facingX,attack.facingY,
    position.x,position.y,target.x,target.y,speed,deltaMs].every(Number.isFinite)||
    !["APPROACH","GUARD","WINDUP","STRIKE","EXPOSED"].includes(attack.phase)||
    deltaMs<0||deltaMs>100||speed<0)
    throw new RangeError("Invalid Span Warden combat tick");
  const toTarget=unit(target.x-position.x,target.y-position.y);
  const standing=(a:SpanWardenAttack):SpanWardenStep=>({
    x:position.x,y:position.y,vx:0,vy:0,attack:a,
  });
  if(attack.phase==="APPROACH"){
    if(Math.hypot(target.x-position.x,target.y-position.y)<=245){
      return standing({...attack,phase:"GUARD",remainingMs:SPAN_WARDEN_GUARD_MS,
        facingX:toTarget.x,facingY:toTarget.y});
    }
    const vx=toTarget.x*speed,vy=toTarget.y*speed;
    return {x:position.x+vx*deltaMs/16.6,
      y:position.y+vy*deltaMs/16.6,vx,vy,
      attack:{...attack,facingX:toTarget.x,facingY:toTarget.y}};
  }
  if(attack.phase==="GUARD"){
    const remaining=attack.remainingMs-deltaMs;
    return standing(remaining<=0
      ?{...attack,phase:"WINDUP",remainingMs:SPAN_WARDEN_WARNING_MS,
        facingX:toTarget.x,facingY:toTarget.y}
      :{...attack,remainingMs:remaining,
        facingX:toTarget.x,facingY:toTarget.y});
  }
  if(attack.phase==="WINDUP"){
    const remaining=attack.remainingMs-deltaMs;
    if(remaining<=0)return {...standing({...attack,phase:"STRIKE",
      remainingMs:SPAN_WARDEN_STRIKE_MS}),fire:true};
    return standing({...attack,remainingMs:remaining});
  }
  if(attack.phase==="STRIKE"){
    // Lateral displacement uses the locked aim; never homes onto ENERGY.
    const side=attack.strikeSide;
    const vx=-attack.facingY*side*speed*1.4;
    const vy=attack.facingX*side*speed*1.4;
    const active=Math.min(deltaMs,attack.remainingMs);
    const remaining=attack.remainingMs-deltaMs;
    return {x:position.x+vx*active/16.6,y:position.y+vy*active/16.6,
      vx,vy,attack:remaining<=0
        ?{...attack,phase:"EXPOSED",remainingMs:SPAN_WARDEN_EXPOSED_MS}
        :{...attack,remainingMs:remaining}};
  }
  const remaining=attack.remainingMs-deltaMs;
  return standing(remaining<=0
    ?{...attack,phase:"GUARD",remainingMs:SPAN_WARDEN_GUARD_MS,
      strikeSide:attack.strikeSide===1?-1:1,
      facingX:toTarget.x,facingY:toTarget.y}
    :{...attack,remainingMs:remaining});
}
export interface SpanWardenHit {
  readonly multiplier:number;
  readonly blocked:boolean;
  readonly exposed:boolean;
}
/** Incoming direction is derived from the actual ORBI projectile velocity.
 * Non-moving convergence/projectile effects still reach the core and cannot
 * become a permanent shield immunity.
 */
export function resolveSpanWardenHit(
  attack:SpanWardenAttack,projectileVx:number,projectileVy:number,
  offsetX:number,offsetY:number,
):SpanWardenHit{
  if(![projectileVx,projectileVy,offsetX,offsetY,
    attack.facingX,attack.facingY].every(Number.isFinite))
    throw new RangeError("Invalid Span Warden impact");
  if(attack.phase==="EXPOSED")
    return {multiplier:1.85,blocked:false,exposed:true};
  const incoming=unit(
    Math.abs(projectileVx)+Math.abs(projectileVy)>1e-5?-projectileVx:offsetX,
    Math.abs(projectileVx)+Math.abs(projectileVy)>1e-5?-projectileVy:offsetY,
  );
  const frontal=incoming.x*attack.facingX+incoming.y*attack.facingY>=SPAN_WARDEN_FRONT_DOT;
  if(frontal&&(attack.phase==="GUARD"||attack.phase==="WINDUP")){
    return {multiplier:.18,blocked:true,exposed:false};
  }
  return {multiplier:frontal?.8:1.25,blocked:false,exposed:false};
}
