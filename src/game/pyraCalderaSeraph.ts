/** PYRA-05 — Caldera Seraph / Serafín de Caldera.
 * Volcanic six-wing manta elite, three visible curved meteor trajectories,
 * finite arming, then a genuinely vulnerable cooling core.
 *
 * Only the canonical campaign spawns actors, projectiles, damage and drops.
 */
import {selectAsteriaRailcutterSpawn,type RailcutterSpawn,type RailcutterViewport}
  from "./asteriaRailcutter";
export type SeraphStage="APPROACH"|"CIRCULATE"|"WARNING"|"DISCHARGE"|"EXPOSED";
export interface CalderaSeraphAttack{
  readonly stage:SeraphStage;
  readonly remainingMs:number;
  readonly lockedAngle:number;
  readonly cycle:number;
}
export interface CalderaSeraphStep{
  readonly attack:CalderaSeraphAttack;
  readonly x:number;readonly y:number;readonly vx:number;readonly vy:number;
  readonly warn:boolean;readonly fire:boolean;readonly exposed:boolean;
}
export interface SeraphPoint{readonly x:number;readonly y:number}
export const SERAPH_CIRCULATE_MS=700;
export const SERAPH_WARNING_MS=1240;
export const SERAPH_DISCHARGE_MS=400;
export const SERAPH_EXPOSED_MS=2050;
export const SERAPH_METEOR_COUNT=3;
export const SERAPH_METEOR_SPEED=2.12;
export const SERAPH_METEOR_DAMAGE=11;
export const SERAPH_METEOR_LIFE_MS=1850;
export const SERAPH_CURVE_RATE=.00092; // radians per real simulation millisecond
export const SERAPH_CURVE_MS=980;
export const SERAPH_METEOR_SPREAD=.68;
export const createCalderaSeraphAttack=():CalderaSeraphAttack=>({
  stage:"APPROACH",remainingMs:0,lockedAngle:0,cycle:0,
});
export function shouldSpawnCalderaSeraph(world:boolean,mode:string,
 wave:number,ordinal:number,forced:boolean,miniboss:boolean,active:boolean):boolean{
  return world&&mode==="CAMPAIGN"&&Number.isSafeInteger(wave)&&wave>=5&&
    Number.isSafeInteger(ordinal)&&ordinal>=0&&ordinal%10===4&&
    !forced&&!miniboss&&!active;
}
export function selectCalderaSeraphSpawn(camera:RailcutterViewport,
  player:RailcutterSpawn,width:number,height:number,safety:number):RailcutterSpawn|null{
  return selectAsteriaRailcutterSpawn(camera,player,width,height,Math.max(250,safety));
}
export function stepCalderaSeraph(a:CalderaSeraphAttack,pos:SeraphPoint,
  player:SeraphPoint,speed:number,deltaMs:number):CalderaSeraphStep{
  if(![a.remainingMs,a.lockedAngle,a.cycle,pos.x,pos.y,player.x,player.y,
    speed,deltaMs].every(Number.isFinite)||speed<0||deltaMs<0||deltaMs>100||
    !Number.isSafeInteger(a.cycle)||
    !["APPROACH","CIRCULATE","WARNING","DISCHARGE","EXPOSED"].includes(a.stage))
    throw new RangeError("Invalid Caldera Seraph tick");
  const dx=player.x-pos.x,dy=player.y-pos.y,dist=Math.hypot(dx,dy);
  const angle=Math.atan2(dy,dx);
  const stop=(attack:CalderaSeraphAttack,flags:Partial<CalderaSeraphStep>={})
    :CalderaSeraphStep=>({
      attack,x:pos.x,y:pos.y,vx:0,vy:0,
      warn:false,fire:false,exposed:false,...flags,
    });
  if(a.stage==="APPROACH"){
    if(dist>=195&&dist<=405)
      return stop({...a,stage:"CIRCULATE",remainingMs:SERAPH_CIRCULATE_MS,
        lockedAngle:angle});
    const direction=dist>405?1:-1;
    const vx=Math.cos(angle)*speed*.72*direction;
    const vy=Math.sin(angle)*speed*.72*direction;
    return {attack:a,x:pos.x+vx*deltaMs/16.6,
      y:pos.y+vy*deltaMs/16.6,vx,vy,warn:false,fire:false,exposed:false};
  }
  const remaining=a.remainingMs-deltaMs;
  if(a.stage==="CIRCULATE")
    return remaining>0?stop({...a,remainingMs:remaining}):
      stop({...a,stage:"WARNING",remainingMs:SERAPH_WARNING_MS,
        lockedAngle:angle},{warn:true});
  if(a.stage==="WARNING")
    return remaining>0?stop({...a,remainingMs:remaining}):
      stop({...a,stage:"DISCHARGE",remainingMs:SERAPH_DISCHARGE_MS},{fire:true});
  if(a.stage==="DISCHARGE")
    return remaining>0?stop({...a,remainingMs:remaining}):
      stop({...a,stage:"EXPOSED",remainingMs:SERAPH_EXPOSED_MS},{exposed:true});
  return remaining>0?stop({...a,remainingMs:remaining}):
    stop({...a,stage:"CIRCULATE",remainingMs:SERAPH_CIRCULATE_MS,cycle:a.cycle+1});
}
export interface SeraphMeteor{
 readonly x:number;readonly y:number;readonly vx:number;readonly vy:number;
 readonly curveDirection:-1|1;
}
const curves=[-1,1,-1] as const;
export function projectCalderaMeteorVolley(
  origin:SeraphPoint,angle:number):readonly SeraphMeteor[]{
  if(![origin.x,origin.y,angle].every(Number.isFinite))
    throw new RangeError("Invalid meteor aim");
  return curves.map((curveDirection,i)=>{
    const theta=angle+(i-1)*SERAPH_METEOR_SPREAD;
    return {x:origin.x,y:origin.y,
      vx:Math.cos(theta)*SERAPH_METEOR_SPEED,
      vy:Math.sin(theta)*SERAPH_METEOR_SPEED,curveDirection};
  });
}
/** Euler integration shared by live projectile owner and preview arc.
 * One direction update per bounded tick, with no independent game clock. */
export function advanceCalderaMeteor(
  x:number,y:number,vx:number,vy:number,
  direction:-1|1,remainingMs:number,deltaMs:number,
):{x:number;y:number;vx:number;vy:number;remainingMs:number}{
  if(![x,y,vx,vy,remainingMs,deltaMs].every(Number.isFinite)||
    deltaMs<0||deltaMs>100||remainingMs<0||
    (direction!==-1&&direction!==1))
    throw new RangeError("Invalid meteor curve step");
  const active=Math.min(remainingMs,deltaMs);
  const radians=direction*SERAPH_CURVE_RATE*active;
  const nextVx=vx*Math.cos(radians)-vy*Math.sin(radians);
  const nextVy=vx*Math.sin(radians)+vy*Math.cos(radians);
  return {x:x+nextVx*deltaMs/16.6,y:y+nextVy*deltaMs/16.6,
    vx:nextVx,vy:nextVy,remainingMs:Math.max(0,remainingMs-active)};
}
/** Preview uses the exact authoritative step function at a fixed 40ms grid. */
export function traceCalderaMeteor(origin:SeraphPoint,angle:number,
  index:0|1|2,steps=20):readonly SeraphPoint[]{
  if(!Number.isSafeInteger(steps)||steps<0||steps>32)
    throw new RangeError("Invalid meteor preview count");
  const meteor=projectCalderaMeteorVolley(origin,angle)[index];
  const points:SeraphPoint[]=[{x:origin.x,y:origin.y}];
  let p={...meteor,remainingMs:SERAPH_CURVE_MS};
  for(let n=0;n<steps;n++){
    const next=advanceCalderaMeteor(p.x,p.y,p.vx,p.vy,
      meteor.curveDirection,p.remainingMs,40);
    points.push({x:next.x,y:next.y});p={...p,...next};
  }
  return points;
}
export const calderaSeraphDamageMultiplier=(a:CalderaSeraphAttack):number=>
  a.stage==="EXPOSED"?2.05:
    a.stage==="WARNING"||a.stage==="CIRCULATE"?.65:1;
