import {
  activateConvergence,
  cancelConvergence,
  CONVERGENCE_CHANNEL_MS,
  CONVERGENCE_MAX_HITS,
  convergenceHitDamage,
  createConvergenceState,
  finishConvergence,
  isConvergenceChanneling,
  projectConvergence,
  selectConvergenceTargets,
  type ConvergenceState,
} from "./orbiConvergence";
import { projectCombatOverdrive } from "./combatOverdrive";
import type { RouteLocalPoint } from "./physicalRouteSpace";
import type { RouteQaEncounter } from "./routePhysicalQaEncounter";
import { ROUTE_QA_PROJECTILE_CAP } from "./routeDynamicEncounter";
import { EnemyType, type Projectile } from "./types";
import type { RouteOverdriveQaState } from "./routeOverdriveQa";

/**
 * UX15-C3B-6 — original UX14-B Convergence contract in an ISOLATED physical
 * route lab. No boss AI, phase barriers, scores, permanent rewards or wave
 * director are certified here. Route segment keys are QA-only wave analogs,
 * NOT a claim that gameplay wave progression has been migrated.
 */
export interface RouteConvergenceQaState {
  readonly convergence:ConvergenceState;
  readonly activations:number;
  readonly beams:number;
  readonly pinnedShots:number;
  readonly registeredHits:number;
  readonly registeredKills:number;
  readonly cancellations:number;
}

export const createRouteConvergenceQaState=():RouteConvergenceQaState=>({
  convergence:createConvergenceState(),activations:0,beams:0,
  pinnedShots:0,registeredHits:0,registeredKills:0,cancellations:0,
});

export const routeConvergenceWaveKey=(ordinal:number):string=>{
  if(!Number.isSafeInteger(ordinal)||ordinal<0)
    throw new RangeError("Invalid QA route segment key");
  return `ASTERIA_QA_SEGMENT:${ordinal}`;
};

function certifiedEncounter(encounter:RouteQaEncounter):void {
  if(encounter.boss||encounter.architectQaBoss||
    encounter.hazardZones.length>0||
    encounter.enemies.some(e=>e.isBoss||e.type!==EnemyType.CRAWLER)){
    throw new Error("Uncertified Convergence boss, enemy or hazard owner");
  }
}

/** Convergence consumes real QA resonance (same authority as Overdrive)
 * only after admission succeeds. It cannot activate during active Overdrive,
 * and Overdrive is blocked throughout the channel. */
export function beginRouteConvergenceQa(
  previous:RouteConvergenceQaState,
  overdrive:RouteOverdriveQaState,
  encounter:RouteQaEncounter,
  player:RouteLocalPoint,
  nowMs:number,
  waveKey:string,
  requested:boolean,
  shield:number,
):{convergenceQa:RouteConvergenceQaState;overdriveQa:RouteOverdriveQaState} {
  if(!Number.isFinite(nowMs)||nowMs<0||!Number.isFinite(shield))
    throw new RangeError("Invalid QA Convergence time/shield");
  if(!requested)return {convergenceQa:previous,overdriveQa:overdrive};
  certifiedEncounter(encounter);
  const aim=selectConvergenceTargets(player,encounter.enemies);
  const active=projectCombatOverdrive(overdrive.overdrive,nowMs,true).active;
  const next=activateConvergence(previous.convergence,{
    nowMs,waveKey,orbiCount:encounter.swarm.length,
    resonance:overdrive.resonance.resonance,
    overdriveActive:active,gameplayActive:shield>0,
    targetAvailable:Boolean(aim?.targets.length),
  });
  if(!next)return {convergenceQa:previous,overdriveQa:overdrive};
  return {
    convergenceQa:{...previous,convergence:next,
      activations:previous.activations+1},
    overdriveQa:{...overdrive,resonance:{
      ...overdrive.resonance,resonance:0,
    }},
  };
}

/** Preserve the original 800ms channel and original one-shot finite-ray
 * target geometry: at most six target-pinned one-frame missiles.
 * Drop other QA bullets first only if a full 24-cap magazine would block
 * Convergence; NEVER expand caps or mutate previous snapshots.
 * Target-pinned hits resolve in the existing physical encounter hit pipeline.
 */
export function advanceRouteConvergenceQa(
  previous:RouteConvergenceQaState,
  encounter:RouteQaEncounter,
  player:RouteLocalPoint,
  nowMs:number,
  waveKey:string,
  shield:number,
):{convergenceQa:RouteConvergenceQaState;encounter:RouteQaEncounter} {
  if(!Number.isFinite(nowMs)||nowMs<0)
    throw new RangeError("Invalid Convergence channel clock");
  if(!isConvergenceChanneling(previous.convergence)){
    return {convergenceQa:previous,encounter};
  }
  certifiedEncounter(encounter);
  const charge=previous.convergence;
  if(charge.waveKey!==waveKey||shield<=0||encounter.swarm.length<8){
    return {convergenceQa:{...previous,
      convergence:cancelConvergence(charge),
      cancellations:previous.cancellations+1},encounter};
  }
  if(nowMs<(charge.channelUntilMs??Infinity)){
    return {convergenceQa:previous,encounter};
  }
  const aim=selectConvergenceTargets(player,encounter.enemies);
  if(!aim?.targets.length){
    return {convergenceQa:{...previous,
      convergence:cancelConvergence(charge),
      cancellations:previous.cancellations+1},encounter};
  }
  const pinned=aim.targets.slice(0,CONVERGENCE_MAX_HITS).map((target,i):Projectile=>({
    id:`route-convergence-${waveKey}-${previous.beams}-${i}`,
    x:target.x,y:target.y,vx:aim.dx,vy:aim.dy,
    damage:convergenceHitDamage(encounter.swarm.length,i),
    size:1,color:"#67e8f9",fromPlayer:true,
    life:1,maxLife:1,convergenceTargetId:target.id,
  }));
  const regular=encounter.projectiles.filter(p=>!p.convergenceTargetId);
  const keep=regular.slice(Math.max(0,regular.length-
    (ROUTE_QA_PROJECTILE_CAP-pinned.length)));
  return {
    convergenceQa:{...previous,
      convergence:finishConvergence(charge,nowMs,player,aim),
      beams:previous.beams+1,
      pinnedShots:previous.pinnedShots+pinned.length,
    },
    encounter:{...encounter,projectiles:[...keep,...pinned]},
  };
}

export const registerRouteConvergenceHits=(
  state:RouteConvergenceQaState,hits:number,kills:number,
):RouteConvergenceQaState=>{
  if(!Number.isSafeInteger(hits)||!Number.isSafeInteger(kills)||
     hits<0||kills<0||kills>hits)
    throw new RangeError("Invalid QA Convergence impacts");
  if(!hits)return state;
  return {...state,registeredHits:state.registeredHits+hits,
    registeredKills:state.registeredKills+kills};
};

export function projectRouteConvergenceQa(
  previous:RouteConvergenceQaState,
  overdrive:RouteOverdriveQaState,
  encounter:RouteQaEncounter,
  player:RouteLocalPoint,
  nowMs:number,
  waveKey:string,
  shield:number,
){
  const aim=selectConvergenceTargets(player,encounter.enemies);
  const active=projectCombatOverdrive(overdrive.overdrive,nowMs,true).active;
  return projectConvergence(previous.convergence,nowMs,waveKey,
    encounter.swarm.length,overdrive.resonance.resonance,active,
    shield>0,Boolean(aim?.targets.length));
}
