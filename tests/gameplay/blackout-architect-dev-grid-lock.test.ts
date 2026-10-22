import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType } from "../../src/game/types";
import { createBlackoutArchitectDevQaBoss } from "../../src/game/blackoutArchitectDevQaBossFactory";
import { createBlackoutArchitectEngineIdentityLifecycleOwner } from "../../src/game/blackoutArchitectEngineIdentityLifecycle";
import {
  BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_CONFIG as CFG,
  BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_AUTHORITY,
  createBlackoutArchitectDevQaGridLockState,
  stepBlackoutArchitectDevQaGridLock,
} from "../../src/game/blackoutArchitectDevQaGridLockAttack";

const session=()=>{
  const owner=createBlackoutArchitectEngineIdentityLifecycleOwner();
  assert.equal(owner.beginRun(),1);
  const boss=createBlackoutArchitectDevQaBoss(true);
  assert.ok(boss);
  const enemies=[boss];
  const guard=owner.admitInstalledBoss(boss,boss,enemies);
  assert.ok(guard);
  const state=createBlackoutArchitectDevQaGridLockState(owner,guard,boss,boss,enemies,true);
  assert.ok(state);
  return {owner,boss,enemies,guard,state};
};
type Session=ReturnType<typeof session>;
const danger={x:800,y:200};
const safe={x:1300,y:850};
const tick=(s:Session,pos=safe,delta=16.6)=>stepBlackoutArchitectDevQaGridLock(
  s.owner,s.guard,s.state,s.state,s.boss,s.boss,s.enemies,pos,delta,
);
const advance=(s:Session,desired:"TELEGRAPH"|"ACTIVE"|"RECOVERY")=>{
  for(let i=0;i<550;i++){
    if(s.state.phase===desired) return;
    assert.ok(tick(s,safe,33.2));
  }
  assert.fail("GRID_LOCK never reached phase "+desired);
};

test("C5 GRID_LOCK starts with real finite telegraph, exact original zero-projectile budget",()=>{
  const s=session();
  assert.equal(s.state.mode,"DEV_QA_GRID_LOCK_PHYSICAL");
  assert.equal(s.state.phase,"TELEGRAPH");
  assert.equal(s.state.remainingMs,1400);
  assert.equal(s.state.qaHullHealth,100);
  assert.equal(s.state.cycle,1);
  assert.equal(CFG.telegraphMs,1400);
  assert.equal(CFG.activeMs,850);
  assert.equal(CFG.recoveryMs,6600);
  assert.equal(CFG.projectileBudget,0);
  assert.equal(Object.isSealed(s.state),true);
  assert.equal(createBlackoutArchitectDevQaGridLockState(s.owner,s.guard,s.boss,s.boss,s.enemies,false),null);
});
test("C5 no telegraph/recovery damage; live ACTIVE hit actually deducts separate QA hull once",()=>{
  const s=session();
  const warning=tick(s,danger,16.6);
  assert.ok(warning);assert.equal(warning.damageApplied,0);
  assert.equal(s.state.qaHullHealth,100);
  advance(s,"ACTIVE");
  const hit=tick(s,danger,16.6);
  assert.ok(hit);
  assert.equal(hit.damageApplied,20);
  assert.equal(hit.qaHullHealth,80);
  assert.equal(hit.hitOnceThisCycle,true);
  assert.equal(hit.qaHullDepleted,false);
  assert.equal(s.state.qaHullHealth,80);
  assert.equal(s.boss.health,s.boss.maxHealth,"boss core is not attack damage");
  for(let i=0;i<8;i++){
    const repeat=tick(s,danger);
    assert.ok(repeat);assert.equal(repeat.damageApplied,0);
    assert.equal(s.state.qaHullHealth,80);
  }
  advance(s,"RECOVERY");
  const rest=tick(s,danger);
  assert.ok(rest);
  assert.equal(rest.damageApplied,0);
  assert.equal(s.state.qaHullHealth,80);
});
test("C5 crossing vertical+horizontal lanes still hits once, while outside collision radius is safe",()=>{
  const s=session();advance(s,"ACTIVE");
  const crossing=tick(s,danger);
  assert.ok(crossing);assert.equal(crossing.damageApplied,20);
  assert.equal(s.state.qaHullHealth,80);
  const v=session();advance(v,"ACTIVE");
  const outside=tick(v,{x:v.boss.x+CFG.halfWidth+CFG.playerCollisionRadius+0.01,y:v.boss.y+60});
  assert.ok(outside);assert.equal(outside.damageApplied,0);
  assert.equal(v.state.qaHullHealth,100);
  const h=session();advance(h,"ACTIVE");
  const along=tick(h,{x:h.boss.x+120,y:h.boss.y+CFG.halfWidth+CFG.playerCollisionRadius});
  assert.ok(along);assert.equal(along.damageApplied,20);
  assert.equal(h.state.qaHullHealth,80);
});
test("C5 after recovery enters new telegraph and independently allows next cycle attack",()=>{
  const s=session();advance(s,"ACTIVE");
  assert.equal(tick(s,danger)?.damageApplied,20);
  advance(s,"RECOVERY");
  advance(s,"TELEGRAPH");
  assert.equal(s.state.cycle,2);
  assert.equal(tick(s,danger)?.damageApplied,0);
  advance(s,"ACTIVE");
  const second=tick(s,danger);
  assert.ok(second);assert.equal(second.damageApplied,20);
  assert.equal(second.qaHullHealth,60);
});
test("C5 QA hull reaches terminal zero only after five distinct active cycles",()=>{
  const s=session();
  for(let cycle=1;cycle<=5;cycle++){
    advance(s,"ACTIVE");
    const hit=tick(s,danger);
    assert.ok(hit);
    assert.equal(hit.damageApplied,20);
    assert.equal(hit.qaHullHealth,100-cycle*20);
    assert.equal(hit.qaHullDepleted,cycle===5);
    assert.equal(s.boss.health,s.boss.maxHealth);
    if(cycle<5){
      advance(s,"RECOVERY");
      advance(s,"TELEGRAPH");
    }
  }
});
test("C5 fail-closed on malformed time, player bounds, spoofed state, foreign guard, stale boss and Titan",()=>{
  const s=session();
  assert.equal(tick(s,danger,-1),null);
  assert.equal(tick(s,danger,33.201),null);
  assert.equal(tick(s,{x:NaN,y:200}),null);
  assert.equal(tick(s,{x:Infinity,y:200}),null);
  assert.equal(tick(s,{x:3,y:200}),null);
  assert.equal(tick(s,{x:800,y:960}),null);
  assert.equal(s.state.remainingMs,1400);
  const cloned={...s.state};
  assert.equal(stepBlackoutArchitectDevQaGridLock(s.owner,s.guard,cloned,s.state,s.boss,s.boss,s.enemies,danger,16.6),null);
  const foreign=session();
  assert.equal(stepBlackoutArchitectDevQaGridLock(s.owner,foreign.guard,s.state,s.state,s.boss,s.boss,s.enemies,danger,16.6),null);
  const badBoss={...s.boss,type:EnemyType.BOSS_TITAN,bossChassis:"TITAN_CORE" as const,infiniteBossIdentity:"NULL_ARCHITECT" as const,architectBossIdentity:undefined};
  assert.equal(stepBlackoutArchitectDevQaGridLock(s.owner,s.guard,s.state,s.state,badBoss,badBoss,[badBoss],danger,16.6),null);
  const stale=session();
  assert.equal(stale.owner.invalidateRun(),null);
  assert.equal(tick(stale,danger),null);
});
test("C5 corrupted QA hull/timer/state never deals damage",()=>{
  const s=session();
  s.state.qaHullHealth=Number.NaN;
  assert.equal(tick(s,danger),null);
  const v=session();
  v.state.remainingMs=Infinity;
  assert.equal(tick(v,danger),null);
  const w=session();
  w.state.phase="ACTIVE";
  w.state.remainingMs=851;
  assert.equal(tick(w,danger),null);
  const x=session();
  x.state.cycle=Number.MAX_SAFE_INTEGER;
  x.state.phase="RECOVERY";
  x.state.remainingMs=1;
  assert.equal(tick(x,danger,16.6),null);
});
test("C5 physical first attack has no global game AI, rewards or shield authority",()=>{
  assert.ok(Object.isFrozen(BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_AUTHORITY));
  const truths=Object.entries(BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_AUTHORITY).filter(([,v])=>v===true).map(([k])=>k);
  assert.deepEqual(truths,["ownsDevOnlyWorldSpacePhysicalAttack","ownsTelegraphActiveRecoveryTiming","ownsSingleCycleQaHullCollisionAndDamage"]);
  assert.ok(Object.entries(BLACKOUT_ARCHITECT_DEV_QA_GRID_LOCK_AUTHORITY).filter(([,v])=>v!==true).every(([,v])=>v===false));
});
