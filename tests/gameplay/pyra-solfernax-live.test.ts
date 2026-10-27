import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createSolfernaxAttack,resolveSolfernaxEncounter,getSolfernaxPhase,
 stepSolfernax,solfernaxAttackContact,solfernaxDamageMultiplier,
 solfernaxGateShift,solfernaxCollapseRadius,SOLFERNAX_ATTACK_NAMES,
 SOLFERNAX_WARNING_MS,SOLFERNAX_ACTIVE_MS,SOLFERNAX_EXPOSED_MS,
 SOLFERNAX_VENT_OFFSETS,SOLFERNAX_GATE_OFFSETS,SOLFERNAX_COLLAPSE_LANES,
} from "../../src/game/pyraSolfernax";
const boss={x:800,y:390},player={x:1060,y:390};
const descriptor={sourceMode:"CAMPAIGN",waveNumber:10,
 completionPolicy:{type:"BOSS_DEFEAT"},milestone:{kind:"CAMPAIGN_BOSS",
 id:"blackout_devourer_boss"}};
test("PYRA-06: only the canonical wave-ten world-route primary boss slot",()=>{
 assert.equal(resolveSolfernaxEncounter(true,descriptor),
  "world:pyra:solfernax:v1");
 assert.equal(resolveSolfernaxEncounter(false,descriptor),null);
 assert.equal(resolveSolfernaxEncounter(true,
  {...descriptor,sourceMode:"INFINITE"}),null);
 assert.equal(resolveSolfernaxEncounter(true,
  {...descriptor,waveNumber:9}),null);
 assert.equal(resolveSolfernaxEncounter(true,
  {...descriptor,milestone:null}),null);
 assert.equal(resolveSolfernaxEncounter(true,
  {...descriptor,completionPolicy:{type:"TIMEBOX"}}),null);
});
test("PYRA-06: three stable health thresholds and strong terminal cooling window",()=>{
 assert.equal(getSolfernaxPhase(2200,2200),1);
 assert.equal(getSolfernaxPhase(1541,2200),1);
 assert.equal(getSolfernaxPhase(1540,2200),2);
 assert.equal(getSolfernaxPhase(770,2200),3);
 assert.equal(getSolfernaxPhase(0,2200),3);
 assert.throws(()=>getSolfernaxPhase(0,0),RangeError);
 const a=createSolfernaxAttack();
 assert.equal(solfernaxDamageMultiplier(a),.82);
 assert.equal(solfernaxDamageMultiplier({...a,stage:"WARNING"}),.55);
 assert.equal(solfernaxDamageMultiplier({...a,stage:"EXPOSED"}),2.05);
 assert.equal(solfernaxDamageMultiplier({...a,stage:"EXPOSED",phase:3}),2.55);
 assert.equal(Object.keys(SOLFERNAX_ATTACK_NAMES).length,3);
});
test("PYRA-06: every attack announces the locked aim for 1440ms",()=>{
 let a=createSolfernaxAttack();
 for(let i=0;i<10;i++){
  const step=stepSolfernax(a,boss,player,100,1);
  a=step.attack;
 }
 assert.equal(a.stage,"WARNING");assert.equal(a.remainingMs,SOLFERNAX_WARNING_MS);
 assert.equal(a.lockedAngle,0);
 for(let i=0;i<14;i++){
  const s=stepSolfernax(a,boss,{x:400,y:390},100,1);
  assert.equal(s.fired,false);assert.equal(s.contact,false);
  a=s.attack;assert.equal(a.lockedAngle,0);
 }
 let s=stepSolfernax(a,boss,{x:400,y:390},40,1);
 assert.equal(s.fired,true);assert.equal(s.attack.stage,"ACTIVE");
 assert.equal(s.attack.remainingMs,SOLFERNAX_ACTIVE_MS);
 assert.equal(s.contact,false);
});
test("PYRA-06: all phases preserve available safe routes",()=>{
 assert.equal(SOLFERNAX_VENT_OFFSETS.length,3);
 assert.equal(SOLFERNAX_GATE_OFFSETS.length,2);
 assert.equal(SOLFERNAX_COLLAPSE_LANES.length,2);
 for(const phase of [1,2,3] as const){
  const a={...createSolfernaxAttack(),stage:"ACTIVE" as const,
    phase,lockedAngle:0,remainingMs:600};
  const hits=Array.from({length:36},(_,i)=>{
   const theta=i*2*Math.PI/36;
   return solfernaxAttackContact(a,boss,{
    x:boss.x+260*Math.cos(theta),y:boss.y+260*Math.sin(theta)});
  });
  assert.ok(hits.some(Boolean),"must have visible damaging lanes");
  assert.ok(hits.some(h=>!h),"must preserve an escape route");
  assert.equal(solfernaxAttackContact({...a,stage:"WARNING"},boss,player),false);
 }
 assert.equal(solfernaxAttackContact({...createSolfernaxAttack(),
  phase:1,stage:"ACTIVE",remainingMs:600,lockedAngle:0},boss,player),true);
 const gates={...createSolfernaxAttack(),phase:2 as const,stage:"ACTIVE" as const,
  remainingMs:SOLFERNAX_ACTIVE_MS/2,lockedAngle:0};
 assert.equal(solfernaxAttackContact(gates,boss,player),false);
 assert.equal(solfernaxAttackContact(gates,boss,{x:1000,y:518}),true);
 assert.equal(solfernaxGateShift(gates),0);
 assert.equal(solfernaxGateShift({...gates,cycle:1}),0);
 const collapse={...createSolfernaxAttack(),phase:3 as const,
  stage:"ACTIVE" as const,remainingMs:SOLFERNAX_ACTIVE_MS,lockedAngle:0};
 assert.ok(solfernaxCollapseRadius(collapse)>300);
 assert.equal(solfernaxAttackContact(collapse,boss,player),false);
});
test("PYRA-06: phase transition freezes telegraph and reopens a real reactor",()=>{
 let a:ReturnType<typeof createSolfernaxAttack>={
  ...createSolfernaxAttack(),stage:"ACTIVE",remainingMs:100,lockedAngle:0};
 let s=stepSolfernax(a,boss,player,100,1);a=s.attack;
 assert.equal(s.exposed,true);assert.equal(a.stage,"EXPOSED");
 assert.equal(a.remainingMs,SOLFERNAX_EXPOSED_MS);
 s=stepSolfernax(a,boss,player,40,2);
 assert.equal(s.phaseChanged,true);assert.equal(s.attack.phase,2);
 assert.equal(s.attack.stage,"PREPARE");
 assert.equal(s.contact,false);
 const same=stepSolfernax(a,boss,player,40,1);
 assert.deepEqual(same,stepSolfernax(a,boss,player,40,1));
 assert.throws(()=>stepSolfernax(a,boss,player,101,1),RangeError);
});
test("PYRA-06: direct canonical boss ownership, visuals and victory signals",()=>{
 const game=readFileSync(new URL("../../src/game/EnergySwarmGame.tsx",import.meta.url),"utf8");
 const canvas=readFileSync(new URL("../../src/game/EnergySwarmCanvas.tsx",import.meta.url),"utf8");
 const chassis=readFileSync(new URL("../../src/game/bossChassis.ts",import.meta.url),"utf8");
 for(const name of ["resolveSolfernaxEncounter(","stepSolfernax(",
 "solfernaxAttackContact(","solfernaxDamageMultiplier(",
 "getSolfernaxPhase(","BOSS_SOLFERNAX","registerCombatDefeat(enemy, proj.affinity)"])
  assert.ok(game.includes(name),name);
 assert.match(canvas,/case EnemyType.BOSS_SOLFERNAX/);
 assert.match(canvas,/enemy.solfernaxAttack/);
 assert.ok(chassis.includes("PYRA_SOLFERNAX"));
});
