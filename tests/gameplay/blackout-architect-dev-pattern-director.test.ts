import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType } from "../../src/game/types";
import { createBlackoutArchitectDevQaBoss } from "../../src/game/blackoutArchitectDevQaBossFactory";
import { createBlackoutArchitectEngineIdentityLifecycleOwner } from "../../src/game/blackoutArchitectEngineIdentityLifecycle";
import { createBlackoutArchitectDevQaCardinalGeometry } from "../../src/game/blackoutArchitectDevQaCardinalGeometry";
import {
  BLACKOUT_ARCHITECT_DEV_QA_DIRECTOR_AUTHORITY as AUTH,
  BLACKOUT_ARCHITECT_DEV_QA_DIRECTOR_CONFIG as C,
  createBlackoutArchitectDevQaPatternDirector as create,
  stepBlackoutArchitectDevQaPatternDirector as step,
} from "../../src/game/blackoutArchitectDevQaPatternDirector";

const session=()=>{
  const owner=createBlackoutArchitectEngineIdentityLifecycleOwner();
  assert.equal(owner.beginRun(),1);
  const boss=createBlackoutArchitectDevQaBoss(true);assert.ok(boss);
  const enemies=[boss];
  const guard=owner.admitInstalledBoss(boss,boss,enemies);assert.ok(guard);
  const geometry=createBlackoutArchitectDevQaCardinalGeometry(owner,guard,boss,boss,enemies,true);
  assert.ok(geometry);
  const director=create(owner,guard,geometry,boss,boss,enemies,"GRID_LOCK",1,100,true);
  assert.ok(director);
  const observe=(pattern:"GRID_LOCK"|"VECTOR_TIDE"|"SECTOR_WALL",
    cycle:number,phase:"TELEGRAPH"|"ACTIVE"|"RECOVERY",hp:number,active=director)=>
    step(owner,guard,geometry,director,active,boss,boss,enemies,
      pattern,{cycle,phase,qaHullHealth:hp,qaHullDepleted:hp===0});
  return {owner,boss,enemies,guard,geometry,director,observe};
};

test("C8 actual four intact cardinal circles keep live core in Phase 1 and only GRID_LOCK",()=>{
  const s=session();
  assert.equal(s.director.mode,"DEV_QA_ARCHITECT_REAL_PATTERN_DIRECTOR");
  assert.equal(s.director.phase,1);
  assert.equal(s.observe("GRID_LOCK",1,"ACTIVE",100)?.nextPattern,null);
  assert.equal(s.observe("GRID_LOCK",1,"RECOVERY",100)?.nextPattern,null);
  const c=s.observe("GRID_LOCK",2,"TELEGRAPH",100);
  assert.ok(c);assert.equal(c.phase,1);
  assert.equal(c.nextPattern,null);
  assert.equal(c.pattern,"GRID_LOCK");
  assert.equal(c.sourceCycle,2);
  assert.equal(create(s.owner,s.guard,s.geometry,s.boss,s.boss,s.enemies,
    "SECTOR_WALL",1,100,true),null);
  assert.equal(create(s.owner,s.guard,s.geometry,s.boss,s.boss,s.enemies,
    "GRID_LOCK",1,100,false),null);
});
test("C8 real core HP 68% unlocks VECTOR after all four physical anchors zero",()=>{
  const s=session();
  for(const a of s.geometry.anchors)a.health=0;
  s.boss.health=s.boss.maxHealth*C.thresholdPhase2;
  const p=s.observe("GRID_LOCK",1,"ACTIVE",88);
  assert.ok(p);assert.equal(p.phase,2);assert.equal(p.qaHullHealth,88);
  assert.equal(p.nextPattern,null);
  const n=s.observe("GRID_LOCK",2,"TELEGRAPH",88);
  assert.ok(n);assert.equal(n.nextPattern,"VECTOR_TIDE");
  assert.equal(n.pattern,"VECTOR_TIDE");
  assert.equal(n.sourceCycle,1);
  const bolt=s.observe("VECTOR_TIDE",1,"ACTIVE",76);
  assert.ok(bolt);assert.equal(bolt.qaHullHealth,76);
  assert.equal(s.director.qaHullHealth,76);
  assert.equal(s.observe("VECTOR_TIDE",1,"RECOVERY",88),null); // no hull resurrection
  assert.equal(s.observe("VECTOR_TIDE",2,"TELEGRAPH",76)?.nextPattern,"GRID_LOCK");
});
test("C8 core HP 32% unlocks SECTOR safely, only at recovery-to-telegraph",()=>{
  const s=session();
  for(const a of s.geometry.anchors)a.health=0;
  s.boss.health=s.boss.maxHealth*C.thresholdPhase3;
  assert.equal(s.observe("GRID_LOCK",1,"ACTIVE",100)?.phase,3);
  assert.equal(s.observe("GRID_LOCK",2,"TELEGRAPH",100)?.nextPattern,"VECTOR_TIDE");
  assert.equal(s.observe("VECTOR_TIDE",1,"ACTIVE",88)?.nextPattern,null);
  const sector=s.observe("VECTOR_TIDE",2,"TELEGRAPH",88);
  assert.ok(sector);assert.equal(sector.pattern,"SECTOR_WALL");
  assert.equal(sector.nextPattern,"SECTOR_WALL");
  assert.equal(s.observe("SECTOR_WALL",1,"ACTIVE",76)?.qaHullHealth,76);
  assert.equal(s.observe("SECTOR_WALL",2,"TELEGRAPH",76)?.nextPattern,"GRID_LOCK");
});
test("C8 phase threshold has no illegal phase skip while anchors still alive",()=>{
  const s=session();
  s.boss.health=s.boss.maxHealth*0.1; // corrupted direct core edit; still gated
  assert.equal(s.observe("GRID_LOCK",1,"ACTIVE",100)?.phase,1);
  s.geometry.anchors[0].health=0;
  assert.equal(s.observe("GRID_LOCK",1,"RECOVERY",100)?.phase,1);
});
test("C8 rejects cross-run clones, stale guard, Titan and replay cycles",()=>{
  const s=session();
  assert.equal(s.observe("GRID_LOCK",1,"ACTIVE",100,{...s.director}),null);
  assert.equal(s.observe("VECTOR_TIDE",1,"ACTIVE",100),null);
  assert.equal(s.observe("GRID_LOCK",3,"TELEGRAPH",100),null);
  assert.equal(step(s.owner,s.guard,s.geometry,s.director,s.director,
    {...s.boss,type:EnemyType.BOSS_TITAN},s.boss,s.enemies,"GRID_LOCK",
    {phase:"ACTIVE",cycle:1,qaHullHealth:100,qaHullDepleted:false}),null);
  assert.equal(s.owner.invalidateRun(),null);
  assert.equal(s.observe("GRID_LOCK",1,"ACTIVE",100),null);
});
test("C8 rejects malformed anchor state, core HP healing and invalid hull observations",()=>{
  const a=session();
  a.geometry.anchors[1].health=NaN;
  assert.equal(a.observe("GRID_LOCK",1,"ACTIVE",100),null);
  const b=session();
  b.boss.health+=1;
  assert.equal(b.observe("GRID_LOCK",1,"ACTIVE",100),null);
  const c=session();
  assert.equal(c.observe("GRID_LOCK",1,"ACTIVE",NaN),null);
  assert.equal(c.observe("GRID_LOCK",1,"ACTIVE",0),null);
  assert.equal(c.observe("GRID_LOCK",1,"ACTIVE",101),null);
  const d=session();
  (d.geometry.anchors[1] as {id:string}).id="NORTH";
  assert.equal(d.observe("GRID_LOCK",1,"ACTIVE",100),null);
});
test("C8 authority remains DEV QA and excludes global player systems",()=>{
  assert.ok(Object.isFrozen(AUTH));
  const owned=Object.entries(AUTH).filter(([,v])=>v===true).map(([k])=>k);
  assert.deepEqual(owned,[
    "ownsAuthenticatedDevQaPhaseAndPatternSelection",
    "ownsPersistentIndependentQaHullAcrossPatternTransitions",
    "ownsDeterministicSafeRecoveryHandoff",
  ]);
  assert.ok(Object.entries(AUTH).filter(([,v])=>v!==true).every(([,v])=>v===false));
});