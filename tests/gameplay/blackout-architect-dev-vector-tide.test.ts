import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType } from "../../src/game/types";
import { createBlackoutArchitectDevQaBoss } from "../../src/game/blackoutArchitectDevQaBossFactory";
import { createBlackoutArchitectEngineIdentityLifecycleOwner } from "../../src/game/blackoutArchitectEngineIdentityLifecycle";
import {
 BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_CONFIG as C,
 BLACKOUT_ARCHITECT_DEV_QA_VECTOR_TIDE_AUTHORITY as AUTH,
 createBlackoutArchitectDevQaVectorTideState as create,
 stepBlackoutArchitectDevQaVectorTide as step,
} from "../../src/game/blackoutArchitectDevQaVectorTideAttack";
const session=()=>{
 const owner=createBlackoutArchitectEngineIdentityLifecycleOwner();
 assert.equal(owner.beginRun(),1);
 const boss=createBlackoutArchitectDevQaBoss(true);assert.ok(boss);
 const enemies=[boss];
 const guard=owner.admitInstalledBoss(boss,boss,enemies);assert.ok(guard);
 const state=create(owner,guard,boss,boss,enemies,true);assert.ok(state);
 const tick=(p:{x:number;y:number},delta=20,current=state)=>
   step(owner,guard,state,current,boss,boss,enemies,p,delta);
 return {owner,boss,enemies,guard,state,tick};
};
const safe={x:1300,y:800};
const toActive=(s:ReturnType<typeof session>)=>{for(let i=0;i<85;i++)assert.ok(s.tick(safe,20));assert.equal(s.state.phase,"ACTIVE");};
test("C6 authentic VECTOR_TIDE allocates exactly six engine-owned moving hazards and no global projectiles",()=>{
 const s=session();
 assert.equal(s.state.phase,"TELEGRAPH");
 assert.equal(s.state.remainingMs,1700);
 assert.equal(s.state.qaHullHealth,100);
 assert.equal(s.state.bolts.length,6);
 assert.equal(new Set(s.state.bolts.map(x=>x.id)).size,6);
 assert.ok(Object.isFrozen(s.state.bolts));
 assert.ok(s.state.bolts.every(x=>Object.isSealed(x)));
 assert.equal(C.projectileBudget,6);
 assert.equal(C.recoveryMs,7500);
 assert.equal(create(s.owner,s.guard,s.boss,s.boss,s.enemies,false),null);
});
test("C6 moving world-space hazards hit FOTON and consume their own per-cycle collision once",()=>{
 const s=session();toActive(s);
 const b=s.state.bolts[0];
 const before=b.x;
 const result=s.tick({x:s.boss.x+4,y:s.boss.y},20);
 assert.ok(result);
 assert.ok(b.x>before);
 assert.ok(result.damageApplied>0);
 assert.ok(result.hits>=1&&result.hits<=6);
 const spent=s.state.bolts.filter(x=>x.spent);
 assert.equal(spent.length,result.hits);
 const hp=s.state.qaHullHealth;
 assert.ok(hp<100);
 const replay=s.tick({x:s.boss.x+4,y:s.boss.y},20);
 assert.ok(replay);
 assert.equal(replay.hits,0);
 assert.equal(s.state.qaHullHealth,hp);
});
test("C6 telegraph and recovery never harm hull, and phase cadence recycles six fresh projectiles",()=>{
 const s=session();
 assert.equal(s.tick({x:s.boss.x,y:s.boss.y})?.damageApplied,0);
 for(let i=0;i<84;i++)s.tick(safe,20);
 assert.equal(s.state.phase,"ACTIVE");
 for(let i=0;i<80;i++)assert.ok(s.tick(safe,20));
 assert.equal(s.state.phase,"RECOVERY");
 assert.equal(s.tick({x:s.boss.x,y:s.boss.y})?.damageApplied,0);
 for(let i=0;i<374;i++)assert.ok(s.tick(safe,20));
 assert.equal(s.state.phase,"TELEGRAPH");
 assert.equal(s.state.cycle,2);
 assert.equal(s.state.bolts.every(x=>!x.spent),true);
});
test("C6 rejects malformed input, foreign refs, Titan and stale run without health mutation",()=>{
 const s=session();
 for(const delta of [-1,33.3,NaN,Infinity])assert.equal(s.tick(safe,delta),null);
 assert.equal(s.tick({x:NaN,y:800}),null);
 assert.equal(s.tick({x:800,y:Infinity}),null);
 assert.equal(s.tick({x:0,y:800}),null);
 assert.equal(s.tick(safe,20,{...s.state}),null);
 assert.equal(s.state.qaHullHealth,100);
 const f=session();
 assert.equal(step(s.owner,f.guard,s.state,s.state,s.boss,s.boss,s.enemies,safe,20),null);
 const titan={...s.boss,type:EnemyType.BOSS_TITAN,bossChassis:"TITAN_CORE" as const,
  infiniteBossIdentity:"NULL_ARCHITECT" as const,architectBossIdentity:undefined};
 assert.equal(step(s.owner,s.guard,s.state,s.state,titan,titan,[titan],safe,20),null);
 assert.equal(s.owner.invalidateRun(),null);
 assert.equal(s.tick(safe,20),null);
});
test("C6 six fixed hazards fail closed on duplicate IDs, bogus timers or corrupted hull",()=>{
 const a=session();(a.state.bolts[1] as any).id=0;
 assert.equal(a.tick(safe,20),null);
 const b=session();b.state.qaHullHealth=Number.NaN;
 assert.equal(b.tick(safe,20),null);
 const c=session();c.state.remainingMs=1701;
 assert.equal(c.tick(safe,20),null);
 const d=session();(d.state.bolts[0] as any).vx=Infinity;
 assert.equal(d.tick(safe,20),null);
});
test("C6 authority has no normal boss or shared array, RNG, scoring or mode capability",()=>{
 assert.ok(Object.isFrozen(AUTH));
 for(const [k,v] of Object.entries(AUTH)){
  if(["ownsSixAuthenticQaPhysicalHazards","ownsDeterministicTelegraphActiveRecovery",
     "ownsIndependentQaHullHits"].includes(k))assert.equal(v,true,k);
  else assert.equal(v,false,k);
 }
});
