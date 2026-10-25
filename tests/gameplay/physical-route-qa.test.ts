import assert from "node:assert/strict";
import test from "node:test";
import {
  createPhysicalRouteQaState,
  stepPhysicalRouteQa,
  ROUTE_PHYSICAL_QA_MANUAL_SPEED,
  ROUTE_PHYSICAL_QA_VERTICAL_MARGIN,
} from "../../src/game/physicalRouteQaSimulation";
import { routeLocalToScreen } from "../../src/game/routePhysicalCamera";
import { projectRouteDistance } from "../../src/game/worldRouteCore";
import type { RouteRunGates } from "../../src/game/worldRouteClock";
const viewport={width:1440,height:480,zoom:1};
const active:RouteRunGates={
  playing:true,paused:false,hidden:false,modalOpen:false,upgradeOpen:false,hitstop:false,
};
const near=(a:number,b:number,tol=1e-5)=>assert.ok(Math.abs(a-b)<tol,`${a} !== ${b}`);

test("UX15-C3A2: new physics QA starts with a real local ENERGY position and independent camera",()=>{
  const s=createPhysicalRouteQaState(viewport);
  assert.equal(s.player.x,800);
  assert.equal(s.player.y,480);
  near(s.camera.localX,800-1440*.42);
  assert.equal(s.frame.originEpoch,0);
  assert.equal(s.rebases,0);
  assert.equal(s.physicsTicks,0);
  assert.equal(s.frame.cursor.simulatedMs,0);
});

test("UX15-C3A2: real auto-movement changes ENERGY local X and physical camera, not just background",()=>{
  let s=createPhysicalRouteQaState(viewport);
  const initial=s;
  for(let i=0;i<30;i++)s=stepPhysicalRouteQa(s,50,{x:0,y:0},viewport,active);
  near(s.frame.travelAnchorLocalX,878);
  near(s.player.x,878);
  near(projectRouteDistance(s.frame.cursor),78);
  assert.ok(s.camera.localX>initial.camera.localX+55);
  assert.equal(s.physicsTicks,30);
  assert.equal(s.frame.originEpoch,0);
  const before=routeLocalToScreen(initial.player,initial.camera,viewport);
  const after=routeLocalToScreen(s.player,s.camera,viewport);
  near(after.x,before.x,3);
});

test("UX15-C3A2: steering left/right changes real world travel while independent Y stays free",()=>{
  const s=createPhysicalRouteQaState(viewport);
  const right=stepPhysicalRouteQa(s,50,{x:1,y:0},viewport,active);
  const left=stepPhysicalRouteQa(s,50,{x:-1,y:0},viewport,active);
  near(right.player.x-s.player.x,2.6+ROUTE_PHYSICAL_QA_MANUAL_SPEED*.05);
  near(left.player.x-s.player.x,2.6-ROUTE_PHYSICAL_QA_MANUAL_SPEED*.05);
  near(right.frame.travelAnchorLocalX,left.frame.travelAnchorLocalX);
  const up=stepPhysicalRouteQa(s,50,{x:0,y:-1},viewport,active);
  assert.ok(up.player.y<s.player.y);
  const diagonal=stepPhysicalRouteQa(s,50,{x:1,y:1},viewport,active);
  near(Math.hypot(
    diagonal.player.x-s.player.x-2.6,diagonal.player.y-s.player.y,
  ),ROUTE_PHYSICAL_QA_MANUAL_SPEED*.05);
});

test("UX15-C3A2: physical QA pauses completely on modal/hidden/upgrade/hitstop/zero-delta",()=>{
  const state=createPhysicalRouteQaState(viewport);
  for(const blocked of [
    {...active,playing:false},{...active,paused:true},{...active,hidden:true},
    {...active,modalOpen:true},{...active,upgradeOpen:true},{...active,hitstop:true},
  ])assert.equal(stepPhysicalRouteQa(state,50,{x:1,y:1},viewport,blocked),state);
  assert.equal(stepPhysicalRouteQa(state,0,{x:1,y:1},viewport,active),state);
  assert.equal(state.physicsTicks,0);
});

test("UX15-C3A2: 30 real ticks preserve manual Y bounds with no visual rail collision",()=>{
  let s=createPhysicalRouteQaState(viewport);
  for(let i=0;i<400;i++)s=stepPhysicalRouteQa(s,50,{x:0,y:-1},viewport,active);
  assert.equal(s.player.y,ROUTE_PHYSICAL_QA_VERTICAL_MARGIN);
  for(let i=0;i<500;i++)s=stepPhysicalRouteQa(s,50,{x:0,y:1},viewport,active);
  assert.equal(s.player.y,960-ROUTE_PHYSICAL_QA_VERTICAL_MARGIN);
});

test("UX15-C3A2: 20+ legitimate QA rebases keep physical camera/player and route smoothly progressing",()=>{
  let s=createPhysicalRouteQaState(viewport);
  let lastGlobalX=s.player.x+s.frame.originOffsetX;
  let expectedRebases=0;
  for(let i=0;i<2800;i++){
    const next=stepPhysicalRouteQa(s,50,{x:1,y:0},viewport,active);
    const currentGlobalX=next.player.x+next.frame.originOffsetX;
    assert.ok(currentGlobalX>lastGlobalX);
    near(currentGlobalX-lastGlobalX,2.6+ROUTE_PHYSICAL_QA_MANUAL_SPEED*.05);
    const screen=routeLocalToScreen(next.player,next.camera,viewport);
    if(next.frame.originEpoch!==s.frame.originEpoch){
      assert.equal(next.frame.originEpoch,s.frame.originEpoch+1);
      assert.ok(Math.abs(next.player.x-800)<768);
      assert.ok(Number.isFinite(screen.x));
      expectedRebases++;
    }
    if(i>80)assert.ok(screen.x>0&&screen.x<viewport.width);
    lastGlobalX=currentGlobalX;
    s=next;
  }
  assert.ok(expectedRebases>=20);
  assert.equal(s.rebases,expectedRebases);
  assert.equal(s.frame.originEpoch,s.rebases);
  assert.ok(projectRouteDistance(s.frame.cursor)>7000);
  assert.ok(s.frame.cursor.segmentOrdinal>=6);
  const reset=createPhysicalRouteQaState(viewport);
  assert.equal(reset.frame.originEpoch,0);
  assert.equal(reset.player.x,800);
});

test("UX15-C3A2: invalid input and bad viewports do not corrupt physical QA",()=>{
  const s=createPhysicalRouteQaState(viewport);
  assert.throws(()=>createPhysicalRouteQaState({...viewport,zoom:0}),RangeError);
  assert.throws(()=>stepPhysicalRouteQa(s,50,{x:NaN,y:0},viewport,active),RangeError);
  assert.throws(()=>stepPhysicalRouteQa(s,-1,{x:0,y:0},viewport,active),RangeError);
  assert.throws(()=>stepPhysicalRouteQa(s,30,{x:1,y:0},{...viewport,zoom:1.3},active),RangeError);
});
