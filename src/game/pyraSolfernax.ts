/**
 * PYRA-06 — SOLFERNAX: living magma reactor in a complete molten ring.
 *
 * Entire encounter is a pure deterministic three-phase director. The existing
 * Campaign boss lifecycle still owns spawn, HP, ORBI impacts, player cooldown,
 * milestones, score, death animation and rewards. No alternate boss or timer.
 */
export const SOLFERNAX_ENCOUNTER_ID="world:pyra:solfernax:v1";
export const SOLFERNAX_PREPARE_MS=1000;
export const SOLFERNAX_WARNING_MS=1440;
export const SOLFERNAX_ACTIVE_MS=1180;
export const SOLFERNAX_EXPOSED_MS=2600;
export const SOLFERNAX_RECOVER_MS=880;
export const SOLFERNAX_VENT_RANGE=630;
export const SOLFERNAX_VENT_HALF_WIDTH=20;
export const SOLFERNAX_VENT_OFFSETS=[-.42,0,.42] as const;
export const SOLFERNAX_GATE_RANGE=590;
export const SOLFERNAX_GATE_WIDTH=25;
export const SOLFERNAX_GATE_OFFSETS=[-128,128] as const;
export const SOLFERNAX_GATE_SHIFT=32;
export const SOLFERNAX_COLLAPSE_MIN_RADIUS=125;
export const SOLFERNAX_COLLAPSE_MAX_RADIUS=355;
export const SOLFERNAX_COLLAPSE_HALF_WIDTH=21;
export const SOLFERNAX_COLLAPSE_LANES=[-.60,.60] as const;
export type SolfernaxPhase=1|2|3;
export type SolfernaxStage="PREPARE"|"WARNING"|"ACTIVE"|"EXPOSED"|"RECOVER";
export interface SolfernaxAttack{
 readonly phase:SolfernaxPhase;
 readonly stage:SolfernaxStage;
 readonly remainingMs:number;
 readonly lockedAngle:number;
 readonly cycle:number;
}
export interface SolfernaxPoint{readonly x:number;readonly y:number}
export interface SolfernaxStep{
 readonly attack:SolfernaxAttack;
 readonly contact:boolean;
 readonly warned:boolean;
 readonly fired:boolean;
 readonly exposed:boolean;
 readonly phaseChanged:boolean;
}
export interface SolfernaxEncounterDescriptor {
 readonly sourceMode:string;
 readonly waveNumber:number;
 readonly completionPolicy:{readonly type:string};
 readonly milestone?:{readonly kind:string;readonly id:string}|null;
}
export function resolveSolfernaxEncounter(worldRoute:boolean,
 descriptor:SolfernaxEncounterDescriptor):string|null{
 return worldRoute&&descriptor.sourceMode==="CAMPAIGN"&&
  descriptor.waveNumber===10&&descriptor.completionPolicy.type==="BOSS_DEFEAT"&&
  descriptor.milestone?.kind==="CAMPAIGN_BOSS"&&
  descriptor.milestone.id==="blackout_devourer_boss"
   ?SOLFERNAX_ENCOUNTER_ID:null;
}
export const createSolfernaxAttack=():SolfernaxAttack=>({
 phase:1,stage:"PREPARE",remainingMs:SOLFERNAX_PREPARE_MS,
 lockedAngle:0,cycle:0,
});
export function getSolfernaxPhase(hp:number,maxHp:number):SolfernaxPhase{
 if(!Number.isFinite(hp)||!Number.isFinite(maxHp)||maxHp<=0)
   throw new RangeError("Invalid Solfernax HP");
 const r=hp/maxHp;
 return r<=.35?3:r<=.70?2:1;
}
const normalize=(angle:number)=>Math.atan2(Math.sin(angle),Math.cos(angle));
export function solfernaxGateShift(a:SolfernaxAttack):number{
 const progress=Math.max(0,Math.min(1,
  (SOLFERNAX_ACTIVE_MS-a.remainingMs)/SOLFERNAX_ACTIVE_MS));
 // Alternating direction each cycle. At every point the centered safe lane
 // remains >150 units wide: no full-screen damage walls.
 const shift=(a.cycle%2===0?1:-1)*SOLFERNAX_GATE_SHIFT*(2*progress-1);
 return shift===0?0:shift;
}
export function solfernaxCollapseRadius(a:SolfernaxAttack):number{
 const progress=Math.max(0,Math.min(1,
  (SOLFERNAX_ACTIVE_MS-a.remainingMs)/SOLFERNAX_ACTIVE_MS));
 return SOLFERNAX_COLLAPSE_MAX_RADIUS-
   (SOLFERNAX_COLLAPSE_MAX_RADIUS-SOLFERNAX_COLLAPSE_MIN_RADIUS)*progress;
}
export function solfernaxAttackContact(a:SolfernaxAttack,
 origin:SolfernaxPoint,player:SolfernaxPoint):boolean{
 if(a.stage!=="ACTIVE")return false;
 if(![a.remainingMs,a.lockedAngle,origin.x,origin.y,player.x,player.y]
   .every(Number.isFinite))throw new RangeError("Invalid Solfernax contact");
 const dx=player.x-origin.x,dy=player.y-origin.y;
 const ca=Math.cos(a.lockedAngle),sa=Math.sin(a.lockedAngle);
 const along=dx*ca+dy*sa;
 const lateral=-dx*sa+dy*ca;
 if(a.phase===1){
  const dist=Math.hypot(dx,dy);
  if(dist<65||dist>SOLFERNAX_VENT_RANGE)return false;
  const direction=Math.atan2(dy,dx);
  return SOLFERNAX_VENT_OFFSETS.some(offset=>
    dist*Math.abs(Math.sin(normalize(direction-a.lockedAngle-offset)))<=
      SOLFERNAX_VENT_HALF_WIDTH &&
    Math.cos(normalize(direction-a.lockedAngle-offset))>0);
 }
 if(a.phase===2){
  if(along<70||along>SOLFERNAX_GATE_RANGE)return false;
  const shift=solfernaxGateShift(a);
  return SOLFERNAX_GATE_OFFSETS.some(offset=>
    Math.abs(lateral-offset-shift)<=SOLFERNAX_GATE_WIDTH);
 }
 const dist=Math.hypot(dx,dy);
 if(Math.abs(dist-solfernaxCollapseRadius(a))>SOLFERNAX_COLLAPSE_HALF_WIDTH)
   return false;
 // Two short molten arcs sweep inward; center and rearward approach remain
 // traversable and a lateral dodge escapes. No 360-degree unavoidable ring.
 const angle=normalize(Math.atan2(dy,dx)-a.lockedAngle);
 return SOLFERNAX_COLLAPSE_LANES.some(offset=>Math.abs(
  normalize(angle-offset))<=.29);
}
export function stepSolfernax(a:SolfernaxAttack,
 origin:SolfernaxPoint,player:SolfernaxPoint,
 deltaMs:number,phase:SolfernaxPhase):SolfernaxStep{
 if(![a.remainingMs,a.lockedAngle,origin.x,origin.y,player.x,player.y,deltaMs]
   .every(Number.isFinite)||deltaMs<0||deltaMs>100||
   ![1,2,3].includes(phase)||!Number.isSafeInteger(a.cycle)||
   !["PREPARE","WARNING","ACTIVE","EXPOSED","RECOVER"].includes(a.stage))
   throw new RangeError("Invalid Solfernax tick");
 if(phase!==a.phase)return {
  attack:{...a,phase,stage:"PREPARE",remainingMs:1150,
    lockedAngle:0},contact:false,warned:false,fired:false,
  exposed:false,phaseChanged:true,
 };
 const left=a.remainingMs-deltaMs;
 let next=a,warned=false,fired=false,exposed=false;
 if(left>0)next={...a,remainingMs:left};
 else switch(a.stage){
  case "PREPARE":
   next={...a,stage:"WARNING",remainingMs:SOLFERNAX_WARNING_MS,
    lockedAngle:Math.atan2(player.y-origin.y,player.x-origin.x)};
   warned=true;break;
  case "WARNING":
   next={...a,stage:"ACTIVE",remainingMs:SOLFERNAX_ACTIVE_MS};
   fired=true;break;
  case "ACTIVE":
   next={...a,stage:"EXPOSED",remainingMs:SOLFERNAX_EXPOSED_MS};
   exposed=true;break;
  case "EXPOSED":
   next={...a,stage:"RECOVER",remainingMs:SOLFERNAX_RECOVER_MS};break;
  case "RECOVER":
   next={...a,stage:"PREPARE",remainingMs:SOLFERNAX_PREPARE_MS,
    cycle:a.cycle+1};break;
 }
 return {attack:next,contact:solfernaxAttackContact(next,origin,player),
  warned,fired,exposed,phaseChanged:false};
}
export function solfernaxDamageMultiplier(a:SolfernaxAttack):number{
 return a.stage==="EXPOSED"?(a.phase===3?2.55:2.05):
  a.stage==="WARNING"?.55:.82;
}
export const SOLFERNAX_ATTACK_NAMES={
 1:"MOLTEN DIRECTIONAL VENTS",
 2:"ALTERNATING THERMAL GATES",
 3:"CONTROLLED CALDERA COLLAPSE",
} as const;
