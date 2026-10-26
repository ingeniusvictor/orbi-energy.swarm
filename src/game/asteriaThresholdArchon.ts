/**
 * WBE-01F — Threshold Archon: original ASTERIA world boss behavior.
 *
 * A pure boss-specific pattern director. The EXISTING EnergySwarmGame owns
 * boss health, collision, ORBI, the damage cooldown, rewards and the ending.
 * Never mutates a shared Campaign/Infinite runtime descriptor.
 */
export const ARCHON_ENCOUNTER_ID="world:asteria:threshold_archon:v1";
export const ARCHON_WARNING_MS=1450;
export const ARCHON_ACTIVE_MS=1650;
export const ARCHON_PREPARE_MS=1100;
export const ARCHON_RECOVERY_MS=1150;
export const ARCHON_EXPOSURE_MS=2800;
export const ARCHON_BEACON_OFFSETS=[-145,0,145] as const;
export const ARCHON_BEAM_HALF_WIDTH=21;
export const ARCHON_BEAM_RANGE=790;
export type ArchonPhase=1|2|3;
export type ArchonStage="PREPARE"|"WARNING"|"ACTIVE"|"EXPOSED"|"RECOVER";
export interface ThresholdArchonAttack {
  readonly phase:ArchonPhase;
  readonly stage:ArchonStage;
  readonly remainingMs:number;
  readonly lockedAngle:number;
  readonly cycle:number;
}
export type ArchonPoint={readonly x:number;readonly y:number};
export interface ArchonStep {
  readonly attack:ThresholdArchonAttack;
  readonly contact:boolean;
  readonly announced:boolean;
  readonly committed:boolean;
  readonly openedCore:boolean;
  readonly phaseChanged:boolean;
}
export interface ArchonEncounterDescriptor {
  readonly sourceMode:string;
  readonly waveNumber:number;
  readonly completionPolicy:{readonly type:string};
  readonly milestone?:{readonly kind:string;readonly id:string}|null;
}
export function resolveAsteriaArchonEncounter(
  worldRoute:boolean,descriptor:ArchonEncounterDescriptor,
):string|null{
  return worldRoute&&descriptor.sourceMode==="CAMPAIGN"&&
    descriptor.waveNumber===10&&descriptor.completionPolicy.type==="BOSS_DEFEAT"&&
    descriptor.milestone?.kind==="CAMPAIGN_BOSS"&&
    descriptor.milestone.id==="blackout_devourer_boss"
      ?ARCHON_ENCOUNTER_ID:null;
}
export function createThresholdArchonAttack():ThresholdArchonAttack{
  return {phase:1,stage:"PREPARE",remainingMs:ARCHON_PREPARE_MS,
    lockedAngle:0,cycle:0};
}
export const getThresholdArchonPhase=(health:number,maxHealth:number):ArchonPhase=>{
  if(!Number.isFinite(health)||!Number.isFinite(maxHealth)||maxHealth<=0)
    throw new RangeError("Invalid Archon health");
  const p=health/maxHealth;
  return p<=.35?3:p<=.70?2:1;
};
export function archonBeamContact(
  origin:ArchonPoint,target:ArchonPoint,angle:number,offset:number,
  width=ARCHON_BEAM_HALF_WIDTH,
):boolean{
  const ca=Math.cos(angle),sa=Math.sin(angle);
  const dx=target.x-origin.x,dy=target.y-origin.y;
  const along=dx*ca+dy*sa;
  const transverse=-dx*sa+dy*ca;
  return along>=12&&along<=ARCHON_BEAM_RANGE&&
    Math.abs(transverse-offset)<=width;
}
export function projectArchonPulseRadius(remainingMs:number):number{
  const progress=Math.max(0,Math.min(1,
    (ARCHON_ACTIVE_MS-remainingMs)/ARCHON_ACTIVE_MS));
  return 70+330*progress;
}
export function isArchonAttackContact(
  attack:ThresholdArchonAttack,origin:ArchonPoint,target:ArchonPoint,
):boolean{
  if(attack.stage!=="ACTIVE")return false;
  if(attack.phase===1){
    const progress=Math.max(0,Math.min(1,
      (ARCHON_ACTIVE_MS-attack.remainingMs)/ARCHON_ACTIVE_MS));
    return archonBeamContact(origin,target,attack.lockedAngle-.24+progress*.48,0,25);
  }
  if(attack.phase===2)
    return ARCHON_BEACON_OFFSETS.some(offset=>
      archonBeamContact(origin,target,attack.lockedAngle,offset));
  const d=Math.hypot(target.x-origin.x,target.y-origin.y);
  return Math.abs(d-projectArchonPulseRadius(attack.remainingMs))<=23;
}
/** Player coordinates are read only at the beginning of WARNING; aiming
 * remains locked throughout WARNING and ACTIVE, so moving always counters it.
 * The end-of-attack vulnerability window is unavoidable for the boss.
 */
export function stepThresholdArchon(
  state:ThresholdArchonAttack,
  origin:ArchonPoint,
  player:ArchonPoint,
  deltaMs:number,
  phase:ArchonPhase,
):ArchonStep{
  if(!Number.isFinite(deltaMs)||deltaMs<0||deltaMs>100||
    ![state.remainingMs,state.lockedAngle,origin.x,origin.y,player.x,player.y]
      .every(Number.isFinite)||![1,2,3].includes(phase))
    throw new RangeError("Invalid Archon tick");
  if(state.phase!==phase){
    return {attack:{phase,stage:"PREPARE",remainingMs:1200,
      lockedAngle:0,cycle:state.cycle},contact:false,
      announced:false,committed:false,openedCore:false,phaseChanged:true};
  }
  const remaining=state.remainingMs-deltaMs;
  const facing=Math.atan2(player.y-origin.y,player.x-origin.x);
  let next:ThresholdArchonAttack=state;
  let announced=false,committed=false,openedCore=false;
  if(remaining>0){
    next={...state,remainingMs:remaining};
  }else{
    switch(state.stage){
      case "PREPARE":
        next={...state,stage:"WARNING",remainingMs:ARCHON_WARNING_MS,
          lockedAngle:facing};announced=true;break;
      case "WARNING":
        next={...state,stage:"ACTIVE",remainingMs:ARCHON_ACTIVE_MS};
        committed=true;break;
      case "ACTIVE":
        next={...state,stage:"EXPOSED",remainingMs:ARCHON_EXPOSURE_MS};
        openedCore=true;break;
      case "EXPOSED":
        next={...state,stage:"RECOVER",remainingMs:ARCHON_RECOVERY_MS};
        break;
      case "RECOVER":
        next={...state,stage:"PREPARE",remainingMs:ARCHON_PREPARE_MS,
          cycle:state.cycle+1};break;
    }
  }
  return {attack:next,
    contact:isArchonAttackContact(next,origin,player),
    announced,committed,openedCore,phaseChanged:false};
}
export function thresholdArchonDamageMultiplier(
  attack:ThresholdArchonAttack,
):number{
  return attack.stage==="EXPOSED"?(attack.phase===3?2.35:1.8):
    attack.stage==="WARNING"?0.45:0.7;
}
export const ARCHON_ATTACK_NAMES={
  1:"Telescopic Rail Sweep",
  2:"Tri-Beacon Safe Corridors",
  3:"Orbital Ring Overload",
} as const;
