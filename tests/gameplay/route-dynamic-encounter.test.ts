import test from "node:test";
import assert from "node:assert/strict";
import {
  createRouteDynamicQaState, getRouteWorldRect, projectRouteViewportSpawn,
  shouldKeepRouteEnemy, shouldKeepRouteProjectile, shouldKeepRouteResource,
  ROUTE_QA_ENEMY_CAP, ROUTE_QA_PROJECTILE_CAP, ROUTE_QA_RESOURCE_CAP,
  ROUTE_SPAWN_MARGIN,
} from "../../src/game/routeDynamicEncounter";
import { createPhysicalRouteQaState, stepPhysicalRouteQa } from "../../src/game/physicalRouteQaSimulation";
import type { RouteRunGates } from "../../src/game/worldRouteClock";

const view={width:1100,height:480,zoom:1};
const gates:RouteRunGates={playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false};

test("UX15-C3B1: viewport-relative spawn is outside visible rectangle even at X=100,000",()=>{
  const camera={localX:100_000,localY:170};
  const player={x:100_420,y:410};
  const rect=getRouteWorldRect(camera,view);
  for(const side of ["LEFT","RIGHT","TOP","BOTTOM"] as const){
    const point=projectRouteViewportSpawn(camera,view,player,side,.35);
    assert.ok(point);
    if(side==="RIGHT") assert.equal(point.x,rect.right+ROUTE_SPAWN_MARGIN);
    if(side==="LEFT") assert.equal(point.x,rect.left-ROUTE_SPAWN_MARGIN);
    if(side==="TOP") assert.equal(point.y,rect.top-ROUTE_SPAWN_MARGIN);
    if(side==="BOTTOM") assert.equal(point.y,rect.bottom+ROUTE_SPAWN_MARGIN);
    assert.ok(point.x>1600);
  }
  assert.equal(projectRouteViewportSpawn(camera,view,
    {x:rect.right+ROUTE_SPAWN_MARGIN,y:rect.top+rect.bottom/2}, "RIGHT",.35,1000),null);
  assert.throws(()=>projectRouteViewportSpawn(camera,view,player,"RIGHT",Number.NaN),RangeError);
  assert.throws(()=>getRouteWorldRect(camera,{...view,zoom:0}),RangeError);
});

test("UX15-C3B1: dynamic camera culling respects margins and resource grace beyond 1600",()=>{
  const rect=getRouteWorldRect({localX:10_000,localY:80},view);
  const enemy={x:rect.right+340,y:rect.top+30,isDead:false};
  assert.equal(shouldKeepRouteEnemy(enemy as never,rect),true);
  assert.equal(shouldKeepRouteEnemy({...enemy,x:rect.right+400} as never,rect),false);
  assert.equal(shouldKeepRouteEnemy({...enemy,isDead:true} as never,rect),false);
  const shot={x:rect.left-159,y:rect.top+30,life:1000};
  assert.equal(shouldKeepRouteProjectile(shot as never,rect),true);
  assert.equal(shouldKeepRouteProjectile({...shot,x:rect.left-161} as never,rect),false);
  const drop={x:rect.left-10_000,y:rect.top+30,spawnTime:500};
  assert.equal(shouldKeepRouteResource(drop as never,rect,600),true);
  assert.equal(shouldKeepRouteResource(drop as never,rect,20_000),false);
  assert.throws(()=>shouldKeepRouteResource(drop as never,rect,-1),RangeError);
});

test("UX15-C3B1: enabled encounter truly spawns, moves, fires and hits in route coordinates",()=>{
  let state=createPhysicalRouteQaState(view,"asteria-c3b-test",true);
  assert.ok(state.dynamic);
  assert.equal(state.encounter.enemies.length,0);
  assert.equal(state.encounter.resources.length,0);
  const start=state;
  for(let i=0;i<240;i++) state=stepPhysicalRouteQa(state,50,{x:0,y:0},view,gates);
  assert.ok(state.dynamic);
  assert.ok(state.dynamic.spawned>=6,JSON.stringify(state.dynamic));
  assert.ok(state.dynamic.hits>0,JSON.stringify(state.dynamic));
  assert.ok(state.dynamic.destroyed>0,JSON.stringify(state.dynamic));
  assert.ok(state.player.x!==start.player.x);
  assert.ok(state.camera.localX!==start.camera.localX);
  assert.ok(state.encounter.enemies.every(e=>Number.isFinite(e.x)&&Number.isFinite(e.y)));
  assert.ok(state.encounter.enemies.length<=ROUTE_QA_ENEMY_CAP);
  assert.ok(state.encounter.projectiles.length<=ROUTE_QA_PROJECTILE_CAP);
  assert.ok(state.encounter.resources.length<=ROUTE_QA_RESOURCE_CAP);
  assert.equal(start.dynamic?.spawned,0);
  assert.equal(start.encounter.enemies.length,0);
});

test("UX15-C3B1: deterministic, bounded repeated replay across atomic floating-origin shifts",()=>{
  let a=createPhysicalRouteQaState(view,"asteria-seeded-route",true);
  let b=createPhysicalRouteQaState(view,"asteria-seeded-route",true);
  let shifts=0;
  for(let i=0;i<900;i++){
    const input=i%13<8?{x:1,y:0}:{x:0,y:-.4};
    const nextA=stepPhysicalRouteQa(a,50,input,view,gates);
    const nextB=stepPhysicalRouteQa(b,50,input,view,gates);
    if(nextA.frame.originEpoch!==a.frame.originEpoch) shifts++;
    assert.deepEqual(nextA.dynamic,nextB.dynamic);
    assert.deepEqual(nextA.encounter.enemies.map(e=>[e.id,e.x,e.y,e.health]),
      nextB.encounter.enemies.map(e=>[e.id,e.x,e.y,e.health]));
    assert.ok(nextA.encounter.swarm.length===30);
    assert.ok(nextA.encounter.enemies.length<=ROUTE_QA_ENEMY_CAP);
    assert.ok(nextA.encounter.projectiles.length<=ROUTE_QA_PROJECTILE_CAP);
    a=nextA;b=nextB;
  }
  assert.ok(shifts>=3);
  assert.equal(a.frame.originEpoch,a.rebases);
  assert.ok(a.dynamic!.hits>0);
});

test("UX15-C3B1: pause, hidden, upgrade and reset freeze new encounter authority",()=>{
  let active=createPhysicalRouteQaState(view,undefined,true);
  for(let i=0;i<35;i++) active=stepPhysicalRouteQa(active,50,{x:1,y:0},view,gates);
  assert.ok(active.dynamic!.spawned>0);
  for(const gate of [
    {...gates,paused:true},{...gates,hidden:true},
    {...gates,hitstop:true},{...gates,upgradeOpen:true},
  ]){
    assert.equal(stepPhysicalRouteQa(active,50,{x:1,y:0},view,gate),active);
  }
  const reset=createPhysicalRouteQaState(view,undefined,true);
  assert.equal(reset.frame.originEpoch,0);
  assert.equal(reset.dynamic!.spawned,0);
  assert.equal(reset.encounter.enemies.length,0);
  assert.equal(createPhysicalRouteQaState(view).dynamic,null);
  assert.equal(createRouteDynamicQaState().hits,0);
});
