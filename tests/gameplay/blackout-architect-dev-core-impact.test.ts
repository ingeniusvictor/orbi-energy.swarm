import assert from "node:assert/strict";
import test from "node:test";
import { EnemyType, type Projectile } from "../../src/game/types";
import { createBlackoutArchitectDevQaBoss } from "../../src/game/blackoutArchitectDevQaBossFactory";
import { createBlackoutArchitectEngineIdentityLifecycleOwner } from "../../src/game/blackoutArchitectEngineIdentityLifecycle";
import { createBlackoutArchitectDevQaCardinalGeometry } from "../../src/game/blackoutArchitectDevQaCardinalGeometry";
import { resolveBlackoutArchitectDevQaCardinalImpact } from "../../src/game/blackoutArchitectDevQaCardinalImpact";
import {
  BLACKOUT_ARCHITECT_DEV_QA_CORE_IMPACT_AUTHORITY,
  resolveBlackoutArchitectDevQaCoreImpact as coreHit,
} from "../../src/game/blackoutArchitectDevQaCoreImpact";

const setup=()=>{
  const owner=createBlackoutArchitectEngineIdentityLifecycleOwner();
  assert.equal(owner.beginRun(),1);
  const boss=createBlackoutArchitectDevQaBoss(true);
  assert.ok(boss);
  const enemies=[boss];
  const guard=owner.admitInstalledBoss(boss,boss,enemies);
  assert.ok(guard);
  const geometry=createBlackoutArchitectDevQaCardinalGeometry(owner,guard,boss,boss,enemies,true);
  assert.ok(geometry);
  return {owner,boss,enemies,guard,geometry};
};
const shot=(x=800,y=200,damage=20):Projectile=>({
  id:"qa-test",x,y,vx:0,vy:6,size:4,damage,fromPlayer:true,
  color:"#67e8f9",life:1600,maxLife:1600,
});
const destroyThroughRealC2=(s:ReturnType<typeof setup>)=>{
  for(const a of s.geometry.anchors){
    for(const damage of [100,35]){
      const p=shot(a.x,a.y,damage);
      const event=resolveBlackoutArchitectDevQaCardinalImpact(
        s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p);
      assert.ok(event);
      assert.equal(p.life,0);
    }
    assert.equal(a.health,0);
  }
};
test("C3 initially rejects real core impacts until all four independently hit-tested anchors are destroyed",()=>{
  const s=setup(),p=shot();
  assert.equal(coreHit(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p),null);
  assert.equal(p.life,1600);
  assert.equal(s.boss.health,1920);
  for(const a of s.geometry.anchors.slice(0,3)){
    for(const damage of [100,35]){
      const x=shot(a.x,a.y,damage);
      assert.ok(resolveBlackoutArchitectDevQaCardinalImpact(
        s.owner,s.guard,s.geometry,s.boss,s.enemies,x,x));
    }
  }
  assert.equal(coreHit(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p),null);
  assert.equal(s.boss.health,1920);
});
test("C3 after real C2 destruction consumes the exact shot once and mutates only original Architect core",()=>{
  const s=setup();
  destroyThroughRealC2(s);
  const p=shot();
  const result=coreHit(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p);
  assert.deepEqual(result,{kind:"ARCHITECT_CORE_HIT",damageApplied:20,
    remainingHealth:1900,coreDisabled:false,shotConsumed:true});
  assert.ok(Object.isFrozen(result));
  assert.equal(p.life,0);
  assert.equal(s.boss.health,1900);
  assert.equal(s.geometry.anchors.every(a=>a.health===0),true);
  assert.equal(coreHit(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p),null);
  assert.equal(s.boss.health,1900);
});
test("C3 reaches real zero core HP without legacy cinematic or score and becomes terminal",()=>{
  const s=setup(); destroyThroughRealC2(s);
  s.boss.health=17;
  const p=shot(800,200,25);
  const result=coreHit(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p);
  assert.ok(result);
  assert.equal(result.damageApplied,17);
  assert.equal(result.coreDisabled,true);
  assert.equal(result.remainingHealth,0);
  assert.equal(s.boss.health,0);
  assert.equal(p.life,0);
  assert.equal(s.owner.isCurrent(s.guard,s.boss,s.boss,s.enemies),false,
    "historical engine owner disallows zero-health boss and revokes it");
  assert.equal(coreHit(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p),null);
});
test("C3 rejects a foreign/cloned shot, off-center miss, foreign/stale boss or Titan/NULL",()=>{
  const s=setup(); destroyThroughRealC2(s);
  const p=shot();
  assert.equal(coreHit(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,{...p}),null);
  assert.equal(p.life,1600);
  assert.equal(coreHit(s.owner,s.guard,s.geometry,s.boss,s.enemies,shot(10,10),shot(10,10)),null);
  const miss=shot(800,200+58+4);
  assert.equal(coreHit(s.owner,s.guard,s.geometry,s.boss,s.enemies,miss,miss),null);
  assert.equal(miss.life,1600);
  const titan={...s.boss,type:EnemyType.BOSS_TITAN,
    architectBossIdentity:undefined,bossChassis:"TITAN_CORE" as const,
    infiniteBossIdentity:"NULL_ARCHITECT" as const};
  assert.equal(coreHit(s.owner,s.guard,s.geometry,titan,[titan],p,p),null);
  assert.equal(s.boss.health,1920);
  const next=setup();destroyThroughRealC2(next);
  assert.equal(next.owner.invalidateRun(),null);
  const fresh=shot();
  assert.equal(coreHit(next.owner,next.guard,next.geometry,next.boss,next.enemies,fresh,fresh),null);
  assert.equal(fresh.life,1600);
});
test("C3 malformed/nonpositive/out-of-range damage, position, health and anchor state fail closed",()=>{
  for(const invalid of [0,-4,NaN,Infinity,-Infinity,101]){
    const s=setup(); destroyThroughRealC2(s);
    const p=shot(800,200,invalid);
    assert.equal(coreHit(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p),null);
    assert.equal(s.boss.health,1920);
    assert.equal(p.life,1600);
  }
  for(const payload of [
    {...shot(),x:NaN},{...shot(),y:Infinity},{...shot(),size:0},
    {...shot(),size:17},{...shot(),life:0},{...shot(),fromPlayer:false},
    {...shot(),vx:Infinity}
  ]){
    const s=setup();destroyThroughRealC2(s);
    assert.equal(coreHit(s.owner,s.guard,s.geometry,s.boss,s.enemies,payload,payload),null);
    assert.equal(s.boss.health,1920);
  }
  const corrupt=setup();destroyThroughRealC2(corrupt);
  corrupt.geometry.anchors[0].health=Number.NaN;
  const c=shot();
  assert.equal(coreHit(corrupt.owner,corrupt.guard,corrupt.geometry,corrupt.boss,corrupt.enemies,c,c),null);
  assert.equal(c.life,1600);
});
test("C3 freezes unrelated authorities despite real core HP and terminal QA signal",()=>{
  const a=BLACKOUT_ARCHITECT_DEV_QA_CORE_IMPACT_AUTHORITY;
  assert.ok(Object.isFrozen(a));
  assert.deepEqual(Object.entries(a).filter(([,v])=>v===true).map(([k])=>k),[
    "ownsGuardedQaCoreHitAfterCardinals","ownsRealIndependentCoreHpMutation",
    "ownsSingleQaProjectileConsumption","ownsDevQaTerminalSignal",
  ]);
  assert.ok(Object.entries(a).filter(([,v])=>v!==true).every(([,v])=>v===false));
});
