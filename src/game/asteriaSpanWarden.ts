/**
 * WBE-01E — Span Warden / Guardián del Puente.
 * Original ASTERIA field elite. This pure state machine runs in the REAL
 * campaign World Route; player/ORBI damage, rewards, contact and budgets
 * remain entirely owned by the existing EnergySwarmGame engine.
 */
export type SpanWardenPhase="ADVANCE"|"GUARD"|"WINDUP"|"SWEEP"|"EXPOSE";
export interface SpanWardenState {
  readonly phase:SpanWardenPhase;
  readonly remainingMs:number;
  readonly facingX:number;
  readonly facingY:number;
}
export interface SpanWardenFrame {
  readonly x:number;readonly y:number;readonly vx:number;readonly vy:number;
  readonly state:SpanWardenState;
}
export const SPAN_WARDEN_GUARD_MS=620;
export const SPAN_WARDEN_WINDUP_MS=820;
export const SPAN_WARDEN_SWEEP_MS=520;
export const SPAN_WARDEN_EXPOSE_MS=1300;
export const SPAN_WARDEN_FRONT_DAMAGE_MULTIPLIER=.28;
export const SPAN_WARDEN_EXPOSED_DAMAGE_MULTIPLIER=1.65;

export function createSpanWardenState():SpanWardenState{
  return {phase:"ADVANCE",remainingMs:0,facingX:-1,facingY:0};
}
export function shouldSpawnSpanWarden(
  worldRoute:boolean,mode:string,wave:number,ordinal:number,
  forced:boolean,miniboss:boolean,alreadyActive:boolean,
):boolean{
  return worldRoute&&mode==="CAMPAIGN"&&Number.isInteger(wave)&&wave>=5&&
    Number.isInteger(ordinal)&&ordinal>0&&ordinal%5===0&&
    !forced&&!miniboss&&!alreadyActive;
}
const unit=(x:number,y:number)=>{
  const d=Math.hypot(x,y);
  return d>.0001?{x:x/d,y:y/d}:{x:-1,y:0};
};
/** Locked straight assault follows a long guard + highly visible 820ms
 * windup; after the strike the glowing exposed reactor can be punished.
 */
export function stepSpanWarden(
  state:SpanWardenState,pos:{x:number;y:number},
  target:{x:number;y:number},speed:number,dt:number,
):SpanWardenFrame{
  if(![pos.x,pos.y,target.x,target.y,speed,dt,state.remainingMs,
    state.facingX,state.facingY].every(Number.isFinite)||
    dt<0||dt>100||speed<0)
    throw new RangeError("Invalid Span Warden tick");
  const move=(phase:SpanWardenPhase,remainingMs:number,
    vx=0,vy=0):SpanWardenFrame=>({
      x:pos.x+vx*dt/16.6,y:pos.y+vy*dt/16.6,vx,vy,
      state:{...state,phase,remainingMs},
    });
  if(state.phase==="ADVANCE"){
    const dx=target.x-pos.x,dy=target.y-pos.y;
    const d=Math.hypot(dx,dy),f=unit(dx,dy);
    if(d<=230)return {x:pos.x,y:pos.y,vx:0,vy:0,
      state:{phase:"GUARD",remainingMs:SPAN_WARDEN_GUARD_MS,
        facingX:f.x,facingY:f.y}};
    const vx=f.x*speed*.8,vy=f.y*speed*.8;
    return {x:pos.x+vx*dt/16.6,y:pos.y+vy*dt/16.6,vx,vy,
      state:{...state,facingX:f.x,facingY:f.y}};
  }
  if(state.phase==="GUARD"){
    const f=unit(target.x-pos.x,target.y-pos.y);
    const remaining=state.remainingMs-dt;
    return {x:pos.x,y:pos.y,vx:0,vy:0,state:{
      ...state,facingX:f.x,facingY:f.y,
      phase:remaining<=0?"WINDUP":"GUARD",
      remainingMs:remaining<=0?SPAN_WARDEN_WINDUP_MS:remaining,
    }};
  }
  if(state.phase==="WINDUP"){
    const remaining=state.remainingMs-dt;
    return move(remaining<=0?"SWEEP":"WINDUP",
      remaining<=0?SPAN_WARDEN_SWEEP_MS:remaining);
  }
  if(state.phase==="SWEEP"){
    const remaining=state.remainingMs-dt;
    const activeDt=Math.min(dt,state.remainingMs);
    const v=Math.max(2.8,speed*5);
    const vx=state.facingX*v,vy=state.facingY*v;
    return {x:pos.x+vx*activeDt/16.6,y:pos.y+vy*activeDt/16.6,vx,vy,
      state:{...state,phase:remaining<=0?"EXPOSE":"SWEEP",
        remainingMs:remaining<=0?SPAN_WARDEN_EXPOSE_MS:remaining}};
  }
  if(state.phase==="EXPOSE"){
    const remaining=state.remainingMs-dt;
    return move(remaining<=0?"ADVANCE":"EXPOSE",
      remaining<=0?0:remaining);
  }
  throw new Error("Unknown Span Warden phase");
}
/** Shared contact-damage projection for standard ORBI projectiles.
 * Front shield is directional, rear/side are never blocked, the exposed
 * reactor is vulnerable after the non-homing assault.
 */
export function projectSpanWardenImpact(
  state:SpanWardenState,enemy:{x:number;y:number},hit:{x:number;y:number},
):{readonly damageMultiplier:number;readonly shieldBlock:boolean;readonly exposed:boolean}{
  if(![state.facingX,state.facingY,enemy.x,enemy.y,hit.x,hit.y]
      .every(Number.isFinite))
    throw new RangeError("Invalid Span Warden impact");
  if(state.phase==="EXPOSE")return {
    damageMultiplier:SPAN_WARDEN_EXPOSED_DAMAGE_MULTIPLIER,
    shieldBlock:false,exposed:true,
  };
  const dx=hit.x-enemy.x,dy=hit.y-enemy.y;
  const d=Math.hypot(dx,dy);
  const front=d<.01?false:
    (dx*state.facingX+dy*state.facingY)/d>=Math.cos(Math.PI/3);
  const shieldBlock=front&&(
    state.phase==="GUARD"||state.phase==="WINDUP"||state.phase==="ADVANCE");
  return {damageMultiplier:shieldBlock?SPAN_WARDEN_FRONT_DAMAGE_MULTIPLIER:1,
    shieldBlock,exposed:false};
}
