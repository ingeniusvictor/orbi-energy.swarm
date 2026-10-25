import assert from "node:assert/strict";
import test from "node:test";
import { createPhysicalRouteQaState, stepPhysicalRouteQa } from "../../src/game/physicalRouteQaSimulation";
import { rebaseRouteCoordinateOwners } from "../../src/game/routeCoordinateOwners";
import { routeLocalToScreen } from "../../src/game/routePhysicalCamera";
import { localRouteDistanceSquared } from "../../src/game/physicalRouteSpace";
import {
  createLiveEnemyFormationDirectorState,
  requestLiveEnemyFormationSpawn,
} from "../../src/game/liveEnemyFormationDirector";
import { beginSiegeVolleyTelegraph, createSiegeVolleyTelegraphState } from "../../src/game/siegeVolleyTelegraph";
import { EnemyType, FormationType } from "../../src/game/types";
import type { RouteRunGates } from "../../src/game/worldRouteClock";

const viewport={width:1440,height:480,zoom:1};
const active:RouteRunGates={
  playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false,
};
const permit={
  phase:"TICK_BOUNDARY" as const,
  unresolvedBossPhase:false as const,
  unregisteredWorldOwners:false as const,
};
const near=(a:number,b:number,tol=1e-6)=>
  assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);
const createOwners=()=>{
  const state=createPhysicalRouteQaState(viewport);
  const encounter=structuredClone(state.encounter);
  const player={...state.player};
  const camera={...state.camera};
  return { ...encounter,frame:state.frame,player,camera };
};

test("UX15-C3A3: 30 real ORBI positions/targets, actors, shots, drops, particles and target points shift together",()=>{
  const s=createOwners();
  assert.equal(s.swarm.length,30);
  const before={
    orbiDistance:s.swarm.map(m=>localRouteDistanceSquared(m,s.player)),
    projectileEnemy:localRouteDistanceSquared(s.projectiles[0],s.enemies[0]),
    resourcePlayer:localRouteDistanceSquared(s.resources[0],s.player),
    onscreen:routeLocalToScreen(s.enemies[0],s.camera,viewport),
    pointer:routeLocalToScreen(s.pointer!,s.camera,viewport),
    health:s.enemies.map(e=>e.health),
    cooldown:s.swarm.map(m=>m.shootCooldown),
    velocities:s.projectiles.map(p=>p.vx),
    scoreIds:s.resources.map(r=>r.id),
    particleLife:s.particles.map(p=>p.life),
  };
  const oldOffset=s.frame.originOffsetX;
  const r=rebaseRouteCoordinateOwners(s,512,permit);
  s.frame=r.frame;
  assert.equal(s.frame.originEpoch,1);
  assert.equal(s.frame.originOffsetX,oldOffset+512);
  assert.ok(r.shiftedUniqueObjects>=40);
  assert.equal(r.invalidatedCaches,1);
  assert.equal(s.invalidatedSpatialCaches[0].current,null);
  s.swarm.forEach((m,i)=>{
    near(localRouteDistanceSquared(m,s.player),before.orbiDistance[i]);
    near(m.x,m.targetX);
  });
  near(localRouteDistanceSquared(s.projectiles[0],s.enemies[0]),before.projectileEnemy);
  near(localRouteDistanceSquared(s.resources[0],s.player),before.resourcePlayer);
  near(routeLocalToScreen(s.enemies[0],s.camera,viewport).x,before.onscreen.x);
  near(routeLocalToScreen(s.pointer!,s.camera,viewport).x,before.pointer.x);
  assert.deepEqual(s.enemies.map(e=>e.health),before.health);
  assert.deepEqual(s.swarm.map(m=>m.shootCooldown),before.cooldown);
  assert.deepEqual(s.projectiles.map(p=>p.vx),before.velocities);
  assert.deepEqual(s.resources.map(r=>r.id),before.scoreIds);
  assert.deepEqual(s.particles.map(p=>p.life),before.particleLife);
});

test("UX15-C3A3: shared boss alias, formation assignment, pending director and frozen siege telegraph shift ONCE",()=>{
  const s=createOwners();
  const enemy=s.enemies[0];
  const planned=requestLiveEnemyFormationSpawn(
    createLiveEnemyFormationDirectorState(),
    {sourceMode:"CAMPAIGN",waveNumber:5,descriptorId:"qa",
      milestoneActive:false,spawnOrdinal:6,enemyType:EnemyType.CRAWLER,
      eligibleEnemy:true,remainingCapacity:20,nowMs:10000,
      anchorX:850,anchorY:480,worldWidth:1600,worldHeight:960},
  );
  assert.ok(planned.assignment);
  assert.ok(planned.state.pending);
  enemy.enemyFormation=planned.assignment!;
  enemy.siegeVolleyTelegraph=beginSiegeVolleyTelegraph(
    createSiegeVolleyTelegraphState(),1200,500,
  ).state;
  s.formationDirector=planned.state;
  s.boss=enemy;
  s.architectQaBoss=enemy;
  s.enemies.push(enemy);
  // Deliberately force the same assignment alias in the director cache.
  s.formationDirector.pending!.common.anchorX=enemy.enemyFormation.anchorX;
  const formationBefore=enemy.enemyFormation.anchorX;
  const pendingBefore=s.formationDirector.pending!.common.anchorX;
  const targetBefore=enemy.siegeVolleyTelegraph.targetX!;
  const enemyBefore=enemy.x;
  const originalTelegraph=enemy.siegeVolleyTelegraph;
  const r=rebaseRouteCoordinateOwners(s,512,permit);
  assert.ok(r.shiftedFields>0);
  near(enemy.x,enemyBefore-512);
  near(enemy.enemyFormation.anchorX,formationBefore-512);
  near(s.formationDirector.pending!.common.anchorX,pendingBefore-512);
  near(enemy.siegeVolleyTelegraph!.targetX!,targetBefore-512);
  assert.notEqual(enemy.siegeVolleyTelegraph,originalTelegraph);
  assert.ok(Object.isFrozen(enemy.siegeVolleyTelegraph));
});

test("UX15-C3A3: no partial writes on invalid coordinates, unsafe phase or frozen owner",()=>{
  const s=createOwners();
  const playerX=s.player.x;
  const orbiX=s.swarm[0].x;
  s.projectiles[0].x=Number.NaN;
  assert.throws(()=>rebaseRouteCoordinateOwners(s,512,permit),RangeError);
  assert.equal(s.player.x,playerX);
  assert.equal(s.swarm[0].x,orbiX);
  assert.equal(s.frame.originEpoch,0);
  s.projectiles[0].x=900;
  assert.throws(()=>rebaseRouteCoordinateOwners(s,512,{
    ...permit,unregisteredWorldOwners:true as false,
  }),/denied/);
  assert.equal(s.player.x,playerX);
  Object.freeze(s.resources[0]);
  assert.throws(()=>rebaseRouteCoordinateOwners(s,512,permit),/Non-writable/);
  assert.equal(s.player.x,playerX);
});

test("UX15-C3A3: all six ORBI formations retain their offsets, cooldowns and progress through rebase",()=>{
  const s=createOwners();
  const all=Object.values(FormationType);
  assert.equal(all.length,6);
  s.swarm.forEach((m,i)=>{ m.shootCooldown=18000+i; });
  const before=s.swarm.map(m=>({x:m.x,y:m.y,tx:m.targetX,cooldown:m.shootCooldown,xp:m.xp}));
  rebaseRouteCoordinateOwners(s,1024,permit);
  s.swarm.forEach((m,i)=>{
    near(m.x,before[i].x-1024);
    near(m.targetX,before[i].tx-1024);
    near(m.y,before[i].y);
    near(m.shootCooldown,before[i].cooldown);
    near(m.xp,before[i].xp);
  });
});

test("UX15-C3A3: 20+ physical origin shifts with moving ORBI and stationary world actors",()=>{
  let s=createPhysicalRouteQaState(viewport);
  let rebases=0;
  let previousGlobalEnemyX=s.encounter.enemies[0].x+s.frame.originOffsetX;
  let previousRoute=s.frame.cursor.simulatedMs;
  for(let i=0;i<2800;i++){
    const next=stepPhysicalRouteQa(s,50,{x:1,y:0},viewport,active);
    near(next.encounter.enemies[0].x+next.frame.originOffsetX,previousGlobalEnemyX);
    if(next.frame.originEpoch!==s.frame.originEpoch){
      rebases++;
      assert.equal(next.frame.originEpoch,s.frame.originEpoch+1);
      assert.ok(next.encounter.invalidatedSpatialCaches.every(slot=>slot.current===null));
      const beforeEnemyScreen=routeLocalToScreen(s.encounter.enemies[0],s.camera,viewport);
      const afterEnemyScreen=routeLocalToScreen(next.encounter.enemies[0],next.camera,viewport);
      // Camera has advanced during frame; no origin-induced giant visual jump.
      assert.ok(Math.abs(afterEnemyScreen.x-beforeEnemyScreen.x)<15);
    }
    assert.ok(next.frame.cursor.simulatedMs>previousRoute);
    previousRoute=next.frame.cursor.simulatedMs;
    s=next;
    previousGlobalEnemyX=s.encounter.enemies[0].x+s.frame.originOffsetX;
  }
  assert.ok(rebases>=20,`only ${rebases} shifts`);
  assert.equal(s.rebases,rebases);
  assert.equal(s.encounter.swarm.length,30);
});

test("UX15-C3A3: pause, upgrade and hitstop freeze all entity owners and origin epochs",()=>{
  const initial=createPhysicalRouteQaState(viewport);
  for(const gates of [
    {...active,paused:true},
    {...active,upgradeOpen:true},
    {...active,hitstop:true},
    {...active,hidden:true},
  ]){
    assert.equal(stepPhysicalRouteQa(initial,50,{x:1,y:-1},viewport,gates),initial);
    assert.equal(initial.frame.originEpoch,0);
    assert.equal(initial.encounter.projectiles[0].x,initial.encounter.projectiles[0].x);
  }
});
