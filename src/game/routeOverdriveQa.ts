import {
  activateCombatOverdrive,
  advanceCombatOverdrive,
  createCombatOverdriveState,
  projectCombatOverdrive,
  type CombatOverdriveState,
} from "./combatOverdrive";
import {
  applyCombatResonanceDamageBreak,
  createCombatResonanceState,
  expireCombatChain,
  projectCombatResonance,
  registerCombatResonanceDefeat,
  MAX_RESONANCE,
  type CombatResonanceDefeatEvent,
  type CombatResonanceState,
} from "./combatResonance";
import { projectCombatOverdriveEffects } from "./combatOverdriveEffects";

/** C3B-5: live pure contracts behind explicit physical QA feature gate.
 * No GameStats, no score award, audio, persistence or wave authority. */
export interface RouteOverdriveQaState {
  readonly resonance:CombatResonanceState;
  readonly overdrive:CombatOverdriveState;
  readonly activations:number;
  readonly creditedDefeats:number;
  readonly damageBreaks:number;
  readonly debugCharges:number;
}

export function createRouteOverdriveQaState():RouteOverdriveQaState {
  return {
    resonance:createCombatResonanceState(),
    overdrive:createCombatOverdriveState(),
    activations:0,creditedDefeats:0,damageBreaks:0,debugCharges:0,
  };
}

/**
 * Explicit debugCharge only pre-fills an isolated test meter, never awards
 * virtual kills, score or progression. Normal enemies still charge via the
 * real registerCombatResonanceDefeat when killed by ORBI shots.
 */
export function beginRouteOverdriveQa(
  previous:RouteOverdriveQaState,
  nowMs:number,
  activateRequested=false,
  debugChargeRequested=false,
):RouteOverdriveQaState {
  if(!Number.isFinite(nowMs)||nowMs<0)throw new RangeError("Invalid Overdrive QA clock");
  let resonance=expireCombatChain(previous.resonance,nowMs);
  let overdrive=advanceCombatOverdrive(previous.overdrive,nowMs);
  let debugCharges=previous.debugCharges;
  let activations=previous.activations;
  if(debugChargeRequested){
    resonance={...resonance,resonance:MAX_RESONANCE};
    debugCharges++;
  }
  if(activateRequested){
    const action=activateCombatOverdrive(overdrive,{
      occurredAtMs:nowMs,
      overdriveReady:projectCombatResonance(resonance).overdriveReady,
    });
    overdrive=action.state;
    if(action.activated&&action.consumeResonance){
      resonance={...resonance,resonance:0};
      activations++;
    }
  }
  return {...previous,resonance,overdrive,activations,debugCharges};
}

/** Capture real CRAWLER defeats as pure affinity events; no awardedScore
 * leaves the QA sandbox. Apply contact penalty only on actually registered
 * new contact hits (never speculative proximity or overlapping frames). */
export function endRouteOverdriveQa(
  previous:RouteOverdriveQaState,
  nowMs:number,
  defeats:readonly CombatResonanceDefeatEvent[],
  newContactHits:number,
):RouteOverdriveQaState {
  if(!Number.isFinite(nowMs)||nowMs<0||!Number.isSafeInteger(newContactHits)||
      newContactHits<0)throw new RangeError("Invalid route combat event");
  let resonance=previous.resonance;
  for(const event of defeats){
    if(event.occurredAtMs!==nowMs ||event.baseScore!==0||
        event.isBoss||event.isElite)
      throw new Error("Uncertified route resonance award");
    resonance=registerCombatResonanceDefeat(resonance,event).state;
  }
  for(let i=0;i<newContactHits;i++){
    resonance=applyCombatResonanceDamageBreak(resonance);
  }
  return {...previous,resonance,
    creditedDefeats:previous.creditedDefeats+defeats.length,
    damageBreaks:previous.damageBreaks+newContactHits};
}

export function projectRouteOverdriveQa(state:RouteOverdriveQaState,nowMs:number){
  const resonance=projectCombatResonance(state.resonance);
  const overdrive=projectCombatOverdrive(
    state.overdrive,nowMs,resonance.overdriveReady,
  );
  return {...overdrive,resonance:state.resonance.resonance,
    chain:state.resonance.chain,
    damageMultiplier:projectCombatOverdriveEffects(overdrive).playerDamageMultiplier,
  };
}
