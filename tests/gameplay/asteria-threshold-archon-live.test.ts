import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  ARCHON_ENCOUNTER_ID,ARCHON_WARNING_MS,ARCHON_ACTIVE_MS,
  ARCHON_EXPOSURE_MS,ARCHON_BEAM_HALF_WIDTH,
  ARCHON_BEACON_OFFSETS,ARCHON_BEAM_RANGE,
  resolveAsteriaArchonEncounter,createThresholdArchonAttack,
  getThresholdArchonPhase,stepThresholdArchon,isArchonAttackContact,
  thresholdArchonDamageMultiplier,projectArchonPulseRadius,archonBeamContact,
} from "../../src/game/asteriaThresholdArchon";

const milestone={kind:"CAMPAIGN_BOSS",id:"blackout_devourer_boss"} as const;
const descriptor={sourceMode:"CAMPAIGN",waveNumber:10,
  completionPolicy:{type:"BOSS_DEFEAT"},milestone};
const boss={x:800,y:150},player={x:800,y:510};
const near=(a:number,b:number,tol=1e-5)=>
  assert.ok(Math.abs(a-b)<=tol,`${a} !== ${b}`);
test("WBE-01F: exact ASTERIA World Route boss identity; campaign and rematches are untouched",()=>{
  assert.equal(resolveAsteriaArchonEncounter(true,descriptor),ARCHON_ENCOUNTER_ID);
  assert.equal(resolveAsteriaArchonEncounter(false,descriptor),null);
  for(const sourceMode of ["INFINITE","SCORE_ATTACK","ENDLESS"])
    assert.equal(resolveAsteriaArchonEncounter(true,{...descriptor,sourceMode}),null);
  for(const waveNumber of [1,9,11])
    assert.equal(resolveAsteriaArchonEncounter(true,{...descriptor,waveNumber}),null);
  assert.equal(resolveAsteriaArchonEncounter(true,{...descriptor,
    completionPolicy:{type:"TIMEBOX"}}),null);
  assert.equal(resolveAsteriaArchonEncounter(true,{...descriptor,milestone:null}),null);
  assert.equal(resolveAsteriaArchonEncounter(true,{...descriptor,
    milestone:{kind:"BOSS_REMATCH",id:"blackout_devourer_boss"}}),null);
  assert.equal(resolveAsteriaArchonEncounter(true,{...descriptor,
    milestone:{kind:"CAMPAIGN_BOSS",id:"other_boss"}}),null);
});
test("WBE-01F: three phases have explicit 70% and 35% health barriers",()=>{
  assert.equal(getThresholdArchonPhase(1800,1800),1);
  assert.equal(getThresholdArchonPhase(1261,1800),1);
  assert.equal(getThresholdArchonPhase(1260,1800),2);
  assert.equal(getThresholdArchonPhase(631,1800),2);
  assert.equal(getThresholdArchonPhase(630,1800),3);
  assert.equal(getThresholdArchonPhase(0,1800),3);
  assert.throws(()=>getThresholdArchonPhase(100,0),RangeError);
});
test("WBE-01F: aim locks on WARN and never homes at moving ENERGY",()=>{
  let state=createThresholdArchonAttack();
  let start=stepThresholdArchon(state,boss,player,100,1);
  assert.equal(start.attack.stage,"PREPARE");
  let announces=0,commits=0;
  for(let n=0;n<11;n++){
    const step=stepThresholdArchon(state,boss,player,100,1);
    state=step.attack;
    announces+=Number(step.announced);
  }
  assert.equal(state.stage,"WARNING");
  assert.equal(state.remainingMs,ARCHON_WARNING_MS);
  assert.equal(announces,1);
  const lockedAngle=state.lockedAngle;
  for(let n=0;n<15;n++){
    const step=stepThresholdArchon(state,boss,{x:1350,y:900},100,1);
    state=step.attack;
    commits+=Number(step.committed);
    near(state.lockedAngle,lockedAngle);
  }
  assert.equal(commits,1);
  assert.equal(state.stage,"ACTIVE");
  for(let n=0;n<17;n++){
    const step=stepThresholdArchon(state,boss,{x:1350,y:900},100,1);
    state=step.attack;
    near(state.lockedAngle,lockedAngle);
  }
  assert.equal(state.stage,"EXPOSED");
  assert.equal(state.remainingMs,ARCHON_EXPOSURE_MS);
});
test("WBE-01F: 3-beacon pattern provides two safe passages wider than projectiles",()=>{
  assert.deepEqual([...ARCHON_BEACON_OFFSETS],[-145,0,145]);
  assert.ok(ARCHON_BEAM_RANGE>600);
  assert.ok(145-2*ARCHON_BEAM_HALF_WIDTH>90);
  const a={...createThresholdArchonAttack(),phase:2 as const,
    stage:"ACTIVE" as const,remainingMs:1000,lockedAngle:0};
  for(const offset of ARCHON_BEACON_OFFSETS){
    assert.equal(isArchonAttackContact(a,{x:100,y:100},{x:350,y:100+offset}),true);
  }
  for(const safe of [-72.5,72.5]){
    assert.equal(isArchonAttackContact(a,{x:100,y:100},{x:350,y:100+safe}),false);
  }
  assert.equal(archonBeamContact({x:100,y:100},{x:200,y:100},0,0),true);
  assert.equal(isArchonAttackContact({...a,stage:"WARNING"},{x:100,y:100},
    {x:350,y:100}),false);
});
test("WBE-01F: orbital phase 3 wave crosses only a narrow ring and opens its core",()=>{
  let state={...createThresholdArchonAttack(),phase:3 as const,
    stage:"ACTIVE" as const,remainingMs:ARCHON_ACTIVE_MS};
  const radius=projectArchonPulseRadius(state.remainingMs);
  near(radius,70);
  assert.equal(isArchonAttackContact(state,{x:0,y:0},{x:70,y:0}),true);
  assert.equal(isArchonAttackContact(state,{x:0,y:0},{x:200,y:0}),false);
  state={...state,remainingMs:ARCHON_ACTIVE_MS/2};
  near(projectArchonPulseRadius(state.remainingMs),235);
  assert.equal(isArchonAttackContact(state,{x:0,y:0},{x:235,y:0}),true);
  assert.equal(isArchonAttackContact(state,{x:0,y:0},{x:300,y:0}),false);
  const step=stepThresholdArchon({...state,remainingMs:50},{x:0,y:0},{x:350,y:0},50,3);
  assert.equal(step.openedCore,true);
  assert.equal(step.attack.stage,"EXPOSED");
  near(thresholdArchonDamageMultiplier(step.attack),2.35);
});
test("WBE-01F: core remains killable, phase transitions reset and behavior is deterministic",()=>{
  const state=createThresholdArchonAttack();
  const a=stepThresholdArchon(state,boss,player,50,1);
  assert.deepEqual(a,stepThresholdArchon(state,boss,player,50,1));
  assert.deepEqual(state,createThresholdArchonAttack());
  const phaseChange=stepThresholdArchon(state,boss,player,50,2);
  assert.equal(phaseChange.phaseChanged,true);
  assert.equal(phaseChange.attack.phase,2);
  assert.equal(phaseChange.attack.stage,"PREPARE");
  assert.equal(phaseChange.contact,false);
  assert.ok(thresholdArchonDamageMultiplier(state)>0);
  const exposed={...state,stage:"EXPOSED" as const};
  assert.ok(thresholdArchonDamageMultiplier(exposed)>1);
  assert.throws(()=>stepThresholdArchon(state,boss,player,-1,1),RangeError);
  assert.throws(()=>stepThresholdArchon(state,boss,player,101,1),RangeError);
  assert.throws(()=>stepThresholdArchon(state,boss,{x:NaN,y:0},16,1),RangeError);
});
test("WBE-01F: real boss instance uses the existing core, collision, HUD, reward and campaign handoff",()=>{
  const root="../../src/game/";
  const game=readFileSync(new URL(root+"EnergySwarmGame.tsx",import.meta.url),"utf8");
  const canvas=readFileSync(new URL(root+"EnergySwarmCanvas.tsx",import.meta.url),"utf8");
  const chassis=readFileSync(new URL(root+"bossChassis.ts",import.meta.url),"utf8");
  const hud=readFileSync(new URL("../../src/components/BossHudOverlay.tsx",import.meta.url),"utf8");
  const descriptorSrc=readFileSync(new URL(root+"runtimeWaveDescriptor.ts",import.meta.url),"utf8");
  const director=readFileSync(new URL(root+"waveDirector.ts",import.meta.url),"utf8");
  for(const keyword of ["spawnBoss(","bossRef.current = boss","updateBossAI(enemy, delta)",
    "registerCombatDefeat(enemy, proj.affinity)","enterInfiniteAfterCampaignVictory()",
    "damagePlayerFromBoss(","bossDefeatedSequenceActiveRef.current = true",
    "capConvergenceBossDamage(", "EnemyType.BOSS_ARCHON",
    "resolveAsteriaArchonEncounter(worldRouteRunActiveRef.current"]){
    assert.ok(game.includes(keyword),keyword);
  }
  assert.match(game,/archonAttack:archonEncounter\?createThresholdArchonAttack/);
  assert.match(game,/stepThresholdArchon\(/);
  assert.match(game,/thresholdArchonDamageMultiplier\(/);
  assert.match(chassis,/ASTERIA_ARCHON:[\s\S]*enemyType: EnemyType.BOSS_ARCHON/);
  assert.match(canvas,/case EnemyType.BOSS_ARCHON/);
  // The real wave intro is ASTERIA-exclusive; the shared Classic descriptor
  // keeps its Blackout Devourer identity for the original campaign.
  assert.match(game,/const archonWaveIntro = Boolean/);
  assert.match(game,/const activeWaveName = archonWaveIntro/);
  assert.match(game,/setWaveName\(activeWaveName\)/);
  assert.match(game,/setWaveIntroConfig\(archonWaveIntro && cfg/);
  assert.match(game,/displayName: "Threshold Archon"/);
  assert.match(canvas,/ARCHON_BEACON_OFFSETS/);
  assert.match(hud,/bossChassis === "ASTERIA_ARCHON"/);
  assert.match(descriptorSrc,/id: BLACKOUT_DEVOURER_CANON.id/);
  assert.match(director,/BOSS_WAVE_NUMBER = 10/);
  assert.doesNotMatch(descriptorSrc,/ARCHON_ENCOUNTER_ID|BOSS_ARCHON/);
  assert.doesNotMatch(director,/BOSS_ARCHON/);
});
