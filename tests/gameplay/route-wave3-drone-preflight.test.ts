import test from "node:test";
import assert from "node:assert/strict";
import { EnemyType } from "../../src/game/types";
import { createCampaignRuntimeWaveDescriptor } from "../../src/game/runtimeWaveDescriptor";
import { createPhysicalRouteQaState } from "../../src/game/physicalRouteQaSimulation";
import { rebaseRouteCoordinateOwners } from "../../src/game/routeCoordinateOwners";
import {
  inspectDroneLockAuthority,makeDroneLockPreflightActor,
  projectDroneLockPreflightMotion,projectDroneLockPreflightShot,
  projectDroneLockPreflightProjectileMotion,
  inspectDroneLockPreflightContact,inspectDroneLockPreflightCulling,
  DRONE_PREFLIGHT_FIRE_RADIUS,DRONE_PREFLIGHT_PROJECTILE_DAMAGE,
  DRONE_PREFLIGHT_PROJECTILE_LIFE_MS,
} from "../../src/game/routeWave3DronePreflightQa";

const viewport={width:1100,height:480,zoom:1};
const close=(actual:number,expected:number)=>assert.ok(
  Math.abs(actual-expected)<1e-6,`${actual} !== ${expected}`);

test("C3B10: canonical Drone Lock descriptor is audited but never activated",()=>{
  const d=inspectDroneLockAuthority();
  assert.equal(d.source.campaignWaveId,"drone_lock");
  assert.equal(d.completionPolicy.type,"TIMEBOX");
  assert.equal(d.spawn.enemyBudget,22);
  assert.equal(d.spawn.maxConcurrentEnemies,14);
  assert.equal(d.spawn.spawnIntervalFrames,95);
  assert.deepEqual(d.spawn.enemyComposition,[EnemyType.DRONE,EnemyType.CRAWLER]);
  assert.equal(d.spawn.eliteChance,.1);
  assert.deepEqual(d.modifiers,["DRONE_TARGETING_DENSITY"]);
  assert.deepEqual(d,createCampaignRuntimeWaveDescriptor(3));
});

test("C3B10: DRONE preflight uses the canonical stats and deterministic QA cooldown",()=>{
  const a=makeDroneLockPreflightActor({x:100000,y:240},.5);
  assert.equal(a.type,EnemyType.DRONE);
  close(a.health,20*1.25);
  close(a.size,11);
  close(a.speed,.7*1000/16.6);
  close(a.shootCooldown,(80+40)*.6);
  assert.equal(a.color,"#a855f7");
  assert.equal(a.evolvedSignature,undefined);
  for(const roll of [-1,1,Infinity,NaN])
    assert.throws(()=>makeDroneLockPreflightActor({x:0,y:0},roll),RangeError);
});

test("C3B10: stand-off 120/180 exactly preserves legacy radial and lateral motion",()=>{
  const actor=makeDroneLockPreflightActor({x:1000,y:300});
  const forward=projectDroneLockPreflightMotion(actor,{x:1200,y:300},16.6,0);
  close(forward.x,1000+.7+.8);
  close(forward.y,300);
  const hold=projectDroneLockPreflightMotion(actor,{x:1150,y:300},16.6,0);
  close(hold.x,1000+.8);
  const repel=projectDroneLockPreflightMotion(actor,{x:1100,y:300},16.6,0);
  close(repel.x,1000-.7+.8);
  const slow=projectDroneLockPreflightMotion(actor,{x:1200,y:300},16.6,0,.45);
  close(slow.x,1000+.7*.45+.8);
  assert.deepEqual(projectDroneLockPreflightMotion(actor,{x:1200,y:300},0,1000),
    {x:actor.x,y:actor.y});
  assert.throws(()=>projectDroneLockPreflightMotion(
    {...actor,evolvedVariantId:"LANCE_DRONE"},{x:1200,y:300},16.6,0),RangeError);
  assert.throws(()=>projectDroneLockPreflightMotion(actor,{x:1200,y:300},51,0),RangeError);
});

test("C3B10: plasma has strict original 320 range, neutral 1-shot damage and lifetime",()=>{
  const drone=makeDroneLockPreflightActor({x:500,y:240});
  assert.equal(DRONE_PREFLIGHT_FIRE_RADIUS,320);
  assert.equal(projectDroneLockPreflightShot(drone,{x:820,y:240},0,2),null);
  assert.equal(projectDroneLockPreflightShot(drone,{x:500,y:240},0,2),null);
  assert.equal(projectDroneLockPreflightShot(drone,{x:819,y:240},0,0),null);
  const p=projectDroneLockPreflightShot(drone,{x:819,y:240},0,1)!;
  assert.ok(p);
  close(p.vx,2.2*1000/16.6);
  close(p.vy,0);
  assert.equal(p.damage,DRONE_PREFLIGHT_PROJECTILE_DAMAGE);
  assert.equal(p.damage,12);
  assert.equal(p.fromPlayer,false);
  assert.equal(p.life,DRONE_PREFLIGHT_PROJECTILE_LIFE_MS);
  assert.equal(p.size,3.5);
  assert.equal(p.color,"#f43f5e");
  assert.throws(()=>projectDroneLockPreflightShot({...drone,isBoss:true},
    {x:800,y:240},1,1),RangeError);
  assert.throws(()=>projectDroneLockPreflightShot(drone,
    {x:800,y:240},1,-1),RangeError);
});

test("C3B10: projectile motion, strict 19.5 radius contact and viewport culling remain observation-only",()=>{
  const drone=makeDroneLockPreflightActor({x:500,y:240});
  const p=projectDroneLockPreflightShot(drone,{x:700,y:240},6,1)!;
  const next=projectDroneLockPreflightProjectileMotion(p,16.6);
  close(next.x,502.2);
  close(next.life,2483.4);
  assert.equal(inspectDroneLockPreflightContact(next,{x:next.x+19.5,y:next.y}),false);
  assert.equal(inspectDroneLockPreflightContact(next,{x:next.x+19.4,y:next.y}),true);
  assert.equal(inspectDroneLockPreflightCulling(next,
    {localX:0,localY:0},viewport),"KEEP");
  assert.equal(inspectDroneLockPreflightCulling({...next,x:1300},
    {localX:0,localY:0},viewport),"OUTSIDE_ROUTE_VIEW");
  assert.equal(inspectDroneLockPreflightCulling({...next,life:0},
    {localX:0,localY:0},viewport),"EXPIRED");
  assert.equal(p.life,2500); // no mutation of the supplied sample
  assert.throws(()=>inspectDroneLockPreflightContact({...next,fromPlayer:true},
    {x:500,y:240}),RangeError);
});

test("C3B10: same atomic origin transaction translates candidate DRONE and plasma owners",()=>{
  const state=createPhysicalRouteQaState(viewport,"wave3-preflight",true,true,true,true,
    true,true,true,true,true);
  const drone=makeDroneLockPreflightActor({x:130000,y:240});
  const shot=projectDroneLockPreflightShot(drone,{x:130240,y:240},2,1)!;
  const encounter=structuredClone({...state.encounter,enemies:[drone],projectiles:[shot]});
  const player={x:130240,y:240},camera={localX:129800,localY:0};
  const result=rebaseRouteCoordinateOwners({
    ...encounter,frame:state.frame,player,camera,
  },512,{
    phase:"TICK_BOUNDARY",unresolvedBossPhase:false,unregisteredWorldOwners:false,
  });
  assert.equal(result.frame.originOffsetX,state.frame.originOffsetX+512);
  close(encounter.enemies[0].x,130000-512);
  close(encounter.projectiles[0].x,130000-512);
  close(player.x-encounter.projectiles[0].x,240);
  close(camera.localX,129800-512);
  const next=projectDroneLockPreflightMotion(encounter.enemies[0],player,16.6,1000);
  const before=projectDroneLockPreflightMotion(drone,
    {x:130240,y:240},16.6,1000);
  close(next.x+512,before.x);close(next.y,before.y);
});

test("C3B10: 300 tick deterministic replay over repeated virtual 512-unit rebases",()=>{
  let a=makeDroneLockPreflightActor({x:100000,y:300});
  let b={...a,x:a.x-5120};
  for(let tick=1;tick<=300;tick++){
    const target={x:100250+tick*3,y:290};
    const delta=16.6,now=tick*delta;
    const nextA=projectDroneLockPreflightMotion(a,target,delta,now);
    const nextB=projectDroneLockPreflightMotion(b,
      {...target,x:target.x-5120},delta,now);
    close(nextA.x-nextB.x,5120);close(nextA.y,nextB.y);
    a={...a,...nextA};b={...b,...nextB};
    const sa=projectDroneLockPreflightShot(a,target,tick,2);
    const sb=projectDroneLockPreflightShot(b,{...target,x:target.x-5120},tick,2);
    assert.equal(sa===null,sb===null);
    if(sa&&sb){
      close(sa.x-sb.x,5120);
      close(sa.vx,sb.vx);close(sa.vy,sb.vy);
    }
  }
});

test("C3B10: existing physical Wave2 remains gated and has no living DRONE",()=>{
  const state=createPhysicalRouteQaState(viewport,"no-live-drone",true,true,true,true,
    true,true,true,true,true);
  assert.equal(state.wave2Qa?.status,"PENDING");
  assert.equal(state.encounter.enemies.some(e=>e.type===EnemyType.DRONE),false);
});
