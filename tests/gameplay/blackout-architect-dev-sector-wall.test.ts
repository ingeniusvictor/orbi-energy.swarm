import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType } from "../../src/game/types";
import { createBlackoutArchitectDevQaBoss } from "../../src/game/blackoutArchitectDevQaBossFactory";
import { createBlackoutArchitectEngineIdentityLifecycleOwner } from "../../src/game/blackoutArchitectEngineIdentityLifecycle";
import {
  BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_CONFIG as C,
  BLACKOUT_ARCHITECT_DEV_QA_SECTOR_WALL_AUTHORITY as AUTH,
  createBlackoutArchitectDevQaSectorWallState as create,
  stepBlackoutArchitectDevQaSectorWall as step,
} from "../../src/game/blackoutArchitectDevQaSectorWallAttack";

const session=()=>{
  const owner=createBlackoutArchitectEngineIdentityLifecycleOwner();
  assert.equal(owner.beginRun(),1);
  const boss=createBlackoutArchitectDevQaBoss(true);assert.ok(boss);
  const enemies=[boss];
  const guard=owner.admitInstalledBoss(boss,boss,enemies);assert.ok(guard);
  const state=create(owner,guard,boss,boss,enemies,true);assert.ok(state);
  const tick=(foton:{x:number;y:number},delta=20,active=state)=>
    step(owner,guard,state,active,boss,boss,enemies,foton,delta);
  return {owner,boss,enemies,guard,state,tick};
};
const safe={x:1300,y:800};
const active=(s:ReturnType<typeof session>)=>{
  for(let i=0;i<95;i++)assert.ok(s.tick(safe,20));
  assert.equal(s.state.phase,"ACTIVE");
};
const recovery=(s:ReturnType<typeof session>)=>{
  for(let i=0;i<75;i++)assert.ok(s.tick(safe,20));
  assert.equal(s.state.phase,"RECOVERY");
};
test("C7 original design envelope instantiates eight exclusive physical wall objects",()=>{
  const s=session();
  assert.equal(s.state.mode,"DEV_QA_SECTOR_WALL_PHYSICAL");
  assert.equal(s.state.phase,"TELEGRAPH");
  assert.equal(s.state.remainingMs,1900);
  assert.equal(s.state.qaHullHealth,100);
  assert.equal(s.state.segments.length,8);
  assert.equal(new Set(s.state.segments.map(v=>v.id)).size,8);
  assert.ok(Object.isFrozen(s.state.segments));
  assert.ok(s.state.segments.every(v=>Object.isSealed(v)));
  assert.equal(C.segmentBudget,8);
  assert.equal(C.recoveryMs,9000);
  assert.equal(create(s.owner,s.guard,s.boss,s.boss,s.enemies,false),null);
});
test("C7 real swept wall hits current FOTON world position and consumes each segment at most once",()=>{
  const s=session();
  assert.equal(s.tick({x:s.boss.x+74,y:s.boss.y})?.damageApplied,0);
  active(s);
  const wall=s.state.segments[0];
  const x=wall.x;
  const target={x:s.boss.x+77.2,y:s.boss.y};
  const hit=s.tick(target,20);
  assert.ok(hit);assert.equal(hit.damageApplied,12);assert.equal(hit.hits,1);
  assert.equal(s.state.qaHullHealth,88);
  assert.ok(wall.x>x);
  assert.equal(wall.hitRegistered,true);
  const again=s.tick(target,20);assert.ok(again);
  assert.equal(again.damageApplied,0);
  assert.equal(s.state.qaHullHealth,88);
  assert.equal(s.boss.health,s.boss.maxHealth);
});
test("C7 outside wall and tangent boundary do not double-hit the player",()=>{
  const s=session();active(s);
  const miss=s.tick({x:s.boss.x+300,y:s.boss.y+200},20);
  assert.ok(miss);assert.equal(miss.damageApplied,0);
  const target={x:s.boss.x+77.2,y:s.boss.y+56};
  const collision=s.tick(target,20);
  assert.ok(collision);assert.equal(collision.damageApplied,12);
  assert.equal(collision.hits,1);
});
test("C7 recovery cannot damage; next cycle resets wall collision only",()=>{
  const s=session();active(s);
  assert.equal(s.tick({x:s.boss.x+77.2,y:s.boss.y},20)?.damageApplied,12);
  for(let i=0;i<74;i++)assert.ok(s.tick(safe,20));
  assert.equal(s.state.phase,"RECOVERY");
  assert.equal(s.tick({x:s.boss.x+80,y:s.boss.y},20)?.damageApplied,0);
  for(let i=0;i<449;i++)assert.ok(s.tick(safe,20));
  assert.equal(s.state.phase,"TELEGRAPH");
  assert.equal(s.state.cycle,2);
  assert.ok(s.state.segments.every(w=>!w.hitRegistered));
  active(s);
  assert.equal(s.tick({x:s.boss.x+77.2,y:s.boss.y},20)?.damageApplied,12);
  assert.equal(s.state.qaHullHealth,76);
});
test("C7 finite source times cannot overshoot physical wall bounds on final active frame",()=>{
  const s=session();active(s);
  s.state.remainingMs=1;
  assert.ok(s.tick(safe,20));
  assert.equal(s.state.phase,"RECOVERY");
  for(const w of s.state.segments){
    assert.ok(Math.hypot(w.x-s.boss.x,w.y-s.boss.y)<=C.startDistance+C.activeMs*C.radialSpeed+0.001);
  }
  assert.ok(s.tick(safe,20));
});
test("C7 fail-closed on foreign reference, Titan, stale run, invalid coordinates and timers",()=>{
  const s=session();
  for(const dt of [-1,33.3,NaN,Infinity])assert.equal(s.tick(safe,dt),null);
  assert.equal(s.tick({x:NaN,y:s.boss.y}),null);
  assert.equal(s.tick({x:s.boss.x,y:Infinity}),null);
  assert.equal(s.tick({x:0,y:s.boss.y}),null);
  assert.equal(s.tick(safe,20,{...s.state}),null);
  const foreign=session();
  assert.equal(step(s.owner,foreign.guard,s.state,s.state,s.boss,s.boss,s.enemies,safe,20),null);
  const titan={...s.boss,type:EnemyType.BOSS_TITAN,architectBossIdentity:undefined,
    bossChassis:"TITAN_CORE" as const,infiniteBossIdentity:"NULL_ARCHITECT" as const};
  assert.equal(step(s.owner,s.guard,s.state,s.state,titan,titan,[titan],safe,20),null);
  assert.equal(s.state.qaHullHealth,100);
  assert.equal(s.owner.invalidateRun(),null);
  assert.equal(s.tick(safe,20),null);
});
test("C7 malformed eight-wall collection, corrupted HP, direction, geometry and cycle fail closed",()=>{
  const a=session();(a.state.segments[1] as {id:number}).id=0;
  assert.equal(a.tick(safe,20),null);
  const b=session();b.state.qaHullHealth=Number.NaN;
  assert.equal(b.tick(safe,20),null);
  const c=session();(c.state.segments[0] as {directionX:number}).directionX=Infinity;
  assert.equal(c.tick(safe,20),null);
  const d=session();d.state.remainingMs=1901;
  assert.equal(d.tick(safe,20),null);
  const e=session();e.state.cycle=Number.MAX_SAFE_INTEGER;
  e.state.phase="RECOVERY";e.state.remainingMs=1;
  assert.equal(e.tick(safe,20),null);
  const f=session();f.state.segments[0].y+=70; // tamper off the projected axis
  assert.equal(f.tick(safe,20),null);
});
test("C7 cap real hull to zero, report terminal QA without writing legacy health",()=>{
  const s=session();active(s);
  s.state.qaHullHealth=8;
  const hit=s.tick({x:s.boss.x+77.2,y:s.boss.y},20);
  assert.ok(hit);assert.equal(hit.damageApplied,8);
  assert.equal(hit.qaHullDepleted,true);assert.equal(hit.qaHullHealth,0);
  assert.equal(s.boss.health,s.boss.maxHealth);
});
test("C7 authority is strictly DEV QA sector wall, not production, legacy or third-party state",()=>{
  assert.ok(Object.isFrozen(AUTH));
  const positive=Object.entries(AUTH).filter(([,v])=>v===true).map(([k])=>k);
  assert.deepEqual(positive,["ownsEightPhysicalDevQaWallSegments","ownsDeterministicWallMotionAndTimers","ownsSeparateQaHullDamage"]);
  assert.ok(Object.entries(AUTH).filter(([,v])=>v!==true).every(([,v])=>v===false));
});
