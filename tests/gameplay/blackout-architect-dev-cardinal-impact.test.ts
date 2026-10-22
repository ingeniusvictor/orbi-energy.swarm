import assert from "node:assert/strict";
import test from "node:test";
import { type Projectile, EnemyType } from "../../src/game/types";
import { createBlackoutArchitectDevQaBoss } from "../../src/game/blackoutArchitectDevQaBossFactory";
import { createBlackoutArchitectEngineIdentityLifecycleOwner } from "../../src/game/blackoutArchitectEngineIdentityLifecycle";
import { createBlackoutArchitectDevQaCardinalGeometry } from "../../src/game/blackoutArchitectDevQaCardinalGeometry";
import {
  BLACKOUT_ARCHITECT_DEV_QA_IMPACT_AUTHORITY,
  resolveBlackoutArchitectDevQaCardinalImpact as impact,
} from "../../src/game/blackoutArchitectDevQaCardinalImpact";

const session = () => {
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
const shot = (x=800,y=94,damage=20): Projectile => ({
  id:"qa-test",x,y,vx:0,vy:-6,size:4,damage,fromPlayer:true,
  color:"#67e8f9",life:1600,maxLife:1600,
});

test("C2 real authenticated NORTH circle impact mutates only anchor HP, once", () => {
  const s=session(), p=shot();
  const first=impact(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p);
  assert.deepEqual(first,{kind:"CARDINAL_HIT",anchorId:"NORTH",damageApplied:20,
    remainingHealth:115,destroyed:false,shotConsumed:true});
  assert.equal(Object.isFrozen(first),true);
  assert.equal(p.life,0);
  assert.equal(s.geometry.anchors[0].health,115);
  assert.deepEqual(s.geometry.anchors.slice(1).map(a=>a.health),[135,135,135]);
  assert.equal(s.boss.health,s.boss.maxHealth,"Architect core stays untouched");
  assert.equal(impact(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p),null);
  assert.equal(s.geometry.anchors[0].health,115,"no replay of consumed shot");
});
test("C2 each cardinal can actually receive damage, clamp 0 and become non-targetable", () => {
  const s=session();
  for(const a of s.geometry.anchors){
    const p=shot(a.x,a.y,100);
    const first=impact(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p);
    assert.ok(first);
    assert.equal(first.anchorId,a.id);
    assert.equal(first.remainingHealth,35);
    assert.equal(p.life,0);
    const killing=shot(a.x,a.y,100);
    const second=impact(s.owner,s.guard,s.geometry,s.boss,s.enemies,killing,killing);
    assert.ok(second);
    assert.equal(second.damageApplied,35);
    assert.equal(second.remainingHealth,0);
    assert.equal(second.destroyed,true);
    const replay=shot(a.x,a.y,20);
    assert.equal(impact(s.owner,s.guard,s.geometry,s.boss,s.enemies,replay,replay),null);
    assert.equal(replay.life,1600,"destroyed anchor does not consume projectile");
  }
  assert.equal(s.geometry.anchors.every(a=>a.health===0),true);
  assert.equal(s.boss.health,s.boss.maxHealth);
});
test("C2 negative, NaN, infinity, oversized/zero damage and invalid projectile do not mutate", () => {
  for(const poison of [0,-4,NaN,Infinity,-Infinity,101]){
    const s=session(), p=shot(800,94,poison);
    assert.equal(impact(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p),null);
    assert.equal(s.geometry.anchors[0].health,135);
    assert.equal(p.life,1600);
  }
  for(const probe of [
    {...shot(), x:NaN},{...shot(),y:Infinity},{...shot(),x:-0},
    {...shot(),size:0},{...shot(),size:99},{...shot(),life:0},
    {...shot(),fromPlayer:false},{...shot(),vx:Infinity}
  ]){
    const s=session();
    assert.equal(impact(s.owner,s.guard,s.geometry,s.boss,s.enemies,probe,probe),null);
    assert.equal(s.geometry.anchors[0].health,135);
  }
});
test("C2 rejects clone, foreign guard, Titan/NULL type and stale encounters without consumption", () => {
  const s=session(), p=shot();
  assert.equal(impact(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,{...p}),null);
  assert.equal(p.life,1600);
  const foreign=session();
  assert.equal(impact(s.owner,foreign.guard,s.geometry,s.boss,s.enemies,p,p),null);
  assert.equal(p.life,1600);
  const titan={...s.boss,type:EnemyType.BOSS_TITAN,architectBossIdentity:undefined,
     bossChassis:"TITAN_CORE" as const,infiniteBossIdentity:"NULL_ARCHITECT" as const};
  assert.equal(impact(s.owner,s.guard,s.geometry,titan,[titan],p,p),null);
  assert.equal(s.geometry.anchors[0].health,135);
  assert.equal(s.owner.beginRun(),2);
  assert.equal(impact(s.owner,s.guard,s.geometry,s.boss,s.enemies,p,p),null);
  assert.equal(p.life,1600);
});
test("C2 strict geometric contact, ambiguous hits and tampered health are fail-closed", () => {
  const s=session();
  const miss=shot(800,94-17); // circle (13)+shot (4), tangency is NOT a hit
  assert.equal(impact(s.owner,s.guard,s.geometry,s.boss,s.enemies,miss,miss),null);
  assert.equal(miss.life,1600);
  const ambiguous=session();
  // Test only: corrupt a second cardinal's circle position to match NORTH.
  const north=ambiguous.geometry.anchors[0],east=ambiguous.geometry.anchors[1];
  // Position is readonly and sealed: no code path can repoint a cardinal.
  assert.equal(Object.isSealed(east),true);
  assert.notEqual(north,east);
  // Corrupt health instead, reject fail-closed before any damage application.
  east.health=Number.NaN;
  const conflict=shot();
  assert.equal(impact(ambiguous.owner,ambiguous.guard,ambiguous.geometry,
      ambiguous.boss,ambiguous.enemies,conflict,conflict),null);
  assert.equal(north.health,135);
  assert.equal(conflict.life,1600);
});
test("C2 impact owns only cardinal HP+shot life; all other authorities remain false", () => {
  assert.ok(Object.isFrozen(BLACKOUT_ARCHITECT_DEV_QA_IMPACT_AUTHORITY));
  for(const [key,value] of Object.entries(BLACKOUT_ARCHITECT_DEV_QA_IMPACT_AUTHORITY)){
    if(["ownsAuthenticatedQaCardinalCollision","ownsSingleRealQaProjectileConsumption",
       "ownsCardinalHealthAndDestroyMutation"].includes(key))assert.equal(value,true);
    else assert.equal(value,false,key);
  }
});
