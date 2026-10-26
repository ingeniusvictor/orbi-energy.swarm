import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  OMEGA_ENCOUNTER_ID,OMEGA_GEAR_CAP,OMEGA_WARNING_MS,OMEGA_ACTIVE_MS,
  OMEGA_CONVEYOR_OFFSETS,OMEGA_PISTON_SPREAD,OMEGA_EXPOSURE_MS,
  resolveOmegaFoundryEncounter,createOmegaFoundryAttack,getOmegaFoundryPhase,
  stepOmegaFoundry,omegaAttackContact,omegaGearSlots,omegaFoundryDamageMultiplier,
} from "../../src/game/ferrumOmegaFoundry";

const milestone={kind:"CAMPAIGN_BOSS",id:"blackout_devourer_boss"} as const;
const descriptor={sourceMode:"CAMPAIGN",waveNumber:10,
  completionPolicy:{type:"BOSS_DEFEAT"},milestone};
const boss={x:750,y:180},player={x:520,y:475};
test("FERRUM-04: Omega only replaces the authorized Ferrum Campaign boss",()=>{
  assert.equal(resolveOmegaFoundryEncounter(true,descriptor),OMEGA_ENCOUNTER_ID);
  assert.equal(resolveOmegaFoundryEncounter(false,descriptor),null);
  for(const mode of ["INFINITE","SCORE_ATTACK","ENDLESS"])
    assert.equal(resolveOmegaFoundryEncounter(true,{...descriptor,sourceMode:mode}),null);
  for(const wave of [1,9,11])
    assert.equal(resolveOmegaFoundryEncounter(true,{...descriptor,waveNumber:wave}),null);
  assert.equal(resolveOmegaFoundryEncounter(true,{...descriptor,
    milestone:{kind:"CAMPAIGN_BOSS",id:"other"}}),null);
  assert.equal(resolveOmegaFoundryEncounter(true,{...descriptor,
    completionPolicy:{type:"TIMEBOX"}}),null);
});
test("FERRUM-04: three health phases and guaranteed reactor exposure",()=>{
  assert.equal(getOmegaFoundryPhase(2500,2500),1);
  assert.equal(getOmegaFoundryPhase(1750,2500),2);
  assert.equal(getOmegaFoundryPhase(875,2500),3);
  assert.throws(()=>getOmegaFoundryPhase(1,0),RangeError);
  let a=createOmegaFoundryAttack(),announceCount=0,activeCount=0,exposeCount=0;
  for(let n=0;n<200;n++){
    const s=stepOmegaFoundry(a,boss,player,50,1);
    a=s.attack;announceCount+=Number(s.announced);
    activeCount+=Number(s.committed);exposeCount+=Number(s.exposed);
    if(s.exposed)break;
  }
  assert.equal(announceCount,1);
  assert.equal(activeCount,1);
  assert.equal(exposeCount,1);
  assert.equal(a.stage,"EXPOSED");
  assert.equal(a.remainingMs,OMEGA_EXPOSURE_MS);
  assert.ok(omegaFoundryDamageMultiplier(a)>2);
});
test("FERRUM-04: piston warning locks aim and never deals damage",()=>{
  let a={...createOmegaFoundryAttack(),stage:"WARNING" as const,
    remainingMs:OMEGA_WARNING_MS,lockedAngle:0};
  assert.equal(omegaAttackContact(a,{x:0,y:0},{x:240,y:0}),false);
  for(let n=0;n<14;n++)a=stepOmegaFoundry(a,boss,{x:900,y:950},100,1).attack;
  assert.equal(a.stage,"ACTIVE");
  assert.equal(a.lockedAngle,0);
  assert.ok(OMEGA_PISTON_SPREAD>=.3);
  assert.equal(omegaAttackContact(a,{x:0,y:0},
    {x:260*Math.cos(OMEGA_PISTON_SPREAD),
     y:260*Math.sin(OMEGA_PISTON_SPREAD)}),true);
  assert.equal(omegaAttackContact(a,{x:0,y:0},{x:260,y:0}),false);
});
test("FERRUM-04: capped assembly gears use actual enemy slots, not projectiles",()=>{
  assert.equal(OMEGA_GEAR_CAP,4);
  assert.equal(omegaGearSlots(0),2);
  assert.equal(omegaGearSlots(3),1);
  assert.equal(omegaGearSlots(4),0);
  assert.equal(omegaGearSlots(9),0);
  assert.throws(()=>omegaGearSlots(-1),RangeError);
  const s=stepOmegaFoundry({...createOmegaFoundryAttack(),phase:2,stage:"WARNING",
    remainingMs:50},boss,player,50,2);
  assert.equal(s.assemblyPulse,true);
  assert.equal(s.attack.stage,"ACTIVE");
  assert.equal(omegaAttackContact(s.attack,boss,player),false);
});
test("FERRUM-04: conveyor leaves the central safe lane traversable",()=>{
  const a={...createOmegaFoundryAttack(),phase:3 as const,stage:"ACTIVE" as const,
    remainingMs:OMEGA_ACTIVE_MS,lockedAngle:0};
  assert.deepEqual([...OMEGA_CONVEYOR_OFFSETS],[-135,135]);
  assert.equal(omegaAttackContact(a,{x:0,y:0},{x:350,y:0}),false);
  assert.equal(omegaAttackContact(a,{x:0,y:0},{x:350,y:-167}),true);
  assert.equal(omegaAttackContact({...a,remainingMs:OMEGA_ACTIVE_MS/2},
    {x:0,y:0},{x:350,y:135}),true);
  assert.equal(omegaAttackContact({...a,stage:"WARNING"},
    {x:0,y:0},{x:350,y:-167}),false);
});
test("FERRUM-04: finite deterministic contract and native live engine integration",()=>{
  const a=createOmegaFoundryAttack();
  assert.deepEqual(stepOmegaFoundry(a,boss,player,50,1),
    stepOmegaFoundry(a,boss,player,50,1));
  assert.deepEqual(a,createOmegaFoundryAttack());
  assert.equal(stepOmegaFoundry(a,boss,player,50,2).phaseChanged,true);
  assert.throws(()=>stepOmegaFoundry(a,boss,player,-1,1),RangeError);
  assert.throws(()=>stepOmegaFoundry(a,boss,{x:NaN,y:0},50,1),RangeError);
  const root="../../src/game/";
  const game=readFileSync(new URL(root+"EnergySwarmGame.tsx",import.meta.url),"utf8");
  const canvas=readFileSync(new URL(root+"EnergySwarmCanvas.tsx",import.meta.url),"utf8");
  const chassis=readFileSync(new URL(root+"bossChassis.ts",import.meta.url),"utf8");
  const hud=readFileSync(new URL("../../src/components/BossHudOverlay.tsx",import.meta.url),"utf8");
  for(const keyword of ["resolveOmegaFoundryEncounter(","omegaAttack:createOmegaFoundryAttack()",
    "stepOmegaFoundry(","omegaGearSlots(","omegaAttackContact(",
    "omegaFoundryDamageMultiplier(","damagePlayerFromBoss(",
    "registerCombatDefeat(enemy, proj.affinity)","enterInfiniteAfterCampaignVictory()"])
    assert.ok(game.includes(keyword),keyword);
  assert.match(canvas,/case EnemyType.BOSS_OMEGA/);
  assert.match(chassis,/FERRUM_OMEGA:[\s\S]*enemyType: EnemyType.BOSS_OMEGA/);
  assert.match(hud,/FERRUM_OMEGA/);
  assert.match(game,/resolveAsteriaArchonEncounter\(/);
  assert.match(game,/isFerrum\(worldRouteRunActiveRef.current,worldRouteThemeRef.current\)/);
});
