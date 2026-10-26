/**
 * FERRUM-04 — OMEGA FOUNDRY, walking factory sovereign of Ferrum.
 * Pure deterministic battle director; canonical boss engine owns HP, damage,
 * collision, ORBI, death, score, campaign victory and Infinite handoff.
 */
export const OMEGA_ENCOUNTER_ID="world:ferrum:omega_foundry:v1";
export const OMEGA_PREPARE_MS=900;
export const OMEGA_WARNING_MS=1350;
export const OMEGA_ACTIVE_MS=1260;
export const OMEGA_EXPOSURE_MS=2450;
export const OMEGA_RECOVER_MS=820;
export const OMEGA_GEAR_CAP=4;
export const OMEGA_PISTON_RANGE=530;
export const OMEGA_PISTON_SPREAD=.36;
export const OMEGA_CONVEYOR_OFFSETS=[-135,135] as const;
export const OMEGA_CONVEYOR_RANGE=640;

export type OmegaPhase=1|2|3;
export type OmegaStage="PREPARE"|"WARNING"|"ACTIVE"|"EXPOSED"|"RECOVER";
export interface OmegaFoundryAttack {
  readonly phase:OmegaPhase;
  readonly stage:OmegaStage;
  readonly remainingMs:number;
  readonly lockedAngle:number;
  readonly cycle:number;
}
export interface OmegaPoint{readonly x:number;readonly y:number}
export interface OmegaFoundryStep{
  readonly attack:OmegaFoundryAttack;
  readonly contact:boolean;
  readonly announced:boolean;
  readonly committed:boolean;
  readonly assemblyPulse:boolean;
  readonly exposed:boolean;
  readonly phaseChanged:boolean;
}
export interface OmegaEncounterDescriptor{
  readonly sourceMode:string;
  readonly waveNumber:number;
  readonly completionPolicy:{readonly type:string};
  readonly milestone?:{readonly kind:string;readonly id:string}|null;
}
export function resolveOmegaFoundryEncounter(worldRoute:boolean,
  descriptor:OmegaEncounterDescriptor):string|null{
  return worldRoute&&descriptor.sourceMode==="CAMPAIGN"&&
    descriptor.waveNumber===10&&descriptor.completionPolicy.type==="BOSS_DEFEAT"&&
    descriptor.milestone?.kind==="CAMPAIGN_BOSS"&&
    descriptor.milestone.id==="blackout_devourer_boss"
      ?OMEGA_ENCOUNTER_ID:null;
}
export const createOmegaFoundryAttack=():OmegaFoundryAttack=>({
  phase:1,stage:"PREPARE",remainingMs:OMEGA_PREPARE_MS,lockedAngle:0,cycle:0,
});
export function getOmegaFoundryPhase(hp:number,max:number):OmegaPhase{
  if(!Number.isFinite(hp)||!Number.isFinite(max)||max<=0)
    throw new RangeError("Invalid Omega HP");
  return hp/max<=.35?3:hp/max<=.70?2:1;
}
const bandHit=(origin:OmegaPoint,player:OmegaPoint,angle:number,
  lane:number,range:number,width:number):boolean=>{
  const dx=player.x-origin.x,dy=player.y-origin.y;
  const ca=Math.cos(angle),sa=Math.sin(angle);
  const along=dx*ca+dy*sa,lateral=-dx*sa+dy*ca;
  return along>=68&&along<=range&&Math.abs(lateral-lane)<=width;
};
export const projectOmegaConveyorOffset=(remainingMs:number):number=>
  -32+64*Math.max(0,Math.min(1,(OMEGA_ACTIVE_MS-remainingMs)/OMEGA_ACTIVE_MS));
export function omegaAttackContact(a:OmegaFoundryAttack,
  origin:OmegaPoint,player:OmegaPoint):boolean{
  if(a.stage!=="ACTIVE")return false;
  if(a.phase===1)
    return [-OMEGA_PISTON_SPREAD,OMEGA_PISTON_SPREAD].some(spread=>
      bandHit(origin,player,a.lockedAngle+spread,0,OMEGA_PISTON_RANGE,27));
  if(a.phase===2)return false; // Actual gear enemies own contact.
  return OMEGA_CONVEYOR_OFFSETS.some(offset=>
    bandHit(origin,player,a.lockedAngle,
      offset+projectOmegaConveyorOffset(a.remainingMs),OMEGA_CONVEYOR_RANGE,26));
}
export function omegaGearSlots(living:number,requested=2):number{
  if(!Number.isSafeInteger(living)||living<0||!Number.isSafeInteger(requested)||requested<0)
    throw new RangeError("Invalid assembly capacity");
  return Math.max(0,Math.min(requested,OMEGA_GEAR_CAP-living));
}
export function omegaFoundryDamageMultiplier(a:OmegaFoundryAttack):number{
  return a.stage==="EXPOSED"?(a.phase===3?2.5:2.05):
    a.stage==="WARNING"?0.52:0.78;
}
export const OMEGA_ATTACK_NAMES={
  1:"EXTENDABLE PISTON ARMS",
  2:"GEAR ASSEMBLY LINE",
  3:"CONVEYOR REACTOR SWEEP",
} as const;

export function stepOmegaFoundry(a:OmegaFoundryAttack,origin:OmegaPoint,
  player:OmegaPoint,deltaMs:number,phase:OmegaPhase):OmegaFoundryStep{
  if(![a.remainingMs,a.lockedAngle,origin.x,origin.y,player.x,player.y,deltaMs]
    .every(Number.isFinite)||deltaMs<0||deltaMs>100||
    ![1,2,3].includes(phase))
    throw new RangeError("Invalid Omega tick");
  if(phase!==a.phase){
    return {attack:{...a,phase,stage:"PREPARE",
      remainingMs:1100,lockedAngle:0},contact:false,
      announced:false,committed:false,assemblyPulse:false,
      exposed:false,phaseChanged:true};
  }
  const remaining=a.remainingMs-deltaMs;
  let next:OmegaFoundryAttack=a;
  let announced=false,committed=false,assemblyPulse=false,exposed=false;
  if(remaining>0)next={...a,remainingMs:remaining};
  else{
    switch(a.stage){
      case "PREPARE":
        next={...a,stage:"WARNING",remainingMs:OMEGA_WARNING_MS,
          lockedAngle:Math.atan2(player.y-origin.y,player.x-origin.x)};
        announced=true;break;
      case "WARNING":
        next={...a,stage:"ACTIVE",remainingMs:OMEGA_ACTIVE_MS};
        committed=true;assemblyPulse=a.phase===2;break;
      case "ACTIVE":
        next={...a,stage:"EXPOSED",remainingMs:OMEGA_EXPOSURE_MS};
        exposed=true;break;
      case "EXPOSED":
        next={...a,stage:"RECOVER",remainingMs:OMEGA_RECOVER_MS};
        break;
      case "RECOVER":
        next={...a,stage:"PREPARE",remainingMs:OMEGA_PREPARE_MS,
          cycle:a.cycle+1};break;
    }
  }
  return {attack:next,contact:omegaAttackContact(next,origin,player),
    announced,committed,assemblyPulse,exposed,phaseChanged:false};
}
